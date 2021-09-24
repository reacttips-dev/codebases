'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import styled from 'styled-components';
import omit from '../utils/underscore/omit';
import { getTextHeight } from '../utils/MeasureText';
import { toPx } from '../utils/Styles';
import ShareInput from '../decorators/ShareInput';
import MeasureInput from '../decorators/MeasureInput';
import refObject from '../utils/propTypes/refObject';
import UITextArea from './UITextArea';
import memoizeOne from 'react-utils/memoizeOne';
import Controllable from '../decorators/Controllable';
var StyledTextArea = styled(function (props) {
  var __height = props.height,
      __maxHeight = props.maxHeight,
      rest = _objectWithoutProperties(props, ["height", "maxHeight"]);

  return /*#__PURE__*/_jsx(UITextArea, Object.assign({}, rest));
}).withConfig({
  displayName: "UIExpandingTextArea__StyledTextArea",
  componentId: "sc-1harlfc-0"
})(["max-height:", " !important;overflow:", " !important;&&{transition:none;}"], function (_ref) {
  var maxHeight = _ref.maxHeight;
  return maxHeight < Infinity && toPx(maxHeight);
}, function (_ref2) {
  var height = _ref2.height,
      maxHeight = _ref2.maxHeight;
  return height > maxHeight ? 'auto' : 'hidden';
});

var getStyle = function getStyle(height) {
  return {
    height: height
  };
};

var UIExpandingTextArea = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIExpandingTextArea, _PureComponent);

  function UIExpandingTextArea(props) {
    var _this;

    _classCallCheck(this, UIExpandingTextArea);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIExpandingTextArea).call(this, props));

    _this.setHeight = function (initial) {
      var _this$props = _this.props,
          inputRef = _this$props.inputRef,
          minHeight = _this$props.minHeight,
          shrink = _this$props.shrink;
      var textAreaNode = inputRef.current;
      if (!textAreaNode) return;
      var textHeight = getTextHeight(textAreaNode);
      var newHeight;

      if (shrink) {
        newHeight = Math.max(minHeight, textHeight);
      } else {
        // Ensure that we don't reduce height below what the user set by manually resizing
        var measuredHeight = initial ? 0 : textAreaNode.getBoundingClientRect().height;
        newHeight = Math.max(minHeight, textHeight, measuredHeight);
      }

      if (_this.state.height !== newHeight) {
        _this.setState({
          height: newHeight
        });
      }
    };

    _this.state = {
      height: null
    };
    _this._getStyle = memoizeOne(getStyle);
    _this._hasUpdated = false;
    return _this;
  }

  _createClass(UIExpandingTextArea, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      // ⚠️ This condition prevents infinite loops! ⚠️
      if (prevState.height === this.state.height) {
        this.setHeight(!this._hasUpdated);
        this._hasUpdated = true;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          __inputWidth = _this$props2.inputWidth,
          __minHeight = _this$props2.minHeight,
          resize = _this$props2.resize,
          __rows = _this$props2.rows,
          shrink = _this$props2.shrink,
          rest = _objectWithoutProperties(_this$props2, ["inputWidth", "minHeight", "resize", "rows", "shrink"]);

      var height = this.state.height;
      return /*#__PURE__*/_jsx(StyledTextArea, Object.assign({}, rest, {
        resize: shrink ? false : resize,
        style: this._getStyle(height),
        height: height
      }));
    }
  }]);

  return UIExpandingTextArea;
}(PureComponent);

UIExpandingTextArea.propTypes = Object.assign({}, omit(UITextArea.propTypes, ['rows']), {
  inputRef: refObject.isRequired,
  maxHeight: PropTypes.number.isRequired,
  minHeight: PropTypes.number.isRequired,
  shrink: PropTypes.bool.isRequired
});
UIExpandingTextArea.defaultProps = Object.assign({}, UITextArea.defaultProps, {
  maxHeight: Infinity,
  minHeight: 0,
  shrink: false
});
UIExpandingTextArea.displayName = 'UIExpandingTextArea';
export default Controllable(ShareInput(MeasureInput(UIExpandingTextArea)));