'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { Map as ImmutableMap, List } from 'immutable';
import { EditorState, ContentState, ContentBlock, genKey } from 'draft-js';
import { BLOCK_TYPE, ATOMIC_TYPE } from './UnsubscribeConstants';

var getEmptyBlock = function getEmptyBlock() {
  return new ContentBlock({
    key: genKey(),
    type: 'unstyled',
    text: '',
    characterList: List()
  });
};

var createBlock = function createBlock(data) {
  return new ContentBlock({
    key: genKey(),
    type: BLOCK_TYPE,
    text: '',
    characterList: List(),
    data: ImmutableMap(Object.assign({}, data, {
      atomicType: ATOMIC_TYPE
    }))
  });
};

export default (function (_ref) {
  var editorState = _ref.editorState,
      data = _ref.data;
  var contentState = editorState.getCurrentContent();
  var blockArray = contentState.getBlocksAsArray();
  var newBlockArray = [].concat(_toConsumableArray(blockArray), [createBlock(data), getEmptyBlock()]);
  var newContentState = ContentState.createFromBlockArray(newBlockArray);
  return EditorState.push(editorState, newContentState, 'insert-fragment');
});