import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import moment from 'moment';
import NaptimeResource from './NaptimeResource';

const formatDateShort = (time) => {
  return moment(time).local().format('MMM D');
};

class OnDemandLearnerSessions extends NaptimeResource {
  static RESOURCE_NAME = 'onDemandLearnerSessions.v1';

  /**
   * Returns the start date as a string (ex: Jan 1)
   */
  @requireFields('startsAt')
  get startDateString() {
    return formatDateShort(this.startsAt);
  }

  /**
   * Returns the end date as a string (ex: Jan 1)
   */
  @requireFields('endsAt')
  get endDateString() {
    return formatDateShort(this.endsAt);
  }

  /**
   * Returns the enrollment start date as a string (ex: Jan 1)
   */
  @requireFields('enrollmentStartsAt')
  get enrollmentStartsAtString() {
    return formatDateShort(this.enrollmentStartsAt);
  }

  /**
   * Returns the session date range as a string (ex: Jan 1 - Feb 15)
   */
  @requireFields('startsAt', 'endsAt')
  get dateRangeString() {
    return `${this.startDateString} – ${this.endDateString}`;
  }

  /**
   * Returns boolean based on if session has started or not
   */
  @requireFields('startsAt')
  get hasStarted() {
    return moment().isAfter(moment(this.startsAt));
  }

  /**
   * Returns true if enrollment has ended
   */
  @requireFields('enrollmentEndsAt')
  get enrollmentEnded() {
    return moment().isAfter(moment(this.enrollmentEndsAt));
  }

  /**
   * Returns true if enrollment has started
   */
  @requireFields('enrollmentStartsAt')
  get enrollmentStarted() {
    return moment().isAfter(moment(this.enrollmentStartsAt));
  }

  /**
   * Return is a session has ended
   */
  @requireFields('endsAt')
  get isEnded() {
    return this.endsAt < new Date().getTime();
  }

  /**
   * Return current week number
   * If current time is not in the session time range, return -1
   */
  @requireFields('startsAt', 'endsAt')
  get currentWeek() {
    const now = new Date().getTime();
    if (now >= this.startsAt && now <= this.endsAt) {
      return Math.ceil(moment.duration(now - this.startsAt).asWeeks());
    }
    return -1;
  }
}

export default OnDemandLearnerSessions;
