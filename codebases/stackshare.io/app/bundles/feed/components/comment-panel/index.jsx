import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Composer, {CREATE} from './composer';
import CommentList from './comment-list';
import {ASH} from '../../../../shared/style/colors';
import {DARK, LIGHT} from '../../constants/utils';

const Container = glamorous.div(
  {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    boxShadow: `0 1px 0 0 ${ASH}`,
    border: `1px solid ${ASH}`,
    borderTop: 0,
    boxSizing: 'border-box'
  },
  ({theme}) => (theme === LIGHT ? {border: 0} : null)
);

export default class CommentPanel extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    comments: PropTypes.array,
    commentsVisible: PropTypes.bool,
    onUpvoteToggle: PropTypes.func,
    onCommentsToggle: PropTypes.func,
    commentableId: PropTypes.string,
    commentableType: PropTypes.string,
    composerExpanded: PropTypes.bool,
    commentDisabled: PropTypes.bool,
    openComposer: PropTypes.func,
    closeComposer: PropTypes.func,
    shouldComposerCloseOnBlur: PropTypes.func,
    setNewComment: PropTypes.func,
    addActiveReply: PropTypes.func,
    removeActiveReply: PropTypes.func,
    analyticsPayload: PropTypes.object,
    theme: PropTypes.oneOf([LIGHT, DARK]),
    postCardRef: PropTypes.any,
    isPrivate: PropTypes.bool,
    onStackProfile: PropTypes.bool
  };

  state = {
    visibleCommentCount: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      visibleCommentCount: this.amountToIncrement()
    };
  }

  amountToIncrement = () => {
    const {comments} = this.props;
    const {visibleCommentCount} = this.state;
    let amountToIncrement = 1;
    while (
      comments
        .slice(visibleCommentCount, visibleCommentCount + amountToIncrement)
        .reduce((sum, comment) => sum + 1 + comment.replies.length, 0) < 5 &&
      visibleCommentCount + amountToIncrement < comments.length
    ) {
      amountToIncrement++;
    }
    return amountToIncrement;
  };

  incrementPage = () => {
    // Show a minimum of 5 new comments and leave replies intact
    const {visibleCommentCount} = this.state;
    this.setState({
      visibleCommentCount: visibleCommentCount + this.amountToIncrement()
    });
  };

  incrementVisibleCommentCount = () => {
    const {visibleCommentCount} = this.state;
    this.setState({
      visibleCommentCount: visibleCommentCount + 1
    });
  };

  render() {
    const {
      currentUser,
      comments,
      commentsVisible,
      onUpvoteToggle,
      onCommentsToggle,
      commentableId,
      commentableType,
      composerExpanded,
      openComposer,
      closeComposer,
      setNewComment,
      shouldComposerCloseOnBlur,
      addActiveReply,
      removeActiveReply,
      analyticsPayload,
      theme,
      postCardRef,
      commentDisabled,
      isPrivate,
      onStackProfile
    } = this.props;
    const {visibleCommentCount} = this.state;
    const showComments = comments.length > 0 && commentsVisible;
    return (
      <Container theme={theme}>
        {!commentDisabled && (
          <Composer
            isPrivate={isPrivate}
            user={currentUser}
            composerExpanded={composerExpanded}
            onCommentsToggle={onCommentsToggle}
            commentsVisible={commentsVisible}
            commentableId={commentableId}
            commentableType={commentableType}
            openComposer={openComposer}
            closeComposer={closeComposer}
            shouldComposerCloseOnBlur={shouldComposerCloseOnBlur}
            comments={comments}
            setNewComment={setNewComment}
            placeholder="Write a comment..."
            onSubmitCreate={this.incrementVisibleCommentCount}
            type={CREATE}
            analyticsPayload={analyticsPayload}
            onStackProfile={onStackProfile}
          />
        )}
        {showComments && (
          <CommentList
            user={currentUser}
            postCardRef={postCardRef}
            comments={comments}
            onUpvoteToggle={onUpvoteToggle}
            commentableId={commentableId}
            commentableType={commentableType}
            shouldComposerCloseOnBlur={shouldComposerCloseOnBlur}
            visibleCommentCount={visibleCommentCount}
            incrementPage={this.incrementPage}
            addActiveReply={addActiveReply}
            removeActiveReply={removeActiveReply}
            analyticsPayload={analyticsPayload}
            commentDisabled={commentDisabled}
            isPrivate={isPrivate}
            onStackProfile={onStackProfile}
          />
        )}
      </Container>
    );
  }
}
