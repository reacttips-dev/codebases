'use es6';

import { EditorState, ContentState } from 'draft-js';
export function sliceBlocks(editorState, startIndex, endIndex) {
  return EditorState.push(editorState, ContentState.createFromBlockArray(editorState.getCurrentContent().getBlocksAsArray().slice(startIndex, endIndex)), 'remove-range');
}
export function setBlockTypes(editorState, blockType) {
  var newContentState = ContentState.createFromBlockArray(editorState.getCurrentContent().getBlocksAsArray().map(function (block) {
    return block.set('type', blockType);
  }));
  return EditorState.push(editorState, newContentState, 'change-block-type');
}
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}