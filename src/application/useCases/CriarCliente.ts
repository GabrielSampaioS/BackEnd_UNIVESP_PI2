import { v4 as uuidv4 } from "uuid"
import { EventStore } from "../../domain/repositories/EventRepository"
import { EventTypes } from "../../domain/events/EventTypes"
import { Cliente } from "../../domain/entities/Cliente"
import { EmailService } from "../../domain/repositories/EmailService"
import { CriarClienteDTO } from "../dto/CriarClienteDTO"
import { DomainEvent } from "../../domain/events/DomainEvent"
import { AppError } from "../../shared/errors/AppError"

export class CriarCliente {

    constructor(private repository: EventStore, private emailService: EmailService) { }

    async execute(data: CriarClienteDTO) {
        try {
            const dadosLimpos = Cliente.sanitizarCadastro(data);
            Cliente.validarCadastro(dadosLimpos);

            const aggregate_id = uuidv4();

            const event: DomainEvent = {
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

        } catch(error) {
            if (error instanceof AppError) {
                throw error;
            } 
            throw new AppError(
                "Erro ao criar cliente",
                500,
                "INTERNAL_SERVER_ERROR"
            );
        }
    }
}