'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import * as React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import UIMediaObject from '../layout/UIMediaObject';
import UITruncateString from '../text/UITruncateString';
import memoizeOne from 'react-utils/memoizeOne';
import { Consumer as FieldsetContextConsumer } from '../context/FieldsetContext';
import { warnIfFragment } from '../utils/devWarnings';
var LABEL_SIZE_OPTIONS = {
  default: '',
  small: 'private-input-static-label--small'
};

var getStyledLabelWrapper = function getStyledLabelWrapper(Component, className) {
  return styled(Component).attrs({
    className: className
  }).withConfig({
    displayName: "UIInputStaticLabel",
    componentId: "sc-1083521-0"
  })(["max-width:50%;"]);
};

var UIInputStaticLabel = /*#__PURE__*/function (_React$Component) {
  _inherits(UIInputStaticLabel, _React$Component);

  function UIInputStaticLabel(props) {
    var _this;

    _classCallCheck(this, UIInputStaticLabel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIInputStaticLabel).call(this, props));
    _this._getStyledLabelWrapper = memoizeOne(getStyledLabelWrapper);
    return _this;
  }

  _createClass(UIInputStaticLabel, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          _children = _this$props.children,
          className = _this$props.className,
          id = _this$props.id,
          labelWrapperClassName = _this$props.labelWrapperClassName,
          position = _this$props.position,
          text = _this$props.text,
          error = _this$props.error,
          rest = _objectWithoutProperties(_this$props, ["children", "className", "id", "labelWrapperClassName", "position", "text", "error"]);

      return /*#__PURE__*/_jsx(FieldsetContextConsumer, {
        children: function children(_ref) {
          var fieldSize = _ref.size;
          var computedClassName = classNames('private-input-static-label', className, LABEL_SIZE_OPTIONS[fieldSize]);

          var renderedLabel = /*#__PURE__*/_jsx(UITruncateString, {
            useFlex: true,
            className: "private-input-static-label__label",
            children: text
          });

          var cloneProps = {
            id: _children.props.id || id
          }; // avoid "unknown prop" warning when `error` is undefined

          if (error !== undefined) {
            cloneProps.error = error;
          }

          var onlyChild = React.Children.only(_children);
          warnIfFragment(onlyChild, UIInputStaticLabel.displayName);
          return /*#__PURE__*/_jsx("label", Object.assign({}, rest, {
            className: computedClassName,
            children: /*#__PURE__*/_jsx(UIMediaObject, {
              spacing: "extra-small",
              itemLeft: position === 'start' ? renderedLabel : undefined,
              MediaLeft: _this2._getStyledLabelWrapper(UIMediaObject.defaultProps.MediaLeft, labelWrapperClassName),
              itemRight: position === 'end' ? renderedLabel : undefined,
              MediaRight: _this2._getStyledLabelWrapper(UIMediaObject.defaultProps.MediaRight, labelWrapperClassName),
              children: /*#__PURE__*/React.cloneElement(onlyChild, cloneProps)
            })
          }));
        }
      });
    }
  }]);

  return UIInputStaticLabel;
}(React.Component);

UIInputStaticLabel.propTypes = {
  children: PropTypes.element.isRequired,
  labelWrapperClassName: PropTypes.string,
  position: PropTypes.oneOf(['start', 'end']).isRequired,
  text: PropTypes.node.isRequired,
  error: PropTypes.bool
};
UIInputStaticLabel.defaultProps = {
  position: 'start'
};
UIInputStaticLabel.displayName = 'UIInputStaticLabel';
export default UIInputStaticLabel;