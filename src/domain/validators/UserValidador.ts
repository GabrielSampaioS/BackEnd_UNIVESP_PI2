import { LoginUserDTO } from "../../application/dto/LoginUserDTO";
import { RegisterUserDTO } from "../../application/dto/RegisterUserDTO";
import { AppError } from "../../shared/errors/AppError";

export class UserValidator {

    static validateRegister(data: RegisterUserDTO): void {

        if (!data.nome) {
            throw new AppError(
                "Nome deve ser enviado",
                400,
                "INVALID_NAME"
            );
        }

        if (!data.email) {
            throw new AppError(
                "Email deve ser enviado",
                400,
                "INVALID_EMAIL"
            );
        }

        if (!data.senha) {
            throw new AppError(
                "Senha deve ser enviada",
                400,
                "INVALID_PASSWORD"
            );
        }

        if (data.senha.length < 6) {
            throw new AppError(
                "Senha deve ter no mínimo 6 caracteres",
                400,
                "INVALID_PASSWORD"
            );
        }
    }

    static validateLogin(data: LoginUserDTO): void {

        if (!data.email) {
            throw new AppError(
                "Email deve ser enviado",
                400,
                "INVALID_NAME"
            );
        }


        if (!data.senha) {
            throw new AppError(
                "Senha deve ser enviada",
                400,
                "INVALID_PASSWORD"
            );
        }

        if (data.senha.length < 6) {
            throw new AppError(
                "Senha deve ter no mínimo 6 caracteres",
                400,
                "INVALID_PASSWORD"
            );
        }
    }
}