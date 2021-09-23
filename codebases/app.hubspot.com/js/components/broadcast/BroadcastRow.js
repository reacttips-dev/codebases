'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useState, useCallback, useContext } from 'react';
import I18n from 'I18n';
import { Link } from 'react-router';
import UICheckbox from 'UIComponents/input/UICheckbox';
import SocialContext from '../app/SocialContext';
import { closestElement } from '../../lib/utils';
import { abstractChannelProp, broadcastProp, userProp } from '../../lib/propTypes';
import { BROADCAST_STATUS } from '../../lib/constants';
import { useWindowSize } from '../../lib/hooks';
import BroadcastSummary from './BroadcastSummary';
import BroadcastRowTime from '../app/BroadcastRowTime';
import TableActionsDropDown from '../publishing/TableActionsDropDown';
import BroadcastMedia from './BroadcastMedia';
import BroadcastScheduledFor from './BroadcastScheduledFor';
import BroadcastInteractions from './BroadcastInteractions';

var BroadcastRow = function BroadcastRow(_ref) {
  var _ref$hasBoostedPost = _ref.hasBoostedPost,
      hasBoostedPost = _ref$hasBoostedPost === void 0 ? false : _ref$hasBoostedPost,
      _ref$showDate = _ref.showDate,
      showDate = _ref$showDate === void 0 ? false : _ref$showDate,
      _ref$showCheckbox = _ref.showCheckbox,
      showCheckbox = _ref$showCheckbox === void 0 ? false : _ref$showCheckbox,
      broadcast = _ref.broadcast,
      onCheck = _ref.onCheck,
      isChecked = _ref.isChecked,
      createdBy = _ref.createdBy,
      updatedBy = _ref.updatedBy,
      channel = _ref.channel,
      onClickRow = _ref.onClickRow,
      onCloneBroadcast = _ref.onCloneBroadcast,
      onDeleteBroadcast = _ref.onDeleteBroadcast,
      onMakeDraft = _ref.onMakeDraft,
      href = _ref.href;
  var size = useWindowSize();

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      rowHovered = _useState2[0],
      setRowHovered = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      dropDownOpen = _useState4[0],
      setDropDownOpen = _useState4[1];

  var _useContext = useContext(SocialContext),
      trackInteraction = _useContext.trackInteraction;

  var onChange = useCallback(function () {
    return onCheck(broadcast, !isChecked);
  }, [onCheck, broadcast, isChecked]);
  var handleCloneBroadcast = useCallback(function () {
    onCloneBroadcast(broadcast);
  }, [onCloneBroadcast, broadcast]);
  var handleDeleteBroadcast = useCallback(function () {
    onDeleteBroadcast(broadcast);
  }, [onDeleteBroadcast, broadcast]);
  var handleMakeDraft = useCallback(function () {
    onMakeDraft(broadcast);
  }, [onMakeDraft, broadcast]);
  var onClick = useCallback(function (event) {
    if (window.getSelection().toString()) {
      event.preventDefault();
      return;
    }

    if (closestElement(event.target, 'td.checkbox')) {
      event.preventDefault();
      onChange();
      return;
    }

    if (closestElement(event.target, '.actions-wrapper')) {
      event.preventDefault();
      return;
    }

    trackInteraction('click broadcast');

    if (broadcast.status === BROADCAST_STATUS.UPLOADED) {
      if (!broadcast.errors.isEmpty()) {
        trackInteraction('editing uploaded post with issues');
      }
    }

    onClickRow(broadcast);
  }, [onChange, onClickRow, broadcast, trackInteraction]);
  var handleViewDetails = useCallback(function () {
    onClickRow(broadcast);
  }, [onClickRow, broadcast]);
  return /*#__PURE__*/_jsxs(Link, {
    to: href,
    onClick: onClick,
    "data-broadcast-guid": broadcast.broadcastGuid,
    onMouseOver: function onMouseOver() {
      setRowHovered(true);
    },
    onMouseLeave: function onMouseLeave() {
      setRowHovered(false);
      setDropDownOpen(false);
    },
    className: "broadcast-row actions-enabled",
    children: [showCheckbox && /*#__PURE__*/_jsx("td", {
      className: "checkbox",
      children: /*#__PURE__*/_jsx(UICheckbox, {
        checked: isChecked,
        onChange: onChange,
        "aria-label": I18n.text('sui.broadcasts.row.select')
      })
    }), /*#__PURE__*/_jsx("td", {
      className: "broadcast-summary",
      children: /*#__PURE__*/_jsx(BroadcastSummary, {
        broadcast: broadcast,
        createdBy: createdBy,
        updatedBy: updatedBy,
        channel: channel,
        hasBoostedPost: hasBoostedPost
      })
    }), /*#__PURE__*/_jsxs("td", {
      className: "media-actions-menu",
      children: [!rowHovered && /*#__PURE__*/_jsx(BroadcastMedia, {
        broadcast: broadcast,
        imageSize: "thumb"
      }), rowHovered && /*#__PURE__*/_jsx(TableActionsDropDown, {
        onViewDetails: handleViewDetails,
        broadcastGuid: broadcast.broadcastGuid,
        network: channel.accountSlug,
        onCloneBroadcast: handleCloneBroadcast,
        onDeleteBroadcast: handleDeleteBroadcast,
        onMakeDraft: handleMakeDraft,
        onActionsDropDownOpenChange: function onActionsDropDownOpenChange(e) {
          return setDropDownOpen(e.currentTarget.value);
        },
        isOpen: dropDownOpen,
        href: href,
        size: size
      })]
    }), broadcast.isDraft() && /*#__PURE__*/_jsx("td", {
      "data-test": "updated-at",
      className: "at",
      children: /*#__PURE__*/_jsx(BroadcastRowTime, {
        date: broadcast.userUpdatedAt
      })
    }), /*#__PURE__*/_jsx(BroadcastScheduledFor, {
      broadcast: broadcast,
      showDate: showDate
    }), broadcast.isPublished() && /*#__PURE__*/_jsx("td", {
      "data-test": "broadcast-clicks",
      className: "text-right",
      children: broadcast.supportsClicks() ? I18n.formatNumber(broadcast.clicks) : I18n.text('sui.broadcasts.na')
    }), broadcast.isPublished() && /*#__PURE__*/_jsx(BroadcastInteractions, {
      broadcast: broadcast
    })]
  });
};

BroadcastRow.propTypes = {
  broadcast: broadcastProp,
  channel: abstractChannelProp,
  createdBy: userProp,
  updatedBy: userProp,
  onCheck: PropTypes.func,
  showDate: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  isChecked: PropTypes.bool,
  onClickRow: PropTypes.func,
  onCloneBroadcast: PropTypes.func.isRequired,
  onDeleteBroadcast: PropTypes.func.isRequired,
  onMakeDraft: PropTypes.func,
  hasBoostedPost: PropTypes.bool.isRequired,
  href: PropTypes.string
};
export default BroadcastRow;