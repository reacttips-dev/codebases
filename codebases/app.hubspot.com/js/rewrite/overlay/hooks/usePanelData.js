'use es6';

import { useSelector } from 'react-redux';
import { getPanelData } from '../selectors/overlaySelectors';
export var usePanelData = function usePanelData() {
  return useSelector(getPanelData);
};