import { v4 as uuidv4 } from "uuid"
import { EventRepository } from "../../domain/repositories/EventRepository"
import { EventTypes } from "../../domain/events/EventTypes"

export class CriarCliente {
    constructor(private repository: EventRepository) { }

    async execute(data: any) {

        const camposObrigatorios = [
            "nome", "sobrenome", "telefone", "cpf", "email"
        ]

        for (const campo of camposObrigatorios) {
            data[campo] = data[campo].trim()

            if (!data[campo]) {
                throw new Error('Dados inválidos para o cadastro do cliente')
            }
        }
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