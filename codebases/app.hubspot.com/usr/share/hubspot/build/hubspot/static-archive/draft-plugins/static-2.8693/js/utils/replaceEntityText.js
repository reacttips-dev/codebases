'use es6';

import replaceSelectionWithText from 'draft-plugins/utils/replaceSelectionWithText';
import { replaceSelectionChangeTypes } from 'draft-plugins/lib/constants';
export default (function (_ref) {
  var editorState = _ref.editorState,
      data = _ref.data,
      dataFind = _ref.dataFind,
      entityType = _ref.entityType;
  var contentState = editorState.getCurrentContent();
  var blockArray = contentState.getBlocksAsArray();
  var ranges = [];
  blockArray.forEach(function (block) {
    block.findEntityRanges(function (char) {
      var entityKey = char.getEntity();
      return entityKey !== null && contentState.getEntity(entityKey).getType() === entityType;
    }, function (start, end) {
      ranges.push({
        block: block,
        start: start,
        end: end
      });
    });
  });
  return ranges.reduceRight(function (updatedEditorState, _ref2) {
    var block = _ref2.block,
        start = _ref2.start,
        end = _ref2.end;
    var text = block.getText();
    var originalString = text.slice(start, end);
    var entityKey = block.getEntityAt(start);
    var inlineStyles = block.getInlineStyleAt(start);
    var getEntityForUpdatedState = updatedEditorState.getCurrentContent().getEntity;
    var entity = getEntityForUpdatedState(entityKey);
    var option = dataFind(data, entity);

    if (option && option.text !== originalString) {
      return replaceSelectionWithText({
        start: start,
        end: end,
        entityKey: entityKey,
        inlineStyles: inlineStyles,
        blockKey: block.getKey(),
        editorState: updatedEditorState,
        text: option.text,
        changeType: replaceSelectionChangeTypes.SET
      });
    }

    return updatedEditorState;
  }, editorState);
});