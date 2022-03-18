"use strict";

const parser = {
  parse: parseDataEvents,
  format: formatData,
  delimiter: "\f",
};

function formatData(message) {
  if (!message.data && message.data !== false && message.data !== 0) {
    message.data = {};
  }
  if (message.data["_maxListeners"]) {
    message.data = {};
  }

  message = message.JSON + parser.delimiter;
  return message;
}

function parseDataEvents(data) {
  let events = data.split(parser.delimiter);
  events.pop();
  return events;
}

module.exports = parser;
