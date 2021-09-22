import React from 'react';
import { withRepliesData } from 'bundles/discussions/components/forumsV2-ForumThreads/__providers__/ForumPostDataProvider/models/ForumAnswer/withRepliesData';
import { answerSorts } from 'bundles/discussions/constants';
import { ThreadDetailsStoreResponseProps } from 'bundles/discussions/components/forumsV2-ForumThreads/__providers__/ForumPostDataProvider/queries/RestForumAnswersById';

export type AnswerSorts = 'createdAtAsc' | 'upvotesDesc' | 'createdAtDesc';

type ForumAnswerQueryProps = {
  id: string;
  children: (props: ThreadDetailsStoreResponseProps) => JSX.Element | null;
  page: number;
  limit: number;
  sortOrder: answerSorts;
};

export default {
  Query: (forumAnswerQueryProps: ForumAnswerQueryProps) => {
    const { id, page, children, sortOrder } = forumAnswerQueryProps;
    const Component = withRepliesData(children);
    return (
      <Component {...forumAnswerQueryProps} page={page} sort={sortOrder || answerSorts.newestSort} questionId={id} />
    );
  },
};
