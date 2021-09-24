'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { DRAGDROP_TYPE } from 'crm_components/dialog/propertyListEditor/PropertyListEditorConstants';
import { ENTER } from 'UIComponents/constants/KeyCodes';
import { OptionType } from 'UIComponents/types/OptionTypes';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DnDListWrapper from 'customer-data-ui-utilities/dnd/DnDListWrapper';
import UIMoveableObject from 'UIComponents/draggable/UIMoveableObject';
import UIButton from 'UIComponents/button/UIButton';
import UIColumnWrapper from 'UIComponents/column/UIColumnWrapper';
import UIColumn from 'UIComponents/column/UIColumn';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { BATTLESHIP, CALYPSO } from 'HubStyleTokens/colors';
var HighlightMoveableObject = styled(UIMoveableObject).withConfig({
  displayName: "DnDPreviewItem__HighlightMoveableObject",
  componentId: "sc-1ya9rxe-0"
})(["border-color:", ";transition:", ";"], function (props) {
  return props.isHighlighted ? CALYPSO : BATTLESHIP;
}, function (props) {
  return props.isHighlight ? 'border-color 2000ms ease-in-out' : 'border-color 250ms ease-in-out';
});
var DnDPreviewItem = createReactClass({
  displayName: 'DnDPreviewItem',
  propTypes: {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    onMove: PropTypes.func,
    onRemove: PropTypes.func,
    option: OptionType.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      isHighlighted: false,
      isHovering: false
    };
  },
  handleMouseDown: function handleMouseDown(e) {
    e.stopPropagation();
  },
  handleMouseEnter: function handleMouseEnter() {
    this.setState({
      isHovering: true
    });
  },
  handleMouseLeave: function handleMouseLeave() {
    this.setState({
      isHovering: false
    });
  },
  handleMoveToTop: function handleMoveToTop() {
    var _this = this;

    var _this$props = this.props,
        index = _this$props.index,
        onMove = _this$props.onMove;
    onMove(index, 0);
    this.setState({
      isHighlighted: true
    });
    setTimeout(function () {
      _this.setState({
        isHighlighted: false
      });
    }, 2000);
  },
  handleEnter: function handleEnter(_ref) {
    var keyCode = _ref.keyCode;

    if (keyCode !== ENTER) {
      return;
    }

    if (typeof this.props.onRemove === 'function') this.props.onRemove();
  },
  renderContent: function renderContent() {
    var _this$props2 = this.props,
        option = _this$props2.option,
        onRemove = _this$props2.onRemove,
        onMove = _this$props2.onMove;
    var _this$state = this.state,
        isHighlighted = _this$state.isHighlighted,
        isHovering = _this$state.isHovering;
    var text = option.text || option.value;
    return /*#__PURE__*/_jsx(HighlightMoveableObject, {
      draggable: onMove != null && !option.disabled,
      onClose: onRemove,
      closeable: !(option.readOnly || option.disabled),
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
      isHighlighted: isHighlighted,
      children: /*#__PURE__*/_jsxs(UIColumnWrapper, {
        children: [/*#__PURE__*/_jsx(UIColumn, {
          children: text
        }), isHovering && !option.disabled && /*#__PURE__*/_jsx(UIColumn, {
          children: /*#__PURE__*/_jsx(UIButton, {
            use: "link",
            onClick: this.handleMoveToTop,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "crm_components.PropertyListEditor.moveToTop"
            })
          })
        })]
      })
    });
  },
  render: function render() {
    var _this$props3 = this.props,
        connectDragSource = _this$props3.connectDragSource,
        connectDropTarget = _this$props3.connectDropTarget,
        onMove = _this$props3.onMove,
        option = _this$props3.option;

    if (onMove != null && !option.disabled) {
      return connectDragSource(connectDropTarget( /*#__PURE__*/_jsx("div", {
        children: this.renderContent()
      })));
    }

    return this.renderContent();
  }
});
export default DnDListWrapper(DRAGDROP_TYPE, function (props) {
  return {
    option: props.option
  };
}, {
  isDragging: function isDragging(item, monitor) {
    return item.option === monitor.getItem().data.option;
  }
})(DnDPreviewItem);