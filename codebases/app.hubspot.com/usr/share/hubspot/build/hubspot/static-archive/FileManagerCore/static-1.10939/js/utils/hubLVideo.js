'use es6';

import devLogger from 'react-utils/devLogger';
import { VideoProviders, PATH_TO_VIDEO_HOSTING_INFO } from '../Constants';
import { DefaultHubLVideoParams, SupportedHubLVideoParams } from '../constants/HubLVideoParams';
import getIn from './getIn';
import { logBadConversionAssetData } from './logging';
import { capitalizeString } from './stringUtils';
var CONVERSION_ASSET_NECESSARY_PROPERTIES = ['type', 'id', 'position'];
var VIDEO_FILE_DEPRECATION_WARNING = "\ngetHubLVideoPlayerIdFromFile/getHubLVideoParamObjectFromFile utils are deprecated for use with FM files,\nsee https://git.hubteam.com/HubSpot/HubSpotVideo/issues/155\n".trim();
export function getVideoHostingInfoProperty(file) {
  return getIn(file, PATH_TO_VIDEO_HOSTING_INFO);
}
export var isHubSpotVideo2 = function isHubSpotVideo2(video) {
  if (video.videoId) {
    return true;
  }

  var video2HostingInfo = findVideoInfoByProvider(video, VideoProviders.HUBSPOT_VIDEO_2);
  return Boolean(video2HostingInfo && video2HostingInfo.id !== undefined);
};
export function findVideoInfoByProvider(file, provider) {
  var hostingInfoList = getVideoHostingInfoProperty(file);

  if (hostingInfoList) {
    return hostingInfoList.find(function (e) {
      return e.provider === provider && e.status === 'ENABLED';
    }) || {};
  }

  return {};
}
export var getHubLVideoParamObjectFromFile = function getHubLVideoParamObjectFromFile(videoOrFile) {
  var width = videoOrFile.width,
      height = videoOrFile.height;

  if (isHubSpotVideo2(videoOrFile) && videoOrFile.videoId !== undefined) {
    return {
      width: width,
      height: height,
      player_id: videoOrFile.videoId
    };
  }

  if (isHubSpotVideo2(videoOrFile)) {
    return Object.assign({}, videoOrFile.meta.video_data, {
      width: width,
      height: height,
      player_id: findVideoInfoByProvider(videoOrFile, VideoProviders.HUBSPOT_VIDEO_2).id
    });
  }

  if (getVideoHostingInfoProperty(videoOrFile)) {
    devLogger.warn({
      message: VIDEO_FILE_DEPRECATION_WARNING
    });
    return Object.assign({}, videoOrFile.meta.video_data, {
      width: width,
      height: height,
      player_id: findVideoInfoByProvider(videoOrFile, VideoProviders.VIDYARD).id
    });
  }

  return {};
};
export var getHubLVideoPlayerIdFromFile = function getHubLVideoPlayerIdFromFile(videoOrFile) {
  if (isHubSpotVideo2(videoOrFile) && videoOrFile.videoId) {
    return videoOrFile.videoId;
  }

  return getHubLVideoParamObjectFromFile(videoOrFile).player_id;
};
export var isHubLVideo = function isHubLVideo(videoOrFile) {
  if (isHubSpotVideo2(videoOrFile) && typeof videoOrFile.isEmbeddable === 'boolean') {
    return videoOrFile.isEmbeddable;
  }

  return Boolean(getHubLVideoPlayerIdFromFile(videoOrFile));
};
export var wrapTrackHubLVideoInteraction = function wrapTrackHubLVideoInteraction(trackInteraction) {
  return function (action) {
    return trackInteraction('Accept Video TOS', action);
  };
};
export var getDoesConversionAssetHaveNecessaryProperties = function getDoesConversionAssetHaveNecessaryProperties(conversionAsset) {
  return CONVERSION_ASSET_NECESSARY_PROPERTIES.every(function (property) {
    return conversionAsset[property] !== null && conversionAsset[property] !== undefined;
  });
};
export var getIsConversionAssetValid = function getIsConversionAssetValid(conversionAsset) {
  if (!conversionAsset) {
    return false;
  }

  if (typeof conversionAsset !== 'object') {
    logBadConversionAssetData('conversion_asset attribute needs to be a valid JSON object', "conversion_asset is " + (conversionAsset === null ? 'null' : 'not an object'));
    return false;
  }

  if (!getDoesConversionAssetHaveNecessaryProperties(conversionAsset)) {
    logBadConversionAssetData("conversion_asset must have at least 3 properties: " + CONVERSION_ASSET_NECESSARY_PROPERTIES.join());
    return false;
  }

  return true;
};
export var getHubLParamsForVideoPlayer = function getHubLParamsForVideoPlayer(params) {
  var hubLVideoPlayerParams = Object.assign({}, DefaultHubLVideoParams, {}, params);
  return Object.keys(hubLVideoPlayerParams).filter(function (key) {
    return SupportedHubLVideoParams.includes(key);
  }).filter(function (key) {
    return key !== 'conversion_asset' || getIsConversionAssetValid(hubLVideoPlayerParams[key]);
  }).map(function (key) {
    var val = hubLVideoPlayerParams[key];

    if (typeof val === 'boolean') {
      return key + "=" + capitalizeString(val.toString());
    } else if (key === 'conversion_asset') {
      try {
        return "conversion_asset='" + JSON.stringify(val) + "'";
      } catch (error) {
        logBadConversionAssetData(error);
      }
    }

    return key + "='" + val + "'";
  }).join(', ');
};
export var getHubLVideoHubLTag = function getHubLVideoHubLTag(params) {
  return "{% video_player \"embed_player\" " + getHubLParamsForVideoPlayer(params) + " %}";
};