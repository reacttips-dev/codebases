'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { getComponentPropType } from '../utils/propTypes/componentProp';
import SyntheticEvent from '../core/SyntheticEvent';
import UIFlex from '../layout/UIFlex';
import UITruncateString from '../text/UITruncateString';
import HoverProvider from '../providers/HoverProvider';
import Controllable from '../decorators/Controllable';
import TableSortArrows from './internal/TableSortArrows';
import SortTH_Content from './internal/SortTH_Content';
import SortTH_TH from './internal/SortTH_TH';
import SortTH_TruncateString from './internal/SortTH_TruncateString';
import { alignPropType, preferredSortPropType, sortPropType } from './internal/TablePropTypes';
import refObject from '../utils/propTypes/refObject';

var UISortTH = /*#__PURE__*/function (_Component) {
  _inherits(UISortTH, _Component);

  function UISortTH() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UISortTH);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UISortTH)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleClick = function (evt) {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          onSortChange = _this$props.onSortChange,
          preferredSort = _this$props.preferredSort,
          sort = _this$props.sort;
      if (onClick) onClick(evt);
      if (evt.defaultPrevented) return;
      var newSort = null;

      if (sort === 'ascending') {
        newSort = 'descending';
      } else if (sort === 'descending') {
        newSort = 'ascending';
      } else {
        newSort = preferredSort;
      }

      onSortChange(SyntheticEvent(newSort));
    };

    return _this;
  }

  _createClass(UISortTH, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          align = _this$props2.align,
          Arrows = _this$props2.Arrows,
          _children = _this$props2.children,
          disabled = _this$props2.disabled,
          Content = _this$props2.Content,
          FlexContainer = _this$props2.FlexContainer,
          __onClick = _this$props2.onClick,
          __onSortChange = _this$props2.onSortChange,
          preferredSort = _this$props2.preferredSort,
          sort = _this$props2.sort,
          TH = _this$props2.TH,
          truncate = _this$props2.truncate,
          TruncateString = _this$props2.TruncateString,
          rest = _objectWithoutProperties(_this$props2, ["align", "Arrows", "children", "disabled", "Content", "FlexContainer", "onClick", "onSortChange", "preferredSort", "sort", "TH", "truncate", "TruncateString"]);

      return /*#__PURE__*/_jsx(HoverProvider, Object.assign({}, this.props, {
        children: function children(hoverProviderProps) {
          var hovered = hoverProviderProps.hovered,
              hoverProviderRestProps = _objectWithoutProperties(hoverProviderProps, ["hovered"]);

          var arrowsNode = disabled ? null : /*#__PURE__*/_jsx(Arrows, {
            hovered: hovered,
            preferredSort: preferredSort,
            sort: sort
          });
          return /*#__PURE__*/_jsx(TH, Object.assign({}, rest, {}, hoverProviderRestProps, {
            disabled: disabled,
            hovered: hovered,
            onClick: _this2.handleClick,
            sort: sort,
            children: /*#__PURE__*/_jsx(FlexContainer, {
              children: /*#__PURE__*/_jsx(Content, {
                align: align,
                arrowsNode: arrowsNode,
                children: truncate ? /*#__PURE__*/_jsx(TruncateString, {
                  matchContentWidth: true,
                  children: _children
                }) : _children
              })
            })
          }));
        }
      }));
    }
  }]);

  return UISortTH;
}(Component);

UISortTH.propTypes = {
  align: alignPropType.isRequired,
  Arrows: getComponentPropType(TableSortArrows),

  /*
   * The ref of the underlying `<th>` DOM node.
   */
  buttonRef: refObject,
  Content: getComponentPropType(SortTH_Content),
  FlexContainer: getComponentPropType(UIFlex),
  children: PropTypes.node,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  onSortChange: PropTypes.func.isRequired,
  preferredSort: preferredSortPropType.isRequired,
  sort: sortPropType.isRequired,
  TH: PropTypes.elementType.isRequired,
  truncate: PropTypes.bool.isRequired,
  TruncateString: getComponentPropType(UITruncateString)
};
UISortTH.defaultProps = {
  align: 'left',
  Arrows: TableSortArrows,
  Content: SortTH_Content,
  disabled: false,
  FlexContainer: UIFlex,
  preferredSort: 'descending',
  sort: 'none',
  TH: SortTH_TH,
  truncate: false,
  TruncateString: SortTH_TruncateString
};
UISortTH.displayName = 'UISortTH';
export default Controllable(UISortTH, ['sort']);