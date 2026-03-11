import { v4 as uuidv4 } from "uuid"
import { EventRepository } from "../../domain/repositories/EventRepository"
import { EventTypes } from "../../domain/events/EventTypes"

export class CriarCliente{
    constructor(private repository: EventRepository) {}

    async execute(data: any){
        const aggregate_id = uuidv4()

        const event = {
            aggregate_id,
            EventTypes: EventTypes.CLIENTE_CADASTRADO,
            event_data: data
        }

        await this.repository.save(event)

        return aggregate_id
    }
}