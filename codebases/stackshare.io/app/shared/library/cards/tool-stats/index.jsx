import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import * as glamor from 'glamor';
import glamorous from 'glamorous';
import {formatCount} from '../../../../shared/utils/format';
import {ASH, CHARCOAL, TARMAC, GOSSAMER} from '../../../../shared/style/colors';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import {PHONE} from '../../../style/breakpoints';

const animateOpacity = glamor.css.keyframes({
  '0%, 100%': {opacity: 0},
  '50%': {opacity: 1}
});

const Stats = glamorous.div({
  display: 'flex',
  width: '80%',
  justifyContent: 'space-between',
  alignItems: 'center',
  order: 4,
  [PHONE]: {
    marginBottom: 20
  }
});

const Stat = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  color: TARMAC,
  '>:first-child': {
    marginBottom: 5
  },
  ...BASE_TEXT,
  '>span': {
    color: CHARCOAL,
    lineHeight: 1.22,
    letterSpacing: 0.8,
    fontWeight: WEIGHT.BOLD,
    fontSize: 18
  }
});

const Followers = glamorous(Stat)(
  {
    transition: 'color 0.6s ease-in-out',
    ' div': {
      position: 'absolute',
      top: -15,
      right: 0,
      left: 0,
      textAlign: 'center',
      ...BASE_TEXT,
      fontWeight: WEIGHT.BOLD,
      color: GOSSAMER,
      opacity: 0
    }
  },
  ({animateFollowStat}) => ({
    ' div': {
      animation: animateFollowStat ? `${animateOpacity} 2s ease-in-out` : 'none'
    }
  })
);

const Separator = glamorous.div({
  borderLeft: `1px solid ${ASH}`,
  width: 1,
  height: 36
});

const ToolStatsCard = ({stacks, votes, jobs, followers, animateFollowStat}) => (
  <Stats>
    {stacks >= 0 && (
      <Fragment>
        <Stat>
          <label>Stacks</label>
          <span>{formatCount(stacks)}</span>
        </Stat>
        <Separator />
      </Fragment>
    )}
    {followers >= 0 && (
      <Fragment>
        <Followers animateFollowStat={animateFollowStat}>
          <label>Followers</label>
          <span>{formatCount(followers)}</span>
          <div>+ 1</div>
        </Followers>
        <Separator />
      </Fragment>
    )}
    {jobs >= 0 && (
      <Fragment>
        <Stat>
          <label>Jobs</label>
          <span>{formatCount(jobs)}</span>
        </Stat>
        <Separator />
      </Fragment>
    )}
    {votes >= 0 && (
      <Stat>
        <label>Votes</label>
        <span>{formatCount(votes)}</span>
      </Stat>
    )}
  </Stats>
);

ToolStatsCard.propTypes = {
  animateFollowStat: PropTypes.bool,
  stacks: PropTypes.number.isRequired,
  votes: PropTypes.number.isRequired,
  jobs: PropTypes.number,
  followers: PropTypes.number
};

export default ToolStatsCard;
