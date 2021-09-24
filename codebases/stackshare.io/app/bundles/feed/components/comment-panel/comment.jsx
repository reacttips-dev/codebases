import React, {Component} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {Avatar, ByLine, UserName} from './composer';
import {Container as UpvotesContainer} from '../decision-card/upvotes';
import DeleteModal from '../../../../shared/library/modals/delete/delete-modal';
import Composer, {EDIT} from './composer';
import Flag, {SHORT} from '../shared/flag';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import {MAKO, ASH, FOCUS_BLUE, WHITE, ERROR_RED} from '../../../../shared/style/colors';
import {
  FEED_CLICK_DELETE_COMMENT,
  FEED_CLICK_EDIT_COMMENT,
  FEED_CLICK_CARD_REPLY,
  FEED_CLICK_CARD_UPVOTE,
  FEED_CLICK_CARD_TYPE_COMMENT,
  FEED_CLICK_CARD_ADD,
  FEED_CLICK_CARD_REMOVE
} from '../../constants/analytics';
import {
  withSendAnalyticsEvent,
  withAnalyticsPayload
} from '../../../../shared/enhancers/analytics-enhancer';
import {withCurrentUser} from '../../../../shared/enhancers/current-user-enhancer';
import {withMutation} from '../../../../shared/enhancers/graphql-enhancer';
import {destroyComment, toggleFlag} from '../../../../data/feed/mutations';
import {decisionFragment} from '../../../../data/feed/fragments';
import {defaultDataIdFromObject} from 'apollo-cache-inmemory';
import {MobileContext} from '../../../../shared/enhancers/mobile-enhancer';
import {ID} from '../../../../shared/utils/graphql';
import {formatDate} from '../../../../shared/utils/format';

const Container = glamorous.div({}, ({isReply}) => ({
  position: 'relative',
  borderTop: `1px solid ${ASH}`,
  paddingTop: 18,
  paddingBottom: 18,
  paddingLeft: isReply ? 40 : 0
}));

const AvatarLink = glamorous.a({
  marginRight: 10,
  height: 28
});

const TimeStamp = glamorous.div({
  ...BASE_TEXT,
  color: MAKO
});

export const Separator = glamorous.div({
  marginLeft: 5,
  marginRight: 5
});

const Author = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center'
});

const Content = glamorous.div({
  ...BASE_TEXT,
  color: MAKO,
  lineHeight: '22px',
  letterSpacing: '0.2px',
  paddingLeft: 38
});

export const ActionPanel = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  paddingLeft: 38,
  marginTop: 10,
  justifyContent: 'space-between'
});

const Actions = glamorous.div({
  display: 'flex',
  alignItems: 'center'
});

const ActionDivider = glamorous.div({
  marginLeft: 5,
  marginRight: 5
});

const UpvotesCopy = glamorous.div({
  ...BASE_TEXT,
  letterSpacing: '0.2px',
  fontSize: 12,
  fontWeight: WEIGHT.BOLD,
  display: 'flex'
});

export const Reply = glamorous.a({
  ...BASE_TEXT,
  letterSpacing: '0.2px',
  fontSize: 12,
  fontWeight: WEIGHT.BOLD,
  cursor: 'pointer',
  color: MAKO,
  ':hover': {
    color: FOCUS_BLUE
  }
});

const UpvotesCount = glamorous.div({
  ...BASE_TEXT,
  marginLeft: 6,
  fontSize: 12,
  fontWeight: WEIGHT.BOLD
});

export const CrudActions = glamorous.div({
  display: 'flex',
  '& a': {
    ...BASE_TEXT,
    fontSize: 12,
    cursor: 'pointer',
    ':hover': {
      color: ERROR_RED
    }
  }
});

export const Delete = glamorous.a({
  color: MAKO,
  display: 'flex',
  alignItems: 'center'
});

export const CrudAction = glamorous.a({
  color: MAKO,
  display: 'flex',
  alignItems: 'center'
});

const ReplyArrow = glamorous.div({
  position: 'absolute',
  top: 0,
  left: 48,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '50%',
    top: -18,
    marginLeft: -5,
    width: 0,
    height: 0,
    border: 'solid transparent',
    borderWidth: '10px 10px 7px 10px',
    borderColor: `transparent transparent ${ASH} transparent`
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '50%',
    top: -17,
    marginLeft: -5,
    width: 0,
    height: 0,
    border: 'solid transparent',
    borderWidth: '10px 10px 7px 10px',
    borderColor: `transparent transparent ${WHITE} transparent`
  }
});

const ContentBlock = glamorous.p({
  wordBreak: 'break-word'
});

export class Comment extends Component {
  static propTypes = {
    id: ID,
    user: PropTypes.object,
    currentUser: PropTypes.object,
    content: PropTypes.string,
    upvoted: PropTypes.bool,
    flagged: PropTypes.bool,
    upvotesCount: PropTypes.number,
    onUpvoteToggle: PropTypes.func,
    onReply: PropTypes.func,
    isOwner: PropTypes.bool,
    postedAt: PropTypes.string,
    isReply: PropTypes.bool,
    sendAnalyticsEvent: PropTypes.func,
    destroyComment: PropTypes.func,
    replyLinkRef: PropTypes.func,
    analyticsPayload: PropTypes.object,
    commentDisabled: PropTypes.bool
  };

  state = {
    showDeleteModal: false,
    editMode: false
  };

  toggleDeleteModal = () => {
    this.setState({showDeleteModal: !this.state.showDeleteModal});
  };

  toggleEditMode = () => {
    this.setState({editMode: !this.state.editMode});
  };

  closeOnBlur = () => {
    this.setState({editMode: false});
  };

  render() {
    const {
      onUpvoteToggle,
      onReply,
      user,
      currentUser,
      upvoted,
      flagged,
      upvotesCount,
      content,
      isOwner,
      id,
      postedAt,
      isReply,
      destroyComment,
      replyLinkRef,
      analyticsPayload,
      commentDisabled
    } = this.props;
    const {showDeleteModal} = this.state;
    return (
      <React.Fragment>
        <Container isReply={isReply}>
          {isReply && <ReplyArrow />}
          {!this.state.editMode && (
            <React.Fragment>
              <Author>
                <AvatarLink href={user.path} target="_blank">
                  <Avatar src={user.imageUrl} alt={user.displayName} size={28} />
                </AvatarLink>
                <ByLine>
                  <UserName>{user.displayName}</UserName>
                  <Separator>&middot;</Separator>
                  <TimeStamp>{formatDate('MMMM Do YYYY [at] h:mma', postedAt)}</TimeStamp>
                </ByLine>
              </Author>
              <Content>
                {content.split('\n').map((str, i) => (
                  <ContentBlock key={i}>{str}</ContentBlock>
                ))}
              </Content>
              <ActionPanel>
                {!commentDisabled && (
                  <Actions>
                    <UpvotesContainer
                      upvoted={upvoted}
                      onClick={() => {
                        onUpvoteToggle(id, 'Comment', !upvoted, upvotesCount);
                        this.props.sendAnalyticsEvent(FEED_CLICK_CARD_UPVOTE, {
                          upvoteType: FEED_CLICK_CARD_TYPE_COMMENT,
                          commentLevel: 0,
                          state: upvoted ? FEED_CLICK_CARD_REMOVE : FEED_CLICK_CARD_ADD
                        });
                      }}
                    >
                      <UpvotesCopy>
                        {upvoted ? 'Upvoted' : 'Upvote'}
                        {upvotesCount > 0 && <UpvotesCount>{`(${upvotesCount})`}</UpvotesCount>}
                      </UpvotesCopy>
                    </UpvotesContainer>
                    <ActionDivider>{'\u00b7'}</ActionDivider>
                    <Reply
                      innerRef={ref => replyLinkRef(ref)}
                      onClick={() => {
                        this.props.sendAnalyticsEvent(FEED_CLICK_CARD_REPLY, {
                          'parent.commentText': content
                        });
                        onReply();
                      }}
                    >
                      Reply
                    </Reply>
                  </Actions>
                )}
                <CrudActions>
                  {currentUser && currentUser.canIModerate && (
                    <Flag
                      itemId={id}
                      itemType={FEED_CLICK_CARD_TYPE_COMMENT}
                      flagged={flagged}
                      theme={SHORT}
                      analyticsPayload={analyticsPayload}
                    />
                  )}
                  {currentUser && currentUser.canIModerate && isOwner && (
                    <ActionDivider>{'\u00b7'}</ActionDivider>
                  )}
                  {isOwner && (
                    <React.Fragment>
                      <CrudAction
                        onClick={() => {
                          this.props.sendAnalyticsEvent(FEED_CLICK_EDIT_COMMENT, {
                            level: isReply ? 1 : 0,
                            commentText: content
                          });
                          this.toggleEditMode();
                        }}
                      >
                        Edit
                      </CrudAction>
                      <ActionDivider>{'\u00b7'}</ActionDivider>
                      <MobileContext.Consumer>
                        {mobile => (
                          <CrudAction
                            onClick={() => {
                              this.props.sendAnalyticsEvent(FEED_CLICK_DELETE_COMMENT, {
                                level: isReply ? 1 : 0,
                                commentText: content
                              });
                              if (mobile) {
                                if (confirm('Are you sure you want to delete your comment?')) {
                                  destroyComment(id);
                                }
                              } else {
                                this.toggleDeleteModal();
                              }
                            }}
                          >
                            Delete
                          </CrudAction>
                        )}
                      </MobileContext.Consumer>
                    </React.Fragment>
                  )}
                </CrudActions>
              </ActionPanel>
            </React.Fragment>
          )}
          {this.state.editMode && (
            <Composer
              user={currentUser}
              onCancelEdit={this.toggleEditMode}
              comment={content}
              composerExpanded={true}
              onCommentsToggle={null}
              commentsVisible={false}
              commentId={id}
              commentableId={''}
              commentableType={''}
              openComposer={null}
              closeComposer={null}
              shouldComposerCloseOnBlur={false}
              comments={[]}
              setNewComment={() => null}
              placeholder="Write a comment..."
              onSubmitCreate={null}
              type={EDIT}
              analyticsPayload={{}}
            />
          )}

          {showDeleteModal && (
            <DeleteModal
              onDismiss={this.toggleDeleteModal}
              onSubmit={destroyComment}
              objectType="comment"
              objectId={id}
            />
          )}
        </Container>
      </React.Fragment>
    );
  }
}

export default compose(
  withAnalyticsPayload({type: 'comment'}),
  withSendAnalyticsEvent,
  withCurrentUser,
  withMutation(destroyComment, mutate => ({
    destroyComment: id =>
      mutate({
        variables: {id},
        update: (store, {data: {destroyComment}}) => {
          const {commentableId, commentableType, parentId} = destroyComment;
          const isReply = parentId !== null;
          const decisionId = defaultDataIdFromObject({
            id: commentableId,
            __typename: commentableType
          });
          const decision = store.readFragment({id: decisionId, fragment: decisionFragment});
          const rootComments = decision.rootComments;
          const parentCommentId = isReply ? parentId : id;
          const parentIndex = rootComments.findIndex(item => item.id === parentCommentId);
          const childIndex = rootComments[parentIndex].replies.findIndex(item => item.id === id);
          const comments = isReply ? rootComments[parentIndex].replies : rootComments;
          comments.splice(isReply ? childIndex : parentIndex, 1);
          if (!isReply) {
            decision.rootComments = comments;
          } else {
            decision.rootComments[parentIndex].replies = comments;
          }
          decision.commentsCount = decision.rootComments.reduce((count, comment) => {
            return count + 1 + comment.replies.length;
          }, 0);
          store.writeFragment({id: decisionId, fragment: decisionFragment, data: decision});
        }
      })
  })),
  withMutation(toggleFlag, mutate => ({
    onFlagToggle: (id, type, flag) =>
      mutate({
        variables: {id, type, flag},
        optimisticResponse: {
          __typename: 'Mutation',
          toggleFlag: {
            id: id,
            __typename: type,
            flag: flag
          }
        }
      })
  }))
)(Comment);
