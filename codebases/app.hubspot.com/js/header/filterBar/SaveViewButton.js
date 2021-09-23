'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import H5 from 'UIComponents/elements/headings/H5';
import PropTypes from 'prop-types';
import { useState } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import UILink from 'UIComponents/link/UILink';
import UIList from 'UIComponents/list/UIList';
import UIPopover from 'UIComponents/tooltip/UIPopover';
export var SaveViewButton = function SaveViewButton(props) {
  var isEditableView = props.isEditableView,
      onResetView = props.onResetView,
      onSaveView = props.onSaveView,
      onSaveViewAsNew = props.onSaveViewAsNew;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isPopoverOpen = _useState2[0],
      setIsPopoverOpen = _useState2[1];

  var headerMessage = isEditableView ? 'indexPage.saveButtonPopover.header.editable' : 'indexPage.saveButtonPopover.header.readOnly';
  var bodyMessage = isEditableView ? 'indexPage.saveButtonPopover.body.editable' : 'indexPage.saveButtonPopover.body.readOnly';
  return /*#__PURE__*/_jsx(UIPopover, {
    content: {
      header: /*#__PURE__*/_jsx(H5, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: headerMessage
        })
      }),
      body: /*#__PURE__*/_jsx(FormattedMessage, {
        message: bodyMessage
      }),
      footer: /*#__PURE__*/_jsxs(UIList, {
        firstChildClassName: "p-bottom-4",
        children: [/*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(UIButton, {
            "data-selenium-test": "popover-save-view-btn",
            disabled: !isEditableView,
            onClick: function onClick() {
              onSaveView();
              setIsPopoverOpen(false);
            },
            use: "tertiary",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "indexPage.saveButtonPopover.footer.saveButton"
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            "data-selenium-test": "popover-reset-btn",
            onClick: function onClick() {
              onResetView();
              setIsPopoverOpen(false);
            },
            use: "tertiary-light",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "indexPage.saveButtonPopover.footer.resetButton"
            })
          })]
        }), /*#__PURE__*/_jsx(UILink, {
          "data-selenium-test": "popover-save-as-new-link",
          underline: true,
          onClick: function onClick() {
            onSaveViewAsNew();
            setIsPopoverOpen(false);
          },
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "indexPage.saveButtonPopover.footer.saveAsButton"
          })
        })]
      })
    },
    onOpenChange: function onOpenChange(evt) {
      return setIsPopoverOpen(evt.target.value);
    },
    open: isPopoverOpen,
    placement: 'bottom left',
    width: 300,
    children: /*#__PURE__*/_jsxs(UIButton, {
      "data-selenium-test": "index-save-view-btn",
      use: "tertiary-light",
      onClick: function onClick() {
        setIsPopoverOpen(!isPopoverOpen);
      },
      children: [/*#__PURE__*/_jsx(UIIcon, {
        name: "saveEditableView"
      }), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "indexPage.filterBar.saveButton"
      })]
    })
  });
};
SaveViewButton.propTypes = {
  isEditableView: PropTypes.bool.isRequired,
  onResetView: PropTypes.func.isRequired,
  onSaveView: PropTypes.func.isRequired,
  onSaveViewAsNew: PropTypes.func.isRequired
};
export default SaveViewButton;