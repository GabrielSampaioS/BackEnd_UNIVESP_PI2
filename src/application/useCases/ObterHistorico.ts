import { EventRepository } from "../../domain/repositories/EventRepository"
import { Cliente } from "../../domain/entities/Cliente"
import { AppError } from "../../shared/errors/AppError"

export class ObterHistorico   {
    constructor(private repository: EventRepository) {}

    async execute(aggregate_id: String){
        const eventos = await this.repository.findByAggregateId(aggregate_id)

        //Verificar se cliente exite
        if(!eventos || eventos.length === 0){
            throw new AppError("Cliente não localizado",404,"CLIENT_NOT_FOUND")
        }


        const cliente = new Cliente(eventos)
        
        return{
            historico: eventos,
            saldo: cliente.getSaldo()
        }
    }
}