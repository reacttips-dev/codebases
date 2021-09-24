'use es6';

import PortalIdParser from 'PortalIdParser';
import { DrawerTypes } from '../Constants';
import { VideoProviders } from 'FileManagerCore/Constants';
export var getProviderParam = function getProviderParam(type) {
  if (type === DrawerTypes.HUBL_VIDEO) {
    return {
      provider: VideoProviders.VIDYARD
    };
  }

  return {};
};
export var getRedirectToFilesLocation = function getRedirectToFilesLocation() {
  return "/files/" + PortalIdParser.get();
};
/**
  returns URL to the file manager dashboard app
**/

export var getFilesUrl = function getFilesUrl() {
  return window.location.origin.concat(getRedirectToFilesLocation());
};