import React from 'react';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import Notification from 'bundles/notification-center/components/Notification';

import type {
  Notification as NotificationType,
  DeadlineOverdueNotification as DeadlineOverdueNotificationType,
} from 'bundles/notification-center/types';

import _t from 'i18n!nls/notification-center';

type Props = {
  notification: DeadlineOverdueNotificationType;
  onClick: (notification: NotificationType) => void;
};

const DeadlineOverdueNotification: React.FC<Props> = ({
  notification,
  notification: {
    data: { weekNumber, course, assignments },
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

  return (
    <Notification href={href} notification={notification} onClick={onClick}>
      <FormattedMessage
        message={_t(
          `{assignmentCount} {assignmentCount, plural, one {assignment} other {assignments}} 
            overdue in {courseName}`
        )}
        assignmentCount={assignments.length}
        courseName={<strong>{course.name}</strong>}
        tagName="span"
      />
    </Notification>
  );
};

export default DeadlineOverdueNotification;
