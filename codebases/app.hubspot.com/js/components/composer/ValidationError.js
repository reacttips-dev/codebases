'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import { ACCOUNT_TYPE_TO_MAX_VIDEO_DURATION_SECONDS, ACCOUNT_TYPE_TO_MIN_VIDEO_DURATION_SECONDS, ACCOUNT_TYPE_TO_MAX_VIDEO_SIZE_BYTES, ACCOUNT_TYPE_TO_MIN_VIDEO_SIZE_BYTES, ACCOUNT_TYPE_TO_MAX_VIDEO_WIDTH, ACCOUNT_TYPE_TO_MIN_VIDEO_WIDTH, ACCOUNT_TYPE_TO_ALLOWED_VIDEO_EXTENSIONS, ACCOUNT_TYPE_TO_ALLOWED_VIDEO_CODECS, ACCOUNT_TYPE_TO_ALLOWED_VIDEO_AUDIO_CODECS, ACCOUNT_TYPE_TO_MAX_VIDEO_HEIGHT, ACCOUNT_TYPE_TO_MIN_VIDEO_HEIGHT, ACCOUNT_TYPE_TO_MAX_VIDEO_FRAME_RATE, ACCOUNT_TYPE_TO_MIN_VIDEO_FRAME_RATE, ACCOUNT_TYPE_TO_VIDEO_LINK, BROADCAST_VALIDATION_ERRORS, MAX_IMAGE_BYTES_ANIMATED, ACCOUNT_TYPE_TO_MAX_VIDEO_BITRATE_FRIENDLY } from '../../lib/constants';
import { getDurationDisplay } from '../../lib/utils';
import { broadcastGroupMessageProp, fileProp, setProp } from '../../lib/propTypes';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
var PATH_BASE = 'sui.composer.validation.errors';
export var safeGetPath = function safeGetPath(path) {
  var fullPath = PATH_BASE + "." + path;
  var lookupResult = I18n.lookup(fullPath);
  if (!lookupResult) return null;
  if (typeof lookupResult !== 'string') return lookupResult;
  return fullPath;
};

var ValidationError = function ValidationError(_ref) {
  var file = _ref.file,
      message = _ref.message,
      errorCode = _ref.errorCode,
      allowedExtensions = _ref.allowedExtensions;
  var network = message.network;
  var fileObj = file || message.file;
  var maxDimension = message.getMaxImageDimensions();
  var errorContext = {
    fileName: fileObj ? fileObj.name : undefined,
    extension: fileObj ? fileObj.extension : undefined,
    allowedExtensions: allowedExtensions && allowedExtensions.toArray().join(', '),
    encoding: file ? fileObj.encoding : undefined,
    network: network,
    maxChars: message.getMaxLength(),
    maxSize: I18n.formatSize(message.getMaxImageSize()),
    maxSizeAnimated: I18n.formatSize(MAX_IMAGE_BYTES_ANIMATED[network]),
    maxDimensions: maxDimension + " x " + maxDimension,
    videoMaxSize: I18n.formatSize(ACCOUNT_TYPE_TO_MAX_VIDEO_SIZE_BYTES[network]),
    videoMinSize: I18n.formatSize(ACCOUNT_TYPE_TO_MIN_VIDEO_SIZE_BYTES[network]),
    videoMaxWidth: ACCOUNT_TYPE_TO_MAX_VIDEO_WIDTH[network],
    videoMinWidth: ACCOUNT_TYPE_TO_MIN_VIDEO_WIDTH[network],
    videoMaxHeight: ACCOUNT_TYPE_TO_MAX_VIDEO_HEIGHT[network],
    videoMinHeight: ACCOUNT_TYPE_TO_MIN_VIDEO_HEIGHT[network],
    videoMinDuration: getDurationDisplay(ACCOUNT_TYPE_TO_MIN_VIDEO_DURATION_SECONDS[network] * 1000, true),
    videoMaxDuration: getDurationDisplay(ACCOUNT_TYPE_TO_MAX_VIDEO_DURATION_SECONDS[network] * 1000, true),
    videoMaxFrameRate: ACCOUNT_TYPE_TO_MAX_VIDEO_FRAME_RATE[network],
    videoMinFrameRate: ACCOUNT_TYPE_TO_MIN_VIDEO_FRAME_RATE[network],
    videoRequirementsLink: ACCOUNT_TYPE_TO_VIDEO_LINK[network],
    videoMaxBitrate: ACCOUNT_TYPE_TO_MAX_VIDEO_BITRATE_FRIENDLY[network]
  };

  if (ACCOUNT_TYPE_TO_ALLOWED_VIDEO_EXTENSIONS[network]) {
    errorContext.videoFormatString = ACCOUNT_TYPE_TO_ALLOWED_VIDEO_EXTENSIONS[network].join(', ');
  }

  if (ACCOUNT_TYPE_TO_ALLOWED_VIDEO_CODECS[network]) {
    errorContext.videoCodecString = ACCOUNT_TYPE_TO_ALLOWED_VIDEO_CODECS[network].join(', ');
  }

  if (ACCOUNT_TYPE_TO_ALLOWED_VIDEO_AUDIO_CODECS[network]) {
    errorContext.videoAudioCodecString = ACCOUNT_TYPE_TO_ALLOWED_VIDEO_AUDIO_CODECS[network].join(', ');
  }

  if (errorCode === BROADCAST_VALIDATION_ERRORS.userCannotPublish) {
    errorContext.count = message.channelKeys.size;
  }

  var errorPath = safeGetPath(errorCode);

  if (typeof errorPath !== 'string') {
    var networkSpecific = safeGetPath(errorCode + "." + errorContext.network);

    if (networkSpecific) {
      errorPath = networkSpecific;
    } else if (safeGetPath(errorCode + ".other")) {
      errorPath = safeGetPath(errorCode + ".other");
    }
  }

  return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
    message: errorPath,
    options: errorContext
  });
};

ValidationError.propTypes = {
  message: broadcastGroupMessageProp,
  file: fileProp,
  errorCode: PropTypes.string.isRequired,
  allowedExtensions: setProp
};
export default ValidationError;