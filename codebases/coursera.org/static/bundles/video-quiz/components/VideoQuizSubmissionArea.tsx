import React from 'react';

import { Box, Button } from '@coursera/coursera-ui';

import ChangedResponses from 'bundles/compound-assessments/components/local-state/changed-response/ChangedResponses';
import VideoQuizSubmissionButton from 'bundles/video-quiz/components/VideoQuizSubmissionButton';

import type { InVideoQuestion, VideoQuizState } from 'bundles/video-quiz/types';
import type { ChangedResponse } from 'bundles/compound-assessments/components/local-state/changed-response/types';
import type { QuizQuestionPrompt } from 'bundles/compound-assessments/types/FormParts';

import _t from 'i18n!nls/video-quiz';

import 'css!./__styles__/VideoQuizSubmissionArea';

type Props<T extends QuizQuestionPrompt> = {
  question: InVideoQuestion<T>;
  onSubmit: (response: ChangedResponse) => void;
  onContinue: () => void;
  onRetry: () => void;
  questionState: VideoQuizState;
};

class VideoQuizSubmissionArea<T extends QuizQuestionPrompt> extends React.Component<Props<T>> {
  render() {
    const {
      onSubmit,
      onContinue,
      onRetry,
      questionState,
      question,
      question: { id },
    } = this.props;

    const {
      question: { responseType },
    } = question;

    const isContinueOnly = responseType === 'continueOnly';

    return (
      <Box rootClassName="rc-VideoQuizSubmissionArea" flexDirection="row" justifyContent="end" alignItems="center">
        {!isContinueOnly && (
          <Button onClick={onContinue} type="link" size="sm">
            {_t('Skip')}
          </Button>
        )}
        <ChangedResponses ids={[id]}>
          {(changedResponses) => (
            <VideoQuizSubmissionButton
              onContinue={onContinue}
              onRetry={onRetry}
              onSubmit={() => changedResponses && changedResponses.length > 0 && onSubmit(changedResponses[0])}
              question={question}
              apiState={questionState}
            />
          )}
        </ChangedResponses>
      </Box>
    );
  }
}

export default VideoQuizSubmissionArea;
