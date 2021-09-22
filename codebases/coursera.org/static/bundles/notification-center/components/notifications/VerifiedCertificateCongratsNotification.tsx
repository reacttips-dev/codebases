import React from 'react';
import Notification from 'bundles/notification-center/components/Notification';

import type {
  Notification as NotificationType,
  VerifiedCertificateCongratsNotification as VerifiedCertificateCongratsNotificationType,
} from 'bundles/notification-center/types';

import _t from 'i18n!nls/notification-center';

type Props = {
  notification: VerifiedCertificateCongratsNotificationType;
  onClick: (notification: NotificationType) => void;
};

const VerifiedCertificateCongratsNotification: React.FC<Props> = ({
  notification,
  onClick,
  notification: {
    data: { redirectUrlOnClick },
  },
}) => (
  <Notification onClick={onClick} href={redirectUrlOnClick} notification={notification}>
    {_t('Congratulations, your course certificate is ready.')}
  </Notification>
);

export default VerifiedCertificateCongratsNotification;
