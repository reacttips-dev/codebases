import React from 'react';

import _t from 'i18n!nls/compound-assessments';
import AssessmentModalLayout from '../AssessmentModalLayout';

type Props = {
  onPrimaryButtonClick: () => void;
  onCancelButtonClick: () => void;
};

const ServerErrorModal = ({ onPrimaryButtonClick, onCancelButtonClick }: Props) => {
  return (
    <AssessmentModalLayout
      title={_t('Looks like there’s an error')}
      content={_t(
        'The server encountered an internal error. Try the action again or refresh your page. If you continue to see this error, please contact support for help.'
      )}
      primaryButtonContents={_t('Ok')}
      hideCancelButton={true}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onCancelButtonClick={onCancelButtonClick}
    />
  );
};

export default ServerErrorModal;
