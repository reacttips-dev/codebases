// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProgramEnrollmentsV2 from 'bundles/naptimejs/resources/programEnrollments.v2';

import { checkSessionsV2Epic } from 'bundles/enroll-course/lib/sessionsV2ExperimentUtils';

import { ACTIONS } from 'bundles/program-common/constants/ProgramActionConstants';
import type { InjectedNaptime } from 'bundles/naptimejs';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type EnterpriseProgramsV1 from 'bundles/naptimejs/resources/enterprisePrograms.v1';

import Q from 'q';

type Query = {
  programId: string;
  userId: number;
  courseId?: string;
  s12nId?: string;
  collectionId?: string;
};

type ProgramActionApiManagerOptions = {
  programId: string;
  userId: number;
  naptime: InjectedNaptime;
};

class ProgramActionApiManager {
  _programId: string;

  _userId: number;

  _naptime: InjectedNaptime;

  _program: EnterpriseProgramsV1;

  constructor({ programId, userId, naptime }: ProgramActionApiManagerOptions) {
    this._programId = programId;
    this._userId = userId;
    this._naptime = naptime;
  }

  set program(program: EnterpriseProgramsV1) {
    this._program = program;
  }

  //
  // resources is an array of resource names to refresh;
  // see: program-common/constants/ProgramActionConstants.ts; REFRESH_RESOURCE
  //
  getRefreshDataPromise(resources: Array<string>) {
    return this._naptime.refreshData({ resources });
  }

  _getQuery({
    courseId,
    s12nId,
    collectionId,
  }: {
    courseId?: string | null;
    s12nId?: string | null;
    collectionId?: string | null;
  }) {
    const query: Query = {
      programId: this._programId,
      userId: this._userId,
    };
    if (courseId) query.courseId = courseId;
    if (s12nId) query.s12nId = s12nId;
    if (collectionId) query.collectionId = collectionId;
    return query;
  }

  getEnrollInCoursePromise({ courseId, collectionId }: { courseId: string | null; collectionId: string | null }) {
    const query = this._getQuery({ courseId, collectionId });
    return checkSessionsV2Epic(courseId || '').then(() => {
      return this._naptime.executeMutation(ProgramEnrollmentsV2.action(ACTIONS.enrollInCourse, {}, query));
    });
  }

  getUnenrollFromCoursePromise({ courseId, collectionId }: { courseId: string | null; collectionId: string | null }) {
    const query = this._getQuery({ courseId, collectionId });
    return this._naptime.executeMutation(ProgramEnrollmentsV2.action(ACTIONS.unenrollFromCourse, {}, query));
  }

  getUpgradeS12nPromise({ s12nId }: { s12nId: string }) {
    const query = { s12nId };
    return this._naptime.executeMutation(ProgramEnrollmentsV2.action(ACTIONS.upgradeS12n, {}, query));
  }

  getEnrollInS12nPromise({
    firstCourseId,
    s12nId,
    collectionId,
  }: {
    firstCourseId: string | null;
    s12nId: string | null;
    collectionId: string | null;
  }) {
    const query = this._getQuery({ s12nId, collectionId });
    const maybeCheckSessionsV2 = firstCourseId != null ? checkSessionsV2Epic(firstCourseId || '') : Q.resolve();
    return maybeCheckSessionsV2.then(() => {
      return this._naptime.executeMutation(ProgramEnrollmentsV2.action(ACTIONS.enrollInS12n, {}, query));
    });
  }

  getUnenrollFromS12nPromise({ s12nId, collectionId }: { s12nId: string | null; collectionId: string | null }) {
    const query = this._getQuery({ s12nId, collectionId });
    return this._naptime.executeMutation(ProgramEnrollmentsV2.action(ACTIONS.unenrollFromS12n, {}, query));
  }

  getSelectCoursePromise({ courseId, collectionId }: { courseId: string | null; collectionId: string | null }) {
    const query = this._getQuery({ courseId, collectionId });
    return this._naptime.executeMutation(ProgramEnrollmentsV2.action(ACTIONS.selectCourse, {}, query));
  }

  getUnselectCoursePromise({ courseId, collectionId }: { courseId: string | null; collectionId: string | null }) {
    const query = this._getQuery({ courseId, collectionId });
    return this._naptime.executeMutation(ProgramEnrollmentsV2.action(ACTIONS.unselectCourse, {}, query));
  }

  getSelectS12nPromise({ s12nId, collectionId }: { s12nId: string | null; collectionId: string | null }) {
    const query = this._getQuery({ s12nId, collectionId });
    return this._naptime.executeMutation(ProgramEnrollmentsV2.action(ACTIONS.selectS12n, {}, query));
  }

  getUnselectS12nPromise({ s12nId, collectionId }: { s12nId: string | null; collectionId: string | null }) {
    const query = this._getQuery({ s12nId, collectionId });
    return this._naptime.executeMutation(ProgramEnrollmentsV2.action(ACTIONS.unselectS12n, {}, query));
  }
}

export default ProgramActionApiManager;
