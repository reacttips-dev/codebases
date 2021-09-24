'use es6';

import { EditorState, Modifier } from 'draft-js';
import { Map as ImmutableMap, Set as ImmutableSet, List } from 'immutable';
import { pluginUtils } from 'draft-extend';
import getMissingTags from './getMissingTags';
import { getStepEmailTemplateSubject, getStepEmailTemplateBody, TEMPLATE_SUBJECT_PATH, TEMPLATE_BODY_PATH } from 'sales-modal/utils/enrollModal/stepsWithEmailTemplates';
var getEntitySelection = pluginUtils.getEntitySelection,
    getSelectedInlineStyles = pluginUtils.getSelectedInlineStyles;

var getMergeTagMap = function getMergeTagMap(erroringSteps, sequenceEnrollment) {
  var missingMergeTags = List();
  var steps = sequenceEnrollment.get('steps').reduce(function (stepList, step, index) {
    if (erroringSteps.includes(index)) {
      return stepList.push({
        step: step,
        index: index
      });
    }

    return stepList;
  }, List());
  var editorStateMap = steps.reduce(function (stepStateMap, _ref) {
    var step = _ref.step,
        index = _ref.index;
    var editorStates = ImmutableMap();
    var bodyState = getStepEmailTemplateBody(step);
    var subjectState = getStepEmailTemplateSubject(step);
    var bodyMissingMergeTags = getMissingTags(bodyState);
    var subjectMissingMergeTags = getMissingTags(subjectState);

    if (!bodyMissingMergeTags.isEmpty()) {
      editorStates = editorStates.set('body', bodyMissingMergeTags);
      missingMergeTags = missingMergeTags.push(bodyMissingMergeTags);
    }

    if (!subjectMissingMergeTags.isEmpty()) {
      editorStates = editorStates.set('subject', subjectMissingMergeTags);
      missingMergeTags = missingMergeTags.push(subjectMissingMergeTags);
    }

    return stepStateMap.set(index, editorStates);
  }, ImmutableMap());
  var listOfMissingTags = missingMergeTags.reduce(function (mergeTagsSet, mergeTagMap) {
    var keySet = ImmutableSet(mergeTagMap.keys());
    return mergeTagsSet.union(keySet);
  }, ImmutableSet());
  return ImmutableMap({
    editorStateMap: editorStateMap,
    listOfMissingTags: listOfMissingTags
  });
};

var replaceMergeTags = function replaceMergeTags(editorState, errorTagMap, mergeTagInputFields) {
  var replacedMergeTagEditorState = errorTagMap.reduce(function (updatedEditorState, entityKeys, mergeTagType) {
    if (!mergeTagInputFields.has(mergeTagType)) {
      return updatedEditorState;
    }

    var textToReplace = mergeTagInputFields.get(mergeTagType);
    return entityKeys.reduce(function (_updatedEditorState, entityKey) {
      var textSelection = getEntitySelection(_updatedEditorState, entityKey);
      var editorStateWithSelection = EditorState.forceSelection(_updatedEditorState, textSelection);
      var inlineStyles = getSelectedInlineStyles(editorStateWithSelection);
      return EditorState.push(_updatedEditorState, Modifier.replaceText(_updatedEditorState.getCurrentContent(), textSelection, textToReplace, inlineStyles), 'remove-range');
    }, updatedEditorState);
  }, editorState);
  return EditorState.acceptSelection(replacedMergeTagEditorState, editorState.getSelection());
};

export default function (_ref2) {
  var sequenceEnrollment = _ref2.sequenceEnrollment,
      mergeTagInputFields = _ref2.mergeTagInputFields,
      erroringSteps = _ref2.erroringSteps;
  var stepsWithErrors = erroringSteps.keySeq().toList();
  var mergeTagMap = getMergeTagMap(stepsWithErrors, sequenceEnrollment);
  var editorStateMap = mergeTagMap.get('editorStateMap');
  return sequenceEnrollment.update('steps', function (steps) {
    return steps.map(function (step, index) {
      if (!stepsWithErrors.includes(index)) {
        return step;
      }

      var errorTagsMap = editorStateMap.get(index);
      var bodyState = getStepEmailTemplateBody(step);
      var subjectState = getStepEmailTemplateSubject(step);
      var bodyStateErrorMap = errorTagsMap.get('body');
      var subjectStateErrorMap = errorTagsMap.get('subject');

      if (bodyStateErrorMap) {
        bodyState = replaceMergeTags(bodyState, bodyStateErrorMap, mergeTagInputFields);
      }

      if (subjectStateErrorMap) {
        subjectState = replaceMergeTags(subjectState, subjectStateErrorMap, mergeTagInputFields);
      }

      var action = step.get('action');
      step = step.setIn(TEMPLATE_BODY_PATH[action], bodyState);
      step = step.setIn(TEMPLATE_SUBJECT_PATH[action], subjectState);
      return step;
    });
  });
}