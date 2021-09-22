/**
 * Store for managing app level data
 * @type {FluxibleStore}
 */
import pick from 'lodash/pick';

import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
import Session from 'bundles/author-common/models/Session';
import type { SessionConstructorProps } from 'bundles/author-common/models/Session';
import AuthoringCourse from 'bundles/author-common/models/AuthoringCourse';
import type { AuthoringCourseRaw } from 'bundles/author-common/models/AuthoringCourse';

import AuthoringCourseBranch from 'bundles/author-common/models/AuthoringCourseBranch';
import type { AuthoringCourseBranchConstructorProps } from 'bundles/author-common/models/AuthoringCourseBranch';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { isLaunched } from 'bundles/authoring/branches/utils/BranchUtils';
import { CourseType } from 'bundles/naptimejs/resources/courseTypeMetadata.v1';
import type { CourseTypeMetadataResponse as CourseTypeMetadata } from 'bundles/naptimejs/resources/courseTypeMetadata.v1';
import { getCourseCatalogType } from 'bundles/teach-course/lib/CourseUtils';

const SERIALIZED_PROPS: (keyof TeachAppStore$DehydratedState)[] = [
  'course',
  'courseLoadError',
  'courseRole',
  'sessions',
  'branches',
  'unlistedBranches',
  'courseTypeMetadata',
  'partnerTypeMetadata',
];

// metadata about the partner(s) associated with this course
export type PartnerTypeMetadata = {
  isC4CPartner: boolean;
  isPrivateAuthoringPartner: boolean;
};

type TeachAppStore$DehydratedState = {
  course: AuthoringCourse | null;
  courseLoadError?: Error;
  courseRole: string;
  sessions: Array<Session>;
  branches: Array<AuthoringCourseBranch>;
  unlistedBranches: Array<AuthoringCourseBranch>;
  courseTypeMetadata: CourseTypeMetadata | null;
  partnerTypeMetadata: PartnerTypeMetadata;
};

class TeachAppStore extends BaseStore implements TeachAppStore$DehydratedState {
  static storeName = 'TeachAppStore';

  course: AuthoringCourse | null = null;

  courseLoadError?: Error;

  courseRole = 'BROWSER';

  sessions: Array<Session> = [];

  branches: Array<AuthoringCourseBranch> = [];

  unlistedBranches: Array<AuthoringCourseBranch> = [];

  courseTypeMetadata: CourseTypeMetadata | null = null;

  partnerTypeMetadata: PartnerTypeMetadata = {
    isC4CPartner: false,
    isPrivateAuthoringPartner: false,
  };

  dehydrate() {
    return pick(this, ...SERIALIZED_PROPS);
  }

  rehydrate(state: TeachAppStore$DehydratedState) {
    Object.assign(this, pick(state, ...SERIALIZED_PROPS));

    // recreate es6 models on client
    this.course = state.course ? new AuthoringCourse(state.course as AuthoringCourseRaw) : null;

    if (state.sessions.length > 0) {
      this.sessions = state.sessions.map((session) => new Session(session));
    }

    if (state.branches.length > 0) {
      this.branches = state.branches.map((branch) => new AuthoringCourseBranch(branch));
    }

    if (state.unlistedBranches.length > 0) {
      this.unlistedBranches = state.unlistedBranches.map((branch) => new AuthoringCourseBranch(branch));
    }

    if (state.courseTypeMetadata) {
      this.courseTypeMetadata = state.courseTypeMetadata;
    }

    if (state.partnerTypeMetadata) {
      this.partnerTypeMetadata = state.partnerTypeMetadata;
    }
  }

  getCourse() {
    return this.course;
  }

  getCourseLoadError() {
    return this.courseLoadError;
  }

  getCourseRole() {
    return this.courseRole;
  }

  getSessions() {
    return this.sessions;
  }

  getBranches() {
    return this.branches;
  }

  getUnlistedBranches() {
    return this.unlistedBranches;
  }

  getLaunchedBranches() {
    return this.branches.filter((branch) => isLaunched(branch.branchStatus, branch.isPrivate));
  }

  hasPrivateBranch() {
    return !!this.branches.find((branch) => branch.isPrivate);
  }

  getBranchForSession(sessionId: string) {
    return this.branches.find((branch) => !!branch.associatedSessions[sessionId]);
  }

  getCourseTypeMetadata() {
    return this.courseTypeMetadata;
  }

  getIsRhymeCourseType() {
    return this.getCourseTypeMetadata()?.courseTypeMetadata?.typeName === CourseType.RHYME_PROJECT;
  }

  getPartnerTypeMetadata() {
    return this.partnerTypeMetadata;
  }

  getFirstPartnerId() {
    return this.course?.partnerIds?.[0];
  }

  getCatalogType() {
    // whether the course is available in the public/enterprise catalog or is private invite-only.

    const course = this.getCourse();
    if (!course) {
      return null;
    }

    return getCourseCatalogType(course);
  }

  static handlers = {
    RECEIVE_COURSE: 'receiveCourse',
    COURSE_LOAD_ERROR: 'handleCourseLoadError',
    RECEIVE_COURSE_SETTINGS: 'receiveCourseSettings',
    RECEIVE_MEMBERSHIP_FOR_COURSE: 'receiveMembershipForCourse',
    RECEIVE_SESSIONS_FOR_COURSE: 'receiveSessionsForCourse',
    RECEIVE_BRANCHES_FOR_COURSE: 'receiveBranchesForCourse',
    RECEIVE_COURSE_TYPE_METADATA: 'receiveCourseTypeMetadata',
    RECEIVE_PARTNER_TYPE_METADATA: 'receivePartnerTypeMetadata',
  };

  receiveCourse(course: AuthoringCourseRaw) {
    this.course = new AuthoringCourse(course);
    this.emitChange();
  }

  handleCourseLoadError(error: Error) {
    this.course = null;
    this.courseLoadError = error;
    this.emitChange();
  }

  receiveMembershipForCourse(courseRole: string) {
    this.courseRole = courseRole;
    this.emitChange();
  }

  receiveSessionsForCourse(sessions: Array<SessionConstructorProps>) {
    this.sessions = sessions.map((session) => new Session(session));
    this.emitChange();
  }

  receiveBranchesForCourse(branches: Array<AuthoringCourseBranchConstructorProps>) {
    const allBranches = branches.map((branch) => new AuthoringCourseBranch(branch));

    this.branches = allBranches.filter((branch) => branch.listed);
    this.unlistedBranches = allBranches.filter((branch) => !branch.listed);
    this.emitChange();
  }

  receiveCourseTypeMetadata(courseTypeMetadata: CourseTypeMetadata) {
    this.courseTypeMetadata = courseTypeMetadata;
    this.emitChange();
  }

  receiveCourseSettings(courseSettings: AuthoringCourseRaw) {
    this.course = new AuthoringCourse({ ...this.course, ...courseSettings } as AuthoringCourseRaw);
    this.emitChange();
  }

  receivePartnerTypeMetadata(partnerTypeMetadata: PartnerTypeMetadata | void) {
    if (partnerTypeMetadata) {
      this.partnerTypeMetadata = partnerTypeMetadata;
      this.emitChange();
    }
  }
}

export default TeachAppStore;
