import { UseDTO } from "../../application/dto/UserDTO";
import { UserRepository } from "../../domain/repositories/UserRepository";


export class MongoUserRepository implements UserRepository {
    save(user: UseDTO): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findByEmail(email: string): Promise<UseDTO | null> {
        throw new Error("Method not implemented.");
    }
    

}