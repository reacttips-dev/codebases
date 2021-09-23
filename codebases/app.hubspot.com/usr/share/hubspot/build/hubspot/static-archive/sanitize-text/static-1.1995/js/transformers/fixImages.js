'use es6';

import memoize from 'transmute/memoize';
import { secureDocument } from '../sanitizers/SanitizeConfiguration';
import { BATTLESHIP } from 'HubStyleTokens/colors';
import I18n from 'I18n';
/**
 *  /S*       - matches any non-whitespace character zero to unlimited times
 *  cdn2      - matches cdn2 literally (case-sensitive)
 *  \.        - matches character . literally (case-sensitive)
 *  net       - matches net literally (case-sensitive)
 *  (qa)?     - matches qa 0 or 1 times
 *  /thumb    - matches /thumb literally (case-sensitive)
 *  [a-zA-Z]+ - match a single character in the range one or more times
 */

var HUBSPOT_HOSTED_THUMBNAIL_REGEX = /\S*cdn2\.hubspot(qa)?\.net\S*\/thumb\.[a-zA-Z]+$/;
var THUMB_REGEX = /\/thumb\.[a-zA-Z]+$/;
var BASE_64_REGEX = /data:/;
export var isLinkToThumbnail = memoize(function (src) {
  return HUBSPOT_HOSTED_THUMBNAIL_REGEX.test(src);
});
var isBase64 = memoize(function (src) {
  return BASE_64_REGEX.test(src);
});

var errorStyling = function errorStyling(height) {
  return "\n  border: 1px solid " + BATTLESHIP + ";\n  justify-content: center;\n  padding: 20px;\n  display: flex;\n  align-items: center;\n  height: " + (height ? height + "px" : 'auto') + ";\n  width: 100%;\n";
};

var errorMessage = memoize(function (height) {
  return "<h3 style=\"" + errorStyling(height) + "\">" + I18n.text('sanitizedEmail.imageError') + "</h3>\n  ";
});
export var fixImages = function fixImages(_ref) {
  var node = _ref.node,
      node_name = _ref.node_name;

  if (node && node_name === 'img' && node.attributes) {
    var src = node.getAttribute('src');

    if (isBase64(src) && src.length > 2000) {
      var height = node.getAttribute('height');
      var wrapper = secureDocument.createElement('div');
      wrapper.innerHTML = errorMessage(height);
      return {
        node: wrapper
      };
    }
    /**
     * TEMPORARY: Remove "/thumb.<extension>" from "src" so that we point to the full size image.
     *
     * Once https://git.hubteam.com/HubSpot/ConnectedEmail/issues/357 is done,
     * all image "src"s will be backfilled to point to the full size image
     *
     *  */


    if (isLinkToThumbnail(src)) {
      node.setAttribute('src', src.replace(THUMB_REGEX, ''));
    }
    /**
     * TEMPORARY: Overwrite the image width with the full size image width
     *
     * Once https://git.hubteam.com/HubSpot/ConnectedEmail/issues/357 is done,
     * the height and width attributes will be set
     *
     *  */


    if (node.attributes['data-original-width']) {
      node.setAttribute('width', node.attributes['data-original-width'].value);
    }
    /**
     * TEMPORARY: Overwrite the image width with the full size image width
     *
     * Once https://git.hubteam.com/HubSpot/ConnectedEmail/issues/357 is done,
     * the height and width attributes will be set
     *
     *  */


    if (node.attributes['data-original-height']) {
      node.setAttribute('height', node.attributes['data-original-height'].value);
    }

    return {
      node: node
    };
  }

  return null;
};