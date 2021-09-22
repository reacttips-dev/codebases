import React, { useState } from 'react';

import { Box, Button } from '@coursera/coursera-ui';
import { SvgaLightbulb } from '@coursera/coursera-ui/svg';

import { GoalChoice } from 'bundles/goal-setting/types/GoalChoice';
import { LearnerGoalsV1 } from 'bundles/naptimejs/resources/__generated__/LearnerGoalsV1';
import { isFullGoalSettingCardEnabled } from 'bundles/learning-assistant/utils/featureGates';

import SetLearnerGoalFlow from 'bundles/goal-setting/components/card/cds/SetLearnerGoalFlow';
import withLearnerGoals from 'bundles/goal-setting/hoc/withLearnerGoals';

import _t from 'i18n!nls/learning-assistant';

type InputProps = {
  courseId: string;
  branchId: string;
  onDismiss: () => void;
  goalChoices: GoalChoice[];
  toggleSetLearnerGoalModal: () => void;
};

type Props = InputProps & {
  areLearnerGoalsLoading: boolean;
  learnerGoals: LearnerGoalsV1[];
};

export const LearningAssistantSetGoalMessage: React.FC<Props> = ({
  learnerGoals,
  onDismiss,
  goalChoices,
  branchId,
  courseId,
  toggleSetLearnerGoalModal,
}) => {
  // Prevent the card from being dismissed if it is used to set a new goal
  const [dismissalLocked, setDismissalLock] = useState(false);

  if (!dismissalLocked && (learnerGoals?.length ?? 0 > 0)) {
    onDismiss();
  }

  if (isFullGoalSettingCardEnabled(courseId)) {
    return (
      <SetLearnerGoalFlow
        beforeGoalSave={() => setDismissalLock(true)}
        onDismiss={onDismiss}
        goalChoices={goalChoices}
        branchId={branchId}
        courseId={courseId}
      />
    );
  }

  return (
    <Box flexDirection="row" justifyContent="start" alignItems="start">
      <div className="alice-icon">
        <SvgaLightbulb size={32} />
      </div>

      <div>
        <h1 id="assistant-header" className="assistant-header">
          {_t('Set a weekly goal')}
        </h1>

        <p id="assistant-description" className="assistant-description">
          {_t('Learners who set a goal are 75% more likely to complete the course. You can always change it.')}
        </p>

        <Button
          onClick={() => {
            toggleSetLearnerGoalModal();
            onDismiss();
          }}
          rootClassName="assistant-cta"
          size="sm"
          type="primary"
          label={_t('Set goal')}
        />
      </div>
    </Box>
  );
};

export default withLearnerGoals(LearningAssistantSetGoalMessage);
