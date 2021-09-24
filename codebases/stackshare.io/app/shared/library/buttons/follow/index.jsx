import React, {Component} from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import CheckmarkIcon from './checkmark.svg';
import PlusIcon from './plus.svg';
import SimpleButton from '../base/simple';
import {grid} from '../../../utils/grid';

const Button = glamorous(SimpleButton)({
  flexGrow: 0,
  flexShrink: 0,
  paddingLeft: grid(1),
  paddingRight: grid(1),
  marginRight: 10
});

export default class FollowButton extends Component {
  static propTypes = {
    following: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired
  };

  render() {
    const {following, onToggle} = this.props;
    return (
      <Button data-testid="follow" onClick={onToggle} active={following} width={98}>
        {following ? <CheckmarkIcon /> : <PlusIcon />}&nbsp;{following ? 'Following' : 'Follow'}
      </Button>
    );
  }
}
