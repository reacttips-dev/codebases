import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import animate, {opacity} from '../animation/animate';

export const Z_INDEX = 100001;

const Layout = glamorous.div(
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: Z_INDEX - 1,
    background: 'rgba(1, 1, 1, 0.5)',
    marginBottom: 0,
    opacity: 0
  },
  ({height, opacity}) => ({height, opacity})
);

const Container = glamorous.div({
  marginBottom: 0,
  zIndex: Z_INDEX,
  position: 'relative'
});

export default class Overlay extends Component {
  static propTypes = {
    onDismiss: PropTypes.func,
    dismissOnClick: PropTypes.bool,
    children: PropTypes.func
  };

  state = {
    height: '100%',
    width: 100
  };

  static defaultProps = {
    dismissOnClick: false
  };

  componentDidMount() {
    animate([{element: this.layout, from: 0, to: 1}], 300, opacity);
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      height: document.documentElement.scrollHeight,
      width: this.containerEl.clientWidth
    });
    window.addEventListener('resize', this.handleResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  handleResize = () => {
    this.setState({
      height: document.documentElement.scrollHeight,
      width: this.containerEl.clientWidth
    });
  };

  handleDismiss = () => {
    animate([{element: this.layout, from: 1, to: 0}], 300, opacity);
    this.props.onDismiss();
  };

  render() {
    return (
      <React.Fragment>
        <Layout
          onClick={this.props.dismissOnClick ? this.handleDismiss : null}
          height={this.state.height}
          innerRef={el => (this.layout = el)}
        />
        <Container innerRef={el => (this.containerEl = el)}>
          {this.props.children && this.props.children(this.state, this.handleDismiss)}
        </Container>
      </React.Fragment>
    );
  }
}
