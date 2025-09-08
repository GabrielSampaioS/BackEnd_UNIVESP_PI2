const Event = require('../models/eventModel');

async function addEvent(aggregate_id, event_type, event_data) {
  return await Event.create({ aggregate_id, event_type, event_data });
}

async function getEvents(aggregate_id) {
  return await Event.findAll({
    where: { aggregate_id },
    order: [['created_at', 'ASC']]
  });
}

module.exports = { addEvent, getEvents };
