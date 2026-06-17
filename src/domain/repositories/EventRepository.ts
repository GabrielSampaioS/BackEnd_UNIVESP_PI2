import { DomainEvent } from "../events/DomainEvent"

// Interface apenas para escrita
export interface EventStore  {
    save(event: DomainEvent): Promise<void>
    findByAggregateId(id: string): Promise<DomainEvent[]>
}

// Interface apenas para leitura
export interface EventReader {
    findByAggregateId(id: string): Promise<DomainEvent[]>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findClientes(query: any): Promise<DomainEvent[]>
    findByNameOrCpf(nome?: string, cpf?: string): Promise<DomainEvent[]>
}

// Interface completa (combina ambas)
export interface EventRepository extends EventStore , EventReader {}
