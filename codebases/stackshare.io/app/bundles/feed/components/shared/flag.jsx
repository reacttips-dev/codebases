import React, {Component} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {
  FEED_CLICK_CARD_FLAG,
  FEED_CLICK_CARD_ADD,
  FEED_CLICK_CARD_REMOVE
} from '../../constants/analytics';
import FlagIcon from './icons/flag-icon.svg';
import SocialContainer from '../decision-card/social-container';
import {
  withAnalyticsPayload,
  withSendAnalyticsEvent
} from '../../../../shared/enhancers/analytics-enhancer';
import {withTrackEngagement} from '../../../../shared/enhancers/stream-analytics-enhancer';
import {withMutation} from '../../../../shared/enhancers/graphql-enhancer';
import {toggleFlag} from '../../../../data/feed/mutations';
import {FLAG} from '../../constants/stream-analytics';
import {MAKO, GUNSMOKE, ERROR_RED} from '../../../../shared/style/colors';
import {PHONE, HOVER} from '../../../../shared/style/breakpoints';
import {BASE_TEXT} from '../../../../shared/style/typography';
import {grid} from '../../../../shared/utils/grid';
import {ID} from '../../../../shared/utils/graphql';

export const LONG = 'long';
export const SHORT = 'short';

export const Container = glamorous(SocialContainer)(({flagged}) => ({
  color: flagged ? ERROR_RED : MAKO,
  marginLeft: 'auto',
  '> svg': {
    marginRight: 0,
    marginLeft: grid(1)
  },
  '> svg > path': {
    fill: flagged ? ERROR_RED : GUNSMOKE
  },
  [HOVER]: {
    ':hover': {
      '> svg > path': {
        fill: ERROR_RED
      },
      color: ERROR_RED
    }
  }
}));

const FlagMetaCopy = glamorous.div(
  {
    ...BASE_TEXT,
    fontSize: 12,
    letterSpacing: 0.2
  },
  ({theme}) => ({
    [PHONE]: {
      display: theme === LONG ? 'none' : 'block'
    }
  })
);

export class Flag extends Component {
  static propTypes = {
    trackEngagement: PropTypes.func,
    analyticsPayload: PropTypes.object,
    sendAnalyticsEvent: PropTypes.func,
    flagged: PropTypes.bool,
    onFlagToggle: PropTypes.func,
    itemId: ID,
    itemType: PropTypes.string,
    theme: PropTypes.string
  };

  static defaultProps = {
    theme: LONG
  };

  handleClick = () => {
    const {flagged, onFlagToggle, itemId, itemType, sendAnalyticsEvent} = this.props;

    sendAnalyticsEvent(FEED_CLICK_CARD_FLAG, {
      itemId,
      itemType,
      state: flagged ? FEED_CLICK_CARD_REMOVE : FEED_CLICK_CARD_ADD
    });

    if (!flagged) {
      const {trackEngagement, analyticsPayload} = this.props;
      const {streamId, cardPosition} = analyticsPayload;
      trackEngagement(FLAG, streamId, 80, cardPosition);
    }

    onFlagToggle(itemId, itemType, !flagged);
  };

  render() {
    const {flagged, theme} = this.props;

    return (
      <Container flagged={flagged} onClick={this.handleClick}>
        <FlagMetaCopy theme={theme}>
          {flagged ? 'Flagged' : theme === LONG ? 'Flag post' : 'Flag'}
        </FlagMetaCopy>
        {theme === LONG ? <FlagIcon flagged={flagged ? 1 : 0} /> : null}
      </Container>
    );
  }
}

export default compose(
  withAnalyticsPayload({}),
  withSendAnalyticsEvent,
  withTrackEngagement,
  withMutation(toggleFlag, mutate => ({
    onFlagToggle: (id, type, flag) =>
      mutate({
        variables: {id, type, flag},
        optimisticResponse: {
          __typename: 'Mutation',
          toggleFlag: {
            id: id,
            __typename: type,
            flagged: flag
          }
        }
      })
  }))
)(Flag);
