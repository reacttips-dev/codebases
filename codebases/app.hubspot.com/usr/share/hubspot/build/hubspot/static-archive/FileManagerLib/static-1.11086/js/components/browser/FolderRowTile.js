'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import styled from 'styled-components';
import Immutable from 'immutable';
import { CALYPSO, CALYPSO_LIGHT, KOALA } from 'HubStyleTokens/colors';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIMedia from 'UIComponents/layout/UIMedia';
import UIMediaLeft from 'UIComponents/layout/UIMediaLeft';
import UIMediaBody from 'UIComponents/layout/UIMediaBody';
import UITruncateString from 'UIComponents/text/UITruncateString';
import FileDragAndDrop from 'FileManagerCore/components/FileDragAndDrop';
import { FILE_FOLDER_THUMB_SIZE, PICKER_FOLDER_CLASSNAME } from '../../Constants';
var StyledFolderRow = styled.a.withConfig({
  displayName: "FolderRowTile__StyledFolderRow",
  componentId: "sc-26hb1f-0"
})(["display:flex;align-items:center;height:100%;border:1px solid ", ";border-bottom:", ";", " &:hover{text-decoration:none;}"], KOALA, function (props) {
  return props.isLast ? "1px solid " + KOALA : 'none';
}, function (props) {
  return props.isOver && !props.disableUpload && "\n    border: 2px solid " + CALYPSO + ";\n    background-color: " + CALYPSO_LIGHT + ";\n ";
});
var StyledMedia = styled(UIMedia).withConfig({
  displayName: "FolderRowTile__StyledMedia",
  componentId: "sc-26hb1f-1"
})(["width:100%;"]);

var FolderRowTile = function FolderRowTile(_ref) {
  var folder = _ref.folder,
      isLast = _ref.isLast,
      disableUpload = _ref.disableUpload,
      onDropFiles = _ref.onDropFiles,
      onSelect = _ref.onSelect;
  var handleDropFiles = useCallback(function (files) {
    onDropFiles(files, folder);
  }, [folder, onDropFiles]);
  return /*#__PURE__*/_jsx(FileDragAndDrop, {
    disabled: disableUpload,
    onDropFiles: handleDropFiles,
    children: function children(_ref2) {
      var isOver = _ref2.isOver,
          props = _objectWithoutProperties(_ref2, ["isOver"]);

      return /*#__PURE__*/_jsx(StyledFolderRow, Object.assign({}, props, {
        className: PICKER_FOLDER_CLASSNAME,
        isLast: isLast,
        isOver: isOver,
        disableUpload: disableUpload,
        onClick: function onClick() {
          return onSelect(folder);
        },
        "data-test-id": "browse-folder-row",
        "data-test-object-id": folder.get('id'),
        children: /*#__PURE__*/_jsxs(StyledMedia, {
          className: "p-x-2",
          align: "center",
          children: [/*#__PURE__*/_jsx(UIMediaLeft, {
            className: "align-center justify-center text-center",
            style: {
              width: FILE_FOLDER_THUMB_SIZE
            },
            children: /*#__PURE__*/_jsx(UIIcon, {
              name: "folder",
              color: CALYPSO,
              size: 20,
              className: "m-x-auto"
            })
          }), /*#__PURE__*/_jsx(UIMediaBody, {
            children: /*#__PURE__*/_jsx(UITruncateString, {
              children: folder.get('name')
            })
          })]
        })
      }));
    }
  });
};

FolderRowTile.propTypes = {
  folder: PropTypes.instanceOf(Immutable.Map).isRequired,
  isLast: PropTypes.bool.isRequired,
  disableUpload: PropTypes.bool.isRequired,
  onDropFiles: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired
};
FolderRowTile.defaultProps = {
  disableUpload: false
};
export default FolderRowTile;