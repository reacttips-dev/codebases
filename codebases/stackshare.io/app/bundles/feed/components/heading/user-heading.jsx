import React, {Component} from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import {Container, Heading, Col} from './shared';

const Avatar = glamorous.img({
  width: 34,
  height: 34,
  borderRadius: '50%'
});

export default class UserHeading extends Component {
  static propTypes = {
    user: PropTypes.object
  };

  render() {
    const {displayName, imageUrl, title, companyName, path} = this.props.user;
    return (
      <Container>
        <a href={path}>
          <Avatar src={imageUrl} alt={`Avatar of ${displayName}`} />
        </a>
        <Col>
          <Heading>
            <a href={path}>{displayName}</a>
          </Heading>
          <div>
            {title} {title && companyName ? 'at' : ''} {companyName}
          </div>
        </Col>
      </Container>
    );
  }
}
