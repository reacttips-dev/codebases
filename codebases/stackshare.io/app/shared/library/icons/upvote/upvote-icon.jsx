import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Upvote from './upvote.svg';
import UpvoteActive from './upvote-active.svg';

const margin = {marginTop: 3, marginBottom: 3};

export default class UpvoteIcon extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired
  };

  render() {
    return this.props.active ? <UpvoteActive style={margin} /> : <Upvote style={margin} />;
  }
}
