import React from 'react';
import classNames from 'classnames';

import { compose, mapProps } from 'recompose';

import { Button, View, Box } from '@coursera/coursera-ui';

import DateTimeUtils from 'js/utils/DateTimeUtils';
import user from 'js/lib/user';
import waitForGraphQL from 'js/lib/waitForGraphQL';
import connectToRouter from 'js/lib/connectToRouter';

import { tupleToStringKey } from 'js/lib/stringKeyTuple';

import inServerContext from 'bundles/ssr/util/inServerContext';
import getNextSessionMessage from 'bundles/course-notifications-v2/components/global/utils/getNextSessionMessage';
import CourseScheduleRunningAndUpcomingDataProvider from 'bundles/learner-progress/components/item/locking/private/data/CourseScheduleRunningAndUpcomingDataProvider';
import SessionSwitchButton from 'bundles/course-sessions/components/SessionSwitchButton';

import type {
  GuidedCourseSessionProgressesV1,
  GuidedCourseSessionProgressesV1MultiGetQuery,
  GuidedCourseSessionProgressesV1MultiGetQueryVariables,
} from 'bundles/naptimejs/resources/__generated__/GuidedCourseSessionProgressesV1';

import { courseGradesAndProgressesQuery } from 'bundles/course-home/page-course-welcome/queries';
import type { NextSessionNotification as NextSessionNotificationType } from 'bundles/course-notifications-v2/types/CourseNotification';
import { isNextSessionNotificationV2Enabled } from 'bundles/course-notifications-v2/components/global/utils/featureGates';

import _t from 'i18n!nls/course-notifications-v2';

import 'css!./__styles__/NextScheduleNotification';

type InputProps = {
  notification: NextSessionNotificationType;
};

type Props = InputProps & {
  courseProgress: GuidedCourseSessionProgressesV1 | null;
};

type State = {
  dismissed: boolean;
};

export class NextScheduleNotification extends React.Component<Props, State> {
  private dismissalKey = 'nextSessionNotificationsDismissed';

  state: State;

  constructor(props: Props) {
    super(props);

    const {
      notification: {
        definition: { courseId },
      },
    } = props;

    const dismissedNotifications = this.getDismissedNotifications();

    this.state = {
      dismissed: inServerContext ? true : dismissedNotifications.includes(courseId),
    };
  }

  getDismissedNotifications(): string[] {
    if (!inServerContext) {
      const dismissed = window?.localStorage?.getItem(this.dismissalKey);

      if (dismissed) {
        return JSON.parse(dismissed);
      }
    }

    return [];
  }

  dismissNotification = () => {
    if (!inServerContext) {
      const {
        notification: {
          definition: { courseId },
        },
      } = this.props;

      const dismissedNotifications = this.getDismissedNotifications();

      window?.localStorage?.setItem(this.dismissalKey, JSON.stringify([...dismissedNotifications, courseId]));
    }

    this.setState({
      dismissed: true,
    });
  };

  render() {
    const {
      notification: {
        definition: { courseId },
      },
      courseProgress,
    } = this.props;

    const { dismissed } = this.state;

    if (!isNextSessionNotificationV2Enabled()) {
      return null;
    }

    if (dismissed) {
      return null;
    }

    if (courseProgress === null) {
      return null;
    }

    return (
      <CourseScheduleRunningAndUpcomingDataProvider courseId={courseId}>
        {({ loading, error, data }: any) => {
          if (loading || error) {
            return null;
          }

          const upcomingSessions = data?.OnDemandLearnerSessionsV1Resource?.runningAndUpcoming?.elements ?? [];

          const availableSessions = upcomingSessions.filter(
            ({ isActiveEnrollment, isEnrollableNow }: $TSFixMe) => !isActiveEnrollment && isEnrollableNow
          );

          const endDate = DateTimeUtils.momentWithUserTimezone(courseProgress.endedAt);

          const { title, message, allowDismiss } = getNextSessionMessage({
            currentSessionEndsAt: endDate,
            nextSession: availableSessions.map(({ startsAt, endsAt }: $TSFixMe) => ({
              startsAt,
              endsAt,
            }))[0],
          });

          return (
            <div className={classNames('rc-CourseScheduleAdjustmentNotification', { dismissable: allowDismiss })}>
              <Box rootClassName="reset-deadline-top-banner">
                <div className="banner-text">
                  <Box rootClassName="banner-text-header">
                    <h2 className="header-text">{title}</h2>
                  </Box>
                  <div className="banner-text-body">
                    <View>{message}</View>
                  </div>
                </div>
                <Box flexDirection="row" alignItems="center">
                  <SessionSwitchButton
                    buttonText={_t('Switch Schedule')}
                    type={allowDismiss ? 'secondary' : 'primary'}
                    size="sm"
                    courseId={courseId}
                  />
                  {allowDismiss && (
                    <Button rootClassName="cta" type="primary" size="sm" onClick={this.dismissNotification}>
                      {_t('Got it!')}
                    </Button>
                  )}
                </Box>
              </Box>
            </div>
          );
        }}
      </CourseScheduleRunningAndUpcomingDataProvider>
    );
  }
}

export default compose<Props, InputProps>(
  mapProps<InputProps & { notification: NextSessionNotificationType; courseId: string }, InputProps>(
    ({
      notification,
      notification: {
        definition: { courseId },
      },
    }) => ({
      notification,
      courseId,
    })
  ),
  connectToRouter(({ params }) => ({
    courseSlug: params.courseSlug,
  })),
  waitForGraphQL<
    InputProps & { courseSlug: string },
    GuidedCourseSessionProgressesV1MultiGetQuery,
    GuidedCourseSessionProgressesV1MultiGetQueryVariables,
    Props
  >(courseGradesAndProgressesQuery, {
    options: ({ courseSlug }) => ({
      variables: {
        ids: tupleToStringKey([user.get().id, courseSlug]),
      },
      errorPolicy: 'all',
    }),
    props: ({ ownProps, data }) => ({
      ...ownProps,
      courseProgress: data?.GuidedCourseSessionProgressesV1?.multiGet?.elements?.[0] ?? null,
    }),
  })
)(NextScheduleNotification);
