'use es6';

import { Map as ImmutableMap, fromJS } from 'immutable';
import I18n from 'I18n';
import { EditorState } from 'draft-js';
import { convertFromHTML } from 'draft-convert';
import once from 'transmute/once';
import uniqueId from 'hs-lodash/uniqueId';
import PortalIdParser from 'PortalIdParser';
import compose from 'transmute/compose';
import GateContainer from 'SequencesUI/data/GateContainer';
import ScopeContainer from 'SequencesUI/data/ScopeContainer';
import * as TaskTypes from 'customer-data-objects/engagement/TaskTypes';
import { DAY } from 'SequencesUI/constants/Milliseconds';
import { DEFAULT_PRIORITY, DEFAULT_TASK_TYPE } from 'SequencesUI/util/taskDataObjects';
import * as SequenceStepTypes from 'SequencesUI/constants/SequenceStepTypes';
import getEditorPlugins from 'SalesTemplateEditor/plugins/compositePlugins/getEditorPlugins';
import * as SequenceStepDependencyTypes from 'SequencesUI/constants/SequenceStepDependencyTypes';
import getDefaultSequenceSettings from 'SequencesUI/constants/getDefaultSequenceSettings';
var getPlugins = once(function () {
  var gates = GateContainer.get();
  var scopes = ScopeContainer.get();
  return {
    bodyPlugins: getEditorPlugins('bodyPlugins', true, gates, true, scopes),
    subjectPlugins: getEditorPlugins('subjectPlugins', true, gates, false, scopes)
  };
});
export var daysToMilliseconds = function daysToMilliseconds(days) {
  return days * DAY;
};

var fixTokens = function fixTokens(string) {
  return string.replace(/{.{./g, '{{').replace(/.}.}/g, '}}');
};

export var getEditorState = function getEditorState(_ref) {
  var text = _ref.text,
      pluginType = _ref.pluginType,
      bodyFromHTML = _ref.bodyFromHTML,
      subjectFromHTML = _ref.subjectFromHTML;
  var fromHTML = pluginType === 'body' ? bodyFromHTML : subjectFromHTML;
  return EditorState.createWithContent(fromHTML(text.replace(/(\r\n|\n|\r)/gm, '<br />')));
};

var buildSubjectEditorState = function buildSubjectEditorState(_ref2) {
  var subject = _ref2.subject,
      bodyFromHTML = _ref2.bodyFromHTML,
      subjectFromHTML = _ref2.subjectFromHTML;
  var text = fixTokens(subject);
  return getEditorState({
    text: text,
    pluginType: 'subject',
    bodyFromHTML: bodyFromHTML,
    subjectFromHTML: subjectFromHTML
  });
};

var buildBodyEditorState = function buildBodyEditorState(_ref3) {
  var body = _ref3.body,
      bodyFromHTML = _ref3.bodyFromHTML,
      subjectFromHTML = _ref3.subjectFromHTML;
  var text = fixTokens(body);
  return getEditorState({
    text: text,
    pluginType: 'body',
    bodyFromHTML: bodyFromHTML,
    subjectFromHTML: subjectFromHTML
  });
};

var buildTemplateData = function buildTemplateData(name, subject, body) {
  var _getPlugins = getPlugins(),
      bodyPlugins = _getPlugins.bodyPlugins,
      subjectPlugins = _getPlugins.subjectPlugins;

  var bodyFromHTML = bodyPlugins(convertFromHTML);
  var subjectFromHTML = subjectPlugins(convertFromHTML);
  return ImmutableMap({
    name: fixTokens(name),
    body: fixTokens(body),
    subject: fixTokens(subject),
    bodyEditorState: buildBodyEditorState({
      body: body,
      bodyFromHTML: bodyFromHTML,
      subjectFromHTML: subjectFromHTML
    }),
    subjectEditorState: buildSubjectEditorState({
      subject: subject,
      bodyFromHTML: bodyFromHTML,
      subjectFromHTML: subjectFromHTML
    })
  });
};

var buildTaskPayload = function buildTaskPayload(_ref4) {
  var subject = _ref4.subject,
      notes = _ref4.notes,
      _ref4$taskType = _ref4.taskType,
      taskType = _ref4$taskType === void 0 ? DEFAULT_TASK_TYPE : _ref4$taskType,
      _ref4$priority = _ref4.priority,
      priority = _ref4$priority === void 0 ? DEFAULT_PRIORITY : _ref4$priority;
  return fromJS({
    action: SequenceStepTypes.SCHEDULE_TASK,
    actionMeta: {
      taskMeta: {
        subject: I18n.text(subject),
        notes: notes ? I18n.text(notes) : undefined,
        taskType: taskType,
        priority: priority
      }
    }
  });
};

export var createTemplateNode = function createTemplateNode(_ref5, delay) {
  var name = _ref5.name,
      subject = _ref5.subject,
      body = _ref5.body;
  return function () {
    return {
      action: SequenceStepTypes.SEND_TEMPLATE,
      data: buildTemplateData(I18n.text(name), I18n.text(subject), I18n.text(body)),
      delay: delay
    };
  };
};
export var createTaskNode = function createTaskNode(taskData, delay) {
  return function () {
    var data;

    if (taskData.taskType === TaskTypes.EMAIL) {
      var _taskData$templateDat = taskData.templateData,
          name = _taskData$templateDat.name,
          subject = _taskData$templateDat.subject,
          body = _taskData$templateDat.body;
      data = buildTemplateData(I18n.text(name), I18n.text(subject), I18n.text(body));
    }

    return {
      action: SequenceStepTypes.SCHEDULE_TASK,
      payload: buildTaskPayload(taskData),
      data: data,
      delay: delay
    };
  };
};
export var createFinishNode = function createFinishNode() {
  return {
    action: SequenceStepTypes.FINISH_ENROLLMENT,
    delay: 0
  };
};

var buildSteps = function buildSteps(steps) {
  return steps.map(function (_ref6, stepOrder) {
    var action = _ref6.action,
        payload = _ref6.payload,
        delay = _ref6.delay;
    var taskMeta = action === SequenceStepTypes.SCHEDULE_TASK ? payload.getIn(['actionMeta', 'taskMeta']).toObject() : null;
    return {
      action: action,
      actionMeta: {
        taskMeta: taskMeta,
        templateMeta: null
      },
      delay: delay,
      dependencies: [],
      stepOrder: stepOrder,
      uniqueId: uniqueId()
    };
  });
};

var addStepDependencies = function addStepDependencies(steps) {
  return steps.reduce(function (_steps, _ref7, stepOrder) {
    var action = _ref7.action;
    var isLastStep = stepOrder === steps.size - 1;
    var isTask = action === SequenceStepTypes.SCHEDULE_TASK;

    if (!isTask || isLastStep) {
      return _steps;
    }

    var reliesOnStepOrder = stepOrder;
    var requiredByStepOrder = stepOrder + 1;

    var requiredByStep = _steps.get(requiredByStepOrder);

    requiredByStep.dependencies.push({
      reliesOnStepOrder: reliesOnStepOrder,
      requiredByStepOrder: requiredByStepOrder,
      portalId: PortalIdParser.get(),
      dependencyType: SequenceStepDependencyTypes.TASK_COMPLETION
    });
    return _steps.set(requiredByStepOrder, requiredByStep);
  }, steps);
};

export var configureSteps = compose(addStepDependencies, buildSteps);
export var getEmptySequence = function getEmptySequence() {
  var finishStep = createFinishNode();
  return fromJS({
    id: 'new',
    name: I18n.text('edit.new'),
    steps: buildSteps([finishStep]),
    delays: [finishStep.delay],
    dependencies: {},
    sequenceSettings: getDefaultSequenceSettings()
  });
};