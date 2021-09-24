'use es6';

import { Map as ImmutableMap } from 'immutable';
export default (function (editorState, phrases, shouldSkip) {
  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap();
  var foundPhrase = null;
  var foundSkipEntity = false;
  blockMap.forEach(function (contentBlock) {
    var blockKey = contentBlock.getKey();
    var blockText = contentBlock.getText().toLowerCase();

    if (shouldSkip(contentBlock, contentState)) {
      foundSkipEntity = true;
    }

    return phrases.forEach(function (_phrase) {
      var regex = new RegExp("\\b" + _phrase + ".*?\\b");
      var result = regex.exec(blockText);

      if (result !== null) {
        var text = result[0];
        var offset = result.index;
        foundPhrase = ImmutableMap({
          offset: offset,
          blockKey: blockKey,
          phrase: text
        });
      }
    });
  });

  if (foundSkipEntity) {
    return null;
  }

  return foundPhrase;
});