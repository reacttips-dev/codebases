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

var LinkedinDetails = /*#__PURE__*/function (_Component) {
  _inherits(LinkedinDetails, _Component);

  function LinkedinDetails() {
    _classCallCheck(this, LinkedinDetails);

    return _possibleConstructorReturn(this, _getPrototypeOf(LinkedinDetails).apply(this, arguments));
  }

  _createClass(LinkedinDetails, [{
    key: "renderIfPresent",
    value: function renderIfPresent(details, propertyName) {
      if (details.get(propertyName)) {
        return [/*#__PURE__*/_jsx("dt", {
          children: I18n.text("sui.profile.linkedin." + propertyName)
        }, "key"), /*#__PURE__*/_jsx("dd", {
          children: details.get(propertyName)
        }, "val")];
      }

      return null;
    }
  }, {
    key: "renderViewOnNetwork",
    value: function renderViewOnNetwork() {
      var url = this.props.profile.getProfileLink(ACCOUNT_TYPES.linkedin);

      if (!url) {
        return null;
      }

      return /*#__PURE__*/_jsx(UILink, {
        href: url,
        external: true,
        target: "_blank",
        children: I18n.text('sui.profile.linkedin.viewOnNetwork')
      });
    }
  }, {
    key: "render",
    value: function render() {
      var profile = this.props.profile;
      var details = this.props.profile.getDetails(ACCOUNT_TYPES.linkedin);

      if (!details || details.isEmpty()) {
        if (!profile.interactionDetails) {
          return null;
        }

        details = profile.interactionDetails;
      }

      var viewOnNetworkEl = this.renderViewOnNetwork();

      if (!viewOnNetworkEl) {
        return null;
      }

      return /*#__PURE__*/_jsxs(UICardWrapper, {
        compact: true,
        children: [/*#__PURE__*/_jsx(UICardHeader, {
          title: I18n.text('sui.profile.linkedin.header'),
          toolbar: viewOnNetworkEl
        }), /*#__PURE__*/_jsx(UICardSection, {
          className: "network-details",
          children: /*#__PURE__*/_jsxs(UIDescriptionList, {
            children: [this.renderIfPresent(details, 'headline'), this.renderIfPresent(details, '')]
          })
        })]
      });
    }
  }]);

  return LinkedinDetails;
}(Component);

LinkedinDetails.propTypes = {
  profile: feedUserProp
};
export { LinkedinDetails as default };