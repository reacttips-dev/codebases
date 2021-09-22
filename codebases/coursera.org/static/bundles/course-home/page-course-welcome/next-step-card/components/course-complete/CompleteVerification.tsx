import React from 'react';
import _t from 'i18n!nls/course-home';

const CompleteVerification: React.SFC = () => {
  return (
    <a className="primary" href="/account-settings" target="_blank" rel="noopener noreferrer">
      {_t('To receive your certificate, verify your account.')}
    </a>
  );
};

export default CompleteVerification;
