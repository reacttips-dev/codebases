'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import * as Operator from 'customer-data-filters/filterQueryFormat/operator/Operator';
import { KOALA, TRANSPARENT_LIGHT } from 'HubStyleTokens/colors';
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import MissingField from 'customer-data-filters/filterQueryFormat/MissingField';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIIconButton from 'UIComponents/button/UIIconButton';
import UITag from 'UIComponents/tag/UITag';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import classNames from 'classnames';
import styled from 'styled-components';
var HoverContent = styled.div.withConfig({
  displayName: "FilterEditorOperator__HoverContent",
  componentId: "slaomp-0"
})(["position:absolute;top:0;padding-left:24px;right:0;height:100%;background-image:linear-gradient( to left,", ",", ",", " );"], KOALA, KOALA, TRANSPARENT_LIGHT);
var HoverRow = styled.div.withConfig({
  displayName: "FilterEditorOperator__HoverRow",
  componentId: "slaomp-1"
})(["position:relative;cursor:pointer;overflow:hidden;&:focus,&:hover{background-color:", ";}"], KOALA);

var FilterEditorOperator = /*#__PURE__*/function (_PureComponent) {
  _inherits(FilterEditorOperator, _PureComponent);

  function FilterEditorOperator() {
    var _this;

    _classCallCheck(this, FilterEditorOperator);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterEditorOperator).call(this));

    _this.handleMouseEnter = function () {
      _this.setState({
        isHoverContentVisible: true
      });
    };

    _this.handleMouseLeave = function () {
      _this.setState({
        isHoverContentVisible: false
      });
    };

    _this.handleMouseMove = function () {
      // See https://git.hubteam.com/HubSpot/UIComponents/issues/3927
      if (_this.state.isHoverContentVisible !== true) {
        _this.setState({
          isHoverContentVisible: true
        });
      }
    };

    _this.state = {
      isHoverContentVisible: false
    };
    return _this;
  }

  _createClass(FilterEditorOperator, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          hoverContentClassName = _this$props.hoverContentClassName,
          isReadOnly = _this$props.isReadOnly,
          isXoEnabled = _this$props.isXoEnabled,
          onEdit = _this$props.onEdit,
          onRemove = _this$props.onRemove,
          operator = _this$props.operator;
      var isHoverContentVisible = this.state.isHoverContentVisible;
      var isMissingField = MissingField.isMissingField(operator.field);
      var isEditable = !isReadOnly && !isMissingField;
      var onClick = isEditable && !isReadOnly ? onEdit : undefined;
      var HoverRowComponent = isReadOnly ? 'div' : HoverRow;
      return /*#__PURE__*/_jsx(UITooltip, {
        disabled: !isMissingField,
        placement: "right",
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "customerDataFilters.FilterEditorOperator." + (isReadOnly ? 'missingFieldTooltipReadOnly' : 'missingFieldTooltip')
        }),
        children: isXoEnabled ? /*#__PURE__*/_jsxs(HoverRowComponent, {
          className: classNames('flex-grow-1 display-block m-x-0 p-all-0', className),
          "data-selenium-info": "" + operator.field.name,
          "data-selenium-test": "FilterEditorOperator-xofilters",
          onClick: onClick,
          onMouseEnter: this.handleMouseEnter,
          onMouseLeave: this.handleMouseLeave,
          onMouseMove: this.handleMouseMove,
          children: [children, !isReadOnly && isHoverContentVisible && /*#__PURE__*/_jsx(HoverContent, {
            className: hoverContentClassName,
            children: /*#__PURE__*/_jsx(UIIconButton, {
              onClick: function onClick(evt) {
                evt.stopPropagation();
                onRemove(evt);
              },
              placement: "right",
              size: "small",
              tooltip: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "customerDataFilters.FilterEditorOperator.deleteTooltip"
              }),
              use: "transparent",
              children: /*#__PURE__*/_jsx(UIIcon, {
                name: "delete"
              })
            })
          })]
        }) : /*#__PURE__*/_jsx(UITag, {
          className: classNames('display-block m-x-0 m-bottom-3 p-y-1', className),
          closeable: !isReadOnly,
          "data-selenium-test": "FilterEditorOperator-filters2",
          multiline: true,
          onCloseClick: onRemove,
          use: !Operator.isValidOperator(operator) ? 'error' : 'default',
          children: /*#__PURE__*/_jsx(UIButton, {
            className: "p-all-1",
            disabled: !isEditable,
            onClick: onClick,
            use: "link",
            children: children
          })
        })
      });
    }
  }]);

  return FilterEditorOperator;
}(PureComponent);

FilterEditorOperator.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hoverContentClassName: PropTypes.string,
  isReadOnly: PropTypes.bool.isRequired,
  isXoEnabled: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  operator: FilterOperatorType.isRequired
};
FilterEditorOperator.defaultProps = {
  isReadOnly: false
};
export default FilterEditorOperator;