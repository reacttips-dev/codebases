import React from 'react';

import { compose } from 'recompose';
import { Box } from '@coursera/coursera-ui';

import Retracked from 'js/lib/retracked';

import ConnectToRealtimeMessaging from 'bundles/realtime-messaging/components/ConnectToRealtimeMessaging';
import LearningAssistantPushMessage from 'bundles/learning-assistant/components/LearningAssistantPushMessage';
import SetLearnerGoalModal from 'bundles/goal-setting/components/card/SetLearnerGoalModal';

import { ChannelName } from 'bundles/realtime-messaging/types';
import { LearningAssistanceMessage } from 'bundles/learning-assistant/types/RealtimeMessages';

import LearningAssistantSlideInAndOutTransition from 'bundles/learning-assistant/components/LearningAssistantSlideInAndOutTransition';

import { GoalChoice } from 'bundles/goal-setting/types/GoalChoice';

import 'css!./__styles__/LearningAssistant';

type Props = {
  courseId: string;
};

type State = {
  isSetLearnerGoalModalOpen: boolean;
  setLearnerGoalModalChoices: GoalChoice[];
  setLearnerGoalModalBranchId: string | null;
};

class LearningAssistant extends React.Component<Props, State> {
  state = {
    isSetLearnerGoalModalOpen: false,
    setLearnerGoalModalChoices: [],
    setLearnerGoalModalBranchId: null,
  };

  toggleSetLearnerGoalModal = (goalChoices: GoalChoice[], branchId: string | null) => {
    this.setState(({ isSetLearnerGoalModalOpen }) => ({
      isSetLearnerGoalModalOpen: !isSetLearnerGoalModalOpen,
      setLearnerGoalModalBranchId: branchId,
      setLearnerGoalModalChoices: goalChoices,
    }));
  };

  renderSetLearnerGoalModal() {
    const { courseId } = this.props;
    const { isSetLearnerGoalModalOpen, setLearnerGoalModalBranchId, setLearnerGoalModalChoices } = this.state;

    return (
      <SetLearnerGoalModal
        isOpen={isSetLearnerGoalModalOpen}
        branchId={setLearnerGoalModalBranchId}
        courseId={courseId}
        goalChoices={setLearnerGoalModalChoices}
        onDismiss={() => this.toggleSetLearnerGoalModal(setLearnerGoalModalChoices, setLearnerGoalModalBranchId)}
      />
    );
  }

  render() {
    const { courseId } = this.props;

    return (
      <div className="rc-LearningAssistant">
        <Box rootClassName="messages" flexDirection="column" justifyContent="end" alignItems="start">
          <ConnectToRealtimeMessaging channelName={ChannelName.LearningAssistance}>
            {({ messages: pushMessages, removeMessage: removePushMessage }) => (
              <div>
                <LearningAssistantSlideInAndOutTransition>
                  {pushMessages.length > 0 &&
                    // we need to create a new array, otherwise reverse() will modify
                    // the original array reference
                    [...pushMessages]
                      .reverse()
                      .map((message) => (
                        <LearningAssistantPushMessage
                          key={message.id}
                          courseId={courseId}
                          toggleSetLearnerGoalModal={this.toggleSetLearnerGoalModal}
                          message={message as LearningAssistanceMessage}
                          onDismiss={removePushMessage}
                        />
                      ))}
                </LearningAssistantSlideInAndOutTransition>
              </div>
            )}
          </ConnectToRealtimeMessaging>
        </Box>
        {this.renderSetLearnerGoalModal()}
      </div>
    );
  }
}

export default compose<Props, Props>(
  Retracked.createTrackedContainer(() => ({
    namespace: {
      app: 'learning_assistant',
      page: 'learning_assistant',
    },
  }))
)(LearningAssistant);
