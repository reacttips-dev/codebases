'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import I18n from 'I18n';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UICardHeader from 'UIComponents/card/UICardHeader';
import UICardSection from 'UIComponents/card/UICardSection';
import UIDescriptionList from 'UIComponents/list/UIDescriptionList';
import UILink from 'UIComponents/link/UILink';
import { feedUserProp } from '../../lib/propTypes';
import { ACCOUNT_TYPES } from '../../lib/constants';
import SocialContext from '../app/SocialContext';

var FacebookDetails = /*#__PURE__*/function (_Component) {
  _inherits(FacebookDetails, _Component);

  function FacebookDetails() {
    _classCallCheck(this, FacebookDetails);

    return _possibleConstructorReturn(this, _getPrototypeOf(FacebookDetails).apply(this, arguments));
  }

  _createClass(FacebookDetails, [{
    key: "renderIfPresent",
    value: function renderIfPresent(details, propertyName) {
      var prepend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var formatNumber = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var asLink = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      if (details.get(propertyName)) {
        var propertyValue = formatNumber ? I18n.formatNumber(details.get(propertyName)) : details.get(propertyName);

        if (asLink) {
          propertyValue = /*#__PURE__*/_jsx(UILink, {
            href: propertyValue,
            target: "_blank",
            external: true,
            children: propertyValue
          });
        }

        return [/*#__PURE__*/_jsx("dt", {
          children: I18n.text("sui.profile.facebook." + propertyName)
        }, "key"), /*#__PURE__*/_jsxs("dd", {
          children: [prepend, propertyValue]
        }, "val")];
      }

      return null;
    }
  }, {
    key: "renderViewOnNetwork",
    value: function renderViewOnNetwork() {
      var _this = this;

      var url = this.props.profile.getProfileLink(ACCOUNT_TYPES.facebook);

      if (!url) {
        return null;
      }

      return /*#__PURE__*/_jsx(UILink, {
        href: url,
        external: true,
        target: "_blank",
        onClick: function onClick() {
          return _this.context.trackInteraction('view on facebook');
        },
        children: I18n.text('sui.profile.facebook.viewOnNetwork')
      });
    }
  }, {
    key: "render",
    value: function render() {
      var details = this.props.profile.getDetails(ACCOUNT_TYPES.facebook);

      if (this.props.profile.facebookProfile) {
        details = this.props.profile.facebookProfile.get('data');
      }

      var viewOnNetworkEl = this.renderViewOnNetwork();

      if (!viewOnNetworkEl) {
        return null;
      }

      if (!details || details.isEmpty()) {
        return /*#__PURE__*/_jsxs(UICardWrapper, {
          compact: true,
          children: [/*#__PURE__*/_jsx(UICardHeader, {
            title: I18n.text('sui.profile.facebook.header'),
            toolbar: viewOnNetworkEl
          }), /*#__PURE__*/_jsx(UICardSection, {
            className: "network-details"
          })]
        });
      }

      return /*#__PURE__*/_jsxs(UICardWrapper, {
        compact: true,
        children: [/*#__PURE__*/_jsx(UICardHeader, {
          title: I18n.text('sui.profile.facebook.header'),
          toolbar: this.renderViewOnNetwork()
        }), /*#__PURE__*/_jsx(UICardSection, {
          className: "network-details",
          children: /*#__PURE__*/_jsxs(UIDescriptionList, {
            children: [this.renderIfPresent(details, 'about'), this.renderIfPresent(details, 'fanCount', undefined, true), this.renderIfPresent(details, 'username'), this.renderIfPresent(details, 'gender'), this.renderIfPresent(details, 'location'), this.renderIfPresent(details, 'website', undefined, undefined, true)]
          })
        })]
      });
    }
  }]);

  return FacebookDetails;
}(Component);

FacebookDetails.propTypes = {
  profile: feedUserProp
};
FacebookDetails.contextType = SocialContext;
export { FacebookDetails as default };