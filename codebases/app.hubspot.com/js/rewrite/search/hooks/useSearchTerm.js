'use es6';

import { useSelector } from 'react-redux';
import { getSearchTerm } from '../selectors/searchSelectors';
export var useSearchTerm = function useSearchTerm() {
  return useSelector(getSearchTerm);
};