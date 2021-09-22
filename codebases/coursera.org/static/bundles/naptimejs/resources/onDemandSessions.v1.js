import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import moment from 'moment-timezone';
import { TIME_ZONE } from 'bundles/author-common/constants/TimeFormat';
import { LONG_DATE_ONLY_DISPLAY, SHORT_MONTH_DAY_DISPLAY, formatDateTimeDisplay } from 'js/utils/DateTimeUtils';
import _ from 'lodash';
import NaptimeResource from './NaptimeResource';

class OnDemandSessions extends NaptimeResource {
  static RESOURCE_NAME = 'onDemandSessions.v1';

  static getEnrollableSessions(sessions) {
    return sessions
      .filter(({ enrollmentEndedAt }) => moment().isBefore(enrollmentEndedAt))
      .sort((firstSession, secondSession) => moment(firstSession.startedAt).diff(secondSession.startedAt));
  }

  static getUpcomingSession(sessions) {
    const [upcomingSession] = OnDemandSessions.getEnrollableSessions(sessions);
    return upcomingSession;
  }

  static formatDateShort(time) {
    return formatDateTimeDisplay(time, SHORT_MONTH_DAY_DISPLAY);
  }

  get displayName() {
    const startDate = formatDateTimeDisplay(this.startedAt, LONG_DATE_ONLY_DISPLAY);
    const endDate = formatDateTimeDisplay(this.endedAt, LONG_DATE_ONLY_DISPLAY);
    return `${startDate} - ${endDate}`;
  }

  @requireFields('itemDeadlines')
  getItemDeadline(itemId, moduleId = null) {
    const itemDeadline = this.itemDeadlines && this.itemDeadlines[itemId];
    if (itemDeadline) {
      return itemDeadline;
    } else if (this.moduleDeadlines && moduleId) {
      const module = _.find(this.moduleDeadlines, (m) => m.moduleId === moduleId);
      return module && module.deadline;
    } else {
      return null;
    }
  }

  @requireFields('startedAt')
  get startMoment() {
    return moment(this.startedAt);
  }

  @requireFields('endedAt')
  get endMoment() {
    return moment(this.endedAt);
  }

  @requireFields('startedAt')
  get hasStarted() {
    return moment().isAfter(this.startMoment);
  }

  @requireFields('startedAt')
  get shortStartDate() {
    return OnDemandSessions.formatDateShort(this.startMoment);
  }

  @requireFields('endedAt')
  get shortEndDate() {
    return OnDemandSessions.formatDateShort(this.endMoment);
  }

  /**
   * Returns the session date range as a string (ex: Jan 1 - Feb 15)
   */
  @requireFields('startedAt', 'endedAt')
  get dateRangeString() {
    return `${this.shortStartDate} – ${this.shortEndDate}`;
  }
}

export default OnDemandSessions;
