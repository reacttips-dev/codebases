import moment from 'moment';
import Q from 'q';
import _ from 'underscore';
import CatalogModel from 'bundles/catalogP/models/catalogModel';
import Specialization from 'bundles/catalogP/models/specialization';
import API from 'bundles/phoenix/lib/apiWrapper';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import userIdentity from 'bundles/phoenix/template/models/userIdentity';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/j... Remove this comment to see the full error message
import constants from 'js/json/constants';

const { chineseOnlyTopicToCourses } = constants;

const now = function () {
  return moment.utc();
};

const Session = CatalogModel.extend({
  // @ts-expect-error ts-migrate(2350) FIXME: Only a void function can be called with the 'new' ... Remove this comment to see the full error message
  api: new API('/api/enrollments.v1'),

  // @ts-expect-error ts-migrate(2350) FIXME: Only a void function can be called with the 'new' ... Remove this comment to see the full error message
  unenrollApi: new API('maestro/api/course/unenroll'),

  resourceName: 'v1Sessions.v1',

  urlPath: 'sessions',

  includes: {
    instructors: {
      resource: 'instructors.v1',
      attribute: 'instructorIds',
    },
    vcDetails: {
      resource: 'v1VcDetails.v1',
      attribute: 'vcDetails',
    },
  },

  getLink() {
    return this.get('homeLink');
  },

  getName() {
    // Deduce session name from the course home page URL since it's not stored
    // anywhere else.
    const homeLink = this.get('homeLink') ? this.get('homeLink') : '';
    return homeLink.replace(/http.*coursera.org\//, '').replace('/', '');
  },

  hasStarted() {
    const startMoment = this.getStartMoment();
    return startMoment && startMoment.isBefore(now());
  },

  getStartMoment() {
    // NOTE: js/moment month ranges 0-11, our start month has a range of 1-12
    // NOTE: some sessions just have startMonth so we default startDay to 1
    if (this.get('startYear') && this.get('startMonth')) {
      return moment([this.get('startYear'), this.get('startMonth') - 1, this.get('startDay') || 1]);
    }
  },

  getStartString() {
    const startMoment = this.getStartMoment();
    if (!startMoment) {
      // Class is probably inactive or old
      return 'No Start Date';
    }

    if (this.get('startDay') !== undefined) {
      return startMoment.format('LL');
    } else {
      return startMoment.format('MMMM YYYY');
    }
  },

  setStartMoment(momentObj: $TSFixMe, options: $TSFixMe) {
    // NOTE: js/moment month ranges 1-11, our start month has a range of 1-12
    this.set(
      {
        startYear: momentObj.year(),
        startMonth: momentObj.month() + 1,
        startDay: momentObj.date(),
      },
      options
    );
  },

  getStartMomentFromToday() {
    const diff = this.getStartMoment().diff(now());
    return moment.duration(diff);
  },

  /**
   * Exists for the fully translated course experience experiment.
   */
  isChineseOnly() {
    // When removing this, please remove the identical function from js/models/courses
    // as well as removing all usages.
    const chineseOnlySessionIds = _(chineseOnlyTopicToCourses).chain().values().flatten().value();

    return _(chineseOnlySessionIds).contains(this.get('id'));
  },

  getDuration() {
    return this.get('durationString');
  },

  getDurationMoment() {
    // durationString is in the format of "<number> <unit>"
    const parts = (this.getDuration() || '').split(' ');
    return moment.duration(parseInt(parts[0], 10), parts[1]);
  },

  getDurationDays() {
    return Math.floor(this.getDurationMoment().asDays());
  },

  getDurationWeeks() {
    return Math.floor(this.getDurationMoment().asDays() / 7);
  },

  getEndMoment() {
    if (this.get('dbEndDate')) {
      return moment(this.get('dbEndDate'));
    } else {
      const startMoment = this.getStartMoment();
      return startMoment && startMoment.add(this.getDurationMoment());
    }
  },

  getEndString() {
    const endMoment = this.getEndMoment();
    return endMoment && endMoment.format('LL');
  },

  hasEnded() {
    const endMoment = this.getEndMoment();
    if (endMoment) {
      return now().isAfter(endMoment.clone().utc().endOf('day'));
    }
  },

  eligibleForSignatureTrack() {
    return this.get('hasSigTrack');
  },

  isEligibleForVC() {
    return this.eligibleForSignatureTrack();
    // Todo(jon): restore this when vcDetails doesn't get surfaced for courses without VC
    // return this.get('vcDetails') !== undefined;
  },

  /**
   * Enroll in a particular session
   */
  enroll() {
    return Q(
      this.api.put(userIdentity.get('id') + '~' + this.get('id'), {
        data: '{}',
        contentType: 'application/json',
      })
    );
  },

  enrollWithVoucher(bulkVoucherId: $TSFixMe) {
    return Specialization.enrollWithVoucher(this.get('id'), bulkVoucherId);
  },

  unenroll() {
    return Q(this.unenrollApi.post('', { data: { 'course-id': this.get('id') } }));
  },
});

export default Session;
