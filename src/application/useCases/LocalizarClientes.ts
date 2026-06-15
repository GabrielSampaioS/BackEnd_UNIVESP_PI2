import { EventRepository } from "../../domain/repositories/EventRepository";
import { AppError } from "../../shared/errors/AppError";

export class LocalizarClientes {
    constructor(private repository: EventRepository) { }

    async execute(nome?: string, cpf?: string) {
        try {
            return this.repository.findByNameOrCpf(nome, cpf);

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

