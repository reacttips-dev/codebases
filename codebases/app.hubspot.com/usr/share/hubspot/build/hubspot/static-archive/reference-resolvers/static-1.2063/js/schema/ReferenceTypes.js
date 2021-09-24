'use es6';

import { instanceOf, oneOf, oneOfType, number, bool } from 'prop-types';
import ReferenceRecord from './ReferenceRecord';
import ResolverError from './ResolverError';
import ResolverLoading from './ResolverLoading';
import { iterableOf, contains } from 'react-immutable-proptypes';
var nullType = oneOf([null]);
var referenceIterable = iterableOf(instanceOf(ReferenceRecord).isRequired);
export var byId = oneOfType([nullType.isRequired, instanceOf(ResolverError).isRequired, instanceOf(ResolverLoading).isRequired, instanceOf(ReferenceRecord).isRequired]);
export var all = oneOfType([instanceOf(ResolverError).isRequired, instanceOf(ResolverLoading).isRequired, referenceIterable.isRequired]);
export var search = oneOfType([instanceOf(ResolverError).isRequired, instanceOf(ResolverLoading).isRequired, contains({
  count: number.isRequired,
  hasMore: bool.isRequired,
  offset: number.isRequired,
  results: referenceIterable.isRequired
}).isRequired]);