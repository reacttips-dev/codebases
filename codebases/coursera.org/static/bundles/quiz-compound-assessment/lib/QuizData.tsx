import React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { QuizQuestionPrompt, QuizQuestionResponse } from 'bundles/compound-assessments/types/FormParts';

import transformQuizToFormData from 'bundles/quiz-compound-assessment/lib/util/transformQuizToFormData';

/* eslint-disable graphql/template-strings */
export const quizSessionMetaDataQuery = gql`
  query QuizSessionMetaDataQuery($body: String!) {
    quizSessionMetaData(body: $body)
      @rest(type: "RestQuizSessionMetadata", path: "onDemandExamSessions.v1", method: "POST", bodyKey: "body") {
      elements @type(name: "RestQuizSessionMetadataElement") {
        id
      }
    }
  }
`;

export const quizDataQuery = gql`
  query QuizDataQuery(
    $sessionId: String!
    $questionDataArgs: String!
    $responseDataArgs: String!
    $skipFetchingResponses: Boolean!
  ) {
    quizQuestionData(sessionId: $sessionId, questionDataArgs: $questionDataArgs)
      @rest(
        type: "QuizQuestionData"
        path: "onDemandExamSessions.v1/{args.sessionId}/actions"
        method: "POST"
        bodyKey: "questionDataArgs"
      ) {
      elements @type(name: "RestQuizQuestionDataElement") {
        id
        result @type(name: "RestQuizQuestionDataElementResult") {
          questions
          nextSubmissionDraftId
          evaluation
          responses(sessionId: $sessionId, responseDataArgs: $responseDataArgs)
            @skip(if: $skipFetchingResponses)
            @rest(
              type: "QuizResponseData"
              path: "onDemandExamSessions.v1/{args.sessionId}/actions"
              method: "POST"
              bodyKey: "responseDataArgs"
            ) {
            elements @type(name: "RestQuizResponseDataElement") {
              id
              result
            }
          }
        }
      }
    }
  }
`;

/* eslint-enable graphql/template-strings */

type QuizFormData = {
  prompt: QuizQuestionPrompt;
  response: QuizQuestionResponse;
};

type Props = {
  courseId: string;
  itemId: string;
  examSessionId?: string;
  onQuizSessionQueryCompleted?: () => any;
  children: (x0: {
    sessionId?: string;
    quizFormData?: Array<QuizFormData>;
    attemptScore?: number;
    totalPoints?: number;
    nextSubmissionDraftId?: string;
    isSubmitted?: boolean;
    isLimitedFeedback?: boolean;
    hasDraft?: boolean;
    loading: boolean;
    refetchQuizData?: () => Promise<any>;
    client?: any;
  }) => React.ReactNode;
};

// TODO: Unify and move score calculation to BE https://coursera.atlassian.net/browse/CP-6072
const getAttemptScore = (evaluation?: {
  score?: number;
  maxScore?: number;
  extraCreditScore?: number;
}): number | undefined => {
  if (!evaluation || !evaluation.maxScore) {
    return undefined;
  }
  const { score, maxScore, extraCreditScore } = evaluation;
  return ((score || 0) + (extraCreditScore || 0)) / maxScore;
};

export const QuizData = ({ courseId, itemId, examSessionId, children, onQuizSessionQueryCompleted }: Props) => {
  const sessionArgs = {
    courseId,
    itemId,
  };
  const questionDataArgs = {
    argument: [],
    name: 'getState',
  };

  const responseDataArgs = {
    argument: [],
    name: 'getLatestSubmissionDraft',
  };
  return (
    <Query
      query={quizSessionMetaDataQuery}
      variables={{ body: sessionArgs }}
      onCompleted={onQuizSessionQueryCompleted}
      skip={!!examSessionId}
    >
      {({ loading, data, refetch: refetchSession }: $TSFixMe) => {
        if (loading && !examSessionId) {
          return children({ loading });
        }
        const sessionId = examSessionId || data.quizSessionMetaData.elements[0].id;
        return (
          <Query
            query={quizDataQuery}
            variables={{ sessionId, questionDataArgs, responseDataArgs, skipFetchingResponses: !!examSessionId }}
          >
            {({ loading: quizDataLoading, data: quizData, refetch: refetchData, client }: $TSFixMe) => {
              if (quizDataLoading) {
                return children({ loading: quizDataLoading });
              }
              const {
                questions,
                responses,
                nextSubmissionDraftId,
                evaluation,
              } = quizData.quizQuestionData.elements[0].result;
              const quizResponses = responses?.elements?.[0]?.result?.draft?.input?.responses;
              const quizFormData = transformQuizToFormData(questions, quizResponses, !!examSessionId);
              const attemptScore = getAttemptScore(evaluation);
              const totalPoints =
                (evaluation || {}).maxScore ||
                quizFormData.reduce(
                  (points, quizFormDataElement) => points + quizFormDataElement.prompt.weightedScoring.maxScore,
                  0
                );
              const isSubmitted = !questions[0].isSubmitAllowed;
              const isLimitedFeedback = questions[0].variant.detailLevel === 'NoDetails';
              const hasDraft = !!quizResponses;

              const refetchQuizData = () => {
                return refetchSession().then(() => refetchData());
              };

              return children({
                loading: quizDataLoading,
                quizFormData,
                sessionId,
                nextSubmissionDraftId,
                isSubmitted,
                isLimitedFeedback,
                attemptScore,
                totalPoints,
                hasDraft,
                refetchQuizData,
                client,
              });
            }}
          </Query>
        );
      }}
    </Query>
  );
};

export default QuizData;
