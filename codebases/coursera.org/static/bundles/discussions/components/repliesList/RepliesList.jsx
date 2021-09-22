import React from 'react';
import PropTypes from 'prop-types';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import _t from 'i18n!nls/discussions';
import RepliesSortBar, { generateTabId } from 'bundles/discussions/components/repliesList/RepliesSortBar';
import GradedDiscussionPromptAnswersSortBar from 'bundles/discussions/components/repliesList/GradedDiscussionPromptAnswersSortBar';
import ReplyContainer from 'bundles/discussions/components/repliesList/ReplyContainer';
import PaginationControls from 'bundles/page/components/PaginationControls';
import ListBody from 'bundles/discussions/components/ListBody';
import { loadingStates, naptimeForumTypes } from 'bundles/discussions/constants';

class RepliesList extends React.Component {
  static propTypes = {
    sort: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
    savingStates: PropTypes.object.isRequired,
    replies: PropTypes.array.isRequired,
    loadingState: PropTypes.string.isRequired,
    isQuestionLoaded: PropTypes.bool,
    answerId: PropTypes.string,
    commentId: PropTypes.string,
    pageCount: PropTypes.number,
    fetchAnswerPosition: PropTypes.func,

    // Only coming in via DiscussionPrompts
    forumLink: PropTypes.string,
    forumType: PropTypes.string,
    forumTypeSetting: PropTypes.string,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  onPageChange = (page) => {
    this.context.router.push({
      pathname: this.context.router.location.pathname,
      params: this.context.router.params,
      query: Object.assign(this.context.router.location.query, { page }),
    });
  };

  render() {
    const {
      sort,
      page,
      replies,
      answerId,
      commentId,
      forumLink,
      forumType,
      isQuestionLoaded,
      loadingState,
      savingStates,
      pageCount,
      forumTypeSetting,
      fetchAnswerPosition,
    } = this.props;

    const isLoaded = loadingState === loadingStates.DONE;

    const isGradedDiscussionPrompt = forumType === naptimeForumTypes.gradedDiscussionPrompt;

    return (
      <div>
        <div className="rc-RepliesList card-rich-interaction nostyle">
          <RepliesSortBar sort={sort} forumType={forumType} forumTypeSetting={forumTypeSetting} />

          {/* This id is used in RepliesSortBar to link the tabs to the tabpanel */}
          <div
            role="tabpanel"
            id="replies-list-tabpanel"
            aria-labelledby={generateTabId(isGradedDiscussionPrompt ? forumTypeSetting : sort)}
            tabIndex={0}
          >
            {isGradedDiscussionPrompt && <GradedDiscussionPromptAnswersSortBar sort={sort} />}

            <ListBody loadingState={loadingState} emptyStatePlaceholderText={_t('No Replies Yet')}>
              {replies &&
                replies.map((reply) => (
                  <ReplyContainer
                    reply={reply}
                    answerId={answerId}
                    commentId={commentId}
                    forumLink={forumLink}
                    forumType={forumType}
                    isQuestionLoaded={isQuestionLoaded}
                    savingState={savingStates[reply.id]}
                    key={reply.id}
                    fetchAnswerPosition={fetchAnswerPosition}
                  />
                ))}
            </ListBody>
          </div>
        </div>

        {isLoaded && !!pageCount && (
          <PaginationControls maxPages={5} currentPage={page} pageCount={pageCount} onPageChange={this.onPageChange} />
        )}
      </div>
    );
  }
}

export default connectToStores(
  RepliesList,
  ['ThreadDetailsStore'],
  ({ ThreadDetailsStore }, { questionId, page, sort }) => {
    return {
      replies: ThreadDetailsStore.getReplies(questionId, page, sort) || [],
      pageCount: ThreadDetailsStore.getPageCount(questionId, page, sort),
      savingStates: ThreadDetailsStore.savingStates,
      loadingState:
        ThreadDetailsStore.getAnswerLoadedState({
          questionId,
          page,
          sort,
        }) || loadingStates.LOADING,
      isQuestionLoaded: ThreadDetailsStore.isLoaded({ questionId, page, sort }),
    };
  }
);
