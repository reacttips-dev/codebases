import ImageSpan from '../ui/ImageSpan';
import { ENTITY_TYPE } from 'draft-js-utils';

function findImageEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    if (entityKey != null) {
      var entity = contentState ? contentState.getEntity(entityKey) : null;
      return entity != null && entity.getType() === ENTITY_TYPE.IMAGE;
    }
    return false;
  }, callback);
}

export default {
  strategy: findImageEntities,
  component: ImageSpan
};