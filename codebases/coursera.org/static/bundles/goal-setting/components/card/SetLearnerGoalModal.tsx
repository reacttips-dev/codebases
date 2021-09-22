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
import withCreateGoalMutation from 'bundles/goal-setting/hoc/withCreateGoalMutation';

import 'css!bundles/goal-setting/components/card/__styles__/SetLearnerGoalModal';

type InputProps = {
  onDismiss: () => void;
  isOpen: boolean;
  courseId: string;
  branchId: string | null;
  goalChoices: GoalChoice[];
};

type Props = InputProps & {
  createGoal: (config: {
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

export class SetLearnerGoalModal extends React.Component<Props, State> {
  state = {
    goalCreationInProgress: false,
    goalCreationComplete: false,
    selectedDays: [],
  };

  handleSelectedDaysChanged = (selectedDays: string[]) => {
    this.setState({ selectedDays });
  };

  handleDismiss = () => {
    const { onDismiss } = this.props;

    this.setState({ goalCreationComplete: false });

    onDismiss();
  };

  handeGoalSelected = (choice: GoalChoice) => {
    const { branchId, createGoal } = this.props;

    this.setState({ goalCreationInProgress: true });

    createGoal({
      variables: {
        body: {
          ...choice,
          name: CMLUtils.getValue(choice.name),
          description: CMLUtils.getValue(choice.description),
        },
      },
      refetchQueries: [
        {
          query: LearnerGoalsQuery,
          variables: {
            courseBranchId: branchId,
            userId: user.get().id?.toString(),
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

  render() {
    const { isOpen } = this.props;
    const { branchId, goalChoices, courseId } = this.props;
    const { goalCreationInProgress, goalCreationComplete, selectedDays } = this.state;

    if (goalChoices.length === 0 || branchId === null) {
      return null;
    }

    return (
      <Modal
        allowClose={true}
        shouldCloseOnOverlayClick={false}
        onRequestClose={this.handleDismiss}
        isOpen={isOpen}
        className="rc-SetLearnerGoalModal"
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
            goalCreationInProgress={goalCreationInProgress}
            onGoalSelection={this.handeGoalSelected}
            onDismiss={this.handleDismiss}
          />
        )}
      </Modal>
    );
  }
}

export default compose<Props, InputProps>(withCreateGoalMutation)(SetLearnerGoalModal);
