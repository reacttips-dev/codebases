'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import I18n from 'I18n';
import { EditorState, Modifier, Entity, SelectionState } from 'draft-js';
import { pluginUtils } from 'draft-extend';
import isSelectionAtomic from 'draft-plugins/utils/isSelectionAtomic';
import createMeetingEntityOptions from '../../utils/createMeetingEntityOptions';
export default (function (editorState, linkType, text, entityKey, decoratedText, linkURL) {
  var isNew = entityKey === undefined;
  var selection = editorState.getSelection();
  var currentContent = editorState.getCurrentContent();
  var currentBlockKey = selection.get('anchorKey');

  if (isSelectionAtomic(editorState)) {
    var nextBlockKey = currentContent.getKeyAfter(currentBlockKey);

    if (nextBlockKey === undefined) {
      return editorState;
    }

    selection = SelectionState.createEmpty(nextBlockKey);
  }

  var customText = true;

  if (text === undefined || text.trim().length === 0) {
    text = I18n.text("draftPlugins.meetings." + linkType);
    customText = false;
  }

  if (isNew) {
    var _editorState$getCurre;

    var meetingEntityOptions = createMeetingEntityOptions(linkType, customText, linkURL);

    var contentStateWithEntity = (_editorState$getCurre = editorState.getCurrentContent()).createEntity.apply(_editorState$getCurre, _toConsumableArray(meetingEntityOptions));

    var meetingEntityKey = contentStateWithEntity.getLastCreatedEntityKey();
    var editorStateWithEntity = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });
    var modifierMethod = selection.isCollapsed() ? Modifier.insertText : Modifier.replaceText;
    return EditorState.push(editorStateWithEntity, modifierMethod(editorStateWithEntity.getCurrentContent(), selection, text, editorStateWithEntity.getCurrentInlineStyle(), meetingEntityKey), 'insert-characters');
  }

  var entitySelection = pluginUtils.getEntitySelection(editorState, entityKey);
  var contentStateWithEntityChange = editorState.getCurrentContent();

  if (contentStateWithEntityChange.mergeEntityData) {
    contentStateWithEntityChange = editorState.getCurrentContent().mergeEntityData(entityKey, {
      type: linkType,
      customText: customText,
      linkURL: linkURL
    });
  } else {
    Entity.mergeData(entityKey, {
      type: linkType,
      customText: customText,
      linkURL: linkURL
    });
  }

  var entityStyles = pluginUtils.getSelectedInlineStyles(EditorState.forceSelection(editorState, entitySelection));

  if (text !== decoratedText) {
    var newEditorState = EditorState.push(editorState, Modifier.replaceText(editorState.getCurrentContent(), entitySelection, text, entityStyles, entityKey), 'update-entity');
    return newEditorState;
  }

  return editorState;
});