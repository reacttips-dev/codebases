import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {compose} from 'react-apollo';
import {toolsPresenter} from '../../../shared/utils/presenters';
import {MIN_WIDTH} from '../components/article-card/article-card';
import {FEED_CLICK_LOAD_MORE} from '../constants/analytics';
import {GUNSMOKE, PAGE_BACKGROUND} from '../../../shared/style/colors';
import Link from '../../../shared/library/typography/link';
import Heading from '../components/heading/heading.jsx';
import ServiceHeading from '../components/heading/service-heading.jsx';
import CompanyHeading from '../components/heading/company-heading.jsx';
import UserHeading from '../components/heading/user-heading.jsx';
import FeedNav from '../components/nav/feed-nav';
import DecisionLeaderboard from '../components/decision-leaderboard';
import FeedTools from '../components/tools/feed-tools';
import Notice, {BOX, LEFT} from '../../../shared/library/notices/notice.jsx';
import {
  TYPE_ALL,
  TYPE_SERVICE,
  TYPE_USER,
  TYPE_USER_DECISION,
  TYPE_COMPANY,
  TYPE_MY_DECISION,
  TYPE_ADVICE,
  TYPE_PRIVATE_ADVICE
} from '../../../data/feed/constants';
import ProgressIndicator, {LARGE} from '../../../shared/library/indicators/indeterminate/circular';
import LoadMoreButton from '../../../shared/library/buttons/load-more';
import StickyPanel from '../../../shared/library/panels/sticky';
import DigestSubscribe from '../components/subscribe/digest';
import Checklist from '../components/shared/checklist/index';
import Composer from '../../../shared/library/composer';
import ComposerProvider from '../../../shared/library/composer/state/provider';
import StreamLogoImg from './icons/stream-logo.svg';
import FeedNotice, {
  DECISIONS_FIRST_RUN_SEEN_KEY,
  PERMALINK
} from '../components/shared/feed-notice';
import FeedItems from '../components/shared/feed-items';
import Overlay, {Z_INDEX} from '../../../shared/library/overlays';
import {restoreScrollSnapshot, takeScrollSnapshot} from './scroll-snapshot';
import {currentUserLoaded} from '../../../data/feed/utils';
import DecisionModal from '../components/decision-card/decision-modal';
import {GO_BACK, NavigationContext} from '../../../shared/enhancers/router-enhancer';
import {SigninDesktopModal} from '../../../shared/library/modals/signin';
import {safeCiEq} from '../../../shared/utils/string'; // TODO: replace with new component
import ReturnIcon from './icons/return-icon.svg';
import {ID} from '../../../shared/utils/graphql';
import Hint from '../../../shared/library/popovers/hint';
import {LEFT as HINT_LEFT} from '../../../shared/constants/placements';
import {scrollIntoView, scrollTo} from '../../../shared/utils/scroll';
import {
  withChecklistContext,
  FIVE_TOOLS_FOLLOWED,
  KEEPING_UP_WITH_TOOLS
} from '../../../shared/enhancers/checklist-enhancer';
import {grid} from '../../../shared/utils/grid';
import {withMutation} from '../../../shared/enhancers/graphql-enhancer';
import {subscribeDigest} from '../../../data/feed/mutations';
import {onboardingChecklist} from '../../../data/feed/queries';
import DigestModal from '../components/shared/digest-modal';
import {withLocalStorage} from '../../../shared/enhancers/local-storage-enhancer';
import {addDecisionToQueries} from '../../../data/feed/utils';
import {GetAdviceButton, GiveAdviceButton} from '../components/heading/advice-buttons';
import {DispatchContext} from '../../../shared/library/composer/state/provider';
import * as COMPOSER_ACTIONS from '../../../shared/library/composer/state/actions';
import {STRUCTURE_GET_ADVICE} from '../../../shared/library/composer/constants';
import {SIGN_IN_PATH} from '../../../shared/constants/paths';
import BlogNotice from '../components/shared/feed-blog-notice';
import SsoGithubCta from '../../../shared/library/cards/sso-github';
import {skipForceVcsConnection} from '../../../data/shared/mutations';

const MAX_SERVICES_VISIBLE = 5;

const Page = glamorous.main({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  '@media only screen and (max-width: 1165px)': {
    justifyContent: 'flex-start'
  },
  paddingBottom: 50,
  background: PAGE_BACKGROUND
});

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: PAGE_BACKGROUND,
  paddingTop: 40,
  paddingBottom: 40,
  paddingLeft: 30,
  paddingRight: 30,
  width: '100%',
  '@media only screen and (max-width: 1165px)': {
    paddingRight: 0
  },
  '@media only screen and (max-width: 880px)': {
    paddingLeft: 0,
    paddingRight: 0
  }
});

const Sidebar = glamorous.section(
  {
    minWidth: 300,
    position: 'relative',
    '>:first-child': {
      marginBottom: 17
    }
  },
  ({side}) => {
    if (side === 'right') {
      return {
        '@media only screen and (max-width: 1165px)': {
          display: 'none'
        }
      };
    } else if (side === 'left') {
      return {
        '@media only screen and (max-width: 880px)': {
          display: 'none'
        }
      };
    }
  }
);

const StreamFeed = glamorous.div({
  position: 'relative'
});

const StreamLogo = glamorous(Link)({
  position: 'absolute',
  bottom: 40,
  left: 30,
  display: 'flex',
  flexDirection: 'column',
  color: GUNSMOKE,
  fontSize: 15,
  marginLeft: 33,
  marginBottom: 20,
  '& svg': {
    width: 82,
    '& path': {
      stroke: 'transparent',
      fill: GUNSMOKE
    }
  },
  '&:hover': {
    color: GUNSMOKE,
    '& svg': {
      '& path': {
        fill: '#4480E4'
      },
      '& path:first-child': {
        fill: '#232D49'
      }
    }
  },
  '&:visited, &:focus': {
    color: GUNSMOKE
  }
});

const FeedList = glamorous.section({
  marginLeft: 30,
  marginRight: 30,
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  '>*': {
    marginBottom: 17
  },
  minWidth: MIN_WIDTH
});

const Center = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 50
});

const OverlayWrapper = glamorous.div({
  margin: 0
});

const ComposerOverlay = glamorous.div({}, ({active}) => ({zIndex: active ? Z_INDEX : 'auto'}));

const FeedHeader = glamorous.header({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 18,
  border: 'none',
  background: 'transparent'
});

const AdviceButtons = glamorous.div({
  display: 'grid',
  gridTemplateColumns: 'auto auto',
  columnGap: 20
});

const HeadingWithFilter = glamorous(Heading)({
  marginBottom: 0,
  marginRight: 'auto'
});

const FeedToolsContainer = glamorous.div(
  {
    position: 'relative',
    backgroundColor: PAGE_BACKGROUND,
    margin: -grid(3),
    marginTop: -grid(2),
    padding: grid(3),
    paddingTop: grid(2)
  },
  ({showFollowToolsHint}) => ({
    zIndex: showFollowToolsHint ? 100001 : 'auto'
  })
);

class Feed extends Component {
  static propTypes = {
    itemsLoading: PropTypes.bool,
    items: PropTypes.array,
    followedTools: PropTypes.array,
    onFetchMore: PropTypes.func,
    routeContext: PropTypes.shape({
      feedType: PropTypes.string,
      showPromptOverlay: PropTypes.bool,
      typeSlug: PropTypes.string,
      decisionId: PropTypes.string
    }),
    feedContext: PropTypes.object,
    hasNextPage: PropTypes.bool,
    userId: ID,
    userSlug: PropTypes.string,
    isPrivateMode: PropTypes.bool, //If user has a private company
    sendAnalyticsEvent: PropTypes.func,
    currentUser: PropTypes.object,
    signupPath: PropTypes.string,
    signupPathTitle: PropTypes.string,
    checklistContext: PropTypes.object,
    onSubscribe: PropTypes.func,
    storageProvider: PropTypes.object,
    skipVcsConnection: PropTypes.func
  };

  static defaultProps = {
    checklistContext: {},
    promptContext: {}
  };

  state = {
    showPromptOverlay: false, // comes from routes.js
    loadingNextPage: false,
    showSignupNotice: this.props.signupPath,
    showFollowToolsHint: false,
    showDigestModal: false
  };

  toggleSignupNotice = () => {
    this.setState({showSignupNotice: !this.state.showSignupNotice});
  };

  componentDidMount() {
    this.setPrompt();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      currentUser,
      onSubscribe,
      checklistContext: {
        checklistAction,
        resetChecklistAction,
        onChecklistItemLoading,
        resetChecklistItemLoading
      }
    } = this.props;

    restoreScrollSnapshot(snapshot);

    if (currentUserLoaded(prevProps, this.props)) {
      this.setPrompt();
    }

    if (currentUser && !currentUser.loading) {
      switch (checklistAction) {
        case FIVE_TOOLS_FOLLOWED:
          resetChecklistAction && resetChecklistAction();
          scrollIntoView(document.documentElement, this.feedTools, 100, 1000, () => {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({showFollowToolsHint: true});
          });
          break;
        case KEEPING_UP_WITH_TOOLS:
          onChecklistItemLoading && onChecklistItemLoading();
          resetChecklistAction && resetChecklistAction();
          // eslint-disable-next-line react/no-did-update-set-state
          onSubscribe({weekly: true}).then(() => {
            resetChecklistItemLoading && resetChecklistItemLoading();
            this.setState({showDigestModal: true});
          });
      }
    }
  }

  // remove after structured_composer except for showPromptOverlay logic
  setPrompt() {
    const {currentUser, routeContext} = this.props;
    if (currentUser && !currentUser.loading) {
      const showPrompt = currentUser.decisionPrompt && currentUser.decisionPrompt.active;
      if (showPrompt) {
        if (routeContext.showPromptOverlay) {
          this.setState({showPromptOverlay: true});
        }
      }
    }
  }

  handleDismissPrompt = () => {
    this.setState({showPromptOverlay: false});
  };

  handleDismissPromptOverlay = () => {
    this.setState({showPromptOverlay: false, postFromPrompt: null});
  };

  renderHeading() {
    const {
      routeContext: {feedType, typeSlug},
      feedContext,
      userSlug,
      itemsLoading,
      currentUser,
      isPrivateMode
    } = this.props;
    const {loadingNextPage} = this.state; // remove after structured_composer
    const firstLoad = itemsLoading && !loadingNextPage;
    switch (feedType) {
      case TYPE_ALL:
        return (
          <FeedHeader>
            <HeadingWithFilter>Trending Feed</HeadingWithFilter>
          </FeedHeader>
        );
      case TYPE_ADVICE:
        return (
          <Fragment>
            <Heading>Stack Advice</Heading>
            {!firstLoad && (
              <NavigationContext.Consumer>
                {navigate => (
                  <DispatchContext.Consumer>
                    {dispatch => (
                      <AdviceButtons>
                        <GetAdviceButton
                          onClick={() => {
                            if (currentUser && !currentUser.loading) {
                              dispatch({
                                type: COMPOSER_ACTIONS.COMPOSER_ACTIVATE_WITH_STRUCTURE,
                                structure: STRUCTURE_GET_ADVICE
                              });
                            } else {
                              this.setState({signinAction: 'getadvice'}, () =>
                                navigate(SIGN_IN_PATH)
                              );
                            }
                          }}
                        >
                          Get Advice
                        </GetAdviceButton>
                        <GiveAdviceButton
                          onClick={() => {
                            if (currentUser && !currentUser.loading) {
                              const firstArticle = document.querySelector('article');
                              if (firstArticle) {
                                scrollTo(window, firstArticle.offsetTop - 10);
                              }
                            } else {
                              navigate(SIGN_IN_PATH);
                            }
                          }}
                        >
                          Give Advice
                        </GiveAdviceButton>
                      </AdviceButtons>
                    )}
                  </DispatchContext.Consumer>
                )}
              </NavigationContext.Consumer>
            )}
          </Fragment>
        );
      case TYPE_PRIVATE_ADVICE:
        return (
          <Fragment>
            <Heading>Private Stack Advice</Heading>
            {!firstLoad && (
              <NavigationContext.Consumer>
                {navigate => (
                  <DispatchContext.Consumer>
                    {dispatch => (
                      <AdviceButtons>
                        <GetAdviceButton
                          onClick={() => {
                            if (currentUser && !currentUser.loading) {
                              dispatch({
                                type: COMPOSER_ACTIONS.COMPOSER_ACTIVATE_WITH_STRUCTURE,
                                structure: STRUCTURE_GET_ADVICE
                              });
                            } else {
                              this.setState({signinAction: 'getadvice'}, () =>
                                navigate(SIGN_IN_PATH)
                              );
                            }
                          }}
                        >
                          Get Advice
                        </GetAdviceButton>
                        <GiveAdviceButton
                          onClick={() => {
                            if (currentUser && !currentUser.loading) {
                              const firstArticle = document.querySelector('article');
                              if (firstArticle) {
                                scrollTo(window, firstArticle.offsetTop - 10);
                              }
                            } else {
                              navigate(SIGN_IN_PATH);
                            }
                          }}
                        >
                          Give Advice
                        </GiveAdviceButton>
                      </AdviceButtons>
                    )}
                  </DispatchContext.Consumer>
                )}
              </NavigationContext.Consumer>
            )}
          </Fragment>
        );
      case TYPE_USER:
        return (
          <FeedHeader>
            <HeadingWithFilter>{isPrivateMode ? 'Public Feed' : 'My Feed'}</HeadingWithFilter>
          </FeedHeader>
        );
      case TYPE_USER_DECISION:
        if (feedContext && !safeCiEq(userSlug, typeSlug)) {
          return <UserHeading user={feedContext} />;
        }
        break;
      case TYPE_MY_DECISION:
        if (safeCiEq(userSlug, typeSlug)) {
          return <Heading>My Decisions</Heading>;
        }
        break;
      case TYPE_SERVICE:
        return feedContext ? <ServiceHeading overlay={false} service={feedContext} /> : '';
      case TYPE_COMPANY:
        return feedContext ? <CompanyHeading company={feedContext} /> : '';
      default:
        return <Heading>{feedContext ? feedContext.name : ''}</Heading>;
    }
  }

  renderDigestSubscribePanel = () => {
    let emailFeedDaily = null;
    let emailFeedWeekly = null;
    const {currentUser} = this.props;

    if (currentUser && currentUser.emailSettings) {
      emailFeedDaily = currentUser.emailSettings.emailFeedDaily;
      emailFeedWeekly = currentUser.emailSettings.emailFeedWeekly;
    }

    if (
      !currentUser ||
      (currentUser && !currentUser.loading && (!emailFeedWeekly && !emailFeedDaily))
    ) {
      return (
        <StickyPanel top={30} marginBottom={80}>
          <DigestSubscribe weekly={emailFeedWeekly} daily={emailFeedDaily} />
        </StickyPanel>
      );
    }
  };

  getSnapshotBeforeUpdate(prevProps) {
    return takeScrollSnapshot(prevProps, this.props);
  }

  handleDismissFollowToolsHint = () => {
    this.setState({showFollowToolsHint: false});
  };

  handleDismissDigestModal = () => {
    this.setState({showDigestModal: false});
  };

  renderFeedNotice() {
    const {userId, userSlug, followedTools, items} = this.props;
    // is this check necessary with structured_composer?
    return (
      <FeedNotice userId={userId} userSlug={userSlug} followedTools={followedTools} items={items}>
        {(title, msg, icon, onDismiss) => (
          <Notice align={LEFT} theme={BOX} icon={icon} title={msg} onDismiss={onDismiss} />
        )}
      </FeedNotice>
    );
  }

  renderPromptOverlay() {
    const {showPromptOverlay} = this.state;
    if (showPromptOverlay) {
      return (
        <OverlayWrapper>
          <Overlay dismissOnClick onDismiss={this.handleDismissPromptOverlay} />
        </OverlayWrapper>
      );
    }
  }

  render() {
    const {
      itemsLoading,
      items,
      userSlug,
      feedContext,
      onFetchMore,
      hasNextPage,
      userId,
      isPrivateMode,
      followedTools,
      currentUser,
      signupPath,
      routeContext: {typeSlug, decisionId, signin, feedType, routeAction},
      storageProvider
    } = this.props;
    const {
      showPromptOverlay,
      loadingNextPage,
      showSignupNotice,
      showFollowToolsHint,
      showDigestModal
    } = this.state;

    const firstLoad = itemsLoading && !loadingNextPage;
    const userToolFollows = toolsPresenter('userToolFollows', followedTools);
    const signupPathTitle = this.props.signupPathTitle || signupPath;
    const showSsoGithubCta = currentUser && currentUser.shouldForceVcsConnection;
    let permalink = '/feed';

    const skipConnection = async () => {
      try {
        await this.props.skipVcsConnection();
      } catch (error) {
        /* eslint-disable no-console */
        console.error(error);
        alert(
          'There was a problem processing your request. Please try again and if the problem persists please email us at contact@stackshare.io.'
        );
      }
    };

    if (signin) {
      permalink = storageProvider.getItem(PERMALINK);
    }

    const updateFn = (store, data) => {
      addDecisionToQueries(store, data);
      if (!storageProvider.getItem(DECISIONS_FIRST_RUN_SEEN_KEY)) {
        storageProvider.setItem(DECISIONS_FIRST_RUN_SEEN_KEY, true);
      }
    };

    const post =
      routeAction === 'getadvice'
        ? {decisionType: STRUCTURE_GET_ADVICE}
        : this.state.postFromPrompt;

    return (
      <React.Fragment>
        {showSignupNotice && (
          <Notice
            icon={<ReturnIcon />}
            title={'Return to'}
            link={signupPath}
            linkTitle={signupPathTitle}
            onDismiss={this.toggleSignupNotice}
            source={'signupBanner'}
          />
        )}
        <Page>
          <ComposerProvider post={post} debug privateMode={isPrivateMode}>
            {decisionId && (
              <NavigationContext.Consumer>
                {navigate => (
                  <DecisionModal
                    onDismiss={() => {
                      navigate(`/${typeSlug}/decisions`);
                    }}
                  />
                )}
              </NavigationContext.Consumer>
            )}
            {showSsoGithubCta && isPrivateMode && (
              <SsoGithubCta skipCta={() => skipConnection()} pageReload={true} />
            )}
            {!showSsoGithubCta && (
              <Container>
                <Sidebar side="left">
                  <FeedNav
                    analyticsPayload={userToolFollows}
                    authenticated={Boolean(userId)}
                    userSlug={userSlug}
                    context={feedContext}
                    privateMode={isPrivateMode}
                    currentUser={currentUser}
                  />
                  {currentUser ? (
                    <StickyPanel top={30} marginBottom={80} style={{zIndex: 100}}>
                      <Checklist />
                    </StickyPanel>
                  ) : (
                    this.renderDigestSubscribePanel()
                  )}
                </Sidebar>
                <FeedList>
                  {this.renderHeading()}
                  <BlogNotice />
                  {/* Added this as it was buggy for when we have a overlay */}
                  {items && this.renderFeedNotice()}
                  {items && this.renderPromptOverlay()}

                  {Boolean(userId) && items && (
                    <ComposerOverlay active={showPromptOverlay}>
                      <Composer analyticsPayload={userToolFollows} onMutationUpdate={updateFn} />
                    </ComposerOverlay>
                  )}
                  {firstLoad ? (
                    <Center>
                      <ProgressIndicator size={LARGE} />
                    </Center>
                  ) : (
                    <FeedItems
                      items={items}
                      tools={followedTools}
                      isPrivateMode={isPrivateMode}
                      maxServicesVisible={MAX_SERVICES_VISIBLE}
                      disableFirstRun={
                        Boolean(decisionId) || (currentUser && currentUser.showTosModal)
                      }
                    />
                  )}
                  {hasNextPage && !firstLoad && (
                    <Center>
                      <LoadMoreButton
                        loading={loadingNextPage}
                        onClick={async () => {
                          this.setState({loadingNextPage: true});
                          this.props.sendAnalyticsEvent(FEED_CLICK_LOAD_MORE);
                          await onFetchMore();
                          this.setState({loadingNextPage: false});
                        }}
                      />
                    </Center>
                  )}
                </FeedList>

                <Sidebar side="right">
                  {showFollowToolsHint ? (
                    <FeedToolsContainer
                      innerRef={el => (this.feedTools = el)}
                      showFollowToolsHint={showFollowToolsHint}
                    >
                      <Hint
                        placement={HINT_LEFT}
                        anchor={<FeedTools openIndex={showFollowToolsHint ? 0 : 1} />}
                        hint="Follow more tools to improve your feed"
                        customStyle={{marginRight: grid(6)}}
                        hideHint={!showFollowToolsHint}
                      />
                    </FeedToolsContainer>
                  ) : (
                    <FeedToolsContainer
                      innerRef={el => (this.feedTools = el)}
                      showFollowToolsHint={showFollowToolsHint}
                    >
                      <FeedTools openIndex={1} />
                    </FeedToolsContainer>
                  )}

                  {feedType !== TYPE_ADVICE && !isPrivateMode && <DecisionLeaderboard />}
                </Sidebar>
              </Container>
            )}
            {showFollowToolsHint && (
              <Overlay onDismiss={this.handleDismissFollowToolsHint} dismissOnClick={true} />
            )}
            {signin && (
              <SigninDesktopModal
                onDismiss={() => this.setState({signinAction: null}, GO_BACK)}
                redirect={
                  this.state.signinAction ? `/feed/advice/!/${this.state.signinAction}` : permalink
                }
              />
            )}
            {showDigestModal && <DigestModal onDismiss={this.handleDismissDigestModal} />}
            {items && Boolean(items.length) && (
              <StreamFeed>
                <StreamLogo href="https://stackshare.io/stream">
                  <span>Feed powered by</span>
                  <StreamLogoImg />
                </StreamLogo>
              </StreamFeed>
            )}
          </ComposerProvider>
        </Page>
      </React.Fragment>
    );
  }
}

export default compose(
  withChecklistContext,
  withLocalStorage('Feed', '1'),
  withMutation(subscribeDigest, mutate => ({
    onSubscribe: ({weekly, daily}) =>
      mutate({
        variables: {settings: {emailFeedWeekly: weekly, emailFeedDaily: daily}},
        refetchQueries: [{query: onboardingChecklist}]
      })
  })),
  withMutation(skipForceVcsConnection, mutate => ({
    skipVcsConnection: () => mutate({})
  }))
)(Feed);
