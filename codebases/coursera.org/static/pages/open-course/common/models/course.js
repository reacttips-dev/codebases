/**
 * Course contains information about a course, as well as data about
 * the sections, modules, and items in the course.
 *
 * attributes:
 *  id: String
 *  short_name: String
 *  name: String
 *  description: String
 *  promo_video_id: String
 *  primary_language_codes: String
 *  subtitle_language_codes: Array[String]
 *  estimated_class_workload: String
 *  instructors: Array[String]
 *  universities: Array[String]
 */
import Backbone from 'backbone-associations';

import moment from 'moment';
import Q from 'q';
import _ from 'underscore';
import Instructor from 'bundles/catalogP/models/instructor';
import Instructors from 'bundles/catalogP/models/instructors';
import Partner from 'bundles/catalogP/models/partner';
import Partners from 'bundles/catalogP/models/partners';
import _tLanguage from 'i18n!js/json/nls/languages';
import _tTopics from 'i18n!js/json/nls/topics';
import imgix from 'js/lib/imgix';
import language from 'js/lib/language';
import path from 'js/lib/path';
import { truncate } from 'lodash';
import constants from 'pages/open-course/common/constants';

const Course = Backbone.AssociatedModel.extend({
  fetchRelatedModels(options) {
    const combinedPromise = Q.all([
      this.get('instructors').fetch(options),
      this.get('universities').fetch(options),
    ]).then(
      function () {
        return this;
      }.bind(this)
    );
    combinedPromise.done();
    return combinedPromise;
  },

  relations: [
    {
      type: Backbone.Many,
      key: 'instructors',
      relatedModel: Instructor,
      collectionType: Instructors,
    },
    {
      type: Backbone.Many,
      key: 'universities',
      relatedModel: Partner,
      collectionType: Partners,
    },
  ],

  parse(courseData) {
    const course = _.omit(courseData, 'courseMaterial');
    course.instructors = new Instructors(courseData.instructors);
    course.universities = new Partners(courseData.universities);

    // Add collection of associated universities to each instructor
    course.instructors.each(function (instructor) {
      let universities = _(instructor.get('partnerIds')).map(function (partnerId) {
        return course.universities.get(partnerId);
      });

      // In case any of the partners in instructor.get('partnerIds') were not present
      // in course.universities, remove any undefined values from the array.
      universities = _(universities).compact();

      instructor.set('universities', new Partners(universities));
    });
    return course;
  },

  get(key) {
    const parentValue = this.constructor.__super__.get.apply(this, arguments);

    switch (key) {
      case 'name':
        return _tTopics(parentValue);
      default:
        return parentValue;
    }
  },

  getUnlocalizedName() {
    this.constructor.__super__.get.apply(this, 'name');
  },

  /**
   * @return string url describing course for previewing learners
   */
  getLink() {
    return path.join(constants.learnRoot, this.get('slug'));
  },

  getFullLink() {
    return path.join(constants.config.url.base, this.getLink());
  },

  /**
   * @return string url for enrolled learners
   */
  getHomeLink() {
    return path.join('/', 'learn', this.get('slug'), 'home', 'welcome');
  },

  getTeachLink() {
    return path.join(constants.teachRoot, this.get('slug'));
  },

  getSubtitles() {
    return _(this.getSubtitleCodes()).chain().map(language.languageCodeToName).map(_tLanguage).value();
  },

  getSubtitleCodes() {
    return _.union(this.get('primaryLanguageCodes'), this.get('subtitleLanguageCodes'));
  },

  getTruncatedDescription(maxLength) {
    return truncate(this.get('description'), {
      length: maxLength,
      separator: ' ',
      omission: '…',
    });
  },

  getPartnerLogo(partnerId, options) {
    const partner = this.get('universities').get(partnerId);
    return this.getPartnerLogoOverride(partnerId, options) || (partner && partner.getSquareLogo(options));
  },

  getPartnerLogoOverride(partnerId, options) {
    const logo = this.get('overridePartnerLogos') && this.get('overridePartnerLogos')[partnerId];
    if (logo) {
      return imgix.processImage(logo, options || {});
    }
  },

  getFirstPartnerSquareLogo() {
    const firstPartner = this.get('universities').first();
    const imgixOptions = { width: '56px', height: '56px' };
    return this.getPartnerLogo(firstPartner.get('id'), imgixOptions);
  },

  getFirstPartnerRectangularLogo() {
    const firstPartner = this.get('universities').first();
    return firstPartner.get('rectangularLogo');
  },

  isVerificationEnabled() {
    if (typeof this.get('verificationEnabledAt') === 'number') {
      return Date.now() >= this.get('verificationEnabledAt');
    } else {
      return false;
    }
  },

  isCertificatePurchaseEnabled() {
    if (typeof this.get('certificatePurchaseEnabledAt') === 'number') {
      return Date.now() >= this.get('certificatePurchaseEnabledAt');
    } else {
      return false;
    }
  },

  getIsSubtitleTranslationEnabled() {
    if (typeof this.get('isSubtitleTranslationEnabled') === 'boolean') {
      return this.get('isSubtitleTranslationEnabled');
    } else {
      return false;
    }
  },

  hasLaunched() {
    return this.has('launchedAt') && Date.now() >= this.get('launchedAt');
  },

  isRestrictedMembership() {
    return this.get('isRestrictedMembership');
  },

  isPreEnrollEnabled() {
    const now = Date.now();
    return (
      (!this.has('launchedAt') || now < this.get('launchedAt')) &&
      this.has('preEnrollmentEnabledAt') &&
      now >= this.get('preEnrollmentEnabledAt')
    );
  },

  hasSessions() {
    const sessionsEnabledAt = this.get('sessionsEnabledAt');
    if (sessionsEnabledAt) {
      return moment().isAfter(sessionsEnabledAt);
    }
    return false;
  },

  hasDomain(domainId) {
    return this.get('domainTypes') && !!this.get('domainTypes').find((domainType) => domainType.domainId === domainId);
  },
});

export default Course;
