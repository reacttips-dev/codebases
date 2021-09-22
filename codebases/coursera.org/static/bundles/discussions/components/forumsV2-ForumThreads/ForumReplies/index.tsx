import React from 'react';
import PropTypes from 'prop-types';
import SectionDivider from '../../forumsV2-SectionDivider';
import ReplyList from './__components/ReplyList';
import HighlightedPost from './HighlightedPost';
import PaginatedReplies from './__components/PaginatedRepliesById';
import 'css!./__styles__/index';
import CommentsStoreConnector from 'bundles/discussions/components/forumsV2-ForumThreads/ForumReplies/__providers__/PaginatedAnswersDataProvider/CommentsStoreConnector';
import { toForumCardModel } from 'bundles/discussions/components/forumsV2-ForumThreads/__providers__/ForumPostDataProvider/queries/RestForumAnswersById';
import { answerSorts } from 'bundles/discussions/constants';

type Props = {
  id: string;
  highlightedId?: string;
  topLevelAnswerCount: number;
  children?: JSX.Element | JSX.Element[] | null;
};

class ForumReplies extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  render() {
    const { id, highlightedId, topLevelAnswerCount } = this.props;
    return (
      <PaginatedReplies
        topLevelAnswerCount={topLevelAnswerCount}
        limit={15}
        id={id}
        sortOrder={this.context.router.location.query.sort || answerSorts.newestSort}
      >
        {({ replies, page }) => (
          <div>
            {highlightedId && page !== undefined && page <= 1 && <HighlightedPost id={highlightedId} />}
            {replies && (
              <ReplyList showReplyControls={true} replies={replies}>
                {({ reply }) => {
                  if (!reply?.topLevelAnswerCount) {
                    return null;
                  }

                  return (
                    <span>
                      <CommentsStoreConnector page={1} limit={100} reply={reply}>
                        {(commentsProps) => {
                          if (commentsProps?.comments) {
                            const commentForumCardData = commentsProps.comments.map(toForumCardModel);
                            return (
                              <>
                                <ReplyList
                                  replies={commentForumCardData.filter((subReply) => subReply.id !== highlightedId)}
                                />
                              </>
                            );
                          }
                          return null;
                        }}
                      </CommentsStoreConnector>
                      <SectionDivider />
                    </span>
                  );
                }}
              </ReplyList>
            )}
          </div>
        )}
      </PaginatedReplies>
    );
  }
}
export default ForumReplies;
