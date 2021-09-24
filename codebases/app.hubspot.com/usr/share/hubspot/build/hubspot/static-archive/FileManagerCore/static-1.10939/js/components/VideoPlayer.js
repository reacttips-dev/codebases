'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import classnames from 'classnames';
import keyMirror from 'react-utils/keyMirror';
import Immutable from 'immutable';
import { getHasThumbnail, getImageSrc } from '../utils/file';
import ThumbnailSizes from '../enums/ThumbnailSizes';
var CodecTypes = keyMirror({
  AUDIO: null,
  VIDEO: null
});
var SupportedAudioCodecs = Immutable.Set(['aac', 'mp3']);
export function isSupported(file) {
  var meta = file.getIn(['meta', 'video_data']);

  if (!meta) {
    return false;
  } // TODO: explore using the canPlayType() video element method
  // see https://dev.w3.org/html5/spec-author-view/video.html#mime-types


  if (meta.get('format_name').indexOf('mp4') === -1) {
    return false;
  }

  var streams = meta.get('streams');
  var videoStream = streams.find(function (stream) {
    return stream.get('codec_type') === CodecTypes.VIDEO;
  });

  if (!videoStream || videoStream.get('codec_name') !== 'h264') {
    return false;
  }

  var audioStream = streams.find(function (stream) {
    return stream.get('codec_type') === CodecTypes.AUDIO;
  });

  if (audioStream && !SupportedAudioCodecs.contains(audioStream.get('codec_name'))) {
    return false;
  }

  return true;
}
export var VideoPlayer = /*#__PURE__*/function (_Component) {
  _inherits(VideoPlayer, _Component);

  function VideoPlayer() {
    _classCallCheck(this, VideoPlayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(VideoPlayer).apply(this, arguments));
  }

  _createClass(VideoPlayer, [{
    key: "getSrc",
    value: function getSrc() {
      var _this$props = this.props,
          signedUrl = _this$props.signedUrl,
          video = _this$props.video,
          isVideoExternallyUploaded = _this$props.isVideoExternallyUploaded;

      if (isVideoExternallyUploaded) {
        return signedUrl;
      }

      var url = video.get('url');

      if (video.has('tempUrl')) {
        return video.get('tempUrl');
      }

      if (video.has('progress')) {
        return url;
      }

      return url + "?t=" + video.get('updated');
    }
  }, {
    key: "getDimensions",
    value: function getDimensions() {
      var _this$props2 = this.props,
          width = _this$props2.width,
          video = _this$props2.video;

      if (!width || width > video.get('width')) {
        return {
          width: video.get('width'),
          height: video.get('height')
        };
      }

      var height = video.get('height') * (width / video.get('width'));
      return {
        width: width,
        height: height
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          className = _this$props3.className,
          video = _this$props3.video,
          videoRef = _this$props3.videoRef,
          showControls = _this$props3.showControls,
          isVideoExternallyUploaded = _this$props3.isVideoExternallyUploaded;
      var dimensions = this.getDimensions();
      return /*#__PURE__*/_jsx("video", Object.assign({
        className: classnames('video-player', className),
        src: this.getSrc(),
        controls: showControls,
        poster: getHasThumbnail(video) && !isVideoExternallyUploaded ? getImageSrc(video, ThumbnailSizes.MEDIUM, {
          noCache: true
        }) : undefined,
        preload: "metadata",
        ref: videoRef
      }, dimensions));
    }
  }]);

  return VideoPlayer;
}(Component);
VideoPlayer.propTypes = {
  showControls: PropTypes.bool.isRequired,
  isVideoExternallyUploaded: PropTypes.bool,
  video: PropTypes.instanceOf(Immutable.Map).isRequired,
  videoRef: PropTypes.func.isRequired,
  className: PropTypes.string,
  signedUrl: PropTypes.string,
  width: PropTypes.number
};
VideoPlayer.defaultProps = {
  showControls: true,
  isVideoExternallyUploaded: false
};