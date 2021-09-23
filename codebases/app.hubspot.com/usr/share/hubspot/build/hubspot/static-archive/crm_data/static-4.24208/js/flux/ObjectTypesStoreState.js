'use es6';

import { Record, Set as ImmutableSet } from 'immutable';
import ObjectTypesRecord from '../records/ObjectTypesRecord';
var ObjectTypesStoreState = Record({
  data: ObjectTypesRecord(),
  error: ObjectTypesRecord(),
  fetching: ImmutableSet()
}, 'ObjectTypesStoreState');
export default ObjectTypesStoreState;