'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { getFullUrl } from 'hubspot-url-utils';
import I18n from 'I18n';
import { abstractChannelsProp } from '../../lib/propTypes';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIButton from 'UIComponents/button/UIButton';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UIAlert from 'UIComponents/alert/UIAlert';
import FileUploadZone from '../app/FileUploadZone';
import BulkScheduleFailure from './BulkScheduleFailure';
import { ALLOWED_BULK_UPLOAD_EXTENSIONS } from '../../lib/constants';
import SocialContext from '../app/SocialContext';

var BulkScheduleDialog = /*#__PURE__*/function (_Component) {
  _inherits(BulkScheduleDialog, _Component);

  function BulkScheduleDialog() {
    var _this;

    _classCallCheck(this, BulkScheduleDialog);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BulkScheduleDialog).call(this));

    _this.onBulkScheduleClick = function () {
      if (!_this.state.fileData) {
        return;
      }

      _this.context.trackInteraction('bulk schedule v2');

      _this.props.bulkScheduleMessages(_this.state.fileData);
    };

    _this.onUpload = function (fileData) {
      _this.setState({
        fileData: fileData
      });
    };

    _this.state = {
      fileData: undefined
    };
    return _this;
  }

  _createClass(BulkScheduleDialog, [{
    key: "renderFailure",
    value: function renderFailure() {
      if (this.props.error && this.props.error.responseJSON) {
        return /*#__PURE__*/_jsx(BulkScheduleFailure, {
          error: this.props.error
        });
      }

      return null;
    }
  }, {
    key: "renderRememberDialog",
    value: function renderRememberDialog() {
      if (!this.props.error && !this.props.loading) {
        return /*#__PURE__*/_jsx(UIAlert, {
          titleText: I18n.text('sui.bulkScheduleModal.bulkSchedule.rememberDialog.header'),
          type: "warning",
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "sui.bulkScheduleModal.bulkSchedule.rememberDialog.note"
          })
        });
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var trackInteraction = this.context.trackInteraction;
      return /*#__PURE__*/_jsxs("section", {
        className: "bulk-schedule-dialog",
        children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
          onClick: this.props.closeModal
        }), /*#__PURE__*/_jsx(UIDialogHeader, {
          children: /*#__PURE__*/_jsx("h2", {
            children: I18n.text('sui.bulkScheduleModal.bulkSchedule.header')
          })
        }), /*#__PURE__*/_jsxs(UIDialogBody, {
          children: [/*#__PURE__*/_jsx(UIAlert, {
            style: {
              marginBottom: '2rem'
            },
            titleText: I18n.text('sui.bulkScheduleModal.bulkSchedule.updatedAlert.title'),
            closeable: false,
            type: "info",
            children: I18n.text('sui.bulkScheduleModal.bulkSchedule.updatedAlert.blurb')
          }), /*#__PURE__*/_jsx(UIFormControl, {
            label: I18n.text('sui.bulkScheduleModal.bulkSchedule.upload.label'),
            className: "p-bottom-3",
            children: /*#__PURE__*/_jsx(FileUploadZone, {
              showBrowse: false,
              selectedFile: this.state.fileData,
              allowedExtensions: ALLOWED_BULK_UPLOAD_EXTENSIONS,
              onUpload: this.onUpload,
              variation: "BULK_UPLOAD"
            })
          }), /*#__PURE__*/_jsxs("p", {
            className: "get-started-text",
            children: [' ', I18n.text('sui.bulkScheduleModal.bulkSchedule.getStarted'), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx("a", {
              target: '_self',
              href: getFullUrl('api') + "/broadcast/v2/bulk/upload-sample-excel?portalId=" + this.props.portalId,
              onClick: function onClick() {
                return trackInteraction('bulkV2 downloaded excel template');
              },
              children: I18n.text('sui.bulkScheduleModal.bulkSchedule.downloadExcelSample')
            }), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx("a", {
              target: '_self',
              href: getFullUrl('api') + "/broadcast/v2/bulk/upload-sample-csv?portalId=" + this.props.portalId,
              onClick: function onClick() {
                return trackInteraction('bulkV2 downloaded csv template');
              },
              children: I18n.text('sui.bulkScheduleModal.bulkSchedule.downloadCsvSample')
            })]
          }), this.renderRememberDialog(), this.renderFailure()]
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(UILoadingButton, {
            className: "upload-bs bulk-schedule-button",
            use: "primary",
            onClick: this.onBulkScheduleClick,
            loading: this.props.loading,
            disabled: !this.state.fileData,
            children: I18n.text('sui.bulkScheduleModal.bulkSchedule.footer.submit')
          }), /*#__PURE__*/_jsx(UIButton, {
            className: "cancel-bs bulk-schedule-button",
            onClick: this.props.closeModal,
            disabled: this.props.loading,
            children: I18n.text('sui.bulkScheduleModal.bulkSchedule.footer.cancel')
          })]
        })]
      });
    }
  }]);

  return BulkScheduleDialog;
}(Component);

BulkScheduleDialog.propTypes = {
  closeModal: PropTypes.func,
  channels: abstractChannelsProp,
  loading: PropTypes.bool,
  error: PropTypes.object,
  portalId: PropTypes.number.isRequired,
  bulkScheduleMessages: PropTypes.func
};
BulkScheduleDialog.contextType = SocialContext;
export { BulkScheduleDialog as default };