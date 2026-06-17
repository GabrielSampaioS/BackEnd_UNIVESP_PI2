import { CriarClienteDTO } from "../../application/dto/CriarClienteDTO";
import { AppError } from "../../shared/errors/AppError";
import { FormaPagamento } from "../enums/FormaPagamento";
import { DomainEvent } from "../events/DomainEvent";
import { EventTypes } from "../events/EventTypes";
import { TaxaStrategyFactory } from "../strategies/TaxaStrategyFactory";

export class Cliente {

    private constructor() { }

    nome = "";
    sobrenome = "";
    telefone = "";
    cpf = "";
    email = "";

    private events: DomainEvent[] = [];

    static rehydrate(events: DomainEvent[]): Cliente {

        const cliente = new Cliente();

        cliente.events = events;

        for (const event of events) {

            switch (event.event_type) {

                case EventTypes.CLIENTE_CADASTRADO:

                    cliente.nome = event.event_data.nome;
                    cliente.sobrenome = event.event_data.sobrenome;
                    cliente.telefone = event.event_data.telefone;
                    cliente.cpf = event.event_data.cpf;
                    cliente.email = event.event_data.email;

                    break;
            }
        }

        return cliente;
    }

    static sanitizarCadastro(data: CriarClienteDTO): CriarClienteDTO {
        return {
            nome: data.nome.trim(),
            sobrenome: data.sobrenome.trim(),
            telefone: data.telefone.trim(),
            cpf: data.cpf.trim(),
            email: data.email.trim()
        }
    }

    static validarCadastro(data: CriarClienteDTO): void {

        const camposObrigatorios: (keyof CriarClienteDTO)[] = [
            "nome",
            "sobrenome",
            "telefone",
            "cpf",
            "email"
        ];

        for (const campo of camposObrigatorios) {
            if (!data[campo]) {
                throw new AppError(
                    `Campo ${campo} é obrigatório`,
                    400,
                    "INVALID_DATA"
                );
            }

        }
    }

    getSaldo(): number {

        let saldo = 0;

        for (const event of this.events) {

            if (
                event.event_type ===
                EventTypes.DIVIDA_REGISTRADA
            ) {
                saldo += Number(event.event_data.valor);
            }

            if (
                event.event_type ===
                EventTypes.PAGAMENTO_EFETUADO
            ) {
                saldo -= Number(event.event_data.valor_abatido);
            }
        }

        return saldo;
    }

    //TODO: registrarDivida e registrarPagamento deve ser uma função apenas 
    registrarDivida(valor: number, descricao: string = "") {

        if (!valor || valor <= 0) {

            throw new AppError(
                "Valor inválido",
                400,
                "INVALID_DATA"
            );

        }

        return {
            event_type: EventTypes.DIVIDA_REGISTRADA,
            event_data: {
                valor: valor,
                descricao: descricao
            }
        };
    }

    registrarPagamento(
        valor: number,
        forma_pagamento: FormaPagamento
    ) {

        // Validar valor
        if (!valor || valor <= 0) {
            throw new AppError(
                "Valor inválido",
                400,
                "INVALID_DATA"
            );
        }

        // Validar forma de pagamento
        if (!Object.values(FormaPagamento).includes(forma_pagamento)) {
            throw new AppError(
                "Forma de pagamento inválida",
                400,
                "INVALID_DATA"
            );
        }

        const taxaStrategy = TaxaStrategyFactory.criar(forma_pagamento)
        const taxaPercentual = taxaStrategy.obterTaxaPercentual();
        const valor_taxa = taxaStrategy.calcularTaxa(valor)
        const valorPagoCliente = taxaStrategy.calcularValorTotal(valor);

        return {
            valor_abatido: valor,
            forma_pagamento: forma_pagamento,
            taxa_percentual: taxaPercentual,
            valor_taxa: valor_taxa,
            valor_pago_cliente: valorPagoCliente
        }

    }
}