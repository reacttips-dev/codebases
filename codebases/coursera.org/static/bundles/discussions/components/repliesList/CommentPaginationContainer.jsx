import PropTypes from 'prop-types';
import React from 'react';
import ListBody from 'bundles/discussions/components/ListBody';
import ReplyComponent from 'bundles/discussions/components/repliesList/ReplyComponent';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import { loadingStates } from 'bundles/discussions/constants';
import { fetchMultipleCommentPages } from 'bundles/discussions/actions/ThreadDetailsActions';
import { replyPropType } from 'bundles/discussions/lib/propTypes';
import _t from 'i18n!nls/discussions';

class CommentPaginationContainer extends React.Component {
  static propTypes = {
    reply: replyPropType.isRequired,
    answerId: PropTypes.string,
    commentId: PropTypes.string,
    commentLoadingState: PropTypes.string,
    comments: PropTypes.array,
    commentPageRange: PropTypes.object,
    isQuestionLoaded: PropTypes.bool,
    forumLink: PropTypes.string,
    forumType: PropTypes.string,
    includeDeleted: PropTypes.bool,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  state = {
    loadingComments: false,
  };

  componentWillMount() {
    const { reply, answerId, commentId, forumType, includeDeleted } = this.props;

    // make sure that if we have a deep-linked comment, the comment is loaded.
    if (commentId && reply.topLevelForumAnswerId === answerId) {
      const { questionId } = reply;

      this.context.executeAction(fetchMultipleCommentPages, {
        questionId,
        answerId,
        userForumAnswerId: reply.id,
        startPage: 1,
        endPage: 100,
        forumType,
        includeDeleted,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.commentLoadingState === loadingStates.LOADING &&
      this.props.commentLoadingState !== nextProps.commentLoadingState
    ) {
      this.setState({ loadingComments: false });
    }
  }

  loadEarlierReplies = () => {
    const { reply, commentPageRange, forumType, includeDeleted } = this.props;
    const { endPage } = commentPageRange;
    const { questionId } = reply;

    this.context.executeAction(fetchMultipleCommentPages, {
      questionId,
      forumType,
      includeDeleted,
      answerId: reply.topLevelForumAnswerId,
      userForumAnswerId: reply.id,
      startPage: endPage + 1,
      endPage: endPage + 1,
    });
    this.setState({ loadingComments: true });
  };

  render() {
    const { reply, comments, commentLoadingState, answerId, commentId, commentPageRange } = this.props;
    const isLoading = this.state.loadingComments || commentLoadingState === loadingStates.LOADING;
    // Don't use ListBody LOADING state, so that comments are still interactable while more are loading.
    const listBodyLoadingState = isLoading ? loadingStates.DONE : commentLoadingState;

    if (reply.childAnswerCount === 0) {
      return null;
    }

    return (
      <div className="rc-CommentPaginationContainer vertical-box">
        {commentPageRange.endPage < commentPageRange.totalPageCount && (
          <button className="secondary reply-load-button" onClick={this.loadEarlierReplies} disabled={isLoading}>
            {isLoading ? <span className="cif-spinner cif-spin" /> : _t('See earlier replies')}
          </button>
        )}
        <ListBody loadingState={listBodyLoadingState}>
          {comments &&
            comments.map((comment, index) => (
              <ReplyComponent
                reply={comment}
                key={comment.id}
                answerId={answerId}
                commentId={commentId}
                commentsEnabled={false}
                ref={comment.id}
                isQuestionLoaded={this.props.isQuestionLoaded}
                forumLink={this.props.forumLink}
                forumType={this.props.forumType}
              />
            ))}
        </ListBody>
      </div>
    );
  }
}

export default connectToStores(
  CommentPaginationContainer,
  ['ThreadDetailsStore', 'ApplicationStore', 'CourseMembershipStore'],
  ({ ThreadDetailsStore, ApplicationStore, CourseMembershipStore }, { reply }) => {
    return {
      comments: ThreadDetailsStore.getLoadedComments(reply.topLevelForumAnswerId),
      commentLoadingState: ThreadDetailsStore.commentLoadingState[reply.topLevelForumAnswerId] || loadingStates.LOADING,
      commentPageRange: ThreadDetailsStore.getCommentPageRange(reply.topLevelForumAnswerId),
      forumType: ThreadDetailsStore.forumType,
      includeDeleted: CourseMembershipStore.hasModerationRole() || ApplicationStore.isSuperuser(),
    };
  }
);
