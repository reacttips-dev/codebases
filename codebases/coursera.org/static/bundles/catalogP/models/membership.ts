import moment from 'moment';
import Q from 'q';
import _ from 'underscore';
import URI from 'jsuri';
import constants from 'bundles/catalogP/constants';
import CatalogModel from 'bundles/catalogP/models/catalogModel';
import CourseRoles from 'bundles/common/constants/CourseRoles';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import currentUserAuth from 'bundles/phoenix/template/models/userAuthorization';
import config from 'js/app/config';
import path from 'js/lib/path';
import { courseRolesWithTeachAccess } from 'pages/open-course/common/constants';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'page... Remove this comment to see the full error message
import OnDemandMembership from 'pages/open-course/common/models/membership';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'page... Remove this comment to see the full error message
import courseGradePromise from 'pages/open-course/common/promises/courseGrade';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'page... Remove this comment to see the full error message
import courseProgressPromise from 'pages/open-course/common/promises/courseProgress';

const Membership = CatalogModel.extend(
  {
    fields: [
      'courseId',
      'role',
      'enrolledTimestamp',
      'lastAccessedTimestamp',
      'id',
      'grade',
      'vc',
      'v1SessionId',
      'vcMembershipId',
    ],

    includes: {
      course: {
        resource: 'courses.v1',
        attribute: 'courseId',
      },
      session: {
        resource: 'v1Sessions.v1',
        attribute: 'v1SessionId',
      },
      vcMembership: {
        resource: 'vcMemberships.v1',
        attribute: 'vcMembershipId',
      },
      signatureTrackProfile: {
        resource: 'signatureTrackProfiles.v1',
        attribute: 'signatureTrackProfile',
      },
      onDemandSession: {
        resource: 'onDemandSessions.v1',
        attribute: 'onDemandSessionId',
      },
      onDemandSessionMemberships: {
        resource: 'onDemandSessionMemberships.v1',
        attribute: 'onDemandSessionMemberships',
      },
    },

    resourceName: 'memberships.v1',

    getSpecialization() {
      return this.get('course').getFirstSpecialization();
    },

    getCourseGrade(forVC: $TSFixMe) {
      return (forVC ? this.get('vcMembership.grade') : this.get('grade')) || {};
    },

    getCourseGradeString(forVC: $TSFixMe) {
      const grade = this.getCourseGrade(forVC);
      let score;

      if (this.get('course').isOnDemand()) {
        // On-demand grades are from 0 to 1
        score = grade.score * 100;
      } else {
        // Spark grades are from 0 to 100
        score = grade.score;
      }

      // Rounding grade, then one decimal place
      return (Math.round((score || 0) * 10) / 10).toFixed(1);
    },

    getCertificateGrantMoment() {
      return moment(this.get('vcMembership.grantedAt')).utc();
    },

    getRecordsLink() {
      return path.join(constants.accomplishments.baseUrl, 'records', this.get('vcMembership.certificateCode'));
    },

    getFullRecordsLink() {
      return path.join(constants.config.url.base, this.getRecordsLink());
    },

    getVerifyLink() {
      return path.join(constants.accomplishments.baseUrl, 'verify', this.get('vcMembership.certificateCode'));
    },

    getFullVerifyLink() {
      return path.join(constants.config.url.base, this.getVerifyLink());
    },

    getCertificateLink() {
      return path.join(constants.accomplishments.baseUrl, 'certificate', this.get('vcMembership.certificateCode'));
    },

    getFullCertificateLink() {
      return path.join(constants.config.url.base, this.getCertificateLink());
    },

    getCertPdfUrl() {
      const certificateCode = this.get('vcMembership.certificateCode');
      if (this.get('course').isOnDemand()) {
        return path.join(config.url.base, 'api/certificate.v1/pdf', certificateCode);
      } else {
        return path.join(
          config.url.base,
          `/api/legacyCertificates.v1/spark/verifiedCertificate/${certificateCode}/pdf`
        );
      }
    },

    getCourseEntryUrl() {
      const course = this.get('course');
      if (course.isOnDemand()) {
        return path.join(course.getHomeLink());
      } else {
        return course.getLink();
      }
    },

    hasPassed(forVC: $TSFixMe) {
      const grade = this.getCourseGrade(forVC) || {};

      if (forVC) {
        const isSparkCourse = this.get('vcMembership.isSparkCourse');
        if (isSparkCourse) {
          // Spark courses do not retrieve their passing state from the
          // same system as OnDemand courses.
          // Only a passing state of Verified Passed is valid for Spark
          return grade.record === Membership.GRADE.VERIFIED_PASSED;
        } else {
          // This is an OnDemandCourse
          // VERIFIED_PASSED means that all items that require
          // verification (checkbox acknoledgement you aren't cheating)
          // have been passed

          // PASSED means all items (including verified ones) have passed

          // Both of these are valid for earning a ceritifcate
          // since VERIFIED_PASSED is a subset of PASSED
          return grade.record === Membership.GRADE.VERIFIED_PASSED || grade.record === Membership.GRADE.PASSED;
        }
      } else {
        return grade.record === Membership.GRADE.PASSED;
      }
    },

    hasDistinction(forVC: $TSFixMe) {
      return this.getCourseGrade(forVC).distinctionLevel === Membership.DISTINCTION.DISTINCTION;
    },

    hasHonors(forVC: $TSFixMe) {
      return this.getCourseGrade(forVC).distinctionLevel === Membership.DISTINCTION.HONORS;
    },

    unenroll() {
      const course = this.get('course');
      if (course.isOnDemand()) {
        const onDemandMembership = new OnDemandMembership({
          courseId: course.get('id'),
        });
        return Q(onDemandMembership.unenroll());
      } else {
        const session = this.get('session');
        return Q(session.unenroll());
      }
    },

    getCourseProgressStatus() {
      const course = this.get('course');
      if (course.isOnDemand()) {
        const progressPercent = this.getCourseProgressPercent();
        if (progressPercent === undefined) {
          return undefined;
        } else if (
          this.hasPassed(!!this.get('vcMembership')) ||
          (!this.isGradable() && progressPercent === 100) ||
          (this.get('onDemandSession') && this.get('onDemandSession').hasEnded())
        ) {
          return Membership.PROGRESS.ENDED;
        } else if (
          (this.get('onDemandSession') && this.get('onDemandSession').isUpcoming()) ||
          course.isOnDemandPreEnroll()
        ) {
          return Membership.PROGRESS.UPCOMING;
        } else {
          return Membership.PROGRESS.STARTED;
        }
      } else {
        const session = this.get('session');
        if (course.get('selfStudy')) {
          return Membership.PROGRESS.STARTED;
        } else if (!session || !session.getStartMoment()) {
          return Membership.PROGRESS.TBA;
        } else if (session.hasEnded()) {
          return Membership.PROGRESS.ENDED;
        } else if (
          !session.hasStarted() ||
          (session.hasStarted() &&
            !session.get('active') &&
            !(currentUserAuth.get('is_superuser') && currentUserAuth.get('is_staff')))
        ) {
          return Membership.PROGRESS.UPCOMING;
        } else {
          return Membership.PROGRESS.STARTED;
        }
      }
    },

    getCourseProgressPercent() {
      if (this.get('course').isOnDemand()) {
        if (this.get('onDemandSession')) {
          const session = this.get('onDemandSession');
          const totalTime = moment(session.endedAt).diff(session.startedAt);
          const elapsedTime = moment().diff(session.startedAt);
          const percent = elapsedTime >= 0 ? (elapsedTime / totalTime) * 100 : 0;
          return Math.floor(Math.min(percent, 100));
        } else {
          const progressData = this.get('progressData');
          const detailedCourseGrade = this.get('detailedCourseGrade');
          const progressPercent = progressData ? progressData.get('overall') : 0;
          const gradePercent = detailedCourseGrade ? detailedCourseGrade.getFractionPassed() * 100 : 0;

          if (detailedCourseGrade && detailedCourseGrade.get('overallOutcome').passedItemsCount > 0) {
            return gradePercent;
          }

          return Math.round(Math.max(progressPercent, gradePercent));
        }
      } else {
        const totalCourseDays = this.get('session').getDurationDays();
        const daysSoFar = Math.abs(Math.floor(this.get('session').getStartMomentFromToday().asDays()));
        const completionPercent = Math.floor((daysSoFar / totalCourseDays) * 100);
        return Math.min(completionPercent, 100);
      }
    },

    getCourseCertificateInfo() {
      const course = this.get('course');
      const completionDate = this.getCertificateGrantMoment();

      if (this.hasVerifiedCertificate()) {
        return {
          licenseNo: this.get('vcMembership.certificateCode'),
          certShareUrl: this.getFullVerifyLink(),
          completionDate: completionDate.format('MMMM YYYY'),
        };
      } else if (this.hasStatementOfAccomplishment()) {
        return {
          certShareUrl: course.getFullLink(),
          completionDate: completionDate.format('MMMM YYYY'),
        };
      } else {
        return null;
      }
    },

    canTeachCourse() {
      const teachAccessRole = _(courseRolesWithTeachAccess).contains(this.get('role'));
      return teachAccessRole || currentUserAuth.get('is_superuser');
    },

    isEnrolled() {
      return !_([CourseRoles.BROWSER, CourseRoles.NOT_ENROLLED, CourseRoles.PRE_ENROLLED_LEARNER]).contains(
        this.get('role')
      );
    },

    getOnDemandProgressData() {
      return courseProgressPromise(this.get('course.slug')).then((progressData: $TSFixMe) => {
        this.set({ progressData });
        return progressData;
      });
    },

    getDetailedCourseGrade() {
      if (this.isGradable()) {
        const promise = courseGradePromise(this.get('course.id')).then((detailedCourseGrade: $TSFixMe) => {
          this.set({ detailedCourseGrade });
        });
        promise.done();
        return promise;
      }
    },

    getResumeLink() {
      const course = this.get('course');

      if (course.isOnDemand()) {
        const progData = this.get('progressData');
        if (progData) {
          return path.join('/learn', course.get('slug'), 'item', progData.get('nextItem'));
        } else {
          return path.join('/learn', course.get('slug'));
        }
      } else if (this.get('session')) {
        return this.get('session').getLink();
      }
    },

    getPhoto() {
      const course = this.get('course');
      const nextItem = this.get('nextItem');
      if (course.isOnDemand() && nextItem) {
        return course.get('photoUrl');
      } else {
        return course.get('photoUrl');
      }
    },

    isGradable() {
      return this.get('grade') && this.get('grade').record !== Membership.GRADE.NOT_PASSABLE;
    },

    hasVerifiedCertificate() {
      return this.get('vcMembership') && this.hasPassed(true);
    },

    hasSessionVerifiedCertificate() {
      const course = this.get('course');
      return (
        course &&
        (course.isSession() || course.isCapstone()) &&
        this.hasVerifiedCertificate() &&
        this.get('vcMembership.certificateCode')
      );
    },

    hasOnDemandVerifiedCertificate() {
      const course = this.get('course');
      return course && course.isOnDemand() && this.hasVerifiedCertificate();
    },

    hasEnrolledForVerification() {
      return this.hasEnrolledForOnDemandVerification() || this.hasEnrolledForSessionVerification();
    },

    hasEnrolledForSessionVerification() {
      const course = this.get('course');
      return course && course.isSession() && this.get('vcMembership');
    },

    hasEnrolledForOnDemandVerification() {
      const course = this.get('course');
      return course && course.isOnDemand() && this.get('vcMembership');
    },

    hasStatementOfAccomplishment() {
      const course = this.get('course');
      return (
        course &&
        course.isSession() &&
        this.get('session.eligibleForCertificate') &&
        this.get('session.certificatesReleased') &&
        this.hasPassedWithoutVC()
      );
    },

    hasPassedWithoutVC() {
      const course = this.get('course');
      if (course.isSession() || course.isCapstone()) {
        return this.hasPassed() && !this.hasPassed(true) && this.get('session.certificatesReleased');
      } else if (course.isOnDemand()) {
        return this.hasPassed() && !this.hasPassed(true);
      }
    },

    hasPassedCapstone() {
      const course = this.get('course');
      return course && course.isCapstone() && this.get('session.certificatesReleased') && this.hasPassed(true);
    },

    /**
     * Given a SpecializationMemberships collection, return the relevant specializationMembership.
     * // TODO: Hook up interchangeable courses
     * @param {SpecializationMemberships|S12nMemberships} specializationMemberships SpecializationMemberships
     *   to search through.
     * @returns {SpecializationMembership|S12nMembership|undefined}
     */
    getSpecializationMembership(specializationMemberships: $TSFixMe) {
      return specializationMemberships.find(
        function (specializationMembership: $TSFixMe) {
          const courseIds = specializationMembership.get('specialization.courses').pluck('id');
          // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
          return _(courseIds).contains(this.get('course.id'));
        }.bind(this)
      );
    },

    hasEnrolledForSparkCertificate() {
      return !!this.get('vcMembershipId');
    },
  },
  {
    GRADE: {
      PASSED: 'PASSED',
      NOT_PASSED: 'NOT_PASSED',
      NOT_PASSABLE: 'NOT_PASSABLE',
      VERIFIED_PASSED: 'VERIFIED_PASSED',
    },

    DISTINCTION: {
      NO_DISTINCTION: 'NO_DISTINCTION',
      NORMAL: 'NORMAL',
      DISTINCTION: 'DISTINCTION',
      HONORS: 'HONORS',
    },

    PROGRESS: {
      STARTED: 'STARTED',
      ENDED: 'ENDED',
      UPCOMING: 'UPCOMING',
      TBA: 'TBA',
    },
  }
);

export default Membership;
