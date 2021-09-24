import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {formatCount} from '../../../../utils/format';
import StacksIcon from '../../../../../shared/library/icons/nav/stack.svg';
import Followers from '../../../../../shared/library/icons/nav/followers.svg';
import VotesIcon from '../../../../../shared/library/icons/nav/pros.svg';
import {CHARCOAL} from '../../../../style/colors';
import {BASE_TEXT, WEIGHT} from '../../../../style/typography';

const Stats = glamorous.div({
  display: 'flex',
  alignItems: 'center'
});

const Row = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  marginRight: 28
});

const Icon = glamorous.div({
  height: 23,
  width: 23
});

const FollowersIcon = glamorous(Followers)({
  position: 'relative',
  top: 3
});

const Count = glamorous.div({
  ...BASE_TEXT,
  fontWeight: WEIGHT.BOLD,
  fonstSize: 15,
  color: CHARCOAL,
  marginLeft: 5
});

const AlternativesStatsCard = ({followers, stacks, votes}) => (
  <Stats>
    {stacks >= 0 && (
      <Row>
        <Icon>
          <StacksIcon />
        </Icon>
        <Count>{formatCount(stacks)}</Count>
      </Row>
    )}
    {followers >= 0 && (
      <Row>
        <Icon>
          <FollowersIcon />
        </Icon>
        <Count>{formatCount(followers)}</Count>
      </Row>
    )}
    {votes >= 0 && (
      <Row>
        <Icon>
          <VotesIcon />
        </Icon>
        <Count>{formatCount(votes)}</Count>
      </Row>
    )}
  </Stats>
);

AlternativesStatsCard.propTypes = {
  followers: PropTypes.number,
  stacks: PropTypes.number.isRequired,
  votes: PropTypes.number
};

export default AlternativesStatsCard;
