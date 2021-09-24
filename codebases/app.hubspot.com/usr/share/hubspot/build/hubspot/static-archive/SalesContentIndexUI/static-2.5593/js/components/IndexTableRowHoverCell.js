'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import classNames from 'classnames';
import UITableHoverCell from 'UIComponents/table/UITableHoverCell';
export default createReactClass({
  displayName: "IndexTableRowHoverCell",
  propTypes: {
    className: PropTypes.string,
    content: PropTypes.node.isRequired,
    buttons: PropTypes.node.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      className: ''
    };
  },
  render: function render() {
    var _this$props = this.props,
        className = _this$props.className,
        buttons = _this$props.buttons,
        content = _this$props.content;
    var rowClassName = classNames(className, 'table-row-cell-hover');
    return /*#__PURE__*/_jsx(UITableHoverCell, {
      className: rowClassName,
      hoverContent: buttons,
      tooltip: false,
      children: content
    });
  }
});