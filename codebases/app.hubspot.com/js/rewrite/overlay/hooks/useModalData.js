'use es6';

import { useSelector } from 'react-redux';
import { getModalData } from '../selectors/overlaySelectors';
export var useModalData = function useModalData() {
  return useSelector(getModalData);
};