'use es6';

import { Map as ImmutableMap } from 'immutable';
import { cloneElement } from 'react';
import getLangLocale from 'I18n/utils/getLangLocale';
import { createPlugin } from 'draft-extend';
import UnsubscribeBlock from './unsubscribe/UnsubscribeBlock';
import unsubscribeBlockToHTML from './unsubscribe/unsubscribeBlockToHTML';
import { BLOCK_TYPE, ATOMIC_TYPE, DATA_ATTRIBUTE, LOCALE_DATA_ATTRIBUTE, LINK_TYPE_ATTRIBUTE } from './unsubscribe/UnsubscribeConstants';

var blockRendererFn = function blockRendererFn(block) {
  if (block.getType() === BLOCK_TYPE && block.getData().get('atomicType') === ATOMIC_TYPE) {
    return {
      component: UnsubscribeBlock,
      editable: false
    };
  }

  return null;
};

var blockToHTML = function blockToHTML(block) {
  if (block.type === BLOCK_TYPE && block.data.atomicType === ATOMIC_TYPE) {
    var element = unsubscribeBlockToHTML(block.data);

    if (block.text.length > 0) {
      return /*#__PURE__*/cloneElement(element, {}, null);
    }

    return element;
  }

  return null;
};

var htmlToBlock = function htmlToBlock(next) {
  return function (nodeName, node) {
    if (nodeName === 'div' && node.hasAttribute(DATA_ATTRIBUTE) && node.hasAttribute(LINK_TYPE_ATTRIBUTE)) {
      var aNode = node.getElementsByTagName('a')[0];
      return {
        type: BLOCK_TYPE,
        data: ImmutableMap({
          atomicType: ATOMIC_TYPE,
          linkType: node.getAttribute(LINK_TYPE_ATTRIBUTE),
          url: aNode ? aNode.href : null,
          locale: node.getAttribute(LOCALE_DATA_ATTRIBUTE) || getLangLocale()
        })
      };
    }

    if (node.parentNode && node.parentNode.hasAttribute(DATA_ATTRIBUTE)) {
      return null;
    }

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return next.apply(void 0, [nodeName, node].concat(args));
  };
};

export default createPlugin({
  blockRendererFn: blockRendererFn,
  blockToHTML: blockToHTML,
  htmlToBlock: htmlToBlock
});