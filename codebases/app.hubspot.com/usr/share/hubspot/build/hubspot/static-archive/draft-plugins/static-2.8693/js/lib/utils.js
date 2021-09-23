'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import bender from 'hubspot.bender';
export var buildTag = function buildTag(tagName, contents) {
  var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var attrStr = '';

  if (Object.keys(attrs).length) {
    attrStr = Object.keys(attrs).filter(function (k) {
      return attrs[k];
    }).map(function (k) {
      return k + "=\"" + attrs[k] + "\"";
    }).join(' ');

    if (attrStr.length) {
      attrStr = " " + attrStr;
    }
  }

  return "<" + tagName + attrStr + ">" + contents + "</" + tagName + ">";
};
export function memoize(func) {
  var _cache = ImmutableMap();

  return function () {
    var argList = List.of.apply(List, arguments);

    if (!_cache.has(argList)) {
      _cache = _cache.set(argList, func.apply(void 0, arguments));
    }

    return _cache.get(argList);
  };
}
export function getImage() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return bender.staticDomainPrefix + "/draft-plugins/static-2.8693/images/" + path;
}
export var toggleInlineStyleOverride = function toggleInlineStyleOverride(editorState, styleLookupSet) {
  var currentInlineStyleOverride = editorState.getInlineStyleOverride();

  if (currentInlineStyleOverride === null) {
    currentInlineStyleOverride = editorState.getCurrentInlineStyle();
  }

  return currentInlineStyleOverride.subtract(styleLookupSet);
};
export function ensureUrlHasProtocol(url) {
  var trimmed = url.trim();

  if (!url || !trimmed) {
    return url;
  }

  var hasProtocol = trimmed.includes('://') || trimmed.includes('tel:') || trimmed.includes('mailto:');

  if (hasProtocol) {
    return url;
  }

  return "http://" + url;
}
export function encodeUrl(url) {
  var anchor = document.createElement('a');
  anchor.href = url;
  anchor.pathname = decodeURIComponent(anchor.pathname);
  return anchor.href;
}
export function isInternal() {
  return !window.location.hostname.includes('app.hubspot');
}
export function getImageDimensions(blob) {
  var image = new Image();
  image.src = blob;
  return new Promise(function (resolve) {
    image.onload = function () {
      resolve({
        width: this.width,
        height: this.height
      });
    };
  });
}