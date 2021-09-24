import React, {Component} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Link from '../../../../shared/library/typography/link';
import {stripURL, stripTags} from '../../../../shared/utils/strip-text';
import {grid} from '../../../../shared/utils/grid';
import {truncateText, truncateWords} from '../../../../shared/utils/truncate-text';
import {CATHEDRAL, WHITE, ASH, CHARCOAL, TARMAC} from '../../../../shared/style/colors';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import {
  FEED_CLICK_TOOL_FOLLOW,
  FEED_HOVER_TOOL_POPOVER,
  FEED_DWELL_CARD,
  FEED_CLICK_TOOL_FOLLOW_LOCATION_TOOL_POPOVER,
  FEED_CLICK_DELETE_DECISION,
  FEED_CLICK_EDIT_DECISION,
  FEED_CLICK_CARD_TYPE_DECISION,
  FEED_CLICK_TOOL_POPOVER,
  FEED_CLICK_CARD_SHARE
} from '../../constants/analytics';
import {DWELL} from '../../constants/stream-analytics';
import {Container, MetaPanel} from '../article-card/article-card';
import AuthorDetails from './author-details';
import DecisionMetadata from './decision-metadata';
import Upvotes from './upvotes';
import Flag from '../shared/flag';
import Bookmark from './bookmark';
import Avatar from './avatar';
import Content from './content';
import Comments from './comments';
import DwellTracker from '../../../../shared/utils/dwell-tracker';
import ServiceDetailsPopover from '../shared/service-details';
import ServiceTile, {MICRO} from '../../../../shared/library/tiles/service.jsx';
import CommentPanel from '../comment-panel';
import DeleteModal from '../../../../shared/library/modals/delete/delete-modal';
import EditDecisionModal from './edit-decision-modal';
import Stats from '../shared/stats';
import {
  withAnalyticsPayload,
  withSendAnalyticsEvent
} from '../../../../shared/enhancers/analytics-enhancer';
import {withCurrentUser} from '../../../../shared/enhancers/current-user-enhancer';
import {withPrivateMode} from '../../../../shared/enhancers/private-mode-enchancer';
import FirstRun from './first-run';
import {HOVER, PHONE} from '../../../../shared/style/breakpoints';
import LinkIcon from './icons/link-icon.svg';
import {withTrackEngagement} from '../../../../shared/enhancers/stream-analytics-enhancer';
import {withMutation} from '../../../../shared/enhancers/graphql-enhancer';
import {destroyStackDecision, toggleBookmark} from '../../../../data/feed/mutations';
import {toggleUpvote} from '../../../../data/shared/mutations';
import {withLocalStorage} from '../../../../shared/enhancers/local-storage-enhancer';
import {DECISIONS_FIRST_RUN_SEEN_KEY, getFirstRunState} from '../shared/feed-notice';
import {currentUserLoaded} from '../../../../data/feed/utils';
import {LIGHT, DARK, DOMAIN} from '../../constants/utils';
import Share from './share';
import SharePopover from '../../../../shared/library/popovers/share';
import {DEACTIVATE_MODE_CLICK} from '../../../../shared/library/popovers/base';
import {ID} from '../../../../shared/utils/graphql';
import {
  withChecklistContext,
  UPVOTED_THREE_DECISIONS
} from '../../../../shared/enhancers/checklist-enhancer';
import {
  handleToggleBookmark,
  handleToggleUpvote,
  handleDestroyStackDecision
} from '../../../../data/shared/mutation-handlers';
import Hint from '../../../../shared/library/popovers/hint';
import {LEFT} from '../../../../shared/constants/placements';
import Overlay from '../../../../shared/library/overlays';
import {scrollIntoView} from '../../../../shared/utils/scroll';
import DraftNotice from './draft-notice';
import DecisionComposer from '../decision-composer';

export const FIRST_RUN_POSITION = 1;

export const Wrapper = glamorous(Container)(
  {
    alignItems: 'flex-start',
    border: 0
  },
  ({theme}) =>
    theme === LIGHT && {
      [PHONE]: {
        width: '100vw'
      }
    }
);

const Decision = glamorous.div(
  {
    paddingBottom: 40,
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  },
  ({theme}) => ({
    padding: theme === LIGHT ? 30 : 21,
    [PHONE]: {
      padding: theme === LIGHT ? 18 : 21
    },
    backgroundColor: theme === LIGHT ? WHITE : CATHEDRAL,
    color: theme === LIGHT ? CATHEDRAL : WHITE
  })
);

const AuthorPanel = glamorous.header({
  display: 'flex',
  flexDirection: 'row',
  background: 'transparent',
  border: 0
});

export const ContentPanel = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  [PHONE]: {
    marginLeft: 0
  }
});

export const Footer = glamorous(MetaPanel)(
  {
    alignItems: 'center',
    borderLeft: `1px solid ${ASH}`,
    borderRight: `1px solid ${ASH}`,
    padding: '10px 16px'
  },
  ({theme}) =>
    theme === LIGHT ? {borderLeft: 0, borderRight: 0, borderTop: `1px solid ${ASH}`} : null
);

const AttributesList = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
  flexWrap: 'wrap',
  marginTop: 20,
  fontSize: 20,
  '> *': {
    marginRight: 13,
    marginBottom: 8
  }
});

const Topic = glamorous.div(
  {
    ...BASE_TEXT,
    fontSize: 16,
    fontWeight: WEIGHT.BOLD
  },
  ({theme}) => ({
    color: theme === LIGHT ? CATHEDRAL : WHITE
  })
);

export const MetaCopy = glamorous.div({
  ...BASE_TEXT,
  letterSpacing: '0.2px',
  fontWeight: WEIGHT.BOLD
});

export const ActionPanel = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginTop: 10,
  [PHONE]: {
    display: 'none'
  }
});

export const ActionLink = glamorous.button(
  {
    ...BASE_TEXT,
    fontSize: 12,
    cursor: 'pointer',
    border: 0,
    outline: 'none',
    padding: 0
  },
  ({theme}) => ({
    background: theme === LIGHT ? WHITE : 'none',
    color: theme === LIGHT ? CATHEDRAL : WHITE,
    [HOVER]: {
      ':hover': {
        color: theme === LIGHT ? CATHEDRAL : ASH
      }
    }
  })
);

export const StatsWrapper = glamorous.div(
  {
    width: '100%',
    boxSizing: 'border-box',
    borderLeft: `1px solid ${ASH}`,
    borderRight: `1px solid ${ASH}`
  },
  ({theme}) =>
    theme === LIGHT ? {borderLeft: 0, borderRight: 0, borderTop: `1px solid ${ASH}`} : null
);

export const DecisionLink = glamorous(Link)({
  fontWeight: WEIGHT.BOLD,
  fontSize: 14,
  color: CHARCOAL,
  display: 'flex',
  alignItems: 'center',
  padding: grid(2),
  border: `1px solid ${ASH}`,
  '&:hover': {
    color: TARMAC
  },
  '& svg': {
    flex: 'none',
    marginRight: grid(1)
  }
});

export class DecisionCard extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    id: ID,
    publicId: PropTypes.string,
    sendAnalyticsEvent: PropTypes.func,
    trackEngagement: PropTypes.func,
    analyticsPayload: PropTypes.object.isRequired,
    services: PropTypes.array,
    bookmarked: PropTypes.bool,
    upvoted: PropTypes.bool,
    flagged: PropTypes.bool,
    privateItem: PropTypes.bool,
    upvotesCount: PropTypes.number,
    commentsCount: PropTypes.number,
    viewCount: PropTypes.number,
    topics: PropTypes.array,
    rootComments: PropTypes.array,
    rawContent: PropTypes.string,
    htmlContent: PropTypes.string,
    link: PropTypes.object,
    onBookmarkToggle: PropTypes.func,
    onUpvoteToggle: PropTypes.func,
    publishedAt: PropTypes.string,
    onDelete: PropTypes.func,
    user: PropTypes.shape({
      id: ID,
      displayName: PropTypes.string,
      username: PropTypes.string,
      title: PropTypes.string,
      imageUrl: PropTypes.string,
      path: PropTypes.string,
      companyName: PropTypes.string
    }),
    company: PropTypes.shape({
      id: ID,
      name: PropTypes.string,
      imageUrl: PropTypes.string,
      path: PropTypes.string
    }),
    storageProvider: PropTypes.object,
    position: PropTypes.number,
    theme: PropTypes.oneOf([LIGHT, DARK]),
    expanded: PropTypes.bool,
    disableFirstRun: PropTypes.bool,
    checklistContext: PropTypes.object,
    isFirstNonUpvoted: PropTypes.bool,
    isDraft: PropTypes.bool,
    isPermalinkModal: PropTypes.bool,
    privateMode: PropTypes.any
  };

  static defaultProps = {
    services: [],
    topics: [],
    disableFirstRun: false,
    theme: DARK,
    expanded: false,
    checklistContext: {}
  };

  state = {
    showComments: this.props.expanded || this.props.isPermalinkModal,
    showDeleteModal: false,
    composerExpanded: false,
    newComment: '',
    editMode: false,
    activeReplies: new Set(),
    showFirstRun: false,
    showUpvoteHint: false,
    editModePermalink: false
  };

  componentDidMount() {
    const {trackEngagement, sendAnalyticsEvent, analyticsPayload} = this.props;
    const {streamId, cardPosition} = analyticsPayload;
    this.dwellTracker = new DwellTracker(this._el, time => {
      sendAnalyticsEvent(FEED_DWELL_CARD, {time});
      trackEngagement(DWELL, streamId, 20, cardPosition);
    });
    this.setFirstRun();
  }

  componentDidUpdate(prevProps) {
    const {
      currentUser,
      checklistContext: {checklistAction, resetChecklistAction}
    } = this.props;

    if (currentUserLoaded(prevProps, this.props)) {
      this.setFirstRun();
    }

    if (
      currentUser &&
      !currentUser.loading &&
      checklistAction === UPVOTED_THREE_DECISIONS &&
      this.props.isFirstNonUpvoted
    ) {
      resetChecklistAction && resetChecklistAction();
      scrollIntoView(document.documentElement, this._el, 100, 1000, () => {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({showUpvoteHint: true});
      });
    }
  }

  setFirstRun() {
    const {currentUser, position, storageProvider, disableFirstRun} = this.props;
    if (currentUser && !currentUser.loading) {
      const showPrompt = currentUser.decisionPrompt && currentUser.decisionPrompt.active;
      const {showFirstRun} = !disableFirstRun && getFirstRunState(storageProvider);
      if (showFirstRun && !showPrompt && position === FIRST_RUN_POSITION) {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({showFirstRun});
      }
    }
  }

  componentWillUnmount() {
    this.dwellTracker.destroy();
  }

  setNewComment = newComment => {
    this.setState({newComment: newComment});
  };

  addActiveReply = key => {
    const {activeReplies} = this.state;
    activeReplies.add(key);
    this.setState({activeReplies: activeReplies});
  };

  removeActiveReply = key => {
    const {activeReplies} = this.state;
    activeReplies.delete(key);
    this.setState({activeReplies: activeReplies});
  };

  activeReply = () => {
    const {activeReplies} = this.state;
    return activeReplies.size > 0;
  };

  toggleComments = () => {
    const {composerExpanded, newComment} = this.state;

    if (this.props.commentsCount > 0 && !this.activeReply()) {
      this.setState({showComments: !this.state.showComments});
    } else {
      if (composerExpanded && newComment.length === 0) {
        this.closeComposer();
      } else {
        this.openComposer();
      }
    }
  };

  openComposer = () => {
    this.setState({composerExpanded: true});
  };

  closeComposer = () => {
    this.setState({composerExpanded: false});
  };

  toggleDeleteModal = () => {
    this.setState({showDeleteModal: !this.state.showDeleteModal});
  };

  toggleEditMode = () => {
    this.setState({editMode: !this.state.editMode});
    this.props.sendAnalyticsEvent(FEED_CLICK_EDIT_DECISION);
  };

  toggleEditModePermalink = () => {
    this.setState({editModePermalink: !this.state.editModePermalink});
  };

  handleDismissFirstRun = () => {
    this.setState({showFirstRun: false});
    this.props.storageProvider.setItem(DECISIONS_FIRST_RUN_SEEN_KEY, true);
  };

  handleDismissUpvoteHint = () => {
    this.setState({showUpvoteHint: false});
  };

  render() {
    const {
      currentUser,
      id,
      publicId,
      user,
      company,
      rawContent,
      htmlContent,
      services,
      topics,
      bookmarked,
      upvoted,
      flagged,
      rootComments,
      upvotesCount,
      commentsCount,
      viewCount,
      link,
      onBookmarkToggle,
      onUpvoteToggle,
      publishedAt,
      onDelete,
      analyticsPayload,
      theme,
      expanded,
      isDraft,
      isPermalinkModal,
      privateItem,
      privateMode
    } = this.props;

    const {
      showComments,
      showDeleteModal,
      composerExpanded,
      editMode,
      showFirstRun,
      showUpvoteHint,
      editModePermalink
    } = this.state;
    const isCurrentUser = currentUser && user.id === currentUser.id;

    let disablePrivateActions = false;

    if (privateMode && privateMode.id) {
      if (!(company && company.id === privateMode.id) || !privateItem) {
        disablePrivateActions = true;
      }
    }

    const serviceAttributes = services.map(service => (
      <ServiceDetailsPopover
        key={service.id}
        showJobs={!privateMode}
        service={service}
        onClick={() =>
          this.props.sendAnalyticsEvent(FEED_CLICK_TOOL_POPOVER, {
            id: service.id,
            name: service.name
          })
        }
        onActivate={() =>
          this.props.sendAnalyticsEvent(FEED_HOVER_TOOL_POPOVER, {
            id: service.id,
            name: service.name
          })
        }
        onFollowToggle={() => {
          this.props.sendAnalyticsEvent(FEED_CLICK_TOOL_FOLLOW, {
            state: !service.following ? 'follow' : 'unfollow',
            id: service.id,
            name: service.name,
            location: FEED_CLICK_TOOL_FOLLOW_LOCATION_TOOL_POPOVER
          });
        }}
      >
        <ServiceTile
          size={MICRO}
          name={service.name}
          href={service.canonicalUrl}
          imageUrl={service.imageUrl}
          label={true}
          labelSize={16}
          rounded={true}
          slim={true}
          inverted={theme === DARK}
        />
      </ServiceDetailsPopover>
    ));

    const topicAttributes = topics.map(topic => (
      <Topic key={topic.name} theme={theme}>{`#${topic.name}`}</Topic>
    ));

    const titleServicesTopics = services
      .map(service => service.name)
      .concat(topics.map(topic => topic.name))
      .join(', ');

    const permalink = `/${user.username}/decisions/${publicId}`;

    const upvotesComponent = (
      <Upvotes
        decisionId={id}
        upvoted={upvoted}
        onUpvoteToggle={onUpvoteToggle}
        analyticsPayload={analyticsPayload}
        upvotesCount={upvotesCount}
      />
    );

    return (
      <React.Fragment>
        {showFirstRun && <FirstRun onDismiss={this.handleDismissFirstRun} />}
        <Wrapper
          innerRef={el => (this._el = el)}
          style={{zIndex: showFirstRun || showUpvoteHint ? 100001 : 'auto'}}
          theme={theme}
        >
          {!editModePermalink && (
            <>
              <Decision theme={theme}>
                {!disablePrivateActions && (
                  <Bookmark
                    decisionId={id}
                    bookmarked={bookmarked}
                    onBookmarkToggle={onBookmarkToggle}
                    theme={theme}
                    analyticsPayload={analyticsPayload}
                  />
                )}
                <AuthorPanel>
                  <h2 style={{display: 'none'}}>
                    Decision {company ? `at ${company.name}` : ''} about {titleServicesTopics}
                  </h2>
                  <Avatar user={user} />
                  <AuthorDetails
                    user={user}
                    publishedAt={publishedAt}
                    theme={theme}
                    permalink={permalink}
                  />
                </AuthorPanel>
                <ContentPanel theme={theme}>
                  <DecisionMetadata company={company} theme={theme} isDraft={isDraft} />
                  {isDraft && !isPermalinkModal && (
                    <DraftNotice onToggleEditMode={this.toggleEditMode} />
                  )}
                  <AttributesList>{serviceAttributes.concat(topicAttributes)}</AttributesList>
                  <Content
                    htmlContent={htmlContent}
                    theme={theme}
                    analyticsPayload={analyticsPayload}
                    author={user}
                    decisionId={id}
                    expanded={expanded}
                  />
                  {isCurrentUser && (
                    <ActionPanel>
                      <ActionLink
                        theme={theme}
                        onClick={
                          !isPermalinkModal ? this.toggleEditMode : this.toggleEditModePermalink
                        }
                      >
                        Edit
                      </ActionLink>
                      <span>&nbsp;&middot;&nbsp;</span>
                      <ActionLink
                        theme={theme}
                        onClick={() => {
                          this.props.sendAnalyticsEvent(FEED_CLICK_DELETE_DECISION, {
                            decisionText: rawContent,
                            topics: topics.map(topic => topic.name),
                            'company.id': company ? company.id : null,
                            'company.name': company ? company.name : null,
                            'company.path': company ? company.path : null
                          });
                          this.toggleDeleteModal();
                        }}
                      >
                        Delete
                      </ActionLink>
                    </ActionPanel>
                  )}
                </ContentPanel>
              </Decision>
              {link && link.url && (
                <div style={{width: '100%'}}>
                  <DecisionLink href={link.url} rel="nofollow">
                    <LinkIcon />
                    {link.title && truncateText(link.title, 170)} ({stripURL(link.url)})
                  </DecisionLink>
                </div>
              )}
              {(Boolean(viewCount) || Boolean(upvotesCount) || Boolean(commentsCount)) && (
                <StatsWrapper theme={theme}>
                  <Stats
                    views={viewCount}
                    upvotes={upvotesCount}
                    comments={commentsCount}
                    onCommentsToggle={this.toggleComments}
                  />
                </StatsWrapper>
              )}
              <Footer theme={theme}>
                {!disablePrivateActions && showUpvoteHint ? (
                  <Hint
                    placement={LEFT}
                    anchor={upvotesComponent}
                    hint="Upvote a decision to encourage the contributor to share more content"
                    customStyle={{marginRight: 36}}
                  />
                ) : disablePrivateActions ? null : (
                  upvotesComponent
                )}
                {!disablePrivateActions && (
                  <Comments
                    innerRef={ref => (this.commentsRef = ref)}
                    commentsVisible={true}
                    commentsCount={commentsCount}
                    onCommentsToggle={this.toggleComments}
                    analyticsPayload={analyticsPayload}
                  />
                )}
                <SharePopover
                  url={`${DOMAIN}${permalink}`}
                  title={`${stripTags(truncateWords(htmlContent)).replace(/{|}|#/g, '')}`}
                  analyticsEventName={FEED_CLICK_CARD_SHARE}
                  deactivateMode={DEACTIVATE_MODE_CLICK}
                >
                  <Share />
                </SharePopover>
                {currentUser && currentUser.canIModerate && (
                  <Flag
                    itemId={id}
                    itemType={FEED_CLICK_CARD_TYPE_DECISION}
                    flagged={flagged}
                    analyticsPayload={analyticsPayload}
                  />
                )}
              </Footer>
              <CommentPanel
                shouldComposerCloseOnBlur={(target, container) =>
                  !container.contains(target) && !this.commentsRef.contains(target)
                }
                addActiveReply={this.addActiveReply}
                removeActiveReply={this.removeActiveReply}
                currentUser={currentUser}
                comments={rootComments}
                commentsVisible={showComments}
                commentableId={id}
                commentableType={'StackDecision'}
                onUpvoteToggle={onUpvoteToggle}
                onCommentsToggle={this.toggleComments}
                composerExpanded={composerExpanded}
                openComposer={this.openComposer}
                closeComposer={this.closeComposer}
                setNewComment={this.setNewComment}
                analyticsPayload={analyticsPayload}
                theme={theme}
                commentDisabled={disablePrivateActions}
              />
            </>
          )}
          {showDeleteModal && (
            <DeleteModal
              onDismiss={this.toggleDeleteModal}
              onSubmit={onDelete}
              objectType="decision"
              objectId={id}
            />
          )}
          {isPermalinkModal && editModePermalink && (
            <DecisionComposer
              decision={{rawContent, company, id, link}}
              disableRuleChecker={true}
              onDismissPrompt={this.toggleEditModePermalink}
              onCancelEdit={this.toggleEditModePermalink}
            />
          )}
          {editMode && (
            <EditDecisionModal
              onDismiss={this.toggleEditMode}
              decision={{rawContent, company, id, link}}
              position="top"
              editMode={editMode}
            />
          )}
        </Wrapper>
        {showUpvoteHint && (
          <Overlay onDismiss={this.handleDismissUpvoteHint} dismissOnClick={true} />
        )}
      </React.Fragment>
    );
  }
}

export default compose(
  withLocalStorage('Feed', '1'),
  withAnalyticsPayload({type: 'decision'}),
  withSendAnalyticsEvent,
  withTrackEngagement,
  withCurrentUser,
  withPrivateMode,
  withChecklistContext,
  withMutation(toggleBookmark, mutate => handleToggleBookmark(mutate)),
  withMutation(toggleUpvote, mutate => handleToggleUpvote(mutate)),
  withMutation(destroyStackDecision, mutate => handleDestroyStackDecision(mutate))
)(DecisionCard);
