import _ from 'lodash';

import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import Membership from 'pages/open-course/common/models/membership';

const SERIALIZED_PROPS: Array<keyof CourseMembershipStore$DehydratedState> = ['rawMembership'];

type CourseMembershipStore$DehydratedState = {
  rawMembership: any;
};

class CourseMembershipStore extends BaseStore {
  static storeName: 'CourseMembershipStore' = 'CourseMembershipStore';

  static handlers = {
    LOAD_COURSE_MEMBERSHIP: 'onLoadMembership',
  };

  rawMembership: any;

  membership: Membership;

  onLoadMembership(rawMembership: any) {
    this.rawMembership = rawMembership;
    this.membership = new Membership(rawMembership);
    this.emitChange();
  }

  dehydrate(): CourseMembershipStore$DehydratedState {
    return _.pick(this, ...SERIALIZED_PROPS);
  }

  rehydrate(state: CourseMembershipStore$DehydratedState) {
    Object.assign(this, _.pick(state, ...SERIALIZED_PROPS));
    this.membership = new Membership(this.rawMembership);
  }

  // TODO: Add more a specific return type
  getMembership(): any {
    return this.membership;
  }

  hasLoaded(): boolean {
    return this.membership !== undefined;
  }

  isEnrolled(): boolean | undefined {
    const membership = this.getMembership();
    if (membership) {
      return membership.hasEnrolledRole();
    }

    return undefined;
  }

  isPreEnrolled(): boolean | undefined {
    const membership = this.getMembership();
    if (membership) {
      return membership.hasPreEnrolled();
    }

    return undefined;
  }

  hasTeachingRole(): boolean | undefined {
    const membership = this.getMembership();
    if (membership) {
      return membership.hasTeachingRole();
    }

    return undefined;
  }

  hasModerationRole(): boolean | undefined {
    const membership = this.getMembership();
    if (membership) {
      return membership.hasModerationRole();
    }

    return undefined;
  }

  enrollmentTime(): number | undefined {
    const membership = this.getMembership();
    if (membership) {
      return membership.get('timestamp');
    }

    return undefined;
  }

  // TODO: Add more a specific return type
  getCourseRole(): string | undefined {
    const membership = this.getMembership();
    if (membership) {
      return membership.get('courseRole');
    }

    return undefined;
  }
}

export default CourseMembershipStore;
