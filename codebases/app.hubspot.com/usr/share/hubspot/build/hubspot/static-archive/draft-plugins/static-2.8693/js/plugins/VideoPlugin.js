'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { RichUtils } from 'draft-js';
import { createPlugin } from 'draft-extend';
import VideoComponent from '../components/VideoComponent';
import { VIDEO_CONSTANTS } from '../lib/constants';
import { createInsertVideoButton } from '../components/createInsertVideoButton';
var DRAFT_ATOMIC_TYPE_VIDEO = VIDEO_CONSTANTS.DRAFT_ATOMIC_TYPE_VIDEO;
var ATOMIC_BLOCK_TYPE = 'atomic';

var diveToFirstChildOfType = function diveToFirstChildOfType(node, tag) {
  var childrenOfType = node.querySelectorAll(tag);

  if (childrenOfType.length < 1) {
    return null;
  }

  return childrenOfType[0];
};

var isVideoBlock = function isVideoBlock(node) {
  var isValidWrapper = ['FIGURE', 'BODY'].includes(node.nodeName);

  if (!isValidWrapper || node.children.length !== 3 || !node.firstChild.firstChild) {
    return false;
  }

  var maybeImageLink = diveToFirstChildOfType(node, 'a');
  var maybeImage = diveToFirstChildOfType(node.firstChild, 'img');
  var maybeTextLink = node.lastChild && node.lastChild.nodeName === 'A';
  return maybeImageLink && maybeImage && maybeTextLink;
};

var blockRendererFn = function blockRendererFn(block) {
  if (block.getType() !== ATOMIC_BLOCK_TYPE || block.getData().get('atomicType') !== DRAFT_ATOMIC_TYPE_VIDEO) {
    return undefined;
  }

  return {
    component: VideoComponent,
    editable: false
  };
};

var htmlToBlock = function htmlToBlock(nodeName, node) {
  if (!isVideoBlock(node)) {
    return undefined;
  }

  var linkNode = diveToFirstChildOfType(node, 'a');
  var thumbnailNode = diveToFirstChildOfType(node.firstChild, 'img');
  return {
    type: ATOMIC_BLOCK_TYPE,
    data: {
      url: linkNode.getAttribute('href'),
      uuid: linkNode.getAttribute('uuid'),
      // note: lowercased for html compliance
      customId: linkNode.getAttribute('customid'),
      thumbnailSrc: thumbnailNode.getAttribute('src'),
      videoTitle: thumbnailNode.getAttribute('alt'),
      atomicType: DRAFT_ATOMIC_TYPE_VIDEO,
      width: thumbnailNode.getAttribute('width')
    }
  };
};

var blockToHTML = function blockToHTML(block) {
  if (block.type !== ATOMIC_BLOCK_TYPE || block.data.atomicType !== DRAFT_ATOMIC_TYPE_VIDEO) {
    return undefined;
  }

  var _block$data = block.data,
      url = _block$data.url,
      thumbnailSrc = _block$data.thumbnailSrc,
      videoTitle = _block$data.videoTitle,
      width = _block$data.width,
      uuid = _block$data.uuid,
      customId = _block$data.customId;
  var linkProps = {
    href: url,
    rel: 'nofollow',
    target: '_blank',
    uuid: uuid,
    // note: lowercased for html compliance
    customid: customId
  };
  return /*#__PURE__*/_jsxs("figure", {
    style: {
      maxWidth: 160
    },
    "data-is-video": true,
    children: [/*#__PURE__*/_jsx("a", Object.assign({}, linkProps, {
      children: /*#__PURE__*/_jsx("img", {
        src: thumbnailSrc,
        alt: videoTitle,
        width: width
      })
    })), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx("a", Object.assign({}, linkProps, {
      children: videoTitle
    }))]
  });
};

var keyCommandListener = function keyCommandListener(editorState, command) {
  if (command === 'backspace') {
    return RichUtils.onBackspace(editorState);
  }

  return undefined;
};

export default (function () {
  return createPlugin({
    displayName: 'VideoPlugin',
    buttons: createInsertVideoButton.apply(void 0, arguments),
    blockRendererFn: blockRendererFn,
    htmlToBlock: htmlToBlock,
    blockToHTML: blockToHTML,
    keyCommandListener: keyCommandListener
  });
});