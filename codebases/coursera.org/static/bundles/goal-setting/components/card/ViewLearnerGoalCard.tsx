/* @jsx jsx */
import React, { useState } from 'react';

import { momentWithUserTimezone, formatDateTimeDisplay, SHORT_MONTH_DAY_DISPLAY } from 'js/utils/DateTimeUtils';

import { Button, Grid, Typography } from '@coursera/cds-core';
import { jsx } from '@emotion/react';

import EditLearnerGoalModal from 'bundles/goal-setting/components/card/EditLearnerGoalModal';
import EditLearnerGoalModalCDS from 'bundles/goal-setting/components/card/cds/EditLearnerGoalModal';
import GoalSettingWeeklyProgress from 'bundles/goal-setting/components/GoalSettingWeeklyProgress';
import SegmentedProgressCircle from 'bundles/goal-setting/components/SegmentedProgressCircle';
import getCompletedDaysOfWeek from 'bundles/goal-setting/utils/getCompletedDaysOfWeek';

import { LearnerGoal } from 'bundles/goal-setting/types/LearnerGoal';
import { GoalChoice } from 'bundles/goal-setting/types/GoalChoice';
import { isFullGoalSettingCardEnabled } from 'bundles/learning-assistant/utils/featureGates';

import _t from 'i18n!nls/goal-setting';

type Props = {
  courseId: string;
  learnerGoal: LearnerGoal;
  goalChoices: GoalChoice[];
  branchId: string;
};

const ViewLearnerGoalCard: React.FC<Props> = ({ branchId, goalChoices, courseId, learnerGoal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    goalType: {
      definition: { n: totalSteps },
    },
    progress: { history },
  } = learnerGoal;

  const completedSteps = history.length;
  const completedDays = getCompletedDaysOfWeek(history);

  return (
    <Grid justify="space-between" direction="row" container>
      {isFullGoalSettingCardEnabled(courseId) ? (
        <EditLearnerGoalModalCDS
          courseId={courseId}
          branchId={branchId}
          goalChoices={goalChoices}
          onDismiss={() => setIsModalOpen(false)}
          currentLearnerGoal={learnerGoal}
          isOpen={isModalOpen}
        />
      ) : (
        <EditLearnerGoalModal
          courseId={courseId}
          branchId={branchId}
          goalChoices={goalChoices}
          onDismiss={() => setIsModalOpen(false)}
          currentLearnerGoal={learnerGoal}
          isOpen={isModalOpen}
        />
      )}

      <Grid item>
        <Typography variant="h2semibold">{_t('My Weekly Goal')}</Typography>

        <Grid container alignItems="center" spacing={12}>
          <Grid item>
            <Typography variant="body2">
              {_t('#{from}-#{to} | Learn #{days} days a week', {
                days: totalSteps,
                from: formatDateTimeDisplay(
                  momentWithUserTimezone().startOf('week').add(1, 'day'),
                  SHORT_MONTH_DAY_DISPLAY
                ),
                to: formatDateTimeDisplay(
                  momentWithUserTimezone().endOf('week').add(1, 'day'),
                  SHORT_MONTH_DAY_DISPLAY
                ),
              })}
            </Typography>
          </Grid>

          <Grid item>
            <Button onClick={() => setIsModalOpen(true)} size="small" variant="ghost">
              {_t('Edit')}
            </Button>
          </Grid>
        </Grid>

        <GoalSettingWeeklyProgress completedDays={completedDays} />
      </Grid>

      <Grid item>
        <SegmentedProgressCircle size={100} totalSteps={totalSteps} completedSteps={completedSteps} />
      </Grid>
    </Grid>
  );
};

export default ViewLearnerGoalCard;
