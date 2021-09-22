import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EnrollmentState from 'bundles/preview/components/EnrollmentState';
import Actions from 'bundles/preview/components/Actions';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type AuthoringBranchProperties from 'bundles/naptimejs/resources/authoringBranchProperties.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type Groups from 'bundles/naptimejs/resources/groups.v1';
import ChangeCourseViewSettingsModal from 'bundles/course-v2/components/course-view/ChangeCourseViewSettingsModal';
import ChangeContextBasedCourseViewSettingsModal from 'bundles/preview/components/ChangeContextBasedCourseViewSettingsModal';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { preselectedSettings } from 'bundles/ondemand/actions/BranchSessionGroupActions';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type OnDemandSessionsV1 from 'bundles/naptimejs/resources/onDemandSessions.v1';
import type OpenCourseMembershipsV1 from 'bundles/naptimejs/resources/openCourseMemberships.v1';
import type { CourseCatalogType } from 'bundles/author-course/utils/types';
import type { AuthoringCourseContext, ContextMap } from 'bundles/authoring/common/types/authoringCourseContexts';
import type AuthoringCourse from 'bundles/author-common/models/AuthoringCourse';
import 'css!bundles/preview/components/__styles__/EnrollmentStateBanner';

import _t from 'i18n!nls/preview';

// This is all of the data that is available to this component (given by containers/EnrollmentStateBanner).
// Some of it is commented out because it is not used to display anything currently, although it is
// being used in the container to load or process data.
type Props = {
  // pathname: string,
  // userId: string,
  course: AuthoringCourse;
  courseCatalogType: CourseCatalogType;

  // enrolledSessions: Array<OnDemandSessionsV1>,
  enrolledGroups: Array<Groups>;

  contexts: Array<AuthoringCourseContext>;
  contextMap: ContextMap;
  matchedContext: AuthoringCourseContext;
  showGroupInformation?: boolean;

  // All branches of this course.
  // branches: Array<AuthoringBranchProperties>,

  // The name of the deepest route that matched this page.
  currentRouteName?: string;

  // The itemId for this page (if any).
  itemId?: string;

  // If you are enrolled in a session, this prop will contain it.
  session?: OnDemandSessionsV1;

  // If your session has a branchId, this prop will contain that branch.
  // sessionBranch?: AuthoringBranchProperties,

  // The branch pointed to by the course ID.
  // courseBranch: AuthoringBranchProperties,

  // This will contain either sessionBranch (if it exists), or courseBranch.
  // At the very least, courseBranch should be populated.
  version: AuthoringBranchProperties;

  // this indicates whether this user can view and switch groups
  userCanSwitchGroups: boolean;
  userCanViewTeach: boolean;

  showChangeCourseViewSettingsModal: boolean;
  toggleChangeCourseViewSettingsModal: () => void;
  courseMembership?: OpenCourseMembershipsV1;

  shouldUseContextBasedVaL: boolean;
};

const Wrapped: React.SFC<{}> = ({ children }) => <div className="rc-EnrollmentStateBanner">{children}</div>;

class EnrollmentStateBanner extends Component<Props> {
  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { session, version, enrolledGroups } = this.props;
    const sessionId = session ? session.id : null;
    const groupId = enrolledGroups.length > 0 ? enrolledGroups[0].id : null;
    this.context.executeAction(preselectedSettings, { branchId: version.id, sessionId, groupId });
  }

  static LOADING_COMPONENT = () => <Wrapped>Loading...</Wrapped>;

  render() {
    const {
      course,
      courseCatalogType,
      session,
      version,
      contexts,
      contextMap,
      matchedContext,
      enrolledGroups,
      currentRouteName,
      itemId,
      courseMembership,
      showChangeCourseViewSettingsModal,
      toggleChangeCourseViewSettingsModal,
      userCanSwitchGroups,
      userCanViewTeach,
      showGroupInformation,
      shouldUseContextBasedVaL,
    } = this.props;

    const groupId = enrolledGroups.length > 0 ? enrolledGroups[0].id : null;

    return (
      <Wrapped>
        {showChangeCourseViewSettingsModal &&
          (shouldUseContextBasedVaL ? (
            <ChangeContextBasedCourseViewSettingsModal
              courseSlug={course.slug}
              courseId={course.id}
              onCloseModal={toggleChangeCourseViewSettingsModal}
              userCanSwitchGroups={userCanSwitchGroups}
              contexts={contexts}
              contextMap={contextMap}
            />
          ) : (
            <ChangeCourseViewSettingsModal
              courseSlug={course.slug}
              courseId={course.id}
              onCloseModal={toggleChangeCourseViewSettingsModal}
              userCanSwitchGroups={userCanSwitchGroups}
            />
          ))}
        <aside>
          <h1 className="heading">{_t('Viewing')}:</h1>
        </aside>
        <EnrollmentState
          course={course}
          version={version}
          session={session}
          context={matchedContext}
          courseCatalogType={courseCatalogType}
          enrolledGroups={enrolledGroups}
          onEnrollmentBannerClick={toggleChangeCourseViewSettingsModal}
          courseMembership={courseMembership}
          showGroupInformation={showGroupInformation}
          shouldUseContextBasedVaL={shouldUseContextBasedVaL}
        />
        <div className="flex-1" />
        <Actions
          course={course}
          matchedContext={matchedContext}
          currentRouteName={currentRouteName}
          itemId={itemId}
          versionId={version.id}
          groupId={groupId}
          onSettingsButtonClick={toggleChangeCourseViewSettingsModal}
          userCanViewTeach={userCanViewTeach}
          shouldUseContextBasedVaL={shouldUseContextBasedVaL}
        />
      </Wrapped>
    );
  }
}

export default EnrollmentStateBanner;
