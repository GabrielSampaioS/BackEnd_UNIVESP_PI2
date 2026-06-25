import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { UseDTO } from "../../dto/UserDTO";

export class LoginUser {

    constructor(private userRepository: UserRepository) { }

    async execute(data: UseDTO) {
        try {
            //const dadosLimpos = ClienteSanitizer.sanitizarCadastro(data);
            //ClienteValidador.validarCadastro(dadosLimpos);
            
            //const aggregate_id = uuidv4();

            /*const event: DomainEvent = {
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
            };*/

            //await this.userRepository.save(event);

            //return {
                //id: aggregate_id,
                //cliente: dadosLimpos
            //};

            console.log("login")

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