'use es6';

import { Record, Map as ImmutableMap, Set as ImmutableSet, List } from 'immutable';
import fill from './fill'; // Replace with checked lib

var collectionWithNesting = function collectionWithNesting(raw, constructor, nested) {
  return constructor(raw).map(function (value) {
    return nested(value);
  });
};

var constructWithNesting = function constructWithNesting() {
  var raw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var constructor = arguments.length > 1 ? arguments[1] : undefined;
  var nested = arguments.length > 2 ? arguments[2] : undefined;
  var mutatedRaw = Object.assign({}, raw);

  for (var field in nested) {
    if (raw.hasOwnProperty(field)) {
      mutatedRaw[field] = nested[field](raw[field]);
    }
  }

  return constructor(mutatedRaw);
};

var ListOfString = function ListOfString(raw) {
  return collectionWithNesting(raw, List, String);
};

var MapStringToListOfString = function MapStringToListOfString(raw) {
  return collectionWithNesting(raw, ImmutableMap, ListOfString);
};

var SearchSpec = Record({
  url: null,
  objectsField: null,
  properties: List()
});

var _HydrateSpec = Record({
  inputs: ImmutableSet(),
  fn: function fn() {
    return null;
  }
});

var HydrateSpec = function HydrateSpec(raw) {
  return constructWithNesting(raw, _HydrateSpec, {
    inputs: ImmutableSet
  });
};

var _PropertiesSpec = Record({
  idProperty: null,
  responsePaths: ImmutableMap(),
  types: ImmutableMap(),
  references: ImmutableMap(),
  extractors: ImmutableMap()
});

var PropertiesSpec = function PropertiesSpec(raw) {
  return constructWithNesting(raw, _PropertiesSpec, {
    responsePaths: MapStringToListOfString,
    types: ImmutableMap,
    references: ImmutableMap,
    extractors: ImmutableMap
  });
};

var _Spec = Record({
  dataType: null,
  objectTypeId: null,
  references: ImmutableMap(),
  search: new SearchSpec(),
  properties: new PropertiesSpec(),
  hydrate: new HydrateSpec(),
  associationPreviews: ImmutableMap()
}, 'inboundDb spec');

export default (function (raw) {
  return fill(constructWithNesting(raw, _Spec, {
    references: ImmutableMap,
    search: SearchSpec,
    properties: PropertiesSpec,
    hydrate: HydrateSpec
  }));
});