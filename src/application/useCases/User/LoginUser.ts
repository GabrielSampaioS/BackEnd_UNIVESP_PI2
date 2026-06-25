import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { UserDTO } from "../../dto/UserDTO";

export class LoginUser {

    constructor(private userRepository: UserRepository) { }

    async execute(data: UserDTO) {
        try {
            //1 validar
            //const dadosLimpos = ClienteSanitizer.sanitizarCadastro(data);
            //ClienteValidador.validarCadastro(dadosLimpos);

            if (!data.email || !data.senhaHash) {
                throw new AppError("Email e senha são obrigatórios", 400, "INVALID_INPUT")
            }

            // 2. Buscar usuário por email
            const usuario = await this.userRepository.findByEmail(data.email)
            if (!usuario) {
                throw new AppError("Email ou senha incorretos", 401, "INVALID_CREDENTIALS")
            }

            //3 comprar
            //const senhaValida = await this.compararSenha(data.senha, usuario.senhaHash)
            //if (!senhaValida) {
              //  throw new AppError("Email ou senha incorretos", 401, "INVALID_CREDENTIALS")
            //}

            //4 gerar token
            // 4. Gerar JWT (você precisa implementar)
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