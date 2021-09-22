/**
 * This component fetches all of the data for `bundles/preview/components/EnrollmentStateBanner.jsx`.
 */

import React, { Component } from 'react';
import _ from 'underscore';
import { compose, withProps, withHandlers, withState, branch } from 'recompose';
import gql from 'graphql-tag';
import waitForGraphQL from 'js/lib/waitForGraphQL';
import Naptime from 'bundles/naptimejs';
import user from 'js/lib/user';
import connectToRouter from 'js/lib/connectToRouter';
import Retracked from 'js/lib/retracked';
import waitFor from 'js/lib/waitFor';
import waitForProps from 'js/lib/waitForProps';
import connectToFluxibleContext from 'js/lib/connectToFluxibleContext';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import waitForStores from 'bundles/phoenix/lib/waitForStores';
import { initializeCourseApp } from 'bundles/ondemand/actions/CourseActions';
import { selectContext } from 'bundles/preview/actions/ContextSelectionActions';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import withShowEnrollmentStateBanner from 'bundles/preview/containers/withShowEnrollmentStateBanner';
import EnrollmentStateBanner from 'bundles/preview/components/EnrollmentStateBanner';
import { getSessionScopedGroups } from 'bundles/preview/utils/GroupUtils';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import AuthoringBranchProperties from 'bundles/naptimejs/resources/authoringBranchProperties.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import GroupMembershipsV2 from 'bundles/naptimejs/resources/groupMemberships.v2';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import Groups from 'bundles/naptimejs/resources/groups.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import OnDemandSessionMembershipsV1 from 'bundles/naptimejs/resources/onDemandSessionMemberships.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import OnDemandSessionsV1 from 'bundles/naptimejs/resources/onDemandSessions.v1';
import OpenCourseMembershipsV1 from 'bundles/naptimejs/resources/openCourseMemberships.v1';
import {
  getContextsAndContextMapByEscapedContextId,
  getMatchedContextFromEnrolledGroupOrSession,
  showGroupInformationForEnrolledContext,
} from 'bundles/preview/utils/courseContextUtils';
import { getContextIdFromContext } from 'bundles/authoring/course-level/utils/contextUtils';
import { getCourseCatalogType } from 'bundles/teach-course/lib/CourseUtils';
import AuthoringCourse from 'bundles/author-common/models/AuthoringCourse';
import { isContextBasedVaLEnabled, shouldEnableContextBasedVaL } from 'bundles/preview/utils/epicCheck';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

const authoringCourseContextsQuery = gql`
  query PreviewAuthoringCourseContextsQueryV1Query($courseId: String!) {
    AuthoringCourseContextsV1 @naptime {
      get(id: $courseId) {
        elements {
          id
          contexts
          contextIds
        }
      }
    }
  }
`;

const authoringCoursesQuery = gql`
  query AuthoringCoursesV2Query($slug: String!) {
    AuthoringCoursesV2 @naptime {
      bySlug(slug: $slug) {
        elements {
          id
          course
        }
      }
    }
  }
`;

// Grab all the data the banner needs.
const EnrollmentStateBannerContainer = compose(
  Retracked.createTrackedContainer(() => ({
    namespace: {
      page: 'course_staff_enrollment_state_banner',
    },
  })),

  connectToRouter(({ routes, params, location }) => {
    const route = routes && routes[_(routes).findLastIndex((r) => r && r.name)];

    return {
      pathname: location.pathname || '',
      currentRouteName: route && route.name,
      courseSlug: params.courseSlug,
      itemId: params.item_id || params.reference_id,
    };
  }),

  waitForGraphQL(authoringCoursesQuery, {
    options: ({ courseSlug }: { courseSlug: string }) => ({
      variables: { slug: courseSlug },
    }),
    props: ({ data }: $TSFixMe) => {
      const { course = {}, id = '' } = data?.AuthoringCoursesV2?.bySlug?.elements?.[0] ?? {};
      return {
        course: new AuthoringCourse({ ...course, id }),
      };
    },
  }),

  withProps(() => ({
    userId: user.get().id,
  })),

  // @ts-expect-error TSMIGRATION
  Naptime.createContainer(({ course, userId }) => ({
    courseMemberships: OpenCourseMembershipsV1.byUserAndSlug(userId, course.slug, {
      required: false,
    }),
  })),

  // Grab branches and session/group enrollment data.
  // @ts-expect-error TSMIGRATION
  Naptime.createContainer(({ course, userId }) => ({
    branches: AuthoringBranchProperties.byCourse(course.id),
    sessionMemberships: OnDemandSessionMembershipsV1.byUserAndCourse(userId, course.id, {
      includes: ['sessions'],
    }),
    groupMemberships: GroupMembershipsV2.finder('learnerMembershipsByUserAndCourse', {
      params: { userId, courseId: course.id },
      fields: ['groupId'],
      includes: ['groups'],
    }),
  })),

  // No idea why this is necessary :(
  waitForProps(['branches']),

  // Grab the full objects for our session/group enrollments.
  // @ts-expect-error TSMIGRATION
  Naptime.createContainer(({ sessionMemberships, groupMemberships }) => ({
    enrolledSessions: OnDemandSessionsV1.multiGet(
      // TODO: type OnDemandSessionMembershipsV1
      sessionMemberships.map((m: $TSFixMe) => m.sessionId),
      {
        fields: ['branchId', 'isPrivate'],
      }
    ),
    // At this point, these groups are already cached because the GroupMembershipsV2 call above
    // loads the linked groups.
    enrolledGroups: Groups.multiGet(
      // TODO: type GroupMembershipsV2
      groupMemberships.map((m: $TSFixMe) => m.groupId),
      {
        fields: ['definition'],
      }
    ),
  })),
  waitForGraphQL(authoringCourseContextsQuery, {
    options: ({ course }: { course: AuthoringCourse }) => ({
      variables: { courseId: course.id },
    }),
    props: ({ data }: $TSFixMe) => {
      const { contexts = {}, contextIds = [] } = data?.AuthoringCourseContextsV1?.get?.elements?.[0] ?? {};
      const { courseContexts, contextMapWithEscapedContextId } = getContextsAndContextMapByEscapedContextId(
        contexts,
        contextIds
      );
      const contextsDataLoaded = courseContexts.length > 0 && Object.keys(contextMapWithEscapedContextId).length > 0;
      return {
        contexts: courseContexts,
        contextMap: contextMapWithEscapedContextId,
        contextsDataLoaded,
      };
    },
  }),
  // @ts-ignore TODO: type connectToFluxibleContext
  connectToFluxibleContext((context, { course, branches, userCanSwitchGroups, contextsDataLoaded }) => {
    context.executeAction(initializeCourseApp, {
      courseId: course.id,
      branchesWithSessions: branches,
      userCanSwitchGroups,
      excludeEmptyGroup: isContextBasedVaLEnabled() && contextsDataLoaded,
    });
  }),
  // @ts-ignore TODO: type ChangeViewSettingsModalStore
  waitForStores({ requiredStores: ['ChangeViewSettingsModalStore'] }, ({ ChangeViewSettingsModalStore }) => {
    return {
      ChangeViewSettingsModalStoreHasLoaded: ChangeViewSettingsModalStore.hasLoaded(),
    };
  }),
  waitFor(
    // TODO: type ChangeViewSettingsModalStore
    ({ ChangeViewSettingsModalStoreHasLoaded }: { ChangeViewSettingsModalStoreHasLoaded: $TSFixMe }) =>
      ChangeViewSettingsModalStoreHasLoaded
  ),
  withState('showChangeCourseViewSettingsModal', 'setShowChangeCourseViewSettingsModal', false),
  withHandlers({
    // @ts-expect-error TSMIGRATION-3.9
    toggleChangeCourseViewSettingsModal:
      ({ setShowChangeCourseViewSettingsModal, showChangeCourseViewSettingsModal }) =>
      () => {
        setShowChangeCourseViewSettingsModal(!showChangeCourseViewSettingsModal);
      },
  }),
  // Massage the data a bit so the components don't have to.
  withProps(
    ({
      course,
      enrolledGroups,
      enrolledSessions,
      branches,
      courseMemberships,
      contexts,
      contextMap,
      contextsDataLoaded,
    }: $TSFixMe) => {
      const session = enrolledSessions && enrolledSessions[0];
      const groups = getSessionScopedGroups(session, enrolledGroups);
      const branchId = session && session.branchId;

      // TODO: type AuthoringBranchProperties
      const sessionBranch = branchId && branches.find((b: $TSFixMe) => b.properties.courseBranchId === branchId);
      // TODO: type AuthoringBranchProperties
      const courseBranch = branches.find((b: $TSFixMe) => b.id === course.id);

      const version = sessionBranch || courseBranch;

      // only process the context data if inside the EPIC and the contexts data is loaded
      const matchedContext =
        isContextBasedVaLEnabled() && contextsDataLoaded
          ? getMatchedContextFromEnrolledGroupOrSession(contextMap, contexts, version, enrolledGroups, session)
          : undefined;
      const courseCatalogType = getCourseCatalogType(course);
      const shouldUseContextBasedVaL = shouldEnableContextBasedVaL(matchedContext);

      return {
        session,
        sessionBranch,
        courseBranch,
        version,
        enrolledGroups: groups,
        courseMembership: courseMemberships[0],
        matchedContext,
        courseCatalogType,
        shouldUseContextBasedVaL,
      };
    }
  ),
  branch(
    ({ shouldUseContextBasedVaL }: { shouldUseContextBasedVaL: boolean }) => !!shouldUseContextBasedVaL,
    compose(
      connectToFluxibleContext((context: $TSFixMe, { matchedContext }: $TSFixMe) => {
        context.executeAction(selectContext, {
          contextId: getContextIdFromContext(matchedContext),
        });
      }),
      connectToStores(
        ['ChangeViewSettingsModalStore'],
        ({ ChangeViewSettingsModalStore }, { matchedContext }: $TSFixMe) => {
          return {
            showGroupInformation: showGroupInformationForEnrolledContext(
              matchedContext,
              ChangeViewSettingsModalStore.getBranches()
            ),
          };
        }
      )
    )
  ),
  waitFor(({ version }: { version: $TSFixMe }) => !!version)
  // @ts-expect-error TSMIGRATION
)(EnrollmentStateBanner);

type CheckEnabled$Props = {
  showEnrollmentStateBanner: boolean;
  addParentHeightClass: (className: string) => void;
};

// Check to see if this feature is enabled for this user.
class CheckEnabled extends Component<CheckEnabled$Props> {
  componentDidMount() {
    const { addParentHeightClass, showEnrollmentStateBanner } = this.props;

    if (showEnrollmentStateBanner) {
      addParentHeightClass?.('with-enrollment-state-banner');
    }
  }

  render() {
    const { showEnrollmentStateBanner } = this.props;
    return (showEnrollmentStateBanner && <EnrollmentStateBannerContainer {...this.props} />) || null;
  }
}

// Get just enough data to see if this feature is enabled.
// @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'typeof CheckEnabled' is not assi... Remove this comment to see the full error message
export default withShowEnrollmentStateBanner()(CheckEnabled);
