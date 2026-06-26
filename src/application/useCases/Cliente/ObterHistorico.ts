import { EventReader } from "../../../domain/repositories/EventRepository";
import { Cliente } from "../../../domain/entities/Cliente";
import { NotFoundError } from "../../../middlewares/MiddlewareError";

export class ObterHistorico {

    constructor(private repository: EventReader) { }

    async execute(aggregate_id: string) {
        const eventos = await this.repository.findByAggregateId(aggregate_id);

        if (!eventos || eventos.length === 0) {
            throw new NotFoundError(
                "Cliente não localizado",
                "CLIENT_NOT_FOUND"
            );
        }

        const cliente = Cliente.rehydrate(eventos);

        return {
            historico: eventos,
            saldo: cliente.getSaldo()
        };

    }
}