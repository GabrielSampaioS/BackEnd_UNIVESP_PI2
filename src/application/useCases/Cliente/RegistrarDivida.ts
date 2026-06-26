import { EventStore } from "../../../domain/repositories/EventRepository";
import { Cliente } from "../../../domain/entities/Cliente";
import { DomainEvent } from "../../../domain/events/DomainEvent";
import { ClienteEventTypes } from "../../../domain/events/EventTypes";
import { NotFoundError } from "../../../middlewares/MiddlewareError";

export class RegistrarDivida {

  constructor(private repository: EventStore) { }

  async execute(aggregate_id: string, valor: number, descricao: string): Promise<void> {
    const events = await this.repository.findByAggregateId(aggregate_id);

    if (!events || events.length === 0) {
      throw new NotFoundError(
        "Cliente não localizado",
        "CLIENT_NOT_FOUND"
      );
    }

    //const cliente = Cliente.rehydrate(events);

    Cliente.registrarDivida(valor, descricao);

    const event: DomainEvent = {
      aggregate_id,
      event_type: ClienteEventTypes.DIVIDA_REGISTRADA,
      event_data: {
        valor,
        descricao
      },
      created_at: new Date()
    };

    await this.repository.save(event);
  }
}