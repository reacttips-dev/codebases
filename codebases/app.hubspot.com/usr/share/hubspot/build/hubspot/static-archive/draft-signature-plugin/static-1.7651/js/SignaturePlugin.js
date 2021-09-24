'use es6';

import { createPlugin } from 'draft-extend';
import SignatureComponent from './components/SignatureComponent';
var BLOCK_TYPE = 'atomic';
var ATOMIC_TYPE = 'SIGNATURE';
var DATA_ATTRIBUTE = 'data-hs-signature';

var createBlockRendererFn = function createBlockRendererFn(opts) {
  var Component = SignatureComponent(opts);
  return function (block) {
    var type = block.getType();

    if (type === BLOCK_TYPE && block.getData().get('atomicType') === ATOMIC_TYPE) {
      return {
        component: Component,
        editable: false
      };
    }
  };
};

var blockToHTML = function blockToHTML(block) {
  if (block.type === BLOCK_TYPE && block.data.atomicType === ATOMIC_TYPE) {
    return "<div " + DATA_ATTRIBUTE + "=\"true\">" + block.data.signature + "</div>";
  }
};

var htmlToBlock = function htmlToBlock(nodeName, node, lastList, inBlock) {
  if (inBlock === BLOCK_TYPE) {
    return null;
  }

  if (node.hasAttribute(DATA_ATTRIBUTE)) {
    return {
      type: BLOCK_TYPE,
      data: {
        atomicType: ATOMIC_TYPE,
        signature: node.innerHTML
      }
    };
  }
};

export default function SignaturePlugin() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return createPlugin({
    blockRendererFn: createBlockRendererFn(opts),
    blockToHTML: blockToHTML,
    htmlToBlock: htmlToBlock
  });
}