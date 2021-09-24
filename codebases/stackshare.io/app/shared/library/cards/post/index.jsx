import React, {Fragment, useContext, useState, useReducer, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {compose} from 'react-apollo';
import Answers from './answers';
import {withCurrentUser} from '../../../enhancers/current-user-enhancer';
import {RouteContext} from '../../../enhancers/router-enhancer';
import {withMutation} from '../../../enhancers/graphql-enhancer';
import {ChecklistContext, UPVOTED_THREE_DECISIONS} from '../../../enhancers/checklist-enhancer';
import {withTrackEngagement} from '../../../enhancers/stream-analytics-enhancer';
import {withAnalyticsPayload, withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';
import {withLocalStorage} from '../../../enhancers/local-storage-enhancer';
import {PortalContext} from '../../modals/base/portal';
import {NavigationContext} from '../../../enhancers/router-enhancer';
import {privateMode} from '../../../../data/shared/queries';
import {withPrivateMode} from '../../../../shared/enhancers/private-mode-enchancer';
import {PrivateModeContext} from '../../../../shared/enhancers/private-mode-enchancer';
import {destroyStackDecision, toggleBookmark} from '../../../../data/feed/mutations';
import {toggleUpvote} from '../../../../data/shared/mutations';
import {
  handleToggleBookmark,
  handleToggleUpvote,
  handleDestroyStackDecision
} from '../../../../data/shared/mutation-handlers';
import {ASH, SHADOW, GUNSMOKE, IRON, MAKO, WHITE, FOCUS_BLUE} from '../../../style/colors';
import {BASE_TEXT, WEIGHT} from '../../../style/typography';
import {PHONE} from '../../../style/breakpoints';
import DwellTracker from '../../../utils/dwell-tracker';
import {scrollIntoView} from '../../../utils/scroll';
import {truncateText, truncateWords} from '../../../utils/truncate-text';
import {stripURL, stripTags} from '../../../utils/strip-text';
import {buildPostFromDecision, taggableStack} from '../../composer/utils';
import {STACK_OWNER_TYPE_COMPANY, STACK_OWNER_TYPE_USER} from '../../composer/constants';
import Bookmark from '../../../../bundles/feed/components/decision-card/bookmark';
import Content from '../../../../bundles/feed/components/decision-card/content';
import Avatar from '../../../../bundles/feed/components/decision-card/avatar';
import Upvotes from '../../../../bundles/feed/components/decision-card/upvotes';
import AuthorDetails from '../../../../bundles/feed/components/decision-card/author-details';
import Comments from '../../../../bundles/feed/components/decision-card/comments';
import Share from '../../../../bundles/feed/components/decision-card/share';
import CommentPanel from '../../../../bundles/feed/components/comment-panel';
import SharePopover from '../../popovers/share';
import Stats from '../../../../bundles/feed/components/shared/stats';
import Flag from '../../../../bundles/feed/components/shared/flag';
import LinkIcon from '../../icons/external-link.svg';
import Hiring from '../../icons/were-hiring.svg';
import LeftArrowIcon from '../../icons/left-arrow.svg';
import DeleteModal from '../../modals/delete/delete-modal';
import EditDecisionModal from '../../../../bundles/feed/components/decision-card/edit-decision-modal';
import ComposerProvider from '../../../../shared/library/composer/state/provider';
import {Composer} from '../../composer';
import DraftNotice from '../../../../bundles/feed/components/decision-card/draft-notice';
import FirstRun from '../../../../bundles/feed/components/decision-card/first-run';

import {
  DecisionLink,
  Footer,
  ActionPanel,
  ActionLink,
  ContentPanel,
  Wrapper,
  FIRST_RUN_POSITION
} from '../../../../bundles/feed/components/decision-card';

import {
  DECISIONS_FIRST_RUN_SEEN_KEY,
  getFirstRunState,
  PERMALINK
} from '../../../../bundles/feed/components/shared/feed-notice';

import ServiceTile, {MICRO} from '../../tiles/service';
import ServiceDetailsPopover from '../../../../bundles/feed/components/shared/service-details';

import {LIGHT, DOMAIN, SIGN_IN_PATH} from '../../../../bundles/feed/constants/utils';

import {
  POST_TYPE_DESCRIPTIONS,
  POST_TYPE_ICONS,
  POST_TYPE_FREEFORM,
  POST_TYPE_PROTIP,
  POST_TYPE_MIGRATION,
  POST_TYPE_TOOL,
  POST_TYPE_GIVE_ADVICE,
  POST_TYPE_GET_ADVICE,
  CONTEXT_ITEM_TYPE_COMPANY,
  CONTEXT_ITEM_TYPE_STACK
} from './constants';

import {
  FEED_CLICK_CARD_TYPE_DECISION,
  FEED_CLICK_TOOL_FOLLOW,
  FEED_DWELL_CARD,
  FEED_HOVER_TOOL_POPOVER,
  FEED_CLICK_CARD_SHARE,
  FEED_CLICK_TOOL_POPOVER,
  FEED_CLICK_TOOL_FOLLOW_LOCATION_TOOL_POPOVER,
  FEED_CLICK_DELETE_DECISION,
  FEED_CLICK_EDIT_DECISION
} from '../../../../bundles/feed/constants/analytics';

import {DWELL} from '../../../../bundles/feed/constants/stream-analytics';

import SimpleButton from '../../buttons/base/simple';
import Overlay from '../../overlays';
import Hint from '../../popovers/hint';
import {LEFT} from '../../../constants/placements';
import {DEACTIVATE_MODE_CLICK} from '../../popovers/base';

import reducer from './reducer';
import initialState from './state';
import {
  POST_TOGGLE_COMMENTS,
  POST_OPEN_COMPOSER,
  POST_CLOSE_COMPOSER,
  POST_SET_NEW_COMMENT,
  POST_ADD_ACTIVE_REPLY,
  POST_REMOVE_ACTIVE_REPLY,
  POST_TOGGLE_DELETE_MODAL,
  POST_TOGGLE_EDIT_MODE,
  POST_TOGGLE_EDIT_MODE_PERMALINK,
  POST_TOGGLE_SHOW_FIRST_RUN,
  POST_TOGGLE_SHOW_UPVOTE_HINT,
  POST_TOGGLE_SHOW_ADVICE_COMPOSER
} from './actions';

import ContextItem from './contextItem';

import {STRUCTURE_GIVE_ADVICE} from '../../composer/constants';
import {MobileComposerContext} from '../../composer/mobile';
import {hasFeature} from '../../../utils/has-feature';
import {FEATURE_PREMIUM_COMPANY_PROFILE} from '../../../constants/features';

const CONTEXT_MARGIN = 7;

const StyledWrapper = glamorous(Wrapper)({}, ({permalink = false}) => ({
  [PHONE]: {
    width: permalink ? '100%' : 'calc(100vw - 20px)',
    minWidth: permalink ? '100%' : 'calc(100% - 20px)'
  }
}));

const StyledFooter = glamorous(Footer)({
  display: 'flex',
  flexDirection: 'column',
  [PHONE]: {
    borderLeft: 0,
    borderRight: 0
  },
  "&[data-parent='false']": {borderLeft: 0, borderRight: 0},
  "&[data-parent='true']": {borderLeft: `1px solid ${ASH}`, borderRight: `1px solid ${ASH}`}
});

const HiringIcon = glamorous(Hiring)({
  height: 15,
  margin: '7px 0 0 3px'
});

const GiveAdviceCta = glamorous(SimpleButton)({
  height: 34,
  [PHONE]: {
    padding: 4
  }
});

const FooterActions = glamorous.div({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  [PHONE]: {
    justifyContent: 'space-between',
    ' > button': {
      margin: 0
    }
  }
});

const Container = glamorous.div({
  width: '100%',
  borderRadius: 4,
  boxShadow: `0 1px 0 0 ${ASH}`,
  backgroundColor: WHITE
});

const StyledContentPanel = glamorous(ContentPanel)({
  width: '100%'
});

const Body = glamorous.div(
  {
    position: 'relative',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
    boxSizing: 'border-box',
    width: '100%'
  },
  ({paddingLeft = 20}) => ({
    paddingLeft
  })
);

const BodyWrapper = glamorous.div({
  display: 'flex',
  [PHONE]: {
    border: 0
  },
  "&[data-parent='true']": {border: `1px solid ${ASH}`, borderBottom: 0},
  "&[data-parent='false']": {border: 0, borderBottom: 0}
});

const Header = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  width: '100%'
});

const Context = glamorous.div({
  width: '100%',
  marginTop: 17,
  marginBottom: 17,
  display: 'flex',
  alignItems: 'center',
  ...BASE_TEXT,
  flexWrap: 'wrap',
  ' > svg:first-of-type': {
    marginRight: CONTEXT_MARGIN
  },
  ' > a': {
    textDecoration: 'none',
    marginRight: CONTEXT_MARGIN
  },
  ' > a:last-of-type': {
    textDecoration: 'none',
    marginRight: 0
  },
  ' > *': {
    marginBottom: 13
  },
  ' > a > span:last-of-type': {
    fontSize: 14
  }
});

const Preposition = glamorous.div({
  ...BASE_TEXT,
  fontSize: 14,
  color: GUNSMOKE,
  marginRight: CONTEXT_MARGIN
});

const Noun = glamorous.div({
  ...BASE_TEXT,
  fontSize: 14,
  fontWeight: WEIGHT.BOLD,
  color: SHADOW,
  marginRight: CONTEXT_MARGIN
});

export const ExpandContent = glamorous.span({
  zIndex: 1,
  ...BASE_TEXT,
  fontSize: 9,
  fontWeight: WEIGHT.BOLD,
  lineHeight: 1.44,
  letterSpacing: '0.14px',
  color: MAKO,
  background: WHITE,
  border: `1px solid ${IRON}`,
  padding: '3px 7px 3px 7px',
  borderRadius: 9.5,
  width: 75,
  textAlign: 'center',
  cursor: 'pointer',
  alignSelf: 'center',
  marginTop: 10
});

const StyledDecisionLink = glamorous(DecisionLink)({
  borderBottom: 0
});

const StyledLinkIcon = glamorous(LinkIcon)({
  ':hover': {
    '> g ': {
      '> rect': {
        fill: FOCUS_BLUE,
        stroke: FOCUS_BLUE
      },
      '> g': {
        fill: WHITE,
        stroke: WHITE
      }
    }
  }
});

const StyledLeftArrowIcon = glamorous(LeftArrowIcon)({
  marginRight: 8,
  [PHONE]: {
    marginRight: 4
  }
});

const StatsWrapper = glamorous.div({
  width: '100%',
  boxSizing: 'border-box',
  borderBottom: 0,
  borderTop: `1px solid ${ASH}`,
  [PHONE]: {
    borderLeft: 0,
    borderRight: 0
  },
  "&[data-parent='true']": {borderLeft: `1px solid ${ASH}`, borderRight: `1px solid ${ASH}`},
  "&[data-parent='false']": {borderLeft: 0, borderRight: 0}
});

const AnswersWrapper = glamorous.div({}, ({visible = true}) => ({
  display: visible ? 'block' : 'none'
}));

const EditModePermalinkWrapper = glamorous.div({
  width: '100%'
});

const renderServiceTile = (tool, sendAnalyticsEvent, withDetails, lazyLoadImages) => {
  if (withDetails) {
    return (
      <ServiceDetailsPopover
        key={tool.id}
        service={tool}
        onClick={() =>
          sendAnalyticsEvent(FEED_CLICK_TOOL_POPOVER, {
            id: tool.id,
            name: tool.name
          })
        }
        onActivate={() =>
          sendAnalyticsEvent(FEED_HOVER_TOOL_POPOVER, {
            id: tool.id,
            name: tool.name
          })
        }
        onFollowToggle={() =>
          sendAnalyticsEvent(FEED_CLICK_TOOL_FOLLOW, {
            state: !tool.following ? 'follow' : 'unfollow',
            id: tool.id,
            name: tool.name,
            location: FEED_CLICK_TOOL_FOLLOW_LOCATION_TOOL_POPOVER
          })
        }
      >
        <ServiceTile
          key={tool.name}
          size={MICRO}
          name={tool.name}
          href={tool.canonicalUrl}
          imageUrl={tool.imageUrl}
          rounded={true}
          slim={true}
          label={true}
          inverted={false}
          lazyLoad={lazyLoadImages}
        />
      </ServiceDetailsPopover>
    );
  } else {
    return (
      <ServiceTile
        key={tool.name}
        size={MICRO}
        name={tool.name}
        href={tool.canonicalUrl}
        imageUrl={tool.imageUrl}
        rounded={true}
        slim={true}
        label={true}
        inverted={false}
        lazyLoad={lazyLoadImages}
      />
    );
  }
};

export const renderRelationsip = (
  postType,
  structure,
  sendAnalyticsEvent,
  isPrivate = false,
  withDetails = true,
  lazyLoadImages
) => {
  switch (postType) {
    case POST_TYPE_FREEFORM:
      return (
        <Fragment>
          {structure.subjectTools.length > 0 && <Preposition>on</Preposition>}
          {structure.subjectTools.map(tool =>
            renderServiceTile(tool, sendAnalyticsEvent, withDetails, lazyLoadImages)
          )}
        </Fragment>
      );
    case POST_TYPE_PROTIP:
      return (
        <Fragment>
          {structure.subjectTools.length > 0 && <Preposition>on</Preposition>}
          {structure.subjectTools.map(tool =>
            renderServiceTile(tool, sendAnalyticsEvent, withDetails, lazyLoadImages)
          )}
        </Fragment>
      );
    case POST_TYPE_MIGRATION:
      return (
        <Fragment>
          <Preposition>from</Preposition>
          {structure.fromTools.map(tool =>
            renderServiceTile(tool, sendAnalyticsEvent, withDetails, lazyLoadImages)
          )}
          <Preposition>to</Preposition>
          {structure.toTools.map(tool =>
            renderServiceTile(tool, sendAnalyticsEvent, withDetails, lazyLoadImages)
          )}
        </Fragment>
      );
    case POST_TYPE_TOOL:
      return (
        <Fragment>
          {structure.toTools.length > 0 && (
            <Fragment>
              {isPrivate && <Preposition>to add</Preposition>}
              {structure.toTools.map(tool =>
                renderServiceTile(tool, sendAnalyticsEvent, withDetails, lazyLoadImages)
              )}
            </Fragment>
          )}
          {structure.fromTools.length > 0 && (
            <Fragment>
              {isPrivate ? (
                <Preposition>{structure.toTools.length > 0 && 'and'} to remove</Preposition>
              ) : (
                <Preposition>over</Preposition>
              )}
              {structure.fromTools.map(tool =>
                renderServiceTile(tool, sendAnalyticsEvent, withDetails, lazyLoadImages)
              )}
            </Fragment>
          )}
        </Fragment>
      );
    case POST_TYPE_GIVE_ADVICE:
      return (
        <Fragment>
          {structure.subjectTools.map((tool, index) => (
            <Fragment key={index}>
              {renderServiceTile(tool, sendAnalyticsEvent, withDetails, lazyLoadImages)}
            </Fragment>
          ))}
        </Fragment>
      );
    case POST_TYPE_GET_ADVICE:
      return (
        <Fragment>
          <Preposition>on</Preposition>
          {structure.subjectTools.map((tool, index) => (
            <Fragment key={index}>
              {renderServiceTile(tool, sendAnalyticsEvent, withDetails, lazyLoadImages)}
              {index !== structure.subjectTools.length - 1 &&
                (index === structure.subjectTools.length - 2 && <Preposition> and </Preposition>)}
            </Fragment>
          ))}
        </Fragment>
      );
    default:
      return '';
  }
};

export const renderContext = ({company, stack, lazyLoadImages}) => {
  return (
    <Fragment>
      {!stack && company && (
        <Fragment>
          <Preposition>at</Preposition>
          <ContextItem
            item={{name: company.name, imageUrl: company.imageUrl, id: company.id}}
            link={company.path}
            type={CONTEXT_ITEM_TYPE_COMPANY}
            lazyLoad={lazyLoadImages}
          />
          {hasFeature(company, FEATURE_PREMIUM_COMPANY_PROFILE) && (
            <a href={`${company.path}#jobs`} title={`${company.name} is hiring`}>
              <HiringIcon />
            </a>
          )}
        </Fragment>
      )}
      {/* Company stack, No company - “Recommends...at Airbnb (stack)” [all links to stack profile]*/}
      {stack && stack.stackOwnerType === STACK_OWNER_TYPE_COMPANY && !company && (
        <Fragment>
          <Preposition>at</Preposition>
          <ContextItem
            item={{name: stack.stackOwner, imageUrl: stack.imageUrl, id: stack.owner.id}}
            link={stack.path}
            type={CONTEXT_ITEM_TYPE_COMPANY}
            lazyLoad={lazyLoadImages}
          />
          <ContextItem
            item={{name: stack.name, imageUrl: null, id: stack.id}}
            link={stack.path}
            type={CONTEXT_ITEM_TYPE_STACK}
            paranthesis={true}
            lazyLoad={lazyLoadImages}
          />
        </Fragment>
      )}
      {/* Company stack, same Company tagged - “Recommends...at Airbnb (stack)” [all links to stack profile */}
      {stack &&
        stack.stackOwnerType === STACK_OWNER_TYPE_COMPANY &&
        company &&
        stack.stackOwnerSlug === company.slug && (
          <Fragment>
            <Preposition>at</Preposition>
            <ContextItem
              item={{name: stack.stackOwner, imageUrl: stack.imageUrl, id: stack.owner.id}}
              link={stack.path}
              type={CONTEXT_ITEM_TYPE_COMPANY}
              lazyLoad={lazyLoadImages}
            />
            <ContextItem
              item={{name: stack.name, imageUrl: null, id: stack.id}}
              link={stack.path}
              type={CONTEXT_ITEM_TYPE_STACK}
              paranthesis={true}
              lazyLoad={lazyLoadImages}
            />
          </Fragment>
        )}
      {/* Company stack, different Company tagged - “Recommends...at Airbnb (stack)” [company name links to company profile, stack links to
          //   stack profile] */}
      {stack &&
        stack.stackOwnerType === STACK_OWNER_TYPE_COMPANY &&
        company &&
        stack.stackOwnerSlug !== company.slug && (
          <Fragment>
            <Preposition>at</Preposition>
            <ContextItem
              item={{name: company.name, imageUrl: company.imageUrl, id: company.id}}
              link={company.path}
              type={CONTEXT_ITEM_TYPE_COMPANY}
              lazyLoad={lazyLoadImages}
            />
            <ContextItem
              item={{name: stack.name, imageUrl: null, id: stack.id}}
              link={stack.path}
              type={CONTEXT_ITEM_TYPE_STACK}
              paranthesis={true}
              lazyLoad={lazyLoadImages}
            />
          </Fragment>
        )}
      {/* Personal stack, No company - “Recommends...in [stackname]” [links to stack profile]*/}
      {stack && stack.stackOwnerType === STACK_OWNER_TYPE_USER && !company && (
        <Fragment>
          <Preposition>in</Preposition>
          <ContextItem
            item={{name: stack.name, imageUrl: null, id: stack.id}}
            link={stack.path}
            type={CONTEXT_ITEM_TYPE_STACK}
            lazyLoad={lazyLoadImages}
          />
        </Fragment>
      )}
      {/* Personal stack, Company tagged - “Recommends...at Airbnb (stack)” [company name links to company profile, stack links to stack profile] */}
      {stack && stack.stackOwnerType === STACK_OWNER_TYPE_USER && company && (
        <Fragment>
          <Preposition>at</Preposition>
          <ContextItem
            item={{name: company.name, imageUrl: company.imageUrl, id: company.id}}
            link={company.path}
            type={CONTEXT_ITEM_TYPE_COMPANY}
            lazyLoad={lazyLoadImages}
          />
          <ContextItem
            item={{name: stack.name, imageUrl: null, id: stack.id}}
            link={stack.path}
            type={CONTEXT_ITEM_TYPE_STACK}
            paranthesis={true}
            lazyLoad={lazyLoadImages}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

renderContext.propTypes = {
  company: PropTypes.object,
  stack: PropTypes.object,
  lazyLoadImages: PropTypes.bool
};

const PostCard = ({
  post,
  post: {
    id,
    decisionType,
    permissions,
    user,
    services,
    subjectTools = [],
    toTools,
    fromTools,
    company,
    stack,
    htmlContent,
    link,
    commentsCount,
    viewCount,
    upvotesCount,
    upvoted,
    publicId,
    rootComments,
    bookmarked,
    flagged,
    draft,
    publishedAt,
    topics,
    rawContent,
    answers = {edges: [], count: 0, pageInfo: {hasNextPage: false, endCursor: null}}
  },
  onStackProfile = false,
  index = null,
  onPermalink = false,
  child = null,
  childCard = false,
  storageProvider,
  expanded = false,
  isPermalinkModal = false,
  trackEngagement,
  sendAnalyticsEvent,
  sharedProps = {},
  currentUser,
  analyticsPayload,
  theme = LIGHT,
  onBookmarkToggle,
  disableFirstRun,
  isFirstNonUpvoted,
  onUpvoteToggle,
  onDelete,
  lazyLoadImages
}) => {
  let postType, postStructure, isPrivate;
  isPrivate = post.private;
  if (!decisionType) {
    postType = POST_TYPE_FREEFORM;
    postStructure = {subjectTools: services};
  } else {
    postType = decisionType;
    postStructure = {fromTools, subjectTools, toTools};
  }
  const [state, dispatch] = useReducer(reducer, initialState({expanded, isPermalinkModal}));
  const {
    commentsVisible,
    composerExpanded,
    newComment,
    activeReplies,
    showDeleteModal,
    editMode,
    editModePermalink,
    showFirstRun,
    showUpvoteHint,
    showAdviceComposer
  } = state;

  const el = useRef(null);
  const composerRef = useRef(null);

  const setFirstRun = () => {
    if (currentUser && !currentUser.loading) {
      const showPrompt = currentUser.decisionPrompt && currentUser.decisionPrompt.active;
      const {position} = sharedProps;
      const firstRunState = !disableFirstRun && getFirstRunState(storageProvider);
      if (firstRunState.showFirstRun && !showPrompt && position === FIRST_RUN_POSITION) {
        dispatch({type: POST_TOGGLE_SHOW_FIRST_RUN, value: firstRunState.showFirstRun});
      }
    }
  };

  const navigate = useContext(NavigationContext);
  const {checklistAction, resetChecklistAction} = useContext(ChecklistContext);
  const portalRef = useContext(PortalContext);
  const privateMode = useContext(PrivateModeContext);
  const {decisionId: parentDecisionId} = useContext(RouteContext);
  const permalink = `/${user.username}/decisions/${publicId}`;

  useEffect(() => {
    if (portalRef && onPermalink && index === 0 && childCard && id === parentDecisionId) {
      // Remove this and replace with more robust solution after launch (thunk?)
      setTimeout(() => {
        if (portalRef && portalRef.current && el && el.current) {
          scrollIntoView(portalRef.current, el.current, 0, 1000, () => {});
        }
      }, 300);
    }
    const {streamId, cardPosition} = analyticsPayload;
    const dwellTracker = new DwellTracker(el.current, time => {
      sendAnalyticsEvent(FEED_DWELL_CARD, {time});
      trackEngagement(DWELL, streamId, 20, cardPosition);
    });
    setFirstRun();

    if (currentUser && storageProvider.getItem(PERMALINK) === permalink) {
      storageProvider.removeItem(PERMALINK);
      dispatch({type: POST_TOGGLE_SHOW_ADVICE_COMPOSER, value: true});
    }

    return () => {
      dwellTracker.destroy();
    };
  }, []);

  useEffect(() => {
    if (currentUser && !currentUser.loading) {
      setFirstRun();
    }
  }, [currentUser]);

  useEffect(() => {
    if (
      currentUser &&
      !currentUser.loading &&
      checklistAction === UPVOTED_THREE_DECISIONS &&
      isFirstNonUpvoted
    ) {
      resetChecklistAction && resetChecklistAction();
      scrollIntoView(document.documentElement, el.current, 100, 1000, () => {
        dispatch({type: POST_TOGGLE_SHOW_UPVOTE_HINT, value: true});
      });
    }
  }, [currentUser, checklistAction, isFirstNonUpvoted]);

  const toggleComments = () => {
    if (childCard && !showChildCommentPanel) {
      setShowChildCommentPanel(true);
    }
    if (commentsCount > 0 && activeReplies.size === 0) {
      dispatch({type: POST_TOGGLE_COMMENTS, visible: !commentsVisible});
    } else {
      if (composerExpanded && newComment.length === 0) {
        dispatch({type: POST_CLOSE_COMPOSER});
      } else {
        dispatch({type: POST_OPEN_COMPOSER});
      }
    }
  };

  const showMobileComposer = useContext(MobileComposerContext);
  const handleGiveAdviceClick = () => {
    if (!currentUser) {
      storageProvider.setItem(PERMALINK, permalink);
      navigate(SIGN_IN_PATH);
      return;
    }
    if (typeof showMobileComposer === 'function') {
      // capture current scroll position so it can be reset later
      const pos = document.documentElement.scrollTop;
      showMobileComposer({
        post: {
          decisionType: STRUCTURE_GIVE_ADVICE,
          parentId: id,
          private: post.private
        },
        onMutationUpdate: (dataProxy, data) => setNewAnswer(data),
        onDismiss: () => scrollTo(document.documentElement, pos),
        onSubmit: () => scrollTo(document.documentElement, pos)
      });
    } else {
      dispatch({type: POST_TOGGLE_SHOW_ADVICE_COMPOSER, value: true});
    }
    // Remove this and replace with more robust solution after launch (thunk?)
    // setTimeout(() => {
    //   scrollIntoView(
    //     portalRef && portalRef.current ? portalRef.current : document.documentElement,
    //     el.current,
    //     0,
    //     1000,
    //     () => {}
    //   );
    // }, 300);
  };

  const [newAnswer, setNewAnswer] = useState(null);
  const [showChildCommentPanel, setShowChildCommentPanel] = useState(true);

  const upvotesComponent = (
    <Upvotes
      decisionId={id}
      upvoted={upvoted}
      onUpvoteToggle={onUpvoteToggle}
      analyticsPayload={analyticsPayload}
      upvotesCount={upvotesCount}
    />
  );

  let commentsRef;

  const taggedStack = stack ? taggableStack(stack) : null;
  return (
    <Fragment>
      {showFirstRun && (
        <FirstRun
          onDismiss={() => {
            dispatch({type: POST_TOGGLE_SHOW_FIRST_RUN, value: false});
            storageProvider.setItem(DECISIONS_FIRST_RUN_SEEN_KEY, true);
          }}
        />
      )}
      <StyledWrapper
        innerRef={el}
        style={{
          zIndex: showFirstRun || showUpvoteHint ? 100001 : 'auto',
          boxShadow: 'none',
          background: 'none'
        }}
        theme={theme}
        permalink={isPermalinkModal}
      >
        {!editModePermalink && (
          <Container data-testid="decisionCard">
            <BodyWrapper data-parent={!childCard}>
              <Body paddingLeft={postType === POST_TYPE_GIVE_ADVICE && childCard ? 15 : 20}>
                <Bookmark
                  decisionId={id}
                  bookmarked={bookmarked}
                  onBookmarkToggle={onBookmarkToggle}
                  theme={theme}
                  analyticsPayload={analyticsPayload}
                />

                <Header>
                  <Avatar user={user} lazyLoad={lazyLoadImages} />
                  <AuthorDetails
                    user={user}
                    publishedAt={publishedAt}
                    theme={theme}
                    permalink={permalink}
                    isPrivate={post.private}
                    privateMode={privateMode}
                  />
                </Header>
                <StyledContentPanel theme={theme}>
                  {draft && !isPermalinkModal && (
                    <DraftNotice
                      onToggleEditMode={() => dispatch({type: POST_TOGGLE_EDIT_MODE, value: true})}
                    />
                  )}
                  <Context>
                    {postType === POST_TYPE_GIVE_ADVICE &&
                    (postStructure &&
                      postStructure.subjectTools &&
                      postStructure.subjectTools.length === 0) ? (
                      <></>
                    ) : (
                      <>
                        {POST_TYPE_ICONS[postType]}
                        <Noun>{POST_TYPE_DESCRIPTIONS[postType]}</Noun>
                        {renderRelationsip(
                          postType,
                          postStructure,
                          sendAnalyticsEvent,
                          isPrivate,
                          true,
                          lazyLoadImages
                        )}
                        {(company || taggedStack) &&
                          renderContext({company, stack: taggedStack, lazyLoadImages})}
                      </>
                    )}
                  </Context>
                  <Content
                    htmlContent={htmlContent}
                    theme={theme}
                    analyticsPayload={analyticsPayload}
                    author={user}
                    decisionId={id}
                    expanded={expanded}
                    gradientColor={WHITE}
                    ToggleComponent={ExpandContent}
                  />
                  {permissions && permissions.delete && (
                    <ActionPanel>
                      <ActionLink
                        theme={theme}
                        onClick={() => {
                          sendAnalyticsEvent(FEED_CLICK_EDIT_DECISION);
                          if (!isPermalinkModal) {
                            dispatch({type: POST_TOGGLE_EDIT_MODE, value: true});
                          } else {
                            dispatch({type: POST_TOGGLE_EDIT_MODE_PERMALINK, value: true});
                          }
                        }}
                      >
                        Edit
                      </ActionLink>
                      <span>&nbsp;&middot;&nbsp;</span>
                      <ActionLink
                        theme={theme}
                        onClick={() => {
                          sendAnalyticsEvent(FEED_CLICK_DELETE_DECISION, {
                            decisionText: rawContent,
                            topics: topics.map(topic => topic.name),
                            'company.id': company ? company.id : null,
                            'company.name': company ? company.name : null,
                            'company.path': company ? company.path : null
                          });
                          dispatch({type: POST_TOGGLE_DELETE_MODAL, visible: true});
                        }}
                      >
                        Delete
                      </ActionLink>
                    </ActionPanel>
                  )}
                </StyledContentPanel>
              </Body>
            </BodyWrapper>
            {link && link.url ? (
              <StyledDecisionLink
                borderBottom={showAdviceComposer || postType !== POST_TYPE_GET_ADVICE ? 0 : 1}
                href={link.url}
                rel="nofollow"
              >
                <StyledLinkIcon />
                {link.title && truncateText(link.title, 170)} ({stripURL(link.url)})
              </StyledDecisionLink>
            ) : (
              ''
            )}
            {(Boolean(viewCount) || Boolean(upvotesCount) || Boolean(commentsCount)) && (
              <StatsWrapper data-parent={!childCard}>
                <Stats
                  views={viewCount}
                  upvotes={upvotesCount}
                  comments={postType !== POST_TYPE_GET_ADVICE ? commentsCount : 0}
                  onCommentsToggle={toggleComments}
                />
              </StatsWrapper>
            )}
            <StyledFooter theme={null} data-parent={!childCard}>
              <FooterActions>
                {postType === POST_TYPE_GET_ADVICE && (
                  <GiveAdviceCta onClick={handleGiveAdviceClick}>
                    <StyledLeftArrowIcon />
                    Give advice
                  </GiveAdviceCta>
                )}
                {showUpvoteHint ? (
                  <Hint
                    placement={LEFT}
                    anchor={upvotesComponent}
                    hint="Upvote a decision to encourage the contributor to share more content"
                    customStyle={{marginRight: 36}}
                  />
                ) : (
                  upvotesComponent
                )}
                {postType !== POST_TYPE_GET_ADVICE && (
                  <Comments
                    innerRef={ref => (commentsRef = ref)}
                    commentsVisible={commentsVisible}
                    commentsCount={commentsCount}
                    onCommentsToggle={toggleComments}
                    analyticsPayload={analyticsPayload}
                  />
                )}
                {!post.private && (
                  <SharePopover
                    url={`${DOMAIN}${permalink}`}
                    title={`${stripTags(truncateWords(htmlContent)).replace(/{|}|#/g, '')}`}
                    analyticsEventName={FEED_CLICK_CARD_SHARE}
                    deactivateMode={DEACTIVATE_MODE_CLICK}
                  >
                    <Share />
                  </SharePopover>
                )}
                {currentUser && currentUser.canIModerate && (
                  <Flag
                    itemId={id}
                    itemType={FEED_CLICK_CARD_TYPE_DECISION}
                    flagged={flagged}
                    analyticsPayload={analyticsPayload}
                  />
                )}
              </FooterActions>
            </StyledFooter>
            {postType === POST_TYPE_GET_ADVICE && (
              <AnswersWrapper
                visible={!showAdviceComposer && (postType !== POST_TYPE_GIVE_ADVICE || !childCard)}
              >
                <Answers
                  itemsData={answers}
                  parentId={id}
                  newAnswer={newAnswer}
                  child={child}
                  onPermalink={isPermalinkModal}
                  lazyLoadImages={lazyLoadImages}
                />
              </AnswersWrapper>
            )}
            {((childCard && showChildCommentPanel) ||
              (!childCard && postType !== POST_TYPE_GET_ADVICE)) && (
              <CommentPanel
                postCardRef={el}
                shouldComposerCloseOnBlur={(target, container) =>
                  !container.contains(target) && !commentsRef.contains(target)
                }
                addActiveReply={key => dispatch({type: POST_ADD_ACTIVE_REPLY, key})}
                removeActiveReply={key => dispatch({type: POST_REMOVE_ACTIVE_REPLY, key})}
                currentUser={currentUser}
                comments={rootComments}
                commentsVisible={commentsVisible}
                commentableId={id}
                commentableType={'StackDecision'}
                onUpvoteToggle={onUpvoteToggle}
                onCommentsToggle={toggleComments}
                composerExpanded={composerExpanded}
                openComposer={() => dispatch({type: POST_OPEN_COMPOSER})}
                closeComposer={() => dispatch({type: POST_CLOSE_COMPOSER})}
                setNewComment={newComment => {
                  dispatch({type: POST_SET_NEW_COMMENT, newComment});
                  dispatch({type: POST_TOGGLE_COMMENTS, visible: true});
                }}
                analyticsPayload={analyticsPayload}
                theme={null}
                isPrivate={post.private}
                onStackProfile={onStackProfile}
              />
            )}
            {postType === POST_TYPE_GET_ADVICE && showAdviceComposer && (
              <ComposerProvider
                innerRef={composerRef}
                post={{
                  decisionType: STRUCTURE_GIVE_ADVICE,
                  parentId: id,
                  subjectTools,
                  private: post.private
                }}
                privateMode={privateMode}
              >
                <Composer
                  onMutationUpdate={(dataProxy, data) => setNewAnswer(data)}
                  onCancel={() => dispatch({type: POST_TOGGLE_SHOW_ADVICE_COMPOSER, value: false})}
                  onSubmit={() => dispatch({type: POST_TOGGLE_SHOW_ADVICE_COMPOSER, value: false})}
                />
              </ComposerProvider>
            )}
          </Container>
        )}
        {showDeleteModal && (
          <DeleteModal
            onDismiss={() => dispatch({type: POST_TOGGLE_DELETE_MODAL, visible: false})}
            onSubmit={onDelete}
            objectType="decision"
            objectId={id}
          />
        )}
        {isPermalinkModal && editModePermalink && (
          <EditModePermalinkWrapper>
            <ComposerProvider post={buildPostFromDecision(post)}>
              <Composer
                onCancel={() => dispatch({type: POST_TOGGLE_EDIT_MODE_PERMALINK, value: false})}
                onSubmit={() => dispatch({type: POST_TOGGLE_EDIT_MODE_PERMALINK, value: false})}
                editMode={editModePermalink}
              />
            </ComposerProvider>
          </EditModePermalinkWrapper>
        )}
        {editMode && (
          <EditDecisionModal
            preventClickAway
            onDismiss={() => dispatch({type: POST_TOGGLE_EDIT_MODE, value: false})}
            decision={post}
            position="top"
            editMode={editMode}
          />
        )}
      </StyledWrapper>
      {showUpvoteHint && (
        <Overlay
          onDismiss={() => dispatch({type: POST_TOGGLE_SHOW_UPVOTE_HINT, value: false})}
          dismissOnClick={true}
        />
      )}
    </Fragment>
  );
};

PostCard.propTypes = {
  post: PropTypes.object,
  expanded: PropTypes.bool,
  isPermalinkModal: PropTypes.bool,
  sendAnalyticsEvent: PropTypes.func,
  sharedProps: PropTypes.object,
  currentUser: PropTypes.object,
  analyticsPayload: PropTypes.object,
  theme: PropTypes.string,
  onBookmarkToggle: PropTypes.func,
  disableFirstRun: PropTypes.bool,
  isFirstNonUpvoted: PropTypes.bool,
  onUpvoteToggle: PropTypes.func,
  trackEngagement: PropTypes.func,
  storageProvider: PropTypes.object,
  onDelete: PropTypes.func,
  childCard: PropTypes.bool,
  child: PropTypes.any,
  index: PropTypes.number,
  onPermalink: PropTypes.bool,
  onStackProfile: PropTypes.bool,
  lazyLoadImages: PropTypes.bool
};

export default compose(
  withLocalStorage('Feed', '1'),
  withAnalyticsPayload({type: 'decision'}),
  withSendAnalyticsEvent,
  withTrackEngagement,
  withCurrentUser,
  withPrivateMode(privateMode),
  withMutation(toggleBookmark, mutate => handleToggleBookmark(mutate)),
  withMutation(toggleUpvote, mutate => handleToggleUpvote(mutate)),
  withMutation(destroyStackDecision, mutate => handleDestroyStackDecision(mutate))
)(PostCard);
