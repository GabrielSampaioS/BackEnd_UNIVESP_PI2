export interface EventRepository {
    save(event: any): Promise<void>
    findByAggregateId(id: String): Promise<any[]>
    findClientes(query: any): Promise<any[]>
    findByNameOrCpf(nome?: string, cpf?: string):Promise<any[]>
}