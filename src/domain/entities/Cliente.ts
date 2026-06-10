import { AppError } from "../../shared/errors/AppError";
import { EventTypes } from "../events/EventTypes";

export class Cliente {

    private constructor() { }

    nome = "";
    sobrenome = "";
    telefone = "";
    cpf = "";
    email = "";

    private events: any[] = [];

    static rehydrate(events: any[]): Cliente {

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
    
    static validarCadastro(data: any) {

    const camposObrigatorios = [
        "nome",
        "sobrenome",
        "telefone",
        "cpf",
        "email"
    ];

    for (const campo of camposObrigatorios) {

        if (
            !data[campo] ||
            typeof data[campo] !== "string" ||
            !data[campo].trim()
        ) {
            throw new AppError(
                `Campo ${campo} é obrigatório`,
                400,
                "INVALID_DATA"
            );
        }

        data[campo] = data[campo].trim();
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
                saldo -= Number(event.event_data.valor);
            }
        }

        return saldo;
    }

    //TODO: registrarDivida e registrarPagamento deve ser uma função apenas 
    registrarDivida(valor: number) {

        if (!valor || valor <= 0) {

            throw new AppError(
                "Valor inválido",
                400,
                "INVALID_DATA"
            );

        }

        //adicionar evento na variavel private events
        this.addEvent({
            event_type: EventTypes.DIVIDA_REGISTRADA, 
            event_data: {
                valor
            }
        });


        return {
            event_type: EventTypes.DIVIDA_REGISTRADA,
            event_data: {
                valor
            }
        };
    }

    registrarPagamento(valor: number) {

        if (!valor || valor <= 0) {

            throw new AppError(
                "Valor inválido",
                400,
                "INVALID_DATA"
            );

        }


        //adicionar evento na variavel private events
        this.addEvent({
            event_type: EventTypes.PAGAMENTO_EFETUADO, 
            event_data: {
                valor
            }
        });

        return {
            event_type: EventTypes.PAGAMENTO_EFETUADO,
            event_data: {
                valor
            }
        };
    }

    private addEvent(event: any) {

        this.events.push(event);}

}