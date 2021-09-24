'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import TimezoneTypes from '../constants/TimezoneTypes';
import RelativeDurationFormats from '../constants/RelativeDurationFormats';
import formatDuration from '../utils/formatRelativeDuration';

var getRelativeDuration = function getRelativeDuration(from, to, options) {
  return formatDuration(I18n.moment.duration(Math.abs(to.diff(from))), options);
};

export default createReactClass({
  displayName: "FormattedDuration",
  propTypes: {
    includeAffix: PropTypes.bool,
    type: PropTypes.oneOf([TimezoneTypes.PORTAL, TimezoneTypes.USER, TimezoneTypes.UTC]),
    format: PropTypes.oneOf(Object.keys(RelativeDurationFormats).map(function (format) {
      return RelativeDurationFormats[format];
    })),
    from: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    to: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
    toFromValidator: function toFromValidator(props, propName, componentName) {
      if (!props.from && !props.to) {
        console.warn(componentName + " should have either a \"to\" or a \"from\" prop", componentName);
      }
    },
    combined: PropTypes.bool
  },
  getDefaultProps: function getDefaultProps() {
    return {
      type: TimezoneTypes.PORTAL,
      includeAffix: false,
      combined: false
    };
  },
  render: function render() {
    var _this$props = this.props,
        includeAffix = _this$props.includeAffix,
        type = _this$props.type,
        from = _this$props.from,
        to = _this$props.to,
        format = _this$props.format,
        combined = _this$props.combined;
    var nowMoment = I18n.moment[type]();
    var duration;

    if (!to && !from) {
      duration = '';
    } else if (!to) {
      var fromValue = I18n.moment[type](from);
      duration = format ? getRelativeDuration(fromValue, nowMoment, {
        format: format,
        combined: combined
      }) : fromValue.toNow(!includeAffix);
    } else if (!from) {
      var toValue = I18n.moment[type](to);
      duration = format ? getRelativeDuration(nowMoment, toValue, {
        format: format,
        combined: combined
      }) : toValue.fromNow(!includeAffix);
    } else {
      var _fromValue = I18n.moment[type](from);

      var _toValue = I18n.moment[type](to);

      duration = format ? getRelativeDuration(_fromValue, _toValue, {
        format: format,
        combined: combined
      }) : _toValue.from(_fromValue, !includeAffix);
    }

    return /*#__PURE__*/_jsx("span", {
      children: duration
    });
  }
});