'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { useState } from 'react';
import I18n from 'I18n';
import { canWrite } from 'SalesTemplateEditor/lib/permissions';
import { connect } from 'react-redux';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UITypeahead from 'UIComponents/typeahead/UITypeahead';
import UITruncateString from 'UIComponents/text/UITruncateString';
import CreateEditTemplateTooltip from '../CreateEditTemplateTooltip';

function getFolderOptions(folders) {
  var initial = [{
    text: I18n.text('templateEditor.noFolder'),
    value: '0'
  }];
  return folders.reduce(function (aggregate, folder) {
    return aggregate.concat([{
      text: folder.get('name'),
      value: folder.get('id').toString()
    }]);
  }, initial);
}

var FolderDropdown = function FolderDropdown(_ref) {
  var buttonUse = _ref.buttonUse,
      folderId = _ref.folderId,
      folders = _ref.folders,
      readOnly = _ref.readOnly,
      selectFolder = _ref.selectFolder,
      _ref$useSelectFolderP = _ref.useSelectFolderPrompt,
      useSelectFolderPrompt = _ref$useSelectFolderP === void 0 ? false : _ref$useSelectFolderP;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      hasMadeSelection = _useState2[0],
      setHasMadeSelection = _useState2[1];

  if (readOnly) {
    return null;
  }

  function handleFolderSelect(e) {
    var newValue = e.target.value;

    var _folderId = parseInt(newValue, 10);

    selectFolder(_folderId);
    if (!hasMadeSelection) setHasMadeSelection(true);
  }

  var folderOptions = getFolderOptions(folders);
  var value = folderId ? "" + folderId : '0';
  var selectedFolderName = folderOptions.find(function (folder) {
    return folder.value === value;
  }).text;
  var showSelectFolderButtonText = !hasMadeSelection && value === '0' && useSelectFolderPrompt;

  var buttonText = /*#__PURE__*/_jsx(UITruncateString, {
    className: "display-inline-flex",
    maxWidth: 200,
    children: showSelectFolderButtonText ? I18n.text('templateEditor.selectAFolder') : selectedFolderName
  });

  return /*#__PURE__*/_jsx("div", {
    className: "inline-dropdown",
    children: /*#__PURE__*/_jsx(CreateEditTemplateTooltip, {
      buttonCreatesNewTemplate: false,
      children: /*#__PURE__*/_jsx(UIDropdown, {
        buttonUse: buttonUse,
        iconName: buttonUse === 'link' ? 'folder' : null,
        buttonText: buttonText,
        popoverProps: {
          className: 'template-editor-folder-popover'
        },
        disabled: !canWrite(),
        children: /*#__PURE__*/_jsx(UITypeahead, {
          onChange: handleFolderSelect,
          options: folderOptions,
          value: value
        })
      })
    })
  });
};

FolderDropdown.propTypes = {
  buttonUse: PropTypes.string,
  folderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  folders: PropTypes.instanceOf(List).isRequired,
  readOnly: PropTypes.bool.isRequired,
  selectFolder: PropTypes.func.isRequired,
  useSelectFolderPrompt: PropTypes.bool
};
export default connect(function (state) {
  return {
    folders: state.folders.get('folders')
  };
})(FolderDropdown);