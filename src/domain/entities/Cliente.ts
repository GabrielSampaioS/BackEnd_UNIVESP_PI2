import { FormaPagamento } from "../enums/FormaPagamento";
import { DomainEvent } from "../events/DomainEvent";
import { ClienteEventTypes } from "../events/EventTypes";
import { TaxaStrategyFactory } from "../strategies/TaxaStrategyFactory";
import { ClienteValidador } from "../validators/ClienteValidador";

export class Cliente {

    private constructor() { }

    nome = "";
    sobrenome = "";
    telefone = "";
    cpf = "";
    email = "";

    private readonly events: DomainEvent[] = [];

    static rehydrate(events: DomainEvent[]): Cliente {

        const cliente = new Cliente();

        cliente.events.push(...events)

        for (const event of events) {

            switch (event.event_type) {

                case ClienteEventTypes.CLIENTE_CADASTRADO:

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

    static registrarDivida(valor: number, descricao: string = "") {

        ClienteValidador.validarDivida(valor)

        return {
            event_type: ClienteEventTypes.DIVIDA_REGISTRADA,
            event_data: {
                valor: valor,
                descricao: descricao
            }
        };
    }

    static registrarPagamento(valor: number, forma_pagamento: FormaPagamento) {

        ClienteValidador.validarPagamento(valor, forma_pagamento)


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

    getSaldo(): number {
        let saldo = 0;

        for (const event of this.events) {

            if (
                event.event_type ===
                ClienteEventTypes.DIVIDA_REGISTRADA
            ) {
                saldo += Number(event.event_data.valor);
            }

            if (
                event.event_type ===
                ClienteEventTypes.PAGAMENTO_EFETUADO
            ) {
                saldo -= Number(event.event_data.valor_abatido);
            }
        }

        return saldo;
    }

}



