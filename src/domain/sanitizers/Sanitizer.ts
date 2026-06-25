import { CriarClienteDTO } from "../../application/dto/CriarClienteDTO";
import { RegisterUserDTO } from "../../application/dto/RegisterUserDTO";
import { LoginUserDTO } from "../../application/dto/LoginUserDTO";
import { AppError } from "../../shared/errors/AppError";
import { RegisterUser } from "../../application/useCases/User/RegisterUser";

export class Sanitizer {

    static sanitizarCadastroCliente(data: CriarClienteDTO): CriarClienteDTO {
        return {
            nome: data.nome.trim(),
            sobrenome: data.sobrenome.trim(),
            telefone: data.telefone.trim(),
            cpf: data.cpf.trim(),
            email: data.email.trim()
        }
    }

    static sanitizarRegisterUser(data: RegisterUserDTO): RegisterUserDTO {
        return {
            nome: data.nome.trim(),
            email: data.email.trim().toLowerCase(),
            senha: data.senha
        };
    }


    static sanitizarloginUser(data: LoginUserDTO): LoginUserDTO {
        return {
            email: data.email.trim(),
            senha: data.senha
        }
    }
}