'use es6';

import Url from 'urlinator/Url';
import PortalIdParser from 'PortalIdParser';
import { isCdn } from './file';
import { BYTES_IN_MEGABYTE } from '../constants/fileSizes';
import { getCdnHostnameForPortal } from './cdnHostnames';

function filterParams(params) {
  var filteredParams = {};
  var validKeys = ['width', 'height', 'upscale', 'upsize', 'length', 'quality'];
  validKeys.forEach(function (key) {
    if (params[key]) {
      filteredParams[key] = params[key];
    }
  });
  return filteredParams;
}

export function getIsFileTooLargeForResizing(file) {
  return file.get('size') >= BYTES_IN_MEGABYTE * 5;
}
var DEFAULT_RESIZE_OPTIONS = {
  convertCustomDomainToCdn: false
};
/**
 * Transforms FM urls to structure needed to route to image resizing service
 * and appends resize query params
 *
 * @param {string} url
 * @param {object} params
 * @param {object} options
 */

export function resize(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var parsed = new Url(url);
  var pathSegments = parsed.pathname.split('/');
  var hubfsSegment = pathSegments.indexOf('hubfs');
  options = Object.assign({}, DEFAULT_RESIZE_OPTIONS, {}, options); // url is not a file manager url, so return

  if (hubfsSegment < 0) {
    console.error('[FileManagerLib/resize] URL is not file manager URL. Image resize not applied.');
    return url;
  } // resize does not support relative urls


  if (!parsed.hostname) {
    console.error('[FileManagerLib/resize] URL is relative. Image resize not applied.');
    return url;
  }

  var updatedParams = Object.assign({}, parsed.params, {}, filterParams(params));

  if (isCdn(parsed.hostname) && pathSegments.indexOf('hub') < 0) {
    var pathSuffix = pathSegments.slice(3).join('/');
    var hubId = parseInt(pathSegments[hubfsSegment + 1], 10);

    if (!hubId) {
      return url;
    }

    parsed.update({
      pathname: "/hub/" + hubId + "/hubfs/" + pathSuffix,
      params: updatedParams
    });
  } else if (pathSegments[1] === 'hubfs') {
    var _pathSuffix = pathSegments.slice(2).join('/');

    parsed.update({
      pathname: "/hs-fs/hubfs/" + _pathSuffix,
      params: updatedParams
    });

    if (options.convertCustomDomainToCdn) {
      parsed.update({
        pathname: "/hub/" + PortalIdParser.get() + "/hubfs/" + _pathSuffix,
        hostname: getCdnHostnameForPortal()
      });
    }
  } else {
    parsed.update({
      params: updatedParams
    });
  }

  return parsed.href;
}