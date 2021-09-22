import mapValues from 'lodash/mapValues';
import type { SessionConstructorProps } from 'bundles/author-common/models/Session';
import Session from 'bundles/author-common/models/Session';
import type { CmlContent } from 'bundles/cml/types/Content';
import type { BranchStatusValues } from 'bundles/author-branches/constants';

export type AuthoringCourseBranchConstructorProps = {
  id: string;
  name: string;
  courseId: string;
  associatedSessions: Record<string, SessionConstructorProps>;
  branchStatus?: BranchStatusValues;
  changesDescription?: CmlContent;
  courseBranchId?: string;
  createdAt?: number;
  launchedAt?: number;
  isPrivate?: boolean;
  listed?: boolean;
};

/**
 * Defines the model for an AuthoringCourseBranch
 */
class AuthoringCourseBranch {
  id: string;

  name: string;

  courseId: string;

  associatedSessions: Record<string, Session>;

  branchStatus?: BranchStatusValues;

  changesDescription?: CmlContent;

  courseBranchId?: string;

  createdAt?: number;

  launchedAt?: number;

  isPrivate?: boolean;

  listed?: boolean;

  constructor({
    associatedSessions,
    branchStatus,
    changesDescription,
    courseBranchId,
    courseId,
    createdAt,
    launchedAt,
    id,
    isPrivate,
    listed,
    name,
  }: AuthoringCourseBranchConstructorProps) {
    this.associatedSessions = mapValues(associatedSessions, (associatedSession) => new Session(associatedSession));
    this.branchStatus = branchStatus;
    this.changesDescription = changesDescription;
    this.courseBranchId = courseBranchId;
    this.courseId = courseId;
    this.createdAt = createdAt;
    this.launchedAt = launchedAt;
    this.id = id;
    this.isPrivate = isPrivate;
    this.listed = listed;
    this.name = name;
  }
}

export default AuthoringCourseBranch;
