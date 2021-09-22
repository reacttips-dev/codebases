import _ from 'underscore';
import CourseRoles from 'bundles/common/constants/CourseRoles';
import { PeerAdminCapabilities } from 'bundles/peer-admin/constants/constants';

const peerReviewAdminAuthorizedCourseRoles = [
  CourseRoles.TEACHING_STAFF,
  CourseRoles.UNIVERSITY_ADMIN,
  CourseRoles.INSTRUCTOR,
  CourseRoles.DATA_COORDINATOR,
];

export default (courseRole, isOutsourcingOrSuperuser, requestedCapability) => {
  if (isOutsourcingOrSuperuser) {
    return true;
  }
  switch (requestedCapability) {
    case PeerAdminCapabilities.doAdministrativeAction:
    case PeerAdminCapabilities.previewRubric:
      return _.contains(peerReviewAdminAuthorizedCourseRoles, courseRole);
    case PeerAdminCapabilities.viewSubmissionList:
    case PeerAdminCapabilities.reviewMentorGraded:
      return (
        courseRole === CourseRoles.MENTOR ||
        courseRole === CourseRoles.COURSE_ASSISTANT ||
        _.contains(peerReviewAdminAuthorizedCourseRoles, courseRole)
      );
    default:
      return false;
  }
};
