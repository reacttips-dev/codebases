/* eslint-disable no-shadow */
import moment from 'moment';

import _ from 'underscore';
import constants from 'bundles/catalogP/constants';
import CatalogModel from 'bundles/catalogP/models/catalogModel';
import Courses from 'bundles/catalogP/models/courses';
import path from 'js/lib/path';

/**
 * @class SpecializationMembership
 * @property {string} [specializationId] - The ID of the associated Specialization.
 * @property {string} [bulkVoucherId] - The voucher ID of a bulk Specialization purchase.
 * @property {boolean} [eligibleForCapstone] - Whether or not the learner is eligible for a capstone in this Spzn.
 */
const SpecializationMembership = CatalogModel.extend({
  resourceName: 'specializationMemberships.v1',

  fields: ['specializationId', 'bulkVoucher', 'eligibleForCapstone', 'certificateCode'],

  includes: {
    specialization: {
      resource: 'specializations.v1',
      attribute: 'specializationId',
    },
    signatureTrackProfile: {
      resource: 'signatureTrackProfiles.v1',
      attribute: 'signatureTrackProfile',
    },
  },

  getFirstInterchangeableCourse(course: $TSFixMe) {
    const interchangeableCourses = this.get('specialization').getInterchangeableCourses(course);
    const enrolledCourses = _(interchangeableCourses)
      .chain()
      .reduce(function (memo, collection) {
        return memo.add(collection.models, { silent: true });
      }, new Courses())
      .filter(function (course) {
        return course.has('memberships') && !course.get('memberships').isEmpty();
      })
      .value();

    const passedCourse = _(enrolledCourses).find(function (course) {
      return course.hasPassed(true);
    });

    if (passedCourse) {
      return passedCourse;
    } else {
      return _(enrolledCourses).find(function (course) {
        return _(course.getEnrolledSessions()).pluck('active');
      });
    }
  },

  shouldDisplay() {
    return this.get('specialization.display');
  },

  getEnrolledCourses() {
    return new Courses(
      this.get('specialization.courses').filter(function (course: $TSFixMe) {
        return _(course.getEnrolledSessions()).any(function (session) {
          return session.get('active');
        });
      })
    );
  },

  getPassedCourses({ forVc } = { forVc: true }) {
    return new Courses(
      this.get('specialization.courses').filter(function (course: $TSFixMe) {
        // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        const interchangeableCourse = this.getFirstInterchangeableCourse(course);
        const passedInterchangeableCourse = interchangeableCourse && interchangeableCourse.hasPassed(forVc);
        return course.hasPassed(forVc) || passedInterchangeableCourse;
      }, this)
    );
  },

  getPassedCoursesIncludingInterchangeable({ forVc } = { forVc: true }) {
    return new Courses(
      this.get('specialization.courses').reduce(
        function (memo: $TSFixMe, course: $TSFixMe) {
          // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
          const interchangeableCourse = this.getFirstInterchangeableCourse(course);
          const passedInterchangeableCourse = interchangeableCourse && interchangeableCourse.hasPassed(forVc);

          if (course.hasPassed(forVc)) {
            memo.push(course);
          } else if (passedInterchangeableCourse) {
            memo.push(interchangeableCourse);
          }
          return memo;
        }.bind(this),
        []
      )
    );
  },

  hasPassed() {
    return this.getPassedCourses().length === this.get('specialization.courses').length;
  },

  getCertificateCode() {
    return this.get('certificateCode');
  },

  /**
   * Does this specializationMembership reward with a membership.
   *
   * NOTE: foundationsteaching (Foundations of Teaching for Learning) does not require
   * people to pass the first course to earn a Specialization Certificate.
   */
  hasSpecializationCertificate() {
    if (this.get('specialization.shortName') === 'foundationsteaching') {
      const coursesPassedForVC = new Courses(
        this.get('specialization.courses').filter(function (course: $TSFixMe) {
          return course.hasPassed(true);
        })
      );

      const otherCourses = new Courses(
        this.get('specialization.courses').reject(function (course: $TSFixMe) {
          return _(coursesPassedForVC.pluck('slug')).contains(course.get('slug'));
        })
      );

      if (otherCourses.length === 1 && otherCourses.at(0).get('slug') === 'teach1' && coursesPassedForVC.length === 8) {
        return !!this.getCertificateCode();
      }
    }

    return this.hasPassed() && this.getCertificateCode();
  },

  getRecordsLink() {
    return path.join(constants.accomplishments.baseUrl, 'specialization', this.getCertificateCode());
  },

  getFullRecordsLink() {
    return path.join(constants.config.url.base, this.getRecordsLink());
  },

  getCertificateLink() {
    return path.join(constants.accomplishments.baseUrl, 'specialization', 'certificate', this.getCertificateCode());
  },

  getFullCertificateLink() {
    return path.join(constants.config.url.base, this.getCertificateLink());
  },

  getCompletionDate() {
    return this.has('grantedAt') ? moment(this.get('grantedAt')) : null;
  },

  hasBulkPaid() {
    return !!this.get('bulkVoucherId');
  },

  getLastActiveCourseId() {
    // TODO(lewis): Need to fill this out? Likely this should be moved to a parent model since this has
    // to be inferred from course memberships. For now not doing it and just returning undefined is okay.
    return undefined;
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

  isCoursePassedViaInterchangeableCourses(course: $TSFixMe, { forVc } = { forVc: true }) {
    return this.getPassedCourses({ forVc }).includes(course);
  },
});

export default SpecializationMembership;
