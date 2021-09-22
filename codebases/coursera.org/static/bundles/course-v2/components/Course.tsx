import React from 'react';
import { branch, compose } from 'recompose';
import Naptime from 'bundles/naptimejs';
import user from 'js/lib/user';
import Retracked from 'js/lib/retracked';
import mapProps from 'js/lib/mapProps';

import LearningAssistantFeatureWrapper from 'bundles/learning-assistant/components/LearningAssistantFeatureWrapper';

import migrateAliceLocalStorageToBackend from 'bundles/learning-assistant/utils/migrateAliceLocalStorageToBackend';

import CourseraMetatags from 'bundles/seo/components/CourseraMetatags';
import CourseUnauthorized from 'bundles/course/components/CourseUnauthorized';
import TimezoneMismatchNotification from 'bundles/page/components/TimezoneMismatchNotification';
import withGDPR from 'bundles/common/components/withGDPR';
import withCCPA from 'bundles/common/components/withCCPA';
import RealtimeMessagingProvider from 'bundles/realtime-messaging/components/RealtimeMessagingProvider';
import type { ActAsLearnerSessionProps } from 'bundles/course-staff-impersonation';
import { withPartnerLearnerImpersonationSessionData } from 'bundles/course-staff-impersonation';

import connectToRouter from 'js/lib/connectToRouter';

import { Provider } from '@coursera/cds-core';

import { canAccessCourse } from 'bundles/course-v2/utils/Course';

import OpenCourseMembershipsV1 from 'bundles/naptimejs/resources/openCourseMemberships.v1';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';

import _t from 'i18n!nls/course-v2';

type PropsToComponent = {
  openCourseMemberships: OpenCourseMembershipsV1[];
  course: CoursesV1 | null;
  children: JSX.Element;
  courseSlug: string;
};

class Course extends React.Component<PropsToComponent> {
  componentDidMount() {
    /**
     * TODO: Remove this after June 1, 2020
     * https://coursera.atlassian.net/browse/FLEX-24835
     * Any FE clients who haven't logged into Coursera
     * between launch of LearningAssistant (March 2020) to June 1, 2020
     * probably aren't regular users and it's not worth keeping this
     * tech debt here to accommodate for them not seeing previously sent
     * AliceMessages.
     */
    migrateAliceLocalStorageToBackend();
  }

  render() {
    const { course, openCourseMemberships, children } = this.props;

    if (!canAccessCourse(openCourseMemberships, course)) {
      return <CourseUnauthorized />;
    }

    if (course) {
      const { name: courseName, photoUrl, description, id, slug } = course;
      const metatagTitle = _t('#{courseName} - Home', { courseName });

      return (
        <RealtimeMessagingProvider courseSlug={slug}>
          <Provider locale={_t.getLocale()}>
            <div className="rc-Course">
              <CourseraMetatags
                disableCrawlerIndexing={true}
                title={metatagTitle}
                imageHref={photoUrl}
                description={description}
              />
              <TimezoneMismatchNotification />
              <LearningAssistantFeatureWrapper courseId={id} />

              {React.cloneElement(children, { courseId: id })}
            </div>
          </Provider>
        </RealtimeMessagingProvider>
      );
    }

    return null;
  }
}

export default compose<PropsToComponent, {}>(
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
  })),
  // skip GDPR and CCPA consents if an impersonation session is active
  withPartnerLearnerImpersonationSessionData,
  branch<ActAsLearnerSessionProps>(({ actAsLearnerSession }) => !actAsLearnerSession, withGDPR),
  branch<ActAsLearnerSessionProps>(({ actAsLearnerSession }) => !actAsLearnerSession, withCCPA),
  Naptime.createContainer<
    { openCourseMemberships: OpenCourseMembershipsV1[]; coursesForSlug: Array<CoursesV1> },
    { courseSlug: string }
  >(({ courseSlug }) => ({
    openCourseMemberships: OpenCourseMembershipsV1.byUserAndSlug(user.get().id, courseSlug, {
      fields: ['courseRole'],
    }),
    coursesForSlug: CoursesV1.finder('slug', {
      params: {
        slug: courseSlug,
        showHidden: true,
      },
      fields: ['slug', 'photoUrl', 'description', 'id'],
    }),
  })),
  mapProps<{ course: CoursesV1 | null }, { coursesForSlug: Array<CoursesV1> }>(({ coursesForSlug }) => ({
    course: coursesForSlug && coursesForSlug.length > 0 ? coursesForSlug[0] : null,
    courseId: coursesForSlug[0]?.id,
  })),
  Retracked.createTrackedContainer<PropsToComponent>(({ courseSlug }) => {
    return {
      namespace: {
        app: 'open_course_home',
      },
      // eslint-disable-next-line camelcase
      open_course_slug: courseSlug,
    };
  })
)(Course);
