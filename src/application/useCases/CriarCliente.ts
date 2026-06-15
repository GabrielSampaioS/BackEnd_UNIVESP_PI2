import { v4 as uuidv4 } from "uuid"
import { EventRepository } from "../../domain/repositories/EventRepository"
import { EventTypes } from "../../domain/events/EventTypes"
import { Cliente } from "../../domain/entities/Cliente"
import { EmailService } from "../../domain/repositories/EmailService"
import { CriarClienteDTO } from "../dto/CriarClienteDTO"

export class CriarCliente {

    constructor(private repository: EventRepository, private emailService: EmailService) { }

    async execute(data: CriarClienteDTO) {

        const dadosLimpos = Cliente.sanitizarCadastro(data);
        Cliente.validarCadastro(dadosLimpos)

        const aggregate_id = uuidv4()

        const event = {
            aggregate_id,
            event_type: EventTypes.CLIENTE_CADASTRADO,
            event_data: {
                nome: dadosLimpos.nome,
                sobrenome: dadosLimpos.sobrenome,
                telefone: dadosLimpos.telefone,
                cpf: dadosLimpos.cpf,
                email: dadosLimpos.email
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

        return {id: aggregate_id, cliente: dadosLimpos}
    }


}