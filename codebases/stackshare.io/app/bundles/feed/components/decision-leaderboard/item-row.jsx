import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {TYPE_USER, TYPE_COMPANY, TYPE_SERVICE} from './index';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import {
  MAKO,
  TARMAC,
  CONCRETE,
  CHARCOAL,
  FOCUS_BLUE,
  ALABASTER
} from '../../../../shared/style/colors';

const Row = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: 40
});

const Rank = glamorous.div({
  ...BASE_TEXT,
  fontSize: 14,
  color: TARMAC,
  width: 15
});

const Details = glamorous.div({
  ...BASE_TEXT,
  fontSize: 14,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
});

const Name = glamorous.div({
  ...BASE_TEXT,
  marginLeft: 10,
  color: CHARCOAL,
  textDecoration: 'none',
  ':hover': {
    color: FOCUS_BLUE
  }
});

const Count = glamorous.div({
  ...BASE_TEXT,
  color: MAKO,
  fontSize: 14,
  fontWeight: WEIGHT.BOLD,
  marginLeft: 'auto'
});

const Logo = glamorous.img({
  height: 18,
  width: 18
});

const LogoWrapper = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 1,
  height: 24,
  width: 24,
  border: `1px solid ${CONCRETE}`
});

const UserLogoWrapper = glamorous.div({
  height: 24,
  width: 24
});

const UserLogo = glamorous.img({
  height: 24,
  width: 24,
  borderRadius: '50%'
});

const Trophy = glamorous.div({
  marginLeft: 6
});

const Content = glamorous.a({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: 10,
  paddingRight: 14,
  width: '100%',
  height: 40,
  ':hover': {
    backgroundColor: ALABASTER
  }
});

export class ItemRow extends Component {
  static propTypes = {
    item: PropTypes.object,
    type: PropTypes.string
  };

  renderLogo(name) {
    const {item, type} = this.props;
    if (type === TYPE_USER) {
      return (
        <UserLogoWrapper>
          <UserLogo src={item.imageUrl} alt={name} />
        </UserLogoWrapper>
      );
    } else {
      return (
        <LogoWrapper>
          <Logo src={item.imageUrl} alt={name} />
        </LogoWrapper>
      );
    }
  }

  pathForItem() {
    const {item, type} = this.props;
    switch (type) {
      case TYPE_USER:
        return `/${item.username}/decisions`;
      case TYPE_COMPANY:
        return `/company/${item.slug}/decisions`;
      case TYPE_SERVICE:
        return `/tool/${item.slug}/decisions`;
    }
  }

  render() {
    const {item, type} = this.props;
    const name = type === TYPE_USER ? item.displayName : item.name;
    const path = this.pathForItem();
    return (
      <Row>
        <Rank>{`${item.rank}.`}</Rank>
        <Content href={path}>
          <Details>
            {this.renderLogo(name)}
            <Name>{name}</Name>
            {item.rank === 1 && <Trophy>🏆</Trophy>}
          </Details>
          <Count>{item.decisionsCount}</Count>
        </Content>
      </Row>
    );
  }
}
