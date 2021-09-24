'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import I18n from 'I18n';
import { broadcastStatusTypeProp } from '../../lib/propTypes';
import { BROADCAST_STATUS_TYPE, SHEPHERD_TOURS } from '../../lib/constants';
import UISection from 'UIComponents/section/UISection';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIButton from 'UIComponents/button/UIButton';
import SocialContext from '../app/SocialContext';
import H2 from 'UIComponents/elements/headings/H2';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import TourStep from '../tour/TourStep';

var PublishingModalButtons = /*#__PURE__*/function (_Component) {
  _inherits(PublishingModalButtons, _Component);

  function PublishingModalButtons() {
    _classCallCheck(this, PublishingModalButtons);

    return _possibleConstructorReturn(this, _getPrototypeOf(PublishingModalButtons).apply(this, arguments));
  }

  _createClass(PublishingModalButtons, [{
    key: "getBulkActionsButtonTooltip",
    value: function getBulkActionsButtonTooltip() {
      if (!this.props.userIsPublisher) {
        return I18n.text('sui.broadcasts.bulkActions.moveToScheduledcantPublishTooltip');
      }

      return I18n.text('sui.broadcasts.bulkActions.moveToScheduledDisabledTooltip');
    }
  }, {
    key: "shouldHidePublishingTableTourShepherd",
    value: function shouldHidePublishingTableTourShepherd() {
      return this.props.isComposerOpen || this.props.isFacebookEngagementModalVisible || this.props.isBulkUploadDisabled || this.props.isDetailsPanelOpen;
    }
  }, {
    key: "renderBulkActionDialog",
    value: function renderBulkActionDialog() {
      var _this = this;

      if (this.props.showBulkActionDialog) {
        var modalType = this.props.bulkAction === 'deleteAll' ? 'danger' : 'success';
        var buttonType = this.props.bulkAction === 'deleteAll' ? 'danger' : 'primary';
        return /*#__PURE__*/_jsxs(UIModal, {
          use: modalType,
          children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
            children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
              onClick: this.props.closeBulkActionModal
            }), /*#__PURE__*/_jsx(H2, {
              children: I18n.text("sui.broadcasts.bulkActions.header." + this.props.bulkAction)
            })]
          }), /*#__PURE__*/_jsx(UIDialogBody, {
            children: I18n.text("sui.broadcasts.bulkActions.confirmationPrompt." + this.props.bulkAction, {
              count: this.props.uploadedCount
            })
          }), /*#__PURE__*/_jsxs(UIDialogFooter, {
            children: [/*#__PURE__*/_jsx(UIButton, {
              disabled: this.props.isBulkActionLoading,
              onClick: function onClick() {
                _this.context.trackInteraction("executing a bulk action - " + _this.props.bulkAction);

                _this.props.executeBulkStatusChange(_this.props.bulkAction);
              },
              use: buttonType,
              children: I18n.text("sui.broadcasts.bulkActions.confirm." + this.props.bulkAction)
            }), /*#__PURE__*/_jsx(UIButton, {
              onClick: this.props.closeBulkActionModal,
              use: "secondary",
              children: I18n.text('sui.broadcasts.bulkActions.cancel')
            })]
          })]
        });
      }

      return null;
    }
  }, {
    key: "renderBulkActions",
    value: function renderBulkActions() {
      var _this2 = this;

      if (this.props.broadcastStatusType !== BROADCAST_STATUS_TYPE.uploaded) {
        return null;
      }

      var countType = 'none';

      if (this.props.uploadedCount === 1) {
        countType = 'one';
      } else if (this.props.uploadedCount > 1) {
        countType = 'other';
      }

      var scheduleButton = /*#__PURE__*/_jsx(UIButton, {
        size: "sm",
        disabled: this.props.moveToScheduledDisabled || this.props.uploadedCount === 0 || !this.props.userIsPublisher,
        use: "tertiary-light",
        onClick: function onClick() {
          return _this2.props.openBulkActionModal('moveToScheduled');
        },
        children: I18n.text("sui.broadcasts.bulkActions.buttonText.moveToScheduled." + countType, {
          count: this.props.uploadedCount
        })
      });

      var tooltippedScheduleButton = /*#__PURE__*/_jsx(UITooltip, {
        title: this.getBulkActionsButtonTooltip(),
        children: scheduleButton
      });

      return /*#__PURE__*/_jsxs("div", {
        children: [this.props.moveToScheduledDisabled || !this.props.userIsPublisher ? tooltippedScheduleButton : scheduleButton, /*#__PURE__*/_jsx(UIButton, {
          size: "sm",
          disabled: this.props.uploadedCount === 0,
          use: "tertiary-light",
          onClick: function onClick() {
            return _this2.props.openBulkActionModal('moveToDrafts');
          },
          children: I18n.text('sui.broadcasts.bulkActions.buttonText.moveToDrafts')
        }), /*#__PURE__*/_jsx(UIButton, {
          size: "sm",
          disabled: this.props.uploadedCount === 0,
          use: "danger",
          onClick: function onClick() {
            return _this2.props.openBulkActionModal('deleteAll');
          },
          children: I18n.text('sui.broadcasts.bulkActions.buttonText.deleteAll')
        })]
      });
    }
  }, {
    key: "renderBulkScheduleButton",
    value: function renderBulkScheduleButton() {
      return /*#__PURE__*/_jsx(UIButton, {
        use: "tertiary-light",
        size: "small",
        onClick: this.props.openBulkScheduleModal,
        disabled: this.props.isBulkUploadDisabled,
        children: I18n.text('sui.bulkScheduleModal.bulkSchedule.button')
      });
    }
  }, {
    key: "renderExportAndBulkSchedule",
    value: function renderExportAndBulkSchedule() {
      var tooltippedButton = this.props.uploadedCount > 0 ? /*#__PURE__*/_jsx(UITooltip, {
        title: I18n.text('sui.bulkScheduleModal.bulkSchedule.tooltip'),
        children: this.renderBulkScheduleButton()
      }) : this.renderBulkScheduleButton();
      return /*#__PURE__*/_jsxs("div", {
        className: "publishing-modal-buttons",
        children: [/*#__PURE__*/_jsx(UIButton, {
          use: "tertiary-light",
          size: "small",
          className: "export-modal-button",
          disabled: this.props.isExportDisabled,
          onClick: this.props.openExportModal,
          children: I18n.text('sui.exportModal.button')
        }), /*#__PURE__*/_jsx(TourStep, {
          forceHidden: this.shouldHidePublishingTableTourShepherd(),
          stepKey: 'stepBulk',
          tourKey: SHEPHERD_TOURS.publishingTable,
          placement: 'bottom left',
          children: /*#__PURE__*/_jsx("div", {
            style: {
              display: 'inline-block',
              marginLeft: '12px'
            },
            children: tooltippedButton
          })
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.broadcastStatusType === BROADCAST_STATUS_TYPE.uploaded) {
        return /*#__PURE__*/_jsxs(UISection, {
          className: "bulk-actions",
          children: [this.renderBulkActions(), this.renderBulkActionDialog()]
        });
      }

      return this.renderExportAndBulkSchedule();
    }
  }]);

  return PublishingModalButtons;
}(Component);

PublishingModalButtons.propTypes = {
  isBulkUploadDisabled: PropTypes.bool.isRequired,
  isExportDisabled: PropTypes.bool.isRequired,
  openExportModal: PropTypes.func,
  openBulkScheduleModal: PropTypes.func,
  openBulkActionModal: PropTypes.func,
  closeBulkActionModal: PropTypes.func,
  isLoading: PropTypes.bool,
  broadcastStatusType: broadcastStatusTypeProp,
  showBulkActionDialog: PropTypes.bool,
  uploadedCount: PropTypes.number,
  bulkAction: PropTypes.string,
  executeBulkStatusChange: PropTypes.func,
  moveToScheduledDisabled: PropTypes.bool,
  isBulkActionLoading: PropTypes.bool,
  userIsPublisher: PropTypes.bool.isRequired,
  isComposerOpen: PropTypes.bool.isRequired,
  isFacebookEngagementModalVisible: PropTypes.bool.isRequired,
  publishingTableStepsSeen: PropTypes.object,
  isDetailsPanelOpen: PropTypes.bool.isRequired
};
PublishingModalButtons.defaultProps = {
  isBulkUploadDisabled: false,
  isExportDisabled: false
};
PublishingModalButtons.contextType = SocialContext;
export { PublishingModalButtons as default };