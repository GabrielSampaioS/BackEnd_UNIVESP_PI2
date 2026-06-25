import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { LoginUserDTO } from "../../dto/LoginUserDTO";
import { Sanitizer } from "../../../domain/sanitizers/Sanitizer"
import { UserValidator } from "../../../domain/validators/UserValidador";

export class LoginUser {

    constructor(private userRepository: UserRepository) { }

    async execute(data: LoginUserDTO) {
        try {
            
            const dadosLimpos = Sanitizer.sanitizarloginUser(data);
            UserValidator.validateLogin(dadosLimpos)

            const usuario = await this.userRepository.findByEmail(data.email)
            if (!usuario) {
                throw new AppError("Email ou senha incorretos", 401, "INVALID_CREDENTIALS")
            }

            //comparar
            //const senhaValida = await this.compararSenha(data.senha, usuario.senhaHash)
            if (usuario.senhaHash != data.senha) {
                throw new AppError("Email ou senha incorretos", 401, "INVALID_CREDENTIALS")
            }

            //gerar token
            //const token = this.gerarJWT(usuario)

            return {
                //token,
                usuario: {
                    id: usuario.id,
                    email: usuario.email,
                    nome: usuario.nome
                }
            }

        } catch (error) {
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