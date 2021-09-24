'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import cx from 'classnames';
import UIImage from 'UIComponents/image/UIImage';
import UIGrid from 'UIComponents/grid/UIGrid';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import PostMedia from './PostMedia';
import { reportingPostProp, reportingPostMediaProp } from '../lib/propTypes';

var PostMediaItem = function PostMediaItem(_ref) {
  var postMedia = _ref.postMedia,
      size = _ref.size;
  return /*#__PURE__*/_jsx(UIGridItem, {
    size: size,
    className: "post-media-item",
    children: postMedia.url && /*#__PURE__*/_jsx(UIImage, {
      className: size,
      src: postMedia.url
    })
  });
};

PostMediaItem.propTypes = {
  postMedia: reportingPostMediaProp.isRequired,
  size: PropTypes.number.isRequired
};
PostMediaItem.defaultProps = {
  size: 3
};

var PostMediaWrapper = function PostMediaWrapper(_ref2) {
  var post = _ref2.post;
  var postMedia;
  var className = 'single';

  if (post.isMultiMedia()) {
    className = 'multi';
    postMedia = post.metadata.media.map(function (media, i) {
      return /*#__PURE__*/_jsx(PostMediaItem, {
        postMedia: media
      }, i);
    });
    return /*#__PURE__*/_jsx(UIGrid, {
      className: cx('post-media-wrapper', className),
      children: postMedia
    });
  } else {
    postMedia = /*#__PURE__*/_jsx(PostMedia, {
      post: post,
      size: "full"
    });
  }

  return /*#__PURE__*/_jsx("div", {
    className: cx('post-media-wrapper', className),
    children: postMedia
  });
};

PostMediaWrapper.propTypes = {
  post: reportingPostProp.isRequired
};
export default PostMediaWrapper;