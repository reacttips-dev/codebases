import Naptime from 'bundles/naptimejs';
import _ from 'lodash';
import user from 'js/lib/user';
import connectToRouter from 'js/lib/connectToRouter';
import deferToClientSideRender from 'js/lib/deferToClientSideRender';

import epic from 'bundles/epic/client';
import withAliceNotification from 'bundles/alice/lib/withAliceNotification';
import AliceHiringInterestEvent from 'bundles/alice/models/AliceHiringInterestEvent';
import AliceCourseLectureCompleteEvent from 'bundles/alice/models/AliceCourseLectureCompleteEvent';
import AlicePageviewEvent from 'bundles/alice/models/AlicePageviewEvent';
import AliceJustEnrollEvent from 'bundles/alice/models/AliceJustEnrollEvent';

import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import OnDemandSessionsV1 from 'bundles/naptimejs/resources/onDemandSessions.v1';
import ProgramMembershipsV2 from 'bundles/naptimejs/resources/programMemberships.v2';
import OnDemandSessionMembershipsV1 from 'bundles/naptimejs/resources/onDemandSessionMemberships.v1';
import OnDemandGuidedItemsProgressV1 from 'bundles/naptimejs/resources/onDemandGuidedItemsProgress.v1';

const AliceWelcomeNotification = withAliceNotification(
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ course, programMemberships, o... Remove this comment to see the full error message
  ({ course, programMemberships, onDemandGuidedItemsProgress, sessions }: $TSFixMe) => {
    const courseId = course.id;

    let courseBranchId = courseId;

    if (sessions.length > 0) {
      courseBranchId = sessions[0].branchId || sessions[0].courseId;
    }

    const aliceHiringEnabled = epic.get('Flex', 'aliceHiringEnabled');
    const aliceCoursePageviewEnabled = epic.get('Flex', 'aliceCoursePageviewEnabled', { course_id: courseId });
    const programMember = programMemberships.some((p) => p.membershipState === 'MEMBER');

    const areAnyNonPassableItemsComplete = _.some(
      _.values(onDemandGuidedItemsProgress.progressStates),
      (state) => _.values(state)[0].progressState === 'Completed'
    );

    const hasNotStartedAnyItem = _.every(
      _.values(onDemandGuidedItemsProgress.progressStates),
      (state) => _.values(state)[0].genericState === 'NotStarted' || _.values(state)[0].progressState === 'NotStarted'
    );

    if (hasNotStartedAnyItem) {
      return new AliceJustEnrollEvent({ courseBranchId });
    } else if (aliceHiringEnabled && !programMember) {
      return new AliceHiringInterestEvent({ courseBranchId });
    } else if (aliceCoursePageviewEnabled) {
      return new AlicePageviewEvent({ courseBranchId });
    } else if (areAnyNonPassableItemsComplete) {
      return new AliceCourseLectureCompleteEvent({ courseBranchId });
    }
    return null;
  },

  ({ course }: $TSFixMe) => ({ course_id: course && course.id })
)(() => null);

export default _.flowRight(
  deferToClientSideRender(),
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
  })),
  Naptime.createContainer(({ courseSlug }: $TSFixMe) => ({
    programMemberships: ProgramMembershipsV2.finder('byUser', {
      params: { userId: user.get().id },
    }),
    course: CoursesV1.bySlug(courseSlug, {
      fields: ['id'],
    }),
  })),
  Naptime.createContainer(({ course }: $TSFixMe) => ({
    onDemandGuidedItemsProgress: OnDemandGuidedItemsProgressV1.get(`${user.get().id}~${course.id}`, {
      fields: ['progressStates'],
    }),
    onDemandSessionMemberships: OnDemandSessionMembershipsV1.finder('activeByUserAndCourse', {
      params: {
        courseId: course.id,
        userId: user.get().id,
      },
      includes: ['sessions'],
    }),
  })),
  Naptime.createContainer(({ onDemandSessionMemberships }: $TSFixMe) => {
    const sessionIds = onDemandSessionMemberships.map((sm) => sm.sessionId);

    return {
      sessions: OnDemandSessionsV1.multiGet(sessionIds, {
        field: ['courseId, branchId'],
      }),
    };
  })
)(AliceWelcomeNotification);
