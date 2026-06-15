import EventModel from "../../models/EventModel"
import { EventRepository } from "../../domain/repositories/EventRepository"
import { DomainEvent } from "../../domain/events/DomainEvent"

export class MongoEventRepository implements EventRepository {
    findByNameOrCpf(nome?: string, cpf?: string): Promise<DomainEvent[]> {
        const query: any = {
            event_type: "ClienteCadastrado"
        }

        if (nome) {
            query["event_data.nome"] = {
                $regex: nome,
                $options: "i"
            }
        }

        if (cpf) {
            query["event_data.cpf"] = cpf
        }

        return EventModel.find(query)

    }
    async save(event: DomainEvent): Promise<void> {
        const doc = new EventModel(event)
        await doc.save()
    }
    findByAggregateId(id: string): Promise<DomainEvent[]> {
        return EventModel.find({ aggregate_id: id }).sort({ created_at: 1 })
    }
    findClientes(query: any): Promise<DomainEvent[]> {
        return EventModel.find(query)

    }

}