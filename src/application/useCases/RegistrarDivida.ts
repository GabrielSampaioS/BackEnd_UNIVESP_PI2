import { EventStore } from "../../domain/repositories/EventRepository";
import { Cliente } from "../../domain/entities/Cliente";
import { AppError } from "../../shared/errors/AppError";
import { DomainEvent } from "../../domain/events/DomainEvent";
import { EventTypes } from "../../domain/events/EventTypes";

export class RegistrarDivida {

  constructor(private repository: EventStore) { }

  async execute(aggregate_id: string, valor: number, descricao: string): Promise<void> {
    try {
      const events = await this.repository.findByAggregateId(aggregate_id);

      if (!events || events.length === 0) {
        throw new AppError(
          "Cliente não encontrado",
          404,
          "CLIENT_NOT_FOUND"
        );
      }

      const cliente = Cliente.rehydrate(events);

      cliente.registrarDivida(valor, descricao);

      const event: DomainEvent = {
        aggregate_id,
        event_type: EventTypes.DIVIDA_REGISTRADA,
        event_data: {
          valor,
          descricao
        },
        created_at: new Date()
      };

      await this.repository.save(event);

    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        "Erro ao registrar dívida",
        500,
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}