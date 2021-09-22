import React from 'react';
import { ForumPostWithCreator } from '../../../__providers__/ForumPostDataProvider/__types__';
import ShowMore from '../../../__components/ShowMoreState/__components/ShowMoreButton';
import PaginatedAnswersDataProvider from '../../__providers__/PaginatedAnswersDataProvider';
import { extractForumPostId } from '../../../__helpers__/forumPostDataHelpers';

export default function PaginatedShowMoreReplies({
  forumPostReply,
  sortOrder,
  children,
}: {
  forumPostReply: ForumPostWithCreator;
  sortOrder?: string;
  children?: ({ replies }: { replies: ForumPostWithCreator[] }) => {} | null;
}) {
  return (
    <PaginatedAnswersDataProvider limit={1} id={forumPostReply.answerId!} sortOrder={sortOrder}>
      {({ limit: replyLimit, setLimit: replySetLimit, replies }) => (
        <div>
          {children && typeof children === 'function' && replies && children({ replies })}
          <ShowMore
            stepCount={5}
            currentPosition={replyLimit}
            onHide={() => replySetLimit(1)}
            onShow={replySetLimit}
            totalCount={forumPostReply?.topLevelAnswerCount || 0}
            forumPostId={extractForumPostId(forumPostReply.answerId!)}
          />
        </div>
      )}
    </PaginatedAnswersDataProvider>
  );
}
