import React from 'react';
import _t from 'i18n!nls/ondemand';

import 'css!bundles/course-notifications-v2/components/__styles__/UserVerificationRequiredNotification';

const UserVerificationRequiredNotification = () => {
  const buttonMsg = _t('Verify');
  const link = '/account-settings';
  const message = _t(`To earn your certificate, please verify your account.`);

  return (
    <div className="rc-UserVerificationRequiredNotification">
      <div className="horizontal-box">
        <div className="flex-1">
          <div className="banner-message-container">{message}</div>
        </div>
        <div>
          <a className="link-button primary verification-button" href={link} target="_blank" rel="noopener noreferrer">
            {buttonMsg}
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserVerificationRequiredNotification;
