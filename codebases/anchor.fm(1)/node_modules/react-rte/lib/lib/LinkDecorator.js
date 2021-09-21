import React from 'react';
import { ENTITY_TYPE } from 'draft-js-utils';

function Link(props) {
  var _props$contentState$g = props.contentState.getEntity(props.entityKey).getData(),
      url = _props$contentState$g.url;

  return React.createElement(
    'a',
    { href: url },
    props.children
  );
}

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    if (entityKey != null) {
      var entity = contentState ? contentState.getEntity(entityKey) : null;
      return entity != null && entity.getType() === ENTITY_TYPE.LINK;
    }
    return false;
  }, callback);
}

export default {
  strategy: findLinkEntities,
  component: Link
};