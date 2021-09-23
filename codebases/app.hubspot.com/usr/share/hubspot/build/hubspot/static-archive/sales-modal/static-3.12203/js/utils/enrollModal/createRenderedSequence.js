/* eslint-disable consistent-return */
'use es6';

import Raven from 'Raven';
import compose from 'transmute/compose';
import isEmpty from 'transmute/isEmpty';
import once from 'transmute/once';
import { Map as ImmutableMap } from 'immutable';
import { EditorState } from 'draft-js';
import { convertFromHTML } from 'draft-convert';
import insertAtomicBlockWithData from 'draft-plugins/utils/insertAtomicBlockWithData';
import insertUnsubscribeBlock from 'EmailSignatureEditor/plugins/unsubscribe/insertUnsubscribeBlock';
import getBodyConversionPlugins from 'sales-modal/components/enrollModal/plugins/bodyConversionPlugins';
import getSubjectConversionPlugins from 'sales-modal/components/enrollModal/plugins/subjectConversionPlugins';
import { SCHEDULE_TASK } from 'sales-modal/constants/SequenceStepTypes';
import { escape } from 'draft-plugins/lib/escapers';
import { stepHasEmailTemplateId, getStepEmailTemplateId, getStepEmailTemplateSubject, getStepEmailTemplateBody, EMAIL_TEMPLATE_META_PATH, TEMPLATE_SUBJECT_PATH } from 'sales-modal/utils/enrollModal/stepsWithEmailTemplates';
import getEditorPlugins from 'SalesTemplateEditor/plugins/compositePlugins/getEditorPlugins';
import SignaturePlugin from 'draft-signature-plugin/SignaturePlugin';
import SignatureUnsubscribePlugin from 'EmailSignatureEditor/plugins/SignatureUnsubscribePlugin';
import { EnrollTypes } from '../../constants/EnrollTypes';
var ATOMIC_TYPE = 'SIGNATURE';
var bodyFromHTMLBeta = getBodyConversionPlugins()(convertFromHTML);
var subjectFromHTML = getSubjectConversionPlugins()(convertFromHTML);
var signaturePlugins = [SignaturePlugin({
  allowEditing: false
}), SignatureUnsubscribePlugin];
var bodyFromHTMLReadOnly = once(function (_ref) {
  var gates = _ref.gates,
      scopes = _ref.scopes;

  if (isEmpty(gates) || isEmpty(scopes)) {
    Raven.captureMessage('Called bodyFromHTMLReadOnly without gates or scopes', {
      extra: {
        gates: gates,
        scopes: scopes
      }
    });
  }

  return compose.apply(void 0, [getEditorPlugins('bodyPlugins', true, gates, true, scopes)].concat(signaturePlugins))(convertFromHTML);
});
var subjectFromHTMLReadOnly = once(function (_ref2) {
  var gates = _ref2.gates,
      scopes = _ref2.scopes;
  return getEditorPlugins('subjectPlugins', true, gates, true, scopes)(convertFromHTML);
});

var createMetadata = function createMetadata(signature) {
  return ImmutableMap({
    signature: signature,
    atomicType: ATOMIC_TYPE
  });
};

var updateStepEditorState = function updateStepEditorState(step, updateTemplateBody) {
  if (stepHasEmailTemplateId(step)) {
    return step.updateIn(EMAIL_TEMPLATE_META_PATH[step.get('action')], function (emailTemplateMeta) {
      if (!emailTemplateMeta.get('body')) {
        return emailTemplateMeta;
      }

      return emailTemplateMeta.update('body', updateTemplateBody);
    });
  } else {
    return step;
  }
};

var getRenderedTemplate = function getRenderedTemplate(templateId, renderedTemplates) {
  var renderedTemplate = renderedTemplates && renderedTemplates.get(templateId.toString());

  if (!renderedTemplate) {
    return {
      hasRenderedTemplate: false
    };
  }

  var subject = renderedTemplate.get('subject').replace(/&nbsp;/, '&amp;nbsp;');
  var html = renderedTemplate.get('html') || renderedTemplate.get('body');
  var body = html.replace(/(\r\n|\n|\r)/gm, '<br />');
  return {
    subject: subject,
    body: body,
    hasRenderedTemplate: true
  };
};

var insertRenderedTemplatesIntoSequence = function insertRenderedTemplatesIntoSequence(renderedTemplates) {
  return function (step) {
    var action = step.get('action');

    if (stepHasEmailTemplateId(step)) {
      var templateId = getStepEmailTemplateId(step);

      var _getRenderedTemplate = getRenderedTemplate(templateId, renderedTemplates),
          subject = _getRenderedTemplate.subject,
          body = _getRenderedTemplate.body,
          hasRenderedTemplate = _getRenderedTemplate.hasRenderedTemplate;

      if (hasRenderedTemplate) {
        step = step.updateIn(EMAIL_TEMPLATE_META_PATH[action], function (emailTemplateMeta) {
          return emailTemplateMeta.set('subject', subject).set('body', body);
        });
      }
    } // For tasks that don't have a subject, we show a rich text editor
    // that expects the editor state to already be initialized


    if (action === SCHEDULE_TASK) {
      step = step.updateIn(['actionMeta', 'taskMeta'], function (taskMeta) {
        if (!taskMeta.get('subject')) {
          var richText = taskMeta.get('notes');
          return taskMeta.set('notes', richText.replace(/(\r\n|\n|\r)/gm, '<br />'));
        } else {
          return taskMeta;
        }
      });
    }

    return step;
  };
};

export var createEditorStatesForSequence = function createEditorStatesForSequence(_ref3) {
  var isPrimarySequence = _ref3.isPrimarySequence,
      _ref3$gates = _ref3.gates,
      gates = _ref3$gates === void 0 ? {} : _ref3$gates,
      scopes = _ref3.scopes,
      enrollType = _ref3.enrollType;
  return function (step) {
    var action = step.get('action');
    var readOnly = isPrimarySequence || enrollType === EnrollTypes.VIEW;

    if (stepHasEmailTemplateId(step)) {
      var subject = getStepEmailTemplateSubject(step);
      var body = getStepEmailTemplateBody(step);

      if (subject !== null && subject !== undefined && body !== null && body !== undefined) {
        var bodyConverter = readOnly ? bodyFromHTMLReadOnly({
          gates: gates,
          scopes: scopes
        }) : bodyFromHTMLBeta;
        var subjectConverter = readOnly ? subjectFromHTMLReadOnly({
          gates: gates,
          scopes: scopes
        }) : subjectFromHTML; // TODO: This is a performance bottleneck for us.
        // We see about a 100% improvement in performance when we don't have to convert
        // HTML into editorState

        var subjectState = EditorState.createWithContent(subjectConverter(escape(subject)));
        var bodyState = EditorState.createWithContent(bodyConverter(body));
        step = step.updateIn(EMAIL_TEMPLATE_META_PATH[action], function (emailTemplateMeta) {
          return emailTemplateMeta.set('subject', subjectState).set('body', bodyState).set('originalBodyText', bodyState.getCurrentContent().getPlainText());
        });
      }
    } // For tasks that don't have a subject, we show a rich text editor
    // that expects the editor state to already be initialized


    if (step.get('action') === SCHEDULE_TASK) {
      step = step.updateIn(['actionMeta', 'taskMeta'], function (taskMeta) {
        // Edits don't go through `insertRenderedTemplatesIntoSequence` first
        if (!taskMeta.get('subject')) {
          var richText = taskMeta.get('notes');

          var _bodyConverter = readOnly ? bodyFromHTMLReadOnly({
            gates: gates,
            scopes: scopes
          }) : bodyFromHTMLBeta;

          return taskMeta.set('notes', EditorState.createWithContent(_bodyConverter(richText)));
        } else {
          return taskMeta;
        }
      });
    }

    return step;
  };
};
export var addSignatureToSteps = function addSignatureToSteps(_ref4) {
  var signature = _ref4.signature;
  return function (step) {
    var signatureMetaData = createMetadata(signature);
    return updateStepEditorState(step, function (body) {
      var originalBodySelection = body.getSelection();
      body = EditorState.moveSelectionToEnd(body);
      body = insertAtomicBlockWithData(body, signatureMetaData, true);
      return EditorState.acceptSelection(body, originalBodySelection);
    });
  };
};
export var addUnsubscribeLinkToSteps = function addUnsubscribeLinkToSteps(_ref5) {
  var unsubscribeLink = _ref5.unsubscribeLink,
      unsubscribeLinkType = _ref5.unsubscribeLinkType;
  return function (step) {
    if (!unsubscribeLinkType || unsubscribeLinkType === 'NO_UNSUBSCRIBE_LINK') {
      return step;
    }

    return updateStepEditorState(step, function (editorState) {
      return insertUnsubscribeBlock({
        editorState: editorState,
        data: {
          linkType: unsubscribeLinkType,
          url: unsubscribeLink
        }
      });
    });
  };
};
export var focusFirstStepInput = function focusFirstStepInput(step) {
  if (step.get('stepOrder') !== 0) {
    return step;
  } else if (stepHasEmailTemplateId(step)) {
    var subjectPath = TEMPLATE_SUBJECT_PATH[step.get('action')];
    return step.updateIn(subjectPath, function (subject) {
      if (subject) {
        return EditorState.moveFocusToEnd(subject);
      }
    });
  } else if (step.get('action') === SCHEDULE_TASK) {
    var subject = step.getIn(['actionMeta', 'taskMeta', 'subject']);
    var richTextTask = step.getIn(['actionMeta', 'taskMeta', 'notes']);

    if (richTextTask && !subject) {
      return step.updateIn(['actionMeta', 'taskMeta', 'notes'], function (notes) {
        if (notes) {
          return EditorState.moveFocusToEnd(notes);
        }
      });
    }

    return step;
  } else {
    return step;
  }
};
export var cacheOriginalStates = function cacheOriginalStates(step) {
  if (stepHasEmailTemplateId(step)) {
    return step.updateIn(EMAIL_TEMPLATE_META_PATH[step.get('action')], function (emailTemplateMeta) {
      return emailTemplateMeta.set('originalBody', emailTemplateMeta.get('body')).set('originalSubject', emailTemplateMeta.get('subject'));
    });
  } else {
    return step;
  }
};
export var createRenderedEditedSequence = function createRenderedEditedSequence(_ref6) {
  var sequenceEnrollment = _ref6.sequenceEnrollment,
      gates = _ref6.gates,
      scopes = _ref6.scopes,
      enrollType = _ref6.enrollType;
  var updateStep = compose(cacheOriginalStates, focusFirstStepInput, createEditorStatesForSequence({
    isPrimarySequence: false,
    gates: gates,
    scopes: scopes,
    enrollType: enrollType
  }));
  return sequenceEnrollment.update('steps', function (steps) {
    return steps.map(updateStep);
  });
};
export var createRenderedSequence = function createRenderedSequence(_ref7) {
  var sequence = _ref7.sequence,
      signature = _ref7.signature,
      unsubscribeLink = _ref7.unsubscribeLink,
      unsubscribeLinkType = _ref7.unsubscribeLinkType,
      renderedTemplates = _ref7.renderedTemplates,
      gates = _ref7.gates,
      scopes = _ref7.scopes,
      isPrimarySequence = _ref7.isPrimarySequence,
      enrollType = _ref7.enrollType;
  var updateStep = compose(cacheOriginalStates, focusFirstStepInput, addUnsubscribeLinkToSteps({
    unsubscribeLink: unsubscribeLink,
    unsubscribeLinkType: unsubscribeLinkType
  }), addSignatureToSteps({
    signature: signature
  }), createEditorStatesForSequence({
    isPrimarySequence: isPrimarySequence,
    gates: gates,
    scopes: scopes,
    enrollType: enrollType
  }), insertRenderedTemplatesIntoSequence(renderedTemplates));
  return sequence.update('steps', function (steps) {
    return steps.map(updateStep);
  });
};