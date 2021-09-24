import React, {Component} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {
  FEED_CLICK_CARD_UPVOTE,
  FEED_CLICK_CARD_ADD,
  FEED_CLICK_CARD_REMOVE,
  FEED_CLICK_CARD_TYPE_DECISION
} from '../../constants/analytics';
import UpvotesIcon from './icons/upvotes-icon.svg';
import SocialContainer from './social-container';
import {MetaCopy} from './';
import {
  withAnalyticsPayload,
  withSendAnalyticsEvent
} from '../../../../shared/enhancers/analytics-enhancer';
import {withTrackEngagement} from '../../../../shared/enhancers/stream-analytics-enhancer';
import {UPVOTE} from '../../constants/stream-analytics';
import {NavigationContext} from '../../../../shared/enhancers/router-enhancer';
import {withCurrentUser} from '../../../../shared/enhancers/current-user-enhancer';
import {MAKO, GUNSMOKE, FOCUS_BLUE} from '../../../../shared/style/colors';
import {SIGN_IN_PATH} from '../../constants/utils';

export const Container = glamorous(SocialContainer)(({upvoted}) => ({
  color: upvoted ? FOCUS_BLUE : MAKO,
  '> svg > path': {
    fill: upvoted ? FOCUS_BLUE : GUNSMOKE
  }
}));

export class Upvotes extends Component {
  static propTypes = {
    trackEngagement: PropTypes.func,
    analyticsPayload: PropTypes.object,
    sendAnalyticsEvent: PropTypes.func,
    upvoted: PropTypes.bool,
    onUpvoteToggle: PropTypes.func,
    decisionId: PropTypes.string,
    currentUser: PropTypes.object,
    upvotesCount: PropTypes.number
  };

  handleClick = navigate => {
    const {
      upvoted,
      onUpvoteToggle,
      decisionId,
      sendAnalyticsEvent,
      currentUser,
      upvotesCount
    } = this.props;

    if (!currentUser) {
      navigate(SIGN_IN_PATH);
      return;
    }

    sendAnalyticsEvent(FEED_CLICK_CARD_UPVOTE, {
      upvoteType: FEED_CLICK_CARD_TYPE_DECISION,
      state: upvoted ? FEED_CLICK_CARD_REMOVE : FEED_CLICK_CARD_ADD
    });

    if (!upvoted) {
      const {trackEngagement, analyticsPayload} = this.props;
      const {streamId, cardPosition} = analyticsPayload;
      trackEngagement(UPVOTE, streamId, 80, cardPosition);
    }

    onUpvoteToggle(decisionId, 'StackDecision', !upvoted, upvotesCount);
  };

  render() {
    const {upvoted} = this.props;

    return (
      <NavigationContext.Consumer>
        {navigate => (
          <Container
            data-testid="upvote"
            upvoted={upvoted}
            onClick={() => this.handleClick(navigate)}
          >
            <UpvotesIcon upvoted={upvoted ? 1 : 0} />
            <MetaCopy>{upvoted ? 'Upvoted' : 'Upvote'}</MetaCopy>
          </Container>
        )}
      </NavigationContext.Consumer>
    );
  }
}

export default compose(
  withCurrentUser,
  withAnalyticsPayload({type: 'decision'}),
  withSendAnalyticsEvent,
  withTrackEngagement
)(Upvotes);
