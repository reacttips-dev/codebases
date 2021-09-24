'use es6';

import { useSelector } from 'react-redux';
import { getDoubleOptInFetchStatus } from '../selectors/doubleOptInSelectors';
export var useDoubleOptInFetchStatus = function useDoubleOptInFetchStatus() {
  return useSelector(getDoubleOptInFetchStatus);
};