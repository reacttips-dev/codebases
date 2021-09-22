import React from 'react';

import _t from 'i18n!nls/compound-assessments';
import AssessmentModalLayout from '../AssessmentModalLayout';

type Props = {
  onPrimaryButtonClick: () => void;
  onCancelButtonClick: () => void;
};

const UnknownErrorModal = ({ onPrimaryButtonClick, onCancelButtonClick }: Props) => {
  return (
    <AssessmentModalLayout
      title={_t('We’ve encountered an issue')}
      content={_t('Please refresh your page.')}
      primaryButtonContents={_t('Ok')}
      hideCancelButton={true}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onCancelButtonClick={onCancelButtonClick}
    />
  );
};

export default UnknownErrorModal;
