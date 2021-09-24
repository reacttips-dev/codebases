import React, {Component} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {
  FEED_CLICK_CARD_BOOKMARK,
  FEED_CLICK_CARD_ADD,
  FEED_CLICK_CARD_REMOVE
} from '../../constants/analytics';
import BookmarkIcon from './icons/bookmark-icon.svg';
import {withSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';
import {withTrackEngagement} from '../../../../shared/enhancers/stream-analytics-enhancer';
import {HOVER} from '../../../../shared/style/breakpoints';
import {FOCUS_BLUE, GUNSMOKE, WHITE} from '../../../../shared/style/colors';
import {BOOKMARK} from '../../constants/stream-analytics';
import {LIGHT, DARK, SIGN_IN_PATH} from '../../constants/utils';
import {withCurrentUser} from '../../../../shared/enhancers/current-user-enhancer';
import {NavigationContext} from '../../../../shared/enhancers/router-enhancer';

export const Button = glamorous.button(
  {
    cursor: 'pointer',
    height: 30,
    width: 17,
    position: 'absolute',
    top: 0,
    right: 14,
    padding: 0,
    border: 0,
    outline: 0,
    background: 'none',
    [HOVER]: {
      ':hover': {
        '> svg > g#inactive > g > path': {
          fill: FOCUS_BLUE
        }
      }
    }
  },
  ({bookmarked, theme}) => ({
    '> svg > g#inactive > g > path': {
      fill: theme === LIGHT ? GUNSMOKE : WHITE
    },
    '> svg > g#inactive': {
      display: bookmarked ? 'none' : 'block'
    },
    '> svg > g#active': {
      display: bookmarked ? 'block' : 'none'
    }
  })
);

export class Bookmark extends Component {
  static propTypes = {
    trackEngagement: PropTypes.func,
    analyticsPayload: PropTypes.object,
    sendAnalyticsEvent: PropTypes.func,
    onBookmarkToggle: PropTypes.func,
    bookmarked: PropTypes.bool,
    decisionId: PropTypes.string,
    theme: PropTypes.oneOf([LIGHT, DARK]),
    currentUser: PropTypes.object
  };

  static defaultProps = {
    theme: DARK
  };

  handleClick = navigate => {
    const {bookmarked, decisionId, onBookmarkToggle, sendAnalyticsEvent, currentUser} = this.props;

    if (!currentUser) {
      navigate(SIGN_IN_PATH);
      return;
    }

    sendAnalyticsEvent(FEED_CLICK_CARD_BOOKMARK, {
      state: bookmarked ? FEED_CLICK_CARD_REMOVE : FEED_CLICK_CARD_ADD
    });

    if (!bookmarked) {
      const {trackEngagement, analyticsPayload} = this.props;
      const {streamId, cardPosition} = analyticsPayload;
      trackEngagement(BOOKMARK, streamId, 90, cardPosition);
    }

    onBookmarkToggle(decisionId, 'StackDecision', !bookmarked);
  };

  render() {
    const {bookmarked, theme} = this.props;

    return (
      <NavigationContext.Consumer>
        {navigate => (
          <Button
            bookmarked={bookmarked ? 1 : 0}
            onClick={() => this.handleClick(navigate)}
            theme={theme}
          >
            <BookmarkIcon />
          </Button>
        )}
      </NavigationContext.Consumer>
    );
  }
}

export default compose(
  withCurrentUser,
  withSendAnalyticsEvent,
  withTrackEngagement
)(Bookmark);
