import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {grid} from '../../../utils/grid';
import BigTitle from '../../typography/big-title';
import Text from '../../typography/text';
import {WEIGHT} from '../../../style/typography';
import {ASH, SCORE} from '../../../style/colors';
import PopoverWithAnchor from '../base-v2';
import {TOP} from '../../../constants/placements';
import Avatar from '../../avatars/avatar';

const WIDTH = grid(35);

const Container = glamorous.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

const PopoverTitle = glamorous(BigTitle)({
  marginBottom: 0
});

const Middot = glamorous(Text)({
  fontWeight: WEIGHT.BOLD,
  marginLeft: grid(1),
  marginRight: grid(1)
});

const Score = glamorous(Text)({
  fontWeight: WEIGHT.BOLD,
  color: SCORE
});

const Details = glamorous.div({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-around',
  borderTop: `1px solid ${ASH}`,
  marginTop: grid(3),
  paddingTop: grid(2),
  paddingBottom: grid(2)
});

const DetailBox = glamorous(Text)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '& div': {
    marginBottom: 0
  }
});

export default class UserPopover extends Component {
  static propTypes = {
    children: PropTypes.any,
    user: PropTypes.shape({
      displayName: PropTypes.string,
      canonicalUrl: PropTypes.string,
      imageUrl: PropTypes.string,
      title: PropTypes.string,
      popularity: PropTypes.number,
      stacksCount: PropTypes.number,
      favoritesCount: PropTypes.number,
      votesCount: PropTypes.number
    }).isRequired,
    onActivate: PropTypes.func,
    onClick: PropTypes.func
  };

  render() {
    const {children, user, onActivate, onClick} = this.props;
    const {displayName, title, popularity, stacksCount, favoritesCount, votesCount} = user;

    return (
      <PopoverWithAnchor
        width={WIDTH}
        anchor={children}
        placement={TOP}
        hidden={true}
        onActivate={onActivate}
        activateMode="hover"
      >
        <Container>
          <Avatar user={user} onClick={onClick} />
          <PopoverTitle>{displayName}</PopoverTitle>
          <div>
            <Text>{title}</Text>
            {title && <Middot>&middot;</Middot>}
            <Score>{popularity}p</Score>
          </div>
          <Details>
            <DetailBox>
              <BigTitle>{stacksCount}</BigTitle> Stacks
            </DetailBox>
            <DetailBox>
              <BigTitle>{favoritesCount}</BigTitle> Favorites
            </DetailBox>
            <DetailBox>
              <BigTitle>{votesCount}</BigTitle> Votes
            </DetailBox>
          </Details>
        </Container>
      </PopoverWithAnchor>
    );
  }
}
