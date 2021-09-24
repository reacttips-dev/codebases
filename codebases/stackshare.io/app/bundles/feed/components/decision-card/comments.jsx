import React, {Component} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {FOCUS_BLUE} from '../../../../shared/style/colors';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import {FEED_CLICK_CARD_COMMENTS} from '../../constants/analytics';
import CommentsIcon from './icons/comments-icon.svg';
import SocialContainer from './social-container';
import {withSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';
import {withTrackEngagement} from '../../../../shared/enhancers/stream-analytics-enhancer';
import {CLICK} from '../../constants/stream-analytics';
import {NavigationContext} from '../../../../shared/enhancers/router-enhancer';
import {withCurrentUser} from '../../../../shared/enhancers/current-user-enhancer';
import {SIGN_IN_PATH} from '../../constants/utils';

const Copy = glamorous.div({
  ...BASE_TEXT,
  letterSpacing: '0.2px',
  fontWeight: WEIGHT.BOLD
});

const Container = glamorous(SocialContainer)({
  ':hover': {
    '> svg > path': {
      stroke: FOCUS_BLUE
    }
  }
});

export class Comments extends Component {
  static propTypes = {
    commentsCount: PropTypes.number,
    onCommentsToggle: PropTypes.func,
    sendAnalyticsEvent: PropTypes.func,
    commentsVisible: PropTypes.bool,
    innerRef: PropTypes.func,
    trackEngagement: PropTypes.func,
    analyticsPayload: PropTypes.object,
    currentUser: PropTypes.object
  };

  handleClick = navigate => {
    const {
      commentsVisible,
      sendAnalyticsEvent,
      onCommentsToggle,
      commentsCount,
      currentUser
    } = this.props;

    if (!currentUser) {
      navigate(SIGN_IN_PATH);
      return;
    }

    if (!commentsVisible) {
      const {trackEngagement, analyticsPayload} = this.props;
      const {streamId, cardPosition} = analyticsPayload;
      trackEngagement(CLICK, streamId, 80, cardPosition);
    }

    sendAnalyticsEvent(FEED_CLICK_CARD_COMMENTS, {
      commentCount: commentsCount,
      open: !commentsVisible
    });

    onCommentsToggle();
  };

  render() {
    const {innerRef} = this.props;
    return (
      <NavigationContext.Consumer>
        {navigate => (
          <Container
            data-testid="comment"
            innerRef={innerRef}
            onClick={() => this.handleClick(navigate)}
          >
            <CommentsIcon />
            <Copy>Comment</Copy>
          </Container>
        )}
      </NavigationContext.Consumer>
    );
  }
}

export default compose(
  withCurrentUser,
  withSendAnalyticsEvent,
  withTrackEngagement
)(Comments);
