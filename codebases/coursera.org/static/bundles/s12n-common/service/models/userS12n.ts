import Courses from 'bundles/catalogP/models/courses';
import addPricesToSpecialization from 'bundles/s12n-common/lib/addPricesToSpecialization';
import constants from 'bundles/s12n-common/service/constants';
import _ from 'underscore';

function requires(...requiredProperties: $TSFixMe[]) {
  return function (target: $TSFixMe, name: $TSFixMe, descriptor: $TSFixMe) {
    const method = descriptor.value;
    descriptor.value = function (...args: $TSFixMe[]) {
      const missingProperties = requiredProperties.filter((requiredProperty) => {
        return !this[requiredProperty];
      });

      if (missingProperties.length > 0) {
        throw Error(`The following required properties are not found: ${missingProperties.join(', ')}`);
      }

      return method.apply(this, args);
    };
  };
}

function sparkOnly(target: $TSFixMe, name: $TSFixMe, descriptor: $TSFixMe) {
  const method = descriptor.value;
  descriptor.value = function (...args: $TSFixMe[]) {
    if (!this.isSpark()) {
      throw Error('The following property is for Spark Specializations only');
    }
    return method.apply(this, args);
  };
}

function phoenixOnly(target: $TSFixMe, name: $TSFixMe, descriptor: $TSFixMe) {
  const method = descriptor.value;
  descriptor.value = function (...args: $TSFixMe[]) {
    if (this.isSpark()) {
      throw Error('The following property is for Phoenix Specializations only');
    }
    return method.apply(this, args);
  };
}

/**
 * Encapsulates business logic involving a User and their S12nMembership.
 * Also handles Spark Specializations, via the sparkToS12nTransformer.
 */
class UserS12n {
  /**
   * @param  {bundles/catalogP/models/s12n} options.metadata
   * @param  {bundles/s12n-common/service/models/s12nOwnership} options.ownership
   * @param  {bundles/catalogP/models/s12nMembership} options.membership
   */
  constructor({ metadata, ownership, membership, sparkMetadata }: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'metadata' does not exist on type 'UserS1... Remove this comment to see the full error message
    this.metadata = metadata;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ownership' does not exist on type 'UserS... Remove this comment to see the full error message
    this.ownership = ownership;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'membership' does not exist on type 'User... Remove this comment to see the full error message
    this.membership = membership;

    // Strictly only needed for spark geopricing
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sparkMetadata' does not exist on type 'U... Remove this comment to see the full error message
    this.sparkMetadata = metadata;
  }

  /**
   * Whether or not this model is fully bootstrapped (which means all the method return values can be trusted)
   * @param [Array.<string>] options.except What properties can be skipped: metadata, ownership, membership
   * @return {boolean}
   */
  hasFullData({ except } = { except: [] }) {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
    const properties = ['metadata', 'ownership', 'membership'].filter((property) => except.indexOf(property) === -1);

    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return properties.every((property) => this[property]);
  }

  /**
   * @param {string} [key] Optional key if you want to deep access an attribute on the model (backbone-associations
   *                       deep traversal is supported)
   * @returns {S12n|number|string|Object|Array} Backbone model itself if no key is provided, otherwise an attribute
   *                                            on the underlying model.
   */
  @requires('metadata')
  getMetadata(key: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'metadata' does not exist on type 'UserS1... Remove this comment to see the full error message
    return key ? this.metadata.get(key) : this.metadata;
  }

  /**
   * @param {string} [key] Optional key if you want to deep access an attribute on the model (backbone-associations
   *                       deep traversal is supported)
   * @returns {S12nOwnership|number|string|Object|Array} Backbone model itself if no key is provided, otherwise an
   *                                                     attribute on the underlying model.
   */
  @requires('ownership')
  getOwnership(key: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ownership' does not exist on type 'UserS... Remove this comment to see the full error message
    return key ? this.ownership.get(key) : this.ownership;
  }

  /**
   * @param {string} [key] Optional key if you want to deep access an attribute on the model (backbone-associations
   *                       deep traversal is supported)
   * @returns {S12nMembership|SpecializationMembership|number|string|Object|Array} Backbone model itself if
   *                                                                               no key is provided, otherwise an
   *                                                                               attribute on the underlying model.
   */
  @requires('membership')
  getMembership(key: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'membership' does not exist on type 'User... Remove this comment to see the full error message
    return key ? this.membership.get(key) : this.membership;
  }

  getCourseNumber(courseId: $TSFixMe) {
    return this.getMetadata('courseIds').indexOf(courseId) + 1;
  }

  getNumCoursesIncludingCapstone() {
    return (this.getMetadata('courseIds') || this.getMetadata('courses')).length;
  }

  getNumCourses() {
    return this.getNumCoursesIncludingCapstone() - 1;
  }

  getNextCourseId(courseId: $TSFixMe) {
    const courseIds = this.getMetadata('courseIds');
    const index = courseIds.indexOf(courseId);
    if (index + 1 < courseIds.length) {
      return courseIds[index + 1];
    } else {
      return null;
    }
  }

  getNextCourse(courseId: $TSFixMe) {
    const nextCourseId = this.getNextCourseId(courseId);
    if (nextCourseId) {
      return this.getMetadata('courses').get(nextCourseId);
    } else {
      return null;
    }
  }

  isTakingS12n() {
    if (this.isSpark()) {
      // Taking depends on membership for Spark.
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
      return this.getMembership().has('id');
    }

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    return this.getMembership().isEnrolled();
  }

  doesOwnCourse(courseId: $TSFixMe) {
    const courseOwnerships = this.getOwnership('s12nCourseOwnerships').filter(
      (courseOwnership: $TSFixMe) => courseOwnership.get('owns') && courseOwnership.get('courseId') === courseId
    );
    return !_(courseOwnerships).isEmpty();
  }

  /**
   * Get valid unowned courses. These are unowned courses based on S12n ownership.
   * If countInterchangeableCredit is true, we'll count courses in membership that have equivalent
   * credit as owned for a course.
   *
   * @params {boolean} [options.countInterchangeableCredit=true]  Count interchangeable credit in memberships against
   *    ownerships
   * @return {[type]} [description]
   */
  getUnownedCourses({ countInterchangeableCredit } = { countInterchangeableCredit: true }) {
    const unownedPrimaryCourseIds = this.getOwnership('s12nCourseOwnerships')
      .filter((courseOwnership: $TSFixMe) => !courseOwnership.get('owns'))
      .map((courseOwnership: $TSFixMe) => courseOwnership.get('courseId'));

    if (countInterchangeableCredit) {
      const unownedCourses: $TSFixMe = [];
      unownedPrimaryCourseIds.forEach((courseId: $TSFixMe) => {
        const course = this.getMetadata('courses').findWhere({ id: courseId });
        // ProductOwnerships is returning interchangeableCourses as part of the s12nCourseOwnerships
        // instead of just primaryCourses. Unfortunately, this breaks here since the it's not part of the frontend
        // 'courses' collection attached to a specialization. Instead its part of the 'interchangeableCourses' map.
        // This means in this case, if going through s12nCourseOwnerships, there will be courseIds in the
        // iterations that are not primary courses (we should ignore these courses when computing unowned courses,
        // since we should only concern ourselves with primary courses, or the courses that need to be completed
        // in order to complete a specialization.).
        // So we can't do: if (!this.iscoursePassed(course)), we have to check to see if findWhere returns a course.
        if (course && !this.isCoursePassed(course)) {
          // @ts-ignore ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
          unownedCourses.push(course);
        }
      });

      return unownedCourses;
    } else {
      return this.getMetadata('courses').filter((course: $TSFixMe) =>
        unownedPrimaryCourseIds.indexOf(course.get('id') > 0)
      );
    }
  }

  getNextUnownedCourse() {
    const unownedCourses = this.getUnownedCourses();
    return unownedCourses.length ? unownedCourses[0] : null;
  }

  /**
   * Refer to getUnownedCourses for more information. This takes into consideration
   * interchangeable courses.
   * @return {[type]} [description]
   */
  getUnownedCoursesExceptCapstone() {
    return new Courses(this.getUnownedCourses().filter((course: $TSFixMe) => !course.isCapstone()));
  }

  ownsAllCoursesExceptCapstone() {
    const nextValidUnownedCourse = this.getNextUnownedCourse();
    const capstone = this.getCapstone();

    return nextValidUnownedCourse && capstone ? nextValidUnownedCourse.get('id') === capstone.get('id') : false;
  }

  /**
   * For CC and consider interchangeable course and continue
   * @params {Course} Course to check passed
   * @return {Boolean}
   */
  isCoursePassed(course: $TSFixMe, { forVc } = { forVc: true }) {
    if (course.hasPassed(forVc)) {
      return true;
    } else {
      const interchangeableCourseCollections = this.getInterchangeableCourseCollectionsForCourse(course);
      if (interchangeableCourseCollections) {
        return interchangeableCourseCollections.some((courses: $TSFixMe) => {
          return courses.all((c: $TSFixMe) => c.hasPassed(forVc));
        });
      }
    }
  }

  /**
   * @param  {Course} course - course to get interchangeable courses for
   * @return {Array.<Courses>} - Array of interchangeable course collections applicable to this course.
   */
  getInterchangeableCourseCollectionsForCourse(course: $TSFixMe) {
    const courses = this.getMetadata('interchangeableMap');
    return Object.keys(courses).length > 0 ? courses[course.get('id')] : [];
  }

  @phoenixOnly
  getHybridCourseCollectionsForCourse(course: $TSFixMe) {
    // TODO (lewis): Fill this out when redoing dashboard... Refer to s12nMemberships 'hybrid'
    // functions for assistance.
  }

  @phoenixOnly
  @requires(['metadata', 'membership', 'ownership'])
  isInHybridState() {
    if (this.isSpark()) {
      return false;
    } else {
      // eslint-disable-line
      // TODO (lewis): Fill this out when redoing dashboard... Refer to s12nMemberships 'hybrid'
      // functions for assistance.
    }
  }

  getCapstone() {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    return this.getMetadata().getCapstone();
  }

  isEligibleForCapstone() {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    return this.getMetadata().isEligibleForCapstone();
  }

  /**
   * NOTE: Calling this function on a non-spark specialization is not going to work.
   */
  @requires('metadata')
  @sparkOnly
  canSparkBulkPay() {
    return this.getMetadata('courses').reduce((c: $TSFixMe, course: $TSFixMe) => {
      try {
        return (
          c &&
          ((course.isCapstone() && course.get('price').amount) ||
            course.get('details.sessions').filter((session: $TSFixMe) => {
              return (
                session.get('status') && // session status is "open" // can register for CC
                ((session.eligibleForSignatureTrack() &&
                  // session started today or will start in the future
                  session.get('vcDetails.vcRegistrationOpen')) ||
                  session.getStartMomentFromToday().days() >= 0)
              );
            }).length > 0)
        );
      } catch (e) {
        throw new Error(
          'Tried to determine Spark bulk pay eligibility on Phoenix Specialization: ' + this.getMetadata('id')
        );
      }
    }, true);
  }

  @requires('metadata')
  isSpark() {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    return constants.sparkSpecializationIds.hasOwnProperty(this.getMetadata().getSlug());
  }
}

export default UserS12n;
