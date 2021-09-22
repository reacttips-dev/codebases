import React from 'react';
import DateTimeUtils from 'js/utils/DateTimeUtils';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';

import Notification from 'bundles/notification-center/components/Notification';

import type {
  Notification as NotificationType,
  DeadlineReminderNotification as DeadlineReminderNotificationType,
} from 'bundles/notification-center/types';

import _t from 'i18n!nls/notification-center';

type Props = {
  notification: DeadlineReminderNotificationType;
  onClick: (notification: NotificationType) => void;
};

const DeadlineReminderNotification: React.FC<Props> = ({
  notification,
  notification: {
    data: { deadline, weekNumber, course, assignments },
  },
  onClick,
}) => {
  let href = '';

  if (assignments.length === 1) {
    const assignment = assignments[0];
    href = `/learn/${course.slug}/${assignment.typeName}/${assignment.id}`;
  } else {
    href = `/learn/${course.slug}/home/week/${weekNumber}`;
  }

  const formattedDeadline = DateTimeUtils.momentWithUserTimezone(deadline).format('dddd MMM D');

  return (
    <Notification href={href} notification={notification} onClick={onClick}>
      <FormattedHTMLMessage
        message={_t(
          `{assignmentCount} {assignmentCount, plural, one {assignment deadline} other {assignment deadlines}} 
          coming up in <strong>{courseName}</strong>. Finish before {formattedDeadline}.`
        )}
        assignmentCount={assignments.length}
        courseName={course.name}
        formattedDeadline={formattedDeadline}
        tagName="span"
      />
    </Notification>
  );
};

export default DeadlineReminderNotification;
