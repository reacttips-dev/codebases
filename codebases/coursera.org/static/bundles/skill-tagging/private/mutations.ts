import gql from 'graphql-tag';
import { MutationFn } from 'react-apollo';

/* eslint-disable graphql/template-strings */

const mutationPostFeedback = gql`
  mutation postFeedback($body: Object!) {
    postFeedback(input: $body) @rest(type: "postFeedback", path: "skillTagsFeedback.v1", method: "POST")
  }
`;

export type PostFeedbackVariables = {
  body: {
    learnerSkillTagId: {
      userId: number;
      courseId: string;
      itemId: string;
    };
    learnerSkillTagFeedback: {
      skillTagsShown: string[];
      skillTagsPicked: string[];
      otherFeedback: string[];
      createdAt: number;
    };
  };
};

export type PostFeedbackFn = MutationFn<{}, PostFeedbackVariables>;

export { mutationPostFeedback };
