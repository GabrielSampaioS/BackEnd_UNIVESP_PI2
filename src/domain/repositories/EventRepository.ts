import { DomainEvent } from "../events/DomainEvent"

export interface EventRepository {
    save(event: DomainEvent): Promise<void>
    findByAggregateId(id: string): Promise<any[]>
    findClientes(query: any): Promise<any[]>
    findByNameOrCpf(nome?: string, cpf?: string):Promise<any[]>
}