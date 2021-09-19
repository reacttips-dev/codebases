import { Component } from 'react';
import { createPortal } from 'react-dom';
import ExecutionEnvironment from 'exenv';

// Factory for creating portals that avoid server-client dom mismatch
const PortalFactory = portalRootId => class Portal extends Component {
  static defaultProps = {
    active : true
  };
  constructor(props) {
    super(props);
    if (ExecutionEnvironment.canUseDOM) {
      const root = document.getElementById(portalRootId);
      if (!root) {
        throw new Error('Provided id does not exist in document.');
      }
      this.rootElement = root;
      this.portalTarget = document.createElement('div');
    }
  }
  state = {
    active : false // This flag is to prevent server from expecting the portal content when server-side rendering
  };
  componentDidMount() {
    this.setState({ active : true });
    this.rootElement.appendChild(this.portalTarget);
  }

  componentWillUnmount() {
    this.setState({ active : false });
    this.rootElement.removeChild(this.portalTarget);
  }
  render() {
    const active = this.state.active && this.props.active;
    if (active) {
      return createPortal(this.props.children, this.portalTarget);
    } else {
      return null;
    }
  }
};

export default PortalFactory;
