import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BaseButton from './button.jsx';
import ShareIcon from '../icons/share-icon.svg';
import Label from './label.jsx';

export default class Share extends Component {
  static propTypes = {
    innerRef: PropTypes.func,
    onClick: PropTypes.func
  };
  render() {
    return (
      <BaseButton
        style={{marginRight: 0}}
        innerRef={this.props.innerRef}
        onClick={this.props.onClick}
      >
        <ShareIcon />
        <Label style={{fontWeight: '600'}}>Share</Label>
      </BaseButton>
    );
  }
}
