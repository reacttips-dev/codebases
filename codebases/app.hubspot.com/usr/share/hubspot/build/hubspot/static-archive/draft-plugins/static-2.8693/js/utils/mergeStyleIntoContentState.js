'use es6';

import { CharacterMetadata } from 'draft-js';
import { OrderedSet } from 'immutable';
import { STYLE_DELINEATOR } from '../lib/colors';
import { LINK_ENTITY_TYPE } from '../lib/constants';
/**
 * Apply `styles` to `contentState` with a preference for exisiting styles:
 * the new styles get added to the start of each CharacterMetaData's OrderedMap
 * of styles, meaning that they will be overridden by any styles of the same type
 * (e.g. background-color) that already exist
 */

export default (function (contentState, styles) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$ignoreLinkColorS = _ref.ignoreLinkColorStyle,
      ignoreLinkColorStyle = _ref$ignoreLinkColorS === void 0 ? false : _ref$ignoreLinkColorS;

  if (!styles || !(OrderedSet.isOrderedSet(styles) && styles.size > 0)) {
    return contentState;
  }

  var contentBlocksWithStyles = contentState.getBlockMap().map(function (block) {
    return block.set('characterList', block.getCharacterList().map(function (char) {
      var currentStyles = char.getStyle();
      var nonColorDefaultStyles = styles.filter(function (style) {
        return !style.includes("color" + STYLE_DELINEATOR);
      });
      var charEntity = char.getEntity();
      var ignoreColor = ignoreLinkColorStyle && charEntity && contentState.getEntity(charEntity).getType() === LINK_ENTITY_TYPE; // `styles` first so it gets overridden where necessary

      var mergedStyles = (ignoreColor ? nonColorDefaultStyles : styles).union(currentStyles);
      var charWithoutStyles = char;
      currentStyles.forEach(function (style) {
        charWithoutStyles = CharacterMetadata.removeStyle(charWithoutStyles, style);
      });
      var charWithAllStyles = charWithoutStyles;
      mergedStyles.forEach(function (style) {
        charWithAllStyles = CharacterMetadata.applyStyle(charWithAllStyles, style);
      });
      return charWithAllStyles;
    }));
  });
  return contentState.merge({
    blockMap: contentBlocksWithStyles
  });
});