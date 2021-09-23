'use es6';

import Url from 'urlinator/Url';
import { stringify } from 'hub-http/helpers/params';
import { TypeToExtensions, FileTypes, UrlSchemes, PATH_TO_VIDEO_HOSTING_INFO, VideoProviders, FILE_DETAILS_QUERY_PARAM_NAME } from '../Constants';
import CdnHostnames from '../enums/CdnHostnames';
import { isNonDefaultHublet, getCdnHostnameForNonDefaultHublet } from './cdnHostnames';
import { isHubLVideo, isHubSpotVideo2 } from './hubLVideo';
import { isShutterstock } from './image';
import Immutable from 'immutable';
import PortalIdParser from 'PortalIdParser';
import { getVideoOrImageThumbnailUrl, getPrivateThumbnailRedirectUrl } from './thumbnailUrls';
import { resize, getIsFileTooLargeForResizing } from './resize';
import { getIsFilePrivate, getIsFileExternal } from './fileAccessibility';
import { BYTES_IN_MEGABYTE } from '../constants/fileSizes';
import ThumbnailSizes from '../enums/ThumbnailSizes';
var HUBFS_CDN_URL_REGEX = /\/hubfs\/([0-9]+)\/(.*)/;
var HUBFS_DOMAIN_URL_REGEX = /\/hubfs\/(.*)/;
var LEGACY_CDN_URL_REGEX = /\/hub\/([0-9]+)\/(.*)/;
var LEGACY_DOMAIN_URL_REGEX = /\/hs-fs\/(.*)/;
export var FREE_DOMAIN_REGEX = /^.+\.hubspotpagebuilder(qa)?(-[A-z0-9]+)?\..+/;
export function isCdn(hostname) {
  if (isNonDefaultHublet() && hostname === getCdnHostnameForNonDefaultHublet()) {
    return true;
  }

  return CdnHostnames.includes(hostname) || Boolean(hostname.match(FREE_DOMAIN_REGEX));
}
export function splitNameAndExtension(file) {
  var name = file.name; // eslint-disable-next-line no-useless-escape

  var matches = name.match(/(.*)\.([^\.]+)$/);

  if (!matches) {
    return {
      extension: '',
      name: name
    };
  }

  return {
    name: matches[1],
    extension: matches[2].toLowerCase()
  };
}
export function getType(extensionOrType) {
  if (Object.keys(FileTypes).includes(extensionOrType)) {
    return extensionOrType;
  }

  var type = TypeToExtensions.findKey(function (extensions) {
    return extensions.includes(extensionOrType);
  });

  if (type) {
    return type;
  }

  return FileTypes.OTHER;
}
export function isImage(file) {
  return file.type && file.type.indexOf('image/') === 0;
}
export function canPreviewLocalFile(localFile) {
  var _splitNameAndExtensio = splitNameAndExtension(localFile),
      extension = _splitNameAndExtensio.extension;

  return isImage(localFile) && extension !== 'svg';
}
export function getIsVideoSelectedForUpload(file) {
  return file.type && file.type.indexOf('video/') === 0;
}
export function getIsDocumentSelectedForUpload(file) {
  var _splitNameAndExtensio2 = splitNameAndExtension(file),
      extension = _splitNameAndExtensio2.extension;

  return file.type && TypeToExtensions.get(FileTypes.DOCUMENT).includes(extension);
}
export function convertUrlToDomain(file, domain) {
  var url = file.get('url');
  var parsed = new Url(url);
  var nextHostname = domain.get('domain');
  var pathname = parsed.pathname;
  var urlScheme = file.getIn(['meta', 'url_scheme']) || UrlSchemes.LEGACY;

  if (!domain) {
    return file.get('url');
  }

  if (parsed.hostname === nextHostname) {
    return file.get('url');
  }

  var updates = {
    protocol: domain.get('isSslEnabled') ? 'https' : 'http',
    hostname: nextHostname
  };

  if (isCdn(parsed.hostname) && !isCdn(nextHostname)) {
    if (urlScheme === UrlSchemes.SIMPLIFIED) {
      var matches = pathname.match(HUBFS_CDN_URL_REGEX);

      if (matches && matches.length) {
        updates.pathname = "/hubfs/" + matches[2];
      }
    } else {
      var _matches = pathname.match(LEGACY_CDN_URL_REGEX);

      if (_matches && _matches.length) {
        updates.pathname = "/hs-fs/" + _matches[2];
      }
    }
  } else if (!isCdn(parsed.hostname) && isCdn(nextHostname)) {
    if (urlScheme === UrlSchemes.SIMPLIFIED) {
      var _matches2 = pathname.match(HUBFS_DOMAIN_URL_REGEX);

      if (_matches2 && _matches2.length) {
        updates.pathname = "/hubfs/" + file.get('portal_id') + "/" + _matches2[1];
      }
    } else {
      var _matches3 = pathname.match(LEGACY_DOMAIN_URL_REGEX);

      if (_matches3 && _matches3.length) {
        updates.pathname = "/hub/" + file.get('portal_id') + "/" + _matches3[1];
      }
    }
  }

  parsed.update(updates);
  return parsed.href;
}

function findAndReplaceHostingInfo(file, hostingInfoReplacement) {
  if (file.getIn(PATH_TO_VIDEO_HOSTING_INFO)) {
    return file.getIn(PATH_TO_VIDEO_HOSTING_INFO).map(function (hostingInfo) {
      if (hostingInfo.get('provider') === hostingInfoReplacement.get('provider')) {
        return hostingInfoReplacement;
      }

      return hostingInfo;
    });
  }

  return Immutable.List([hostingInfoReplacement]);
}

export function getUpdatedPlayerIdVideoFile(file, newHostingInfo) {
  return file.setIn(PATH_TO_VIDEO_HOSTING_INFO, findAndReplaceHostingInfo(file, newHostingInfo));
}
export function softDeleteVidyardPlayerIdFromFile(file, oldPlayerId) {
  if (isHubSpotVideo2(file.toJS())) {
    try {
      return file.setIn(PATH_TO_VIDEO_HOSTING_INFO, findAndReplaceHostingInfo(file, Immutable.Map({
        provider: VideoProviders.HUBSPOT_VIDEO_2,
        status: 'DISABLED',
        id: oldPlayerId
      })));
    } catch (e) {
      return file.set('isEmbeddable', false);
    }
  }

  return file.setIn(PATH_TO_VIDEO_HOSTING_INFO, findAndReplaceHostingInfo(file, Immutable.Map({
    provider: VideoProviders.VIDYARD,
    status: 'DISABLED',
    id: oldPlayerId
  })));
}
export function getFileType(file) {
  if (file.get('type')) {
    return file.get('type');
  }

  return getType(file.get('extension'));
}
export function getIsImage(file) {
  return getFileType(file) === FileTypes.IMG;
}
export function getIsVideo(file) {
  return getFileType(file) === FileTypes.MOVIE;
}
export function getIsSvg(file) {
  return getIsImage(file) && file.get('encoding') === 'svg';
}
export var getIsTemporaryUploadingFile = function getIsTemporaryUploadingFile(file) {
  return file.get('id') <= 0;
};
export var getIsFileBeingReplaced = function getIsFileBeingReplaced(file) {
  return file.has('progress') && !getIsTemporaryUploadingFile(file);
};
export var getIsSvgTooLarge = function getIsSvgTooLarge(file) {
  return file.get('size') >= BYTES_IN_MEGABYTE;
};
export function getHasThumbnail(file) {
  if (getIsSvg(file) && (getIsSvgTooLarge(file) || getIsTemporaryUploadingFile(file))) {
    return false;
  }

  if (getIsFileExternal(file)) {
    return false;
  }

  var type = getFileType(file);
  return type === FileTypes.IMG || type === FileTypes.MOVIE;
}
export function getImageSrc(file, thumbSize, options) {
  if (file.has('tempUrl')) {
    return file.get('tempUrl');
  }

  if (file.has('progress')) {
    return file.get('url');
  }

  if (file.get('encoding') === 'svg' && !getIsFilePrivate(file)) {
    return file.get('friendly_url');
  }

  return getVideoOrImageThumbnailUrl(file, thumbSize, options);
}
export function getResizedFilePreviewUrl(file, imageWidth) {
  var url = file.get('default_hosting_url');

  if (getIsVideo(file)) {
    return getImageSrc(file, ThumbnailSizes.MEDIUM, {
      noCache: true
    });
  }

  if (getIsFilePrivate(file)) {
    return getPrivateThumbnailRedirectUrl(file, ThumbnailSizes.MEDIUM, {
      noCache: true
    });
  } // temp fix to load large image thumbs (JIRA: https://issues.hubspotcentral.com/browse/CG-16539)


  if (getIsFileTooLargeForResizing(file)) {
    return getImageSrc(file, ThumbnailSizes.MEDIUM, {
      noCache: true
    });
  }

  if (file.has('tempUrl')) {
    return file.get('tempUrl');
  }

  if (file.has('progress')) {
    return url;
  }

  url = url + "?t=" + file.get('updated');

  if (file.get('replaced')) {
    return url;
  }

  return resize(url, {
    // 2x width for retina
    width: imageWidth * 2
  });
}
export function getResizedFileThumbnailUrl(file, imageWidth) {
  var url = file.get('default_hosting_url');

  if (getIsFilePrivate(file)) {
    return getPrivateThumbnailRedirectUrl(file, ThumbnailSizes.MEDIUM);
  }

  if (getIsVideo(file)) {
    return getImageSrc(file, ThumbnailSizes.MEDIUM, {
      noCache: true
    });
  } // temp fix to load large image thumbs (JIRA: https://issues.hubspotcentral.com/browse/CG-16539)


  if (getIsFileTooLargeForResizing(file)) {
    return getImageSrc(file, ThumbnailSizes.MEDIUM);
  }

  if (file.has('tempUrl')) {
    return file.get('tempUrl');
  }

  if (file.has('progress')) {
    return url;
  }

  if (file.get('encoding') === 'svg') {
    return file.get('default_hosting_url');
  }

  if (url && !url.includes('?')) {
    url = url + "?t=" + file.get('updated');
  }

  if (file.get('replaced')) {
    return url;
  }

  return resize(url, {
    width: imageWidth
  });
}
export function isAnimation(file) {
  return file.getIn(['meta', 'animated']) || false;
}
export function getIsFileManagerUrl(url) {
  var parsed = new Url(url);
  var pathname = parsed.pathname;
  var matches = pathname.match(HUBFS_CDN_URL_REGEX);

  if (matches && matches.length) {
    return true;
  }

  matches = pathname.match(HUBFS_DOMAIN_URL_REGEX);

  if (matches && matches.length) {
    return true;
  }

  matches = pathname.match(LEGACY_CDN_URL_REGEX);

  if (matches && matches.length) {
    return true;
  }

  matches = pathname.match(LEGACY_DOMAIN_URL_REGEX);

  if (matches && matches.length) {
    return true;
  }

  return false;
}
export var getFileDetailsFileManagerAppLink = function getFileDetailsFileManagerAppLink(file) {
  var queryParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  queryParams[FILE_DETAILS_QUERY_PARAM_NAME] = file.get('id');
  return "/files/" + PortalIdParser.get() + "?" + stringify(queryParams);
};
export function getShouldRenderFileUrl(_ref) {
  var file = _ref.file;

  switch (getFileType(file)) {
    case FileTypes.IMG:
      return !isShutterstock(file) && file.get('url') && !file.get('temp');

    case FileTypes.MOVIE:
      return !isHubLVideo(file.toJS());

    default:
      return true;
  }
}
export var getFileName = function getFileName(file) {
  return file.get('name');
};
export var getFileMetaTitle = function getFileMetaTitle(file) {
  return file.getIn(['meta', 'title']);
};
export var getFileMetaDescription = function getFileMetaDescription(file) {
  return file.getIn(['meta', 'description']);
};
export var getFileMetaTagsList = function getFileMetaTagsList(file) {
  return file.getIn(['meta', 'tags']) || Immutable.List();
};