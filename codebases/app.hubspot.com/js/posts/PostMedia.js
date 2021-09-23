'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { BATTLESHIP } from 'HubStyleTokens/colors';
import PropTypes from 'prop-types';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIImage from 'UIComponents/image/UIImage';

var MissingMediaPlaceholder = function MissingMediaPlaceholder(_ref) {
  var post = _ref.post,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'xxl' : _ref$size;
  var iconName = post.isVideo() ? 'insertVideo' : 'insertImage';
  return /*#__PURE__*/_jsx(UIIcon, {
    className: "icon",
    name: iconName,
    size: size,
    color: BATTLESHIP
  });
};

var PostMedia = function PostMedia(_ref2) {
  var post = _ref2.post,
      mediaLabel = _ref2.mediaLabel,
      size = _ref2.size;

  // we want to try to load both full media & thumbnail before we declare missing media
  var _useState = useState({
    errorFullImage: false,
    errorThumbnail: false
  }),
      _useState2 = _slicedToArray(_useState, 2),
      loadResult = _useState2[0],
      setLoadResult = _useState2[1];

  var fullMediaUrl = post.getFullMediaUrl();
  var thumbnailUrl = post.getThumbnailUrl();
  var src = size === 'full' ? fullMediaUrl : thumbnailUrl; // if we tried to load full images but haven't tried thumbnail yet

  if (loadResult.errorFullImage && !loadResult.errorThumbnail) {
    src = thumbnailUrl;
  }

  var handleImageLoadError = useCallback(function () {
    if (!loadResult.errorFullImage && size === 'full') {
      setLoadResult({
        errorFullImage: true,
        errorThumbnail: fullMediaUrl === thumbnailUrl // we to try load thumbnail url only if it's different from full img url

      });
    } else {
      setLoadResult({
        errorFullImage: true,
        errorThumbnail: true
      });
    }
  }, [loadResult.errorFullImage, fullMediaUrl, thumbnailUrl, size]);
  var missingMedia = loadResult.errorThumbnail && loadResult.errorFullImage;
  return /*#__PURE__*/_jsxs("div", {
    className: 'post-media' + (missingMedia ? " no-media-source" : ""),
    children: [missingMedia ? /*#__PURE__*/_jsx(MissingMediaPlaceholder, {
      post: post,
      size: size === 'full' ? 'xxl' : 'sm'
    }) : /*#__PURE__*/_jsx(UIImage, {
      alt: "",
      className: size + " image",
      onError: handleImageLoadError // This image is always decorative and is described by "mediaLabel" if it exists
      // or by something else
      ,
      role: "presentation",
      src: src
    }), mediaLabel]
  });
};

PostMedia.propTypes = {
  mediaLabel: PropTypes.node,
  post: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['thumb', 'full']).isRequired
};
PostMedia.defaultProps = {
  mediaLabel: null,
  size: 'thumb'
};
export default PostMedia;