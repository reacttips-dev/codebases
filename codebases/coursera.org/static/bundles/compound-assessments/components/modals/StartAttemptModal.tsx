import React from 'react';

import { FormattedMessage } from 'js/lib/coursera.react-intl';
import TimeDuration from 'bundles/phoenix/components/TimeDuration';
import _t from 'i18n!nls/compound-assessments';
import AssessmentModalLayout from './AssessmentModalLayout';

export type Props = {
  nextAttemptDuration?: number | null;
  nextAttemptSubmissionLimit?: number | null;
  showRestartConfirmation?: boolean | null;
  onPrimaryButtonClick: () => void;
  onCancelButtonClick: () => void;
};

const StartAttemptModal: React.SFC<Props> = ({
  showRestartConfirmation,
  nextAttemptDuration,
  nextAttemptSubmissionLimit,
  onPrimaryButtonClick,
  onCancelButtonClick,
}) => {
  return (
    <AssessmentModalLayout
      title={_t('Start new attempt?')}
      content={
        <div>
          {showRestartConfirmation && (
            <div>
              <p>
                {_t(
                  'When you submit your new attempt, it will replace your previous submission. If you do not submit the new attempt, your previous submission will be graded.'
                )}
              </p>
            </div>
          )}
          {nextAttemptDuration ? (
            <div>
              <p>
                <FormattedMessage
                  message={
                    nextAttemptSubmissionLimit
                      ? _t(
                          'You have {timeDuration} to submit up to {submissions, plural, =1 {# time} other {# times}} for this attempt.'
                        )
                      : _t('You have {timeDuration} to submit unlimited times for this attempt.')
                  }
                  timeDuration={<TimeDuration duration={nextAttemptDuration} showPrecise={true} />}
                  submissions={nextAttemptSubmissionLimit}
                />
              </p>
              <p>{_t('The time limit might change if the availability window ends earlier.')}</p>
            </div>
          ) : (
            <p>{_t('Are you sure you want to start another attempt?')}</p>
          )}
        </div>
      }
      primaryButtonContents={_t('Continue')}
      hideCancelButton={false}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onCancelButtonClick={onCancelButtonClick}
    />
  );
};

export default StartAttemptModal;
