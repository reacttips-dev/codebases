'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import { GREAT_WHITE } from 'HubStyleTokens/colors';
import FormattedMessage from 'I18n/components/FormattedMessage';
import styled from 'styled-components';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';
import UILink from 'UIComponents/link/UILink';
import PortalIdParser from 'PortalIdParser';
import CSaTFeedbackStarRatingContainer from '../../csat-feedback/containers/CSaTFeedbackStarRatingContainer';
import { callingUserPreferencesUrl } from 'calling-settings-ui-library/utils/urlUtils';
import SaveFooter from './SaveFooter';
export var StarRatingWrapper = styled.div.withConfig({
  displayName: "PostCallActions__StarRatingWrapper",
  componentId: "sc-11kn6fk-0"
})(["border-bottom:1px solid ", ";"], GREAT_WHITE);

var PostCallActions = /*#__PURE__*/function (_PureComponent) {
  _inherits(PostCallActions, _PureComponent);

  function PostCallActions() {
    _classCallCheck(this, PostCallActions);

    return _possibleConstructorReturn(this, _getPrototypeOf(PostCallActions).apply(this, arguments));
  }

  _createClass(PostCallActions, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // get default dimenstions for resetting
      var body = document.getElementById('communicator-body-element');
      this.prevIframeDimensions = {
        height: body.offsetHeight,
        width: body.offsetWidth
      };
    }
  }, {
    key: "render",
    value: function render() {
      var disabled = this.props.disabled;
      return [/*#__PURE__*/_jsxs(StarRatingWrapper, {
        className: "display-flex m-x-3 p-y-2 align-center",
        children: [/*#__PURE__*/_jsx(CSaTFeedbackStarRatingContainer, {
          disabled: disabled
        }), /*#__PURE__*/_jsx(UIDropdown, {
          buttonUse: "transparent",
          buttonText: "More",
          responsive: false,
          buttonSize: "small",
          disabled: disabled,
          buttonClassName: "m-left-auto",
          "data-selenium-test": "calling-widget-more-dropdown",
          children: /*#__PURE__*/_jsx(UIList, {
            children: /*#__PURE__*/_jsx(UILink, {
              external: true,
              href: callingUserPreferencesUrl(PortalIdParser.get()),
              "data-selenium-test": "calling-widget-see-monthly-usage-button",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "callingMinutesUsage.minutesUsageCTA"
              })
            })
          })
        })]
      }, "star-rating-wrapper"), /*#__PURE__*/_jsx(SaveFooter, {
        disabled: disabled
      }, "save-footer")];
    }
  }]);

  return PostCallActions;
}(PureComponent);

PostCallActions.propTypes = {
  disabled: PropTypes.bool.isRequired
};
export { PostCallActions as default };