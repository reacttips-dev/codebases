import React from 'react';
import Notification from 'bundles/notification-center/components/Notification';

import { Notification as NotificationType } from 'bundles/notification-center/types';
import { LearnerIncentiveNotification as LearnerIncentiveNotificationType } from 'bundles/learner-incentives/types';

import { FormattedHTMLMessage } from 'react-intl';

type Props = {
  notification: LearnerIncentiveNotificationType;
  onClick: (notification: NotificationType) => void;
};

const LearnerIncentiveNotification: React.FC<Props> = ({ notification, onClick }) => {
  return (
    <Notification
      onClick={onClick}
      href={`/learn/${notification?.data?.courseSlug}/course-inbox#${notification.data.siteMessageCampaignId ?? ''}`}
      notification={notification}
    >
      <FormattedHTMLMessage message={notification.data?.message} />
    </Notification>
  );
};

export default LearnerIncentiveNotification;
