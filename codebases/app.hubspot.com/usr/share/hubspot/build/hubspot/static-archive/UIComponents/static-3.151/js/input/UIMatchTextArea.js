'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import Controllable from '../decorators/Controllable';
import ShareInput from '../decorators/ShareInput';
import SyntheticEvent from '../core/SyntheticEvent';
import { inputCouldMatch } from '../core/Strings';
import { getTextHeight } from '../utils/MeasureText';
import UITextArea from './UITextArea';
import styled, { css } from 'styled-components';
import { EERIE } from 'HubStyleTokens/colors';
var xxlSizeMixin = css(["font-size:32px;line-height:40px;padding:16px;"]);

var getSize = function getSize(_ref) {
  var size = _ref.size;
  return size === 'xxl' && xxlSizeMixin;
};

var Wrapper = styled.div.withConfig({
  displayName: "UIMatchTextArea__Wrapper",
  componentId: "sc-1e7mj3e-0"
})(["position:relative;width:100%;"]);
var PlaceholderText = styled.div.withConfig({
  displayName: "UIMatchTextArea__PlaceholderText",
  componentId: "sc-1e7mj3e-1"
})(["&&{border-color:transparent;color:", ";position:relative;word-wrap:break-word;", "}"], EERIE, getSize);
var TextArea = styled(UITextArea).withConfig({
  displayName: "UIMatchTextArea__TextArea",
  componentId: "sc-1e7mj3e-2"
})(["&&{background-color:transparent;left:0;position:absolute;top:0;width:100%;", "}"], getSize);

var UIMatchTextArea = /*#__PURE__*/function (_Component) {
  _inherits(UIMatchTextArea, _Component);

  function UIMatchTextArea(props) {
    var _this;

    _classCallCheck(this, UIMatchTextArea);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIMatchTextArea).call(this, props));

    _this.computeMatchTextHeight = function () {
      var _assertThisInitialize = _assertThisInitialized(_this),
          _assertThisInitialize2 = _assertThisInitialize.props,
          inputRef = _assertThisInitialize2.inputRef,
          match = _assertThisInitialize2.match;

      var inputEl = inputRef.current;
      if (!inputEl) return;
      var originalInputValue = inputEl.value;
      inputEl.value = match;
      var matchTextHeight = getTextHeight(inputEl);
      inputEl.value = originalInputValue;

      if (matchTextHeight !== _this.state.matchTextHeight) {
        _this.setState({
          matchTextHeight: matchTextHeight
        });
      }
    };

    _this.handleChange = function (evt) {
      var _assertThisInitialize3 = _assertThisInitialized(_this),
          _assertThisInitialize4 = _assertThisInitialize3.props,
          match = _assertThisInitialize4.match,
          matched = _assertThisInitialize4.matched,
          onChange = _assertThisInitialize4.onChange,
          onMatchedChange = _assertThisInitialize4.onMatchedChange;

      var value = evt.target.value;

      if (!inputCouldMatch(value, match)) {
        return;
      }

      onChange(evt);
      var newMatched = value === match;

      if (newMatched !== matched) {
        onMatchedChange(SyntheticEvent(newMatched));
      }
    };

    _this.state = {
      matchTextHeight: null
    };
    return _this;
  }

  _createClass(UIMatchTextArea, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Handle case where initial "value" and "match" props are equal.
      var _this$props = this.props,
          match = _this$props.match,
          onMatchedChange = _this$props.onMatchedChange,
          value = _this$props.value;

      if (value === match) {
        onMatchedChange(SyntheticEvent(value === match));
      }

      this.computeMatchTextHeight();
      addEventListener('resize', this.computeMatchTextHeight);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.match !== this.props.match) {
        this.computeMatchTextHeight();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      removeEventListener('resize', this.computeMatchTextHeight);
    }
    /**
     * Measure the match text to determine the height of the <textarea>.
     */

  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          className = _this$props2.className,
          inputClassName = _this$props2.inputClassName,
          match = _this$props2.match,
          __matched = _this$props2.matched,
          __onChange = _this$props2.onChange,
          __onMatchedChange = _this$props2.onMatchedChange,
          size = _this$props2.size,
          value = _this$props2.value,
          rest = _objectWithoutProperties(_this$props2, ["className", "inputClassName", "match", "matched", "onChange", "onMatchedChange", "size", "value"]),
          matchTextHeight = this.state.matchTextHeight;

      var style = {
        height: matchTextHeight
      };
      return /*#__PURE__*/_jsxs(Wrapper, {
        className: className,
        children: [/*#__PURE__*/_jsx(PlaceholderText, {
          style: style,
          size: size,
          className: "form-control private-form__control",
          children: match
        }), /*#__PURE__*/_jsx(TextArea, Object.assign({}, rest, {
          className: inputClassName,
          size: size,
          "data-match-value": match,
          value: value,
          onChange: this.handleChange,
          resize: false,
          style: style
        }))]
      });
    }
  }]);

  return UIMatchTextArea;
}(Component);

UIMatchTextArea.displayName = 'UIMatchTextArea';
UIMatchTextArea.propTypes = Object.assign({}, UITextArea.propTypes, {
  inputClassName: PropTypes.string,
  match: PropTypes.string,
  matched: PropTypes.bool,
  onMatchedChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['md', 'xxl'])
});
UIMatchTextArea.defaultProps = Object.assign({}, UITextArea.defaultProps, {
  matched: false
});
export default ShareInput(Controllable(UIMatchTextArea, ['matched', 'value']));