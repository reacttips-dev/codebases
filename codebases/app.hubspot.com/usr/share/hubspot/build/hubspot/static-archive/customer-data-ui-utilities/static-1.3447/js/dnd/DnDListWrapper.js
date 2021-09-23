'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import compose from 'transmute/compose';
import merge from 'transmute/merge';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import * as DragDirections from './DragDirections';
var ITEM_TARGET = {
  drop: function drop(props, monitor) {
    if (props.onDrop != null) {
      props.onDrop(monitor.getItem(), monitor);
    }
  },
  hover: function hover(props, monitor, component) {
    var clientOffset;
    var dragIndex = monitor.getItem().index;
    var hoverIndex = props.index;
    var listKey = props.listKey;
    var dragDirection = props.dragDirection; // Dragging item from a different container into this one
    // Change the list key to avoid infinite loops

    if (dragIndex === -1 || monitor.getItem().listKey !== listKey) {
      props.onAddOption(monitor.getItem(), hoverIndex, listKey);

      if (typeof props.onRemoveOption === 'function') {
        props.onRemoveOption(monitor.getItem());
      }

      monitor.getItem().index = hoverIndex;
      monitor.getItem().listKey = listKey;
      return;
    } // Don't replace items with themselves


    if (dragIndex === hoverIndex) {
      return;
    } // Determine rectangle on screen
    // eslint-disable-next-line react/no-find-dom-node


    var hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    if (dragDirection === DragDirections.HORIZONTAL) {
      // Get horizontal middle
      var hoverCrossoverPoint = hoverBoundingRect.right - hoverBoundingRect.left; // Determine mouse position

      clientOffset = monitor.getClientOffset(); // Get pixels to the left

      var hoverClientX = clientOffset.x - hoverBoundingRect.left; // When dragging left, only move when the cursor is greater than 90%
      // When dragging right, only move when the cursor is less than 10%
      // Dragging right

      var draggingRight = dragIndex < hoverIndex && hoverClientX < hoverCrossoverPoint * 0.1; // Dragging left

      var draggingLeft = dragIndex > hoverIndex && hoverClientX > hoverCrossoverPoint * 0.9;

      if (draggingLeft || draggingRight) {
        return;
      }
    } else {
      // Get vertical middle
      var hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2; // Determine mouse position

      clientOffset = monitor.getClientOffset(); // Get pixels to the top

      var hoverClientY = clientOffset.y - hoverBoundingRect.top; // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards

      var draggingDown = dragIndex < hoverIndex && hoverClientY < hoverMiddleY; // Dragging upwards

      var draggingUp = dragIndex > hoverIndex && hoverClientY > hoverMiddleY;

      if (draggingDown || draggingUp) {
        return;
      }
    } // Time to actually perform the action


    props.onMove(dragIndex, hoverIndex, monitor.getItem()); // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.

    monitor.getItem().index = hoverIndex;
  }
};

var defaultData = function defaultData() {
  return {};
};

export default function (itemType) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultData;
  var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var itemTypeSource;
  var itemTypeTarget;

  if (typeof itemType === 'object') {
    itemTypeSource = itemType.itemTypeSource;
    itemTypeTarget = itemType.itemTypeTarget;
  } else {
    itemTypeTarget = itemType;
    itemTypeSource = itemType;
  }

  var ITEM_SOURCE = merge(override, {
    beginDrag: function beginDrag(props) {
      return {
        index: props.index,
        originalIndex: props.index,
        listKey: props.listKey,
        data: data(props),
        useCustomDragLayer: props.useCustomDragLayer
      };
    },
    endDrag: function endDrag(props, monitor) {
      var _monitor$getItem = monitor.getItem(),
          originalIndex = _monitor$getItem.originalIndex,
          index = _monitor$getItem.index;

      var didDrop = monitor.didDrop();

      if (!didDrop) {
        props.onMove(index, originalIndex, monitor.getItem());

        if (props.onInvalidDrop != null) {
          props.onInvalidDrop(index, originalIndex, monitor.getItem());
        }
      }
    }
  });
  return function (WrappedComponent) {
    var componentName = WrappedComponent.displayName || WrappedComponent.name;
    var DnDListWrapper = createReactClass({
      displayName: "DnDListWrapper(" + componentName + ")",
      propTypes: {
        index: PropTypes.number.isRequired,
        dragDirection: PropTypes.oneOf(Object.keys(DragDirections))
      },
      getDefaultProps: function getDefaultProps() {
        return {
          dragDirection: DragDirections.VERTICAL
        };
      },
      render: function render() {
        return /*#__PURE__*/_jsx(WrappedComponent, Object.assign({}, this.props));
      }
    });
    return compose(DragSource(itemTypeSource, ITEM_SOURCE, function (connect, monitor) {
      return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        connectDragPreview: connect.dragPreview(),
        itemTypeSource: monitor.internalMonitor.store.getState().dragOperation.itemType
      };
    }), DropTarget(itemTypeTarget, ITEM_TARGET, function (connect, monitor) {
      return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({
          shallow: true
        })
      };
    }))(DnDListWrapper);
  };
}