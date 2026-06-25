import { UseDTO } from '../../application/dto/UserDTO'
 
// Interface apenas para escrita
export interface UserRepository  {
    save(user: UseDTO): Promise<void>
    findByEmail(email : string): Promise<UseDTO | null>;

}
