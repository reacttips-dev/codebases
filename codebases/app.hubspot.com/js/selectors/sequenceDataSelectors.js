'use es6';

import { createSelector } from 'reselect';

var getSequenceData = function getSequenceData(state) {
  return state.sequenceEditor;
};

export var sequenceSelector = createSelector(getSequenceData, function (sequenceData) {
  return sequenceData && sequenceData.get('sequence');
});
export var sequenceIdSelector = createSelector(sequenceSelector, function (sequence) {
  return sequence && sequence.get('id');
});
export var sequenceSettingsSelector = createSelector(sequenceSelector, function (sequence) {
  return sequence && sequence.get('sequenceSettings');
});