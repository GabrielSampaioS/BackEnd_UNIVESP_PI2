import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { LoginUserDTO } from "../../dto/LoginUserDTO";
import { Sanitizer } from "../../../domain/sanitizers/Sanitizer"
import { UserValidator } from "../../../domain/validators/UserValidador";


//TODO: passar a logica de compraação e geração de tokens para outros arquivos
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

export class LoginUser {

    constructor(private userRepository: UserRepository) { }

    async execute(data: LoginUserDTO) {
        try {

            const dadosLimpos = Sanitizer.sanitizarloginUser(data);
            UserValidator.validateLogin(dadosLimpos)

            const usuario = await this.userRepository.findByEmail(dadosLimpos.email)
            if (!usuario) {
                throw new AppError("Email ou senha incorretos", 401, "INVALID_CREDENTIALS")
            }

            //comparar
            const senhaValida = await compare(dadosLimpos.senha, usuario.senhaHash)
            console.log(senhaValida)
            //if (!senhaValida) {
              //  throw new AppError("Email ou senha incorretos", 401, "INVALID_CREDENTIALS")
            //}

            //gerar token
            const token = sign(
                {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                },
                process.env.JWT_SECRET!,
                {
                    expiresIn: "1d"
                }
            )


            return {
                token
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