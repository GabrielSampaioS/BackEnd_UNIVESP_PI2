import { EventReader } from "../../domain/repositories/EventRepository";
import { Cliente } from "../../domain/entities/Cliente";
import { AppError } from "../../shared/errors/AppError";

export class ObterHistorico {

    constructor(private repository: EventReader) { }

    async execute(aggregate_id: string) {
        try {
            const eventos = await this.repository.findByAggregateId(aggregate_id);

            if (!eventos || eventos.length === 0) {
                throw new AppError(
                    "Cliente não localizado",
                    404,
                    "CLIENT_NOT_FOUND"
                );
            }

            const cliente = Cliente.rehydrate(eventos);

            return {
                historico: eventos,
                saldo: cliente.getSaldo()
            };

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(
                "Erro ao buscar histórico",
                500,
                "INTERNAL_SERVER_ERROR"
            );
        }
    }
}