'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import PortalIdParser from 'PortalIdParser';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import ConnectedAPIDropdown from 'customer-data-reference-ui-components/connector/ConnectedAPIDropdown';
import { CONTACT_STATIC_LIST } from 'reference-resolvers/constants/ReferenceObjectTypes';
var propTypes = {
  onSelectList: PropTypes.func.isRequired,
  portalHasStaticLists: PropTypes.bool,
  subjectId: PropTypes.string.isRequired
};

var StaticListMemberships = /*#__PURE__*/function (_PureComponent) {
  _inherits(StaticListMemberships, _PureComponent);

  function StaticListMemberships() {
    _classCallCheck(this, StaticListMemberships);

    return _possibleConstructorReturn(this, _getPrototypeOf(StaticListMemberships).apply(this, arguments));
  }

  _createClass(StaticListMemberships, [{
    key: "renderAddToListControls",
    value: function renderAddToListControls() {
      var _this$props = this.props,
          onSelectList = _this$props.onSelectList,
          subjectId = _this$props.subjectId,
          portalHasStaticLists = _this$props.portalHasStaticLists;
      return /*#__PURE__*/_jsx(ConnectedAPIDropdown, {
        referenceObjectType: CONTACT_STATIC_LIST,
        onChange: onSelectList,
        placeholder: I18n.text('profileSidebarModule.listMembershipSearchPlaceholder'),
        subjectId: subjectId,
        disabled: !portalHasStaticLists
      });
    }
  }, {
    key: "renderNoLists",
    value: function renderNoLists() {
      return /*#__PURE__*/_jsxs("div", {
        className: "membership-wrapper text-center",
        children: [/*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "profileSidebarModule.noLists"
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          href: "/lists/" + PortalIdParser.get() + "/",
          use: "tertiary-light",
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "profileSidebarModule.noListsCTA"
          })
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.props.portalHasStaticLists) {
        return this.renderNoLists();
      }

      return /*#__PURE__*/_jsx("div", {
        className: "flex-column",
        children: this.renderAddToListControls()
      });
    }
  }]);

  return StaticListMemberships;
}(PureComponent);

StaticListMemberships.propTypes = propTypes;
export default StaticListMemberships;