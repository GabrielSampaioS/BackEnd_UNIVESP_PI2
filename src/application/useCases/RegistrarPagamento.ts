import { EventRepository } from "../../domain/repositories/EventRepository"
import { EventTypes } from "../../domain/events/EventTypes"

import { AppError } from "../../shared/errors/AppError";

export class RegistrarPagamento {
    constructor(private repository: EventRepository) { }

    async execute(aggregate_id: String, valor: number): Promise<void> {

        // Validação de valor
        if (!valor || valor <= 0) {

            throw new AppError(
                "Valor inválido",
                400,
                "INVALID_DATA"
            );

        }

        // Verifica se cliente existe (codigo dupolicado com o usercase Registrardivida)
        const cliente = await this.repository.findByAggregateId(
            aggregate_id
        );

        if (!cliente || cliente.length === 0) {

            throw new AppError(
                "Cliente não encontrado",
                404,
                "CLIENT_NOT_FOUND"
            );

        }

        // Criação do evento

        const event = {
            aggregate_id,
            event_type: EventTypes.PAGAMENTO_EFETUADO,
            event_data: { valor }
        }

        try {

            await this.repository.save(event);

        } catch (error) {

            throw new AppError(
                "Erro ao registrar dívida",
                500,
                "INTERNAL_SERVER_ERROR"
            );

        }

    }


}