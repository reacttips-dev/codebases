import React from 'react';
import classNames from 'classnames';
import { Box, Button } from '@coursera/coursera-ui';
import withSingleTracked from 'bundles/common/components/withSingleTracked';
import localStorageEx from 'bundles/common/utils/localStorageEx';

import _t from 'i18n!nls/post-assessment-help';
import 'css!./__styles__/AssessmentHelpFeedback';

const FEEDBACK_KEY_PREFIX = 'POST_QUIZ_HELP_FEEDBACK';
const FEEDBACK_KEY_SEPARATOR = '::::';

function computeLocalStorageKey(feedbackId: string): string {
  return `${FEEDBACK_KEY_PREFIX}${FEEDBACK_KEY_SEPARATOR}${feedbackId}`;
}

type Feedback = 'yes' | 'no';
type State =
  | {
      feedback: Feedback;
      feedbackStep: 'processing';
    }
  | {
      feedback: Feedback;
      feedbackStep: 'complete';
    }
  | {
      feedback: undefined;
      feedbackStep: 'unselected';
    };

type Props = {
  questionInternalId: string;
};

const FEEDBACK_COMPLETE_MESSAGE_TIME = 3000;

const TrackedButton = withSingleTracked({ type: 'BUTTON' })(Button);

/**
 * `AssessmentHelpFeedback` renders a pair of buttons "Yes" and "No"
 * to send Coursera data about whether post assessment help provides value.
 *
 * To track feedback it maintains feedback state in local storage rather
 * than communicating with a persistent BE store.
 *
 * It is very specific and not intended for other use cases. It is intended
 * to live for a short-term, and so does not support some platform-level
 * functionality, such as keyboard motion between buttons.
 */
class AssessmentHelpFeedback extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const storedFeedbackKey = computeLocalStorageKey(props.questionInternalId);
    const storedFeedback = window?.localStorage?.getItem(storedFeedbackKey);
    this.state = storedFeedback
      ? {
          feedback: storedFeedback as Feedback,
          feedbackStep: 'complete',
        }
      : {
          feedback: undefined,
          feedbackStep: 'unselected',
        };
  }

  saveFeedback(feedback: Feedback) {
    const { questionInternalId } = this.props;
    const storedFeedbackKey = computeLocalStorageKey(questionInternalId);
    localStorageEx.setItem(storedFeedbackKey, feedback, String);
    this.setState({
      feedback,
      feedbackStep: 'processing',
    });
    // give some lag for marking UI state of feedback completed, helps fade
    // messages
    setTimeout(() => {
      this.completeFeedback();
    }, FEEDBACK_COMPLETE_MESSAGE_TIME);
  }

  completeFeedback() {
    const { feedback, feedbackStep } = this.state;
    if (feedbackStep === 'processing') {
      this.setState({
        feedback,
        feedbackStep: 'complete',
      });
    }
  }

  render() {
    const { questionInternalId } = this.props;
    const { feedbackStep } = this.state;

    return (
      <Box
        rootClassName="rc-AssessmentHelpFeedback"
        flexDirection="row"
        alignItems="center"
        htmlAttributes={{
          'aria-hidden': feedbackStep === 'complete',
        }}
      >
        {(feedbackStep === 'processing' || feedbackStep === 'complete') && (
          <span className={classNames('feedback-complete-message', { 'fade-out': feedbackStep === 'complete' })}>
            {_t('Thanks for your feedback!')}
          </span>
        )}
        {feedbackStep === 'unselected' && [
          _t('Was this material helpful?'),
          <TrackedButton
            rootClassName="feedback-button"
            htmlAttributes={{ tabIndex: -1 }}
            type="secondary"
            onClick={() => {
              this.saveFeedback('yes');
            }}
            trackingName="helpful_feedback_button"
            trackingData={{ question_internal_id: questionInternalId, value: 'yes' }}
            label={_t('Yes')}
            size="zero"
          />,
          <TrackedButton
            rootClassName="feedback-button"
            htmlAttributes={{ tabIndex: -1 }}
            type="secondary"
            onClick={() => {
              this.saveFeedback('no');
            }}
            trackingName="helpful_feedback_button"
            trackingData={{ question_internal_id: questionInternalId, value: 'no' }}
            label={_t('No')}
            size="zero"
          />,
        ]}
      </Box>
    );
  }
}

export default AssessmentHelpFeedback;
