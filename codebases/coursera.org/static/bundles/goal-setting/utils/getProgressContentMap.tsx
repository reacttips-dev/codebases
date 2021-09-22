import React from 'react';
import { SvgaRocket, SvgaTrophy, SvgaMountain, SvgaEncouragementBanner } from '@coursera/coursera-ui/svg';

import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/goal-setting';

import {
  GOAL_TYPE_COMPLETE_N_ASSIGNMENTS,
  GOAL_TYPE_N_DAY_STREAK,
  GOAL_TYPE_N_DAYS_A_WEEK,
  GOAL_TYPE_COMPLETE_N_VIDEOS,
} from 'bundles/goal-setting/utils/constants';

import GoalSettingProgressWheel from 'bundles/goal-setting/components/GoalSettingProgressWheel';

import { ProgressContentMap } from 'bundles/goal-setting/types/ProgressContent';

type ContentOptions = {
  progressPercentage?: number;
  nItems?: number;
};

const computeProgressPercentage = (progressPercentage = 0) =>
  progressPercentage > 1 ? 100 : Math.ceil(progressPercentage * 100);

export default (goalType: string, { progressPercentage, nItems }: ContentOptions): ProgressContentMap => {
  // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  return ((map) => map[goalType])({
    [GOAL_TYPE_COMPLETE_N_VIDEOS]: {
      afterTwoVideos: {
        title: _t('You are off to a great start!'),
        description: _t('Great job completing another video. Keep making progress!'),
        icon: SvgaRocket,
        buttonText: _t('Keep learning'),
      },

      halfOfNVideos: {
        title: _t('You are halfway there'),
        description: _t(`You've already completed 50% of your goal. Keep your momentum going!`),
        icon: SvgaEncouragementBanner,
        buttonText: _t('Keep learning'),
      },

      oneVideoLeft: {
        title: _t('You are almost there'),
        description: _t('Only 1 video to go to reach your goal'),
        icon: SvgaMountain,
        buttonText: _t('Keep learning'),
      },

      goalComplete: {
        title: _t(`You've reached your goal!`),
        description: (
          <FormattedMessage
            message={_t(`Congratulations! You've set yourself up for success by completing {nItems} videos.`)}
            nItems={nItems || 0}
          />
        ),
        icon: SvgaTrophy,
        buttonText: _t('Keep learning'),
      },

      lowProgress: {
        title: _t('Keep it up!'),
        description: _t('You can do it! Continue making progress toward your goal.'),
        icon: null,
        buttonText: _t('Ok'),
      },

      significantProgress: {
        title: _t('Your progress'),
        description: (
          <FormattedMessage
            message={_t(`You've completed {progressPercentage}% of your goal`)}
            progressPercentage={computeProgressPercentage(progressPercentage)}
          />
        ),
        icon: (props: $TSFixMe) => {
          return (
            <GoalSettingProgressWheel {...props} percentComplete={computeProgressPercentage(progressPercentage)} />
          );
        },
        buttonText: _t('Ok'),
      },
    },

    [GOAL_TYPE_COMPLETE_N_ASSIGNMENTS]: {
      openAssignment: {
        title: _t('Give it a try!'),
        description: _t('You can try multiple times if you want to improve your score.'),
        icon: null,
        buttonText: _t('Ok'),
      },

      goalComplete: {
        title: _t(`You've reached your goal!`),
        description: _t(`Congratulations! You've set yourself up for success by completing your first assignment.`),
        icon: SvgaTrophy,
        buttonText: _t('Keep learning'),
      },

      lowProgress: {
        title: _t('Keep it up!'),
        description: _t('You can do it! Continue making progress toward your goal.'),
        icon: null,
        buttonText: _t('Ok'),
      },
    },

    [GOAL_TYPE_N_DAY_STREAK]: {
      firstDay: {
        title: _t(`You've started a 1-day streak!`),
        description: _t(`You're doing a great job of developing positive study habits.`),
        icon: SvgaRocket,
        buttonText: _t('Keep learning'),
      },

      secondDay: {
        title: _t(`You're on a 2-day streak!`),
        description: _t(`Nice work maintaining your learning schedule.`),
        icon: SvgaEncouragementBanner,
        buttonText: _t('Keep learning'),
      },

      goalComplete: {
        title: _t(`You've reached your goal!`),
        description: _t(
          `Congratulations on achieving your 3-day learning streak! Keep up the hard work, and set yourself up for success.`
        ),
        icon: SvgaTrophy,
        buttonText: _t('Keep learning'),
      },

      streakBroken: {
        title: _t('Get a new streak going!'),
        description: _t(`You can begin your new learning streak today. You'll reach your goal in no time!`),
        icon: null,
        buttonText: _t('Ok'),
      },
    },

    [GOAL_TYPE_N_DAYS_A_WEEK]: {
      oneDayComplete: {
        title: _t(`You're off to a great start!`),
        description: _t(`You're doing a great job of developing positive study habits.`),
      },

      twoDaysComplete: {
        title: _t(`Great job!`),
        description: _t(`You've completed the second day of learning`),
      },

      threeDaysComplete: {
        title: _t(`Way to go!`),
        description: _t(`You're more than halfway through your goal of learning 5 days this week`),
      },

      goalAlmostComplete: {
        title: _t(`You're almost there!`),
        description: _t(`Just one more day of learning to achieve your weekly goal`),
      },

      goalComplete: {
        title: _t(`Congratulations!`),
        description: _t(`You've reached your weekly goal. Keep working hard to develop good learning habits.`),
      },

      goalExceededByOneDay: {
        title: _t(`You've exceeded your goal!`),
        description: _t(`You're developing great learning habits.`),
      },

      goalExceededGreat: {
        title: _t(`You're doing great!`),
        description: _t(`You've exceeded your goal for this week. Keep it up!`),
      },

      goalExceededAwesome: {
        title: _t(`Awesome job!`),
        description: _t(`More progress is always good`),
      },

      goalExceededNice: {
        title: _t(`Nice work!`),
        description: _t(`You're doing a great job of making learning into a habit`),
      },

      goalExceeded7DayStreak: {
        title: _t(`7 day streak!`),
        description: _t(`You learned every day this week. Keep up the great work!`),
      },
    },
  });
};
