'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import TimezoneTypes from '../constants/TimezoneTypes';
import I18n from 'I18n';
export default createReactClass({
  displayName: "FormattedRelative",
  propTypes: {
    includeSuffix: PropTypes.bool,
    type: PropTypes.oneOf([TimezoneTypes.PORTAL, TimezoneTypes.USER, TimezoneTypes.UTC]),
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.number]).isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      includeSuffix: true,
      type: TimezoneTypes.PORTAL
    };
  },
  render: function render() {
    var _this$props = this.props,
        value = _this$props.value,
        type = _this$props.type,
        includeSuffix = _this$props.includeSuffix;
    return /*#__PURE__*/_jsx("span", {
      children: I18n.moment[type](value).fromNow(!includeSuffix)
    });
  }
});