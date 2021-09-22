import React from 'react';
import { compose } from 'recompose';

import Naptime from 'bundles/naptimejs';
import user from 'js/lib/user';
import waitFor from 'js/lib/waitFor';
import mapProps from 'js/lib/mapProps';
import connectToRouter from 'js/lib/connectToRouter';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';

import Retracked from 'js/lib/retracked';
import TrackedDiv from 'bundles/page/components/TrackedDiv';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import CourseMessagesV1 from 'bundles/naptimejs/resources/courseMessages.v1';
import NotificationContextTypes from 'bundles/course-notifications-v2/constants/NotificationContextTypes';

import type { GlobalNotification as GlobalNotificationType } from 'bundles/course-notifications-v2/types/CourseNotification';
import { isNextSessionNotificationV2Enabled } from 'bundles/course-notifications-v2/components/global/utils/featureGates';

import CourseScheduleAdjustmentNotification from 'bundles/course-notifications-v2/components/global/CourseScheduleAdjustmentNotification';
import NextScheduleNotification from 'bundles/course-notifications-v2/components/global/NextScheduleNotification';
import NextSessionNotification from 'bundles/course-notifications-v2/components/global/NextSessionNotification';

import 'css!./__styles__/GlobalNotification';

const { COURSE_GLOBAL } = NotificationContextTypes;

type Props = {
  notification: GlobalNotificationType;
};

type NotificationDetails = {
  trackingName: string;
  component: JSX.Element;
};

class GlobalNotification extends React.Component<Props> {
  getVisibleNotification(): NotificationDetails | null {
    const { notification } = this.props;

    if (notification.typeName === 'joinNextSessionMessage') {
      return {
        trackingName: 'next_session_notification',
        component: isNextSessionNotificationV2Enabled() ? (
          <NextScheduleNotification notification={notification} />
        ) : (
          <NextSessionNotification notification={notification} />
        ),
      };
    } else if (notification.typeName === 'courseScheduleAdjustmentMessage') {
      return {
        trackingName: 'course_schedule_adjustment_notification',
        component: <CourseScheduleAdjustmentNotification notification={notification} />,
      };
    }

    return null;
  }

  render() {
    const details = this.getVisibleNotification();

    if (!details) {
      return null;
    }

    return (
      <TrackedDiv
        className="rc-GlobalNotification"
        trackClicks={false}
        withVisibilityTracking
        trackingName={details.trackingName}
      >
        {details.component}
      </TrackedDiv>
    );
  }
}

export default compose(
  connectToRouter(({ params }) => ({
    courseSlug: params.courseSlug,
  })),
  Naptime.createContainer(({ courseSlug }: any) => ({
    response: CourseMessagesV1.finder('findCourseMessages', {
      params: {
        id: tupleToStringKey([tupleToStringKey([user.get().id, courseSlug]), COURSE_GLOBAL, -1]),
      },
    }),
  })),
  mapProps<{ notification?: GlobalNotificationType }, { response: any }>(({ response }) => {
    const messages = response && response[0] ? response[0].messages : [];

    if (messages.length === 0) {
      return {};
    }

    return {
      notification: messages[0],
    };
  }),
  waitFor(({ notification }) => !!notification),
  Retracked.createTrackedContainer(() => ({
    namespace: {
      page: 'course_global_notification',
    },
  }))
  // @ts-expect-error TSMIGRATION
)(GlobalNotification);
