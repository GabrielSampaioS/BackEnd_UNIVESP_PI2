import { EventRepository } from "../../domain/repositories/EventRepository"
import { EventTypes } from "../../domain/events/EventTypes"

export class RegistrarDivida {
    constructor(private repository: EventRepository) {}

    async execute(aggregate_id: String, valor: number){
        const event = {
            aggregate_id,
            EventTypes: EventTypes.DIVIDA_REGISTRADA,
            event_data: {valor}
        }

        await this.repository.save(event)
    }
}