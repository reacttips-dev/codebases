import React from 'react';

import Naptime from 'bundles/naptimejs';

import { compose, mapProps } from 'recompose';
import { Box } from '@coursera/coursera-ui';

import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';

import SetLearnerGoalCard from 'bundles/goal-setting/components/card/SetLearnerGoalCard';
import SetLearnerGoalModal from 'bundles/goal-setting/components/card/SetLearnerGoalModal';
import SetLearnerGoalModalCDS from 'bundles/goal-setting/components/card/cds/SetLearnerGoalModal';
import ViewLearnerGoalCard from 'bundles/goal-setting/components/card/ViewLearnerGoalCard';
import withLearnerGoals from 'bundles/goal-setting/hoc/withLearnerGoals';
import withCourseBranchId from 'bundles/goal-setting/hoc/withCourseBranchId';
import withGoalChoices from 'bundles/goal-setting/hoc/withGoalChoices';

import { isFullGoalSettingCardEnabled } from 'bundles/learning-assistant/utils/featureGates';
import { LearnerGoal } from 'bundles/goal-setting/types/LearnerGoal';
import { GoalChoice } from 'bundles/goal-setting/types/GoalChoice';

import 'css!bundles/goal-setting/components/card/__styles__/LearnerGoalCard';

type InputProps = {
  courseSlug: string;
};

type Props = InputProps & {
  areLearnerGoalsLoading: boolean;
  learnerGoals: LearnerGoal[];
  branchId: string;
  courseId: string;
  goalChoices: GoalChoice[];
  areGoalChoicesLoading: boolean;
};

type State = {
  isSetGoalModalOpen: boolean;
};

export class LearnerGoalCard extends React.Component<Props, State> {
  state = {
    isSetGoalModalOpen: false,
  };

  render() {
    const { branchId, goalChoices, learnerGoals, courseId } = this.props;
    const { isSetGoalModalOpen } = this.state;

    return (
      <Box rootClassName="rc-LearnerGoalCard" flexDirection="row" justifyContent="between" alignItems="start">
        {isFullGoalSettingCardEnabled(courseId) ? (
          <SetLearnerGoalModalCDS
            branchId={branchId}
            courseId={courseId}
            goalChoices={goalChoices}
            onDismiss={() => this.setState({ isSetGoalModalOpen: false })}
            isOpen={isSetGoalModalOpen}
          />
        ) : (
          <SetLearnerGoalModal
            branchId={branchId}
            courseId={courseId}
            goalChoices={goalChoices}
            onDismiss={() => this.setState({ isSetGoalModalOpen: false })}
            isOpen={isSetGoalModalOpen}
          />
        )}

        {learnerGoals.length > 0 ? (
          <ViewLearnerGoalCard
            branchId={branchId}
            goalChoices={goalChoices}
            courseId={courseId}
            learnerGoal={learnerGoals[0]}
          />
        ) : (
          <SetLearnerGoalCard
            onSetGoal={() =>
              this.setState({
                isSetGoalModalOpen: true,
              })
            }
          />
        )}
      </Box>
    );
  }
}

export default compose<Props, InputProps>(
  Naptime.createContainer(({ courseSlug }: InputProps) => ({
    course: CoursesV1.bySlug(courseSlug, {
      fields: ['id'],
    }),
  })),
  mapProps(({ course: { id: courseId } }: { course: { id: string } }) => ({ courseId })),
  withCourseBranchId,
  withLearnerGoals,
  withGoalChoices
)(LearnerGoalCard);
