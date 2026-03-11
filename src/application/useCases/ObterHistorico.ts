import { EventRepository } from "../../domain/repositories/EventRepository"
import { Cliente } from "../../domain/entities/Cliente"

export class ObterHistorico   {
    constructor(private repository: EventRepository) {}

    async execute(aggregate_id: String,){
        const eventos = await this.repository.findByAggregateId(aggregate_id)
        const cliente = new Cliente(eventos)
        
        return{
            historico: eventos,
            saldo: cliente.getSaldo()
        }
    }
}