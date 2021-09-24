'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import Small from 'UIComponents/elements/Small';
import UIImage from 'UIComponents/image/UIImage';
import UICardGrid from 'UIComponents/card/UICardGrid';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UIIcon from 'UIComponents/icon/UIIcon';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UICardHero from 'UIComponents/card/UICardHero';
import UIFlex from 'UIComponents/layout/UIFlex';
import { IMAGE_PREVIEW_SIZE } from '../../lib/constants';
import { getPreviewUrl } from '../../data/model/FMFile';
export function BroadcastMediaPhoto(_ref) {
  var src = _ref.src;
  return /*#__PURE__*/_jsx(UICardHero, {
    className: "image-preview photo m-bottom-0",
    children: /*#__PURE__*/_jsx("div", {
      className: "embed-responsive embed-responsive-4by3",
      children: /*#__PURE__*/_jsx(UIFlex, {
        justify: "center",
        direction: "column",
        className: "embed-responsive-item",
        children: /*#__PURE__*/_jsx(UIImage, {
          src: src,
          objectFit: "contain",
          style: {
            maxHeight: '100%',
            margin: 'auto'
          }
        })
      })
    })
  });
}

var BroadcastMedia = function BroadcastMedia(_ref2) {
  var broadcast = _ref2.broadcast,
      imageSize = _ref2.imageSize,
      _ref2$showIcon = _ref2.showIcon,
      showIcon = _ref2$showIcon === void 0 ? true : _ref2$showIcon,
      _ref2$showMultipleIma = _ref2.showMultipleImages,
      showMultipleImages = _ref2$showMultipleIma === void 0 ? false : _ref2$showMultipleIma;
  var channel = broadcast.channel;
  var typeIcon;
  var preview;
  var imageUrl = getPreviewUrl(broadcast.getImage(), imageSize);

  if (broadcast.isMultiPhoto() && channel) {
    var imageUrls = broadcast.getImageUrls(imageSize);

    if (showMultipleImages) {
      preview = /*#__PURE__*/_jsx(UICardGrid, {
        columnSize: "50%",
        gutterSize: 12,
        children: imageUrls.map(function (url) {
          return /*#__PURE__*/_jsx(UICardWrapper, {
            size: 6,
            children: /*#__PURE__*/_jsx(BroadcastMediaPhoto, {
              src: getPreviewUrl(url, imageSize),
              broadcastGuid: broadcast.broadcastGuid
            })
          }, url);
        })
      });
    } else {
      preview = /*#__PURE__*/_jsx(UIImage, {
        src: imageUrl
      });
    }

    var numImages = imageUrls.size;
    typeIcon = /*#__PURE__*/_jsxs("span", {
      className: "media-type",
      children: [/*#__PURE__*/_jsx(UIIcon, {
        className: "m-right-1",
        name: "imageGallery",
        size: "xxs"
      }), /*#__PURE__*/_jsx(Small, {
        children: I18n.text('sui.broadcasts.mediaType.multiImage', {
          count: numImages
        })
      })]
    });
  } else if (broadcast.isPhoto() && channel) {
    preview = /*#__PURE__*/_jsx(UIImage, {
      src: imageUrl
    });
    typeIcon = /*#__PURE__*/_jsxs("span", {
      className: "media-type",
      children: [/*#__PURE__*/_jsx(UIIcon, {
        className: "m-right-1",
        name: "insertImage",
        size: "xxs"
      }), /*#__PURE__*/_jsx(Small, {
        children: I18n.text('sui.broadcasts.mediaType.singleImage')
      })]
    });
  } else if (broadcast.isVideo()) {
    preview = /*#__PURE__*/_jsxs("div", {
      className: "thumb-wrapper",
      children: [/*#__PURE__*/_jsx(UIImage, {
        src: imageUrl
      }), /*#__PURE__*/_jsx(UIIcon, {
        className: "preview",
        name: "socialYoutubeplay",
        size: "xs"
      })]
    });
    typeIcon = /*#__PURE__*/_jsxs("span", {
      className: "media-type",
      children: [/*#__PURE__*/_jsx(UIIcon, {
        className: "m-right-1",
        name: "insertVideo",
        size: "xxs"
      }), /*#__PURE__*/_jsx(Small, {
        children: I18n.text('sui.broadcasts.mediaType.video')
      })]
    });
  } else if (broadcast.isQuoteTweet()) {
    preview = /*#__PURE__*/_jsx(UIIcon, {
      className: "link-icon",
      name: "insertQuote",
      size: "medium"
    });
    typeIcon = /*#__PURE__*/_jsx("span", {
      className: "media-type",
      children: /*#__PURE__*/_jsx(Small, {
        children: I18n.text('sui.broadcasts.mediaType.quoteTweet')
      })
    });
  } else if (broadcast.hasLinkPreview()) {
    if (broadcast.content.get('imageUrl')) {
      preview = /*#__PURE__*/_jsx(UIImage, {
        src: imageUrl
      });
    } else if (broadcast.isUploaded() && !broadcast.content.has('scraperResult')) {
      preview = /*#__PURE__*/_jsx(UILoadingSpinner, {
        grow: true
      });
    } else {
      preview = /*#__PURE__*/_jsx(UIIcon, {
        className: "link-icon",
        name: "link",
        size: "medium"
      });
    }

    typeIcon = /*#__PURE__*/_jsxs("span", {
      className: "media-type",
      children: [/*#__PURE__*/_jsx(UIIcon, {
        className: "m-right-1",
        name: "link",
        size: "xxs"
      }), /*#__PURE__*/_jsx(Small, {
        children: I18n.text('sui.broadcasts.mediaType.linkPreview')
      })]
    });
  }

  return /*#__PURE__*/_jsxs("div", {
    className: "broadcast-media variable-column",
    children: [preview, showIcon && typeIcon]
  });
};

BroadcastMediaPhoto.propTypes = {
  src: PropTypes.string.isRequired,
  broadcastGuid: PropTypes.number
};
BroadcastMedia.propTypes = {
  broadcast: PropTypes.object.isRequired,
  imageSize: PropTypes.string,
  showIcon: PropTypes.bool,
  showMultipleImages: PropTypes.bool
};
BroadcastMedia.defaultProps = {
  imageSize: IMAGE_PREVIEW_SIZE.thumb
};
export default BroadcastMedia;