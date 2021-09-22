import React from 'react';
import SectionDivider from 'bundles/course-item-resource-panel/__components/SectionDivider';
import ReplyList from './__components/ReplyList';
import HighlightedPost from './HighlightedPost';
import PaginatedShowMoreReplies from './__components/PaginatedShowMoreReplies';
import PaginatedReplies from './__components/PaginatedRepliesById';
import 'css!./__styles__/index';

const ForumReplies = ({
  id,
  highlightedId,
  topLevelAnswerCount,
}: {
  id: string;
  highlightedId?: string;
  topLevelAnswerCount: number;
  children?: JSX.Element | JSX.Element[] | null;
}) => {
  return (
    <PaginatedReplies topLevelAnswerCount={topLevelAnswerCount} limit={15} id={id}>
      {({ replies, page }) => (
        <div>
          {highlightedId && page !== undefined && page <= 1 && <HighlightedPost id={highlightedId} />}
          {replies && (
            <ReplyList showReplyControls={true} replies={replies}>
              {({ reply }) => {
                if (reply?.topLevelAnswerCount) {
                  return (
                    <span>
                      <PaginatedShowMoreReplies forumPostReply={reply}>
                        {({ replies: subReplies }) => (
                          <ReplyList replies={subReplies.filter((subReply) => subReply.id !== highlightedId)} />
                        )}
                      </PaginatedShowMoreReplies>
                      <SectionDivider />
                    </span>
                  );
                }
                return null;
              }}
            </ReplyList>
          )}
        </div>
      )}
    </PaginatedReplies>
  );
};
export default ForumReplies;
