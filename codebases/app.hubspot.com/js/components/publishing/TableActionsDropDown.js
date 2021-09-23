'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useState, useEffect, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import I18n from 'I18n';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';
import UIDropdownDivider from 'UIComponents/dropdown/UIDropdownDivider';
import { BROADCAST_ACTION_TYPES, ACTIONS_TO_LABEL, ACTIONS_BY_NETWORK } from '../../lib/constants';
import { uppercaseFirstLetter } from '../../lib/utils';
import { getSingleBroadcastCoreWithActions } from '../../redux/selectors/broadcasts';
import { initBroadcastBoosting } from '../../redux/actions/boosting';
import SocialContext from '../app/SocialContext';
import ViewDetailsBroadcastButton from './ViewDetailsBroadcastButton';
import EditBroadcastButton from './EditBroadcastButton';
import CloneBroadcastButton from './CloneBroadcastButton';
var ACTIONS_MIN_WIDTH = 1350;

function TableActionsDropDown(_ref) {
  var broadcastGuid = _ref.broadcastGuid,
      network = _ref.network,
      onCloneBroadcast = _ref.onCloneBroadcast,
      onDeleteBroadcast = _ref.onDeleteBroadcast,
      onMakeDraft = _ref.onMakeDraft,
      onActionsDropDownOpenChange = _ref.onActionsDropDownOpenChange,
      onViewDetails = _ref.onViewDetails,
      isOpen = _ref.isOpen,
      href = _ref.href,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? {
    width: null,
    height: null
  } : _ref$size;

  var _useState = useState(size && size.width < ACTIONS_MIN_WIDTH),
      _useState2 = _slicedToArray(_useState, 2),
      compressedActionMenu = _useState2[0],
      setCompressedActionMenu = _useState2[1];

  useEffect(function () {
    setCompressedActionMenu(size.width < ACTIONS_MIN_WIDTH);
  }, [size]);

  var _useContext = useContext(SocialContext),
      trackInteraction = _useContext.trackInteraction;

  var dispatch = useDispatch();
  var broadcast = useSelector(function (state) {
    return getSingleBroadcastCoreWithActions(state, broadcastGuid);
  });
  var handleActionClick = useCallback(function (action, ev) {
    // this actions will be triggered only from the dropdown
    switch (action) {
      case BROADCAST_ACTION_TYPES.CLONE:
        onCloneBroadcast(broadcast);
        ev.stopPropagation();
        break;

      case BROADCAST_ACTION_TYPES.BOOST:
        dispatch(initBroadcastBoosting(broadcast.broadcastGuid));
        ev.stopPropagation();
        break;

      case BROADCAST_ACTION_TYPES.MAKE_DRAFT:
        onMakeDraft(broadcast);
        ev.stopPropagation();
        break;

      case BROADCAST_ACTION_TYPES.VIEW_ON_NETWORK:
        trackInteraction('view broadcast on network');
        window.open(broadcast.getMessageUrl(), '_blank');
        ev.stopPropagation();
        break;

      case BROADCAST_ACTION_TYPES.DELETE:
        onDeleteBroadcast(broadcast);
        ev.stopPropagation();
        break;

      default:
        break;
    }
  }, [dispatch, onDeleteBroadcast, broadcast, trackInteraction, onMakeDraft, onCloneBroadcast]);
  var actionsByNetwork = ACTIONS_BY_NETWORK[network];

  if (compressedActionMenu) {
    actionsByNetwork = [BROADCAST_ACTION_TYPES.VIEW_DETAILS, BROADCAST_ACTION_TYPES.EDIT, BROADCAST_ACTION_TYPES.CLONE].concat(_toConsumableArray(ACTIONS_BY_NETWORK[network]));
  }

  var dropdownElements = actionsByNetwork.reduce(function (aggregate, action, actionKey) {
    var listElements = [];

    if (broadcast.actions.get(action)) {
      if (aggregate.length > 0 && action === BROADCAST_ACTION_TYPES.DELETE && !broadcast.isDraft() && !broadcast.isFailed()) {
        // For drafts and failed posts we only show 1 option (Delete), so we don't want to show the separator.
        listElements.push( /*#__PURE__*/_jsx(UIDropdownDivider, {}, "drop-down-divider--" + actionKey));
      }

      listElements.push( /*#__PURE__*/_jsx(UIButton, {
        use: "tertiary-light",
        size: "sm",
        onClick: function onClick(ev) {
          return handleActionClick(action, ev);
        },
        "data-test-id": "broadcast-action-" + action,
        children: I18n.text(ACTIONS_TO_LABEL[action], {
          network: uppercaseFirstLetter(network)
        })
      }, actionKey));
    }

    aggregate.push.apply(aggregate, listElements);
    return aggregate;
  }, []);
  return /*#__PURE__*/_jsxs("div", {
    className: "variable-column actions-wrapper",
    children: [!compressedActionMenu && /*#__PURE__*/_jsx(ViewDetailsBroadcastButton, {
      onViewDetails: onViewDetails,
      actions: broadcast.actions,
      href: href
    }), !compressedActionMenu && /*#__PURE__*/_jsx(EditBroadcastButton, {
      broadcast: broadcast,
      actions: broadcast.actions
    }), !compressedActionMenu && /*#__PURE__*/_jsx(CloneBroadcastButton, {
      actions: broadcast.actions,
      onClone: onCloneBroadcast
    }), dropdownElements.length > 0 && /*#__PURE__*/_jsx(UIDropdown, {
      buttonSize: "small",
      buttonUse: "tertiary-light",
      buttonText: I18n.text('sui.broadcastDetails.actions.placeholder'),
      onOpenChange: onActionsDropDownOpenChange,
      open: isOpen,
      closeOnMenuClick: true,
      defaultOpen: false,
      "data-test-id": "table-action-dropdown",
      children: /*#__PURE__*/_jsx(UIList, {
        children: dropdownElements
      })
    })]
  });
}

TableActionsDropDown.propTypes = {
  broadcastGuid: PropTypes.string.isRequired,
  href: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  network: PropTypes.string.isRequired,
  onActionsDropDownOpenChange: PropTypes.func.isRequired,
  onCloneBroadcast: PropTypes.func.isRequired,
  onDeleteBroadcast: PropTypes.func.isRequired,
  onMakeDraft: PropTypes.func.isRequired,
  onViewDetails: PropTypes.any,
  size: PropTypes.object.isRequired
};
export default TableActionsDropDown;