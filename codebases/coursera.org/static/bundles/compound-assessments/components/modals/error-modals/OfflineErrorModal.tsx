import React from 'react';

import _t from 'i18n!nls/compound-assessments';
import AssessmentModalLayout from '../AssessmentModalLayout';

type Props = {
  onPrimaryButtonClick: () => void;
  onCancelButtonClick: () => void;
};

const OfflineErrorModal = ({ onPrimaryButtonClick, onCancelButtonClick }: Props) => {
  return (
    <AssessmentModalLayout
      title={_t('No internet connection')}
      content={_t(
        'Your internet connection has been lost or interrupted. Please check your network, then refresh the page.'
      )}
      primaryButtonContents={_t('Ok')}
      hideCancelButton={true}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onCancelButtonClick={onCancelButtonClick}
    />
  );
};

export default OfflineErrorModal;
