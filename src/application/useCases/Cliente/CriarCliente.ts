import { v4 as uuidv4 } from "uuid"
import { EventStore } from "../../../domain/repositories/EventRepository"
import { ClienteEventTypes } from "../../../domain/events/EventTypes"
import { EmailService } from "../../../domain/repositories/EmailService"
import { CriarClienteDTO } from "../../dto/CriarClienteDTO"
import { DomainEvent } from "../../../domain/events/DomainEvent"
import { Sanitizer } from "../../../domain/sanitizers/Sanitizer"
import { ClienteValidador } from "../../../domain/validators/ClienteValidador"

export class CriarCliente {

    constructor(private repository: EventStore, private emailService: EmailService) { }

    async execute(data: CriarClienteDTO) {
        const dadosLimpos = Sanitizer.sanitizarCadastroCliente(data);
        ClienteValidador.validarCadastro(dadosLimpos);

        const aggregate_id = uuidv4();

        const event: DomainEvent = {
            aggregate_id,
            event_type: ClienteEventTypes.CLIENTE_CADASTRADO,
            event_data: {
                nome: dadosLimpos.nome,
                sobrenome: dadosLimpos.sobrenome,
                telefone: dadosLimpos.telefone,
                cpf: dadosLimpos.cpf,
                email: dadosLimpos.email
            },
            created_at: new Date()
        };

        await this.repository.save(event);

        this.emailService.sendEmail({
            remetente: "no-reply@mercado.com",
            destinatario: event.event_data.email,
            assunto: "Usuário cadastrado",
            mensagem: "Recebemos sua solicitação de cadastro"
        });

        return {
            id: aggregate_id,
            cliente: dadosLimpos
        };
    }
}