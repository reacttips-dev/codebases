'use es6';

import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import { fromJS, List } from 'immutable';
import indexBy from 'transmute/indexBy';
import get from 'transmute/get';

var formatFormId = function formatFormId(form) {
  return form.guid;
};

var formatFormReference = function formatFormReference(form) {
  return new ReferenceRecord({
    id: formatFormId(form),
    label: form.name,
    referencedObject: fromJS(form)
  });
};

var formatForms = function formatForms(forms) {
  return indexBy(get('id'), List(forms).map(formatFormReference));
};

export default formatForms;