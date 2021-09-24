import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import {ASH, CHARCOAL, CONCRETE, FOCUS_BLUE, WHITE} from '../../../../shared/style/colors';
import Heading from '../heading/heading.jsx';
import AllIcon from './icons/all-icon.svg';
import AdviceIcon from './icons/advice-menu-icon.svg';
import PublicAdviceIcon from '../../../../shared/library/icons/public-advice-icon.svg';
import PrivateFeedIcon from '../../../../shared/library/icons/feed-private.svg';
import PrivateAdviceIcon from '../../../../shared/library/icons/advice-private.svg';
import PublicFeedIcon from '../../../../shared/library/icons/feed-public.svg';
import MyFeedIcon from './icons/myfeed-icon.svg';
import MyDecisionsIcon from './icons/mydecisions-icon.svg';
import TreeIcon from './icons/tree-icon.svg';
import {
  TYPE_ALL,
  TYPE_SERVICE,
  TYPE_USER,
  TYPE_MY_DECISION,
  TYPE_USER_DECISION,
  TYPE_COMPANY,
  FEED_PATH_TRENDING,
  FEED_PATH_ADVICE,
  TYPE_ADVICE,
  TYPE_PRIVATE_FEED,
  TYPE_PRIVATE_ADVICE,
  FEED_PATH_PUBLIC_ADVICE
} from '../../../../data/feed/constants';
import AuthCtaPanel from '../sidebar/auth-cta';
import {
  FEED_CLICK_FEEDS,
  FEED_CLICK_FEEDS_MY_FEED,
  FEED_CLICK_FEEDS_ALL,
  FEED_CLICK_FEEDS_MY_DECISIONS,
  FEED_CLICK_FEEDS_ADVICE
} from '../../constants/analytics';
import {
  withAnalyticsPayload,
  withSendAnalyticsEvent
} from '../../../../shared/enhancers/analytics-enhancer';
import {compose} from 'react-apollo';
import {NavigationContext, withRouteContext} from '../../../../shared/enhancers/router-enhancer';
import {safeCiEq} from '../../../../shared/utils/string';

const Container = glamorous.nav({
  display: 'flex',
  flexDirection: 'column',
  width: 256,
  flexShrink: 0,
  flexGrow: 0,
  '>:last-child': {
    border: 0
  }
});

const ContainerAside = Container.withComponent('aside');

export const FeedButton = glamorous.a(
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    boxSizing: 'content-box',
    height: 32,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 0,
    cursor: 'pointer',
    borderBottom: `1px solid ${ASH}`
  },
  ({active}) => ({
    color: active ? FOCUS_BLUE : CHARCOAL
  })
);

const Label = glamorous.div(
  {
    ...BASE_TEXT,
    fontSize: 14,
    fontWeight: WEIGHT.DARK,
    marginLeft: 12
  },
  ({active}) => ({
    color: active ? FOCUS_BLUE : CHARCOAL
  })
);

const Divider = glamorous.div({
  height: 2,
  borderBottom: `1px solid ${ASH}`,
  marginBottom: 23
});

const Service = glamorous.div({
  display: 'flex',
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  width: 32,
  height: 32,
  minWidth: 32,
  minHeight: 32,
  backgroundColor: WHITE,
  borderRadius: 3.1,
  border: `solid 0.8px ${CONCRETE}`
});

const Logo = glamorous.img({
  height: 24,
  width: 24
});

const AvatarLogo = glamorous.img({
  height: 32,
  width: 32,
  borderRadius: '50%'
});

export class FeedNav extends Component {
  static propTypes = {
    routeContext: PropTypes.shape({
      feedType: PropTypes.string.isRequired,
      typeSlug: PropTypes.string.isRequired
    }).isRequired,
    userSlug: PropTypes.string,
    context: PropTypes.shape({
      name: PropTypes.string,
      imageUrl: PropTypes.string
    }),
    authenticated: PropTypes.bool,
    sendAnalyticsEvent: PropTypes.func,
    privateMode: PropTypes.bool,
    currentUser: PropTypes.object
  };

  renderFeedContextLogo() {
    const {
      routeContext: {feedType, typeSlug},
      context,
      userSlug
    } = this.props;
    if (feedType === TYPE_SERVICE || feedType === TYPE_COMPANY) {
      return (
        <Service>
          <Logo src={context.imageUrl} alt={`Logo of ${context.name}`} />
        </Service>
      );
    } else if (feedType === TYPE_USER_DECISION && !safeCiEq(userSlug, typeSlug)) {
      return <AvatarLogo src={context.imageUrl} alt={`Avatar of ${context.displayName}`} />;
    } else {
      return <TreeIcon />;
    }
  }

  render() {
    const {
      routeContext: {feedType, typeSlug},
      userSlug,
      context,
      authenticated,
      privateMode,
      currentUser
    } = this.props;
    const hasPersonalGithubInstalltion = currentUser && currentUser.hasPersonalGithubInstall;

    if (!authenticated) {
      return (
        <ContainerAside>
          <AuthCtaPanel />
        </ContainerAside>
      );
    }

    return (
      <Container>
        <Heading>Feeds</Heading>
        <Divider />
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
                >
                  <PrivateFeedIcon />
                  <Label active={feedType === TYPE_PRIVATE_FEED}>Private Feed</Label>
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
                >
                  <PrivateAdviceIcon />
                  <Label active={feedType === TYPE_PRIVATE_ADVICE}>Private Stack Advice</Label>
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
                >
                  <PublicFeedIcon />
                  <Label active={feedType === TYPE_USER}>Public Feed</Label>
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
                >
                  <PublicAdviceIcon />
                  <Label active={feedType === TYPE_ADVICE}>Public Stack Advice</Label>
                </FeedButton>
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
                >
                  <MyFeedIcon />
                  <Label active={feedType === TYPE_USER}>My Feed</Label>
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
                >
                  <MyDecisionsIcon />
                  <Label active={feedType === TYPE_MY_DECISION && safeCiEq(typeSlug, userSlug)}>
                    My Decisions
                  </Label>
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
                >
                  <AllIcon />
                  <Label active={feedType === TYPE_ALL}>Trending</Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>

            {context &&
              feedType &&
              feedType !== TYPE_USER &&
              feedType !== TYPE_ALL &&
              !safeCiEq(userSlug, typeSlug) && (
                <NavigationContext.Consumer>
                  {navigate => (
                    <FeedButton
                      href={
                        feedType === TYPE_USER_DECISION
                          ? `/${typeSlug}/decisions`
                          : `/${feedType}/${typeSlug}/decisions`
                      }
                      title={
                        context &&
                        (feedType === TYPE_USER_DECISION ? context.displayName : context.name)
                      }
                      onClick={event => {
                        event.preventDefault();
                        if (feedType === TYPE_USER_DECISION) {
                          navigate(`/${typeSlug}/decisions`);
                        } else {
                          navigate(`/${feedType}/${typeSlug}/decisions`);
                        }
                      }}
                    >
                      {this.renderFeedContextLogo()}
                      <Label active={true}>
                        {context &&
                          (feedType === TYPE_USER_DECISION ? context.displayName : context.name)}
                      </Label>
                    </FeedButton>
                  )}
                </NavigationContext.Consumer>
              )}
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
        {!privateMode && hasPersonalGithubInstalltion && (
          <>
            {' '}
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
                >
                  <MyFeedIcon />
                  <Label active={feedType === TYPE_USER}>My Feed</Label>
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
                >
                  <MyDecisionsIcon />
                  <Label active={feedType === TYPE_MY_DECISION && safeCiEq(typeSlug, userSlug)}>
                    My Decisions
                  </Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>{' '}
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
                >
                  <AllIcon />
                  <Label active={feedType === TYPE_ALL}>Trending</Label>
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
                >
                  <PrivateFeedIcon />
                  <Label active={feedType === TYPE_PRIVATE_FEED}>Private Feed</Label>
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
                >
                  <PrivateAdviceIcon />
                  <Label active={feedType === TYPE_PRIVATE_ADVICE}>Private Stack Advice</Label>
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
                >
                  <PublicFeedIcon />
                  <Label active={feedType === TYPE_USER}>Public Feed</Label>
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
                >
                  <PublicAdviceIcon />
                  <Label active={feedType === TYPE_ADVICE}>Public Stack Advice</Label>
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
                >
                  <MyDecisionsIcon />
                  <Label active={feedType === TYPE_MY_DECISION && safeCiEq(typeSlug, userSlug)}>
                    My Decisions
                  </Label>
                </FeedButton>
              )}
            </NavigationContext.Consumer>
          </>
        )}
      </Container>
    );
  }
}

export default compose(
  withRouteContext,
  withAnalyticsPayload({}),
  withSendAnalyticsEvent
)(FeedNav);
