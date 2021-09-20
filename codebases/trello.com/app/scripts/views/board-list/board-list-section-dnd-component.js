const BoardListSectionComponent = require('./board-list-section-component');
const ReactDnd = require('react-dnd');
const React = require('react');

class BoardListSectionDndComponent extends React.Component {
  render() {
    const { connectDropTarget } = this.props;
    return connectDropTarget(
      <div>
        <BoardListSectionComponent {...this.props} />
      </div>,
    );
  }
}

const spec = { drop() {} };

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
});

module.exports = ReactDnd.DropTarget(
  'BoardTile',
  spec,
  collect,
)(BoardListSectionDndComponent);
