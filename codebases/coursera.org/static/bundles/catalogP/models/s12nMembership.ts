import moment from 'moment';
import Q from 'q';
import _ from 'underscore';
import constants from 'bundles/catalogP/constants';
import CatalogModel from 'bundles/catalogP/models/catalogModel';
import Courses from 'bundles/catalogP/models/courses';
import S12nRoles from 'bundles/common/constants/S12nRoles';
import path from 'js/lib/path';
import s12nMembershipApi from 'bundles/s12n-common/service/s12nMembershipApi';

/**
 * @class S12nMembership
 */
const S12nMembership = CatalogModel.extend(
  {
    api: s12nMembershipApi,

    resourceName: 'onDemandSpecializationMemberships.v1',

    fields: ['createdAt', 'updatedAt', 'status', 'role', 'eligibleForCapstone', 'completionStatus'],

    includes: {
      specialization: {
        resource: 'onDemandSpecializations.v1',
        attribute: 's12nId',
      },
      signatureTrackProfile: {
        resource: 'signatureTrackProfiles.v1',
        attribute: 'signatureTrackProfile',
      },
      progress: {
        resource: 'onDemandSpecializationProgress.v1',
        attribute: 'progress',
      },
    },

    /**
     * Returns undefined if the learner has not made progress in this specialization yet.
     */
    getLastActiveCourseId() {
      return this.get('progress.lastActiveCourseId');
    },

    enroll() {
      this.set('role', S12nRoles.LEARNER);
      const options = {
        data: this.toJSON(),
      };

      return Q(this.api.post('', options));
    },

    unenroll() {
      this.set('role', S12nRoles.NOT_ENROLLED);
      return Q(this.api.delete(this.get('id')));
    },

    /**
     * Given a course, see if this learner has any eligible interchangeable course collections
     * based on their memberships.
     * NOTE: The assumption here is that interchangeable courses we care about for this membership
     * are ones we have a membership in.
     * @param {Course} course Course catalogP model
     * @returns {Array[CourseCollection]} Array of course collections. Empty if nothing matches.
     */
    getInterchangeableCourseCollections(course: $TSFixMe) {
      const s12n = this.get('specialization');
      if (s12n) {
        const interchangeableCourseCollections = s12n.getInterchangeableCourses(course);

        // Get interchangeable course collections where the learner has a membership
        // where a vc certificate was earned for at least one of the courses in the collection.
        return _(interchangeableCourseCollections).filter(function (collection) {
          return collection.some(function (c: $TSFixMe) {
            return c.get('memberships').some((membership: $TSFixMe) => membership.hasVerifiedCertificate());
          });
        });
      } else {
        return [];
      }
    },

    /**
     * Does this course get pass credit by the interchangeable courses?
     * @return {boolean}
     */
    isCoursePassedViaInterchangeableCourses(course: $TSFixMe, { forVC = true }) {
      return this.getInterchangeableCourseCollections(course).some((courseCollection: $TSFixMe) => {
        return courseCollection.all((c: $TSFixMe) => c.hasPassed(forVC));
      });
    },

    getFirstPassedInterchangeableCourseCollection(course: $TSFixMe, { forVc } = { forVc: true }) {
      return this.getInterchangeableCourseCollections(course).find((courseCollection: $TSFixMe) => {
        return !courseCollection.isEmpty() && courseCollection.all((c: $TSFixMe) => c.hasPassed(forVc));
      });
    },

    getPassedCoursesIncludingInterchangeable({ forVc } = { forVc: true }) {
      return new Courses(
        this.get('specialization.courses').reduce((memo: $TSFixMe, course: $TSFixMe) => {
          let passedCourses = memo;
          const passedInterchangeableCourseCollection = this.getFirstPassedInterchangeableCourseCollection(course);

          if (course.hasPassed(forVc)) {
            passedCourses = memo.concat([course]);
          } else if (passedInterchangeableCourseCollection) {
            passedCourses = memo.concat(passedInterchangeableCourseCollection.toArray());
          }

          return passedCourses;
        }, [])
      );
    },

    /**
     * Given a course, get the first group of interchangeable courses that satisfies eligibility.
     * @param {Course} course Course catalogp model
     * @returns {CourseCollection|null} First course collection in interchangeable courses that is hybrid eligible
     */
    getFirstHybridCourseCollection(course: $TSFixMe) {
      const collections = this.getInterchangeableCourseCollections(course);
      if (collections.length > 0) {
        return collections[0];
      }

      return null;
    },

    /**
     * Given a course, return the first  alternative course
     * @param {Course} course Course catalogp model
     * @returns {Course|null} Returns first course that meets hybrid requirements.
     */
    getHybridCourse(course: $TSFixMe) {
      const collection = this.getFirstHybridCourseCollection(course);
      if (collection && collection.length > 0) {
        return collection.at(0);
      }

      return null;
    },

    /**
     * Is this specialization membership in a hybrid mode?
     * Hybrid memberships are specialization memberships that include Spark session courses.
     * These are determined if the learner has any memberships for interchangeable Spark sessions.
     * @returns {Boolean}
     */
    isHybrid() {
      const courses = this.get('specialization.courses');
      if (courses && courses.length) {
        return courses
          .chain()
          .map(this.getInterchangeableCourseCollections.bind(this))
          .filter((collection: $TSFixMe) => collection.length > 0)
          .flatten()
          .map(function (courseCollection: $TSFixMe) {
            return courseCollection.models;
          })
          .flatten()
          .invoke('isSession')
          .some()
          .value();
      } else {
        return false;
      }
    },

    isEnrolled() {
      return this.get('role') === 'LEARNER';
    },

    shouldDisplay() {
      return this.isEnrolled();
    },

    getEnrolledCourses() {
      return new Courses(
        this.get('specialization.courses').filter(function (course: $TSFixMe) {
          return course.get('courseProgress.overall') > 0;
        })
      );
    },

    getUserEnrolledCourses() {
      return new Courses(
        this.get('specialization.courses').filter(function (course: $TSFixMe) {
          return !!course.isEnrolled();
        })
      );
    },

    /**
     * You can really only pass courses in a Specialization by having VERIFIED_PASSED
     * on the courses.
     *
     * @return {boolean}
     */
    getPassedCourses() {
      return new Courses(
        this.get('specialization.courses').filter(function (course: $TSFixMe) {
          return course
            .get('memberships')
            .map((membership: $TSFixMe) => membership.has('vcMembership') && membership.get('vcMembership'))
            .filter((vcMembership: $TSFixMe) => !!vcMembership)
            .map((vcMembership: $TSFixMe) => vcMembership.get('grade').record === 'VERIFIED_PASSED')
            .reduce((allPassed: $TSFixMe, passed: $TSFixMe) => allPassed && passed, true);
        })
      );
    },

    /**
     * Existence of a certificateCode means that the user has passed this specialization.
     *
     * @return {boolean}
     */
    hasPassed() {
      return !!this.getCertificateCode();
    },

    /**
     * Alias for hasPassed
     */
    hasS12nCertificate() {
      return this.hasPassed();
    },

    getCertificateCode() {
      return this.has('progress.certificateMetadata') ? this.get('progress.certificateMetadata').verifyCode : undefined;
    },

    getRecordsLink() {
      const productVariant = this.get('specialization.productVariant');
      const isProfessionalCert = productVariant === 'ProfessionalCertificateS12n';
      return isProfessionalCert
        ? path.join(constants.accomplishments.professionalCertUrl, this.getCertificateCode())
        : path.join(constants.accomplishments.specializationUrl, this.getCertificateCode());
    },

    getFullRecordsLink() {
      return path.join(constants.config.url.base, this.getRecordsLink());
    },

    getCertificateLink() {
      const productVariant = this.get('specialization.productVariant');
      const isProfessionalCert = productVariant === 'ProfessionalCertificateS12n';
      return isProfessionalCert
        ? path.join(constants.accomplishments.professionalCertUrl, 'certificate', this.getCertificateCode())
        : path.join(constants.accomplishments.specializationUrl, 'certificate', this.getCertificateCode());
    },

    getFullCertificateLink() {
      return path.join(constants.config.url.base, this.getCertificateLink());
    },

    getCompletionDate() {
      const progress = this.get('progress');
      if (progress.has('certificateMetadata')) {
        return progress.has('certificateMetadata') ? moment(progress.get('certificateMetadata').grantedAt) : null;
      }

      return false;
    },

    getCertificateInfo() {
      const completionDate = this.getCompletionDate();
      return completionDate
        ? {
            certShareUrl: this.getFullRecordsLink(),
            completionDate: completionDate.format('MMMM YYYY'),
            licenseNo: this.getCertificateCode(),
          }
        : null;
    },

    getSuggestedSession(course: $TSFixMe) {
      const courseId = course.get('id');
      const suggestedSessionSchedule = this.get('suggestedSessionSchedule');
      const sessionId = suggestedSessionSchedule.get('suggestedSessions')[courseId];
      if (sessionId) {
        const courseSessions = course.get('v2Details.sessions');
        if (courseSessions) {
          return courseSessions.get(sessionId);
        }
      }
    },
  },
  S12nRoles
);

export default S12nMembership;
