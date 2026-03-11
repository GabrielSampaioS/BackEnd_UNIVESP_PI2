import mongoose, { Schema, Document} from "mongoose";

export interface EventDocument extends Document {

    aggregate_id: string

    event_type: string

    event_data: any

    created_at: Date

}

const EventSchema = new Schema<EventDocument>({
    aggregate_id: { type: String, required: true },

    event_type: { type: String, required: true },

    event_data: { type: Object, required: true },

    created_at: { type: Date, default: Date.now }

})

export default mongoose.model<EventDocument>("Event", EventSchema)