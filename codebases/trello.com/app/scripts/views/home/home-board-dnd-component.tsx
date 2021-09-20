import React from 'react';
import * as ReactDnd from 'react-dnd';
import ReactDOM from '@trello/react-dom-wrapper';
import { BoardTile, BoardTileProps, Tile } from './presentational/tile';

interface HomeBoardDnDComponentProps extends BoardTileProps {
  id: string;
  isDraggable: boolean;
  connectDropTarget: ReactDnd.ConnectDropTarget;
  connectDragSource: ReactDnd.ConnectDragSource;
  isDragging: boolean;
  onDragEnd: () => void;
  onDragHover: (id?: string) => void;
}

const _HomeBoardDndComponent: React.FunctionComponent<HomeBoardDnDComponentProps> = (
  props,
) => {
  const { connectDropTarget, connectDragSource, isDragging } = props;

  if (isDragging) {
    return <Tile />;
  } else {
    const newProps = {
      ...props,
      ref(instance: BoardTile) {
        connectDropTarget(ReactDOM.findDOMNode(instance) as Element);
        return connectDragSource(ReactDOM.findDOMNode(instance) as Element);
      },
    };
    return <BoardTile {...newProps} />;
  }
};

const dropSpec = {
  canDrop() {
    return false;
  },
  hover(
    props: HomeBoardDnDComponentProps,
    monitor: ReactDnd.DropTargetMonitor<HomeBoardDnDComponentProps>,
  ) {
    if (props.id !== monitor.getItem().id) {
      return props.onDragHover(monitor.getItem().id);
    }
  },
};

const dropCollect = (
  connect: ReactDnd.DropTargetConnector,
  monitor: ReactDnd.DropTargetMonitor,
) => ({
  connectDropTarget: connect.dropTarget(),
});

const dragSpec = {
  beginDrag(props: HomeBoardDnDComponentProps) {
    return { id: props.id };
  },
  endDrag(props: HomeBoardDnDComponentProps) {
    return props.onDragEnd();
  },
};

const dragCollect = (
  connect: ReactDnd.DragSourceConnector,
  monitor: ReactDnd.DragSourceMonitor,
) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

// eslint-disable-next-line @trello/no-module-logic
export const HomeBoardDndComponent = ReactDnd.DragSource(
  'HomeBoardTile',
  dragSpec,
  dragCollect,
)(
  // eslint-disable-next-line @trello/no-module-logic
  ReactDnd.DropTarget(
    'HomeBoardTile',
    dropSpec,
    dropCollect,
  )(_HomeBoardDndComponent),
);
