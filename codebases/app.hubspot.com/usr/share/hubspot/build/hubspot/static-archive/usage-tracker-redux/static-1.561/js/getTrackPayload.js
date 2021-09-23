'use es6';

export default function getTrackPayload(eventKey) {
  var eventProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    eventKey: eventKey,
    eventProperties: eventProperties
  };
}