'use es6';

import { Modifier, SelectionState } from 'draft-js';
export default (function (block, contentState) {
  var blockKey = block.getKey();
  var replaceSelection = SelectionState.createEmpty(blockKey).merge({
    focusOffset: block.getLength()
  });
  return Modifier.replaceText(contentState, replaceSelection, block.getText());
});