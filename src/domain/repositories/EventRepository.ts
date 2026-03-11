export interface EventRepository {
    save(event: any): Promise<void>
    findByAggregateId(id: String): Promise<any[]>
    findClientes(query: any): Promise<any[]>
}