import React from 'react';
import ChangedResponses from 'bundles/compound-assessments/components/local-state/changed-response/ChangedResponses';
import { QuizStepState } from 'bundles/compound-assessments/components/local-state/step-state/StepState';
import AutoSaveDraft from 'bundles/compound-assessments/components/auto-save/AutoSaveDraft';
import ComputedItem from 'bundles/ondemand/lib/ComputedItem';
import ExamSummaries from 'bundles/quiz-compound-assessment/lib/ExamSummaries';
import handleNetworkError from 'bundles/compound-assessments/components/api/utils/handleNetworkError';

import QuizMutations from './QuizMutations';

const QuizActions = ({
  ids,
  sessionId,
  children,
  nextSubmissionDraftId,
}: {
  ids: Array<string>;
  sessionId: string;
  children: (x0: {
    hasUnfilledResponses?: boolean;
    saveDraft?: () => Promise<any>;
    autoSaveDraft?: () => Promise<any>;
    submitDraft?: () => Promise<any>;
    submitLatestSubmissionDraft?: () => Promise<any>;
  }) => JSX.Element;
  nextSubmissionDraftId?: string;
}) => {
  return (
    <ComputedItem>
      {({ item }: $TSFixMe) => {
        if (!item) {
          return null;
        }
        const { courseId, id: itemId } = item;
        return (
          <ExamSummaries courseId={courseId} itemId={itemId}>
            {({ refetch: refetchExamSummaries }) => (
              <ChangedResponses ids={ids}>
                {(changedResponses) => {
                  if (!changedResponses || !refetchExamSummaries) {
                    return children({});
                  }

                  const hasUnfilledResponses = changedResponses.some(
                    // @ts-expect-error TSMIGRATION
                    (changedResponse) => !(((changedResponse || {}).response || {}).definition || {}).value
                  );
                  return (
                    <QuizStepState itemId={itemId} courseId={courseId}>
                      {({ stepState, setStepState }) => (
                        <QuizMutations>
                          {({ saveDraftMutation, submitDraftMutation, autoSubmitDraftMutation }) => {
                            const responses = changedResponses.map((response) => ({
                              questionInstance: response.id,
                              // @ts-expect-error TSMIGRATION
                              response: ((response.response || {}).definition || {}).value,
                            }));

                            const saveDraft = () => {
                              if (!stepState.isSaving && !stepState.isSubmitting && nextSubmissionDraftId) {
                                setStepState({ isSaving: true });
                                return saveDraftMutation(nextSubmissionDraftId, sessionId, responses)
                                  .then(() => setStepState({ isSaving: false }))
                                  .catch((error) => handleNetworkError(error, setStepState));
                              }
                              return Promise.reject();
                            };
                            const autoSaveDraft = () => {
                              if (!stepState.isAutoSaving && !stepState.isSubmitting && nextSubmissionDraftId) {
                                setStepState({ isAutoSaving: true });
                                return saveDraftMutation(nextSubmissionDraftId, sessionId, responses, true)
                                  .then(() => setStepState({ isAutoSaving: false }))
                                  .catch((error) => handleNetworkError(error, setStepState));
                              }
                              return Promise.reject();
                            };

                            const refetchItemAndExamSummary = () => refetchExamSummaries().then(() => item.refetch());

                            const submitDraft = () => {
                              if (!stepState.isSubmitting) {
                                setStepState({ isSubmitting: true });
                                return submitDraftMutation(sessionId, responses)
                                  .then(() => setStepState({ isSubmitting: false }))
                                  .then(refetchItemAndExamSummary)
                                  .catch((error) => handleNetworkError(error, setStepState));
                              }
                              return Promise.reject();
                            };
                            // this function should only be used for auto submit
                            const submitLatestSubmissionDraft = () => {
                              if (!stepState.isSubmitting) {
                                setStepState({ isSubmitting: true });
                                return autoSubmitDraftMutation(sessionId)
                                  .then(() => setStepState({ isSubmitting: false }))
                                  .then(refetchItemAndExamSummary)
                                  .catch((error) => handleNetworkError(error, setStepState));
                              }
                              return Promise.reject();
                            };
                            return (
                              <AutoSaveDraft
                                stepState={stepState}
                                saveDraft={autoSaveDraft}
                                changedResponses={changedResponses}
                              >
                                {() =>
                                  children({
                                    hasUnfilledResponses,
                                    saveDraft,
                                    autoSaveDraft,
                                    submitDraft,
                                    submitLatestSubmissionDraft,
                                  })
                                }
                              </AutoSaveDraft>
                            );
                          }}
                        </QuizMutations>
                      )}
                    </QuizStepState>
                  );
                }}
              </ChangedResponses>
            )}
          </ExamSummaries>
        );
      }}
    </ComputedItem>
  );
};

export default QuizActions;
