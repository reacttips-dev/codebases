'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FolderModal from '../../folder/FolderModal';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIButton from 'UIComponents/button/UIButton';
export default createReactClass({
  displayName: "NewFolderButton",
  propTypes: {
    saveFolder: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    use: PropTypes.string
  },
  getInitialState: function getInitialState() {
    return {
      showFolderModal: false
    };
  },
  getCurrentFolderId: function getCurrentFolderId() {
    var folderId = this.props.location.query.folder;
    return folderId && parseInt(folderId, 10);
  },
  renderFolderModal: function renderFolderModal() {
    var _this = this;

    if (!this.state.showFolderModal) {
      return null;
    }

    return /*#__PURE__*/_jsx(FolderModal, {
      onConfirm: function onConfirm(folder) {
        _this.props.saveFolder(folder);

        _this.setState({
          showFolderModal: false
        });
      },
      onReject: function onReject() {
        return _this.setState({
          showFolderModal: false
        });
      }
    });
  },
  renderButton: function renderButton() {
    var _this2 = this;

    return /*#__PURE__*/_jsx(UIButton, {
      onClick: function onClick() {
        return _this2.setState({
          showFolderModal: true
        });
      },
      responsive: false,
      disabled: Boolean(this.getCurrentFolderId()),
      "data-selenium-test": "sales-content-index-new-folder-button",
      size: "small",
      use: this.props.use,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.header.newFolderButton.buttonText"
      })
    });
  },
  render: function render() {
    if (this.getCurrentFolderId()) {
      return /*#__PURE__*/_jsx(UITooltip, {
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "salesContentIndexUI.header.newFolderButton.cannotCreateFolderInsideFolderTooltip"
        }),
        placement: "bottom",
        children: this.renderButton()
      });
    }

    return /*#__PURE__*/_jsxs(Fragment, {
      children: [this.renderFolderModal(), this.renderButton()]
    });
  }
});