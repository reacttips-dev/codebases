import React from 'react';
import AssessmentModalLayout from 'bundles/compound-assessments/components/modals/cds/AssessmentModalLayout';

import _t from 'i18n!nls/compound-assessments';

export type Props = {
  onPrimaryButtonClick: () => void;
  onCancelButtonClick: () => void;
};

const LeaveConfirmModal = ({ onPrimaryButtonClick, onCancelButtonClick }: Props) => {
  return (
    <AssessmentModalLayout
      title={_t('Are you sure you want to leave?')}
      content={_t('You have not completed this assignment yet.  Are you sure you want to leave before submitting?')}
      primaryButtonContents={_t('Continue')}
      hideCancelButton={false}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onCancelButtonClick={onCancelButtonClick}
    />
  );
};

export default LeaveConfirmModal;
