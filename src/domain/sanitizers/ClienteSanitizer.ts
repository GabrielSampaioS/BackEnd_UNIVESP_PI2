import { CriarClienteDTO } from "../../application/dto/CriarClienteDTO";

export class ClienteSanitizer {

    static sanitizarCadastro(data: CriarClienteDTO): CriarClienteDTO {
        return {
            nome: data.nome.trim(),
            sobrenome: data.sobrenome.trim(),
            telefone: data.telefone.trim(),
            cpf: data.cpf.trim(),
            email: data.email.trim()
        }
    }
}