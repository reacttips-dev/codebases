'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useState, useCallback, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reportingPostProp } from '../lib/propTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdownDivider from 'UIComponents/dropdown/UIDropdownDivider';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UITooltipContent from 'UIComponents/tooltip/UITooltipContent';
import SocialContext from '../components/app/SocialContext';
import { POST_ACTION_TYPES, ACTIONS_COMPACT_VIEW_MIN_WIDTH } from '../lib/constants';
import { uppercaseFirstLetter } from '../lib/utils';
import { getActionsForPost } from '../posts/selectors';
import { clonePosts } from '../posts/actions';
import { initPostBoosting } from '../redux/actions/boosting';

function PostAction(_ref) {
  var action = _ref.action,
      actionHandler = _ref.actionHandler,
      accountSlug = _ref.accountSlug,
      _ref$disabledReason = _ref.disabledReason,
      disabledReason = _ref$disabledReason === void 0 ? null : _ref$disabledReason,
      compactViewEnabled = _ref.compactViewEnabled,
      _ref$href = _ref.href,
      href = _ref$href === void 0 ? null : _ref$href;
  var handleOnClick = useCallback(function (ev) {
    actionHandler(action, ev);
  }, [actionHandler, action]);

  var TooltipContent = function TooltipContent() {
    return /*#__PURE__*/_jsx(UITooltipContent, {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sui.manageDashboard.actions." + action.toLowerCase() + ".disabledReason." + disabledReason
      })
    });
  };

  return /*#__PURE__*/_jsx(UITooltip, {
    disabled: disabledReason === null,
    Content: TooltipContent,
    placement: compactViewEnabled ? 'right' : 'top',
    children: /*#__PURE__*/_jsx(UIButton, {
      use: "tertiary-light",
      size: "sm",
      onClick: handleOnClick,
      "data-test-id": "post-action-" + action,
      disabled: disabledReason !== null,
      href: href,
      external: action === POST_ACTION_TYPES.VIEW_ON_NETWORK,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sui.manageDashboard.actions." + action.toLowerCase() + ".label",
        options: {
          network: uppercaseFirstLetter(accountSlug)
        }
      })
    }, action)
  });
}

function PostActions(_ref2) {
  var post = _ref2.post,
      handleViewDetails = _ref2.handleViewDetails,
      handleDelete = _ref2.handleDelete,
      _ref2$size = _ref2.size,
      size = _ref2$size === void 0 ? {
    width: null,
    height: null
  } : _ref2$size,
      _ref2$buttonSize = _ref2.buttonSize,
      buttonSize = _ref2$buttonSize === void 0 ? 'sm' : _ref2$buttonSize,
      _ref2$isDetailsPanel = _ref2.isDetailsPanel,
      isDetailsPanel = _ref2$isDetailsPanel === void 0 ? false : _ref2$isDetailsPanel,
      _ref2$placement = _ref2.placement,
      placement = _ref2$placement === void 0 ? 'bottom right' : _ref2$placement;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      compactViewEnabled = _useState2[0],
      setCompactViewEnabled = _useState2[1];

  var _useContext = useContext(SocialContext),
      trackInteraction = _useContext.trackInteraction;

  var dispatch = useDispatch();
  var actionsByPost = useSelector(function (state) {
    return getActionsForPost(state, {
      postId: String(post.get('id')),
      isDetailsPanel: isDetailsPanel
    });
  });
  var handleActionClick = useCallback(function (action) {
    switch (action) {
      case POST_ACTION_TYPES.VIEW_DETAILS:
        trackInteraction('view post details');
        handleViewDetails();
        break;

      case POST_ACTION_TYPES.CLONE:
        trackInteraction('clone post');
        dispatch(clonePosts([post.get('id')]));
        break;

      case POST_ACTION_TYPES.VIEW_ON_NETWORK:
        trackInteraction('view post on network');
        break;

      case POST_ACTION_TYPES.DELETE:
        handleDelete([post]);
        break;

      case POST_ACTION_TYPES.BOOST:
        dispatch(initPostBoosting(String(post.get('id'))));
        break;

      default:
        break;
    }
  }, [trackInteraction, handleViewDetails, dispatch, post, handleDelete]);
  useEffect(function () {
    setCompactViewEnabled(size.width < ACTIONS_COMPACT_VIEW_MIN_WIDTH);
  }, [size]);
  return /*#__PURE__*/_jsxs("div", {
    className: "variable-column actions-wrapper",
    children: [!compactViewEnabled && actionsByPost[POST_ACTION_TYPES.VIEW_DETAILS].visible && /*#__PURE__*/_jsx(PostAction, {
      action: POST_ACTION_TYPES.VIEW_DETAILS,
      actionHandler: handleActionClick,
      accountSlug: post.accountSlug
    }), !compactViewEnabled && actionsByPost[POST_ACTION_TYPES.CLONE].visible && /*#__PURE__*/_jsx(PostAction, {
      action: POST_ACTION_TYPES.CLONE,
      actionHandler: handleActionClick,
      accountSlug: post.accountSlug,
      disabledReason: actionsByPost[POST_ACTION_TYPES.CLONE].disabledReason
    }), /*#__PURE__*/_jsx(UIDropdown, {
      buttonSize: buttonSize,
      buttonUse: "tertiary-light",
      buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: 'sui.manageDashboard.actions.placeholder'
      }),
      closeOnMenuClick: true,
      defaultOpen: false,
      "data-test-id": "table-action-dropdown",
      placement: placement,
      children: /*#__PURE__*/_jsx(UIList, {
        children: Object.keys(actionsByPost).map(function (action) {
          var listElements = [];

          if (action === POST_ACTION_TYPES.DELETE && actionsByPost[action].visible) {
            listElements.push( /*#__PURE__*/_jsx(UIDropdownDivider, {}, "drop-down-divider--" + action));
          }

          if (!compactViewEnabled && actionsByPost[action].visible && action !== POST_ACTION_TYPES.VIEW_DETAILS && action !== POST_ACTION_TYPES.CLONE || compactViewEnabled && actionsByPost[action].visible) {
            listElements.push( /*#__PURE__*/_jsx(PostAction, {
              action: action,
              actionHandler: handleActionClick,
              accountSlug: post.accountSlug,
              compactViewEnabled: compactViewEnabled,
              disabledReason: actionsByPost[action].disabledReason,
              href: action === POST_ACTION_TYPES.VIEW_ON_NETWORK ? post.get('url') : null
            }));
          }

          return listElements;
        })
      })
    })]
  });
}

PostActions.propTypes = {
  post: reportingPostProp,
  handleViewDetails: PropTypes.func,
  handleDelete: PropTypes.func.isRequired,
  size: PropTypes.object.isRequired,
  isDetailsPanel: PropTypes.bool,
  placement: PropTypes.string,
  buttonSize: PropTypes.string
};
export default PostActions;