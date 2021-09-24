import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Motion, spring} from 'react-motion';

function mapRange(val, from, to) {
  return from - val * (from - to);
}

export default class Tween extends Component {
  static propTypes = {
    active: PropTypes.bool,
    children: PropTypes.func,
    onRest: PropTypes.func
  };

  render() {
    const {active, children, onRest} = this.props;
    return (
      <Motion style={{tween: spring(active ? 1 : 0)}} onRest={onRest}>
        {({tween}) => children((from, to) => mapRange(tween, from, to))}
      </Motion>
    );
  }
}
