import React from 'react';

import { FormattedMessage } from 'js/lib/coursera.react-intl';
import TimeDuration from 'bundles/phoenix/components/TimeDuration';
import _t from 'i18n!nls/compound-assessments';

import AssessmentModalLayout from '../AssessmentModalLayout';

type Props = {
  timeLimit: number;
  hasAttemptLimit: boolean;
  onCancelButtonClick: () => void;
  onPrimaryButtonClick: () => void;
};

const TimedAttemptStartModal = ({ timeLimit, hasAttemptLimit, onCancelButtonClick, onPrimaryButtonClick }: Props) => {
  const limit = <TimeDuration duration={timeLimit} showPrecise={true} />;

  return (
    <AssessmentModalLayout
      title={_t('This is a timed quiz')}
      content={
        <FormattedMessage
          message={_t(
            `Are you sure you are ready to start the quiz? You will be given {duration} to complete it.
          {showConsumeText, select, true {Once you reach the time limit, you will use one attempt.} false {}}`
          )}
          duration={limit}
          showConsumeText={hasAttemptLimit}
        />
      }
      primaryButtonContents={_t('Continue')}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onCancelButtonClick={onCancelButtonClick}
    />
  );
};

export default TimedAttemptStartModal;
