import { v4 as uuidv4 } from "uuid"
import { EventRepository } from "../../domain/repositories/EventRepository"
import { EventTypes } from "../../domain/events/EventTypes"
import { Cliente } from "../../domain/entities/Cliente"
import { EmailService } from "../../domain/repositories/EmailService"

export class CriarCliente {
    
    constructor(private repository: EventRepository, private emailService: EmailService) {}

    async execute(data: any) {

        Cliente.validarCadastro(data)
        const aggregate_id = uuidv4()

        const event = {
            aggregate_id,
            event_type: EventTypes.CLIENTE_CADASTRADO,
            event_data: {
                nome: data.nome,
                sobrenome: data.sobrenome,
                telefone: data.telefone ,
                cpf: data.cpf,
                email: data.email
            },
            created_at: new Date()
        }

        await this.repository.save(event)

        //n precisa ser await
        this.emailService.sendEmail({
            remetente: "no-reply@mercado.com",
            destinatario: event.event_data.nome,
            assunto: "Usuário cadastrado",
            mensagem: "Recebemos a solocitação de cadastro para o seu usuário"
        })

        return aggregate_id
    }


}