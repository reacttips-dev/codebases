import React from 'react';
import ForumItemCard from '../../__components/ForumItemCard';
import AnswerBadge from '../../__components/AnswerBadge';
import ReplyList from '../__components/ReplyList';
import { ForumAnswersDataProviderResponse } from '../../__providers__/ForumPostDataProvider/__types__';
import { Providers } from '../../__providers__/ForumPostDataProvider';
import { ShimmerState } from '../../ForumThread';
import PaginatedShowMoreReplies from '../__components/PaginatedShowMoreReplies';

function HighlightedPostProvider({
  id,
  children,
}: {
  id: string;
  children: (props: ForumAnswersDataProviderResponse) => JSX.Element | null;
}) {
  return (
    <Providers.AnswerById forumQuestionId={id} limit={1} page={0}>
      {({ loading, error, data }) => {
        const replies = data?.replies;
        if (loading) {
          return <ShimmerState />;
        }
        if (error) {
          return null;
        }
        if (data && data.replies) {
          return children({ replies });
        }
        return null;
      }}
    </Providers.AnswerById>
  );
}

export default function HighlightedPost({ id }: { id: string }) {
  return (
    <HighlightedPostProvider id={id}>
      {({ replies: highlightedReplies }) => (
        <div className="highlighted rc-ForumItemReplyList__list">
          {highlightedReplies &&
            highlightedReplies.map((forumPostReply) => {
              return (
                <ForumItemCard
                  key={`forumPostReply-${id}`}
                  tags={
                    <span style={{ margin: '0 0 0 6px' }}>
                      <AnswerBadge answerBadge="HIGHLIGHTED" />
                    </span>
                  }
                  {...forumPostReply}
                  cmlContent={forumPostReply.content.details}
                >
                  <PaginatedShowMoreReplies forumPostReply={forumPostReply}>
                    {({ replies }) => <ReplyList replies={replies} />}
                  </PaginatedShowMoreReplies>
                </ForumItemCard>
              );
            })}
        </div>
      )}
    </HighlightedPostProvider>
  );
}
