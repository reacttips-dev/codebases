'use es6';

import { useSelector } from 'react-redux';
import { getLegacyPageType } from '../selectors/viewsSelectors';
export var useLegacyPageType = function useLegacyPageType() {
  return useSelector(getLegacyPageType);
};