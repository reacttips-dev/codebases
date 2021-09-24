'use es6';

import { createSelector } from 'reselect';
import { getIsPrimarySequence } from './EnrollmentStateSelectors';
import { Editor } from 'draft-extend';
import StripButtonsAndOverlaysPlugin from 'draft-plugins/plugins/StripButtonsAndOverlaysPlugin';
import { getEditableTemplateBodyEditorPlugins } from './TemplateEditorSelectors';
var getEditableTaskBodyEditorPlugins = getEditableTemplateBodyEditorPlugins;
var getEditableTaskBodyEditor = createSelector([getEditableTaskBodyEditorPlugins], function (editorPlugins) {
  return editorPlugins(Editor);
});
var getReadOnlyTaskBodyEditor = createSelector([getEditableTaskBodyEditorPlugins], function (editorPlugins) {
  return StripButtonsAndOverlaysPlugin(editorPlugins)(Editor);
});

var isReadOnlySelector = function isReadOnlySelector(state, ownProps) {
  return ownProps.readOnly || false;
};

export var getTaskBodyEditor = createSelector([getIsPrimarySequence, getEditableTaskBodyEditor, getReadOnlyTaskBodyEditor, isReadOnlySelector], function (isPrimarySequence, editableTaskBodyEditor, readOnlyTaskBodyEditor, isReadOnly) {
  return isPrimarySequence || isReadOnly ? readOnlyTaskBodyEditor : editableTaskBodyEditor;
});