'use es6';

import { Map as ImmutableMap } from 'immutable';
import { EditorState, ContentState } from 'draft-js';
import getBlocksByType from 'draft-plugins/utils/getBlocksByType';
import changeBlockData from 'draft-plugins/utils/changeBlockData';
import { BLOCK_TYPE, ATOMIC_TYPE } from 'EmailSignatureEditor/plugins/unsubscribe/UnsubscribeConstants';
import { stepHasEmailTemplateId, TEMPLATE_BODY_PATH } from 'sales-modal/utils/enrollModal/stepsWithEmailTemplates';

var removeUnsubscribeLinks = function removeUnsubscribeLinks(_ref) {
  var editorState = _ref.editorState,
      unsubscribeBlocks = _ref.unsubscribeBlocks;
  var blockKeysToRemove = unsubscribeBlocks.reduce(function (blockKeysMap, block) {
    return blockKeysMap.set(block.getKey(), null);
  }, ImmutableMap());
  var currentContent = editorState.getCurrentContent();
  var currentBlockMap = currentContent.getBlockMap();
  var updatedBlockMap = currentBlockMap.filter(function (block) {
    return !blockKeysToRemove.has(block.getKey());
  });
  var newContentState = ContentState.createFromBlockArray(updatedBlockMap.toArray());
  return EditorState.push(editorState, newContentState, 'insert-fragment');
};

export default (function (_ref2) {
  var sequenceEnrollment = _ref2.sequenceEnrollment,
      blockData = _ref2.blockData;
  return sequenceEnrollment.update('steps', function (steps) {
    return steps.map(function (step) {
      if (!stepHasEmailTemplateId(step)) {
        return step;
      }

      var action = step.get('action');
      var bodyStatePath = TEMPLATE_BODY_PATH[action];
      return step.updateIn(bodyStatePath, function (bodyState) {
        var linkType = blockData.get('linkType');
        var unsubscribeBlocks = getBlocksByType({
          editorState: bodyState,
          blockType: BLOCK_TYPE,
          atomicType: ATOMIC_TYPE
        });

        if (!linkType) {
          return removeUnsubscribeLinks({
            editorState: bodyState,
            unsubscribeBlocks: unsubscribeBlocks
          });
        }

        return unsubscribeBlocks.reduce(function (updatedEditorState, unsubscribeBlock) {
          return changeBlockData({
            editorState: updatedEditorState,
            block: unsubscribeBlock,
            updatedBlockData: blockData
          });
        }, bodyState);
      });
    });
  });
});