'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import Immutable from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { BATTLESHIP, CALYPSO, EERIE, OBSIDIAN, OLAF, GYPSUM } from 'HubStyleTokens/colors';
import styled from 'styled-components';
import UILink from 'UIComponents/link/UILink';
import UINanoProgress from 'UIComponents/progress/UINanoProgress';
import UIIconCircle from 'UIComponents/icon/UIIconCircle';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIButtonGroup from 'UIComponents/button/UIButtonGroup';
import UIButton from 'UIComponents/button/UIButton';
import VideoIcon from 'FileManagerCore/components/icons/Video';
import ThumbnailVideoDuration from './ThumbnailVideoDuration';
import { getFileNameAndExtension } from '../../utils/fileNameAndExtension';
import { getHasThumbnail, getIsVideo, getImageSrc } from 'FileManagerCore/utils/file';
import FileTypeIcon from 'FileManagerCore/components/FileTypeIcon';
import { getIsThumbnailTooltipDisabled, getThumbnailTooltipI18nKey } from 'FileManagerCore/utils/thumbnailTooltip';
import ThumbnailSizes from 'FileManagerCore/enums/ThumbnailSizes';
import { getShouldUsePreviewSize } from 'FileManagerCore/utils/thumbnail';
var StyledFloatingButtons = styled(UIButtonGroup).withConfig({
  displayName: "MediaThumbnailTile__StyledFloatingButtons",
  componentId: "sc-296m8n-0"
})(["position:absolute;z-index:2;left:0;bottom:0;opacity:0;"]);
var StyledMediaThumbnailTile = styled.div.withConfig({
  displayName: "MediaThumbnailTile__StyledMediaThumbnailTile",
  componentId: "sc-296m8n-1"
})(["position:absolute;display:flex;align-items:center;justify-content:center;width:100%;height:100%;left:0;top:0;background-color:", ";&:hover ", "{opacity:1;}"], GYPSUM, StyledFloatingButtons);
var StyledInsertLink = styled(UILink).withConfig({
  displayName: "MediaThumbnailTile__StyledInsertLink",
  componentId: "sc-296m8n-2"
})(["position:absolute;display:flex;align-items:center;width:100%;height:100%;left:0;top:0;justify-content:center;"]);
var StyledThumbnailImage = styled.img.withConfig({
  displayName: "MediaThumbnailTile__StyledThumbnailImage",
  componentId: "sc-296m8n-3"
})(["max-height:100%;max-width:100%;opacity:", ";"], function (props) {
  return props.disabled ? 0.5 : 1;
});
var StyledUploadingWrapper = styled.div.withConfig({
  displayName: "MediaThumbnailTile__StyledUploadingWrapper",
  componentId: "sc-296m8n-4"
})(["position:absolute;width:100%;height:100%;display:flex;align-items:center;justify-content:center;"]);
var StyledUploadProgress = styled(UINanoProgress).withConfig({
  displayName: "MediaThumbnailTile__StyledUploadProgress",
  componentId: "sc-296m8n-5"
})(["position:absolute;left:0;bottom:0;right:0;z-index:2;"]);
var StyledUploadingOverlay = styled.div.withConfig({
  displayName: "MediaThumbnailTile__StyledUploadingOverlay",
  componentId: "sc-296m8n-6"
})(["position:absolute;width:100%;height:100%;opacity:0.5;cursor:progress;background-color:", ";z-index:1;"], OLAF);
var StyledBlockIcon = styled(UIIconCircle).withConfig({
  displayName: "MediaThumbnailTile__StyledBlockIcon",
  componentId: "sc-296m8n-7"
})(["z-index:2;position:absolute;top:4px;left:4px;cursor:not-allowed;"]);

var InsertDisabledIcon = function InsertDisabledIcon() {
  return /*#__PURE__*/_jsx(StyledBlockIcon, {
    name: "block",
    backgroundColor: OBSIDIAN,
    color: OLAF,
    size: 16,
    padding: 0,
    innerStyles: {
      transform: 'scale(1.1)',
      transformOrigin: 'center',
      lineHeight: '16px'
    }
  });
};

var MediaThumbnailTile = function MediaThumbnailTile(_ref) {
  var file = _ref.file,
      isSelected = _ref.isSelected,
      isHostAppContextPrivate = _ref.isHostAppContextPrivate,
      onInsert = _ref.onInsert,
      onSelect = _ref.onSelect;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      errorLoadingThumbnail = _useState2[0],
      setErrorLoadingThumbnail = _useState2[1];

  var thumbnailTitle = getFileNameAndExtension(file);
  var isUploading = file.has('progress');
  var isInsertDisabled = Boolean(file.get('notSupported'));
  var showThumbnail = getHasThumbnail(file);
  var showTooltip = isInsertDisabled || errorLoadingThumbnail || !getIsThumbnailTooltipDisabled(file);

  var handleSelect = function handleSelect() {
    if (isSelected) {
      onSelect(null, {
        target: 'thumbnail-details-button'
      });
    } else {
      onSelect(file, {
        target: 'thumbnail-details-button'
      });
    }
  };

  var handleInsert = function handleInsert() {
    onInsert(file, {
      target: 'thumbnail-tile'
    });
  };

  var handleImageLoadError = function handleImageLoadError() {
    if (!errorLoadingThumbnail) {
      setErrorLoadingThumbnail(true);
    }
  };

  var renderFileTypeIcon = function renderFileTypeIcon() {
    return /*#__PURE__*/_jsx(FileTypeIcon, {
      color: getIsVideo(file) ? BATTLESHIP : EERIE,
      size: 32,
      file: file,
      draggable: false
    });
  };

  var renderUploadingVideoPreview = function renderUploadingVideoPreview() {
    return /*#__PURE__*/_jsxs(StyledUploadingWrapper, {
      title: thumbnailTitle,
      "data-test-id": "thumbnail-uploading",
      children: [/*#__PURE__*/_jsx(VideoIcon, {
        size: 30
      }), /*#__PURE__*/_jsx(StyledUploadProgress, {
        value: file.get('progress'),
        color: CALYPSO
      }), /*#__PURE__*/_jsx(StyledUploadingOverlay, {})]
    });
  };

  var renderUploadingImagePreview = function renderUploadingImagePreview() {
    return /*#__PURE__*/_jsxs(StyledUploadingWrapper, {
      title: thumbnailTitle,
      "data-test-id": "thumbnail-uploading",
      children: [showThumbnail && file.get('tempUrl') ? /*#__PURE__*/_jsx(StyledThumbnailImage, {
        alt: thumbnailTitle,
        draggable: false,
        src: file.get('tempUrl')
      }) : renderFileTypeIcon(), /*#__PURE__*/_jsx(StyledUploadProgress, {
        value: file.get('progress'),
        color: CALYPSO
      }), /*#__PURE__*/_jsx(StyledUploadingOverlay, {})]
    });
  };

  var renderThumbnail = function renderThumbnail() {
    var thumbnailSize = getShouldUsePreviewSize(file) && !getIsVideo(file) ? ThumbnailSizes.PREVIEW : ThumbnailSizes.MEDIUM;
    return /*#__PURE__*/_jsx(StyledThumbnailImage, {
      className: "image__transparency-checkboard",
      alt: thumbnailTitle,
      draggable: false,
      onError: handleImageLoadError,
      disabled: isInsertDisabled,
      "data-test-id": "thumbnail-image",
      src: getImageSrc(file, thumbnailSize, {
        isFallbackImageDisabled: true,
        shouldUpscale: true,
        fallbackSize: thumbnailSize === ThumbnailSizes.PREVIEW ? ThumbnailSizes.MEDIUM : null
      })
    });
  };

  var renderThumbnailLink = function renderThumbnailLink() {
    if (isUploading) {
      return getIsVideo(file) ? renderUploadingVideoPreview() : renderUploadingImagePreview();
    }

    return /*#__PURE__*/_jsxs(StyledInsertLink, {
      use: "unstyled",
      onClick: handleInsert,
      disabled: isInsertDisabled,
      title: thumbnailTitle,
      "data-test-id": "insert-thumbnail-link",
      children: [showThumbnail && !errorLoadingThumbnail ? renderThumbnail(file, thumbnailTitle) : renderFileTypeIcon(file), getIsVideo(file) && /*#__PURE__*/_jsx(ThumbnailVideoDuration, {
        duration: file.getIn(['meta', 'duration'])
      })]
    });
  };

  return /*#__PURE__*/_jsxs(StyledMediaThumbnailTile, {
    "data-test-id": "thumbnail-tile",
    children: [!isUploading && /*#__PURE__*/_jsx(StyledFloatingButtons, {
      children: /*#__PURE__*/_jsx(UIButton, {
        size: "extra-small",
        use: "tertiary",
        onClick: handleSelect,
        "data-test-id": "thumbnail-info-button",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "FileManagerLib.actions.fileDetail"
        })
      })
    }), isInsertDisabled && /*#__PURE__*/_jsx(InsertDisabledIcon, {}), /*#__PURE__*/_jsx(UITooltip, {
      "data-test-id": "thumbnail-tooltip",
      disabled: !showTooltip,
      title: file.get('notSupportedReason') || /*#__PURE__*/_jsx(FormattedMessage, {
        message: getThumbnailTooltipI18nKey(file, isHostAppContextPrivate)
      }),
      placement: "left",
      children: renderThumbnailLink()
    })]
  });
};

MediaThumbnailTile.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  file: PropTypes.instanceOf(Immutable.Map).isRequired,
  onSelect: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  isHostAppContextPrivate: PropTypes.bool.isRequired
};
export default /*#__PURE__*/memo(MediaThumbnailTile);