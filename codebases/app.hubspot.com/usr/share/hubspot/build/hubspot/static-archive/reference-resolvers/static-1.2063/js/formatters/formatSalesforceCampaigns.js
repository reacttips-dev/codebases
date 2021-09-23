'use es6';

import indexBy from 'transmute/indexBy';
import get from 'transmute/get';
import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';
import pipe from 'transmute/pipe';
export default pipe(formatToReferencesList({
  getId: get('id'),
  getLabel: get('name')
}), indexBy(get('id')));