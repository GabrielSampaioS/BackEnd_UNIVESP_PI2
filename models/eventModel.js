const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  aggregate_id: { type: String, required: true },
  event_type: { type: String, required: true },
  event_data: { type: Object, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EventModel', EventSchema);
