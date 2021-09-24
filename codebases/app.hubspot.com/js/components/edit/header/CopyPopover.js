'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
import I18n from 'I18n';
import unescapedText from 'I18n/utils/unescapedText';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import UISelect from 'UIComponents/input/UISelect';
import UIButton from 'UIComponents/button/UIButton';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UISection from 'UIComponents/section/UISection';
import UITextInput from 'UIComponents/input/UITextInput';
import { sequenceNameIsValid } from 'SequencesUI/util/validateSequence';
import { loadFolderOptions } from 'SalesContentIndexUI/utils/folderOptions';
import { SEQUENCES_FOLDER } from 'SalesContentIndexUI/data/constants/FolderContentTypes';

var CopyPopover = function CopyPopover(_ref) {
  var onConfirm = _ref.onConfirm,
      onReject = _ref.onReject,
      open = _ref.open,
      setPopoverOpen = _ref.setPopoverOpen,
      sequence = _ref.sequence,
      sequenceEditor = _ref.sequenceEditor,
      placement = _ref.placement,
      children = _ref.children;

  var _useState = useState(sequenceEditor.get('nameEdited') ? sequence.get('name') : unescapedText('edit.editNameModal.copy', {
    name: sequence.get('name')
  })),
      _useState2 = _slicedToArray(_useState, 2),
      name = _useState2[0],
      setName = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      folderId = _useState4[0],
      setFolderId = _useState4[1];

  function handleSave() {
    var parsedFolderId = folderId && parseInt(folderId, 10);
    onConfirm({
      name: name,
      folderId: parsedFolderId
    });
  }

  function handleEditName(e) {
    setName(e.target.value);
  }

  var nameIsvalid = sequenceNameIsValid(name);
  var validationMessage = nameIsvalid || name.trim() === '' ? null : /*#__PURE__*/_jsx(FormattedMessage, {
    message: "edit.editName.error.nameTooLong"
  });

  function handleFolderSelect(_ref2) {
    var value = _ref2.target.value;
    setFolderId(value);
  }

  return /*#__PURE__*/_jsx(UIPopover, {
    open: open,
    placement: placement,
    onOpenChange: function onOpenChange(evt) {
      return setPopoverOpen(evt.target.value);
    },
    content: {
      body: /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsxs(UISection, {
          children: [/*#__PURE__*/_jsx(UIFormControl, {
            label: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sequences.builder.header.copyPopover.nameLabel"
            }),
            verticalSeparation: "flush",
            error: !nameIsvalid,
            validationMessage: validationMessage,
            children: /*#__PURE__*/_jsx(UITextInput, {
              autoFocus: true,
              value: name,
              placeholder: I18n.text('edit.editNameModal.placeholder'),
              onChange: handleEditName,
              "data-unit-test": "sequence-name-input"
            })
          }), /*#__PURE__*/_jsx(UIFormControl, {
            label: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sequences.builder.header.copyPopover.folder.label"
            }),
            verticalSeparation: "flush",
            children: /*#__PURE__*/_jsx(UISelect, {
              clearable: true,
              loadOptions: function loadOptions(searchString, callback) {
                return loadFolderOptions(SEQUENCES_FOLDER, searchString, callback);
              },
              placeholder: I18n.text('sequences.builder.header.copyPopover.folder.noFolder'),
              value: folderId,
              onChange: handleFolderSelect,
              "data-unit-test": "sequence-folder-select"
            })
          })]
        }), /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "sequences.builder.header.copyPopover.sharing.sharedWithEveryone"
        })]
      }),
      footer: /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(UIButton, {
          size: "small",
          use: "tertiary",
          onClick: handleSave,
          disabled: !nameIsvalid,
          "data-unit-test": "save-button",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequences.builder.header.copyPopover.footer.save"
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          size: "small",
          use: "tertiary-light",
          onClick: onReject,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequences.builder.header.copyPopover.footer.cancel"
          })
        })]
      })
    },
    "data-unit-test": "copyPopover",
    children: children
  });
};

CopyPopover.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setPopoverOpen: PropTypes.func.isRequired,
  placement: PropTypes.string,
  sequence: PropTypes.instanceOf(ImmutableMap).isRequired,
  sequenceEditor: PropTypes.instanceOf(ImmutableMap).isRequired,
  children: PropTypes.node.isRequired
};
export default CopyPopover;