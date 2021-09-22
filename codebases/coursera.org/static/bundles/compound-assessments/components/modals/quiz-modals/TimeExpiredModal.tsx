import React from 'react';

import _t from 'i18n!nls/compound-assessments';

import AssessmentModalLayout from '../AssessmentModalLayout';

type Props = {
  onCancelButtonClick: () => void;
  onPrimaryButtonClick: () => void;
};

const TimeExpiredModal = ({ onCancelButtonClick, onPrimaryButtonClick }: Props) => {
  return (
    <AssessmentModalLayout
      title={_t('Time’s up!')}
      content={_t(
        "You've reached the time limit for this quiz. Your quiz will be automatically submitted for grading."
      )}
      primaryButtonContents={_t('Continue')}
      hideCancelButton={true}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onCancelButtonClick={onCancelButtonClick}
    />
  );
};

export default TimeExpiredModal;
