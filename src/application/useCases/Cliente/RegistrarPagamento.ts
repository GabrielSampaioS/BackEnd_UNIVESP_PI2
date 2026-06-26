import { EventStore } from "../../../domain/repositories/EventRepository"
import { Cliente } from "../../../domain/entities/Cliente";
import { FormaPagamento } from "../../../domain/enums/FormaPagamento";
import { DomainEvent } from "../../../domain/events/DomainEvent";
import { ClienteEventTypes } from "../../../domain/events/EventTypes";
import { NotFoundError } from "../../../middlewares/MiddlewareError";

export class RegistrarPagamento {
    constructor(private repository: EventStore) { }

    async execute(
        aggregate_id: string,
        valor: number,
        forma_pagamento: FormaPagamento
    ): Promise<void> {

        const events = await this.repository.findByAggregateId(aggregate_id);

        if (!events || events.length === 0) {
            throw new NotFoundError(
                "Cliente não localizado",
                "CLIENT_NOT_FOUND"
            );
        }

        const domainEvent = Cliente.registrarPagamento(valor, forma_pagamento);

        const event: DomainEvent = {
            aggregate_id,
            event_type: ClienteEventTypes.PAGAMENTO_EFETUADO,
            event_data: {
                ...domainEvent
            },
            created_at: new Date()
        };

        await this.repository.save(event);
    }

}