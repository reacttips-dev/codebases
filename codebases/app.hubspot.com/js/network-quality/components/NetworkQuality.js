'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import { Component, Fragment } from 'react';
import styled from 'styled-components';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UILink from 'UIComponents/link/UILink';
import UIImage from 'UIComponents/image/UIImage';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
var StyledImage = styled(UIImage).withConfig({
  displayName: "NetworkQuality__StyledImage",
  componentId: "sc-1nyw9tm-0"
})(["display:inline !important;width:18px;margin-bottom:4px;margin-left:4px;"]);
var NetworkQualityWrapper = styled.div.withConfig({
  displayName: "NetworkQuality__NetworkQualityWrapper",
  componentId: "sc-1nyw9tm-1"
})(["justify-content:flex-end;"]);
var WEAK_MOS = 3.5;
var FAIR_MOS = 4.3;
var icons = {
  weak: 'sales-content/calling/signalBars-low.svg',
  fair: 'sales-content/calling/signalBars-med.svg',
  strong: 'sales-content/calling/signalBars-high.svg'
};

var NetworkQuality = /*#__PURE__*/function (_Component) {
  _inherits(NetworkQuality, _Component);

  function NetworkQuality() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, NetworkQuality);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(NetworkQuality)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleLogClickEvent = function () {
      CommunicatorLogger.log('communicator_bannerInteraction', {
        activity: 'call',
        channel: 'outbound call',
        source: 'communicator window',
        bannerType: 'Weak Network Quality'
      });
    };

    _this.handleLogHoverEvent = function (_ref) {
      var value = _ref.target.value;

      if (!value) {
        return;
      }

      var bannerType = 'Strong Network Quality';

      if (_this.props.mosScore < WEAK_MOS) {
        bannerType = 'Weak Network Quality';
      } else if (_this.props.mosScore < FAIR_MOS) {
        bannerType = 'Fair Network Quality';
      }

      CommunicatorLogger.log('communicator_bannerView', {
        activity: 'call',
        channel: 'outbound call',
        source: 'communicator window',
        bannerType: bannerType
      });
    };

    return _this;
  }

  _createClass(NetworkQuality, [{
    key: "getLink",
    value: function getLink() {
      return /*#__PURE__*/_jsx(UILink, {
        href: "https://knowledge.hubspot.com/calling/what-are-the-technical-requirements-to-use-the-calling-tool",
        onClick: this.handleLogClickEvent,
        external: true,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "calling-communicator-ui.networkQuality.learnMore"
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var networkQuality = 'strong';

      if (this.props.mosScore < WEAK_MOS) {
        networkQuality = 'weak';
      } else if (this.props.mosScore < FAIR_MOS) {
        networkQuality = 'fair';
      }

      var tooltipMessage = /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: "calling-communicator-ui.networkQuality.tooltips." + networkQuality,
        options: {
          link: this.getLink()
        }
      });

      return /*#__PURE__*/_jsx(Fragment, {
        children: /*#__PURE__*/_jsx(UITooltip, {
          title: tooltipMessage,
          placement: "bottom left",
          onOpenChange: this.handleLogHoverEvent,
          children: /*#__PURE__*/_jsxs(NetworkQualityWrapper, {
            className: "flex-column align-center",
            children: [/*#__PURE__*/_jsx(StyledImage, {
              "data-selenium-test": "calling-widget-network-quality-icon",
              src: "https://static.hsappstatic.net/salesImages/static-1.407/" + icons[networkQuality]
            }), /*#__PURE__*/_jsx("small", {
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "calling-communicator-ui.activeCallBar.network"
              })
            })]
          })
        })
      });
    }
  }]);

  return NetworkQuality;
}(Component);

export default NetworkQuality;