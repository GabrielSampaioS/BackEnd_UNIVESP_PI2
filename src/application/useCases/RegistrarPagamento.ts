import { EventRepository } from "../../domain/repositories/EventRepository"
import { EventTypes } from "../../domain/events/EventTypes"

export class RegistrarPagamento  {
    constructor(private repository: EventRepository) {}

    async execute(aggregate_id: String, valor: number){
        const event = {
            aggregate_id,
            event_type: EventTypes.PAGAMENTO_EFETUADO,
            event_data: {valor}
        }

        await this.repository.save(event)
    }
}