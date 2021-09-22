import React from 'react';

import _t from 'i18n!nls/compound-assessments';
import AssessmentModalLayout from '../AssessmentModalLayout';

type Props = {
  onPrimaryButtonClick: () => void;
  onCancelButtonClick: () => void;
};

const AuthErrorModal = ({ onPrimaryButtonClick, onCancelButtonClick }: Props) => {
  return (
    <AssessmentModalLayout
      title={_t('Logged out')}
      content={_t('You have been logged out. You must log in again to save changes to this assignment.')}
      primaryButtonContents={_t('Ok')}
      hideCancelButton={true}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onCancelButtonClick={onCancelButtonClick}
    />
  );
};

export default AuthErrorModal;
