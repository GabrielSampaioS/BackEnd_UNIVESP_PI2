import { EventRepository } from "../../domain/repositories/EventRepository"
import { EventTypes } from "../../domain/events/EventTypes"
import { AppError } from "../../shared/errors/AppError";
import { Cliente } from "../../domain/entities/Cliente";

export class RegistrarPagamento {
    constructor(private repository: EventRepository) { }

    async execute(aggregate_id: String, valor: number): Promise<void> {

        const events = await this.repository.findByAggregateId(aggregate_id);

        if (!events || events.length === 0) {
            throw new AppError(
                "Cliente não encontrado",
                404,
                "CLIENT_NOT_FOUND"
            );
        }

        const cliente =
            Cliente.rehydrate(events);

        const event =
            cliente.registrarPagamento(valor);

        try {

            await this.repository.save({
                aggregate_id,
                ...event,
                created_at: new Date()
            });

        } catch {

            throw new AppError(
                "Erro ao registrar dívida",
                500,
                "INTERNAL_SERVER_ERROR"
            );

        }

    }

}