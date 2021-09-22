import _ from 'lodash';

import moment from 'moment-timezone';
import { formatDateTimeDisplay, momentWithUserTimezone, LONG_DATE_ONLY_NO_YEAR_DISPLAY } from 'js/utils/DateTimeUtils';
import user from 'js/lib/user';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { Session } from 'bundles/course-sessions/models/Sessions';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { isSessionsEnabled } from 'bundles/course-sessions/utils/experiment';

const TIMEZONE_STRING = 'America/Los_Angeles';

const SERIALIZED_PROPS: (keyof SessionStore$DehydratedState)[] = [
  'loaded',
  'sessionsEnabled',
  'session',
  'enrollableSession',
  'upcomingSession',
  'followingSession',
  'allSessions',
  'sessionsCourse',
  'membership',
];

type SessionMembership = {
  createdAt: number;
  id: string;
  sessionId: string;
  userId: number;
};

type SessionDeadline = {
  deadline: number;
  moduleId: string;
};

export type SessionType = {
  branchId: string;
  courseId: string;
  endedAt: number;
  enrollmentEndedAt: number;
  id: string;
  isPrivate: boolean;
  membership: SessionMembership;
  moduleDeadlines: Array<SessionDeadline>;
  startedAt: number;
  sessionTypeMetadata?: {
    typeName: string;
    definition: {
      degreeId: string;
    };
  };
};

type SessionStore$DehydratedState = {
  loaded: boolean;
  sessionsEnabled: boolean;
  session: SessionType;
  enrollableSession: SessionType;
  upcomingSession: SessionType;
  followingSession: SessionType;
  allSessions: Array<SessionType>;
  sessionsCourse: boolean;
  membership: SessionMembership;
};

class SessionStore extends BaseStore implements SessionStore$DehydratedState {
  static storeName = 'SessionStore';

  static handlers = {
    LOAD_SESSION: 'handleLoadSession',

    LOAD_UPCOMING_AND_FOLLOWING_SESSIONS: 'handleLoadUpcomingAndFollowingSessions',

    LOAD_COURSE_MATERIALS: 'handleLoadCourseMaterials',

    LOAD_ALL_SESSIONS: 'handleLoadAllSessions',
  };

  handleLoadSession = (session: SessionType) => {
    this.session = session;
    this.membership = session && session.membership;

    if (!this.loaded) {
      this.sessionsEnabled = !!session;
      this.loaded = true;
    }

    this.emitChange();
  };

  handleLoadUpcomingAndFollowingSessions = ({
    upcomingSession,
    followingSession,
  }: {
    upcomingSession: SessionType;
    followingSession: SessionType;
  }) => {
    if (upcomingSession) {
      this.upcomingSession = upcomingSession;
    }

    if (followingSession) {
      this.followingSession = followingSession;
    }

    this.emitChange();
  };

  handleLoadCourseMaterials = ({ courseMaterials }: { courseMaterials: any }) => {
    const userId = user.get().id;
    const course = courseMaterials.get('course');

    this.sessionsCourse = !!course.hasSessions();
    this.emitChange();

    if (!this.loaded) {
      isSessionsEnabled(userId, course.get('id'), course.get('slug'))
        .then((sessionsEnabled: $TSFixMe /* TODO: type isSessionsEnabled */) => {
          this.sessionsEnabled = sessionsEnabled;
          if (!this.sessionsEnabled) {
            this.loaded = true;
          }
          this.emitChange();
        })
        .catch(() => {
          this.sessionsEnabled = false;
          this.loaded = true;
          this.emitChange();
        })
        .done();
    }
  };

  handleLoadAllSessions = (allSessions: Array<SessionType>) => {
    this.allSessions = allSessions;
    this.emitChange();
  };

  loaded = false;

  sessionsEnabled = false;

  session!: SessionType;

  upcomingSession!: SessionType;

  followingSession!: SessionType;

  enrollableSession!: SessionType;

  allSessions: Array<SessionType> = [];

  sessionsCourse = false;

  membership!: SessionMembership;

  dehydrate(): SessionStore$DehydratedState {
    return _.pick(this, ...SERIALIZED_PROPS);
  }

  rehydrate(state: SessionStore$DehydratedState) {
    Object.assign(this, _.pick(state, ...SERIALIZED_PROPS));
  }

  hasLoaded(): boolean {
    return this.loaded;
  }

  isSessionsEnabled(): boolean {
    return this.sessionsEnabled;
  }

  getSession(): SessionType {
    return this.session;
  }

  getAllSessions(): Array<SessionType> {
    return this.allSessions;
  }

  getSessionId(): string {
    return this.session && this.session.id;
  }

  isSessionsCourse(): boolean {
    return this.sessionsCourse;
  }

  isSessionPrivate(): boolean {
    return this.session && this.session.isPrivate;
  }

  /**
   * @returns True if the user is logged out, the session has not yet started, or the user has not enrolled.
   * False if the user has full access to the course.
   */
  isPreviewMode(): boolean {
    return (
      (this.isSessionsCourse() && !user.isAuthenticatedUser()) ||
      (this.isSessionsEnabled() && (this.isUpcoming() || !this.isEnrolled()))
    );
  }

  isEnrolled(): boolean {
    return !!this.membership;
  }

  isSessionAvailable(): boolean {
    return !!this.getSession();
  }

  /**
   * @returns True if the learner sees a session that has not yet started,
   * false if the session is currently running or there are no available sessions.
   * Note that this does NOT tell us whether the learner can access content,
   * since that also depends on their enrollment.
   */
  isUpcoming(): boolean {
    if (this.isSessionsEnabled() && this.isSessionAvailable()) {
      const startTime = this.getStartTime();
      return !!moment().isBefore(startTime);
    } else {
      return false;
    }
  }

  hasStarted(): boolean {
    const startTime = this.getStartTime();
    if (startTime) {
      return moment().isAfter(startTime);
    } else {
      return false;
    }
  }

  hasEnded(): boolean {
    const endTime = this.getEndTime();
    if (endTime) {
      return moment().isAfter(endTime);
    } else {
      return false;
    }
  }

  isDegreeSession(): boolean {
    if (this.session && this.session.sessionTypeMetadata) {
      return this.session.sessionTypeMetadata.typeName === 'degreeSession';
    } else {
      return false;
    }
  }

  getEnrolledDate() {
    if (this.membership) {
      return this.membership.createdAt ? this.membership.createdAt : null;
    }
    return null;
  }

  getStartTime() {
    return this.session && this.session.startedAt;
  }

  getEndTime() {
    return this.session && momentWithUserTimezone(this.session.endedAt);
  }

  formatDate(time: number) {
    return formatDateTimeDisplay(time, LONG_DATE_ONLY_NO_YEAR_DISPLAY);
  }

  getStartDate() {
    return this.session && this.formatDate(this.session.startedAt);
  }

  getEndDate() {
    return this.session && this.formatDate(this.session.endedAt);
  }

  getEnrollmentEndDate() {
    return this.session && this.formatDate(this.session.enrollmentEndedAt);
  }

  getEnrollmentDaysLeft() {
    return this.getEnrollmentEndDate() && moment(this.getEnrollmentEndDate()).diff(moment(), 'days');
  }

  getSessionDates(): string {
    return `${this.getStartDate()} – ${this.getEndDate()}`;
  }

  getNumWeeks(): number {
    return moment(this.getEndTime()).diff(this.getStartTime(), 'weeks');
  }

  getTimeUntilStart() {
    return moment(this.getStartTime()).fromNow(true);
  }

  getCurrentWeek(): number {
    return moment().diff(this.getStartTime(), 'weeks') + 1;
  }

  isWeekLocked(weekNumber: number, isRestrictedCapstone: boolean): boolean {
    return this.isPreviewMode() && (isRestrictedCapstone || weekNumber > 1);
  }

  /**
   * @returns {Session} - The session currently open for enrollment. Note that this returns
   * an instance of the Session class, rather than the session data only.
   */
  getEnrollableSession(): SessionType | null {
    const { enrollableSession, session } = this;

    if (enrollableSession && session && moment(session.startedAt).isBefore(enrollableSession.startedAt)) {
      // @ts-expect-error ts-migrate(2740) FIXME: Type 'Session' is missing the following properties... Remove this comment to see the full error message
      return new Session(enrollableSession);
    }

    return null;
  }

  /**
   * @returns {Session} - The next session to open after the currently enrollable session closes.
   * Note that this returns an instance of the Session class, rather than the session data only.
   */
  getFollowingSession(): SessionType | null {
    if (this.followingSession) {
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'Session' is not assignable to type 'SessionT... Remove this comment to see the full error message
      return new Session(this.followingSession);
    }

    return null;
  }

  getBranchId(): string {
    return this.session && this.session.branchId;
  }
}

export default SessionStore;
