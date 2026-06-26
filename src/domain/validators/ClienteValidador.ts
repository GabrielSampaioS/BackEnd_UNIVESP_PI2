
import { CriarClienteDTO } from "../../application/dto/CriarClienteDTO";
import { BadRequestError } from "../../middlewares/MiddlewareError";
import { FormaPagamento } from "../enums/FormaPagamento";

export class ClienteValidador {
    static validarCadastro(data: CriarClienteDTO): void {

        const camposObrigatorios: (keyof CriarClienteDTO)[] = [
            "nome",
            "sobrenome",
            "telefone",
            "cpf",
            "email"
        ];

        for (const campo of camposObrigatorios) {
            if (!data[campo]) {
                throw new BadRequestError(
                    `Campo ${campo} é obrigatório`,
                    "INVALID_DATA"
                );
            }

        }
    }

    static validarDivida(valor: number): void {
        if (valor <= 0) {
            throw new BadRequestError(
                "Valor inválido",
                "INVALID_DATA"
            )
        }
    }

    static validarPagamento(valor: number, forma: FormaPagamento): void {
        if (valor < 0) {
            throw new BadRequestError(
                "Valor inválido",
                "INVALID_DATA"
            )
        }
        if (!Object.values(FormaPagamento).includes(forma)) {
            throw new BadRequestError(
                "Forma de pagamento inválida",
                "INVALID_DATA"
            )
        }
    }


}