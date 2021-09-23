'use es6';

import PortalIdParser from 'PortalIdParser';
import { getIsFilePrivate } from './fileAccessibility';
import getApiHostForEnvironment from './getApiHostForEnvironment';
import ThumbnailSizes from '../enums/ThumbnailSizes';
export function getPublicThumbnailRedirectUrl(file, thumbSize) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var isFallbackImageDisabled = options.isFallbackImageDisabled,
      shouldUpscale = options.shouldUpscale,
      fallbackSize = options.fallbackSize,
      noCache = options.noCache;
  var url = "//" + getApiHostForEnvironment() + "/filemanager/api/v3/files/thumbnail-redirect/" + file.get('id') + "?size=" + thumbSize + "&portalId=" + PortalIdParser.get();

  if (isFallbackImageDisabled) {
    url = url + "&errorOnPlaceholder=true";
  }

  if (shouldUpscale) {
    url = url + "&upscale=true";
  }

  if (fallbackSize) {
    url = url + "&fallbackSize=" + fallbackSize;
  }

  if (noCache) {
    return url + "&t=" + Date.now();
  }

  return url + "&t=" + file.get('updated');
}
export function getPrivateThumbnailRedirectUrl(file, thumbSize) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var isFallbackImageDisabled = options.isFallbackImageDisabled,
      shouldUpscale = options.shouldUpscale,
      fallbackSize = options.fallbackSize,
      noCache = options.noCache;
  var url = "//" + getApiHostForEnvironment() + "/filemanager/api/v2/files/" + file.get('id') + "/signed-url-redirect?size=" + thumbSize + "&portalId=" + PortalIdParser.get();

  if (isFallbackImageDisabled) {
    url = url + "&errorOnPlaceholder=true";
  }

  if (shouldUpscale) {
    url = url + "&upscale=true";
  }

  if (fallbackSize) {
    url = url + "&fallbackSize=" + fallbackSize;
  }

  if (noCache) {
    return url + "&t=" + Date.now();
  }

  return url + "&t=" + file.get('updated');
}
export function getVideoOrImageThumbnailUrl(file) {
  var thumbSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ThumbnailSizes.THUMB;
  var options = arguments.length > 2 ? arguments[2] : undefined;

  if (getIsFilePrivate(file)) {
    return getPrivateThumbnailRedirectUrl(file, thumbSize, options);
  }

  return getPublicThumbnailRedirectUrl(file, thumbSize, options);
}