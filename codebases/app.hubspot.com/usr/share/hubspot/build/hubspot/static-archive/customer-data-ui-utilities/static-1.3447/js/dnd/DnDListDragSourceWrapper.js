'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import { DragSource } from 'react-dnd';

var defaultData = function defaultData() {
  return {};
};

export default function (itemType, data) {
  if (data == null) {
    data = defaultData;
  }

  var ITEM_SOURCE = {
    beginDrag: function beginDrag(props) {
      return {
        index: props.index || -1,
        originalIndex: props.index,
        data: data(props)
      };
    },
    endDrag: function endDrag(props, monitor) {
      var didDrop = monitor.didDrop();

      if (didDrop) {
        props.onDrop();
      } else {
        props.onReset();
      }
    }
  };
  return function (WrappedComponent) {
    // eslint-disable-next-line react/prefer-stateless-function
    var DnDListDragSourceWrapper = createReactClass({
      displayName: "DnDListDragSourceWrapper(" + WrappedComponent.displayName + ")",
      render: function render() {
        return /*#__PURE__*/_jsx(WrappedComponent, Object.assign({}, this.props));
      }
    });
    return DragSource(itemType, ITEM_SOURCE, function (connect, monitor) {
      return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        connectDragPreview: connect.dragPreview()
      };
    })(DnDListDragSourceWrapper);
  };
}