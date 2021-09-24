import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Motion, spring} from 'react-motion';

export default class Slide extends Component {
  static propTypes = {
    onExit: PropTypes.func,
    children: PropTypes.element
  };

  static defaultProps = {
    onExit: null
  };

  state = {
    height: 0,
    opacity: 1
  };

  el = null;

  componentDidMount() {
    const newHeight = this.el.scrollHeight;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({height: newHeight});
  }

  componentDidUpdate(prevProps) {
    if (typeof this.props.onExit === 'function' && prevProps.onExit === null) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({height: 0, opacity: 0});
    } else if (typeof prevProps.onExit === 'function' && this.props.onExit === null) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({height: this.el.scrollHeight, opacity: 1});
    }
  }

  assignRef = el => (this.el = el);

  render() {
    const {children, onExit} = this.props;
    const {opacity, height} = this.state;

    return (
      <Motion
        defaultStyle={{opacity: 1, height: 0}}
        style={{opacity: spring(opacity), height: spring(height)}}
        onRest={onExit}
      >
        {interpolatedStyle => (
          <div
            style={{
              overflow: 'hidden',
              width: '100%',
              opacity: interpolatedStyle.opacity,
              height: interpolatedStyle.height
            }}
            ref={this.assignRef}
          >
            {children}
          </div>
        )}
      </Motion>
    );
  }
}
