import { EventRepository } from "../../domain/repositories/EventRepository";

export class LocalizarClientes{
    constructor(private repository: EventRepository) {}

    async  execute(nome? : string, cpf? : string){
        return await this.repository.findByNameOrCpf(nome, cpf)
    }
}