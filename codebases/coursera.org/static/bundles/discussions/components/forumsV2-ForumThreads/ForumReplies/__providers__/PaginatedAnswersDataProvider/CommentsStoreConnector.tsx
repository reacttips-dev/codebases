import PropTypes from 'prop-types';
import React from 'react';
import ListBody from 'bundles/discussions/components/ListBody';
import ReplyComponent from 'bundles/discussions/components/repliesList/ReplyComponent';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import { loadingStates } from 'bundles/discussions/constants';
import { fetchMultipleCommentPages } from 'bundles/discussions/actions/ThreadDetailsActions';
import { replyPropType } from 'bundles/discussions/lib/propTypes';
import _t from 'i18n!nls/discussions';
import { ForumPostReply } from 'bundles/discussions/lib/types';

type CommentPaginationContainerProps = {
  reply: ForumPostReply;
  answerId: string;
  commentId: string;
  commentLoadingState: string;
  comments: ForumPostReply[];
  commentPageRange: object;
  isQuestionLoaded: boolean;
  forumLink: string;
  forumType: string;
  includeDeleted: boolean;
  children: (any) => JSX.Element | null;
  page: number;
  limit: number;
};

class CommentPaginationContainer extends React.Component<CommentPaginationContainerProps> {
  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  state = {
    loadingComments: false,
  };

  componentWillMount() {
    this.fetchComments(this.pagination);
  }

  fetchComments = ({ start = 1, end = 5 }) => {
    const { reply, answerId, commentId, forumType, includeDeleted } = this.props;

    // make sure that if we have a deep-linked comment, the comment is loaded.
    if (commentId && reply.topLevelForumAnswerId === answerId) {
      const { questionId } = reply;

      this.context.executeAction(fetchMultipleCommentPages, {
        questionId,
        answerId,
        userForumAnswerId: reply.id,
        startPage: start,
        endPage: end,
        forumType,
        includeDeleted,
      });
    }
  };

  get pagination() {
    const start = this.props.page > 1 ? this.props.page * this.props.limit : 0;
    const end = start + this.props.limit;
    return { start, end };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.commentLoadingState === loadingStates.LOADING &&
      this.props.commentLoadingState !== nextProps.commentLoadingState
    ) {
      this.setState({ loadingComments: false });
    }

    if (nextProps.page !== this.props.page) {
      this.fetchComments(this.pagination);
    }
  }

  render() {
    const { start, end } = this.pagination;
    // const subComments = this.props.comments.slice(start, end);
    return <>{this.props.children && this.props.children({ ...this.props, comments: this.props.comments })}</>;
  }
}

type CommentsStoreConnectorPropsToConnector = {
  reply: ForumPostReply;
};
export default connectToStores<CommentPaginationContainerProps, any>(
  CommentPaginationContainer,
  ['ThreadDetailsStore', 'ApplicationStore', 'CourseMembershipStore'],
  ({ ThreadDetailsStore, ApplicationStore, CourseMembershipStore }, { reply }) => {
    return {
      comments: ThreadDetailsStore.getLoadedComments(reply.topLevelForumAnswerId),
      commentLoadingState: ThreadDetailsStore.commentLoadingState[reply.id] || loadingStates.LOADING,
      commentPageRange: ThreadDetailsStore.getCommentPageRange(reply.id),
      forumType: ThreadDetailsStore.forumType,
      includeDeleted: CourseMembershipStore.hasModerationRole() || ApplicationStore.isSuperuser(),
    };
  }
);
