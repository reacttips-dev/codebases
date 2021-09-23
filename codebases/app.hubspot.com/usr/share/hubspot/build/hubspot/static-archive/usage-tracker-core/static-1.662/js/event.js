'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { omit } from './common/helpers';
import { eventError } from './common/messages';
import { accountId } from './storageKeys';
var CONDITIONAL_PROPERTIES = {
  what_event_subtype: 'what_event_subtype',
  what_value: 'what_value',
  what_value_str: 'what_value_str',
  where_subscreen2: 'where_subscreen2',
  subscreen2: 'where_subscreen2'
};
var CONDITIONAL_PROPERTY_KEYS = Object.keys(CONDITIONAL_PROPERTIES);
var SENSITIVE_PROPERTIES = ['email', 'userId', 'hubId', 'hstc', 'utk', 'deviceId', 'device_id'];
var AUTHED_IDENTIFIER_LABELS = ['USER_ID', 'EMAIL'];
var ANON_IDENTIFIER_LABELS = ['TEMP_ID', 'VISITOR'];

var identifierLabelInList = function identifierLabelInList() {
  var userIdentifier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (typeof userIdentifier !== 'string') {
    return false;
  }

  return list.indexOf(userIdentifier.split(':')[0]) !== -1;
};

var resolveNamespace = function resolveNamespace(eventKey, namespaceFromDefinition, namespaceFromProperties) {
  var namespace = namespaceFromDefinition || namespaceFromProperties;

  if (!namespace || namespace === '*') {
    throw eventError("Namespace not found for \"" + eventKey + "\".");
  }

  return namespace;
};

export var applyIdentifiers = function applyIdentifiers(identifiers, event) {
  if (!event.who_email && identifiers.raw.email) {
    event.who_email = identifiers.raw.email;
  }

  if (!event.who_identifier && identifiers.raw.userId) {
    event.who_identifier = identifiers.raw.userId;
  }

  if (!event.who_identifier_v2) {
    event.who_identifier_v2 = identifiers.user;
  }

  if (!event.who_team_identifier) {
    event.who_team_identifier = identifiers.team;
  }

  if (!event.utk) {
    event.utk = identifiers.utk;
  }

  return event;
};
export var normalizeIdentifiers = function normalizeIdentifiers(identifiers, event) {
  var currentlyAuthed = identifierLabelInList(identifiers.user, AUTHED_IDENTIFIER_LABELS);
  var previouslyUnauthed = identifierLabelInList(event.who_identifier_v2, ANON_IDENTIFIER_LABELS);
  var previouslyNotSet = event.who_identifier_v2 === '[NOT YET SET, SHOULD GET SET PRIOR TO FLUSH]';

  if (currentlyAuthed && previouslyUnauthed || previouslyNotSet) {
    event.who_identifier_v2 = identifiers.user;
  }

  return applyIdentifiers(identifiers, event);
};
/* eslint-disable */

export var transformEventPayload = function transformEventPayload(definition, properties) {
  var namespace = properties.namespace,
      lang = properties.lang,
      screen = properties.screen,
      subscreen = properties.subscreen,
      timestamp = properties.timestamp,
      screenWidth = properties.screenWidth,
      screenHeight = properties.screenHeight,
      windowWidth = properties.windowWidth,
      windowHeight = properties.windowHeight,
      device_id = properties.device_id,
      session_id = properties.session_id,
      last_sequence_number = properties.last_sequence_number,
      last_event_id = properties.last_event_id,
      rest = _objectWithoutProperties(properties, ["namespace", "lang", "screen", "subscreen", "timestamp", "screenWidth", "screenHeight", "windowWidth", "windowHeight", "device_id", "session_id", "last_sequence_number", "last_event_id"]);

  var payload = {
    hublytics_account_id: accountId,
    where_app: resolveNamespace(rest.eventKey, definition.namespace, namespace),
    where_screen: screen || 'unknown',
    where_subscreen: subscreen || '',
    when_timestamp: timestamp,
    device_id: device_id,
    session_id: session_id,
    event_id: last_event_id,
    sequence_number: last_sequence_number,
    language: lang,
    what_event: definition.name,
    what_event_class: definition.class.toUpperCase(),
    what_version: definition.version,
    library: {
      name: 'usage-tracker-js',
      version: 1
    },
    what_extra_json: JSON.stringify(Object.assign({
      screenWidth: screenWidth,
      screenHeight: screenHeight,
      windowWidth: windowWidth,
      windowHeight: windowHeight,
      locale: lang
    }, omit(rest, [].concat(SENSITIVE_PROPERTIES, _toConsumableArray(CONDITIONAL_PROPERTY_KEYS)))))
  };
  CONDITIONAL_PROPERTY_KEYS.forEach(function (key) {
    var value = properties[key];

    if (value !== 'undefined') {
      payload[CONDITIONAL_PROPERTIES[key]] = value;
    }
  });
  return payload;
};
export var createEventPayload = function createEventPayload(definition, eventProperties, identifiers) {
  var eventPayload = transformEventPayload(definition, eventProperties);
  return applyIdentifiers(identifiers, eventPayload);
};