import React from 'react';
import { compose } from 'recompose';

import Naptime from 'bundles/naptimejs';
import user from 'js/lib/user';
import mapProps from 'js/lib/mapProps';
import connectToRouter from 'js/lib/connectToRouter';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import CourseMessagesV1 from 'bundles/naptimejs/resources/courseMessages.v1';
import NotificationContextTypes from 'bundles/course-notifications-v2/constants/NotificationContextTypes';

import type { WeekNotification as WeekNotificationType } from 'bundles/course-notifications-v2/types/CourseNotification';

import S12nUpsellNotification from 'bundles/course-notifications-v2/components/in-context/S12nUpsellNotification';
import DeadlineOverdueNotification from 'bundles/course-notifications-v2/components/in-context/DeadlineOverdueNotification';
import ReferAFriendNotification from 'bundles/course-notifications-v2/components/in-context/ReferAFriendNotification';

const { COURSE_WEEK } = NotificationContextTypes;

type Props = {
  naptime: any;
  weekNumber: number;
  notifications: Array<WeekNotificationType>;
};

class WeekNotifications extends React.Component<Props> {
  componentDidMount() {
    const { naptime } = this.props;
    naptime.refreshData({ resources: ['courseMessages.v1'] });
  }

  renderNotification = (weekNumber: number, notification: WeekNotificationType): JSX.Element | null => {
    let component: JSX.Element | null = null;

    // Not using destructuring here for typeName, since it will break the typeName check on the disjoint union.
    // See https://github.com/facebook/flow/issues/3932
    if (notification.typeName === 'deadlineOverdueMessage') {
      component = <DeadlineOverdueNotification notification={notification} />;
    } else if (notification.typeName === 's12nUpsellMessage') {
      component = <S12nUpsellNotification notification={notification} />;
    } else if (notification.typeName === 'referralMessage') {
      component = <ReferAFriendNotification />;
    }

    return component;
  };

  render() {
    const { weekNumber, notifications } = this.props;

    if (notifications.length === 0) {
      return null;
    }

    return (
      <div className="rc-WeekNotifications">
        {notifications.map((notification) => this.renderNotification(weekNumber, notification))}
      </div>
    );
  }
}

export default compose(
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
    weekNumber: parseInt(router.params.week, 10),
  })),
  // @ts-expect-error TSMIGRATION
  Naptime.createContainer(({ weekNumber, courseSlug }) => ({
    response: CourseMessagesV1.finder('findCourseMessages', {
      params: {
        id: tupleToStringKey([tupleToStringKey([user.get().id, courseSlug]), COURSE_WEEK, weekNumber]),
      },
    }),
  })),
  mapProps<{ notifications: Array<WeekNotificationType> }, { response: any }>(({ response }) => ({
    notifications: response && response[0] ? response[0].messages : [],
  }))
  // Since `response` is not consumed,
  // we want to avoid defining it is as part of props for the component.
  // TODO: Rewrite code to avoid passing response as a prop.
  // @ts-expect-error TSMIGRATION
)(WeekNotifications);
