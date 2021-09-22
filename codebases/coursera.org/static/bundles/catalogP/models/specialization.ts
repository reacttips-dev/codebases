// @deprecated in favor of bundles/catalogP/models/s12n
import _ from 'underscore';

import constants from 'bundles/catalogP/constants';
import stringifyList from 'bundles/catalogP/lib/stringifyList';
import CatalogModel from 'bundles/catalogP/models/catalogModel';
import API from 'bundles/phoenix/lib/apiWrapper';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import userIdentity from 'bundles/phoenix/template/models/userIdentity';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/j... Remove this comment to see the full error message
import jsonConstants from 'js/json/constants';
import _tSpecializations from 'i18n!js/json/nls/specializations';
import path from 'js/lib/path';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'stor... Remove this comment to see the full error message
import store from 'store';

const Specialization = CatalogModel.extend(
  {
    fields: ['name', 'shortName', 'byline', 'logo', 'video'],

    includes: {
      courses: {
        resource: 'courses.v1',
        attribute: 'primaryCourseIds',
      },
      interchangeableCourses: {
        resource: 'courses.v1',
        attribute: 'interchangeableCourseIds',
      },
      partners: {
        resource: 'partners.v1',
        attribute: 'partnerIds',
      },
      instructors: {
        resource: 'instructors.v1',
        attribute: 'instructorIds',
      },
    },

    resourceName: 'specializations.v1',

    get(key: $TSFixMe) {
      const parentValue = this.constructor.__super__.get.apply(this, arguments);
      switch (key) {
        case 'name':
          return _tSpecializations(parentValue);
        default:
          return parentValue;
      }
    },

    getSlug() {
      return this.get('shortName');
    },

    getUnlocalizedName() {
      return this.constructor.__super__.get.apply(this, 'name');
    },

    getPartnerNamesString() {
      const partnerNames = this.get('partners').map((partner: $TSFixMe) => {
        return partner.get('name');
      });

      return stringifyList(partnerNames);
    },

    getByline() {
      return this.get('details').byline;
    },

    getIncentives() {
      return this.get('details').incentives;
    },

    getDescription({ cml } = { cml: false }) {
      return cml ? this.get('details').auxInfo.cmlDescription || {} : this.get('details').description;
    },

    getPartnerLogo(partner: $TSFixMe) {
      const partnerLogoOverride =
        this.get('details') && this.get('details').auxInfo && this.get('details').auxInfo.partnerLogoOverride;
      return partnerLogoOverride || partner.getLogoForCdp() || partner.getSquareLogo();
    },

    getLink() {
      return path.join('/specializations', this.get('shortName'));
    },

    /**
     * Returns interchangeable course sets for this course
     * @param  {catalogp/models/course} course CatalogP course model
     * @return {Array.<Courses>} array of course collections
     */
    getInterchangeableCourses(course: $TSFixMe) {
      if (this.has('interchangeableMap')) {
        return this.get('interchangeableMap')[course.get('id')];
      } else {
        return [];
      }
    },

    getCapstoneCourse() {
      return this.get('courses')
        .chain()
        .filter(function (course: $TSFixMe) {
          return course.isCapstone();
        })
        .first()
        .value();
    },

    /* Alias for consistency with catalogP/models/s12n */
    getCapstone() {
      return this.getCapstoneCourse(arguments);
    },

    getCompanyLogos() {
      return (this.get('details') && this.get('details').auxInfo && this.get('details').auxInfo.companyLogos) || [];
    },

    getLevel() {
      return this.get('details') && this.get('details').auxInfo && this.get('details').auxInfo.level;
    },

    /**
     * The catalogP API for spark specializations doesn't return hidden specializations,
     * even to superusers, so this is always false.
     */
    isSuperuserOnly() {
      return false;
    },

    isFlaggedForNoPayment() {
      return _(jsonConstants.specializationsFlaggedForNoPayment).contains(this.get('shortName'));
    },

    getNumCourses() {
      return this.get('courses').length - (this.getCapstoneCourse() ? 1 : 0);
    },

    getCertificateImageName() {
      return this.get('shortName');
    },

    getPartnerImage() {
      return this.get('details') && this.get('details').auxInfo && this.get('details').auxInfo.partnerImage;
    },

    getHeaderImage() {
      return this.get('details') && this.get('details').auxInfo && this.get('details').auxInfo.headerImage;
    },

    getPartnerMarketingBlurb() {
      return this.get('details') && this.get('details').auxInfo && this.get('details').auxInfo.partnerMarketingBlurb;
    },

    getAdditionalFaqs({ cml } = { cml: false }) {
      if (cml) {
        return this.get('details').auxInfo.cmlAdditionalFaqs || [];
      } else {
        const faqs = JSON.parse(this.get('details').faqs);
        const moreFaqs = (this.get('details') && this.get('details').auxInfo && this.get('details').auxInfo.faqs) || [];

        return faqs.concat(moreFaqs);
      }
    },

    getHeadline() {
      return this.get('details') && this.get('details').auxInfo && this.get('details').auxInfo.headline;
    },

    getSubheader() {
      return this.get('details') && this.get('details').auxInfo && this.get('details').auxInfo.subheader;
    },

    /**
     * Check if user has passed this specialization.
     *
     * Checks to see that all the courses are passed for certificate. Courses can
     * also be satisfied by any configured interchangeable course sets.
     *
     * Example:
     *
     * If a specialization is made up by Courses A, B, and C and the Course A
     * can also be satisfied by completing Courses 1 and 2, hasPassed will check
     * ((A || (1 && 2)) && B && C)
     * @return {boolean} If user has passed this specialization.
     */
    hasPassed() {
      return this.get('courses').all(function (course: $TSFixMe) {
        // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        const interchangeableCourseCollections = this.getInterchangeableCourses(course);

        return (
          course.hasPassed() ||
          (interchangeableCourseCollections.length > 0 &&
            interchangeableCourseCollections.any((collection: $TSFixMe) => {
              return collection.all((c: $TSFixMe) => c.hasPassed(true));
            }))
        );
      });
    },

    isEligibleForCapstone() {
      return this.get('courses').every(function (course: $TSFixMe) {
        return course.hasPassed(true) || course.isCapstone();
      });
    },

    /** There's no concept of "un-enrollment" w.r.t. specializations, so we stub over it by just not showing this
     *  specialization on the dashboard.
     */
    hide() {
      const storeName = userIdentity.get('id') + '.hidden-specialization-ids';
      const storeValue = store.get(storeName);
      const specializationId = this.get('id');

      if (storeValue) {
        store.set(storeName, storeValue + ',' + specializationId);
      } else {
        store.set(storeName, specializationId);
      }
    },
  },
  {
    getLinkForSession(course: $TSFixMe, session: $TSFixMe) {
      return path.join(
        constants.config.dir.home,
        'signature/specializationCourse',
        course.get('slug'),
        session.get('id')
      );
    },

    enrollWithVoucher(sessionId: $TSFixMe, bulkVoucherId: $TSFixMe) {
      return API(constants.config.url.api).post(constants.paymentsApi, {
        data: {
          'course-id': sessionId,
          'voucher-id': bulkVoucherId,
        },
      });
    },
  }
);

export default Specialization;
