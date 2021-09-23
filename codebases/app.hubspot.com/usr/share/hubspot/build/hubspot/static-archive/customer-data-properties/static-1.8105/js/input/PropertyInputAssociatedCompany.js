'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import formatName from 'I18n/utils/formatName';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { deref, watch, unwatch } from 'atom';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import { getProperty } from 'customer-data-objects/record/ObjectRecordAccessors';
import { toString } from 'customer-data-objects/record/ObjectRecordFormatters';
var propTypes = {
  resolver: ReferenceResolverType.isRequired,
  value: PropTypes.string,
  'data-selenium-test': PropTypes.string
};

var PropertyInputAssociatedCompany = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputAssociatedCompany, _Component);

  function PropertyInputAssociatedCompany(props) {
    var _this;

    _classCallCheck(this, PropertyInputAssociatedCompany);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputAssociatedCompany).call(this, props));

    _this.handleInitReferenceAtom = function () {
      var _this$props = _this.props,
          resolver = _this$props.resolver,
          value = _this$props.value;

      if (!value) {
        return;
      }

      _this.referenceAtom = resolver.byId(value);
      watch(_this.referenceAtom, _this.handleCompanyReferenceChange);

      _this.handleCompanyReferenceChange(deref(_this.referenceAtom));
    };

    _this.handleCompanyReferenceChange = function (reference) {
      if (!reference) {
        return;
      }

      var company = reference.referencedObject;

      if (!company) {
        return;
      }

      _this.setState({
        company: company
      });
    };

    _this.state = {
      company: null
    };
    return _this;
  }

  _createClass(PropertyInputAssociatedCompany, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleInitReferenceAtom();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.referenceAtom) {
        unwatch(this.referenceAtom, this.handleCompanyReferenceChange);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var company = this.state.company;
      var domain = company && getProperty(company, 'domain');
      return company ? /*#__PURE__*/_jsxs("div", {
        "data-selenium-test": this.props['data-selenium-test'],
        children: [/*#__PURE__*/_jsx(UIAvatar, {
          className: "m-y-2 m-right-3",
          lookup: {
            type: 'domain',
            primaryIdentifier: domain
          },
          size: "sm"
        }), /*#__PURE__*/_jsxs("span", {
          children: [' ', "" + toString(formatName, company), domain ? "(" + domain + ")" : '']
        })]
      }) : /*#__PURE__*/_jsx("div", {});
    }
  }]);

  return PropertyInputAssociatedCompany;
}(Component);

PropertyInputAssociatedCompany.propTypes = propTypes;
export default PropertyInputAssociatedCompany;