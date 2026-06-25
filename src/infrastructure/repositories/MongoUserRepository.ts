import { UseDTO } from "../../application/dto/UserDTO";
import { DomainEvent } from "../../domain/events/DomainEvent";
import { UserRepository } from "../../domain/repositories/UserRepository";
import EventModel from "../../models/EventModel"


export class MongoUserRepository implements UserRepository {
    async save(event: DomainEvent): Promise<void> {
        const doc = new EventModel(event)
        await doc.save()
    }
    findByEmail(email: string): Promise<UseDTO | null> {
        throw new Error("Method not implemented.");
    }
    

}