import PropTypes from 'prop-types';
import keycode from 'keycode';
import styles from './drag-item.scss';

class DragItem extends React.Component {
  static propTypes = {
    dragImageStyles: PropTypes.object,
    onDragEnd: PropTypes.func,
    onDragStart: PropTypes.func,
    shadowStyles: PropTypes.object,
    tabIndex: PropTypes.number,
  };

  static defaultProps = {
    dragImageStyles: {},
    onDragEnd: _.noop,
    onDragStart: _.noop,
    renderItem: _.noop,
    shadowStyles: null,
    tabIndex: null,
  };

  state = {
    grabbed: false,
  };

  componentWillMount() {
    this.shadowNode = null;
  }

  componentWillUnmount() {
    if (this.shadowNode) {
      this.shadowNode.remove();
    }
  }

  setDragImage(e) {
    let dragImageNode = e.target.cloneNode(true);
    _.each(
      this.props.dragImageStyles,
      (value, style) => (dragImageNode.style[style] = value)
    );
    this.shadowNode = dragImageNode;
    document.body.appendChild(dragImageNode);
    // IE/IOS Safari browsers does not support setDragImage
    if (_.isFunction(e.dataTransfer.setDragImage)) {
      e.dataTransfer.setDragImage(dragImageNode, 25, 20);
    }
  }

  handleDragStart = (e) => {
    const { onDragStart, type, text } = this.props;
    if (e) {
      e.dataTransfer.setData('text', type);
      e.dataTransfer.setData('label', text);
      this.setDragImage(e);
    }

    onDragStart();
  };

  handleDragEnd = (evt) => {
    if (evt) {
      evt.preventDefault();
      if (this.shadowNode) {
        this.shadowNode.remove();
      }
    }

    this.props.onDragEnd();
  };

  handleKeyPress = (evt) => {
    const { onDragItemClick } = this.props;
    const keyPressed = keycode(evt);
    this.setState({ grabbed: true });

    switch (keyPressed) {
      case 'enter':
      case 'space':
        onDragItemClick(true);
        return this.handleDragStart();
      case 'esc':
        return this.handleDragEnd();
    }
  };

  render() {
    const {
      tabIndex,
      shadowStyles,
      onDragItemClick,
      onDragEnd,
      position,
      text,
    } = this.props;

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        aria-label={`Answer ${position || ''}, ${text}.`}
        role="button"
        draggable
        onDragEnd={this.handleDragEnd}
        onDragStart={this.handleDragStart}
        onKeyDown={this.handleKeyPress}
        onMouseDown={() => onDragItemClick(true)}
        onMouseUp={onDragEnd}
        style={shadowStyles}
        styleName="drag-item"
        tabIndex={tabIndex}
      >
        {this.props.children}
      </div>
    );
  }
}

export default cssModule(DragItem, styles);
