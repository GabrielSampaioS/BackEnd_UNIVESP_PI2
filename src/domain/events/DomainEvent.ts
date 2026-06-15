import { EventTypes } from "./EventTypes";

export type DomainEvent =
    | {
        aggregate_id: string,
        event_type: EventTypes.CLIENTE_CADASTRADO;
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
        event_type: EventTypes.DIVIDA_REGISTRADA;
        event_data: {
            valor: number;
            descricao: string;
        },
        created_at: Date
    }
    | {
        aggregate_id: string,
        event_type: EventTypes.PAGAMENTO_EFETUADO;
        event_data: {
            valor_abatido: number;
            forma_pagamento: string;
            taxa_percentual: number;
            valor_taxa: number;
            valor_pago_cliente: number;
        };
        created_at: Date
    };


