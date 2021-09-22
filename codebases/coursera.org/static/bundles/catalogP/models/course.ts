import moment from 'moment';
import _ from 'underscore';
import constants from 'bundles/catalogP/constants';
import CatalogModel from 'bundles/catalogP/models/catalogModel';
import Sessions from 'bundles/catalogP/models/sessions';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/j... Remove this comment to see the full error message
import jsonConstants from 'js/json/constants';
import _tTopics from 'i18n!js/json/nls/topics';
import path from 'js/lib/path';
import openCourseConstants from 'pages/open-course/common/constants';

const Course = CatalogModel.extend({
  defaults: {
    categories: [],
    certificates: [],
  },

  includes: {
    instructors: {
      resource: 'instructors.v1',
      attribute: 'instructorIds',
    },
    details: {
      resource: 'v1Details.v1',
      attribute: 'v1Details',
    },
    v2Details: {
      resource: 'v2Details.v1',
      attribute: 'v2Details',
    },
    partners: {
      resource: 'partners.v1',
      attribute: 'partnerIds',
    },
    primaryLanguages: {
      resource: 'languages.v1',
      attribute: 'primaryLanguages',
    },
    subtitleLanguages: {
      resource: 'languages.v1',
      attribute: 'subtitleLanguages',
    },
    categories: {
      resource: 'categories.v1',
      attribute: 'categories',
    },
    specializations: {
      resource: 'specializations.v1',
      // TODO(bryan): change this to specializationIds on the backend
      attribute: 'specializations',
    },
    s12ns: {
      resource: 'onDemandSpecializations.v1',
      attribute: 's12nIds',
    },
    memberships: {
      resource: 'memberships.v1',
      attribute: 'membershipIds',
    },
    courseProgress: {
      resource: 'onDemandCoursesProgress.v1',
      attribute: 'courseProgress',
    },
    vcMemberships: {
      resource: 'vcMemberships.v1',
      attribute: 'vcMembershipIds',
    },
  },

  resourceName: 'courses.v1',

  get(key: $TSFixMe) {
    const parentValue = this.constructor.__super__.get.apply(this, arguments);

    switch (key) {
      case 'name':
        return _tTopics(parentValue);
      default:
        return parentValue;
    }
  },

  getSlug() {
    return this.get('slug');
  },

  getUnlocalizedName() {
    this.constructor.__super__.get.apply(this, 'name');
  },

  getCertLogo() {
    const partnerLogo =
      this.has('partners') &&
      this.get('partners')
        .chain()
        .map((partner: $TSFixMe) => partner.get('logo') || partner.get('classLogo'))
        .compact()
        .first()
        .value();
    return partnerLogo || this.get('certificatePartnerLogo') || this.get('partnerLogo');
  },

  hasValidCertLogo() {
    return !!this.getCertLogo();
  },

  getLink() {
    if (this.isOnDemand()) {
      return path.join('/', 'learn', this.get('slug'));
    } else {
      return path.join(constants.config.dir.home, 'course', this.get('slug'), this.get('session.id'));
    }
  },

  getHomeLink() {
    return path.join('/', 'learn', this.get('slug'), 'home', 'welcome');
  },

  getFullLink() {
    return path.join(constants.config.url.base, this.getLink());
  },

  getCourseRecordsLink() {
    return '/accomplishments';
  },

  getTeachLink() {
    return path.join(openCourseConstants.teachRoot, this.get('slug'));
  },

  getName() {
    return this.get('name');
  },

  eligibleFor(certificateType: $TSFixMe) {
    return _(this.get('certificates')).contains(certificateType);
  },

  canEarnVCForSession(session: $TSFixMe) {
    return (
      session.isEligibleForVC() &&
      !!session.get('vcDetails.vcRegistrationOpen') &&
      !this.isEnrolledInVCSession(session) &&
      !this.isFlaggedForNoPayment()
    );
  },

  isOnDemand() {
    return this.get('courseType') === 'v2.ondemand' || this.get('courseType') === 'v2.capstone';
  },

  /**
   * @returns {bool} True if the course has Phoenix sessions enabled.
   *   This means a session must exist when the course is launched (but may not yet for pre-launched courses).
   */
  hasPhoenixSessions() {
    // If sessionsEnabledAt exists, it is guaranteed to be in the past, so we can safely check for existence only.
    return !!this.get('v2Details.sessionsEnabledAt');
  },

  /**
   * @returns {bool} True if a Phoenix session has been created for the given course.
   */
  phoenixSessionExists() {
    const sessions = this.get('v2Details.sessions');
    // TODO(jon): when the sessions model is a backbone collection, check the length like a normal person
    return this.isOnDemand() && (this.isOnDemandCapstone() || (sessions && Object.keys(sessions.models).length > 0));
  },

  isCapstone(type: $TSFixMe) {
    return this.isSessionCapstone() || this.isOnDemandCapstone();
  },

  isSessionCapstone() {
    return this.get('courseType') === 'v1.capstone';
  },

  isOnDemandCapstone() {
    return this.get('courseType') === 'v2.capstone';
  },

  isSession() {
    return this.get('courseType') === 'v1.session';
  },

  isVCOnDemand() {
    return this.isOnDemand() && this.eligibleFor('VerifiedCert');
  },

  getStartDate() {
    if (this.get('startDate')) {
      return moment.utc(this.get('startDate'));
    }
  },

  getShortStartDate() {
    if (this.get('startDate')) {
      return moment(this.get('startDate')).format('LL');
    }
  },

  hasStartDate() {
    // This is a hack since many courses that are in the process of migrating have startDates of 9999999999999.
    return this.get('startDate') && this.get('startDate') !== 9999999999999;
  },

  hasStarted() {
    return this.get('startDate') && moment().isAfter(this.get('startDate'));
  },

  getUpcomingSession() {
    if (this.isOnDemand()) {
      return this.get('v2Details.sessions') && this.get('v2Details.sessions').getUpcomingSession();
    } else {
      return this.get('details.upcomingSession');
    }
  },

  hasUpcomingSession() {
    return this.getUpcomingSession() !== undefined;
  },

  isUpcomingSessionSigTrack() {
    return this.get('details.upcomingSession.hasSigTrack');
  },

  getOnDemandVCLink() {
    return this.isVCOnDemand() ? path.join('/', 'certificate', this.get('slug')) : undefined;
  },

  getUpcomingSessionSigTrackLink() {
    if (this.isUpcomingSessionSigTrack()) {
      const upcomingSession = this.getUpcomingSession();
      return path.join(constants.config.dir.home, 'signature', 'course', this.get('slug'), upcomingSession.get('id'));
    } else {
      return '';
    }
  },

  isEnrolled() {
    if (this.get('memberships').length) {
      if (this.isOnDemand()) {
        return this.get('memberships').first().isEnrolled();
      } else {
        return _(this.getEnrolledSessions()).any(function (session) {
          return session.get('active');
        });
      }
    }

    return false;
  },

  getEnrolledSessions() {
    return this.get('memberships').getEnrolledSessions();
  },

  getVCSessions() {
    if (this.get('details.sessions')) {
      return this.get('details.sessions').getVCSessions();
    } else {
      return [];
    }
  },

  getUpcomingVCSessions() {
    return new Sessions(
      this.getVCSessions().filter(function (session: $TSFixMe) {
        // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        const isEnrolledInVCSession = this.isEnrolledInVCSession(session);
        const canEnrollInVCSession =
          // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
          (session.get('status') === 1 || this.isEnrolledInSession(session)) &&
          !!session.get('vcDetails.vcRegistrationOpen');
        return isEnrolledInVCSession || canEnrollInVCSession;
      }, this)
    );
  },

  isEnrolledInVCSession(session: $TSFixMe) {
    if (this.get('memberships')) {
      return !this.get('memberships').getMembershipsForVCSession(session).isEmpty();
    } else {
      return false;
    }
  },

  isEnrolledInSession(session: $TSFixMe) {
    const memberships = this.get('memberships');
    if (memberships) {
      return !memberships.getMembershipsForSession(session).isEmpty();
    } else {
      return false;
    }
  },

  isFlaggedForNoPayment() {
    let flaggedSpecialization = false;
    const flaggedCourse = _(jsonConstants.topicsFlaggedForNoPayment).contains(this.get('slug'));

    const specialization = this.getFirstSpecialization();
    if (specialization) {
      flaggedSpecialization = specialization.isFlaggedForNoPayment();
    }

    return flaggedCourse || flaggedSpecialization;
  },

  /**
   * @param {boolean} [vc] - Whether or not you want to see if they passed a VC session.
   */
  hasPassed(vc: $TSFixMe) {
    return (
      this.has('memberships') &&
      this.get('memberships').any(function (membership: $TSFixMe) {
        return membership.hasPassed(vc);
      })
    );
  },

  getPassedMembership() {
    return this.get('memberships').find(function (membership: $TSFixMe) {
      return membership.hasPassed(true);
    });
  },

  courseLengthInWeeks() {
    return this.get('details.upcomingSession.durationWeeks');
  },

  getRealInstructors() {
    // Filter out instructors who don't have a name (and shouldn't be displayed)
    return this.get('instructors').reject(function (instructor: $TSFixMe) {
      return instructor.getFullName().trim() === '';
    });
  },

  getFirstSpecialization() {
    if (this.isOnDemand()) {
      return this.get('s12ns') && this.get('s12ns').first();
    } else {
      return this.get('specializations') && this.get('specializations').first();
    }
  },

  isPreEnroll() {
    return this.get('courseStatus') === 'preenroll';
  },

  isOnDemandPreEnroll() {
    return this.isOnDemand() && this.isPreEnroll();
  },

  isLaunched() {
    return this.get('courseStatus') === 'launched';
  },

  getPlannedLaunchDate() {
    return this.get('v2Details.plannedLaunchDate');
  },

  isClosedCourse() {
    const premiumExperienceVariant = this.get('premiumExperienceVariant');
    return premiumExperienceVariant && premiumExperienceVariant === 'PremiumCourse';
  },
});

Course.NOT_FOUND = new Course('notfound');

export default Course;

export const { NOT_FOUND } = Course;
