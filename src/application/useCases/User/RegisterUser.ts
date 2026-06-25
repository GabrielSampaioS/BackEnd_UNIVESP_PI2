import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { Sanitizer } from "../../../domain/sanitizers/Sanitizer"
import { v4 as uuidv4 } from "uuid"
import { UserEventTypes } from "../../../domain/events/EventTypes";
import { DomainEvent } from "../../../domain/events/DomainEvent";
import { RegisterUserDTO } from "../../dto/RegisterUserDTO";
import { UserValidator } from "../../../domain/validators/UserValidador";

export class RegisterUser {

    constructor(private userRepository: UserRepository) { }

    async execute(data: RegisterUserDTO) {
        try {

            const dadosLimpos = Sanitizer.sanitizarRegisterUser(data)
            UserValidator.validateRegister(dadosLimpos);

            //TODO: validar que email já n estã em utilização

            const aggregate_id = uuidv4();

            const event: DomainEvent = {
                aggregate_id,
                event_type: UserEventTypes.USUARIO_CADASTRADO,
                event_data: {
                    nome: dadosLimpos.nome,
                    email: dadosLimpos.email,
                    senhaHash: dadosLimpos.senha,
                },
                created_at: new Date()
            };


            await this.userRepository.save(event);


            return {
                id: aggregate_id,
                cliente: dadosLimpos
            };

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                "Erro ao registar usuário",
                501,
                "INTERNAL_SERVER_ERROR"
            );
        }
    }
}