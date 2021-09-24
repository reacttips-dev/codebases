import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {BASE_TEXT} from '../../../../shared/style/typography';
import {FOCUS_BLUE, TARMAC} from '../../../../shared/style/colors';
import {
  TYPE_ALL,
  TYPE_USER,
  FEED_PATH_TRENDING,
  FEED_PATH_MANAGE_TOOLS,
  TYPE_MY_DECISION,
  TYPE_PRIVATE_FEED,
  FEED_PATH_ADVICE,
  TYPE_PRIVATE_ADVICE,
  FEED_PATH_PUBLIC_ADVICE,
  TYPE_ADVICE
} from '../../../../data/feed/constants';
import {
  FEED_CLICK_FEEDS,
  FEED_CLICK_FEEDS_ADVICE,
  FEED_CLICK_FEEDS_ALL,
  FEED_CLICK_FEEDS_MY_DECISIONS,
  FEED_CLICK_FEEDS_MY_FEED,
  FEED_CLICK_MANAGE_TOOLS
} from '../../constants/analytics';
import {
  withAnalyticsPayload,
  withSendAnalyticsEvent
} from '../../../../shared/enhancers/analytics-enhancer';
import {compose} from 'react-apollo';
import {NavigationContext, withRouteContext} from '../../../../shared/enhancers/router-enhancer';
import Notice, {BAR} from '../../../../shared/library/notices/notice';
import SimpleButton from '../../../../shared/library/buttons/base/simple';
import {safeCiEq} from '../../../../shared/utils/string';
import {SIGN_IN_PATH} from '../../constants/utils';
import SettingsIcon from './icons/settings-icon.svg';
import AdviceIcon from './icons/advice-menu-icon.svg';

const Container = glamorous.nav({
  display: 'flex',
  flexDirection: 'row',
  width: '93%',
  margin: '10px auto',
  overflowX: 'scroll',
  overflowY: 'hidden',
  whiteSpace: 'nowrap'
});

const NoticeTitle = glamorous.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

const SignupButton = glamorous(SimpleButton)({
  height: 31,
  boxSizing: 'border-box'
});

export const FeedButton = glamorous.a(
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'content-box',
    padding: '10px 5px',
    textDecoration: 'none',
    flexGrow: 1,
    flexShrink: 1
  },
  ({active}) => ({
    color: active ? FOCUS_BLUE : TARMAC,
    borderBottom: active ? `2px solid ${FOCUS_BLUE}` : '2px solid transparent',
    '> span': {
      color: active ? FOCUS_BLUE : TARMAC
    }
  })
);

const ManageToolsButton = glamorous.a({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 8,
  marginRight: 8,
  paddingLeft: 10,
  paddingRight: 10
});

const Label = glamorous.span({
  ...BASE_TEXT,
  fontSize: 14
});

export class FeedNav extends Component {
  static propTypes = {
    routeContext: PropTypes.shape({
      feedType: PropTypes.string.isRequired,
      typeSlug: PropTypes.string.isRequired
    }).isRequired,
    userSlug: PropTypes.string,
    sendAnalyticsEvent: PropTypes.func,
    privateMode: PropTypes.bool,
    currentUser: PropTypes.object
  };

  render() {
    const {
      routeContext: {feedType, typeSlug},
      userSlug,
      privateMode,
      currentUser
    } = this.props;

    const hasPersonalGithubInstalltion = currentUser && currentUser.hasPersonalGithubInstall;

    return userSlug ? (
      <Container>
        {privateMode && !hasPersonalGithubInstalltion && (
          <>
            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href="/feed"
                  title="Private Feed"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {
                      name: FEED_CLICK_FEEDS_MY_FEED
                    });
                    navigate('/feed');
                  }}
                  active={feedType === TYPE_PRIVATE_FEED}
                >
                  <Label>Private Feed</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>
            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href={FEED_PATH_ADVICE}
                  title="Private Stack Advice"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {
                      name: FEED_CLICK_FEEDS_ADVICE
                    });
                    navigate(FEED_PATH_ADVICE);
                  }}
                  active={feedType === TYPE_PRIVATE_ADVICE}
                >
                  <Label>Private Stack Advice</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>
            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href="/feed/public"
                  title="Public Feed"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {
                      name: FEED_CLICK_FEEDS_MY_FEED
                    });
                    navigate('/feed/public');
                  }}
                  active={feedType === TYPE_USER}
                >
                  <Label>Public Feed</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>
            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href={FEED_PATH_PUBLIC_ADVICE}
                  title="Public Stack Advice"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {
                      name: FEED_CLICK_FEEDS_ADVICE
                    });
                    navigate(FEED_PATH_PUBLIC_ADVICE);
                  }}
                  active={feedType === TYPE_ADVICE}
                >
                  <Label>Public Stack Advice</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>
            <NavigationContext.Consumer>
              {navigate => (
                <ManageToolsButton
                  href={FEED_PATH_MANAGE_TOOLS}
                  title="Manage Tools"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_MANAGE_TOOLS, {});
                    navigate(FEED_PATH_MANAGE_TOOLS);
                  }}
                >
                  <SettingsIcon />
                </ManageToolsButton>
              )}
            </NavigationContext.Consumer>
          </>
        )}
        {!privateMode && !hasPersonalGithubInstalltion && (
          <>
            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href="/feed"
                  title="My Feed"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {
                      name: FEED_CLICK_FEEDS_MY_FEED
                    });
                    navigate('/feed');
                  }}
                  active={feedType === TYPE_USER}
                >
                  <Label>My Feed</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>
            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href={`/${userSlug}/decisions`}
                  title="My Decisions"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {
                      name: FEED_CLICK_FEEDS_MY_DECISIONS
                    });
                    navigate(`/${userSlug}/decisions`);
                  }}
                  active={feedType === TYPE_MY_DECISION && safeCiEq(typeSlug, userSlug)}
                >
                  <Label>My Decisions</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>

            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href={FEED_PATH_TRENDING}
                  title="Trending"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {name: FEED_CLICK_FEEDS_ALL});
                    navigate(FEED_PATH_TRENDING);
                  }}
                  active={feedType === TYPE_ALL}
                >
                  <Label>Trending</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>

            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href={FEED_PATH_ADVICE}
                  title="Advice"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {
                      name: FEED_CLICK_FEEDS_ADVICE
                    });
                    navigate(FEED_PATH_ADVICE);
                  }}
                >
                  <AdviceIcon />
                  <Label active={feedType === TYPE_ADVICE}>Advice</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>

            <NavigationContext.Consumer>
              {navigate => (
                <ManageToolsButton
                  href={FEED_PATH_MANAGE_TOOLS}
                  title="Manage Tools"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_MANAGE_TOOLS, {});
                    navigate(FEED_PATH_MANAGE_TOOLS);
                  }}
                >
                  <SettingsIcon />
                </ManageToolsButton>
              )}
            </NavigationContext.Consumer>
          </>
        )}
        {!privateMode && hasPersonalGithubInstalltion && (
          <>
            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href="/feed"
                  title="My Feed"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {
                      name: FEED_CLICK_FEEDS_MY_FEED
                    });
                    navigate('/feed');
                  }}
                  active={feedType === TYPE_USER}
                >
                  <Label>My Feed</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>
            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href={`/${userSlug}/decisions`}
                  title="My Decisions"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {
                      name: FEED_CLICK_FEEDS_MY_DECISIONS
                    });
                    navigate(`/${userSlug}/decisions`);
                  }}
                  active={feedType === TYPE_MY_DECISION && safeCiEq(typeSlug, userSlug)}
                >
                  <Label>My Decisions</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>
            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href={FEED_PATH_TRENDING}
                  title="Trending"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {name: FEED_CLICK_FEEDS_ALL});
                    navigate(FEED_PATH_TRENDING);
                  }}
                  active={feedType === TYPE_ALL}
                >
                  <Label>Trending</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>
            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href={FEED_PATH_ADVICE}
                  title="Advice"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {
                      name: FEED_CLICK_FEEDS_ADVICE
                    });
                    navigate(FEED_PATH_ADVICE);
                  }}
                >
                  <AdviceIcon />
                  <Label active={feedType === TYPE_ADVICE}>Advice</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>
          </>
        )}
        {privateMode && hasPersonalGithubInstalltion && (
          <>
            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href="/feed"
                  title="Private Feed"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {
                      name: FEED_CLICK_FEEDS_MY_FEED
                    });
                    navigate('/feed');
                  }}
                  active={feedType === TYPE_PRIVATE_FEED}
                >
                  <Label>Private Feed</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>
            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href={FEED_PATH_ADVICE}
                  title="Private Stack Advice"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {
                      name: FEED_CLICK_FEEDS_ADVICE
                    });
                    navigate(FEED_PATH_ADVICE);
                  }}
                  active={feedType === TYPE_PRIVATE_ADVICE}
                >
                  <Label>Private Stack Advice</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>
            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href="/feed/public"
                  title="Public Feed"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {
                      name: FEED_CLICK_FEEDS_MY_FEED
                    });
                    navigate('/feed/public');
                  }}
                  active={feedType === TYPE_USER}
                >
                  <Label>Public Feed</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>
            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href={FEED_PATH_PUBLIC_ADVICE}
                  title="Public Stack Advice"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {
                      name: FEED_CLICK_FEEDS_ADVICE
                    });
                    navigate(FEED_PATH_PUBLIC_ADVICE);
                  }}
                  active={feedType === TYPE_ADVICE}
                >
                  <Label>Public Stack Advice</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>
            <NavigationContext.Consumer>
              {navigate => (
                <FeedButton
                  href={`/${userSlug}/decisions`}
                  title="My Decisions"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_FEEDS, {
                      name: FEED_CLICK_FEEDS_MY_DECISIONS
                    });
                    navigate(`/${userSlug}/decisions`);
                  }}
                  active={feedType === TYPE_MY_DECISION && safeCiEq(typeSlug, userSlug)}
                >
                  <Label>My Decisions</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>
            <NavigationContext.Consumer>
              {navigate => (
                <ManageToolsButton
                  href={FEED_PATH_MANAGE_TOOLS}
                  title="Manage Tools"
                  onClick={event => {
                    event.preventDefault();
                    this.props.sendAnalyticsEvent(FEED_CLICK_MANAGE_TOOLS, {});
                    navigate(FEED_PATH_MANAGE_TOOLS);
                  }}
                >
                  <SettingsIcon />
                </ManageToolsButton>
              )}
            </NavigationContext.Consumer>
          </>
        )}
      </Container>
    ) : (
      <NavigationContext.Consumer>
        {navigate => (
          <Notice
            theme={BAR}
            link={SIGN_IN_PATH}
            fullWidth={true}
            title={
              <NoticeTitle>
                <span>Customize your feed</span>
                <SignupButton>Signup</SignupButton>
              </NoticeTitle>
            }
            onClick={event => {
              event.preventDefault();
              navigate(SIGN_IN_PATH);
            }}
          />
        )}
      </NavigationContext.Consumer>
    );
  }
}

export default compose(
  withRouteContext,
  withAnalyticsPayload({}),
  withSendAnalyticsEvent
)(FeedNav);
