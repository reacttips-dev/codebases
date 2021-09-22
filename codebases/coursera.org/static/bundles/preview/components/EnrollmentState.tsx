import React from 'react';
import EnrolledVersion from 'bundles/preview/components/EnrolledVersion';
import EnrolledSession from 'bundles/preview/components/EnrolledSession';
import EnrolledGroups from 'bundles/preview/components/EnrolledGroups';
import EnrollmentDivider from 'bundles/preview/components/EnrollmentDivider';
import EnrolledContext from 'bundles/preview/components/EnrolledContext';
import OpenSettingsButton from 'bundles/preview/components/OpenSettingsButton';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type AuthoringBranchProperties from 'bundles/naptimejs/resources/authoringBranchProperties.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type Groups from 'bundles/naptimejs/resources/groups.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type OnDemandSessionsV1 from 'bundles/naptimejs/resources/onDemandSessions.v1';
import type OpenCourseMembershipsV1 from 'bundles/naptimejs/resources/openCourseMemberships.v1';
import type { AuthoringCourseContext } from 'bundles/authoring/common/types/authoringCourseContexts';
import type { CourseCatalogType } from 'bundles/author-course/utils/types';
import type AuthoringCourse from 'bundles/author-common/models/AuthoringCourse';

import 'css!bundles/preview/components/__styles__/EnrollmentState';

type Props = {
  course: AuthoringCourse;
  version: AuthoringBranchProperties;
  context: AuthoringCourseContext;
  courseCatalogType: CourseCatalogType;
  enrolledGroups: Array<Groups>;
  session?: OnDemandSessionsV1;
  showGroupInformation?: boolean;
  shouldUseContextBasedVaL: boolean;
  onEnrollmentBannerClick: () => void;
  courseMembership?: OpenCourseMembershipsV1;
};

const EnrollmentState: React.FC<Props> = ({
  course,
  version,
  session,
  context,
  courseCatalogType,
  enrolledGroups,
  courseMembership,
  showGroupInformation,
  onEnrollmentBannerClick,
  shouldUseContextBasedVaL,
}) => (
  <div className="rc-EnrollmentState">
    <OpenSettingsButton onClick={onEnrollmentBannerClick}>
      {shouldUseContextBasedVaL ? (
        <>
          <EnrolledContext context={context} courseCatalogType={courseCatalogType} />
          {showGroupInformation && enrolledGroups.length > 0 && (
            <>
              <EnrollmentDivider />
              <EnrolledGroups enrolledGroups={enrolledGroups} />
            </>
          )}
        </>
      ) : (
        <>
          <EnrolledVersion course={course} version={version} />
          <EnrollmentDivider />
          <EnrolledSession session={session} courseMembership={courseMembership} />
          {enrolledGroups.length > 0 && <EnrollmentDivider />}
          <EnrolledGroups enrolledGroups={enrolledGroups} />
        </>
      )}
    </OpenSettingsButton>
  </div>
);

export default EnrollmentState;
