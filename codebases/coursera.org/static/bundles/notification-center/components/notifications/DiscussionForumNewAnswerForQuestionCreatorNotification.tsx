import React from 'react';
import Notification from 'bundles/notification-center/components/Notification';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';

import type {
  Notification as NotificationType,
  DiscussionForumNewAnswerForQuestionCreatorNotification as DiscussionForumNewAnswerForQuestionCreatorNotificationType,
} from 'bundles/notification-center/types';

import _t from 'i18n!nls/notification-center';

type Props = {
  notification: DiscussionForumNewAnswerForQuestionCreatorNotificationType;
  onClick: (notification: NotificationType) => void;
};

const DiscussionForumNewAnswerForQuestionCreatorNotification: React.FC<Props> = ({
  notification,
  onClick,
  notification: {
    data: { course, redirectUrlOnClick },
  },
}) => (
  <Notification onClick={onClick} href={redirectUrlOnClick} notification={notification}>
    <FormattedHTMLMessage
      message={_t(`Somebody replied to your thread in {courseName}`)}
      courseName={course.name}
      tagName="span"
    />
  </Notification>
);

export default DiscussionForumNewAnswerForQuestionCreatorNotification;
