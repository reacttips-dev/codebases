'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { createElement as _createElement } from "react";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { CALYPSO, GREAT_WHITE } from 'HubStyleTokens/colors';
import { DragSource, DropTarget } from 'react-dnd';
import { Component, cloneElement } from 'react';
import UIDragHandle from 'UIComponents/draggable/UIDragHandle';
import UIDragHandleHoverContainer from 'UIComponents/draggable/UIDragHandleHoverContainer';
import compose from 'transmute/compose';
import emptyFunction from 'react-utils/emptyFunction';
import get from 'transmute/get';

var ThDragDrop = /*#__PURE__*/function (_Component) {
  _inherits(ThDragDrop, _Component);

  function ThDragDrop(props) {
    var _this;

    _classCallCheck(this, ThDragDrop);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ThDragDrop).call(this, props));
    _this.renderContent = _this.renderContent.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ThDragDrop, [{
    key: "renderContent",
    value: function renderContent(args) {
      var arrowsNode = args.arrowsNode,
          children = args.children;
      var _this$props = this.props,
          ResizeAffordance = _this$props.ResizeAffordance,
          connectDragPreview = _this$props.connectDragPreview,
          connectDragSource = _this$props.connectDragSource,
          connectDropTarget = _this$props.connectDropTarget,
          isDragging = _this$props.isDragging,
          isOverToTheLeft = _this$props.isOverToTheLeft,
          isOverToTheRight = _this$props.isOverToTheRight;
      return connectDropTarget(connectDragPreview( /*#__PURE__*/_jsxs("div", {
        className: "truncate-text",
        style: {
          alignContent: 'center',
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'space-between',
          height: '100%',
          opacity: isDragging ? 0.5 : 1,
          background: isDragging ? GREAT_WHITE : undefined,
          border: "0 solid " + CALYPSO,
          borderLeftWidth: isOverToTheLeft ? '2px' : 0,
          borderRightWidth: isOverToTheRight ? '2px' : 0
        },
        children: [connectDragSource( /*#__PURE__*/_jsx("div", {
          style: {
            display: 'flex',
            paddingLeft: '1em'
          },
          children: /*#__PURE__*/_jsx(UIDragHandle, {})
        })), /*#__PURE__*/_jsxs("div", {
          className: "truncate-text",
          style: {
            alignContent: 'center',
            display: 'flex',
            flexDirection: 'row',
            flexGrow: 1,
            padding: '14px 24px 12px 12px'
          },
          children: [/*#__PURE__*/cloneElement(children, {
            className: 'truncate-text'
          }), arrowsNode]
        }), ResizeAffordance]
      })));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          __ResizeAffordance = _this$props2.ResizeAffordance,
          StyledUISortTH = _this$props2.StyledUISortTH,
          __children = _this$props2.children,
          __connectDragPreview = _this$props2.connectDragPreview,
          __connectDragSource = _this$props2.connectDragSource,
          __connectDropTarget = _this$props2.connectDropTarget,
          content = _this$props2.content,
          __dispatcher = _this$props2.dispatcher,
          __dragSourceItem = _this$props2.dragSourceItem,
          id = _this$props2.id,
          __isDragging = _this$props2.isDragging,
          __isOverToTheLeft = _this$props2.isOverToTheLeft,
          __isOverToTheRight = _this$props2.isOverToTheRight,
          isSortable = _this$props2.isSortable,
          __onColumnReorder = _this$props2.onColumnReorder,
          __resizable = _this$props2.resizable,
          sort = _this$props2.sort,
          __sortDirection = _this$props2.sortDirection,
          __sortKey = _this$props2.sortKey,
          __sortable = _this$props2.sortable,
          onClick = _this$props2.onClick,
          rest = _objectWithoutProperties(_this$props2, ["ResizeAffordance", "StyledUISortTH", "children", "connectDragPreview", "connectDragSource", "connectDropTarget", "content", "dispatcher", "dragSourceItem", "id", "isDragging", "isOverToTheLeft", "isOverToTheRight", "isSortable", "onColumnReorder", "resizable", "sort", "sortDirection", "sortKey", "sortable", "onClick"]);

      return /*#__PURE__*/_jsx(UIDragHandleHoverContainer, {
        children: /*#__PURE__*/_createElement(StyledUISortTH, Object.assign({}, rest, {
          Content: this.renderContent,
          disabled: !isSortable,
          id: id,
          key: id,
          onClick: onClick,
          role: "columnheader",
          sort: sort
        }), content)
      });
    }
  }]);

  return ThDragDrop;
}(Component);

var dragSpec = {
  beginDrag: function beginDrag(props) {
    return {
      id: props.id
    };
  },
  endDrag: function endDrag(props, monitor) {
    var id = props.id,
        _props$onColumnReorde = props.onColumnReorder,
        onColumnReorder = _props$onColumnReorde === void 0 ? emptyFunction : _props$onColumnReorde;

    if (monitor.didDrop()) {
      var targetId = monitor.getDropResult().id;
      onColumnReorder(id, targetId);
    }
  }
};

var dragCollect = function dragCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
};

var dropSpec = {
  drop: function drop(props) {
    return {
      id: props.id
    };
  }
};

var dropCollect = function dropCollect(connect, monitor) {
  var isOver = monitor.isOver();
  var connectDropTarget = connect.dropTarget();

  if (!isOver) {
    return {
      connectDropTarget: connectDropTarget,
      isOverToTheLeft: false,
      isOverToTheRight: false
    };
  }

  var deltaX = monitor.getInitialClientOffset().x - monitor.getClientOffset().x;
  return {
    connectDropTarget: connectDropTarget,
    dragSourceItem: get('id', monitor.getItem()),
    isOverToTheLeft: deltaX > 0,
    isOverToTheRight: deltaX < 0
  };
};

export default compose(DragSource('column', dragSpec, dragCollect), DropTarget('column', dropSpec, dropCollect))(ThDragDrop);