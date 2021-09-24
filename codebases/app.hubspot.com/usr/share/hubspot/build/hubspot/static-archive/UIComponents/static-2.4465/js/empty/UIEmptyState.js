'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { cloneElement, isValidElement, PureComponent } from 'react';
import styled, { css } from 'styled-components';
import H4 from '../elements/headings/H4';
import UISplitLayout from '../layout/UISplitLayout';
import { EMPTY_STATE_PADDING_X, EMPTY_STATE_PADDING_Y } from 'HubStyleTokens/sizes';
import { toPx } from '../utils/Styles';
import { warnIfFragment } from '../utils/devWarnings'; // empty state styling is characterized by copious whitespace, per design
// vertical orientation differs to more closely match UIErrorMessage styles

var OUTER_MARGIN = 40;
var Outer = styled(function (props) {
  var __flush = props.flush,
      __layout = props.layout,
      __maxWidth = props.maxWidth,
      rest = _objectWithoutProperties(props, ["flush", "layout", "maxWidth"]);

  return /*#__PURE__*/_jsx(UISplitLayout, Object.assign({}, rest));
}).withConfig({
  displayName: "UIEmptyState__Outer",
  componentId: "sc-1dnc9lj-0"
})(["margin:", " auto;margin-bottom:", ";margin-top:", ";max-width:", ";padding-left:", ";width:100%;"], function (props) {
  return props.layout === 'vertical' ? toPx(OUTER_MARGIN) : toPx(OUTER_MARGIN * 2);
}, function (props) {
  return props.flush && '0';
}, function (props) {
  return props.flush && '0';
}, function (props) {
  return toPx(props.maxWidth);
}, EMPTY_STATE_PADDING_X);
var Inner = styled(UISplitLayout.defaultProps.InnerWrapper).withConfig({
  displayName: "UIEmptyState__Inner",
  componentId: "sc-1dnc9lj-1"
})(["margin-left:-", ";margin-top:-", ";"], EMPTY_STATE_PADDING_X, EMPTY_STATE_PADDING_Y);
var SLOT_PADDING_STYLES = css(["margin:auto;padding-left:", ";padding-top:", ";"], EMPTY_STATE_PADDING_X, EMPTY_STATE_PADDING_Y);
var PrimarySlot = styled(UISplitLayout.defaultProps.Primary).withConfig({
  displayName: "UIEmptyState__PrimarySlot",
  componentId: "sc-1dnc9lj-2"
})(["", ";margin-top:0;text-align:", ";"], SLOT_PADDING_STYLES, function (props) {
  return props.layout === 'vertical' && 'center';
});
var SecondarySlot = styled(UISplitLayout.defaultProps.Secondary).withConfig({
  displayName: "UIEmptyState__SecondarySlot",
  componentId: "sc-1dnc9lj-3"
})(["", ";margin-bottom:", ";margin-top:0;text-align:", ";"], SLOT_PADDING_STYLES, function (props) {
  return props.layout === 'vertical' && '20px';
}, function (props) {
  return props.layout === 'vertical' && 'center';
});

var UIEmptyState = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIEmptyState, _PureComponent);

  function UIEmptyState() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIEmptyState);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIEmptyState)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.Primary = function (props) {
      var _this$props = _this.props,
          layout = _this$props.layout,
          _primaryContentWidth = _this$props._primaryContentWidth,
          reverseOrder = _this$props.reverseOrder,
          secondaryContent = _this$props.secondaryContent;
      var computedPrimaryContentWidth = secondaryContent ? _primaryContentWidth : '100%';
      return /*#__PURE__*/_jsx(PrimarySlot, Object.assign({}, props, {
        basis: layout === 'horizontal' ? computedPrimaryContentWidth : 'auto',
        grow: 9999,
        layout: layout,
        order: reverseOrder ? 1 : 0,
        shrink: 1
      }));
    };

    _this.Secondary = function (props) {
      var _this$props2 = _this.props,
          layout = _this$props2.layout,
          secondaryContentWidth = _this$props2.secondaryContentWidth;
      var computedPadding = parseInt(EMPTY_STATE_PADDING_X, 10);
      var computedSecondaryContentWidth = layout === 'horizontal' ? secondaryContentWidth + computedPadding : 'auto';
      return /*#__PURE__*/_jsx(SecondarySlot, Object.assign({}, props, {
        basis: computedSecondaryContentWidth,
        grow: 1,
        layout: layout,
        shrink: 1
      }));
    };

    return _this;
  }

  _createClass(UIEmptyState, [{
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          className = _this$props3.className,
          layout = _this$props3.layout,
          primaryContent = _this$props3.primaryContent,
          primaryContentClassName = _this$props3.primaryContentClassName,
          __primaryContentWidth = _this$props3._primaryContentWidth,
          __reverseOrder = _this$props3.reverseOrder,
          secondaryContent = _this$props3.secondaryContent,
          secondaryContentClassName = _this$props3.secondaryContentClassName,
          __secondaryContentWidth = _this$props3.secondaryContentWidth,
          titleText = _this$props3.titleText,
          rest = _objectWithoutProperties(_this$props3, ["className", "layout", "primaryContent", "primaryContentClassName", "_primaryContentWidth", "reverseOrder", "secondaryContent", "secondaryContentClassName", "secondaryContentWidth", "titleText"]);

      var renderedHeading;

      if ( /*#__PURE__*/isValidElement(titleText) && !titleText.type.isI18nElement) {
        warnIfFragment(titleText, UIEmptyState.displayName, 'titleText');
        renderedHeading = titleText;
      } else if (titleText != null) {
        renderedHeading = /*#__PURE__*/_jsx(H4, {
          children: titleText
        });
      }

      warnIfFragment(primaryContent, UIEmptyState.displayName, 'primaryContent');
      var renderedPrimaryContent = [renderedHeading != null ? /*#__PURE__*/cloneElement(renderedHeading, {
        key: 'heading '
      }) : renderedHeading, /*#__PURE__*/isValidElement(primaryContent) ? /*#__PURE__*/cloneElement(primaryContent, {
        key: 'content'
      }) : primaryContent];
      return /*#__PURE__*/_jsx(Outer, Object.assign({}, rest, {
        className: className,
        layout: layout,
        orientation: layout,
        InnerWrapper: Inner,
        Primary: this.Primary,
        primaryClassName: primaryContentClassName,
        primaryContent: renderedPrimaryContent,
        Secondary: this.Secondary,
        secondaryClassName: secondaryContentClassName,
        secondaryContent: secondaryContent
      }));
    }
  }]);

  return UIEmptyState;
}(PureComponent);

export { UIEmptyState as default };
UIEmptyState.propTypes = {
  flush: PropTypes.bool.isRequired,
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  maxWidth: PropTypes.number,
  primaryContent: PropTypes.node.isRequired,
  primaryContentClassName: PropTypes.string,

  /**
   * _primaryContentWidth:
   * This prop is kept as an escape hatch, but 200 is used as the minimum
   * threshold for keeping text readable as horizontal space squishes down
   */
  _primaryContentWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  reverseOrder: PropTypes.bool.isRequired,
  secondaryContent: PropTypes.node,
  secondaryContentClassName: PropTypes.string,
  secondaryContentWidth: PropTypes.number,
  titleText: PropTypes.node
};
UIEmptyState.defaultProps = {
  flush: false,
  layout: 'horizontal',
  maxWidth: 815,
  reverseOrder: false,
  secondaryContentWidth: 350,
  _primaryContentWidth: 200
};
UIEmptyState.displayName = 'UIEmptyState';