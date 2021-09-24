'use es6';

import { between, isArray, mapObject, trim } from './common/helpers';
import * as schema from './common/schema';
import { eventError } from './common/messages';
import { eventPropertyTypes, eventDefinitionSchema, eventPropertySchema } from './schemas';
/*
 *  v1.5 of the bender-event-definition-loader package introduced
 *  the concept of "detailed properties" vs "shorthand properties".
 *
 *  For backwards compatibility, this code will adapt any shorthand properties
 *  supported by pre v1.5 loader versions to the detailed property format.
 *  The detailed property format includes additional info such as "isOptional".
 */

var _adaptShorthandProperties = function _adaptShorthandProperties(definitions) {
  return Object.keys(definitions).reduce(function (accumulator, eventKey) {
    var definition = definitions[eventKey];
    definition.properties = mapObject(definition.properties, function (key, value) {
      var isShorthandProperty = typeof value === 'string' || isArray(value);

      if (isShorthandProperty) {
        return {
          type: value
        };
      }

      return value;
    });
    definition.properties = eventPropertySchema.normalizeEach(definition.properties);
    accumulator[eventKey] = definition;
    return accumulator;
  }, {});
};
/*
 *  Schemas provide free validation since
 *  an object can be validated against them.
 *
 *  This function takes an event definition,
 *  and generates a schema for it's properties.
 *
 *  EX:
 *
 *    definition = {
 *      name: 'page view',
 *      class: 'view',
 *      properties: {
 *        screen: { type: 'oneOf(["foo", "bar"])', isOptional: false },
 *        subscreen: { type: 'string', isOptional: false }
 *      }
 *    }
 *
 *    schema = {
 *      screen: {
 *        types: ['string'],
 *        oneOf: ['foo', 'bar']
 *      },
 *      subscreen: {
 *        types: ['string']
 *      }
 *    }
 */


export var deriveEventPropertySchema = function deriveEventPropertySchema(definition) {
  var properties = definition.properties || {};
  var propertiesBlueprint = Object.keys(properties).reduce(function (accumulator, key) {
    var _properties$key = properties[key],
        type = _properties$key.type,
        isOptional = _properties$key.isOptional;

    if (eventPropertyTypes.indexOf(type) !== -1) {
      accumulator[key] = {
        types: [type],
        isOptional: isOptional
      };
    } else if (type.indexOf('oneOf') !== -1) {
      var options = between(type, '[', ']').split(',').map(function (option) {
        return trim(trim(option, '"'), "'");
      });
      accumulator[key] = {
        oneOf: options,
        isOptional: isOptional
      };
    } else if (isArray(type)) {
      accumulator[key] = {
        oneOf: type,
        isOptional: isOptional
      };
    }

    return accumulator;
  }, {});
  return schema.create('event property', eventError, propertiesBlueprint, false);
};

var validate = function validate(definition, eventKey, eventProperties) {
  if (!definition || typeof definition !== 'object') {
    throw eventError("Invalid event key. The event definition for \"" + eventKey + "\" is undefined. Check your events.yaml dictionary.");
  }

  if (definition) {
    deriveEventPropertySchema(definition).validate(eventProperties, "Event \"" + eventKey + "\"");
  }
};

export var dictionaryLookup = function dictionaryLookup(dictionary, eventKey, eventProperties) {
  var definition = dictionary[eventKey];
  validate(definition, eventKey, eventProperties);
  return definition;
};
export var createDictionary = function createDictionary(definitions, caller) {
  var parsedDefinitions = eventDefinitionSchema.normalizeEach(definitions);
  eventDefinitionSchema.validateEach(parsedDefinitions, caller);
  return _adaptShorthandProperties(parsedDefinitions);
};