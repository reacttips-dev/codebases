import React from 'react';

import SegmentedProgressCircle from 'bundles/goal-setting/components/SegmentedProgressCircle';

import getProgressContentMap from 'bundles/goal-setting/utils/getProgressContentMap';
import computeGoalProgressLevel from 'bundles/goal-setting/utils/computeGoalProgressLevel';
import getCompletedDaysOfWeek from 'bundles/goal-setting/utils/getCompletedDaysOfWeek';

import GoalSettingWeeklyProgress from 'bundles/goal-setting/components/GoalSettingWeeklyProgress';

import withSingleTracked from 'bundles/common/components/withSingleTracked';
import TrackedDiv from 'bundles/page/components/TrackedDiv';

import { Button, Box } from '@coursera/coursera-ui';
import { Typography } from '@coursera/cds-core';

import type { LearnerGoal } from 'bundles/goal-setting/types/LearnerGoal';

import _t from 'i18n!nls/goal-setting';

import 'css!./__styles__/GoalSettingProgressCard';

const TrackedButton = withSingleTracked({ type: 'BUTTON' })(Button);

type Props = {
  learnerGoal: LearnerGoal;
  onDismiss: () => void;
};

const GoalSettingProgressCard = ({ learnerGoal, onDismiss }: Props) => {
  const goalProgressLevel = computeGoalProgressLevel({ learnerGoal });

  if (!goalProgressLevel) {
    return null;
  }

  const {
    goalType: {
      definition: { n: nItems },
    },
    progress: { percentage: progressPercentage, history },
  } = learnerGoal;
  const completedSteps = history.length;
  const totalSteps: number = nItems;

  const contentMap = getProgressContentMap(learnerGoal.goalType.typeName, {
    progressPercentage,
    nItems,
  });

  const completedDaysOfWeek = getCompletedDaysOfWeek(learnerGoal.progress.history);

  const progressContent = contentMap[goalProgressLevel] || {};

  const { title, description } = progressContent;
  const trackingName = 'push_based_progress_message';

  const ctaButton = (
    <TrackedButton
      trackingName="keep_learning"
      trackingData={{
        goalProgressLevel,
      }}
      onClick={onDismiss}
      rootClassName="keep-learning-button"
      type="primary"
      size="sm"
    >
      {_t('Keep Learning')}
    </TrackedButton>
  );

  return (
    <TrackedDiv
      trackingName={trackingName}
      trackingData={{
        goalProgressLevel,
      }}
      className="rc-GoalSettingProgressCard"
      trackClicks={false}
      requireFullyVisible={false}
      withVisibilityTracking
    >
      <Box flexDirection="column" alignItems="center" rootClassName="progress-content">
        <Box flexDirection="column" justifyContent="center" alignItems="center">
          <SegmentedProgressCircle totalSteps={totalSteps} completedSteps={completedSteps} />

          <GoalSettingWeeklyProgress completedDays={completedDaysOfWeek} />

          <Typography variant="h3bold">{title}</Typography>

          <div className="goal-progress-description">{description}</div>
        </Box>

        {ctaButton}
      </Box>
    </TrackedDiv>
  );
};

export default GoalSettingProgressCard;
