'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import Immutable from 'immutable';
import styled from 'styled-components';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { CALYPSO, CALYPSO_LIGHT, EERIE, OLAF, KOALA } from 'HubStyleTokens/colors';
import UILink from 'UIComponents/link/UILink';
import UINanoProgress from 'UIComponents/progress/UINanoProgress';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIButton from 'UIComponents/button/UIButton';
import UIMediaLeft from 'UIComponents/layout/UIMediaLeft';
import UIMediaBody from 'UIComponents/layout/UIMediaBody';
import UITruncateString from 'UIComponents/text/UITruncateString';
import UIMedia from 'UIComponents/layout/UIMedia';
import UIMediaRight from 'UIComponents/layout/UIMediaRight';
import ThumbnailSizes from 'FileManagerCore/enums/ThumbnailSizes';
import { getHasThumbnail, getIsVideo, getImageSrc } from 'FileManagerCore/utils/file';
import { getIsThumbnailTooltipDisabled, getThumbnailTooltipI18nKey } from 'FileManagerCore/utils/thumbnailTooltip';
import FileTypeIcon from 'FileManagerCore/components/FileTypeIcon';
import VideoIconOverlay from 'FileManagerCore/components/VideoIconOverlay';
import { getFileNameAndExtension } from '../../utils/fileNameAndExtension';
import { FILE_FOLDER_THUMB_SIZE } from '../../Constants';
var StyledHoverButtons = styled(UIMediaRight).withConfig({
  displayName: "FileRowTile__StyledHoverButtons",
  componentId: "sc-17o8lqa-0"
})(["display:none;"]);
var StyledFileRowTile = styled.div.withConfig({
  displayName: "FileRowTile__StyledFileRowTile",
  componentId: "sc-17o8lqa-1"
})(["display:flex;align-items:center;height:100%;width:100%;cursor:pointer;border:1px solid ", ";border-bottom:", ";&:hover{background-color:", ";}&:hover ", "{display:block;}", ""], KOALA, function (props) {
  return props.isLast ? "1px solid " + KOALA : 'none';
}, CALYPSO_LIGHT, StyledHoverButtons, function (props) {
  return props.isSelected && "\n    background-color: " + KOALA + ";\n    " + StyledHoverButtons + " {\n      display: block;\n    }";
});
var StyledMedia = styled(UIMedia).withConfig({
  displayName: "FileRowTile__StyledMedia",
  componentId: "sc-17o8lqa-2"
})(["width:100%;"]);
var StyledThumbnailImage = styled.img.withConfig({
  displayName: "FileRowTile__StyledThumbnailImage",
  componentId: "sc-17o8lqa-3"
})(["max-width:", "px;max-height:", "px;opacity:", ";"], FILE_FOLDER_THUMB_SIZE, FILE_FOLDER_THUMB_SIZE, function (props) {
  return props.disabled ? 0.5 : 1;
});
var StyledUploadingOverlay = styled.div.withConfig({
  displayName: "FileRowTile__StyledUploadingOverlay",
  componentId: "sc-17o8lqa-4"
})(["position:absolute;width:100%;height:100%;opacity:0.5;cursor:progress;background-color:", ";z-index:1;"], OLAF);

var FileRowTile = function FileRowTile(_ref) {
  var file = _ref.file,
      isSelected = _ref.isSelected,
      isLast = _ref.isLast,
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
  var showTooltip = isInsertDisabled || errorLoadingThumbnail || !getIsThumbnailTooltipDisabled(file);

  var handleClickDetails = function handleClickDetails(e) {
    e.stopPropagation();

    if (isSelected) {
      onSelect(null, {
        target: 'file-row-details-button'
      });
    } else {
      onSelect(file, {
        target: 'file-row-details-button'
      });
    }
  };

  var handleRowClick = function handleRowClick() {
    if (isSelected) {
      onSelect(null, {
        target: 'file-row'
      });
    } else {
      onSelect(file, {
        target: 'file-row'
      });
    }
  };

  var handleInsert = function handleInsert(e) {
    e.stopPropagation();
    onInsert(file, {
      target: 'file-row'
    });
  };

  var handleImageLoadError = function handleImageLoadError() {
    if (!errorLoadingThumbnail) {
      setErrorLoadingThumbnail(true);
    }
  };

  var renderThumbnail = function renderThumbnail() {
    return /*#__PURE__*/_jsxs("div", {
      className: "align-center justify-center text-center",
      children: [/*#__PURE__*/_jsx(StyledThumbnailImage, {
        alt: thumbnailTitle,
        draggable: false,
        onError: handleImageLoadError,
        disabled: isInsertDisabled,
        src: getImageSrc(file, ThumbnailSizes.THUMB, {
          isFallbackImageDisabled: true
        })
      }), getIsVideo(file) && /*#__PURE__*/_jsx(VideoIconOverlay, {})]
    });
  };

  var renderFileTypeIcon = function renderFileTypeIcon() {
    return /*#__PURE__*/_jsx(FileTypeIcon, {
      color: EERIE,
      size: 32,
      file: file,
      draggable: false
    });
  };

  var renderDetailsButton = function renderDetailsButton() {
    return /*#__PURE__*/_jsx(StyledHoverButtons, {
      children: /*#__PURE__*/_jsx(UIButton, {
        className: "details-button",
        size: "extra-small",
        use: "tertiary-light",
        onClick: handleClickDetails,
        "data-test-id": "file-row-details-button",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "FileManagerLib.actions.fileDetail"
        })
      })
    });
  };

  return /*#__PURE__*/_jsxs(StyledFileRowTile, {
    isSelected: isSelected,
    isLast: isLast,
    onClick: handleRowClick,
    "data-test-id": "file-row",
    children: [isUploading && /*#__PURE__*/_jsx(StyledUploadingOverlay, {
      children: /*#__PURE__*/_jsx(UINanoProgress, {
        color: CALYPSO,
        value: file.get('progress')
      })
    }), /*#__PURE__*/_jsx(UITooltip, {
      disabled: !showTooltip,
      title: file.get('notSupportedReason') || /*#__PURE__*/_jsx(FormattedMessage, {
        message: getThumbnailTooltipI18nKey(file, isHostAppContextPrivate)
      }),
      placement: "bottom",
      children: /*#__PURE__*/_jsxs(StyledMedia, {
        align: "center",
        className: "p-x-2",
        children: [/*#__PURE__*/_jsx(UIMediaLeft, {
          style: {
            width: FILE_FOLDER_THUMB_SIZE
          },
          children: getHasThumbnail(file) && !errorLoadingThumbnail ? renderThumbnail(file) : renderFileTypeIcon(file)
        }), /*#__PURE__*/_jsx(UIMediaBody, {
          className: "align-center",
          children: /*#__PURE__*/_jsx(UILink, {
            onClick: handleInsert,
            disabled: isInsertDisabled,
            children: /*#__PURE__*/_jsx(UITruncateString, {
              children: thumbnailTitle
            })
          })
        }), !isUploading && renderDetailsButton()]
      })
    })]
  });
};

FileRowTile.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  file: PropTypes.instanceOf(Immutable.Map).isRequired,
  onSelect: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  isHostAppContextPrivate: PropTypes.bool.isRequired
};
export default /*#__PURE__*/memo(FileRowTile);