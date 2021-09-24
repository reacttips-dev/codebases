import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import CommentBlock from './comment-block';
import LoadMoreButton from '../../../../shared/library/buttons/load-more';
import {grid} from '../../../../shared/utils/grid';
import {ASH, WHITE} from '../../../../shared/style/colors';
import {PHONE} from '../../../../shared/style/breakpoints';

const Container = glamorous.div({
  paddingLeft: grid(3),
  paddingRight: grid(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: grid(2),
  backgroundColor: WHITE,
  borderRadius: 4,
  [PHONE]: {
    paddingLeft: 12
  }
});

const List = glamorous.div({}, ({showLoadMore}) => ({
  ' > div:first-child > div:first-child': {
    borderTop: 0
  },
  width: '100%',
  borderBottom: showLoadMore && `1px solid ${ASH}`,
  marginBottom: showLoadMore && 15
}));

export default class CommentList extends Component {
  static propTypes = {
    user: PropTypes.object,
    comments: PropTypes.array,
    onUpvoteToggle: PropTypes.func,
    commentableId: PropTypes.string,
    commentableType: PropTypes.string,
    shouldComposerCloseOnBlur: PropTypes.func,
    visibleCommentCount: PropTypes.number,
    incrementPage: PropTypes.func,
    addActiveReply: PropTypes.func,
    removeActiveReply: PropTypes.func,
    analyticsPayload: PropTypes.object,
    commentDisabled: PropTypes.bool,
    postCardRef: PropTypes.any,
    isPrivate: PropTypes.bool,
    onStackProfile: PropTypes.bool
  };

  render() {
    const {
      onUpvoteToggle,
      user,
      comments,
      commentableId,
      commentableType,
      shouldComposerCloseOnBlur,
      incrementPage,
      postCardRef,
      visibleCommentCount,
      addActiveReply,
      removeActiveReply,
      analyticsPayload,
      commentDisabled,
      isPrivate,
      onStackProfile
    } = this.props;
    const showLoadMore = comments.length > visibleCommentCount;
    return (
      <Container>
        <List showLoadMore={showLoadMore}>
          {comments.slice(0, visibleCommentCount).map(comment => {
            return (
              <CommentBlock
                visibleCommentCount={visibleCommentCount}
                onUpvoteToggle={onUpvoteToggle}
                key={comment.id}
                postCardRef={postCardRef}
                comment={comment}
                user={user}
                commentableId={commentableId}
                commentableType={commentableType}
                shouldComposerCloseOnBlur={shouldComposerCloseOnBlur}
                addActiveReply={addActiveReply}
                removeActiveReply={removeActiveReply}
                analyticsPayload={analyticsPayload}
                commentDisabled={commentDisabled}
                isPrivate={isPrivate}
                onStackProfile={onStackProfile}
              />
            );
          })}
        </List>
        {showLoadMore && (
          <LoadMoreButton loading={false} text={'See more comments'} onClick={incrementPage} />
        )}
      </Container>
    );
  }
}
