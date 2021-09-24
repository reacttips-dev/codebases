'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import { POPOVER_TRANSITION_TIMING } from 'HubStyleTokens/times';
import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';
import UIMedia from '../layout/UIMedia';
import UIMediaBody from '../layout/UIMediaBody';
import UIMediaRight from '../layout/UIMediaRight';
import UITruncateString from '../text/UITruncateString';
import UITableHoverContent from './UITableHoverContent';
var POPOVER_TRANSITION_DELAY = parseInt(POPOVER_TRANSITION_TIMING, 10);
var StyledMedia = styled(UIMedia).withConfig({
  displayName: "UITableHoverCell__StyledMedia",
  componentId: "sc-5b6gyt-0"
})(["height:100%;"]);

var UITableHoverCell = /*#__PURE__*/function (_Component) {
  _inherits(UITableHoverCell, _Component);

  function UITableHoverCell(props) {
    var _this;

    _classCallCheck(this, UITableHoverCell);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UITableHoverCell).call(this, props));

    _this.handleHoverContentOpenChange = function (evt) {
      var rowIsHovered = evt.target.value;

      if (!rowIsHovered !== _this.state.hoverContentIsClosing) {
        // Remove hover content's left margin while closing (#2412)
        _this.setState({
          hoverContentIsClosing: !rowIsHovered
        });
      }

      _this.setState({
        rowIsHovered: rowIsHovered
      });

      if (rowIsHovered) {
        clearTimeout(_this._hideTimeout);

        _this.setState({
          hoverContentIsClosed: false
        });
      } else {
        _this._hideTimeout = setTimeout(function () {
          _this.setState({
            hoverContentIsClosed: true
          });
        }, POPOVER_TRANSITION_DELAY);
      }
    };

    _this.handleTooltipOpenChange = function (evt) {
      _this.setState({
        tooltipIsOpen: !!evt.target.value
      });
    };

    var hoverContentProps = props.hoverContentProps;

    var _rowIsHovered = hoverContentProps ? !!hoverContentProps.open : false;

    _this.state = {
      rowIsHovered: _rowIsHovered,
      hoverContentIsClosed: !_rowIsHovered,
      hoverContentIsClosing: false,
      tooltipIsOpen: false
    };
    return _this;
  }

  _createClass(UITableHoverCell, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearTimeout(this._hideTimeout);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          hoverContent = _this$props.hoverContent,
          hoverContentProps = _this$props.hoverContentProps,
          tooltip = _this$props.tooltip,
          truncateStringProps = _this$props.truncateStringProps,
          rest = _objectWithoutProperties(_this$props, ["children", "hoverContent", "hoverContentProps", "tooltip", "truncateStringProps"]),
          _this$state = this.state,
          hoverContentIsClosed = _this$state.hoverContentIsClosed,
          hoverContentIsClosing = _this$state.hoverContentIsClosing,
          rowIsHovered = _this$state.rowIsHovered,
          tooltipIsOpen = _this$state.tooltipIsOpen;

      var open = hoverContentProps && hoverContentProps.open || rowIsHovered || tooltipIsOpen;
      return /*#__PURE__*/_jsx("td", Object.assign({}, rest, {
        children: /*#__PURE__*/_jsxs(StyledMedia, {
          align: "center",
          children: [/*#__PURE__*/_jsx(UIMediaBody, {
            children: /*#__PURE__*/_jsx(UITruncateString, Object.assign({
              open: tooltipIsOpen
            }, truncateStringProps, {
              "data-content-hovered": rowIsHovered,
              tooltip: tooltip,
              onOpenChange: this.handleTooltipOpenChange,
              children: children
            }))
          }), hoverContent && /*#__PURE__*/_jsx(UIMediaRight, {
            className: classNames(!open && [hoverContentIsClosing && 'm-left-0', hoverContentIsClosed && 'sr-only']),
            children: /*#__PURE__*/_jsx(UITableHoverContent, Object.assign({
              open: open,
              onOpenChange: this.handleHoverContentOpenChange,
              shrinkOnHide: true
            }, hoverContentProps, {
              children: hoverContent
            }))
          })]
        })
      }));
    }
  }]);

  return UITableHoverCell;
}(Component);

export { UITableHoverCell as default };
UITableHoverCell.propTypes = {
  children: PropTypes.node.isRequired,
  hoverContent: PropTypes.node,
  tooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.node, PropTypes.string]).isRequired,
  hoverContentProps: PropTypes.object,
  truncateStringProps: PropTypes.object
};
UITableHoverCell.defaultProps = {
  tooltip: true
};
UITableHoverCell.displayName = 'UITableHoverCell';