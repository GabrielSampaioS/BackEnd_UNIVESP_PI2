import { ClienteEventTypes, UserEventTypes } from "./EventTypes";

export type DomainEvent =
    | {
        aggregate_id: string,
        event_type: ClienteEventTypes.CLIENTE_CADASTRADO;
        event_data: {
            nome: string;
            sobrenome: string;
            telefone: string;
            cpf: string;
            email: string;
        },
        created_at: Date
    }

    | {
        aggregate_id: string,
        event_type: ClienteEventTypes.DIVIDA_REGISTRADA;
        event_data: {
            valor: number;
            descricao: string;
        },
        created_at: Date
    }
    | {
        aggregate_id: string,
        event_type: ClienteEventTypes.PAGAMENTO_EFETUADO;
        event_data: {
            valor_abatido: number;
            forma_pagamento: string;
            taxa_percentual: number;
            valor_taxa: number;
            valor_pago_cliente: number;
        };
        created_at: Date
    }
    | {
        aggregate_id: string,
        event_type: UserEventTypes.USUARIO_CADASTRADO;
        event_data: {
            nome: string;
            email: string;
            senhaHash: string;
        },
        created_at: Date
    }


