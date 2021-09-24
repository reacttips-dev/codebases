'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import I18n from 'I18n';
import UIRouterButtonLink from 'ui-addon-react-router/UIRouterButtonLink';
import { BROADCAST_ACTION_TYPES, ACTIONS_TO_LABEL } from '../../lib/constants';
import SocialContext from '../app/SocialContext';
import { setProp } from '../../lib/propTypes';
import UIButton from 'UIComponents/button/UIButton';

function ViewDetailsBroadcastButton(_ref) {
  var actions = _ref.actions,
      href = _ref.href,
      onViewDetails = _ref.onViewDetails;

  var _useContext = useContext(SocialContext),
      trackInteraction = _useContext.trackInteraction;

  var handleViewDetails = useCallback(function () {
    trackInteraction('view broadcast details - button');
    onViewDetails();
  }, [trackInteraction, onViewDetails]);

  if (!actions.get(BROADCAST_ACTION_TYPES.VIEW_DETAILS)) {
    return null;
  }

  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [href && /*#__PURE__*/_jsx(UIRouterButtonLink, {
      to: href,
      use: "tertiary-light",
      size: "sm",
      onClick: onViewDetails,
      "data-test-id": "broadcast-action-VIEW_DETAILS",
      children: I18n.text(ACTIONS_TO_LABEL[BROADCAST_ACTION_TYPES.VIEW_DETAILS])
    }), !href && /*#__PURE__*/_jsx(UIButton, {
      use: "tertiary-light",
      size: "sm",
      onClick: handleViewDetails,
      "data-test-id": "broadcast-action-VIEW_DETAILS",
      children: I18n.text(ACTIONS_TO_LABEL[BROADCAST_ACTION_TYPES.VIEW_DETAILS])
    })]
  });
}

ViewDetailsBroadcastButton.propTypes = {
  actions: setProp,
  href: PropTypes.string,
  onViewDetails: PropTypes.func.isRequired
};
export default ViewDetailsBroadcastButton;