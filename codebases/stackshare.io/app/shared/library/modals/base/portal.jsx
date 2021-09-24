import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import animate, {opacity, scaleXY} from '../../animation/animate';

export const isPortalActive = () => Boolean(document.querySelector('[data-portal]'));
export const PortalContext = React.createContext();

const Layout = glamorous.div(
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    zIndex: 1001,
    background: 'rgba(1, 1, 1, 0.5)',
    overflow: 'auto'
  },
  ({position, animateIn}) => ({
    opacity: animateIn ? 0 : 1,
    alignItems: position === 'top' ? 'flex-start' : 'center',
    paddingTop: position === 'top' ? 40 : 0
  })
);

const Modal = glamorous.div();

export default class Portal extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    onDismiss: PropTypes.func,
    position: PropTypes.oneOf(['top', 'center']),
    animateIn: PropTypes.bool,
    preventClickAway: PropTypes.bool
  };

  static defaultProps = {
    position: 'center',
    animateIn: true,
    preventClickAway: false
  };

  state = {
    top: 0
  };

  modal = createRef();
  layout = createRef();

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({top: document.documentElement.scrollTop});
    window.addEventListener('scroll', this.handleScroll, true);
    if (this.props.animateIn) {
      animate([{element: this.layout.current, from: 0, to: 1}], 300, opacity);
      animate([{element: this.modal.current, from: 0.9, to: 1}], 300, scaleXY);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, true);
  }

  // Prevent scrolling by resetting scrollTop to the initial position
  handleScroll = () => {
    if (typeof window.scrollTo === 'function') {
      window.scrollTo(0, this.state.top);
    }
  };

  handleDismiss = () => {
    animate([{element: this.layout.current, from: 1, to: 0}], 300, opacity);
    animate([{element: this.modal.current, from: 1, to: 0.9}], 300, scaleXY, this.props.onDismiss);
  };

  handleLayoutClick = event => {
    if (this.props.preventClickAway) {
      return;
    }
    if (!this.modal.current.contains(event.target)) {
      this.handleDismiss();
    }
  };

  render() {
    const {top} = this.state;
    const {position, children, animateIn} = this.props;

    return (
      <PortalContext.Provider value={this.layout}>
        <Layout
          data-portal
          innerRef={this.layout}
          top={top}
          position={position}
          onClick={this.handleLayoutClick}
          animateIn={animateIn}
        >
          <Modal
            innerRef={this.modal}
            style={{
              marginBottom: 20,
              transform: animateIn ? 'scale(0.9,0.9)' : 'none'
            }}
          >
            {React.cloneElement(children, {
              onDismiss: typeof this.props.onDismiss === 'function' ? this.handleDismiss : null
            })}
          </Modal>
        </Layout>
      </PortalContext.Provider>
    );
  }
}

export function withPortal(ModalComponent) {
  return function ModalWithPortal({onDismiss, preventClickAway, position, ...props}) {
    return ReactDOM.createPortal(
      <Portal onDismiss={onDismiss} position={position} preventClickAway={preventClickAway}>
        <ModalComponent {...props} />
      </Portal>,
      document.body
    );
  };
}
