'use es6';

import { useSelector } from 'react-redux';
import { getIsDoubleOptInEnabled } from '../selectors/doubleOptInSelectors';
export var useIsDoubleOptInEnabled = function useIsDoubleOptInEnabled() {
  return useSelector(getIsDoubleOptInEnabled);
};