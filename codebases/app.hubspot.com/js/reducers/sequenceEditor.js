'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import uniqueId from 'hs-lodash/uniqueId';
import { Map as ImmutableMap } from 'immutable';
import * as SequenceEditorActionTypes from '../constants/SequenceEditorActionTypes';
import * as SequenceStepTypes from 'SequencesUI/constants/SequenceStepTypes';
import * as SequenceStepDependencyTypes from 'SequencesUI/constants/SequenceStepDependencyTypes';
import { DAY } from '../constants/Milliseconds';
import { TEMPLATE_ID_PATH } from 'SequencesUI/util/stepsWithEmailTemplates';
import { toggleDependency } from 'SequencesUI/util/dependencyUtils';
var INITIAL_STATE = ImmutableMap({
  saved: true,
  nameEdited: false
});
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SequenceEditorActionTypes.INITIALIZE_SEQUENCE_EDITOR:
      return state.set('sequence', action.payload);

    case SequenceEditorActionTypes.INITIALIZE_SEQUENCE_EDITOR_FAILED:
      return state.set('sequence', null);

    case SequenceEditorActionTypes.CLEAR_SEQUENCE:
      return INITIAL_STATE;

    case SequenceEditorActionTypes.UPDATE_NAME:
      return state.setIn(['sequence', 'name'], action.payload).merge({
        saved: false,
        nameEdited: true
      });

    case SequenceEditorActionTypes.UPDATE_DELAY:
      {
        var _action$payload = action.payload,
            index = _action$payload.index,
            delay = _action$payload.delay;
        return state.setIn(['sequence', 'delays', index], delay).set('saved', false);
      }

    case SequenceEditorActionTypes.UPDATE_TASK:
      {
        var _action$payload2 = action.payload,
            _index = _action$payload2.index,
            subject = _action$payload2.subject,
            taskType = _action$payload2.taskType,
            taskQueueId = _action$payload2.taskQueueId,
            notes = _action$payload2.notes,
            priority = _action$payload2.priority,
            manualEmailMeta = _action$payload2.manualEmailMeta;

        if (subject) {
          state = state.setIn(['sequence', 'steps', _index, 'actionMeta', 'taskMeta', 'subject'], subject);
        }

        state = state.updateIn(['sequence', 'steps', _index, 'actionMeta', 'taskMeta'], function (taskMeta) {
          return taskMeta.merge({
            taskType: taskType,
            taskQueueId: taskQueueId,
            notes: notes,
            priority: priority,
            manualEmailMeta: manualEmailMeta
          });
        });
        return state.set('saved', false);
      }

    case SequenceEditorActionTypes.UPDATE_TEMPLATE:
      {
        var _action$payload3 = action.payload,
            _index2 = _action$payload3.index,
            template = _action$payload3.template,
            isNew = _action$payload3.isNew;
        var stepAction = state.getIn(['sequence', 'steps', _index2, 'action']);
        var templateIdPath = TEMPLATE_ID_PATH[stepAction];
        var updatedState = state.setIn(['sequence', 'steps', _index2].concat(_toConsumableArray(templateIdPath)), template.get('id'));
        return isNew ? updatedState.set('saved', false) : updatedState;
      }

    case SequenceEditorActionTypes.REPLACE_TEMPLATE:
      {
        var _action$payload4 = action.payload,
            _index3 = _action$payload4.index,
            templateId = _action$payload4.templateId;

        var _stepAction = state.getIn(['sequence', 'steps', _index3, 'action']);

        var _templateIdPath = TEMPLATE_ID_PATH[_stepAction];
        return state.setIn(['sequence', 'steps', _index3].concat(_toConsumableArray(_templateIdPath)), templateId).set('saved', false);
      }

    case SequenceEditorActionTypes.UPDATE_SEQUENCE:
      return state.merge({
        sequence: action.payload,
        saved: false
      });

    case SequenceEditorActionTypes.DELETE_STEP:
      {
        state = state.updateIn(['sequence', 'dependencies'], function (dependencies) {
          return dependencies.delete(state.getIn(['sequence', 'steps', action.payload, 'uniqueId']));
        });
        state = state.updateIn(['sequence', 'steps'], function (steps) {
          return steps.delete(action.payload).map(function (step, newIndex) {
            return step.set('stepOrder', newIndex);
          });
        });
        state = state.updateIn(['sequence', 'delays'], function (delays) {
          if (action.payload === 0) {
            return delays.delete(1).set(0, 0);
          }

          return delays.delete(action.payload);
        });
        return state.set('saved', false);
      }

    case SequenceEditorActionTypes.INSERT_STEP:
      {
        var _action$payload5 = action.payload,
            below = _action$payload5.below,
            item = _action$payload5.item,
            _action$payload5$isBe = _action$payload5.isBeta,
            isBeta = _action$payload5$isBe === void 0 ? false : _action$payload5$isBe;
        var itemWithUniqueId = item.set('uniqueId', uniqueId());
        var _index4 = 0;

        if (below !== null) {
          _index4 = below + 1;
        }

        state = state.updateIn(['sequence', 'steps'], function (steps) {
          return steps.insert(_index4, itemWithUniqueId).map(function (step, newIndex) {
            return step.set('stepOrder', newIndex);
          });
        });
        state = state.updateIn(['sequence', 'delays'], function (delays) {
          if (isBeta) {
            if (_index4 === 0) {
              return delays.insert(0, 0);
            }

            var itemDelay = item.get('delay');
            return delays.insert(_index4, itemDelay);
          }
          /* Current Sequences behavior */


          if (_index4 === 0) {
            return delays.insert(_index4, 0).set(1, DAY);
          }

          return delays.insert(_index4, DAY);
        });

        if (item.get('action') === SequenceStepTypes.SCHEDULE_TASK) {
          state = state.updateIn(['sequence', 'dependencies'], function (dependencies) {
            return toggleDependency({
              dependencies: dependencies,
              reliesOnUniqueId: itemWithUniqueId.get('uniqueId'),
              dependencyType: SequenceStepDependencyTypes.TASK_COMPLETION
            });
          });
        }

        return state.set('saved', false);
      }

    case SequenceEditorActionTypes.SAVE_SUCCESS:
      return state.merge({
        sequence: null,
        saved: true,
        nameEdited: false
      });

    case SequenceEditorActionTypes.UPDATE_SETTINGS:
      return state.setIn(['sequence', 'sequenceSettings'], action.payload).set('saved', false);

    case SequenceEditorActionTypes.TOGGLE_DEPENDENCY:
      {
        var _action$payload6 = action.payload,
            reliesOnUniqueId = _action$payload6.reliesOnUniqueId,
            dependencyType = _action$payload6.dependencyType;
        return state.updateIn(['sequence', 'dependencies'], function (dependencies) {
          return toggleDependency({
            dependencies: dependencies,
            reliesOnUniqueId: reliesOnUniqueId,
            dependencyType: dependencyType
          });
        }).set('saved', false);
      }

    default:
      return state;
  }
});