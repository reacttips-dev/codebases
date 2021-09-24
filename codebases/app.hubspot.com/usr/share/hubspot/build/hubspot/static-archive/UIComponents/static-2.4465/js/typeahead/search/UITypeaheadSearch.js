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
import ShareInput from '../../decorators/ShareInput';
import UISearchInput from '../../input/UISearchInput';

var UITypeaheadSearch = /*#__PURE__*/function (_PureComponent) {
  _inherits(UITypeaheadSearch, _PureComponent);

  function UITypeaheadSearch() {
    _classCallCheck(this, UITypeaheadSearch);

    return _possibleConstructorReturn(this, _getPrototypeOf(UITypeaheadSearch).apply(this, arguments));
  }

  _createClass(UITypeaheadSearch, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          ariaControls = _this$props['aria-controls'],
          className = _this$props.className,
          Input = _this$props.Input,
          style = _this$props.style,
          rest = _objectWithoutProperties(_this$props, ["aria-controls", "className", "Input", "style"]);

      return /*#__PURE__*/_jsx("div", {
        className: classNames('private-search-control__wrapper', className),
        style: style,
        children: /*#__PURE__*/_jsx(Input, Object.assign({
          "aria-autocomplete": "list",
          "aria-controls": ariaControls
        }, rest))
      });
    }
  }]);

  return UITypeaheadSearch;
}(PureComponent);

UITypeaheadSearch.propTypes = {
  'aria-controls': PropTypes.string,
  Input: PropTypes.elementType.isRequired
};
UITypeaheadSearch.defaultProps = {
  autoComplete: 'off',
  Input: UISearchInput
};
UITypeaheadSearch.displayName = 'UITypeaheadSearch';
export default ShareInput(UITypeaheadSearch);