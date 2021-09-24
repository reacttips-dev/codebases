'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Children, Component } from 'react';
import classNames from 'classnames';
import devLogger from 'react-utils/devLogger';
var USE_CLASSES = {
  default: '',
  dark: 'private-tool-bar--dark',
  'filter-bar': 'private-tool-bar--with-filters',
  tabs: 'private-tool-bar--with-tabs'
};

var UIToolBar = /*#__PURE__*/function (_Component) {
  _inherits(UIToolBar, _Component);

  function UIToolBar() {
    _classCallCheck(this, UIToolBar);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIToolBar).apply(this, arguments));
  }

  _createClass(UIToolBar, [{
    key: "render",
    value: function render() {
      // `title` blacklisted here since `UIAbstractPageTemplate` expects one in CustomRenderer
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          __title = _this$props.title,
          use = _this$props.use,
          rest = _objectWithoutProperties(_this$props, ["children", "className", "title", "use"]);

      var childCount = Children.count(children);

      if (process.env.NODE_ENV !== 'production') {
        if (use === 'filter-bar' && childCount > 2) {
          devLogger.warn({
            message: 'UIToolBar: More than 2 UIToolBarGroup items in a filter-bar is not recommended',
            key: 'UIToolBar: too many children for filter-bar'
          });
        }

        if (childCount > 3) {
          devLogger.warn({
            message: 'UIToolBar: More than 3 UIToolBarGroup items are not recommended',
            key: 'UIToolBar: too many children in toolbar'
          });
        }
      }

      return /*#__PURE__*/_jsx("div", Object.assign({}, rest, {
        className: classNames('private-tool-bar', className, USE_CLASSES[use]),
        role: "group",
        children: /*#__PURE__*/_jsx("div", {
          className: "private-tool-bar__inner",
          children: children
        })
      }));
    }
  }]);

  return UIToolBar;
}(Component);

export { UIToolBar as default };
UIToolBar.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  use: PropTypes.oneOf(Object.keys(USE_CLASSES))
};
UIToolBar.displayName = 'UIToolBar';