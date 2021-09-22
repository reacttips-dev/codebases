import React from 'react';
import Notification from 'bundles/notification-center/components/Notification';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';

import type {
  Notification as NotificationType,
  DiscussionForumNewAnswerForFollowerNotification as DiscussionForumNewAnswerForFollowerNotificationType,
} from 'bundles/notification-center/types';

import _t from 'i18n!nls/notification-center';

type Props = {
  notification: DiscussionForumNewAnswerForFollowerNotificationType;
  onClick: (notification: NotificationType) => void;
};

const DiscussionForumNewAnswerForFollowerNotification: React.FC<Props> = ({
  notification,
  onClick,
  notification: {
    data: { course, redirectUrlOnClick },
  },
}) => (
  <Notification onClick={onClick} href={redirectUrlOnClick} notification={notification}>
    <FormattedHTMLMessage
      message={_t(`Somebody commented in a thread in {courseName}`)}
      courseName={course.name}
      tagName="span"
    />
  </Notification>
);

export default DiscussionForumNewAnswerForFollowerNotification;
