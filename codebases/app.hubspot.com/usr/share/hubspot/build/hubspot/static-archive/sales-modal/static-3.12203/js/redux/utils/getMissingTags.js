'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import memoize from 'transmute/memoize';
import { pluginUtils } from 'draft-extend';
import { ENTITY_TYPE } from 'sales-modal/utils/enrollModal/missingMergeTags';
var entityStrategy = pluginUtils.entityStrategy;

var getMissingTags = function getMissingTags(editorState) {
  if (editorState === null || editorState === undefined) {
    return ImmutableMap();
  }

  var contentState = editorState.getCurrentContent();
  return contentState.getBlockMap().reduce(function (mergeTagTypeMap, contentBlock) {
    entityStrategy(ENTITY_TYPE)(contentBlock, function (offset) {
      var entityKey = contentBlock.getEntityAt(offset);

      var _contentState$getEnti = contentState.getEntity(entityKey).getData(),
          type = _contentState$getEnti.type;

      if (!mergeTagTypeMap.has(type)) {
        mergeTagTypeMap = mergeTagTypeMap.set(type, ImmutableSet());
      }

      var contentBlockSet = mergeTagTypeMap.get(type);
      mergeTagTypeMap = mergeTagTypeMap.set(type, contentBlockSet.add(entityKey));
    }, contentState);
    return mergeTagTypeMap;
  }, ImmutableMap());
};

export default memoize(getMissingTags);