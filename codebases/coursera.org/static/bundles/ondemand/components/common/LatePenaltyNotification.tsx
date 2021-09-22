import React from 'react';

import type moment from 'moment';
import type { ItemDeadlineProgress } from 'bundles/learner-progress/types/Item';
import { DEADLINE_PROGRESS } from 'bundles/learner-progress/constants';

import { Notification } from '@coursera/coursera-ui';

import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/ondemand';

import { formatDateTimeDisplay, MED_DATETIME_NO_YEAR_DISPLAY } from 'js/utils/DateTimeUtils';

// TODO: Eliminate dependency on author-common.
import type { LatePenalty } from 'bundles/author-common/constants/GradingLatePenalty';
import { COMPOUND, PERIOD_TYPES } from 'bundles/author-common/constants/GradingLatePenalty';

import 'css!./__styles__/LatePenaltyNotification';

type Props = {
  latePenalty: LatePenalty;
  deadline?: moment.Moment | null;
  deadlineProgress?: ItemDeadlineProgress;
  appliedLatePenalty?: number;
  isGraded: boolean;
  isSubmitted: boolean;
};

const LatePenaltyNotification: React.FC<Props> = ({
  latePenalty,
  deadline,
  deadlineProgress,
  appliedLatePenalty,
  isGraded,
  isSubmitted,
}) => {
  let message: string | null = null;
  let penalty: number | null = null;
  let maxApplications: number | undefined | null = null;
  let maxFinalScore: number | undefined | null = null;
  let maxFinalScoreDays: number | undefined | null = null;

  if (deadline) {
    if (deadlineProgress === DEADLINE_PROGRESS.COMPLETE && appliedLatePenalty) {
      if (appliedLatePenalty) {
        message = _t(
          'Your assignment was due {dueDate}. A late penalty of {appliedLatePenalty, number, percent} was applied. {learnMore}'
        );
      }
    } else if (deadlineProgress === DEADLINE_PROGRESS.UPCOMING) {
      message = _t(
        'Your assignment is due {dueDate}. A late penalty will be applied if submitted after the deadline. {learnMore}'
      );
    } else if (deadlineProgress === DEADLINE_PROGRESS.OVERDUE) {
      // https://docs.google.com/spreadsheets/d/1NQZ88Aa-Fgf5UQKTNbUuCzkZDA26Rq0FjF_Mgs879fI/edit#gid=0
      message = _t('Your assignment was due {dueDate}. A late penalty will be applied when you submit. {learnMore}');

      if (isSubmitted && !isGraded) {
        message = _t(
          'The assignment due date is {dueDate}. A late penalty will be applied if submitted after the deadline. {learnMore}'
        );
      } else if (latePenalty.typeName === COMPOUND) {
        const { incrementalPenalty, maxAllowedScore, minScorethreshold } = latePenalty.definition;
        if (incrementalPenalty && !minScorethreshold && !maxAllowedScore) {
          // Deduct X% once
          // Deduct X% daily indefinitely
          // Deduct X% daily for Y days
          if (incrementalPenalty.applyEvery.count === 1) {
            maxApplications = incrementalPenalty.maxApplications || 0;
            penalty = incrementalPenalty.penalty;

            const { periodType } = incrementalPenalty.applyEvery;

            // @ts-ignore ts-migrate(2322) FIXME: Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
            message = {
              [PERIOD_TYPES.INFINITY]: _t(
                'Your assignment was due {dueDate}. A late penalty of {penalty, number, percent} will be applied to your score. {learnMore}'
              ),
              [PERIOD_TYPES.MINUTE]: _t(
                'Your assignment was due {dueDate}. A late penalty of {penalty, number, percent} will be applied {maxApplications, plural, =0 {minutely} one {minutely for # minute} other {minutely for # minutes}} until you submit.'
              ),
              [PERIOD_TYPES.HOUR]: _t(
                'Your assignment was due {dueDate}. A late penalty of {penalty, number, percent} will be applied {maxApplications, plural, =0 {hourly} one {hourly for # hour} other {hourly for # hours}} until you submit.'
              ),
              [PERIOD_TYPES.DAY]: _t(
                'Your assignment was due {dueDate}. A late penalty of {penalty, number, percent} will be applied {maxApplications, plural, =0 {daily} one {daily for # day} other {daily for # days}} until you submit.'
              ),
              [PERIOD_TYPES.WEEK]: _t(
                'Your assignment was due {dueDate}. A late penalty of {penalty, number, percent} will be applied {maxApplications, plural, =0 {weekly} one {weekly for # week} other {weekly for # weeks}} until you submit.'
              ),
              [PERIOD_TYPES.MONTH]: _t(
                'Your assignment was due {dueDate}. A late penalty of {penalty, number, percent} will be applied {maxApplications, plural, =0 {monthly} one {monthly for # month} other {monthly for # months}} until you submit.'
              ),
            }[periodType];
          }
        } else if (maxAllowedScore && !incrementalPenalty && !minScorethreshold) {
          // Cap grade a A% if work is submitted B days after submission
          maxFinalScore = maxAllowedScore.maxFinalScore;
          maxFinalScoreDays = maxAllowedScore.applyAfter.count;

          message = _t(
            'Your assignment was due {dueDate}. A late penalty will cap your score at {maxFinalScore, number, percent} if submitted {maxFinalScoreDays, plural, =0 {after deadline} one {# day after deadline} other {# days after deadline}}.'
          );
        }
      }
    }
  } else {
    message = _t('A late penalty will be applied if submitted after the deadline. {learnMore}');
  }

  if (message) {
    return (
      <Notification
        type="info"
        message={
          <FormattedMessage
            message={message}
            dueDate={deadline && formatDateTimeDisplay(deadline, MED_DATETIME_NO_YEAR_DISPLAY)}
            appliedLatePenalty={appliedLatePenalty}
            penalty={penalty}
            maxApplications={maxApplications}
            maxFinalScore={maxFinalScore}
            maxFinalScoreDays={maxFinalScoreDays}
            learnMore={
              <a
                href="//learner.coursera.help"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={_t('Learn more about late penalties')}
              >
                {_t('Learn More')}
              </a>
            }
          />
        }
        isDismissible={false}
        htmlAttributes={{
          'data-classname': 'late-penalty-notification',
        }}
      />
    );
  }
  return null;
};

export default LatePenaltyNotification;
