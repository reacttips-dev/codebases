'use es6';

import { getIsFileExternal, getIsFilePrivate } from './fileAccessibility';
import { getIsSvgTooLarge, getIsSvg } from './file';
export var getThumbnailTooltipI18nKey = function getThumbnailTooltipI18nKey(file) {
  var isHostAppContextPrivate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var tooltipI18nKey = 'FileManagerLib.generatingThumbnailInsertTooltip';

  if (getIsSvg(file) && getIsSvgTooLarge(file)) {
    tooltipI18nKey = 'FileManagerCore.tooltips.fileTooLargeToPreview';
  }

  if (getIsFilePrivate(file) && !isHostAppContextPrivate) {
    tooltipI18nKey = 'FileManagerLib.privateFileInsertTooltip';
  }

  if (getIsFileExternal(file)) {
    tooltipI18nKey = 'FileManagerLib.externalFileInsertTooltip';
  }

  return tooltipI18nKey;
};
export var getIsThumbnailTooltipDisabled = function getIsThumbnailTooltipDisabled(file) {
  var isHostAppContextPrivate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (getIsSvg(file) && getIsSvgTooLarge(file)) {
    return false;
  }

  if (getIsFilePrivate(file) && !isHostAppContextPrivate) {
    return false;
  }

  if (getIsFileExternal(file)) {
    return false;
  }

  return true;
};