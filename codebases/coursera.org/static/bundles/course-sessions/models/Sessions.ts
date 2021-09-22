import _ from 'lodash';
import moment from 'moment-timezone';
import CatalogModel from 'bundles/catalogP/models/catalogModel';

class Session {
  static formatDate(time: $TSFixMe) {
    return moment(time).format('MMMM D');
  }

  static formatDateShort(time: $TSFixMe) {
    return moment(time).format('MMM D');
  }

  constructor(props: $TSFixMe) {
    _.extend(this, props);
  }

  getId() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Session'.
    return this.id;
  }

  isOpenForEnrollment() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'enrollmentEndedAt' does not exist on typ... Remove this comment to see the full error message
    return moment().isBefore(this.enrollmentEndedAt);
  }

  isUpcoming() {
    return moment().isBefore(this.getStartMoment());
  }

  hasStarted() {
    return moment().isAfter(this.getStartMoment());
  }

  hasEnded() {
    return moment().isAfter(this.getEndMoment());
  }

  isActive() {
    return this.hasStarted() && !this.hasEnded();
  }

  getStartMoment() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'startedAt' does not exist on type 'Sessi... Remove this comment to see the full error message
    return moment(this.startedAt);
  }

  getEndMoment() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'endedAt' does not exist on type 'Session... Remove this comment to see the full error message
    return moment(this.endedAt);
  }

  getStartDate() {
    return Session.formatDate(this.getStartMoment());
  }

  getEndDate() {
    return Session.formatDate(this.getEndMoment());
  }

  getShortStartDate() {
    return Session.formatDateShort(this.getStartMoment());
  }

  getShortEndDate() {
    return Session.formatDateShort(this.getEndMoment());
  }

  getShortEnrollmentEndDate() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'enrollmentEndedAt' does not exist on typ... Remove this comment to see the full error message
    return Session.formatDateShort(moment(this.enrollmentEndedAt));
  }

  getSessionDates() {
    return `${this.getStartDate()} – ${this.getEndDate()}`;
  }

  getShortSessionDates() {
    return `${this.getShortStartDate()} – ${this.getShortEndDate()}`;
  }

  getEnrollmentDaysLeft() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'enrollmentEndedAt' does not exist on typ... Remove this comment to see the full error message
    return moment(this.enrollmentEndedAt).diff(moment(), 'days');
  }

  getDaysLeftToStart() {
    return this.getStartMoment().diff(moment(), 'days');
  }

  get(key: $TSFixMe) {
    // @ts-ignore ts-migrate(7052) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    return this[key];
  }

  set(key: $TSFixMe, value: $TSFixMe) {
    // @ts-ignore ts-migrate(7052) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    this[key] = value;
  }

  unset(key: $TSFixMe) {
    // @ts-ignore ts-migrate(7052) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
    delete this[key];
  }
}

class Sessions {
  constructor(models: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'models' does not exist on type 'Sessions... Remove this comment to see the full error message
    this.models = {};
    if (models && models.length > 0) {
      this.add(models);
    }
  }

  add(models: $TSFixMe) {
    models
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'model' does not exist on type 'Sessions'... Remove this comment to see the full error message
      .map((json) => new this.model(json))
      .forEach((model: $TSFixMe) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'models' does not exist on type 'Sessions... Remove this comment to see the full error message
        this.models[model.id] = model;
      });
  }

  each() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'models' does not exist on type 'Sessions... Remove this comment to see the full error message
    Array.prototype.forEach.apply(_.values(this.models), arguments);
  }

  get(id: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'models' does not exist on type 'Sessions... Remove this comment to see the full error message
    return this.models[id];
  }

  getEnrollableSessions() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'models' does not exist on type 'Sessions... Remove this comment to see the full error message
    return _.values(this.models)
      .filter(({ enrollmentEndedAt }) => {
        return moment().isBefore(enrollmentEndedAt);
      })
      .sort((firstSession, secondSession) => {
        return moment(firstSession.startedAt).diff(secondSession.startedAt);
      });
  }

  getLastSession() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'models' does not exist on type 'Sessions... Remove this comment to see the full error message
    const sortedSessions = _.values(this.models).sort((firstSession, secondSession) => {
      return moment(firstSession.startedAt).diff(secondSession.startedAt);
    });

    // TODO(jon): change this model to backbone where we have helpers for things like this.
    return sortedSessions[sortedSessions.length - 1];
  }

  getFollowingSession() {
    const [, /* ignore first session */ followingSession] = this.getEnrollableSessions();
    return followingSession;
  }

  getUpcomingSession() {
    const [upcomingSession] = this.getEnrollableSessions();
    return upcomingSession;
  }

  getSessionWithLatestEnrollment() {
    return _.last(
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'models' does not exist on type 'Sessions... Remove this comment to see the full error message
      _.filter(_.values(this.models), (session) => {
        return session.memberships && session.memberships.size() > 0;
      }).sort((firstSession, secondSession) => {
        return moment(firstSession.startedAt).diff(secondSession.startedAt);
      })
    );
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'model' does not exist on type 'Sessions'... Remove this comment to see the full error message
Sessions.prototype.model = Session;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'resourceName' does not exist on type 'Se... Remove this comment to see the full error message
Sessions.prototype.resourceName = 'onDemandSessions';

_.extend(Session.prototype, _.pick(CatalogModel.prototype, 'getIncludeAttribute', 'getIncludeResource'));
// @ts-expect-error ts-migrate(2339) FIXME: Property 'resourceName' does not exist on type 'Se... Remove this comment to see the full error message
Session.prototype.resourceName = 'onDemandSessions.v1';
// @ts-expect-error ts-migrate(2339) FIXME: Property 'includes' does not exist on type 'Sessio... Remove this comment to see the full error message
Session.prototype.includes = {
  memberships: {
    resource: 'onDemandSessionMemberships.v1',
    attribute: 'memberships',
  },
};

export { Session, Sessions };
