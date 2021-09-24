import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Comment from './comment';
import Composer, {REPLY} from './composer';
import {scrollIntoView} from '../../../../shared/utils/scroll';

const Container = glamorous.div({});

const ReplyComposer = glamorous.div({
  paddingLeft: 40
});

export default class CommentBlock extends Component {
  static propTypes = {
    user: PropTypes.object,
    comment: PropTypes.object,
    onUpvoteToggle: PropTypes.func,
    commentableId: PropTypes.string,
    commentableType: PropTypes.string,
    shouldComposerCloseOnBlur: PropTypes.func,
    updateFirstPage: PropTypes.func,
    addActiveReply: PropTypes.func,
    removeActiveReply: PropTypes.func,
    analyticsPayload: PropTypes.object,
    commentDisabled: PropTypes.bool,
    postCardRef: PropTypes.any,
    isPrivate: PropTypes.bool,
    onStackProfile: PropTypes.bool
  };

  state = {
    composerVisible: false,
    composerExpanded: false
  };

  replyLinkRefs = [];

  replyLinkRef = replyLinkRef => {
    this.replyLinkRefs.push(replyLinkRef);
  };

  openComposer = () => {
    this.setState({composerExpanded: true});
  };

  closeComposer = () => {
    this.setState({composerExpanded: false});
  };

  showReplyComposer = () => {
    const {composerVisible} = this.state;
    const {postCardRef} = this.props;
    const {replyComposerContainerRef, replyComposerTextareaRef} = this;
    const showReplyComposer =
      composerVisible && replyComposerContainerRef && replyComposerTextareaRef;
    if (showReplyComposer) {
      scrollIntoView(
        postCardRef ? postCardRef.current : document.documentElement,
        replyComposerContainerRef,
        300,
        500,
        () => {
          replyComposerTextareaRef.focus();
        }
      );
    } else {
      this.setState({composerVisible: true});
    }
  };

  hideReplyComposer = () => {
    this.setState({composerVisible: false});
  };

  render() {
    const {
      user,
      comment,
      onUpvoteToggle,
      commentableId,
      commentableType,
      shouldComposerCloseOnBlur,
      updateFirstPage,
      addActiveReply,
      removeActiveReply,
      analyticsPayload,
      postCardRef,
      commentDisabled,
      isPrivate,
      onStackProfile
    } = this.props;
    const {composerVisible, composerExpanded} = this.state;
    const noop = () => {};
    const isOwner = user && user.id === comment.user.id;

    return (
      <Container>
        <Comment
          key={comment.id}
          id={comment.id}
          postedAt={comment.postedAt}
          upvotesCount={comment.upvotesCount}
          upvoted={comment.upvoted}
          flagged={comment.flagged}
          user={comment.user}
          content={comment.content}
          onUpvoteToggle={onUpvoteToggle}
          isOwner={isOwner}
          onReply={this.showReplyComposer}
          isReply={false}
          replyLinkRef={this.replyLinkRef}
          analyticsPayload={analyticsPayload}
          commentDisabled={commentDisabled}
        />
        {comment.replies.map(reply => {
          const isOwnerReply = user && reply.user.id === user.id;
          return (
            <Comment
              key={reply.id}
              id={reply.id}
              postedAt={reply.postedAt}
              upvotesCount={reply.upvotesCount}
              upvoted={reply.upvoted}
              flagged={reply.flagged}
              user={reply.user}
              content={reply.content}
              onUpvoteToggle={onUpvoteToggle}
              isOwner={isOwnerReply}
              onReply={this.showReplyComposer}
              isReply={true}
              replyLinkRef={this.replyLinkRef}
              analyticsPayload={analyticsPayload}
              commentDisabled={commentDisabled}
            />
          );
        })}
        {composerVisible && !commentDisabled && (
          <ReplyComposer>
            <Composer
              replyComposerContainerRef={ref => (this.replyComposerContainerRef = ref)}
              replyComposerTextareaRef={ref => (this.replyComposerTextareaRef = ref)}
              user={user}
              composerExpanded={composerExpanded}
              onCommentsToggle={noop}
              commentsVisible={false}
              commentableId={commentableId}
              commentableType={commentableType}
              openComposer={this.openComposer}
              closeComposer={this.closeComposer}
              comments={[]}
              setNewComment={noop}
              placeholder="Write a reply..."
              type={REPLY}
              onSubmitReply={this.hideReplyComposer}
              parentId={comment.id}
              shouldComposerCloseOnBlur={shouldComposerCloseOnBlur}
              updateFirstPage={updateFirstPage}
              addActiveReply={addActiveReply}
              removeActiveReply={removeActiveReply}
              postCardRef={postCardRef}
              replyLinkRefs={this.replyLinkRefs}
              analyticsPayload={analyticsPayload}
              isPrivate={isPrivate}
              onStackProfile={onStackProfile}
            />
          </ReplyComposer>
        )}
      </Container>
    );
  }
}
