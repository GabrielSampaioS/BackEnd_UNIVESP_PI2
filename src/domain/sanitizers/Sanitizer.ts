import { CriarClienteDTO } from "../../application/dto/CriarClienteDTO";
import { UseDTO } from "../../application/dto/UserDTO";

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

    static sanitizarCadastroUser(data: UseDTO): UseDTO {
        return {
            nome: data.nome.trim(),
            email: data.email.trim(),
            senhaHash: data.senhaHash
        }
    }
}