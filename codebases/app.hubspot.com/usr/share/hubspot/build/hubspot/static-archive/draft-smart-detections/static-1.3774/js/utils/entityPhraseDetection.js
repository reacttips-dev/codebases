'use es6';

import phraseDetection from './phraseDetection';
export default (function (editorState, phrases, entityType) {
  var contentState = editorState.getCurrentContent();

  var doesMeetingEntityExist = function doesMeetingEntityExist(contentBlock) {
    var entityCount = 0;
    contentBlock.findEntityRanges(function (char) {
      var entityKey = char.getEntity();
      return char.getEntity() !== null && contentState.getEntity(entityKey).getType() === entityType;
    }, function () {
      entityCount += 1;
    });
    return entityCount > 0;
  };

  return phraseDetection(editorState, phrases, doesMeetingEntityExist);
});