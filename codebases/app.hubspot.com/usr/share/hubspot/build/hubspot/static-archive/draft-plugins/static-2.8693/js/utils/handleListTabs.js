'use es6';

import { RichUtils } from 'draft-js';
import { MAX_LIST_DEPTH } from '../lib/constants';
export default (function (editorState, command, keyboardEvent) {
  if (command === 'tab') {
    var newEditorState = RichUtils.onTab(keyboardEvent, editorState, MAX_LIST_DEPTH);

    if (newEditorState !== editorState) {
      return newEditorState;
    }
  }

  return undefined;
});