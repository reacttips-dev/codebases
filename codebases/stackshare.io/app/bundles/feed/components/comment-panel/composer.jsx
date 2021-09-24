import React, {Component} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ALABASTER, ASH, GUNSMOKE, WHITE} from '../../../../shared/style/colors';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import Tween from '../../../../shared/library/animation/tween';
import Slide from '../../../../shared/library/animation/slide';
import CancelButton from '../../../../shared/library/buttons/base/cancel';
import SimpleButton from '../../../../shared/library/buttons/base/simple';
import ErrorModal from './error-modal';
import {
  FEED_CLICK_WRITE_COMMENT,
  FEED_CLICK_SUBMIT_COMMENT,
  FEED_CLICK_CANCEL_COMMENT
} from '../../constants/analytics';
import {withSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';
import {withMutation} from '../../../../shared/enhancers/graphql-enhancer';
import {createComment, updateComment} from '../../../../data/feed/mutations';
import {decisionFragment, commentItem} from '../../../../data/feed/fragments';
import {defaultDataIdFromObject} from 'apollo-cache-inmemory';
import {scrollIntoView} from '../../../../shared/utils/scroll';
import {withTrackEngagement} from '../../../../shared/enhancers/stream-analytics-enhancer';
import {COMMENT} from '../../constants/stream-analytics';
import {withCurrentUser} from '../../../../shared/enhancers/current-user-enhancer';
import {NavigationContext} from '../../../../shared/enhancers/router-enhancer';
import {SIGN_IN_PATH} from '../../constants/utils';
import PublicIcon from '../../../../shared/library/icons/public.svg';

export const CREATE = 'create';
export const REPLY = 'reply';
export const EDIT = 'edit';

const Container = glamorous.div(
  {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  },
  ({type}) => ({
    background: type === EDIT ? WHITE : ALABASTER
  })
);

export const Border = glamorous.div({}, ({type}) => ({
  border: `1px solid ${ASH}`,
  display: 'flex',
  flexDirection: 'column',
  margin: type !== REPLY ? 13 : 0,
  marginBottom: 16,
  position: 'relative',
  background: WHITE,
  borderBottomLeftRadius: 4,
  borderBottomRightRadius: 4
}));

export const TextArea = glamorous.textarea({
  ...BASE_TEXT,
  lineHeight: 1.7,
  outline: 'none',
  resize: 'none',
  height: 136,
  border: 0,
  boxSizing: 'content-box',
  paddingRight: 10
});

const UserPanelOverflow = glamorous.div({
  display: 'flex',
  overflow: 'visible'
});

const Panel = glamorous.div(
  {
    display: 'flex'
  },
  ({isPrivate}) => ({justifyContent: isPrivate ? 'space-between' : 'flex-end'})
);

const PublicMessage = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  ...BASE_TEXT,
  color: GUNSMOKE,
  marginTop: -15,
  marginLeft: 15,
  ' > svg': {
    marginRight: 7,
    ' path': {
      fill: GUNSMOKE
    }
  }
});

const UserPanel = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  zIndex: 1,
  height: 48,
  paddingLeft: 10,
  pointerEvents: 'none'
});

export const Avatar = glamorous.img(
  {
    borderRadius: '50%'
  },
  ({size}) => ({width: size, height: size})
);

export const ByLine = glamorous.div({
  ...BASE_TEXT,
  display: 'flex'
});

export const UserName = glamorous.div({
  fontWeight: WEIGHT.BOLD
});

const ButtonGroup = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  margin: 13,
  marginTop: 0,
  justifyContent: 'flex-end'
});

export class Composer extends Component {
  static propTypes = {
    user: PropTypes.object,
    comments: PropTypes.array,
    onCommentsToggle: PropTypes.func,
    commentsVisible: PropTypes.bool,
    createComment: PropTypes.func,
    updateComment: PropTypes.func,
    commentableId: PropTypes.string,
    commentableType: PropTypes.string,
    commentId: PropTypes.string,
    parentId: PropTypes.string,
    sendAnalyticsEvent: PropTypes.func,
    composerExpanded: PropTypes.bool,
    openComposer: PropTypes.func,
    closeComposer: PropTypes.func,
    shouldComposerCloseOnBlur: PropTypes.func,
    setNewComment: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.oneOf([CREATE, REPLY, EDIT]),
    onSubmitReply: PropTypes.func,
    onSubmitCreate: PropTypes.func,
    onCancelEdit: PropTypes.func,
    addActiveReply: PropTypes.func,
    removeActiveReply: PropTypes.func,
    replyComposerTextareaRef: PropTypes.func,
    replyComposerContainerRef: PropTypes.func,
    replyLinkRefs: PropTypes.array,
    trackEngagement: PropTypes.func,
    analyticsPayload: PropTypes.object,
    currentUser: PropTypes.object,
    comment: PropTypes.string,
    postCardRef: PropTypes.any,
    isPrivate: PropTypes.bool,
    onStackProfile: PropTypes.bool
  };

  static defaultProps = {
    parentId: null,
    replyLinkRefs: []
  };

  state = {
    expanded: false,
    error: false,
    comment: ''
  };

  container = null;
  assignContainer = el => (this.container = el);

  textarea = null;
  assignTextarea = el => (this.textarea = el);

  constructor(props) {
    super(props);
    const {addActiveReply, parentId, type} = props;
    if (type === REPLY) {
      addActiveReply(parentId);
    }
  }

  handleBlur = event => {
    const target = event.target;
    const {
      composerExpanded,
      closeComposer,
      shouldComposerCloseOnBlur,
      onCancelEdit,
      type,
      parentId,
      removeActiveReply,
      replyLinkRefs
    } = this.props;
    const {comment} = this.state;
    const shouldCloseOnBlur = shouldComposerCloseOnBlur(target, this.container);
    if (type === EDIT && shouldCloseOnBlur) {
      onCancelEdit();
    } else {
      if (shouldCloseOnBlur && !replyLinkRefs.includes(target)) {
        if (comment.length === 0 && composerExpanded) {
          closeComposer();
          if (type === REPLY) {
            removeActiveReply(parentId);
          }
        }
      }
    }
  };

  handleCancel = () => {
    const {composerExpanded, closeComposer, type, onCancelEdit} = this.props;
    if (type !== EDIT) {
      this.props.sendAnalyticsEvent(FEED_CLICK_CANCEL_COMMENT, {
        level: 0
      });
      this.setState({comment: ''}, () => {
        if (type === REPLY) {
          this.handleActiveReply();
        }
        if (composerExpanded) {
          closeComposer();
        }
      });
    } else {
      onCancelEdit();
    }
  };

  handleChange = event => {
    const {setNewComment, type} = this.props;
    const comment = event.target.value;
    this.setState({comment: comment}, () => {
      setNewComment(comment);
      if (type === REPLY) {
        this.handleActiveReply();
      }
    });
  };

  handleActiveReply() {
    const {addActiveReply, removeActiveReply, parentId} = this.props;
    const {comment} = this.state;
    const isActive = comment.length > 0;
    if (isActive) {
      addActiveReply(parentId);
    } else {
      removeActiveReply(parentId);
    }
  }

  handleFocus = navigate => {
    const {
      commentsVisible,
      onCommentsToggle,
      comments,
      composerExpanded,
      openComposer,
      currentUser
    } = this.props;

    if (!currentUser) {
      if (this.textarea) {
        this.textarea.blur();
      }
      navigate(SIGN_IN_PATH);
      return;
    }

    if (!composerExpanded) {
      this.props.sendAnalyticsEvent(FEED_CLICK_WRITE_COMMENT, {
        level: 0
      });
      openComposer();
    }
    if (!commentsVisible && comments.length > 0) {
      onCommentsToggle();
    }
  };

  componentDidMount() {
    document.addEventListener('click', this.handleBlur, false);
    const {
      type,
      replyComposerTextareaRef,
      replyComposerContainerRef,
      comment,
      postCardRef
    } = this.props;
    if (type === REPLY) {
      replyComposerContainerRef(this.container);
      replyComposerTextareaRef(this.textarea);
      scrollIntoView(
        postCardRef ? postCardRef.current : document.documentElement,
        this.container,
        300,
        500,
        () => {
          this.textarea.focus();
        }
      );
    } else if (type === EDIT) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({comment});
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleBlur, false);
  }

  handleSubmit = async () => {
    const {
      createComment,
      updateComment,
      commentableId,
      commentableType,
      commentsVisible,
      onCommentsToggle,
      closeComposer,
      parentId,
      commentId,
      type,
      onCancelEdit,
      onSubmitReply,
      onSubmitCreate,
      trackEngagement,
      analyticsPayload
    } = this.props;
    const {streamId, cardPosition} = analyticsPayload;
    const {comment} = this.state;

    if (type === EDIT) {
      try {
        const {data} = await updateComment(commentId, comment);
        if (data) {
          onCancelEdit();
        } else {
          this.setState({error: true});
        }
      } catch (err) {
        this.setState({error: true});
      }
    } else {
      this.props.sendAnalyticsEvent(FEED_CLICK_SUBMIT_COMMENT, {
        level: 0,
        commentText: comment
      });
      trackEngagement(COMMENT, streamId, 90, cardPosition);
      try {
        const {data} = await createComment(comment, commentableId, commentableType, parentId);
        if (data) {
          this.setState({comment: ''}, () => {
            closeComposer();
            if (type === CREATE) {
              onSubmitCreate();
              if (!commentsVisible) {
                onCommentsToggle();
              }
            }
            if (type === REPLY) {
              onSubmitReply();
            }
          });
        } else {
          this.setState({error: true});
        }
      } catch (err) {
        this.setState({error: true});
      }
    }
  };

  render() {
    const {user, composerExpanded, placeholder, type, isPrivate, onStackProfile} = this.props;
    const {expanded, comment, error} = this.state;
    return (
      <Container type={type} innerRef={this.assignContainer}>
        <Border type={type}>
          <Tween active={composerExpanded}>
            {tween => (
              <UserPanelOverflow style={{height: tween(0, 48)}}>
                {user && (
                  <UserPanel>
                    <Avatar src={user.imageUrl} alt={`Avatar of ${user.displayName}`} size={28} />
                    <div style={{marginLeft: tween(50, 10), opacity: tween(0, 1)}}>
                      <ByLine>
                        <UserName>{user.displayName}</UserName>
                      </ByLine>
                    </div>
                  </UserPanel>
                )}
              </UserPanelOverflow>
            )}
          </Tween>
          <NavigationContext.Consumer>
            {navigate => (
              <Tween active={composerExpanded}>
                {tween => (
                  <TextArea
                    data-testid="commentTextArea"
                    innerRef={this.assignTextarea}
                    style={{
                      height: tween(35, 63),
                      paddingBottom: expanded ? 10 : 0,
                      paddingTop: tween(48 / 2 - (1.7 * 13) / 2, 10),
                      paddingLeft: tween(10 + 28 + 8, 48)
                    }}
                    onFocus={() => this.handleFocus(navigate)}
                    placeholder={expanded ? '' : placeholder}
                    value={comment}
                    onChange={this.handleChange}
                  />
                )}
              </Tween>
            )}
          </NavigationContext.Consumer>
        </Border>
        {composerExpanded && (
          <Slide>
            <Panel isPrivate={!isPrivate}>
              {!isPrivate && user.privateMode && (
                <PublicMessage>
                  <PublicIcon />
                  {onStackProfile ? 'Publicly visible' : 'This comment will be publicly visible'}
                </PublicMessage>
              )}
              <ButtonGroup>
                <CancelButton onClick={this.handleCancel}>Cancel</CancelButton>
                <SimpleButton
                  onClick={this.handleSubmit}
                  disabled={this.state.comment.length > 0 ? false : true}
                >
                  {type === EDIT ? 'Save' : 'Submit'}
                </SimpleButton>
              </ButtonGroup>
            </Panel>
          </Slide>
        )}
        {error && (
          <ErrorModal
            onDismiss={() => this.setState({error: false})}
            message="There was a problem saving your comment."
          />
        )}
      </Container>
    );
  }
}

export default compose(
  withCurrentUser,
  withSendAnalyticsEvent,
  withTrackEngagement,
  withMutation(updateComment, mutate => ({
    updateComment: (id, content) =>
      mutate({
        variables: {id, content},
        update: (store, {data: {updateComment}}) => {
          store.writeFragment({
            id: id,
            fragment: commentItem,
            data: updateComment,
            fragmentName: 'commentItem'
          });
        }
      })
  })),
  withMutation(createComment, mutate => ({
    createComment: (content, commentableId, commentableType, parentId) =>
      mutate({
        variables: {content, commentableId, commentableType, parentId},
        update: (store, {data: {createComment}}) => {
          const isReply = parentId !== null;
          const id = defaultDataIdFromObject({
            id: commentableId,
            __typename: commentableType
          });
          const decision = store.readFragment({id, fragment: decisionFragment});
          const rootComments = decision.rootComments;
          const parentIndex = isReply ? rootComments.findIndex(item => item.id === parentId) : null;
          const comments = isReply ? rootComments[parentIndex].replies : rootComments;
          if (!isReply) {
            comments.unshift(createComment);
            decision.rootComments = comments;
          } else {
            comments.push(createComment);
            decision.rootComments[parentIndex].replies = comments;
          }
          decision.commentsCount = decision.rootComments.reduce((count, comment) => {
            return count + 1 + comment.replies.length;
          }, 0);
          store.writeFragment({id, fragment: decisionFragment, data: decision});
        }
      })
  }))
)(Composer);
