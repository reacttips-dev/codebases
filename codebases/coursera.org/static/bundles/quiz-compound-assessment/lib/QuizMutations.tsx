import React from 'react';
import gql from 'graphql-tag';
import { Mutation, MutationFn } from 'react-apollo';

/* eslint-disable graphql/template-strings */
export const quizActionsMutation = gql`
  mutation QuizActions($sessionId: String!, $body: String!, $skipQuestionsField: Boolean!, $additionalParams: String!)
  @redirectToLogin {
    action(sessionId: $sessionId, body: $body, additionalParams: $additionalParams)
      @rest(
        type: "QuizActionData"
        path: "onDemandExamSessions.v1/{args.sessionId}/actions{args.additionalParams}"
        method: "POST"
        bodyKey: "body"
      ) {
      elements @type(name: "RestQuizQuestionDataElement") {
        id
        result @type(name: "RestQuizQuestionDataElementResult") {
          nextSubmissionDraftId
          evaluation
          questions @skip(if: $skipQuestionsField)
        }
      }
    }
  }
`;
/* eslint-enable graphql/template-strings */

const getSaveDraftMutation = (action: MutationFn<any, any>) => (
  nextSubmissionDraftId: string,
  sessionId: string,
  responses: Array<any>,
  isAutoSaving?: boolean
) => {
  return action({
    variables: {
      body: {
        argument: {
          id: nextSubmissionDraftId,
          input: {
            responses,
          },
        },
        name: 'saveSubmissionDraft',
      },
      sessionId,
      skipQuestionsField: true,
      additionalParams: isAutoSaving ? '?isAutoSaving=true' : '',
    },
  });
};

const getSubmitDraftMutation = (action: MutationFn<any, any>) => (sessionId: string, responses: Array<any>) => {
  return action({
    variables: {
      body: {
        argument: {
          responses,
        },
        name: 'submitResponses',
      },
      sessionId,
      skipQuestionsField: false,
      additionalParams: '',
    },
  });
};

const getAutoSubmitDraftMutation = (action: MutationFn<any, any>) => (sessionId: string) => {
  return action({
    variables: {
      body: {
        argument: {},
        name: 'submitLatestSubmissionDraft',
      },
      sessionId,
      skipQuestionsField: false,
      additionalParams: '',
    },
  });
};

const QuizMutations = ({
  children,
}: {
  children: (x0: {
    saveDraftMutation: (
      nextSubmissionDraftId: string,
      sessionId: string,
      responses: Array<any>,
      isAutoSaving?: boolean
    ) => Promise<any>;
    submitDraftMutation: (sessionId: string, responses: Array<any>) => Promise<any>;
    autoSubmitDraftMutation: (sessionId: string) => Promise<any>;
  }) => JSX.Element;
}) => {
  return (
    <Mutation mutation={quizActionsMutation}>
      {(action: $TSFixMe) => {
        const saveDraftMutation = getSaveDraftMutation(action);
        const submitDraftMutation = getSubmitDraftMutation(action);
        const autoSubmitDraftMutation = getAutoSubmitDraftMutation(action);
        return children({
          saveDraftMutation,
          submitDraftMutation,
          autoSubmitDraftMutation,
        });
      }}
    </Mutation>
  );
};

export default QuizMutations;
