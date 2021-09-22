import React from 'react';
import classNames from 'classnames';

import TrackedDiv from 'bundles/page/components/TrackedDiv';
import withSingleTracked from 'bundles/common/components/withSingleTracked';

import { Button, CardV2 } from '@coursera/coursera-ui';
import { SvgClose } from '@coursera/coursera-ui/svg';

import { LearningAssistanceMessage } from 'bundles/learning-assistant/types/RealtimeMessages';
import { GoalChoice } from 'bundles/goal-setting/types/GoalChoice';
import { markAsSeen } from 'bundles/learning-assistant/api/messagesSent';
import { isFullGoalSettingCardEnabled } from 'bundles/learning-assistant/utils/featureGates';

import LearningAssistantPushMessageContent from 'bundles/learning-assistant/components/LearningAssistantPushMessageContent';

import 'css!bundles/learning-assistant/components/__styles__/LearningAssistantPushMessage';

type Props = {
  courseId: string;
  message: LearningAssistanceMessage;
  onDismiss: (msg: LearningAssistanceMessage) => void;
  toggleSetLearnerGoalModal: (goalChoices: GoalChoice[], branchId: string | null) => void;
};

const TrackedButton = withSingleTracked({ type: 'BUTTON' })(Button);

class LearningAssistantPushMessage extends React.Component<Props> {
  componentDidMount() {
    const {
      message: {
        messageBody: { id },
      },
    } = this.props;
    markAsSeen([id]);
  }

  render() {
    const { courseId, message, toggleSetLearnerGoalModal, onDismiss } = this.props;

    return (
      <TrackedDiv
        withVisibilityTracking={true}
        data={{ message }}
        trackingName="message_card"
        className={classNames([
          'rc-LearningAssistantPushMessage',
          { 'with-cds': isFullGoalSettingCardEnabled(courseId) },
        ])}
      >
        <CardV2
          htmlAttributes={{
            role: 'dialog',
            'aria-labelledby': 'assistant-header',
            'aria-describedby': 'assistant-card',
          }}
          rootClassName="assistant-card"
        >
          <TrackedButton
            onClick={() => message && onDismiss(message)}
            rootClassName="assistant-close"
            size="zero"
            type="noStyle"
            trackingName="message_closed"
            trackingData={{
              message,
            }}
          >
            <SvgClose />
          </TrackedButton>
          <div className="assistant-content">
            <LearningAssistantPushMessageContent
              courseId={courseId}
              message={message}
              toggleSetLearnerGoalModal={toggleSetLearnerGoalModal}
              onDismiss={() => onDismiss(message)}
            />
          </div>
        </CardV2>
      </TrackedDiv>
    );
  }
}

export default LearningAssistantPushMessage;
