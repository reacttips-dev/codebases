import Q from 'q';
import enrollment from 'bundles/course-preview/constants/enrollment';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'page... Remove this comment to see the full error message
import courseMembershipPromise from 'pages/open-course/common/promises/membership';
import { primaryS12ns } from 'bundles/s12n-common/service/promises/s12ns';

/**
 * @return {Promise}
 */
const enrollmentModePromise = (userId: $TSFixMe, courseId: $TSFixMe) =>
  courseMembershipPromise(userId, courseId).then((courseMembership: $TSFixMe) => {
    if (courseMembership.hasEnrolledRole()) {
      return Q(enrollment.modes.ENROLLED);
    } else if (courseMembership.hasPreEnrolled()) {
      return Q(enrollment.modes.PRE_ENROLLED);
    } else {
      return primaryS12ns(courseId, userId).then((s12nCollection: $TSFixMe) => {
        if (s12nCollection.isEmpty()) {
          return enrollment.modes.EXPLICIT;
        } else {
          return enrollment.modes.UPSELL;
        }
      });
    }
  });

export default enrollmentModePromise;
