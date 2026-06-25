import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { Sanitizer } from "../../../domain/sanitizers/Sanitizer"
import { v4 as uuidv4 } from "uuid"
import { UserEventTypes } from "../../../domain/events/EventTypes";
import { DomainEvent } from "../../../domain/events/DomainEvent";
import { RegisterUserDTO } from "../../dto/RegisterUserDTO";
import { UserValidator } from "../../../domain/validators/UserValidador";
import { PBKDF2HashService } from "../../../infrastructure/security/PBKDF2HashService"

//TODO: injetart o PBKDF2HashService ao invez der acoplar 

export class RegisterUser {

    constructor(private userRepository: UserRepository) { }

    async execute(data: RegisterUserDTO) {
        try {

            //TODO desacoplar no futuro
            const hashService = new PBKDF2HashService()

            const dadosLimpos = Sanitizer.sanitizarRegisterUser(data)

            //TODO: validar que email já n estã em utilização
            UserValidator.validateRegister(dadosLimpos);

            const senhaHash = await hashService.hash(dadosLimpos.senha)

            const aggregate_id = uuidv4();

            const event: DomainEvent = {
                aggregate_id,
                event_type: UserEventTypes.USUARIO_CADASTRADO,
                event_data: {
                    nome: dadosLimpos.nome,
                    email: dadosLimpos.email,
                    senhaHash: senhaHash,
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