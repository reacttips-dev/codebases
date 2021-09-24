'use es6';

import { createSelector } from 'reselect';
import { getHasUserExceededEmbeddableVideoLimit } from 'FileManagerCore/selectors/Limits';
import { DrawerTypes } from '../Constants';
import { getPanelType } from './Panel';
export var getIsHublPanelOpenAndUserOverEmbeddableVideoLimit = createSelector([getPanelType, getHasUserExceededEmbeddableVideoLimit], function (type, exceededLimit) {
  return type === DrawerTypes.HUBL_VIDEO && exceededLimit;
});