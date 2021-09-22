import React from 'react';
import { ApolloError } from 'apollo-client';
import { answerSorts } from 'bundles/discussions/constants';
import {
  withThreadDetails,
  ThreadDetailsProps,
} from 'bundles/discussions/components/forumsV2-ForumThreads/__providers__/ForumPostDataProvider/models/ForumQuestion/withThreadDetails';
import { ForumQuestionsV1Resource } from '../../__types__';

export type DataProps = {
  loading: boolean;
  error?: ApolloError;
  data?: ForumQuestionsV1Resource;
};

type ForumQuestionQueryProps = {
  userId: number;
  courseId: string;
  forumQuestionId: string;
  answerId?: string;
  commentId?: string;
  children: (props: ThreadDetailsProps) => JSX.Element | null;
};

export default {
  Query: ({ answerId, commentId, forumQuestionId, children }: ForumQuestionQueryProps) => {
    const Component = withThreadDetails(children);
    return (
      <Component
        questionId={forumQuestionId}
        answerId={answerId}
        commentId={commentId}
        sort={answerSorts.newestSort}
        page="1"
        backLink="/"
      />
    );
  },
};
