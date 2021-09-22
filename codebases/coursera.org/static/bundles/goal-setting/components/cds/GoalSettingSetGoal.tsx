/* @jsx jsx */
import React, { useState } from 'react';

import { Grid, Button, Typography, useTheme } from '@coursera/cds-core';
import { jsx, css } from '@emotion/react';

import computeGoalProgressLevel from 'bundles/goal-setting/utils/computeGoalProgressLevel';
import GoalSettingSetGoalOptionList from 'bundles/goal-setting/components/cds/GoalSettingSetGoalOptionList';
import TrackedDiv from 'bundles/page/components/TrackedDiv';
import TrackedButton from 'bundles/page/components/TrackedButton';

import { GoalChoice } from 'bundles/goal-setting/types/GoalChoice';
import { LearnerGoal } from 'bundles/goal-setting/types/LearnerGoal';

import _t from 'i18n!nls/video-quiz';

type Props = {
  goalChoices: GoalChoice[];
  onDismiss: () => void;
  goalCreationInProgress: boolean;
  onGoalSelection: (choice: GoalChoice) => void;
  existingLearnerGoal?: LearnerGoal;
};

const GoalSettingSetGoal: React.FC<Props> = ({
  goalCreationInProgress,
  onDismiss,
  onGoalSelection,
  goalChoices,
  existingLearnerGoal,
}) => {
  let initialSelectedIndex = goalChoices.findIndex(({ isRecommended }) => isRecommended);

  if (existingLearnerGoal) {
    const {
      goalType: {
        definition: { n: existingN },
        typeName: existingType,
      },
    } = existingLearnerGoal;

    const existingIndex = goalChoices.findIndex(
      ({
        goalType: {
          definition: { n },
          typeName,
        },
      }) => n === existingN && typeName === existingType
    );

    initialSelectedIndex = existingIndex;
  }

  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);

  const trackingPrefix = existingLearnerGoal ? 'edit_goal' : 'set_goal';
  const selectedGoal = goalChoices[selectedIndex];
  const theme = useTheme();
  const goalProgressLevel = existingLearnerGoal
    ? computeGoalProgressLevel({ learnerGoal: existingLearnerGoal })
    : 'no_goal_set';

  let headerText = _t('Set a weekly goal');
  let cancelText = _t('Not now');
  let saveText = _t('Set goal');
  let savingText = _t('Setting goal...');

  if (existingLearnerGoal) {
    headerText = _t('Edit your weekly goal');
    cancelText = _t('Cancel');
    saveText = _t('Save');
    savingText = _t('Saving...');
  }

  return (
    <div className="rc-GoalSettingSetGoal">
      <TrackedDiv
        trackingName={`${trackingPrefix}_message`}
        data={{ selectedGoal, goalProgressLevel }}
        trackClicks={false}
        requireFullyVisible={false}
        withVisibilityTracking
      >
        <Typography variant="h2semibold">{headerText}</Typography>

        <Typography
          css={css`
            margin: 0;
            padding: ${theme.spacing(12, 0)};
            width: 22rem;
          `}
          variant="body2"
        >
          {_t('Learners who set a goal are 75% more likely to complete the course. You can always change it.')}
        </Typography>

        <GoalSettingSetGoalOptionList
          goalChoices={goalChoices}
          selectedIndex={selectedIndex}
          onChange={(idx) => setSelectedIndex(idx)}
        />

        {!existingLearnerGoal && (
          <Typography
            variant="body2"
            color="supportText"
            css={css`
              margin-top: ${theme.spacing(12)};
            `}
          >
            {_t('Your goal will be tracked Monday - Sunday')}
          </Typography>
        )}

        <Grid
          container
          spacing={16}
          justify="flex-start"
          css={css`
            margin-top: ${theme.spacing(32)};
          `}
        >
          <Grid item>
            <Button
              component={TrackedButton}
              trackingName={`${trackingPrefix}_cta`}
              data={{ goalProgressLevel }}
              disabled={selectedIndex < 0 || goalCreationInProgress}
              withVisibilityTracking={false}
              requireFullyVisible={false}
              size="small"
              variant="primary"
              type="button"
              iconPosition="before"
              onClick={() => onGoalSelection(goalChoices[selectedIndex])}
            >
              {goalCreationInProgress ? savingText : saveText}
            </Button>
          </Grid>

          <Grid item>
            <Button
              type="button"
              component={TrackedButton}
              trackingName={`${trackingPrefix}_dismiss`}
              data={{ goalProgressLevel }}
              size="small"
              variant="ghost"
              onClick={onDismiss}
              withVisibilityTracking={false}
              requireFullyVisible={false}
            >
              {cancelText}
            </Button>
          </Grid>
        </Grid>
      </TrackedDiv>
    </div>
  );
};

export default GoalSettingSetGoal;
