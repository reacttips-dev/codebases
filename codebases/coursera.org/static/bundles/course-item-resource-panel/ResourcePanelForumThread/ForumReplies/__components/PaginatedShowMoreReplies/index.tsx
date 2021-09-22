import React from 'react';
import { ForumPostWithCreator } from '../../../__providers__/ForumPostDataProvider/queries/RestForumAnswersById';
import ShowMore from '../../../__components/ShowMoreState/__components/ShowMoreButton';
import PaginatedAnswersDataProvider from '../../__providers__/PaginatedAnswersDataProvider';
import { extractForumPostId } from '../../../__helpers__/eventingHelpers';

export default function PaginatedShowMoreReplies({
  forumPostReply,
  children,
}: {
  forumPostReply: ForumPostWithCreator;
  children?: ({ replies }: { replies: ForumPostWithCreator[] }) => {} | null;
}) {
  return (
    <PaginatedAnswersDataProvider limit={1} id={forumPostReply.id}>
      {({ limit: replyLimit, setLimit: replySetLimit, replies }) => (
        <div>
          {children && typeof children === 'function' && replies && children({ replies })}
          <ShowMore
            stepCount={5}
            currentPosition={replyLimit}
            onHide={() => replySetLimit(1)}
            onShow={replySetLimit}
            totalCount={forumPostReply?.topLevelAnswerCount || 0}
            forumPostId={extractForumPostId(forumPostReply.id)}
          />
        </div>
      )}
    </PaginatedAnswersDataProvider>
  );
}
