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
import { List } from 'immutable';
import { NavMarker } from 'react-rhumb';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UITable from 'UIComponents/table/UITable';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
import UIPaginator from 'UIComponents/paginator/UIPaginator';
import UISortTH from 'UIComponents/table/UISortTH';
import UISection from 'UIComponents/section/UISection';
import UILoadingOverlay from 'UIComponents/loading/UILoadingOverlay';
import UIIcon from 'UIComponents/icon/UIIcon';
import { broadcastStatusTypeProp, dataFilterProp, logicalChannelsProp, mapProp, orderedMapProp, setProp, usersProp } from '../../lib/propTypes';
import { passPropsFor, sortDirectionFromSocial, sortDirectionToSocial } from '../../lib/utils';
import { BROADCAST_STATUS_TYPE, BROADCAST_STATUS_TYPE_TO_DATE_ATTRIBUTE, UPLOADED_BROADCAST_ISSUE_FILTER, ACCOUNT_TYPES, DETAILS_SUPPORTED_STATUS_TYPES, EDIT_SUPPORTED_STATUS_TYPES } from '../../lib/constants';
import SocialContext from '../app/SocialContext';
import BroadcastRow from './BroadcastRow';
import HeaderActions from './HeaderActions';

var BroadcastTable = /*#__PURE__*/function (_Component) {
  _inherits(BroadcastTable, _Component);

  function BroadcastTable() {
    var _this;

    _classCallCheck(this, BroadcastTable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BroadcastTable).call(this));

    _this.clearSelection = function () {
      _this.setState({
        selected: _this.state.selected.clear()
      });
    };

    _this.handleConfirmDeleteBroadcast = function (broadcast) {
      _this.setState({
        deleting: true,
        broadcast: broadcast
      });
    };

    _this.handleDeleteBroadcast = function () {
      _this.props.onDeleteBroadcast(_this.state.broadcast);

      _this.setState({
        deleting: false,
        broadcast: null
      });
    };

    _this.onClickRow = function (broadcast) {
      if (EDIT_SUPPORTED_STATUS_TYPES.includes(broadcast.getStatusType()) && broadcast.userCanModify && broadcast.canEditStatus(_this.props.userIsPublisher)) {
        _this.props.openBroadcast(broadcast.broadcastGuid);
      }
    };

    _this.onCheckRow = function (broadcast, checked) {
      if (checked) {
        _this.setState({
          selected: _this.state.selected.push(broadcast.broadcastGuid)
        });
      } else {
        _this.setState({
          selected: _this.state.selected.filter(function (b) {
            return b !== broadcast.broadcastGuid;
          })
        });
      }

      _this.context.trackInteraction('select row');
    };

    _this.onSelectAll = function () {
      if (_this.state.selected.isEmpty()) {
        _this.setState({
          selected: _this.props.broadcasts.map(function (b) {
            return b.broadcastGuid;
          }).toList()
        });
      } else {
        _this.setState({
          selected: _this.state.selected.clear()
        });
      }

      _this.context.trackInteraction('select all');
    };

    _this.onPageChange = function (e) {
      _this.props.updateDataFilter({
        page: e.target.value
      });

      _this.setState({
        selected: _this.state.selected.clear()
      });

      _this.context.trackInteraction('change page');
    };

    _this.onFinishedAtSort = function (e) {
      _this.props.updateDataFilter({
        sortBy: 'finishedAt',
        sortOrder: sortDirectionToSocial(e.target.value)
      });

      _this.context.trackInteraction('sort finishedAt');
    };

    _this.onTriggerAtSort = function (e) {
      _this.props.updateDataFilter({
        sortBy: 'triggerAt',
        sortOrder: sortDirectionToSocial(e.target.value)
      });

      _this.context.trackInteraction('sort triggerat');
    };

    _this.onUserUpdatedAtSort = function (e) {
      _this.props.updateDataFilter({
        sortBy: 'userUpdatedAt',
        sortOrder: sortDirectionToSocial(e.target.value)
      });

      _this.context.trackInteraction('sort userUpdatedAt');
    };

    _this.onInteractionsSort = function (e) {
      _this.props.updateDataFilter({
        sortBy: 'interactions',
        sortOrder: sortDirectionToSocial(e.target.value)
      });

      _this.context.trackInteraction('sort interactions');
    };

    _this.onClicksSort = function (e) {
      _this.props.updateDataFilter({
        sortBy: 'clicks',
        sortOrder: sortDirectionToSocial(e.target.value)
      });

      _this.context.trackInteraction('sort clicks');
    };

    _this.onCloneBroadcasts = function () {
      var broadcasts = _this.state.selected.map(function (guid) {
        return _this.props.broadcasts.find(function (b) {
          return b.broadcastGuid === guid;
        });
      }).filter(function (b) {
        return b;
      });

      _this.props.cloneBroadcasts(broadcasts);
    };

    _this.onInitApproveBroadcasts = function () {
      _this.context.trackInteraction('init approve');

      _this.props.initApproveBroadcasts(_this.state.selected);
    };

    _this.renderBroadcast = function (broadcast) {
      var createdBy = _this.props.users && _this.props.users.get(broadcast.createdBy);

      var updatedBy = _this.props.users && _this.props.users.get(broadcast.updatedBy || broadcast.createdBy);

      var detailsUrl = "" + _this.publishingDetails(broadcast.broadcastGuid, broadcast.getStatusType()) + _this.props.location.search;

      return /*#__PURE__*/_jsx(BroadcastRow, {
        broadcast: broadcast,
        channel: _this.props.channels.find(function (c) {
          return c.channelKey === broadcast.channelKey;
        }) || broadcast.channel,
        createdBy: createdBy,
        updatedBy: updatedBy,
        isChecked: _this.state.selected.includes(broadcast.broadcastGuid),
        href: _this.getLink(broadcast, detailsUrl),
        onCheck: _this.onCheckRow,
        showDate: true,
        showCheckbox: true,
        onDeleteBroadcast: _this.handleConfirmDeleteBroadcast,
        hasBoostedPost: _this.props.boostedPosts && _this.props.boostedPosts.has(broadcast.foreignId),
        adCreationEnabled: _this.props.adCreationEnabled,
        onCloneBroadcast: _this.props.onCloneBroadcast,
        onMakeDraft: _this.props.onMakeDraft,
        onClickRow: _this.onClickRow
      }, broadcast.broadcastGuid);
    };

    _this.state = {
      canceling: false,
      deleting: false,
      selected: List()
    };
    return _this;
  }

  _createClass(BroadcastTable, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      // If we have selected broadcasts, old broadcasts, and new broadcasts,
      // always ensure the selected guids match to a broadcasts in the new broadcasts.
      if (this.state.selected && this.props.broadcasts && nextProps.broadcasts) {
        this.setState({
          selected: this.state.selected.filter(function (selectedBroadcast) {
            return nextProps.broadcasts.has(selectedBroadcast);
          })
        });
      }

      if (nextProps.broadcastStatusType !== this.props.broadcastStatusType) {
        this.clearSelection();
      }
    }
  }, {
    key: "getDateAttribute",
    value: function getDateAttribute() {
      return BROADCAST_STATUS_TYPE_TO_DATE_ATTRIBUTE[this.props.broadcastStatusType];
    }
  }, {
    key: "getColumnCount",
    value: function getColumnCount() {
      if (this.props.broadcastStatusType === BROADCAST_STATUS_TYPE.published) {
        return 6;
      } else if (this.props.broadcastStatusType === BROADCAST_STATUS_TYPE.draft) {
        return 5;
      }

      return 4;
    }
  }, {
    key: "hasBroadcasts",
    value: function hasBroadcasts() {
      return this.props.broadcasts && !this.props.broadcasts.isEmpty();
    }
  }, {
    key: "getLink",
    value: function getLink(broadcast, detailsUrl) {
      if (!broadcast.userCanModify || !broadcast.canEditStatus(this.props.userIsPublisher)) {
        return detailsUrl;
      }

      return DETAILS_SUPPORTED_STATUS_TYPES.includes(broadcast.getStatusType()) ? detailsUrl : null;
    }
  }, {
    key: "getSelected",
    value: function getSelected() {
      var _this2 = this;

      return this.state.selected.filter(function (id) {
        return _this2.props.broadcasts.get(id);
      });
    }
  }, {
    key: "publishingDetails",
    value: function publishingDetails(id) {
      var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'published';
      return "/publishing/" + status + "/view/" + id;
    }
  }, {
    key: "renderColGroupForPublished",
    value: function renderColGroupForPublished() {
      return /*#__PURE__*/_jsxs("colgroup", {
        children: [/*#__PURE__*/_jsx("col", {
          style: {
            width: 40
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: 350
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: 200
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: 50
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: 50
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: 50
          }
        })]
      });
    }
  }, {
    key: "renderColGroupForDraft",
    value: function renderColGroupForDraft() {
      return /*#__PURE__*/_jsxs("colgroup", {
        children: [/*#__PURE__*/_jsx("col", {
          style: {
            width: 40
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: 350
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: 200
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: 50
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: 50
          }
        })]
      });
    }
  }, {
    key: "renderColGroupDefault",
    value: function renderColGroupDefault() {
      return /*#__PURE__*/_jsxs("colgroup", {
        children: [/*#__PURE__*/_jsx("col", {
          style: {
            width: 40
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: 350
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: 200
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: 50
          }
        })]
      });
    }
  }, {
    key: "renderColgroup",
    value: function renderColgroup() {
      if (this.props.broadcastStatusType === BROADCAST_STATUS_TYPE.published) {
        return this.renderColGroupForPublished();
      } else if (this.props.broadcastStatusType === BROADCAST_STATUS_TYPE.draft) {
        return this.renderColGroupForDraft();
      }

      return this.renderColGroupDefault();
    }
  }, {
    key: "renderHeaderCheckbox",
    value: function renderHeaderCheckbox() {
      if (this.props.broadcasts.isEmpty()) {
        return /*#__PURE__*/_jsx("th", {
          className: "checkbox"
        }, "checkbox");
      }

      var allChecked = !this.props.broadcasts.isEmpty() && this.props.broadcasts.size === this.state.selected.size;
      return /*#__PURE__*/_jsx("th", {
        className: "checkbox",
        children: /*#__PURE__*/_jsx(UICheckbox, {
          checked: allChecked,
          indeterminate: !this.state.selected.isEmpty() && !allChecked,
          "aria-label": I18n.text('sui.broadcasts.header.actions.selectAll'),
          onChange: this.onSelectAll
        })
      }, "checkbox");
    }
  }, {
    key: "renderHeaderActions",
    value: function renderHeaderActions() {
      return /*#__PURE__*/_jsx("th", {
        className: "header-actions is--text--help",
        colSpan: "2",
        children: /*#__PURE__*/_jsx(HeaderActions, Object.assign({}, passPropsFor(this.props, HeaderActions), {
          broadcastStatusType: this.props.dataFilter.broadcastStatusType,
          selected: this.getSelected(),
          clearSelection: this.clearSelection,
          onClone: this.onCloneBroadcasts,
          onInitApprove: this.onInitApproveBroadcasts
        }))
      }, "header-actions");
    }
  }, {
    key: "renderLeftHeader",
    value: function renderLeftHeader() {
      if (this.state.selected.isEmpty()) {
        return [this.renderHeaderCheckbox(), /*#__PURE__*/_jsx("th", {
          className: "broadcast-summary",
          colSpan: "2",
          children: I18n.text('sui.broadcasts.header.message')
        }, "broadcast-summary")];
      }

      return [this.renderHeaderCheckbox(), this.renderHeaderActions()];
    }
  }, {
    key: "renderDateHeader",
    value: function renderDateHeader() {
      var dataFilter = this.props.dataFilter;

      var scheduledForHeader = /*#__PURE__*/_jsx(UISortTH, {
        className: "scheduledFor",
        sort: dataFilter.sortBy === 'triggerAt' ? sortDirectionFromSocial(dataFilter.sortOrder) : 'none',
        onSortChange: this.onTriggerAtSort,
        children: I18n.text('sui.broadcasts.header.scheduledFor')
      }, "scheduledFor");

      if (this.props.broadcastStatusType === BROADCAST_STATUS_TYPE.draft) {
        return [/*#__PURE__*/_jsx(UISortTH, {
          className: "updatedAt",
          sort: dataFilter.sortBy === 'userUpdatedAt' ? sortDirectionFromSocial(dataFilter.sortOrder) : 'none',
          onSortChange: this.onUserUpdatedAtSort,
          children: I18n.text('sui.broadcasts.header.updatedAt')
        }, "updatedAt"), scheduledForHeader];
      }

      if (this.props.broadcastStatusType === BROADCAST_STATUS_TYPE.uploaded) {
        return scheduledForHeader;
      }

      return /*#__PURE__*/_jsx(UISortTH, {
        className: "datetime",
        sort: dataFilter.sortBy === this.getDateAttribute() ? sortDirectionFromSocial(dataFilter.sortOrder) : 'none',
        onSortChange: this.getDateAttribute() === 'finishedAt' ? this.onFinishedAtSort : this.onTriggerAtSort,
        children: this.props.broadcastStatusType === BROADCAST_STATUS_TYPE.scheduled ? I18n.text('sui.broadcasts.header.scheduledFor') : I18n.text('sui.broadcasts.header.triggerAt')
      });
    }
  }, {
    key: "renderDeleteModal",
    value: function renderDeleteModal() {
      var _this3 = this;

      if (!this.state.deleting && !this.state.canceling) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIConfirmModal, {
        message: I18n.text('sui.broadcastDetails.delete.confirmMessage'),
        description: I18n.text('sui.broadcastDetails.delete.confirmBlurb'),
        confirmUse: "danger",
        confirmLabel: I18n.text('sui.broadcastDetails.delete.buttonText'),
        rejectLabel: I18n.text('sui.confirm.rejectLabel'),
        onConfirm: this.handleDeleteBroadcast,
        onReject: function onReject() {
          _this3.setState({
            canceling: false,
            deleting: false
          });
        }
      });
    }
  }, {
    key: "renderTableBody",
    value: function renderTableBody() {
      if (this.props.broadcasts.isEmpty()) {
        var noDataType;

        if (this.props.dataFilter.isFilteringEngaged()) {
          noDataType = 'filtered';
        } else if (this.props.broadcastStatusType === BROADCAST_STATUS_TYPE.uploaded && this.props.dataFilter.uploadedIssueFilterState !== UPLOADED_BROADCAST_ISSUE_FILTER.ALL_POSTS) {
          noDataType = 'uploadedIssue';
        } else {
          noDataType = this.props.broadcastStatusType;
        }

        return /*#__PURE__*/_jsx("tbody", {
          children: /*#__PURE__*/_jsx("tr", {
            children: /*#__PURE__*/_jsxs("td", {
              colSpan: this.getColumnCount(),
              className: "no-data text-center status-type-" + noDataType,
              children: [/*#__PURE__*/_jsx("h5", {
                children: I18n.text("sui.broadcasts.noData." + noDataType + ".title")
              }), /*#__PURE__*/_jsx("p", {
                className: "blurb",
                children: I18n.text("sui.broadcasts.noData." + noDataType + ".blurb")
              })]
            })
          })
        });
      }

      return /*#__PURE__*/_jsx("tbody", {
        children: this.props.broadcasts.toArray().map(this.renderBroadcast)
      });
    }
  }, {
    key: "renderTable",
    value: function renderTable() {
      var _this$props = this.props,
          broadcastStatusType = _this$props.broadcastStatusType,
          dataFilter = _this$props.dataFilter;
      return /*#__PURE__*/_jsx(UICardWrapper, {
        children: /*#__PURE__*/_jsxs(UITable, {
          responsive: false,
          condensed: true,
          children: [this.renderColgroup(), /*#__PURE__*/_jsx("thead", {
            children: /*#__PURE__*/_jsxs("tr", {
              children: [this.renderLeftHeader(), this.renderDateHeader(), broadcastStatusType === BROADCAST_STATUS_TYPE.published && [/*#__PURE__*/_jsx(UISortTH, {
                sort: dataFilter.sortBy === 'clicks' ? sortDirectionFromSocial(dataFilter.sortOrder) : 'none',
                className: "clicks",
                align: "right",
                onSortChange: this.onClicksSort,
                children: I18n.text('sui.broadcasts.header.clicks')
              }, "clicks"), /*#__PURE__*/_jsx(UISortTH, {
                sort: dataFilter.sortBy === 'interactions' ? sortDirectionFromSocial(dataFilter.sortOrder) : 'none',
                className: "interactions",
                align: "right",
                onSortChange: this.onInteractionsSort,
                children: I18n.text('sui.broadcasts.header.interactions')
              }, "interactions")]]
            })
          }), this.renderTableBody()]
        })
      });
    }
  }, {
    key: "renderTwitterTOS",
    value: function renderTwitterTOS() {
      var channels = this.props.channels;

      if (!channels || channels.filter(function (c) {
        return c.accountSlug === ACCOUNT_TYPES.twitter;
      }).isEmpty()) {
        return null;
      }

      return /*#__PURE__*/_jsx("p", {
        className: "twitter-terms-link",
        children: /*#__PURE__*/_jsxs("a", {
          href: "https://twitter.com/en/tos",
          children: [I18n.text('sui.publishing.twitterTerms'), /*#__PURE__*/_jsx(UIIcon, {
            className: "m-left-1",
            name: "externalLink"
          })]
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(NavMarker, {
        name: "BROADCAST_TABLE_LOADED",
        active: this.props.broadcasts && !this.props.isLoading,
        children: /*#__PURE__*/_jsxs(UISection, {
          className: "broadcasts-table actions-enabled" + (!this.props.isLoading ? " loaded" : ""),
          children: [this.props.broadcasts && this.renderTable(), this.renderTwitterTOS(), this.hasBroadcasts() && /*#__PURE__*/_jsx(UIPaginator, {
            onPageChange: this.onPageChange,
            page: this.props.dataFilter.page,
            pageCount: this.props.broadcastsTotal ? Math.ceil(this.props.broadcastsTotal / this.props.dataFilter.pageSize) : 1,
            showFirstLastButtons: true
          }), this.props.isLoading && /*#__PURE__*/_jsx(UILoadingOverlay, {
            contextual: true
          }), this.renderDeleteModal()]
        })
      });
    }
  }]);

  return BroadcastTable;
}(Component);

BroadcastTable.propTypes = {
  broadcasts: orderedMapProp,
  broadcastStatusType: broadcastStatusTypeProp,
  channels: logicalChannelsProp,
  channelTypesForClone: setProp,
  users: usersProp,
  dataFilter: dataFilterProp,
  isLoading: PropTypes.bool,
  push: PropTypes.func,
  updateDataFilter: PropTypes.func,
  patchBroadcasts: PropTypes.func,
  deleteBroadcasts: PropTypes.func,
  cloneBroadcasts: PropTypes.func,
  makeDrafts: PropTypes.func,
  openBroadcast: PropTypes.func,
  hasCampaignsReadAccess: PropTypes.bool.isRequired,
  hasCampaignsWriteAccess: PropTypes.bool.isRequired,
  uploadedErrors: mapProp,
  broadcastsTotal: PropTypes.number,
  userIsPublisher: PropTypes.bool.isRequired,
  bulkApprovalEnabled: PropTypes.bool.isRequired,
  initApproveBroadcasts: PropTypes.func,
  location: PropTypes.object,
  adCreationEnabled: PropTypes.bool.isRequired,
  onCloneBroadcast: PropTypes.func.isRequired,
  onDeleteBroadcast: PropTypes.func.isRequired,
  onMakeDraft: PropTypes.func.isRequired,
  boostedPosts: mapProp
};
BroadcastTable.contextType = SocialContext;
export { BroadcastTable as default };