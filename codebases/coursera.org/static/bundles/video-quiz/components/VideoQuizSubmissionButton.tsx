import React from 'react';

import { ApiButton } from '@coursera/coursera-ui';
import type { ApiStatus } from '@coursera/coursera-ui/lib/constants/sharedConstants';
import { API_BEFORE_SEND, API_IN_PROGRESS } from '@coursera/coursera-ui/lib/constants/sharedConstants';

import type { InVideoQuestion, VideoQuizState } from 'bundles/video-quiz/types';

import _t from 'i18n!nls/video-quiz';

import 'css!bundles/video-quiz/components/__styles__/VideoQuizSubmissionButton';
import type { QuizQuestionPrompt } from 'bundles/compound-assessments/types/FormParts';

interface Props<T extends QuizQuestionPrompt> {
  question: InVideoQuestion<T>;
  onSubmit: () => void;
  onRetry: () => void;
  onContinue: () => void;
  apiState: VideoQuizState;
}

class VideoQuizSubmissionButton<T extends QuizQuestionPrompt> extends React.Component<Props<T>> {
  render() {
    const { onRetry, question, onSubmit, onContinue, apiState } = this.props;
    const {
      question: { responseType },
    } = question;

    const isContinueOnly = responseType === 'continueOnly';

    let buttonClick;
    let buttonText;
    let buttonState: ApiStatus = API_BEFORE_SEND;

    switch (apiState) {
      case 'submitting':
        buttonState = API_IN_PROGRESS;
        buttonText = _t('Submitting...');
        break;
      case 'ready':
        buttonClick = onSubmit;
        buttonText = _t('Submit');
        break;
      case 'retry':
        buttonClick = onRetry;
        buttonText = _t('Retry');
        break;
      default:
        buttonClick = onContinue;
        buttonText = _t('Continue');
    }

    if (isContinueOnly) {
      switch (apiState) {
        case 'submitting':
          buttonText = _t('Continuing...');
          break;
        default:
          buttonText = _t('Continue');
          buttonClick = onContinue;
          break;
      }
    }

    return (
      <ApiButton
        label={buttonText}
        apiStatus={buttonState}
        onClick={buttonClick}
        rootClassName="rc-VideoQuizSubmissionButton"
        type="primary"
        size="sm"
      />
    );
  }
}

export default VideoQuizSubmissionButton;
