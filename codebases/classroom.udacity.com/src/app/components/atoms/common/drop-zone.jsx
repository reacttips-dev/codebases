import PropTypes from 'prop-types';
import keycode from 'keycode';
import styles from './drop-zone.scss';

class DropZone extends React.Component {
  static propTypes = {
    itemLimit: PropTypes.number,
    items: PropTypes.array,
    onDragLeave: PropTypes.func,
    onDragEnter: PropTypes.func,
    onDrop: PropTypes.func,
    resetItem: PropTypes.func,
    tabIndex: PropTypes.number,
    type: PropTypes.string,
  };

  static defaultProps = {
    itemLimit: null,
    items: [],
    onDragEnter: _.noop,
    onDragLeave: _.noop,
    onDragOver: _.noop,
    onDrop: _.noop,
    resetItem: _.noop,
    tabIndex: 0,
  };

  state = {
    answerLabel: '',
  };

  componentWillMount() {
    this.lastEntered = null;
    const answerLabel = this.getAnswerLabel();
    this.setState({ answerLabel });
  }

  getAnswerLabel = () => {
    const { items } = this.props;
    return _.get(items, '[0].text', '');
  };

  handleDragEnter = (evt) => {
    evt.preventDefault();
    this.lastEntered = evt.target;
    this.props.onDragEnter();
  };

  // For Drag and Drop functionality to work, the droppable element _must_ have
  // an onDragOver listener and an onDrop listener.
  // The onDragOver listener should _not_ run any code since this function is
  // called every few hundred milliseconds.
  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#Define_a_drop_zone
  handleDragOver = (evt) => {
    evt.preventDefault();
  };

  // After the initial dragEnter event, the parent dragLeave is fired every time
  // it hovers over parent child components.
  // Fire dragLeave functionality only if the node being left
  // is the original parent instead of child elements.
  // http://stackoverflow.com/questions/10867506/dragleave-of-parent-element-fires-when-dragging-over-children-elements
  handleDragLeave = (evt) => {
    if (this.lastEntered === evt.target) {
      evt.preventDefault();
      this.props.onDragLeave();
    }
  };

  handleKeyPress = (evt) => {
    if (keycode(evt) === 'enter') {
      this.handleDrop();
    }
  };

  handleDrop = (evt) => {
    const { itemLimit, items, type, resetItem } = this.props;
    let validDropType = true,
      answerLabel;

    if (evt) {
      evt.preventDefault();
      validDropType = evt.dataTransfer.getData('text') === type;
      answerLabel = evt.dataTransfer.getData('label');
      this.setState({ answerLabel });

      if (!validDropType) {
        return;
      }
    }

    if (itemLimit && itemLimit === items.length) {
      resetItem(_.last(items));
    }

    this.props.onDrop();
  };

  render() {
    const { tabIndex, accessibilityContext } = this.props;
    const { answerLabel } = this.state;

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        aria-label={
          answerLabel
            ? `${accessibilityContext} - currently ${answerLabel}`
            : accessibilityContext
        }
        aria-dropeffect="move"
        role="listbox"
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        onKeyDown={this.handleKeyPress}
        styleName="drop-zone"
        tabIndex={tabIndex}
      >
        {this.props.children}
      </div>
    );
  }
}

export default cssModule(DropZone, styles);
