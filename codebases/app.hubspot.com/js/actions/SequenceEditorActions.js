'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import identity from 'transmute/identity';
import { createAction } from 'flux-actions';
import uniqueId from 'hs-lodash/uniqueId';
import Raven from 'Raven';
import { DAY } from 'SequencesUI/constants/Milliseconds';
import { FINISH_ENROLLMENT } from 'SequencesUI/constants/SequenceStepTypes';
import { convertStepDependenciesToDependencies } from 'SequencesUI/util/dependencyUtils';
import { convertDependenciesToStepDependencies } from 'SequencesUI/util/dependencyUtils';
import * as SequenceActions from './SequenceActions';
import * as TemplateApi from 'SequencesUI/api/TemplateApi';
import { getEmptySequence } from 'SequencesUI/library/libraryUtils';
import { stepHasEmailTemplateId, getStepEmailTemplateId } from 'SequencesUI/util/stepsWithEmailTemplates';
import * as SequenceEditorActionTypes from 'SequencesUI/constants/SequenceEditorActionTypes';
import { TEMPLATE_BATCH_UPDATE_SUCCEEDED } from '../constants/SequenceActionTypes';
var sequenceCleared = createAction(SequenceEditorActionTypes.CLEAR_SEQUENCE, identity);
var sequenceNameUpdated = createAction(SequenceEditorActionTypes.UPDATE_NAME, identity);
var sequenceUpdated = createAction(SequenceEditorActionTypes.UPDATE_SEQUENCE, identity);
var sequenceDelayUpdated = createAction(SequenceEditorActionTypes.UPDATE_DELAY, identity);
var sequenceTemplateUpdated = createAction(SequenceEditorActionTypes.UPDATE_TEMPLATE, identity);
var stepTemplateReplaced = createAction(SequenceEditorActionTypes.REPLACE_TEMPLATE, identity);
export var batchTemplateUpdated = createAction(TEMPLATE_BATCH_UPDATE_SUCCEEDED, identity);
var sequenceTaskUpdated = createAction(SequenceEditorActionTypes.UPDATE_TASK, identity);
var sequenceSettingsUpdated = createAction(SequenceEditorActionTypes.UPDATE_SETTINGS, identity);
var taskDependencyToggled = createAction(SequenceEditorActionTypes.TOGGLE_DEPENDENCY, identity);
var sequenceStepDeleted = createAction(SequenceEditorActionTypes.DELETE_STEP, identity);
var sequenceStepInserted = createAction(SequenceEditorActionTypes.INSERT_STEP, identity);
var sequenceSaveSucceeded = createAction(SequenceEditorActionTypes.SAVE_SUCCESS, identity);
var sequenceSaveFailed = createAction(SequenceEditorActionTypes.SAVE_ERROR, identity);
export var sequenceEditorInitialized = createAction(SequenceEditorActionTypes.INITIALIZE_SEQUENCE_EDITOR, identity);
export var sequenceEditorInitializeFailed = createAction(SequenceEditorActionTypes.INITIALIZE_SEQUENCE_EDITOR_FAILED, identity);
export var clearSequence = function clearSequence() {
  return function (dispatch) {
    dispatch(sequenceCleared());
  };
};
export var updateName = function updateName(name) {
  return function (dispatch) {
    dispatch(sequenceNameUpdated(name));
  };
};
export var updateSequence = function updateSequence(sequence) {
  return function (dispatch) {
    dispatch(sequenceUpdated(sequence));
  };
};
export var updateDelay = function updateDelay(index, delay) {
  return function (dispatch) {
    dispatch(sequenceDelayUpdated({
      index: index,
      delay: delay
    }));
  };
};
export var updateTemplate = function updateTemplate(index, template) {
  var isNew = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return function (dispatch) {
    dispatch(sequenceTemplateUpdated({
      index: index,
      template: template,
      isNew: isNew
    }));
    dispatch(batchTemplateUpdated(ImmutableMap().set(template.get('id'), template)));
  };
};
export var updateTemplateMap = function updateTemplateMap(templateId, template) {
  return function (dispatch) {
    dispatch(batchTemplateUpdated(ImmutableMap().set(templateId, template)));
  };
};
export var replaceTemplate = function replaceTemplate(index, templateId) {
  return function (dispatch) {
    dispatch(stepTemplateReplaced({
      index: index,
      templateId: templateId
    }));
    TemplateApi.fetchTemplate(templateId).then(function (newTemplate) {
      dispatch(batchTemplateUpdated(ImmutableMap().set(newTemplate.get('id'), newTemplate)));
    });
  };
};
export var updateTask = function updateTask(index, _ref) {
  var subject = _ref.subject,
      taskType = _ref.taskType,
      taskQueueId = _ref.taskQueueId,
      notes = _ref.notes,
      priority = _ref.priority,
      manualEmailMeta = _ref.manualEmailMeta;
  return function (dispatch) {
    dispatch(sequenceTaskUpdated({
      index: index,
      subject: subject,
      taskType: taskType,
      taskQueueId: taskQueueId,
      notes: notes,
      priority: priority,
      manualEmailMeta: manualEmailMeta
    }));
    var templateId = manualEmailMeta && manualEmailMeta.get('templateId');

    if (templateId !== null && templateId !== undefined) {
      TemplateApi.fetchTemplate(templateId).then(function (template) {
        dispatch(batchTemplateUpdated(ImmutableMap().set(template.get('id'), template)));
      });
    }
  };
};
export var updateSettings = function updateSettings(sequenceSettings) {
  return function (dispatch) {
    dispatch(sequenceSettingsUpdated(sequenceSettings));
  };
};
export var toggleDependency = function toggleDependency(reliesOnUniqueId, dependencyType) {
  return function (dispatch) {
    dispatch(taskDependencyToggled({
      reliesOnUniqueId: reliesOnUniqueId,
      dependencyType: dependencyType
    }));
  };
};
export var deleteStep = function deleteStep(index) {
  return function (dispatch) {
    dispatch(sequenceStepDeleted(index));
  };
};
export var insertStep = function insertStep(below, item) {
  return function (dispatch) {
    dispatch(sequenceStepInserted({
      below: below,
      item: item,
      isBeta: true
    }));

    if (stepHasEmailTemplateId(item)) {
      TemplateApi.fetchTemplate(getStepEmailTemplateId(item)).then(function (template) {
        dispatch(batchTemplateUpdated(ImmutableMap().set(template.get('id'), template)));
      });
    }
  };
};
export var switchStep = function switchStep(sequence, newIndex, currentItem) {
  return function (dispatch) {
    var currentIndex = currentItem.get('stepOrder');
    var newItem = sequence.getIn(['steps', newIndex]);
    var delays = sequence.get('delays');
    var updated = sequence.update('steps', function (steps) {
      return steps.set(newIndex, currentItem).set(currentIndex, newItem).map(function (step, index) {
        return step.set('stepOrder', index);
      });
    });
    var currentItemDelay;
    var newItemDelay;

    if (currentIndex === 0) {
      currentItemDelay = DAY;
      newItemDelay = 0;
    } else if (newIndex === 0) {
      currentItemDelay = 0;
      newItemDelay = DAY;
    } else {
      currentItemDelay = delays.get(currentIndex);
      newItemDelay = delays.get(newIndex);
    }

    delays = delays.set(currentIndex, newItemDelay);
    delays = delays.set(newIndex, currentItemDelay);
    updated = updated.setIn(['delays'], delays);
    dispatch(updateSequence(updated));
  };
};
export var saveSequence = function saveSequence(sequence) {
  return function (dispatch) {
    var updatedSequence = sequence.update('steps', function (steps) {
      return steps.map(function (step, index) {
        return step.set('delay', sequence.getIn(['delays', index]));
      });
    }).delete('delays');

    if (updatedSequence.get('id') === 'new') {
      // new sequence, delete placeholder id
      updatedSequence = updatedSequence.delete('id');
    }

    updatedSequence = updatedSequence.set('steps', convertDependenciesToStepDependencies(updatedSequence)).delete('dependencies');

    if (updatedSequence.get('steps').last().get('action') !== FINISH_ENROLLMENT) {
      Raven.captureMessage('Enrollment does not end with finish step', {
        extra: {
          sequence: updatedSequence.toJS()
        }
      });
    }

    return SequenceActions.save({
      sequence: updatedSequence,
      showErrorAlert: true
    }).then(function (res) {
      dispatch(sequenceSaveSucceeded(updatedSequence));
      return res;
    }, function (err) {
      dispatch(sequenceSaveFailed(updatedSequence.get('id')));
      throw err;
    });
  };
};
export var prepareSequenceForEdit = function prepareSequenceForEdit(sequence) {
  var updatedSequence = sequence.update('steps', function (steps) {
    return steps.map(function (step) {
      return step.set('uniqueId', uniqueId());
    });
  }).set('delays', sequence.get('steps').map(function (step) {
    return step.get('delay');
  }));
  return updatedSequence.set('dependencies', convertStepDependenciesToDependencies(updatedSequence.get('steps'))).update('steps', function (steps) {
    return steps.map(function (step) {
      return step.set('dependencies', List());
    });
  });
};
export var initializeSequenceEditor = function initializeSequenceEditor(id, folderId) {
  return function (dispatch, getState) {
    if (id === 'new') {
      return dispatch(sequenceEditorInitialized(getEmptySequence().set('folderId', folderId)));
    }

    var selectedSequence = getState().sequences.sequencesById.get(Number(id));

    if (!selectedSequence) {
      return dispatch(SequenceActions.fetchSequence(id)).then(function (sequence) {
        return dispatch(sequenceEditorInitialized(prepareSequenceForEdit(sequence)));
      }, function () {
        return dispatch(sequenceEditorInitializeFailed());
      });
    }

    return dispatch(sequenceEditorInitialized(prepareSequenceForEdit(selectedSequence)));
  };
};