import { v4 as uuidv4 } from "uuid"
import { EventRepository } from "../../domain/repositories/EventRepository"
import { EventTypes } from "../../domain/events/EventTypes"

export class CriarCliente{
    constructor(private repository: EventRepository) {}

    async execute(data: any){
        const aggregate_id = uuidv4()

        const event = {
            aggregate_id,
            event_type: EventTypes.CLIENTE_CADASTRADO,
            event_data: {
                nome: data.nome,
                sobrenome: data.sobrenome,
                telefone: data.telefone,
                cpf: data.cpf,
                email: data.email
            }
        }

        await this.repository.save(event)

        return aggregate_id
    }
}