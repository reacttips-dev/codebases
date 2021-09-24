import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {Container, Heading, ServiceIcon, Classification} from './service-heading-mobile';
import {TARMAC} from '../../../../shared/style/colors';
import {BASE_TEXT} from '../../../../shared/style/typography';

const UserIcon = glamorous(ServiceIcon)({
  borderRadius: '50%'
});

const Position = glamorous.div({
  ...BASE_TEXT,
  color: TARMAC
});

export default class MobileUserHeading extends Component {
  static propTypes = {
    user: PropTypes.object
  };

  render() {
    const {user} = this.props;
    const {title, companyName} = user;
    return (
      <Container>
        <UserIcon src={user.imageUrl} />
        <Heading>{user.displayName}</Heading>
        <Classification>
          <Position>
            {title} {title && companyName ? 'at' : ''} {companyName}
          </Position>
        </Classification>
      </Container>
    );
  }
}
