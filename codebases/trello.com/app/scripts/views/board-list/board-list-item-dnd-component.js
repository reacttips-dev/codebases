// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const BoardListItemComponent = require('./board-list-item-component');
const React = require('react');
const ReactDnd = require('react-dnd');
const ReactDOM = require('@trello/react-dom-wrapper');
const recup = require('recup');
const xtend = require('xtend');
const {
  workspaceNavigationState,
  workspaceNavigationHiddenState,
} = require('app/src/components/WorkspaceNavigation');

class BoardListItemDndComponent extends React.Component {
  static initClass() {
    this.prototype.displayName = 'BoardListItemDndComponent';
  }

  constructor(props) {
    super(props);

    this.state = {
      workspaceNavigationExpanded:
        workspaceNavigationState.value.enabled &&
        !workspaceNavigationHiddenState.value.hidden &&
        workspaceNavigationState.value.expanded,
    };
  }

  componentDidMount() {
    const updateWorkspaceNavigationExpanded = () => {
      this.setState({
        workspaceNavigationExpanded:
          workspaceNavigationState.value.enabled &&
          !workspaceNavigationHiddenState.value.hidden &&
          workspaceNavigationState.value.expanded,
      });
    };
    this.unsubscribeFromWorkspaceNavigationState = workspaceNavigationState.subscribe(
      updateWorkspaceNavigationExpanded,
    );
    this.unsubscribeFromWorkspaceNavigationHiddenState = workspaceNavigationHiddenState.subscribe(
      updateWorkspaceNavigationExpanded,
    );
  }

  componentWillUnmount() {
    this.unsubscribeFromWorkspaceNavigationState();
    this.unsubscribeFromWorkspaceNavigationHiddenState();
  }

  render() {
    const { connectDropTarget, connectDragSource, isDragging } = this.props;
    const { workspaceNavigationExpanded } = this.state;
    if (isDragging) {
      return recup.render(() =>
        recup.li(
          `.boards-page-board-section-list-item${
            workspaceNavigationExpanded
              ? '.boards-page-board-section-list-item--workspace-nav-expanded'
              : ''
          }`,
        ),
      );
    } else {
      const newProps = xtend(this.props, {
        ref(instance) {
          connectDropTarget(ReactDOM.findDOMNode(instance));
          return connectDragSource(ReactDOM.findDOMNode(instance));
        },
      });
      return <BoardListItemComponent {...newProps} />;
    }
  }
}

BoardListItemDndComponent.initClass();

const dropSpec = {
  canDrop() {
    return false;
  },
  hover(props, monitor) {
    if (props.id !== monitor.getItem().id) {
      return props.onDragHover(monitor.getItem().id);
    }
  },
};

const dropCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
});

const dragSpec = {
  beginDrag(props) {
    return { id: props.id };
  },
  endDrag(props) {
    return props.onDragEnd();
  },
};

const dragCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

module.exports = ReactDnd.DragSource(
  'BoardTile',
  dragSpec,
  dragCollect,
)(
  ReactDnd.DropTarget(
    'BoardTile',
    dropSpec,
    dropCollect,
  )(BoardListItemDndComponent),
);
