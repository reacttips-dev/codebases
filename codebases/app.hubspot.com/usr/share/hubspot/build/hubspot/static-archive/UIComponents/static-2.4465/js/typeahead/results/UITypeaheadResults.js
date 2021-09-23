'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

var UITypeaheadResults = /*#__PURE__*/function (_PureComponent) {
  _inherits(UITypeaheadResults, _PureComponent);

  function UITypeaheadResults() {
    _classCallCheck(this, UITypeaheadResults);

    return _possibleConstructorReturn(this, _getPrototypeOf(UITypeaheadResults).apply(this, arguments));
  }

  _createClass(UITypeaheadResults, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          onScroll = _this$props.onScroll,
          rest = _objectWithoutProperties(_this$props, ["children", "className", "onScroll"]);

      return /*#__PURE__*/_jsx("ul", Object.assign({}, rest, {
        className: classNames('private-typeahead-results', className),
        onScroll: onScroll,
        role: "listbox",
        children: children
      }));
    }
  }]);

  return UITypeaheadResults;
}(PureComponent);

export { UITypeaheadResults as default };
UITypeaheadResults.propTypes = {
  children: PropTypes.node,
  onScroll: PropTypes.func
};
UITypeaheadResults.displayName = 'UITypeaheadResults';