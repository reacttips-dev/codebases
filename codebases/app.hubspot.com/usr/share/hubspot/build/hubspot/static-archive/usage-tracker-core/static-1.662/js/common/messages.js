'use es6';
/*
 * Note - this interface is intended only to
 * encapsulate debug log + error message formatting.
 */

var prettyPrint = function prettyPrint(str) {
  var cleaned = str.replace(/-/g, ' ');
  cleaned = cleaned.replace(/_/g, ' ');
  return cleaned.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

var createLog = function createLog(type, name, message) {
  return "\nusage-tracker " + type + ": \"" + name + "\"\n----------------------------------------\n" + message + "\n";
};

export var debugLog = function debugLog(name, _ref) {
  var eventKey = _ref.eventKey,
      eventName = _ref.eventName,
      eventNamespace = _ref.eventNamespace;
  var eventType = "[" + prettyPrint(eventNamespace) + "] " + prettyPrint(eventName);
  var messages = {
    eventKey: eventKey,
    eventType: eventType
  };
  return createLog('debug log', name, Object.keys(messages).reduce(function (accumulator, key) {
    var value = messages[key];

    if (typeof value === 'string') {
      accumulator += key + ": " + value + "\n";
    } else if (typeof value === 'object') {
      accumulator += key + ": " + JSON.stringify(value, null, 2) + "\n";
    } else {
      accumulator += key + ": " + typeof value + "\n";
    }

    return accumulator;
  }, ''));
};
export var genericError = function genericError(message) {
  return new Error("[usage-tracker error] " + message + " (This error breaks the execution thread.)");
};
export var configError = function configError(message) {
  return new Error("[usage-tracker config error] " + message + " (This error breaks the execution thread.)");
};
export var eventError = function eventError(message) {
  return new Error("[usage-tracker event error] " + message + " (This error breaks tracking, but not the execution thread.)");
};