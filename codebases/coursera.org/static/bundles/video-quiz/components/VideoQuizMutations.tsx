import React from 'react';
import gql from 'graphql-tag';

import type { FetchResult } from 'react-apollo';
import { Mutation } from 'react-apollo';

import type { InVideoQuestion } from 'bundles/video-quiz/types';
import type { ChangedResponse } from 'bundles/compound-assessments/components/local-state/changed-response/types';
import type { QuizQuestionResponse, QuizQuestionPrompt } from 'bundles/compound-assessments/types/FormParts';

export type SubmitQuiz = (response: ChangedResponse) => Promise<FetchResult<$TSFixMe, Record<string, $TSFixMe>>>;

interface Mutations {
  submitQuiz: SubmitQuiz;
}

interface Props<InVideoQuestionType extends QuizQuestionPrompt> {
  userId: number;
  itemId: string;
  courseSlug: string;
  question: InVideoQuestion<InVideoQuestionType>;
  sessionId: string;
  children: (mutations: Mutations) => React.ReactNode;
}

const submitQuizMutation = gql`
  mutation submitQuiz(
    $itemId: String!
    $userId: Int!
    $slug: String!
    $sessionId: String!
    $body: String!
    $skipFetchingResponses: Boolean!
  ) {
    submitQuiz(itemId: $itemId, userId: $userId, slug: $slug, sessionId: $sessionId, body: $body)
      @rest(
        type: "RestPracticeQuizQuestionGetStateData"
        path: "opencourse.v1/user/{args.userId}/course/{args.slug}/item/{args.itemId}/lecture/inVideoQuiz/session/{args.sessionId}/action/submitResponse?autoEnroll=false"
        method: "POST"
        bodyKey: "body"
      ) {
      contentResponseBody @type(name: "RestSubmitQuizResponseBody") {
        return @type(name: "RestContentResponseBodyReturnObject") {
          id
          isSubmitAllowed
          feedback {
            feedbackLevel
            definition {
              isCorrect
              display {
                typeName
                definition {
                  dtdId
                  value
                }
              }
              options {
                id
                count
                isCorrect
                feedback {
                  typeName
                  definition {
                    dtdId
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

class VideoQuizMutations<T extends QuizQuestionPrompt> extends React.Component<Props<T>> {
  render() {
    const { itemId, courseSlug, question, sessionId, userId, children } = this.props;
    return (
      <Mutation mutation={submitQuizMutation}>
        {(mutate: $TSFixMe) => {
          const submitQuiz = (response: ChangedResponse) =>
            mutate({
              variables: {
                sessionId,
                userId,
                itemId,
                slug: courseSlug,
                body: {
                  contentRequestBody: {
                    argument: {
                      questionInstance: question.id,
                      response: (response?.response as QuizQuestionResponse)?.definition?.value,
                      timestamp: null,
                    },
                  },
                },
              },
            }) as Promise<FetchResult<$TSFixMe, Record<string, $TSFixMe>>>;
          return children({ submitQuiz });
        }}
      </Mutation>
    );
  }
}

export default VideoQuizMutations;
