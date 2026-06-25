import { UserDTO } from '../../application/dto/UserDTO'
import { DomainEvent } from '../events/DomainEvent';
 
// Interface apenas para escrita
export interface UserRepository  {
    save(user: DomainEvent): Promise<void>
    findByEmail(email : string): Promise<UserDTO | null>;

}
