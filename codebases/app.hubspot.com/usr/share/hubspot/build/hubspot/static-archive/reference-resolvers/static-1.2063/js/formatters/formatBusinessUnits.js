'use es6';

import { List, fromJS } from 'immutable';
import indexBy from 'transmute/indexBy';
import get from 'transmute/get';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';

var formatBusinessUnitId = function formatBusinessUnitId(businessUnit) {
  return String(businessUnit.id);
};

var formatBusinessUnitReference = function formatBusinessUnitReference(businessUnit) {
  return new ReferenceRecord({
    id: formatBusinessUnitId(businessUnit),
    label: businessUnit.name,
    referencedObject: fromJS(businessUnit)
  });
};

var formatBusinessUnits = function formatBusinessUnits(businessUnits) {
  return indexBy(get('id'), List(businessUnits).map(formatBusinessUnitReference));
};

export default formatBusinessUnits;