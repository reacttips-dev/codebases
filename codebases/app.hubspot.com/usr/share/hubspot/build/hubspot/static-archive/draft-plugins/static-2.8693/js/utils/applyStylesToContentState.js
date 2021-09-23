'use es6';

import { ContentBlock, EditorState, genKey, Modifier, SelectionState } from 'draft-js';
import { Map as ImmutableMap } from 'immutable';
import { STYLE_DELINEATOR } from '../lib/colors';
import { LINK_ENTITY_TYPE } from '../lib/constants';

var prependStyleToCharacter = function prependStyleToCharacter(character, style) {
  var combinedStyles = style.union(character.getStyle());
  return character.set('style', combinedStyles);
};

export default (function (editorState, contentState) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$ignoreLinkColorS = _ref.ignoreLinkColorStyle,
      ignoreLinkColorStyle = _ref$ignoreLinkColorS === void 0 ? false : _ref$ignoreLinkColorS;

  var didInsertDummyBlock = false;

  if (contentState.getBlockMap().size === 1 && contentState.getBlockMap().first().getType() === 'atomic') {
    // this is a hack to get around an issue with Draft:
    // https://github.com/facebook/draft-js/issues/1511
    var bufferBlockKey = genKey();
    var newBlockMap = contentState.getBlockMap().set(bufferBlockKey, new ContentBlock({
      key: bufferBlockKey,
      data: ImmutableMap({
        isHackPlaceholder: true
      })
    }));
    contentState = contentState.merge({
      blockMap: newBlockMap
    });
    didInsertDummyBlock = true;
  }

  var currentInlineStyle = editorState.getCurrentInlineStyle();
  var nonColorStyles = currentInlineStyle.filter(function (style) {
    return !style.includes("color" + STYLE_DELINEATOR);
  });
  var newBlocks = contentState.getBlockMap().map(function (block) {
    var charactersWithCurrentStyle = block.getCharacterList().map(function (char) {
      var charEntity = char.getEntity();
      var ignoreColor = ignoreLinkColorStyle && charEntity && contentState.getEntity(charEntity).getType() === LINK_ENTITY_TYPE;
      return prependStyleToCharacter(char, ignoreColor ? nonColorStyles : currentInlineStyle);
    });
    return block.set('characterList', charactersWithCurrentStyle);
  });
  var updatedContentState = Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), newBlocks);

  if (didInsertDummyBlock) {
    // remove the block added in our hack
    var updatedBufferBlock = updatedContentState.getBlockMap().find(function (block) {
      return block.getData().get('isHackPlaceholder');
    }); // Modifier.replaceWithFragment re-generates block keys for inserted
    // blocks, so we can't just store the original

    var blockKeyToRemove = updatedBufferBlock.getKey();
    updatedContentState = Modifier.removeRange(updatedContentState, SelectionState.createEmpty(blockKeyToRemove), 'backward');
  }

  return EditorState.push(editorState, updatedContentState, 'insert-fragment');
});