import { DomainEvent } from "../events/DomainEvent"

export interface EventRepository {
    save(event: DomainEvent): Promise<void>
    findByAggregateId(id: string): Promise<DomainEvent[]>
    findClientes(query: any): Promise<DomainEvent[]>
    findByNameOrCpf(nome?: string, cpf?: string):Promise<DomainEvent[]>
}