import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Star from './star.svg';
import StarActive from './star-active.svg';

export default class StarIcon extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired
  };

  render() {
    return this.props.active ? <StarActive /> : <Star />;
  }
}
