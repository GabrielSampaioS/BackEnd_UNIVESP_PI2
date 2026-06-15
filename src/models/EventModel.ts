import mongoose, { Schema, Document} from "mongoose";
import { EventTypes } from "../domain/events/EventTypes";

export interface EventDocument extends Document {

    aggregate_id: string

    event_type: EventTypes

    event_data: any //DomainEvent?

    created_at: Date

}

const EventSchema = new Schema<EventDocument>({
    aggregate_id: { type: String, required: true },

    event_type: { type: String, required: true },

    event_data: { type: Object, required: true },

    created_at: { type: Date, default: Date.now }

})

export default mongoose.model<EventDocument>("Event", EventSchema)