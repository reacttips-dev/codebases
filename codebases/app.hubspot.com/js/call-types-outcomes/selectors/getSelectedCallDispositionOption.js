'use es6';

import { createSelector } from 'reselect';
import getIn from 'transmute/getIn';
import { getCallDispositionsFromState } from './getCallDispositions';
import { getEngagementDispositionFromState } from '../../engagement/selectors/getEngagement';
export var getSelectedCallDispositionOption = createSelector([getCallDispositionsFromState, getEngagementDispositionFromState], function (dispositions, selectedDisposition) {
  if (!dispositions || !selectedDisposition) {
    return null;
  }

  return dispositions.find(function (dispositionOption) {
    return getIn(['value'], dispositionOption) === selectedDisposition;
  }) || null;
});