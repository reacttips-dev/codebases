'use es6';

import { useSelector } from 'react-redux';
import { getPanelType } from '../selectors/overlaySelectors';
export var useOpenPanelType = function useOpenPanelType() {
  return useSelector(getPanelType);
};