'use es6';

import { fromJS, List, Map as ImmutableMap } from 'immutable';
import makeObjectRecord from '../record/makeObjectRecord';
import { VISIT } from '../constants/ObjectTypes';
import ObjectIds from '../constants/ObjectIds';
var VisitRecord = makeObjectRecord({
  idKey: ObjectIds[VISIT],
  objectType: VISIT,
  recordName: 'VisitRecord',
  defaults: {
    domain: null,
    domainHash: null,
    firstTimestamp: null,
    lastBidenTimestamp: null,
    lastTimestamp: null,
    numPageViews: 0,
    numVids: 0,
    organization: null,
    originalSource: null,
    portalId: null,
    properties: ImmutableMap()
  }
}, {
  primary: ['name'],
  secondary: ['domain']
});
var _fromJS = VisitRecord.fromJS;

VisitRecord.fromJS = function (json) {
  if (json === null || json === undefined) {
    return json;
  }

  var immutable = fromJS(json);

  if (immutable.has('properties')) {
    immutable = immutable.update('properties', function (properties) {
      properties = properties.reduce(function (map, property) {
        return map.set(property.get('name'), property);
      }, ImmutableMap()); // A bunch of data, including domain, are not a properties

      return List.of('domain').reduce(function (map, property) {
        return map.set(property, ImmutableMap({
          name: property,
          value: immutable.get(property)
        }));
      }, properties);
    });
  }

  return _fromJS(immutable);
};

export default VisitRecord;