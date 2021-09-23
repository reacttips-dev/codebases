'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { List, fromJS } from 'immutable';
import { configureSteps } from 'SequencesUI/library/libraryUtils';
import sequencesLibraryData from 'SequencesUI/library/sequencesLibraryData';
import getDefaultSequenceSettings from 'SequencesUI/constants/getDefaultSequenceSettings';

var buildTemplates = function buildTemplates(sequence, selectedOption) {
  return sequence.get('steps').reduce(function (templatesList, step, stepOrder) {
    var data = step.data;

    if (data) {
      return templatesList.push({
        sequenceIndex: "" + selectedOption,
        stepOrder: stepOrder,
        body: data.get('body'),
        name: data.get('name'),
        subject: data.get('subject'),
        private: false
      });
    }

    return templatesList;
  }, List());
};

export default (function (_ref) {
  var folderId = _ref.folderId,
      selectedOption = _ref.selectedOption,
      sequenceLibrary = _ref.sequenceLibrary,
      saveSequences = _ref.saveSequences;
  var templates = List();
  var sequence = sequenceLibrary.get(selectedOption);
  var sequenceName = sequencesLibraryData.getIn([selectedOption, 'sequenceName']);
  var steps = configureSteps(sequence.get('steps'));
  var sequenceTemplates = buildTemplates(sequence, selectedOption);
  templates = templates.concat(sequenceTemplates);
  var sequenceMap = fromJS(_defineProperty({}, selectedOption, {
    folderId: folderId,
    steps: steps,
    name: sequenceName,
    sequenceSettings: getDefaultSequenceSettings()
  }));
  return saveSequences(sequenceMap, templates);
});