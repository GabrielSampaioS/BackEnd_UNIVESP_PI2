import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { UseDTO } from "../../dto/UserDTO";
import { Sanitizer } from "../../../domain/sanitizers/Sanitizer"
import { v4 as uuidv4 } from "uuid"
import { UserEventTypes } from "../../../domain/events/EventTypes";
import { DomainEvent } from "../../../domain/events/DomainEvent";

export class RegisterUser {

    constructor(private userRepository: UserRepository) { }

    async execute(data: UseDTO) {
        try {
           const dadosLimpos = Sanitizer.sanitizarCadastroUser(data)
           console.log(dadosLimpos)

            //Estruturar melhor para n ter que recriar todas as class
            //ClienteValidador.validarCadastro(dadosLimpos);
            
            const aggregate_id = uuidv4();
            console.log(aggregate_id)

            const event: DomainEvent = {
                aggregate_id,
                event_type: UserEventTypes.USUARIO_CADASTRADO,
                event_data: {
                    nome: dadosLimpos.nome,
                    email: dadosLimpos.email,
                    senhaHash: dadosLimpos.senhaHash,
                },
                created_at: new Date()
            };


            await this.userRepository.save(event);


            return {
                id: aggregate_id,
                cliente: dadosLimpos
            };

        } catch(error) {
            if (error instanceof AppError) {
                throw error;
            } 
            throw new AppError(
                "Erro ao registar usuário",
                500,
                "INTERNAL_SERVER_ERROR"
            );
        }
    }
}