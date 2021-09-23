'use es6';

import { useSelector } from 'react-redux';
import { getAuthAsJS } from '../selectors/authSelectors';
export var useAuthAsJS = function useAuthAsJS() {
  return useSelector(getAuthAsJS);
};