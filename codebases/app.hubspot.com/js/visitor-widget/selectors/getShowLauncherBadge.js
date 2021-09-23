'use es6';

import { createSelector } from 'reselect';
import { calculateUnseenThreadsCount } from '../../threads/selectors/calculateUnseenThreadsCount';
import { getIsOpen } from '../../selectors/getIsOpen';
export var getShowLauncherBadge = createSelector([getIsOpen, calculateUnseenThreadsCount], function (isOpen, unseenThreadsCount) {
  return Boolean(!isOpen && !!unseenThreadsCount);
});