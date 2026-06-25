import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { LoginUserDTO } from "../../dto/LoginUserDTO";
import { Sanitizer } from "../../../domain/sanitizers/Sanitizer"
import { UserValidator } from "../../../domain/validators/UserValidador";


//TODO: passar a logica de compraação e geração de tokens para outros arquivos
import { sign } from "jsonwebtoken";

import { PBKDF2HashService } from "../../../infrastructure/security/PBKDF2HashService"

//TODO: injetart o PBKDF2HashService ao invez der acoplar 

export class LoginUser {

    constructor(private userRepository: UserRepository) { }

    async execute(data: LoginUserDTO) {
        try {

            //TODO desacoplar no futuro
            const hashService = new PBKDF2HashService()

            const dadosLimpos = Sanitizer.sanitizarloginUser(data);
            UserValidator.validateLogin(dadosLimpos)

            const usuario = await this.userRepository.findByEmail(dadosLimpos.email)
            if (!usuario) {
                throw new AppError("Email ou senha incorretos", 401, "INVALID_CREDENTIALS")
            }

            //Validar senha
            const senhaValida = await hashService.compare(dadosLimpos.senha, usuario.senhaHash)
            if (!senhaValida) {
                throw new AppError("Email ou senha incorretos", 401, "INVALID_CREDENTIALS")
            }

            //gerar token
            const token = sign(
                {
                    id: usuario.id,
                    email: usuario.email
                },
                process.env.JWT_SECRET!,
                {
                    expiresIn: "1d"
                }
            )


            return {
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                }

            };


        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                "Erro ao realizar login",
                500,
                "INTERNAL_SERVER_ERROR"
            );
        }
    }
}