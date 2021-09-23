'use es6';

import { fromJS, List } from 'immutable';
import get from 'transmute/get';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
var getContact = get('contact');
var getError = get('error');
var getEmailAddress = get('emailAddress');

var formatReferencedObject = function formatReferencedObject(item) {
  return fromJS(getError(item) ? null : getContact(item));
};

export default (function (contactResponses) {
  return List(contactResponses.map(function (item) {
    return new ReferenceRecord({
      id: getEmailAddress(item),
      label: getEmailAddress(item),
      referencedObject: formatReferencedObject(item)
    });
  }));
});