import { isSuperuser } from 'js/lib/user';
import { formatReplyLegendId } from 'bundles/discussions/utils/threadUtils';

import React from 'react';
import PropTypes from 'prop-types';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import ProfileArea from 'bundles/discussions/components/profiles/ProfileArea';
import getCurrentSocialProfile from 'pages/open-course/common/models/currentSocialProfile';
import ForumsConnectedReplyCMLInput from 'bundles/discussions/components/repliesList/ForumsConnectedReplyCMLInput';
import CommentPaginationContainer from 'bundles/discussions/components/repliesList/CommentPaginationContainer';
import ReplyComponent from 'bundles/discussions/components/repliesList/ReplyComponent';
import { replyPropType } from 'bundles/discussions/lib/propTypes';
import _t from 'i18n!nls/discussions';
import 'css!./__styles__/ReplyContainer';

class ReplyContainer extends React.Component {
  static propTypes = {
    reply: replyPropType.isRequired,
    savingState: PropTypes.string,
    answerId: PropTypes.string,
    commentId: PropTypes.string,
    isClosed: PropTypes.bool,
    isHighlighted: PropTypes.bool,
    comments: PropTypes.array,
    isQuestionLoaded: PropTypes.bool,
    forumLink: PropTypes.string,
    forumType: PropTypes.string,
    question: PropTypes.object,
    showJumpLink: PropTypes.bool,
    collapseCommentsByDefault: PropTypes.bool,
    hideUndoDelete: PropTypes.bool,
    fetchAnswerPosition: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      showComments: props.reply.childAnswerCount > 0 && !props.collapseCommentsByDefault,
    };
  }

  // if user has posted a new reply or there is a new comment,
  // show the comments even if the user has hidden them.
  componentWillReceiveProps(nextProps) {
    if (!this.props.comments || !nextProps.comments) {
      return;
    }

    if (this.props.comments.length < nextProps.comments.length) {
      this.setState({ showComments: true });
    }
  }

  toggleComments = () => {
    this.setState({ showComments: !this.state.showComments });
  };

  render() {
    const {
      reply,
      answerId,
      commentId,
      isClosed,
      isHighlighted,
      savingState,
      showJumpLink,
      forumLink,
      forumType,
      question,
      isQuestionLoaded,
      hideUndoDelete,
      fetchAnswerPosition,
    } = this.props;

    // TODO: Delete animation
    if (reply.hide) {
      return null;
    }

    const currentSocialProfile = getCurrentSocialProfile();

    return (
      <ReplyComponent
        reply={reply}
        commentsEnabled={this.state.showComments}
        toggleComments={this.toggleComments}
        answerId={answerId}
        commentId={commentId}
        commentCount={reply.childAnswerCount || 0}
        className="rc-ReplyContainer"
        isHighlighted={isHighlighted}
        isQuestionLoaded={isQuestionLoaded}
        forumLink={forumLink}
        forumType={forumType}
        showJumpLink={showJumpLink}
        hideUndoDelete={hideUndoDelete}
        fetchAnswerPosition={fetchAnswerPosition}
      >
        {this.state.showComments && (
          <div>
            <CommentPaginationContainer
              reply={reply}
              answerId={answerId}
              commentId={commentId}
              forumLink={forumLink}
              forumType={forumType}
              isQuestionLoaded={isQuestionLoaded}
            />

            {!isClosed && (
              <div className="comment-input horizontal-box">
                <ProfileArea
                  externalUserId={currentSocialProfile.get('externalUserId')}
                  fullName={currentSocialProfile.get('fullName')}
                  profileImageUrl={currentSocialProfile.getProfileImageUrl()}
                />
                <ForumsConnectedReplyCMLInput
                  forumType={forumType}
                  question={question}
                  parentPost={reply}
                  ariaLabel={_t('Reply to this post')}
                  ariaDescribedBy={formatReplyLegendId(reply)}
                  savingState={savingState}
                />
              </div>
            )}
          </div>
        )}
      </ReplyComponent>
    );
  }
}

export default connectToStores(
  ReplyContainer,
  ['ThreadDetailsStore', 'ThreadSettingsStore', 'CourseMembershipStore'],
  ({ ThreadDetailsStore, ThreadSettingsStore, CourseMembershipStore }, { reply }) => {
    return {
      question: ThreadDetailsStore.getQuestion(reply.questionId),
      comments: ThreadDetailsStore.getLoadedComments(reply.topLevelForumAnswerId),
      isClosed: ThreadSettingsStore.isClosed(),
      isHighlighted: ThreadDetailsStore.isHighlighted(reply),
      savingState: ThreadDetailsStore.savingStates[reply.id],
      hideUndoDelete: CourseMembershipStore.getCourseRole() === 'LEARNER' && !isSuperuser(),
    };
  }
);
