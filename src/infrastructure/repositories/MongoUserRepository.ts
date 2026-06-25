import { UserDTO } from "../../application/dto/UserDTO";
import { DomainEvent } from "../../domain/events/DomainEvent";
import { UserRepository } from "../../domain/repositories/UserRepository";
import EventModel from "../../models/EventModel"
import { AppError } from "../../shared/errors/AppError";


export class MongoUserRepository implements UserRepository {
    async save(event: DomainEvent): Promise<void> {
        try {
            const doc = new EventModel(event)
            await doc.save()
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

    async findByEmail(email: string): Promise<UserDTO | null> {
        try {
            const doc = await EventModel.findOne({
                "event_data.email": email,
                "event_type": "UsuarioCadastrado"
            })

            if (!doc) return null

            const data = doc.event_data as {
                nome: string
                email: string
                senhaHash: string
            }


            return {
                id: doc.aggregate_id,
                nome: data.nome,
                email: data.email,
                senhaHash: data.senhaHash
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