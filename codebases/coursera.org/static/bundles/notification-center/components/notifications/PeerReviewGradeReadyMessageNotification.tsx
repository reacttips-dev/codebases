import React from 'react';
import Notification from 'bundles/notification-center/components/Notification';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';

import type {
  Notification as NotificationType,
  PeerReviewGradeReadyMessageNotification as PeerReviewGradeReadyMessageNotificationType,
} from 'bundles/notification-center/types';

import _t from 'i18n!nls/notification-center';

type Props = {
  notification: PeerReviewGradeReadyMessageNotificationType;
  onClick: (notification: NotificationType) => void;
};

const PeerReviewGradeReadyMessageNotification: React.FC<Props> = ({
  notification,
  onClick,
  notification: {
    data: { redirectUrlOnClick, item },
  },
}) => (
  <Notification onClick={onClick} href={redirectUrlOnClick} notification={notification}>
    <FormattedHTMLMessage
      message={_t(`Your grade is ready for your peer-graded assignment {itemName}`)}
      itemName={item.name}
      tagName="span"
    />
  </Notification>
);

export default PeerReviewGradeReadyMessageNotification;
