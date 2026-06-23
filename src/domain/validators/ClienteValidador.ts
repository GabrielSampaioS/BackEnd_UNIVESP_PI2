
import { CriarClienteDTO } from "../../application/dto/CriarClienteDTO";
import { AppError } from "../../shared/errors/AppError";
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
                throw new AppError(
                    `Campo ${campo} é obrigatório`,
                    400,
                    "INVALID_DATA"
                );
            }

        }
    }

    static validarDivida(valor: number): void {
        if (valor <= 0) {
            throw new AppError(
                "Valor inválido",
                400,
                "INVALID_DATA"
            )
        }
    }

    static validarPagamento(valor: number, forma: FormaPagamento): void {
        if (valor < 0) {
            throw new AppError(
                "Valor inválido",
                400,
                "INVALID_DATA"
            )
        }
        if (!Object.values(FormaPagamento).includes(forma)) {
            throw new AppError(
                "Forma de pagamento inválida",
                400,
                "INVALID_DATA"
            )
        }
    }


}