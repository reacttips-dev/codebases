// A model for specializations (S12Ns) capable of supporting both On-Demand and Spark courses.

import moment from 'moment';

import _ from 'underscore';
import stringifyList from 'bundles/catalogP/lib/stringifyList';
import CatalogModel from 'bundles/catalogP/models/catalogModel';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import userIdentity from 'bundles/phoenix/template/models/userIdentity';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/j... Remove this comment to see the full error message
import courseConstants from 'js/json/constants';
import _tSpecializations from 'i18n!js/json/nls/specializations';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/j... Remove this comment to see the full error message
import defaultFaqs from 'js/json/s12n_faq';
import path from 'js/lib/path';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'stor... Remove this comment to see the full error message
import store from 'store';

const specializationsFlaggedForPriceChange = courseConstants.specializationsFlaggedForPriceChange;
const specializationsFlaggedForNoPayment = courseConstants.specializationsFlaggedForNoPayment;

const S12n = CatalogModel.extend({
  fields: ['name', 'slug', 'interchangeableCourseIds'],

  includes: {
    courses: {
      resource: 'courses.v1',
      attribute: 'courseIds',
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
    membership: {
      resource: 'onDemandSpecializationMemberships.v1',
      attribute: 'memberships',
    },
  },

  resourceName: 'onDemandSpecializations.v1',

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
    return this.get('slug');
  },

  getByline() {
    return this.get('tagline');
  },

  getIncentives() {
    return this.get('metadata').incentives;
  },

  getDescription({ cml } = { cml: false }) {
    return cml ? this.get('cmlDescription') || {} : this.get('description');
  },

  getProjectsOverview() {
    return this.get('projectsOverview');
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

  getLink() {
    return path.join('/specializations', this.get('slug'));
  },

  getCapstone() {
    return this.get('courses').filter(function (course: $TSFixMe) {
      return course.isCapstone();
    })[0];
  },

  /**
   * @returns {bool} - True if the learner has completed all other (non-Capstone) courses in the s12n
   * with VC, or false otherwise.
   */
  isEligibleForCapstone() {
    return this.get('courses').every(
      function (course: $TSFixMe) {
        // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        return course.hasPassed(true) || this.getHybridCourse(course) || course.isCapstone();
      }.bind(this)
    );
  },

  getFaqs() {
    const metadata = this.get('metadata');
    let faqs = metadata.useDefaultFaqs ? defaultFaqs : [];
    faqs = faqs.concat(metadata.additionalFaqs);
    return faqs;
  },

  getCertificateLogos() {
    if (this.get('metadata').certificateLogo) {
      return [this.get('metadata').certificateLogo];
    }

    const logos = this.get('partners')
      .chain()
      .map(function (partner: $TSFixMe) {
        return partner.get('logo') || partner.get('classLogo') || partner.get('squareLogo');
      })
      .compact()
      .value();

    return logos;
  },

  getPartnerLogo(partner: $TSFixMe) {
    return (
      (this.get('partnerLogoOverrides') && this.get('partnerLogoOverrides')[partner.get('id')]) ||
      partner.getLogoForCdp() ||
      partner.getSquareLogo()
    );
  },

  /**
   * Get interchangeable courses given a course in the specialization.
   * @param {Course} course Course
   * @returns {Array[Coursecollections]}
   */
  getInterchangeableCourses(course: $TSFixMe) {
    const interchangeableMap = this.get('interchangeableMap');
    if (interchangeableMap) {
      return interchangeableMap[course.get('id')];
    }
  },

  /**
   * Given a course, return a passed hybrid alternative course
   * @param {Course} course Course catalogp model
   * @returns {Course|null} Returns first course that meets hybrid requirements.
   */
  getHybridCourse(course: $TSFixMe) {
    const interchangeableCourses = this.getInterchangeableCourses(course);
    const hybridCourses = _(interchangeableCourses)
      .map(function (courseCollection) {
        return courseCollection.find(function (hybridCourse: $TSFixMe) {
          return hybridCourse.hasPassed(true); // return first passing course in a course collection
        });
      })
      .filter(function (passedCourse) {
        return passedCourse; // filter out null courses (when a collection had no passing)
      });

    if (hybridCourses && hybridCourses.length) {
      return hybridCourses[0]; // just take the first passing hybrid course
    } else {
      return null;
    }
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

  /**
   * Returns the number of courses in the specialization, assuming the capstone is a course.
   */
  getNumCourses() {
    return this.get('courses').length;
  },

  getNumOtherCourses() {
    return this.get('courses').length - 1;
  },

  getCertificateImageName() {
    return this.get('slug');
  },

  isSuperuserOnly() {
    const isInternal = this.get('internalType') === 'TEST';
    const now = moment();
    const hasLaunched = this.get('launchedAt') && moment(this.get('launchedAt')).isBefore(now);

    return isInternal || !hasLaunched;
  },

  isFlaggedForPriceChange() {
    return _(specializationsFlaggedForPriceChange).contains(this.get('slug'));
  },

  isFlaggedForNoPayment() {
    return _(specializationsFlaggedForNoPayment).contains(this.get('slug'));
  },

  getCompanyLogos() {
    return this.get('metadata').companyLogos;
  },

  getLevel() {
    return this.get('metadata').level;
  },

  getPartnerImage(id: $TSFixMe) {
    const isFirstPartner = id === this.get('partnerIds')[0];
    const images = this.get('metadata').partnerImages;
    return (images && images.hasOwnProperty(id) && images[id]) || (isFirstPartner && this.get('metadata').partnerImage);
  },

  getPartnerMarketingBlurb(id: $TSFixMe) {
    const isFirstPartner = id === this.get('partnerIds')[0];
    const marketingBlurbs = this.get('metadata').partnerMarketingBlurbs;
    return (
      (marketingBlurbs && marketingBlurbs.hasOwnProperty(id) && marketingBlurbs[id]) ||
      (isFirstPartner && this.get('metadata').partnerMarketingBlurb)
    );
  },

  getHeaderImage() {
    return this.get('metadata') && this.get('metadata').headerImage;
  },

  getAdditionalFaqs({ cml } = { cml: false }) {
    return cml ? this.get('metadata').cmlAdditionalFaqs : this.get('metadata').additionalFaqs;
  },

  getHeadline() {
    return this.get('metadata').headline;
  },

  getSubheader() {
    return this.get('metadata').subheader;
  },

  hasPhoenixSessions() {
    const courses = this.get('courses');
    return courses && courses.first() && courses.first().hasPhoenixSessions();
  },
});

export default S12n;
