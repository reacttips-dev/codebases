'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _TEMPLATES$SEQUENCES$;

import { createTemplate, createSequence, documents } from 'sales-modal/lib/links';
import { TEMPLATES, SEQUENCES, DOCUMENTS } from 'sales-modal/constants/SalesModalTabs';
export default (_TEMPLATES$SEQUENCES$ = {}, _defineProperty(_TEMPLATES$SEQUENCES$, TEMPLATES, {
  name: 'templates',
  link: createTemplate(),
  illustration: 'templates'
}), _defineProperty(_TEMPLATES$SEQUENCES$, SEQUENCES, {
  name: 'sequences',
  link: createSequence(),
  illustration: 'sequences'
}), _defineProperty(_TEMPLATES$SEQUENCES$, DOCUMENTS, {
  name: 'documents',
  link: documents(),
  illustration: 'documents'
}), _TEMPLATES$SEQUENCES$);