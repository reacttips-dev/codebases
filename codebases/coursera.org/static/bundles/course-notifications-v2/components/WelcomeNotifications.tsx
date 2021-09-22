import React from 'react';

import Naptime from 'bundles/naptimejs';
import user from 'js/lib/user';
import { compose } from 'recompose';
import mapProps from 'js/lib/mapProps';
import connectToRouter from 'js/lib/connectToRouter';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import A11yScreenReaderOnly from 'bundles/a11y/components/A11yScreenReaderOnly';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import CourseMessagesV1 from 'bundles/naptimejs/resources/courseMessages.v1';

import type { WelcomeNotification as WelcomeNotificationType } from 'bundles/course-notifications-v2/types/CourseNotification';

import NotificationContextTypes from 'bundles/course-notifications-v2/constants/NotificationContextTypes';
import S12nUpsellNotification from 'bundles/course-notifications-v2/components/in-context/S12nUpsellNotification';
import DegreeUpsellNotification from 'bundles/course-notifications-v2/components/in-context/DegreeUpsellNotification';
import S12nUpgradeNotification from 'bundles/course-notifications-v2/components/in-context/S12nUpgradeNotification';
import CalendarSyncNotification from 'bundles/course-notifications-v2/components/in-context/CalendarSyncNotification';
import UserVerificationRequiredNotification from 'bundles/course-notifications-v2/components/UserVerificationRequiredNotification';
import GradeDisclaimerNotification from 'bundles/course-notifications-v2/components/in-context/GradeDisclaimerNotification';
import ReferAFriendNotification from 'bundles/course-notifications-v2/components/in-context/ReferAFriendNotification';

import { isCalendarSyncEnabled } from 'bundles/calendar-sync/utils/feature-toggles';

import _t from 'i18n!nls/course-notifications-v2';

const { COURSE_WELCOME } = NotificationContextTypes;

type Props = {
  naptime: any;
  notifications: Array<WelcomeNotificationType>;
};

class WelcomeNotifications extends React.Component<Props> {
  componentDidMount() {
    const { naptime } = this.props;
    naptime.refreshData({ resources: ['courseMessages.v1'] });
  }

  renderNotification = (notification: WelcomeNotificationType): JSX.Element | null => {
    let component: JSX.Element | null = null;

    if (notification.typeName === 's12nUpsellMessage') {
      component = <S12nUpsellNotification key={notification.typeName} notification={notification} />;
    } else if (notification.typeName === 's12nUpgradeMessage') {
      component = <S12nUpgradeNotification key={notification.typeName} notification={notification} />;
    } else if (notification.typeName === 'calendarSyncMessage' && isCalendarSyncEnabled()) {
      component = <CalendarSyncNotification key={notification.typeName} />;
    } else if (notification.typeName === 'gradeDisclaimerMessage') {
      component = <GradeDisclaimerNotification key={notification.typeName} />;
    } else if (notification.typeName === 'userVerificationRequiredMessage') {
      component = <UserVerificationRequiredNotification key={notification.typeName} />;
    } else if (notification.typeName === 'degreeUpsellMessage') {
      component = <DegreeUpsellNotification key={notification.typeName} notification={notification} />;
    } else if (notification.typeName === 'referralMessage') {
      component = <ReferAFriendNotification key={notification.typeName} />;
    }

    return component;
  };

  render() {
    const { notifications } = this.props;

    if (notifications.length === 0) {
      return null;
    }

    return (
      <div className="rc-WelcomeNotifications">
        <A11yScreenReaderOnly tagName="h2">{_t('Notifications')}</A11yScreenReaderOnly>
        {notifications.map((notification) => this.renderNotification(notification))}
      </div>
    );
  }
}

export default compose(
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
  })),
  Naptime.createContainer(({ courseSlug }: any) => ({
    response: CourseMessagesV1.finder('findCourseMessages', {
      params: {
        id: tupleToStringKey([tupleToStringKey([user.get().id, courseSlug]), COURSE_WELCOME, -1]),
      },
    }),
  })),
  // Since `response` is not consumed,
  // we want to avoid defining it is as part of props for the component.
  // TODO: Rewrite code to avoid passing response as a prop.
  mapProps<{ notifications: Array<WelcomeNotificationType> }, { response: any }>(({ response }) => ({
    notifications: response && response[0] ? response[0].messages : [],
  }))
  // @ts-expect-error TSMIGRATION
)(WelcomeNotifications);
