'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { CALYPSO, CANDY_APPLE, KOALA, MARIGOLD, OLAF, OZ, SORBET } from 'HubStyleTokens/colors';
import { WEB_FONT_DEMI_BOLD_WEIGHT } from 'HubStyleTokens/misc';
import { BUTTON_RADIUS, DISTANCE_MEASUREMENT_EXTRA_SMALL, MICROCOPY_SIZE, FORM_COPY_SIZE } from 'HubStyleTokens/sizes';
import memoizeOne from 'react-utils/memoizeOne';
var ProgressWrapper = styled.div.withConfig({
  displayName: "UIProgress__ProgressWrapper",
  componentId: "ee566b-0"
})(["background-color:", ";border-radius:", ";height:16px;overflow:hidden;"], function (_ref) {
  var use = _ref.use;
  return use === 'danger' ? CANDY_APPLE : KOALA;
}, BUTTON_RADIUS);
var ProgressBar = styled.div.withConfig({
  displayName: "UIProgress__ProgressBar",
  componentId: "ee566b-1"
})(["background-image:linear-gradient( 89deg,", " 0%,", " 100% );transition:width 0.6s ", ";border-radius:", ";border-right:", ";color:", ";font-size:", ";height:100%;line-height:16px;text-align:center;"], function (_ref2) {
  var use = _ref2.use;
  return use === 'success' ? OZ : SORBET;
}, function (_ref3) {
  var use = _ref3.use;
  return use === 'success' ? CALYPSO : MARIGOLD;
}, function (_ref4) {
  var easing = _ref4.easing;
  return easing;
}, function (_ref5) {
  var use = _ref5.use;
  return use !== 'danger' && BUTTON_RADIUS;
}, function (_ref6) {
  var use = _ref6.use;
  return use === 'danger' && "3px " + OLAF + " solid";
}, OLAF, MICROCOPY_SIZE);
var ProgressAndLabelWrapper = styled.div.withConfig({
  displayName: "UIProgress__ProgressAndLabelWrapper",
  componentId: "ee566b-2"
})(["margin-bottom:16px;"]);
var StackedLabelWrapper = styled.div.withConfig({
  displayName: "UIProgress__StackedLabelWrapper",
  componentId: "ee566b-3"
})(["margin-bottom:", ";display:flex;justify-content:space-between;"], DISTANCE_MEASUREMENT_EXTRA_SMALL);
var DescriptiveLabel = styled.div.withConfig({
  displayName: "UIProgress__DescriptiveLabel",
  componentId: "ee566b-4"
})(["font-size:", ";"], FORM_COPY_SIZE);
var ValueLabel = styled.div.withConfig({
  displayName: "UIProgress__ValueLabel",
  componentId: "ee566b-5"
})(["font-size:", ";font-weight:", ";"], FORM_COPY_SIZE, WEB_FONT_DEMI_BOLD_WEIGHT);

var getStyle = function getStyle(style, rawPercentage) {
  return Object.assign({}, style, {
    width: rawPercentage * 100 + "%"
  });
};

var UIProgress = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIProgress, _PureComponent);

  function UIProgress(props) {
    var _this;

    _classCallCheck(this, UIProgress);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIProgress).call(this, props));
    _this._getStyle = memoizeOne(getStyle);
    return _this;
  }

  _createClass(UIProgress, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          descriptiveLabel = _this$props.descriptiveLabel,
          easing = _this$props.easing,
          hasLabel = _this$props.hasLabel,
          min = _this$props.min,
          max = _this$props.max,
          style = _this$props.style,
          use = _this$props.use,
          value = _this$props.value,
          valueLabel = _this$props.valueLabel,
          wrapperClassName = _this$props.wrapperClassName,
          rest = _objectWithoutProperties(_this$props, ["children", "className", "descriptiveLabel", "easing", "hasLabel", "min", "max", "style", "use", "value", "valueLabel", "wrapperClassName"]);

      var rawPercentage = Math.min(value / max, 1);
      var formattedPercentage = I18n.formatPercentage(rawPercentage * 100);
      var renderedLabel;

      if (children != null) {
        renderedLabel = children;
      } else if (hasLabel) {
        renderedLabel = /*#__PURE__*/_jsx("span", {
          children: formattedPercentage
        });
      } else {
        renderedLabel = /*#__PURE__*/_jsx("span", {
          className: "sr-only",
          children: I18n.text('ui.progress.percentComplete', {
            percent: formattedPercentage
          })
        });
      }

      var stackedLabel = valueLabel != null || descriptiveLabel != null ? /*#__PURE__*/_jsxs(StackedLabelWrapper, {
        children: [/*#__PURE__*/_jsx(DescriptiveLabel, {
          children: descriptiveLabel
        }), /*#__PURE__*/_jsx(ValueLabel, {
          children: valueLabel
        })]
      }) : null;
      return /*#__PURE__*/_jsxs(ProgressAndLabelWrapper, {
        className: wrapperClassName,
        children: [stackedLabel, /*#__PURE__*/_jsx(ProgressWrapper, Object.assign({}, rest, {
          className: classNames('private-progress', className),
          use: use,
          children: /*#__PURE__*/_jsx(ProgressBar, {
            "aria-valuemax": max,
            "aria-valuemin": min,
            "aria-valuenow": value,
            className: "private-progress__bar",
            easing: easing,
            role: "progressbar",
            style: this._getStyle(style, rawPercentage),
            use: use,
            children: renderedLabel
          })
        }))]
      });
    }
  }]);

  return UIProgress;
}(PureComponent);

UIProgress.propTypes = {
  children: PropTypes.node,
  descriptiveLabel: PropTypes.node,
  easing: PropTypes.string.isRequired,
  hasLabel: PropTypes.bool.isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  use: PropTypes.oneOf(['success', 'danger', 'warning']).isRequired,
  value: PropTypes.number.isRequired,
  valueLabel: PropTypes.node,
  wrapperClassName: PropTypes.string
};
UIProgress.defaultProps = {
  easing: 'ease',
  hasLabel: false,
  min: 0,
  max: 100,
  use: 'success',
  value: 0
};
UIProgress.displayName = 'UIProgress';
export default UIProgress;