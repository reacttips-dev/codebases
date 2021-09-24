import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import SocialContainer from './social-container';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import ShareIcon from './icons/share-icon.svg';

const Copy = glamorous.div({
  ...BASE_TEXT,
  letterSpacing: '0.2px',
  fontWeight: WEIGHT.BOLD
});

export default class Share extends Component {
  static propTypes = {
    innerRef: PropTypes.func,
    onClick: PropTypes.func
  };
  render() {
    return (
      <SocialContainer
        data-testid="share"
        innerRef={this.props.innerRef}
        onClick={this.props.onClick}
      >
        <ShareIcon />
        <Copy>Share</Copy>
      </SocialContainer>
    );
  }
}
