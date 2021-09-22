import React from 'react';
import Notification from 'bundles/notification-center/components/Notification';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';

import type {
  Notification as NotificationType,
  AssignmentHasBeenPeerReviewedMessageNotification as AssignmentHasBeenPeerReviewedMessageNotificationType,
} from 'bundles/notification-center/types';

import _t from 'i18n!nls/notification-center';

type Props = {
  notification: AssignmentHasBeenPeerReviewedMessageNotificationType;
  onClick: (notification: NotificationType) => void;
};

const AssignmentHasBeenPeerReviewedMessageNotification: React.FC<Props> = ({
  notification,
  onClick,
  notification: {
    data: { redirectUrlOnClick, item },
  },
}) => (
  <Notification onClick={onClick} href={redirectUrlOnClick} notification={notification}>
    <FormattedHTMLMessage
      message={_t(`Your assignment {assignmentName} has been reviewed`)}
      assignmentName={item.title}
      tagName="span"
    />
  </Notification>
);

export default AssignmentHasBeenPeerReviewedMessageNotification;
