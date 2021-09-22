import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

class TopLevelModal extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    isMounted: false,
  };

  componentDidMount() {
    const topModalRoot = document.getElementById('rc-TopLevelModal');

    // This render function should be skipped if the Top Level Modal is already in the DOM
    if (!topModalRoot) {
      this.node = document.createElement('div');
      this.node.setAttribute('id', 'rc-TopLevelModal');
      document.body.appendChild(this.node);
    } else {
      this.node = topModalRoot;
    }
    this.setState({ isMounted: true });
  }

  componentWillUnmount() {
    document.body.removeChild(this.node);
  }

  render() {
    if (this.state.isMounted) {
      return ReactDOM.createPortal(this.props.children, this.node);
    }
    return null;
  }
}

export default TopLevelModal;
