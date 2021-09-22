import React from 'react';
import { compose } from 'recompose';

import user from 'js/lib/user';

import CMLUtils from 'bundles/cml/utils/CMLUtils';
import Modal from 'bundles/ui/components/Modal';

import { GoalChoice } from 'bundles/goal-setting/types/GoalChoice';
import { LearnerGoalsQuery } from 'bundles/goal-setting/hoc/withLearnerGoals';

import computeSelectedDaysFromGoal from 'bundles/goal-setting/utils/computeSelectedDaysFromGoal';
import GoalSettingSetGoal from 'bundles/goal-setting/components/GoalSettingSetGoal';
import GoalSettingSetSchedule from 'bundles/goal-setting/components/GoalSettingSetSchedule';
import withUpdateGoalMutation from 'bundles/goal-setting/hoc/withUpdateGoalMutation';

import { LearnerGoal } from 'bundles/goal-setting/types/LearnerGoal';

import 'css!bundles/goal-setting/components/card/__styles__/EditLearnerGoalModal';

type InputProps = {
  onDismiss: () => void;
  currentLearnerGoal: LearnerGoal;
  isOpen: boolean;
  courseId: string;
  goalChoices: GoalChoice[];
  branchId: string;
};

type Props = InputProps & {
  updateGoal: (config: {
    variables: {};
    refetchQueries: Array<{ variables: {}; query: object }>;
  }) => Promise<{
    data: {
      action: {
        id: string;
        name: string;
      };
    };
  }>;
};

type State = {
  goalCreationInProgress: boolean;
  goalCreationComplete: boolean;
  selectedDays: string[];
};

export class EditLearnerGoalModal extends React.Component<Props, State> {
  state = {
    goalCreationInProgress: false,
    goalCreationComplete: false,
    selectedDays: [],
  };

  handleGoalSelection = (choice: GoalChoice) => {
    const { branchId, currentLearnerGoal, updateGoal } = this.props;

    this.setState({
      goalCreationInProgress: true,
    });

    updateGoal({
      variables: {
        userId: user.get().id?.toString(),
        body: {
          id: currentLearnerGoal.id?.toString(),
          goalType: choice.goalType,
          name: CMLUtils.getValue(choice.name),
          description: CMLUtils.getValue(choice.description),
        },
      },
      refetchQueries: [
        {
          query: LearnerGoalsQuery,
          variables: {
            courseBranchId: branchId,
            userId: user.get().id.toString(),
          },
        },
      ],
    }).then(() => {
      this.setState({
        goalCreationInProgress: false,
        goalCreationComplete: true,
        selectedDays: computeSelectedDaysFromGoal(choice),
      });
    });
  };

  handleSelectedDaysChanged = (selectedDays: string[]) => {
    this.setState({ selectedDays });
  };

  handleDismiss = () => {
    const { onDismiss } = this.props;

    this.setState({ goalCreationComplete: false });

    onDismiss();
  };

  render() {
    const { isOpen } = this.props;
    const { goalChoices, currentLearnerGoal, courseId } = this.props;
    const { goalCreationInProgress, goalCreationComplete, selectedDays } = this.state;

    return (
      <Modal
        allowClose={true}
        shouldCloseOnOverlayClick={false}
        onRequestClose={this.handleDismiss}
        isOpen={isOpen}
        className="rc-EditLearnerGoalModal"
      >
        {goalCreationComplete ? (
          <GoalSettingSetSchedule
            selectedDays={selectedDays}
            courseId={courseId}
            onSelectedDaysChanged={this.handleSelectedDaysChanged}
            onDismiss={this.handleDismiss}
            showEditButton={false}
            showSkipButton={false}
          />
        ) : (
          <GoalSettingSetGoal
            goalChoices={goalChoices}
            existingLearnerGoal={currentLearnerGoal}
            goalCreationInProgress={goalCreationInProgress}
            onGoalSelection={this.handleGoalSelection}
            onDismiss={this.handleDismiss}
          />
        )}
      </Modal>
    );
  }
}

export default compose<Props, InputProps>(withUpdateGoalMutation)(EditLearnerGoalModal);
