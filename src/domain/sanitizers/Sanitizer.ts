import { CriarClienteDTO } from "../../application/dto/CriarClienteDTO";
import { UserDTO } from "../../application/dto/UserDTO";
import { AppError } from "../../shared/errors/AppError";

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

    static sanitizarCadastroUser(data: UserDTO): UserDTO {
    if (!data.senhaHash || data.senhaHash.length < 6) {
        throw new AppError("Senha deve ter no mínimo 6 caracteres", 400, "INVALID_PASSWORD")
    }
    
    return {
        nome: data.nome.trim(),
        email: data.email.trim(),
        senhaHash: data.senhaHash
    }
}
}