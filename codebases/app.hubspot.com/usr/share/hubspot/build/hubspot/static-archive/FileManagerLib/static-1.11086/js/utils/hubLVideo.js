'use es6';

import { DrawerTypes } from '../Constants';
import * as hubLVideoUtils from 'FileManagerCore/utils/hubLVideo';
export var isHubLVideo = hubLVideoUtils.isHubLVideo;
export var isHubSpotVideo2 = hubLVideoUtils.isHubSpotVideo2;
export var getHubLVideoParamObjectFromFile = hubLVideoUtils.getHubLVideoParamObjectFromFile;
export var getHubLVideoPlayerIdFromFile = hubLVideoUtils.getHubLVideoPlayerIdFromFile;
export var getHubLVideoHubLTag = hubLVideoUtils.getHubLVideoHubLTag;
export var getHubLParamsForVideoPlayer = hubLVideoUtils.getHubLParamsForVideoPlayer;
export var shouldVideoLimitBannerRender = function shouldVideoLimitBannerRender(params) {
  var hasUserExceededVideoLimit = params.hasUserExceededVideoLimit,
      type = params.type,
      isVideoLimitBannerDismissed = params.isVideoLimitBannerDismissed;
  return type === DrawerTypes.HUBL_VIDEO && !isVideoLimitBannerDismissed && hasUserExceededVideoLimit;
};
export var isVideoDrawerType = function isVideoDrawerType(drawerType) {
  return drawerType === DrawerTypes.HUBL_VIDEO || drawerType === DrawerTypes.VIDEO;
};