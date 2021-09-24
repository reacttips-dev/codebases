import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {compose} from 'react-apollo';
import {FEED_CLICK_LOAD_MORE} from '../constants/analytics';
import {WHITE} from '../../../shared/style/colors';
import Notice, {BOX, LEFT} from '../../../shared/library/notices/notice.jsx';
import Footer from '../../site/components/footer';
import ProgressIndicator, {LARGE} from '../../../shared/library/indicators/indeterminate/circular';
import LoadMoreButton from '../../../shared/library/buttons/load-more';
import Header from '../components/nav/header';
import FeedNotice, {PERMALINK} from '../components/shared/feed-notice';
import BlogNotice from '../components/shared/feed-blog-notice';
import FeedItems from '../components/shared/feed-items';
import FeedNav from '../components/nav/feed-mobile-nav';
import {toolsPresenter} from '../../../shared/utils/presenters';
import {restoreScrollSnapshot, takeScrollSnapshot} from './scroll-snapshot';
import {NavigationContext} from '../../../shared/enhancers/router-enhancer';
import DecisionModal from '../components/decision-card/decision-modal';
import {SigninMobileModal} from '../../../shared/library/modals/signin';
import animate, {translateXvw} from '../../../shared/library/animation/animate';
import MobileServiceHeading from '../components/heading/service-heading-mobile';
import MobileCompanyHeading from '../components/heading/company-heading-mobile';
import MobileUserHeading from '../components/heading/user-heading-mobile';
import {
  TYPE_USER_DECISION,
  TYPE_SERVICE,
  TYPE_COMPANY,
  TYPE_FUNCTION,
  TYPE_CATEGORY,
  TYPE_LAYER
} from '../../../data/feed/constants';
import {BASE_TEXT, WEIGHT} from '../../../shared/style/typography';
import {safeCiEq} from '../../../shared/utils/string';
import {ID} from '../../../shared/utils/graphql';
import ManageToolsModal from '../components/manage-tools';
import MobileComposerCTA from '../../../shared/library/composer/components/mobile-cta';
import MobileComposer, {MobileComposerContext} from '../../../shared/library/composer/mobile';
import {addDecisionToQueries} from '../../../data/feed/utils';
import {buildPostForUserPrompt} from '../../../shared/library/composer/state/prompts';
import {withLocalStorage} from '../../../shared/enhancers/local-storage-enhancer';
import SsoGithubCta from '../../../shared/library/cards/sso-github';
import {withMutation} from '../../../shared/enhancers/graphql-enhancer';
import {skipForceVcsConnection} from '../../../data/shared/mutations';

const MAX_SERVICES_VISIBLE = 2;

const Page = glamorous.main({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  background: WHITE,
  position: 'relative',
  width: '100vw',
  overflow: 'hidden'
});

const Content = glamorous.div({width: '100vw'});

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: WHITE,
  paddingTop: 10,
  paddingBottom: 50,
  paddingLeft: 10,
  paddingRight: 10,
  width: '100%',
  boxSizing: 'border-box'
});

const FeedList = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  '>*': {
    marginBottom: 20
  }
});

const DefaultHeading = glamorous.div({
  ...BASE_TEXT,
  fontSize: 20,
  fontWeight: WEIGHT.BOLD,
  display: 'flex',
  justifyContent: 'center',
  paddingLeft: 18,
  paddingRight: 18,
  marginTop: 8,
  marginBottom: 10
});

export const Center = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 50,
  paddingLeft: '20vw',
  paddingRight: '20vw',
  textAlign: 'center'
});

const Navigator = glamorous.div({
  display: 'flex',
  flexDirection: 'row'
});

const View = glamorous.div({
  width: '100vw'
});

class FeedMobile extends Component {
  static propTypes = {
    itemsLoading: PropTypes.bool,
    items: PropTypes.array,
    followedTools: PropTypes.array,
    onFetchMore: PropTypes.func,
    routeContext: PropTypes.object,
    hasNextPage: PropTypes.bool,
    userId: ID,
    userSlug: PropTypes.string,
    sendAnalyticsEvent: PropTypes.func,
    reloadItems: PropTypes.func,
    refetchFollowedTools: PropTypes.func,
    feedContext: PropTypes.object,
    currentUser: PropTypes.object,
    isPrivateMode: PropTypes.bool,
    storageProvider: PropTypes.object,
    skipVcsConnection: PropTypes.func
  };

  state = {
    loadingNextPage: false,
    submittedDecision: null,
    onDismissSubmittedDecision: null,
    composer: false
  };

  getSnapshotBeforeUpdate(prevProps) {
    return takeScrollSnapshot(prevProps, this.props);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    restoreScrollSnapshot(snapshot);
  }

  navigator = createRef();

  renderContent(firstLoad) {
    const {
      userId,
      userSlug,
      items,
      routeContext: {feedType, typeSlug},
      onFetchMore,
      hasNextPage,
      followedTools,
      feedContext,
      isPrivateMode,
      currentUser
    } = this.props;

    const {loadingNextPage} = this.state;
    const showSsoGithubCta = currentUser && currentUser.shouldForceVcsConnection;

    const userToolFollows = toolsPresenter('userToolFollows', followedTools);

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

    const metaTypes = [TYPE_FUNCTION, TYPE_CATEGORY, TYPE_LAYER];

    return (
      <Content>
        {Boolean(userId) && <MobileComposerCTA onClick={() => this.setState({composer: true})} />}
        <FeedNav
          analyticsPayload={userToolFollows}
          authenticated={Boolean(userId)}
          userSlug={userSlug}
          privateMode={isPrivateMode}
          currentUser={currentUser}
        />
        {feedContext && feedType === TYPE_USER_DECISION && !safeCiEq(userSlug, typeSlug) && (
          <MobileUserHeading user={feedContext} />
        )}
        {feedContext && feedType === TYPE_SERVICE && (
          <MobileServiceHeading overlay={false} service={feedContext} />
        )}
        {feedContext && feedType === TYPE_COMPANY && <MobileCompanyHeading company={feedContext} />}
        {feedContext && metaTypes.includes(feedType) && (
          <DefaultHeading>{feedContext.name}</DefaultHeading>
        )}
        {/* Check SSO condition */}
        {showSsoGithubCta && isPrivateMode && (
          <SsoGithubCta skipCta={() => skipConnection()} pageReload={true} />
        )}
        {firstLoad ? (
          <Center>
            <ProgressIndicator size={LARGE} />
          </Center>
        ) : (
          !showSsoGithubCta && (
            <Container>
              <FeedList>
                {this.state.submittedDecision && (
                  <Notice
                    title={
                      <span>
                        Your decision was submitted. Read it{' '}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`/${this.state.submittedDecision.username}/decisions/${
                            this.state.submittedDecision.id
                          }`}
                        >
                          <u>here</u>
                        </a>
                      </span>
                    }
                    onDismiss={() => {
                      if (this.state.onDismissSubmittedDecision) {
                        this.state.onDismissSubmittedDecision();
                      }
                      this.setState({submittedDecision: null, onDismissSubmittedDecision: null});
                    }}
                  />
                )}
                <BlogNotice />
                <FeedNotice
                  userId={userId}
                  userSlug={userSlug}
                  feedType={feedType}
                  followedTools={followedTools}
                  items={items}
                >
                  {(title, msg, icon, onDismiss) => (
                    <Notice
                      align={LEFT}
                      theme={BOX}
                      icon={icon}
                      title={title}
                      onDismiss={onDismiss}
                    >
                      {msg}
                    </Notice>
                  )}
                </FeedNotice>
                <MobileComposerContext.Provider
                  value={overrides => this.setState({composer: overrides})}
                >
                  <FeedItems
                    items={items}
                    tools={followedTools}
                    maxServicesVisible={MAX_SERVICES_VISIBLE}
                    disableFirstRun={true}
                    isPrivateMode={isPrivateMode}
                  />
                </MobileComposerContext.Provider>
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
            </Container>
          )
        )}
      </Content>
    );
  }

  handleModalExit = onAnimDone => (...args) => {
    animate([{element: this.navigator.current, from: -100, to: 0}], 300, translateXvw, () =>
      onAnimDone(...args)
    );
  };

  render() {
    const {userSlug, itemsLoading, isPrivateMode, userId, currentUser} = this.props;
    const modal = this.renderModal();
    const {loadingNextPage} = this.state;
    const firstLoad = itemsLoading && !loadingNextPage;

    return (
      <Page>
        <Header
          currentUser={currentUser}
          path={userSlug ? `/${userSlug}` : null}
          userId={userId}
          contentRef={this.navigator}
          privateMode={isPrivateMode}
        />
        <Navigator
          innerRef={this.navigator}
          style={{transform: `translateX(${modal ? '-100vw' : '0'})`}}
        >
          <View>{this.renderContent(firstLoad)}</View>
          <View>{modal}</View>
        </Navigator>
        {!firstLoad && <Footer privateMode={isPrivateMode} />}
      </Page>
    );
  }

  renderModal() {
    const {
      routeContext: {decisionId, signin, typeSlug, manageTools, showPromptOverlay},
      currentUser,
      storageProvider
    } = this.props;

    if (signin) {
      const permalink = storageProvider.getItem(PERMALINK);
      return <SigninMobileModal redirect={permalink ? permalink : '/feed'} />;
    }

    if (decisionId) {
      return (
        <NavigationContext.Consumer>
          {navigate => (
            <DecisionModal
              onDismiss={this.handleModalExit(() => navigate(`/${typeSlug}/decisions`))}
            />
          )}
        </NavigationContext.Consumer>
      );
    } else if (manageTools) {
      return (
        <ManageToolsModal
          onDismiss={this.handleModalExit(dirty => {
            if (dirty) {
              this.props.reloadItems();
              this.props.refetchFollowedTools();
            }
            history.back();
          })}
        />
      );
    }

    if (this.state.composer) {
      // TODO: clean up the nasty
      const onMutationUpdate =
        typeof this.state.composer === 'object' && this.state.composer.onMutationUpdate
          ? this.state.composer.onMutationUpdate
          : (store, data) => addDecisionToQueries(store, data);
      const post =
        typeof this.state.composer === 'object' && this.state.composer.post
          ? this.state.composer.post
          : null;
      const onDismiss =
        typeof this.state.composer === 'object' && this.state.composer.onDismiss
          ? this.state.composer.onDismiss
          : () => null;
      const onSubmit =
        typeof this.state.composer === 'object' && this.state.composer.onSubmit
          ? this.state.composer.onSubmit
          : () => null;
      return (
        <MobileComposer
          post={post}
          onMutationUpdate={onMutationUpdate}
          onDismiss={this.handleModalExit(() => this.setState({composer: false}, onDismiss))}
          onSubmit={this.handleModalExit(submittedDecision =>
            this.setState({submittedDecision, composer: false}, onSubmit)
          )}
        />
      );
    }

    let post;
    if (currentUser && !currentUser.loading) {
      post = buildPostForUserPrompt(currentUser);
    }

    if (post && showPromptOverlay) {
      return (
        <NavigationContext.Consumer>
          {navigate => (
            <MobileComposer
              post={post}
              onMutationUpdate={(store, data) => addDecisionToQueries(store, data)}
              onDismiss={this.handleModalExit(() => navigate(`/tool/${typeSlug}/decisions`, true))}
              onSubmit={this.handleModalExit(submittedDecision =>
                this.setState(
                  {
                    submittedDecision
                  },
                  () => navigate(`/tool/${typeSlug}/decisions`, true)
                )
              )}
            />
          )}
        </NavigationContext.Consumer>
      );
    }

    return null;
  }
}

export default compose(
  withLocalStorage('Feed', '1'),
  withMutation(skipForceVcsConnection, mutate => ({
    skipVcsConnection: () => mutate({})
  }))
)(FeedMobile);
