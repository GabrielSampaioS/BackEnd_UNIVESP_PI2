import EventModel from "../../models/EventModel"
import { EventRepository } from "../../domain/repositories/EventRepository"

export class MongoEventRepository implements EventRepository{
    async  save(event: any): Promise<void> {
        const doc = new EventModel(event)
        await doc.save()
    }
    findByAggregateId(id: String): Promise<any[]> {
        return EventModel.find({aggregate_id: id}).sort({created_at:1})
    }
    findClientes(query: any): Promise<any[]> {
        return EventModel.find(query)

    }
    
}