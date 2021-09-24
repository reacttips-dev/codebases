'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import hubspot from 'hubspot';
import classNames from 'classnames';
var flagsImagePath = (hubspot.bender && hubspot.bender.staticDomainPrefix) + "/ui-addon-i18n/static-1.4421/img/flags.png";
export default createReactClass({
  displayName: "CountryFlag",
  propTypes: {
    countryCode: PropTypes.string.isRequired
  },
  getFlagStyle: function getFlagStyle() {
    return {
      backgroundImage: "url(" + flagsImagePath + ")"
    };
  },
  render: function render() {
    var _this$props = this.props,
        countryCode = _this$props.countryCode,
        className = _this$props.className,
        passThroughProps = _objectWithoutProperties(_this$props, ["countryCode", "className"]);

    return /*#__PURE__*/_jsx("span", Object.assign({}, passThroughProps, {
      className: classNames('country-flag', className, countryCode.toLowerCase()),
      style: this.getFlagStyle()
    }));
  }
});