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
import I18n from 'I18n';
import { OrderedMap } from 'immutable';
import UILink from 'UIComponents/link/UILink';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIIcon from 'UIComponents/icon/UIIcon';
import { broadcastStatusTypeProp, orderedMapProp, listProp, setProp } from '../../lib/propTypes';
import { BROADCAST_STATUS_TYPE } from '../../lib/constants';
import CampaignModal from './CampaignModal';
import SocialContext from '../app/SocialContext';
import { passPropsFor } from '../../lib/utils';

var HeaderActions = /*#__PURE__*/function (_Component) {
  _inherits(HeaderActions, _Component);

  function HeaderActions() {
    var _this;

    _classCallCheck(this, HeaderActions);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HeaderActions).call(this));

    _this.onCampaignsSelectorClick = function () {
      _this.setState({
        editingCampaign: true
      });

      var campaignGuidSelected = _this.props.broadcasts.filter(function (b) {
        return _this.props.selected.includes(b.broadcastGuid);
      }).map(function (b) {
        return b.campaignGuid;
      }).toSet();

      if (campaignGuidSelected.size === 1) {
        _this.setState({
          campaignGuid: campaignGuidSelected.first()
        });
      } else {
        _this.setState({
          campaignGuid: null
        });
      }
    };

    _this.onUpdateCampaign = function (campaignGuid, campaign) {
      if (campaign) {
        _this.props.patchBroadcasts(_this.props.selected.toArray(), {
          campaignGuid: campaign.guid || null,
          campaignName: campaign.display_name || null
        });
      }

      _this.props.clearSelection();

      _this.setState({
        editingCampaign: false
      });

      _this.context.trackInteraction('bulk set campaign');
    };

    _this.onDelete = function () {
      _this.props.deleteBroadcasts(_this.props.selected.toArray());

      _this.props.clearSelection();

      _this.setState({
        deleting: false
      });

      _this.context.trackInteraction('bulk delete');
    };

    _this.onMakeDraft = function () {
      _this.props.makeDrafts(_this.props.selected.toArray());

      _this.props.clearSelection();

      _this.setState({
        deleting: false
      });

      _this.context.trackInteraction('bulk make draft');
    };

    _this.state = {
      editingCampaign: false,
      deleting: false,
      makingDraft: false,
      showNotificationChannelPermissions: false
    };
    return _this;
  }

  _createClass(HeaderActions, [{
    key: "canClone",
    value: function canClone() {
      var _this$props = this.props,
          broadcasts = _this$props.broadcasts,
          channelTypesForClone = _this$props.channelTypesForClone,
          selected = _this$props.selected;
      var selectedBroadcasts = broadcasts.filter(function (b) {
        return selected.includes(b.broadcastGuid);
      });
      return selectedBroadcasts.every(function (broadcast) {
        return channelTypesForClone.has(broadcast.getChannelSlug());
      });
    }
  }, {
    key: "userHasPermissionToEdit",
    value: function userHasPermissionToEdit() {
      var _this$props2 = this.props,
          userIsPublisher = _this$props2.userIsPublisher,
          broadcasts = _this$props2.broadcasts;
      return this.props.selected.every(function (id) {
        var broadcast = broadcasts.get(id);
        return broadcast.canEditStatus(userIsPublisher) && broadcast.userCanModify;
      });
    }
  }, {
    key: "renderCampaignModal",
    value: function renderCampaignModal() {
      var _this2 = this;

      if (!this.state.editingCampaign) {
        return null;
      }

      return /*#__PURE__*/_jsx(CampaignModal, Object.assign({}, passPropsFor(this.props, CampaignModal), {
        onClose: function onClose() {
          _this2.setState({
            editingCampaign: false
          });
        },
        onSubmit: this.onUpdateCampaign,
        campaignGuid: this.state.campaignGuid
      }));
    }
  }, {
    key: "renderDeleteModal",
    value: function renderDeleteModal() {
      var _this3 = this;

      if (!this.state.deleting) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIConfirmModal, {
        message: I18n.text('sui.broadcasts.delete.confirmMessage', {
          count: this.props.selected.size
        }),
        description: I18n.text('sui.broadcasts.delete.confirmBlurb', {
          count: this.props.selected.size
        }),
        confirmUse: "danger",
        confirmLabel: I18n.text('sui.broadcasts.delete.buttonText'),
        rejectLabel: I18n.text('sui.confirm.rejectLabel'),
        onConfirm: this.onDelete,
        onReject: function onReject() {
          _this3.setState({
            deleting: false
          });
        }
      });
    }
  }, {
    key: "renderDraftModal",
    value: function renderDraftModal() {
      var _this4 = this;

      if (!this.state.makingDraft) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIConfirmModal, {
        message: I18n.text('sui.broadcasts.makeDraft.confirmMessage'),
        description: I18n.text('sui.broadcasts.makeDraft.confirmBlurb', {
          count: this.props.selected.size
        }),
        confirmUse: "primary",
        confirmLabel: I18n.text('sui.broadcasts.makeDraft.buttonText', {
          count: this.props.selected.size
        }),
        rejectLabel: I18n.text('sui.confirm.rejectLabel'),
        onConfirm: this.onMakeDraft,
        onReject: function onReject() {
          _this4.setState({
            makingDraft: false
          });
        }
      });
    }
  }, {
    key: "renderApproveSelector",
    value: function renderApproveSelector() {
      var _this$props3 = this.props,
          bulkApprovalEnabled = _this$props3.bulkApprovalEnabled,
          userIsPublisher = _this$props3.userIsPublisher,
          broadcastStatusType = _this$props3.broadcastStatusType,
          onInitApprove = _this$props3.onInitApprove;

      if (!bulkApprovalEnabled || !userIsPublisher || broadcastStatusType !== BROADCAST_STATUS_TYPE.draft) {
        return null;
      }

      var tooltipText = I18n.text('sui.broadcasts.header.bulkValidations.bulkApprove');

      var buttonEl = /*#__PURE__*/_jsxs(UILink, {
        className: "approve m-left-3",
        onClick: onInitApprove,
        disabled: !this.userHasPermissionToEdit(),
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: "approveDraft"
        }), I18n.text('sui.broadcasts.header.actions.approve')]
      });

      if (this.userHasPermissionToEdit()) {
        return buttonEl;
      }

      return /*#__PURE__*/_jsx(UITooltip, {
        title: tooltipText,
        children: buttonEl
      });
    }
  }, {
    key: "renderCampaignsSelector",
    value: function renderCampaignsSelector() {
      if (!this.props.hasCampaignsReadAccess || !this.props.userIsPublisher && this.props.broadcastStatusType !== BROADCAST_STATUS_TYPE.draft) {
        return null;
      }

      var tooltipText = I18n.text('sui.broadcasts.header.bulkValidations.editCampaign');

      var buttonEl = /*#__PURE__*/_jsxs(UILink, {
        disabled: !this.userHasPermissionToEdit(),
        onClick: this.onCampaignsSelectorClick,
        className: "m-left-3",
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: "edit"
        }), I18n.text('sui.broadcasts.header.actions.campaign')]
      });

      if (this.userHasPermissionToEdit()) {
        return buttonEl;
      }

      return /*#__PURE__*/_jsx(UITooltip, {
        title: tooltipText,
        children: buttonEl
      });
    }
  }, {
    key: "renderCloneSelector",
    value: function renderCloneSelector() {
      var tooltipText = I18n.text('sui.broadcasts.header.bulkValidations.clone');

      var buttonEl = /*#__PURE__*/_jsxs(UILink, {
        onClick: this.props.onClone,
        disabled: !this.canClone(),
        className: "m-left-3",
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: "duplicate"
        }), I18n.text('sui.broadcasts.header.actions.clone')]
      });

      if (!this.canClone()) {
        return /*#__PURE__*/_jsx(UITooltip, {
          title: tooltipText,
          children: buttonEl
        });
      }

      return this.props.broadcastStatusType !== BROADCAST_STATUS_TYPE.uploaded && buttonEl;
    }
  }, {
    key: "renderDeleteAction",
    value: function renderDeleteAction() {
      var _this5 = this;

      if (!this.props.userIsPublisher && this.props.broadcastStatusType !== BROADCAST_STATUS_TYPE.draft || this.props.broadcastStatusType === BROADCAST_STATUS_TYPE.published) {
        return null;
      }

      var buttonEl = /*#__PURE__*/_jsxs(UILink, {
        disabled: !this.userHasPermissionToEdit(),
        className: "delete m-left-3",
        onClick: function onClick() {
          _this5.setState({
            deleting: true
          });
        },
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: "delete"
        }), I18n.text('sui.broadcasts.header.actions.delete')]
      });

      if (!this.userHasPermissionToEdit()) {
        return /*#__PURE__*/_jsx(UITooltip, {
          title: I18n.text('sui.broadcasts.header.bulkValidations.delete'),
          children: buttonEl
        });
      } else {
        return buttonEl;
      }
    }
  }, {
    key: "renderMakeDraftSelector",
    value: function renderMakeDraftSelector() {
      var _this6 = this;

      if (this.props.broadcastStatusType === BROADCAST_STATUS_TYPE.scheduled && this.userHasPermissionToEdit()) {
        return /*#__PURE__*/_jsxs(UILink, {
          disabled: !this.userHasPermissionToEdit(),
          onClick: function onClick() {
            _this6.setState({
              makingDraft: true
            });
          },
          className: "m-left-3",
          children: [/*#__PURE__*/_jsx(UIIcon, {
            name: "makeDraft"
          }), I18n.text('sui.broadcasts.header.actions.makeDraft')]
        });
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsxs("span", {
        children: [/*#__PURE__*/_jsx("small", {
          className: "selected",
          children: I18n.text('sui.publishing.table.header.selected', {
            count: this.props.selected.size
          })
        }), this.renderApproveSelector(), this.renderMakeDraftSelector(), this.renderCampaignsSelector(), this.renderCloneSelector(), this.renderDeleteAction(), this.renderCampaignModal(), this.renderDeleteModal(), this.renderDraftModal()]
      });
    }
  }]);

  return HeaderActions;
}(Component);

HeaderActions.propTypes = {
  broadcasts: orderedMapProp,
  broadcastStatusType: broadcastStatusTypeProp.isRequired,
  selected: listProp,
  patchBroadcasts: PropTypes.func,
  deleteBroadcasts: PropTypes.func,
  onClone: PropTypes.func,
  makeDrafts: PropTypes.func,
  clearSelection: PropTypes.func,
  hasCampaignsReadAccess: PropTypes.bool.isRequired,
  hasCampaignsWriteAccess: PropTypes.bool.isRequired,
  userIsPublisher: PropTypes.bool.isRequired,
  bulkApprovalEnabled: PropTypes.bool.isRequired,
  onInitApprove: PropTypes.func,
  canEdit: PropTypes.bool,
  channelTypesForClone: setProp
};
HeaderActions.defaultProps = {
  channelsForComposerPicker: OrderedMap()
};
HeaderActions.contextType = SocialContext;
export { HeaderActions as default };