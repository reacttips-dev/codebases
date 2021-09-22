import { formatDateTimeDisplay, MOMENT_FORMATS } from 'js/utils/DateTimeUtils/DateTimeUtils';
import { SwitchSessionNextSteps } from 'bundles/course-home/page-course-welcome/next-step-card/v2//types';
import { SessionLabel } from 'bundles/course-sessions/utils/withSessionLabel';

import _t from 'i18n!nls/course-home';

export default (nextStep: SwitchSessionNextSteps, sessionLabel: SessionLabel) => {
  switch (nextStep.typeName) {
    case 'multipleDeadlinesNextStep':
      return {
        title: _t('Need more time?'),
        message:
          sessionLabel === 'session'
            ? _t('Change your due dates and pick up where you left off in a new session.')
            : _t('Change your due dates and pick up where you left off in a new schedule.'),
      };
    case 'notEnoughPeerReviewsNextStep':
      return {
        title: _t('Need more reviews on your peer assignment?'),
        message:
          sessionLabel === 'session'
            ? _t(
                'You can enroll in the next session. Your progress will be saved and you can pick up right where you left off.'
              )
            : _t(
                'You can enroll in the next schedule. Your progress will be saved and you can pick up right where you left off.'
              ),
      };
    case 'sessionEndedNextStep':
      return {
        title:
          sessionLabel === 'session'
            ? _t('The session ended on #{date}', {
                date: formatDateTimeDisplay(
                  nextStep.definition.currentSessionEndedAt,
                  MOMENT_FORMATS.LONG_DATE_ONLY_DISPLAY
                ),
              })
            : _t('The schedule ended on #{date}', {
                date: formatDateTimeDisplay(
                  nextStep.definition.currentSessionEndedAt,
                  MOMENT_FORMATS.LONG_DATE_ONLY_DISPLAY
                ),
              }),
        message:
          sessionLabel === 'session'
            ? _t(
                "That's ok! You can enroll in the next session. Your progress will be saved and you can pick up right where you left off."
              )
            : _t(
                "That's ok! You can enroll in the next schedule. Your progress will be saved and you can pick up right where you left off."
              ),
      };
  }
};
