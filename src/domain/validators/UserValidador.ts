import { LoginUserDTO } from "../../application/dto/LoginUserDTO";
import { RegisterUserDTO } from "../../application/dto/RegisterUserDTO";
import { BadRequestError } from "../../middlewares/MiddlewareError";

export class UserValidator {

    static validateRegister(data: RegisterUserDTO): void {

        if (!data.nome) {
            throw new BadRequestError(
                "Nome deve ser enviado",
                "INVALID_NAME"
            );
        }

        if (!data.email) {
            throw new BadRequestError(
                "Email deve ser enviado",
                "INVALID_EMAIL"
            );
        }

        if (!data.senha) {
            throw new BadRequestError(
                "Senha deve ser enviada",
                "INVALID_PASSWORD"
            );
        }

        if (data.senha.length < 6) {
            throw new BadRequestError(
                "Senha deve ter no mínimo 6 caracteres",
                "INVALID_PASSWORD"
            );
        }
    }

    static validateLogin(data: LoginUserDTO): void {

        if (!data.email) {
            throw new BadRequestError(
                "Email deve ser enviado",
                "INVALID_NAME"
            );
        }


        if (!data.senha) {
            throw new BadRequestError(
                "Senha deve ser enviada",
                "INVALID_PASSWORD"
            );
        }

        if (data.senha.length < 6) {
            throw new BadRequestError(
                "Senha deve ter no mínimo 6 caracteres",
                "INVALID_PASSWORD"
            );
        }
    }
}