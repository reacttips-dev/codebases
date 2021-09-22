import React, { Component } from 'react';

import { Box, H4Bold } from '@coursera/coursera-ui';

import user from 'js/lib/user';
import localStorage from 'js/lib/coursera.store';

import type { SubmitQuiz } from 'bundles/video-quiz/components/VideoQuizMutations';
import VideoQuizMutations from 'bundles/video-quiz/components/VideoQuizMutations';
import VideoQuizQuestionArea from 'bundles/video-quiz/components/VideoQuizQuestionArea';
import VideoQuizSubmissionArea from 'bundles/video-quiz/components/VideoQuizSubmissionArea';
import QuestionTypes from 'bundles/author-questions/constants/QuestionTypes';
import keys from 'bundles/phoenix/components/a11y/constants';

import type { InVideoQuestion, VideoQuizState } from 'bundles/video-quiz/types';
import type { ChangedResponse } from 'bundles/compound-assessments/components/local-state/changed-response/types';

import type {
  QuizQuestionPrompt,
  QuizQuestionResponse,
  QuestionFeedbackResponse,
} from 'bundles/compound-assessments/types/FormParts';

import 'css!./__styles__/VideoQuiz';

import _t from 'i18n!nls/video-quiz';

type VideoQuizContentProps<T extends QuizQuestionPrompt> = {
  question: InVideoQuestion<T> | null;
  onContinue: () => void;
  onSubmit: SubmitQuiz;
};

interface VideoQuizContentState {
  isSubmitting: boolean;
  didError: boolean;
  latestResponse: ChangedResponse | null;
  latestFeedback: QuestionFeedbackResponse | null;
}

export class VideoQuizContent<T extends QuizQuestionPrompt> extends Component<
  VideoQuizContentProps<T>,
  VideoQuizContentState
> {
  windowRef?: HTMLElement | null;

  blurListeningEnabled = false;

  state: VideoQuizContentState = {
    isSubmitting: false,
    didError: false,
    latestFeedback: null,
    latestResponse: null,
  };

  get localStorageKey() {
    return `videoQuizResponses.${this.props.question?.id}`;
  }

  componentDidMount() {
    const elements = this.getFocusableWindowElements();

    elements?.first?.focus();

    document.addEventListener('keydown', this.keyListener);
    document.addEventListener('mousedown', this.mouseListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyListener);
    document.removeEventListener('mousedown', this.mouseListener);
  }

  onBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const { relatedTarget } = e;

    if (this.blurListeningEnabled) {
      if (this.windowRef) {
        if (relatedTarget && !this.windowRef.contains(relatedTarget as Node)) {
          const elements = this.getFocusableWindowElements();
          elements?.first?.focus();
        }
      }
    }
  };

  mouseListener = () => {
    this.blurListeningEnabled = false;
  };

  keyListener = (e: KeyboardEvent) => {
    const { onContinue } = this.props;

    this.blurListeningEnabled = true;

    if (e.keyCode === keys.tab) {
      this.handleTabKey(e);
    } else if (e.keyCode === keys.esc) {
      onContinue();
    }
  };

  handleTabKey = (e: KeyboardEvent) => {
    const elements = this.getFocusableWindowElements();

    if (elements) {
      if (e.shiftKey && elements.active === elements.first) {
        elements.last.focus();
        e.preventDefault();
      }

      if (!e.shiftKey && elements.active === elements.last) {
        elements.first.focus();
        e.preventDefault();
      }
    }
  };

  handleFocus = () => {
    const elements = this.getFocusableWindowElements();

    if (elements) {
      elements.first.focus();
    }
  };

  getFocusableWindowElements = () => {
    if (this.windowRef) {
      const focusableModalElements = this.windowRef.querySelectorAll(
        'a[href], button, textarea, input, select, iframe, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableModalElements[0] as HTMLElement;
      const lastElement = focusableModalElements[focusableModalElements.length - 2] as HTMLElement;
      const activeElement = document.activeElement as HTMLElement;

      return { first: firstElement, last: lastElement, active: activeElement, all: focusableModalElements };
    }

    return null;
  };

  getPersistedResponse() {
    const { question } = this.props;

    if (question) {
      const response = localStorage.get(this.localStorageKey);

      if (response) {
        return response;
      }
    }

    return { feedback: null, response: null };
  }

  setPersistedResponse(feedback: QuestionFeedbackResponse | null, response: ChangedResponse | null) {
    const { question } = this.props;

    if (question) {
      localStorage.set(`videoQuizResponses.${question.id}`, {
        feedback,
        response,
      });
    }
  }

  getQuestionWithSubmission() {
    const { question } = this.props;
    const { latestResponse, latestFeedback } = this.state;

    if (question) {
      const persistedResponse = this.getPersistedResponse();

      const feedback = latestFeedback || persistedResponse.feedback;

      const response = latestResponse || persistedResponse.response;

      const effectiveResponse = {
        questionInstance: question.id,
        response: (response?.response as QuizQuestionResponse)?.definition?.value,
      };

      return {
        ...question,
        feedback,
        effectiveResponse,
      } as InVideoQuestion<T>;
    }

    return null;
  }

  resetQuestion() {
    localStorage.remove(this.localStorageKey);
    this.setState({
      isSubmitting: false,
      didError: false,
      latestFeedback: null,
      latestResponse: null,
    });
  }

  render() {
    const { onContinue, onSubmit, question } = this.props;
    const { isSubmitting, didError } = this.state;

    if (!question) {
      return null;
    }

    const questionWithSubmission = this.getQuestionWithSubmission();
    const feedback = questionWithSubmission?.feedback;
    const isCorrect = feedback?.definition?.isCorrect;
    const isPoll = ([QuestionTypes.Poll, QuestionTypes.CheckboxPoll] as string[]).includes(question.question.type);

    let currentState: VideoQuizState = 'ready';

    if (didError) {
      currentState = 'errored';
    } else if (isSubmitting) {
      currentState = 'submitting';
    } else if (feedback) {
      if (isCorrect || isPoll) {
        currentState = 'done';
      } else {
        currentState = 'retry';
      }
    }

    return (
      <div
        role="dialog"
        className="rc-VideoQuiz__window"
        ref={(ref) => {
          this.windowRef = ref;
        }}
      >
        <Box onBlur={this.onBlur} flexDirection="column" style={{ height: '100%', width: '100%' }}>
          <H4Bold>{isPoll ? _t('Poll') : _t('Question')}</H4Bold>
          <VideoQuizQuestionArea
            isReadonly={typeof isCorrect !== 'undefined'}
            currentState={currentState}
            isDisabled={isCorrect}
            question={questionWithSubmission}
          />
          <VideoQuizSubmissionArea
            onRetry={() => this.resetQuestion()}
            onContinue={onContinue}
            onSubmit={(response) => {
              this.setState({
                isSubmitting: true,
              });

              onSubmit(response)
                .then((payload) => {
                  const { feedback: responseFeedback } = payload?.data?.submitQuiz?.contentResponseBody?.return ?? {};

                  this.setState({
                    isSubmitting: false,
                    didError: false,
                    latestFeedback: responseFeedback,
                    latestResponse: response,
                  });

                  this.setPersistedResponse(responseFeedback, response);
                })
                .catch(() => this.setState({ didError: true }));
            }}
            question={question}
            questionState={currentState}
          />
          <button type="button" className="focus-trap" onFocus={this.handleFocus} />
        </Box>
      </div>
    );
  }
}

type VideoQuizProps<T extends QuizQuestionPrompt> = {
  question: InVideoQuestion<T> | null;
  sessionId: string;
  itemMetadata: $TSFixMe;
  onContinue: () => void;
};

class VideoQuiz<T extends QuizQuestionPrompt> extends React.Component<VideoQuizProps<T>> {
  render() {
    const { onContinue, sessionId, itemMetadata, question } = this.props;
    if (!question) {
      return null;
    }

    const userID = user.get().id;
    const itemId = itemMetadata.get('id');
    const courseSlug = itemMetadata.get('course').get('slug');

    return (
      <div className="rc-VideoQuiz">
        <VideoQuizMutations
          itemId={itemId}
          courseSlug={courseSlug}
          userId={userID}
          sessionId={sessionId}
          question={question}
        >
          {({ submitQuiz }) => <VideoQuizContent question={question} onContinue={onContinue} onSubmit={submitQuiz} />}
        </VideoQuizMutations>
      </div>
    );
  }
}

export default VideoQuiz;
