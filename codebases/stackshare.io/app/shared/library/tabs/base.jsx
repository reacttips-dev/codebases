import {Component} from 'react';
import PropTypes from 'prop-types';

class BaseTabs extends Component {
  static propTypes = {
    stateReducer: PropTypes.func,
    onStateChange: PropTypes.func,
    children: PropTypes.any,
    openIndex: PropTypes.number
  };

  componentDidUpdate({openIndex}) {
    if (openIndex !== this.props.openIndex) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({openIndex: this.props.openIndex === undefined ? 0 : this.props.openIndex});
    }
  }

  static defaultProps = {
    stateReducer: (state, changes) => changes,
    onStateChange: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      openIndex: this.props.openIndex === undefined ? 0 : this.props.openIndex
    };
  }

  getState(state = this.state) {
    return {openIndex: state.openIndex};
  }

  internalSetState(changes, callback = () => {}) {
    let allChanges;
    this.setState(
      state => {
        const actualState = this.getState(state);
        const changesObject = typeof changes === 'function' ? changes(actualState) : changes;
        allChanges = this.props.stateReducer(actualState, changesObject);
        return allChanges;
      },
      () => {
        this.props.onStateChange(allChanges);
        callback();
      }
    );
  }

  handleTabClick = index => {
    this.internalSetState({openIndex: index});
  };

  render() {
    return this.props.children({
      openIndex: this.getState().openIndex,
      handleTabClick: this.handleTabClick
    });
  }
}

export {BaseTabs};
