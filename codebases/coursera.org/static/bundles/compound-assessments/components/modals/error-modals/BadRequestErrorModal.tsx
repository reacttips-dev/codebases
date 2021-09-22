import React from 'react';

import _t from 'i18n!nls/compound-assessments';
import AssessmentModalLayout from '../AssessmentModalLayout';

type Props = {
  onPrimaryButtonClick: () => void;
  onCancelButtonClick: () => void;
};

const BadRequestErrorModal = ({ onPrimaryButtonClick, onCancelButtonClick }: Props) => {
  return (
    <AssessmentModalLayout
      title={_t('We’ve detected an error')}
      content={_t(
        'It looks like the page you are on is outdated. Try refreshing your page or closing out of extra windows.'
      )}
      primaryButtonContents={_t('Ok')}
      hideCancelButton={true}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onCancelButtonClick={onCancelButtonClick}
    />
  );
};

export default BadRequestErrorModal;
