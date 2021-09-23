'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import { RichUtils } from 'draft-js';
import { createPlugin } from 'draft-extend';
import ImageComponent from '../components/ImageComponent';
import createImageMetadata from '../utils/createImageMetadata';
import { IMAGE_ATOMIC_TYPE, IMAGE_BLOCK_TYPE } from '../lib/constants';
import createImageButton from '../components/createImageButton';

var createRawBlock = function createRawBlock(image, link, align) {
  return {
    type: IMAGE_BLOCK_TYPE,
    data: createImageMetadata(image, link, align).toObject()
  };
};

var blockRendererFn = function blockRendererFn(block) {
  var type = block.getType();

  if (type === IMAGE_BLOCK_TYPE && block.getData().get('atomicType') === IMAGE_ATOMIC_TYPE) {
    return {
      component: ImageComponent,
      editable: false
    };
  }

  return undefined;
};

var isImageWrappedInLink = function isImageWrappedInLink(linkNode) {
  return linkNode !== null && linkNode.nodeName === 'A' && linkNode.firstChild !== null && linkNode.firstChild.nodeName === 'IMG';
};

var getFigureAlign = function getFigureAlign(figNode) {
  if (figNode === undefined) {
    return undefined;
  }

  return ImmutableMap({
    align: figNode.style ? figNode.style.textAlign : ''
  });
};

var getImageAttrs = function getImageAttrs(imgNode) {
  var src = imgNode.getAttribute('src');
  var width = imgNode.getAttribute('width');
  var height = imgNode.getAttribute('height');
  var style = imgNode.getAttribute('style'); // Check for images with a percentage width

  if (width === null && height === null && style && style.indexOf('width: ') !== -1) {
    var widthReg = /width: (.*?);/;
    var widthPct = widthReg.exec(style)[1];
    width = widthPct;
    height = widthPct;
  }

  return ImmutableMap({
    src: src,
    width: width,
    height: height
  });
};

var isNodeInsideVideo = function isNodeInsideVideo(node) {
  return node.closest && !!node.closest('figure[data-is-video="true"]');
};

var htmlToBlock = function htmlToBlock(nodeName, node, lastList, inBlock) {
  if (isNodeInsideVideo(node)) {
    // let VideoPlugin handle this
    return undefined;
  } // check for link


  var isLink = nodeName === 'a' && isImageWrappedInLink(node) || nodeName === 'figure' && isImageWrappedInLink(node.firstChild);

  if (isLink) {
    var figNode = nodeName === 'figure' ? node : undefined;
    var aNode = nodeName === 'figure' ? node.firstChild : node;
    var imgNode = aNode.firstChild;

    if (imgNode.nodeName !== 'IMG') {
      return undefined;
    }

    var url = aNode.getAttribute('href');
    var target = aNode.getAttribute('target');
    var isTargetBlank = target === '_blank';
    var isNoFollow = aNode.getAttribute('rel') === 'nofollow';
    var link = ImmutableMap({
      url: url,
      isTargetBlank: isTargetBlank,
      isNoFollow: isNoFollow
    });
    var image = getImageAttrs(imgNode);
    var align = getFigureAlign(figNode);
    return createRawBlock(image, link, align);
  }

  if (nodeName === 'figure' && node.firstChild !== null && node.firstChild.nodeName === 'IMG' || nodeName === 'img' && inBlock !== 'atomic') {
    var _figNode = nodeName === 'figure' ? node : undefined;

    var _imgNode = nodeName === 'figure' ? node.firstChild : node;

    var _image = getImageAttrs(_imgNode);

    var _align = getFigureAlign(_figNode);

    return createRawBlock(_image, null, _align);
  }

  return undefined;
};

var blockToHTML = function blockToHTML(block) {
  if (!(block.type === IMAGE_BLOCK_TYPE && block.data.atomicType === IMAGE_ATOMIC_TYPE)) {
    return undefined;
  }

  var _block$data = block.data,
      image = _block$data.image,
      link = _block$data.link,
      align = _block$data.align;

  var _image$toObject = image.toObject(),
      src = _image$toObject.src,
      width = _image$toObject.width,
      height = _image$toObject.height;

  var imgTag;

  var _url;

  var _isTargetBlank;

  var _isNoFollow;

  if (width !== undefined && height !== undefined) {
    imgTag = /*#__PURE__*/_jsx("img", {
      src: src,
      width: width,
      height: height
    });
  } else {
    imgTag = /*#__PURE__*/_jsx("img", {
      src: src
    });
  }

  if (link) {
    var _link$toObject = link.toObject(),
        url = _link$toObject.url,
        _link$toObject$isTarg = _link$toObject.isTargetBlank,
        isTargetBlank = _link$toObject$isTarg === void 0 ? true : _link$toObject$isTarg,
        _link$toObject$isNoFo = _link$toObject.isNoFollow,
        isNoFollow = _link$toObject$isNoFo === void 0 ? false : _link$toObject$isNoFo;

    _url = url;
    _isTargetBlank = isTargetBlank;
    _isNoFollow = isNoFollow;
  }

  if (_url && _url !== '') {
    var target = _isTargetBlank ? '_blank' : '_self';
    var rel = _isNoFollow ? 'nofollow' : null;
    imgTag = /*#__PURE__*/_jsx("a", {
      href: _url,
      target: target,
      rel: rel,
      children: imgTag
    });
  }

  var blockStyle = {
    margin: 0
  };

  if (align) {
    blockStyle.textAlign = align;
  }

  return /*#__PURE__*/_jsx("figure", {
    style: blockStyle,
    children: imgTag
  });
};

var keyCommandListener = function keyCommandListener(editorState, command) {
  if (command === 'backspace') {
    return RichUtils.onBackspace(editorState);
  }

  return undefined;
};

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$Button = _ref.Button,
      Button = _ref$Button === void 0 ? createImageButton() : _ref$Button;

  return createPlugin({
    buttons: Button,
    blockRendererFn: blockRendererFn,
    htmlToBlock: htmlToBlock,
    blockToHTML: blockToHTML,
    keyCommandListener: keyCommandListener
  });
});