'use es6';

import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import { fromJS, Map as ImmutableMap } from 'immutable';

var formatIntegrationPropertyReference = function formatIntegrationPropertyReference(properties, id) {
  return new ReferenceRecord({
    id: id,
    label: id + "-properties",
    referencedObject: fromJS({
      id: id,
      properties: properties
    })
  });
};

var formatIntegrationProperties = function formatIntegrationProperties(response) {
  return ImmutableMap(response.eventTypeIdProperties).map(formatIntegrationPropertyReference);
};

export default formatIntegrationProperties;