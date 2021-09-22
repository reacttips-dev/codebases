import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

import _ from 'lodash';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import S12n from 'bundles/ondemand/models/S12n';
import createLinkedS12nModels from 'bundles/catalogP/utils/createLinkedS12nModels';
import CourseOwnerships from 'bundles/product/models/courseOwnerships';
import S12nOwnership from 'bundles/s12n-common/service/models/s12nOwnership';

const SERIALIZED_PROPS: Array<keyof S12nStore$DehydratedState> = ['rawS12ns', 'rawOwnership', 'loaded'];

type S12nStore$DehydratedState = {
  rawS12ns: any | null;
  rawOwnership: any | null;
  loaded: boolean;
};

class S12nStore extends BaseStore {
  static storeName: 'S12nStore' = 'S12nStore';

  static handlers = {
    LOAD_S12N: 'handleLoadS12n',
  };

  handleLoadS12n(payload: S12nStore$DehydratedState) {
    this.loaded = true;

    this.rawS12ns = payload.rawS12ns;
    this.rawOwnership = payload.rawOwnership;

    this.initializeS12n();
    this.emitChange();
  }

  rawS12ns: any | null = null;

  rawOwnership: any | null = null;

  loaded = false;

  s12n: S12n | null = null;

  dehydrate() {
    return _.pick(this, SERIALIZED_PROPS);
  }

  rehydrate(state: any) {
    Object.assign(this, _.pick(state, SERIALIZED_PROPS));
    this.initializeS12n();
  }

  initializeS12n() {
    let s12n;
    let ownership;

    if (this.rawS12ns) {
      const s12ns = createLinkedS12nModels(this.rawS12ns);
      s12n = s12ns.at(0);
    }

    if (this.rawOwnership) {
      ownership = new S12nOwnership({
        ...this.rawOwnership,
        s12nCourseOwnerships: new CourseOwnerships(this.rawOwnership.s12nCourseOwnerships || []),
      });
    }

    this.s12n = s12n ? new S12n({ s12n, ownership }) : null;
  }

  hasLoaded(): boolean {
    return this.loaded;
  }

  /**
   * @returns {?S12n} - An instance of the S12n class if the current course is in a s12n, or null if not.
   *   Undefined if the store hasn't loaded yet.
   */
  getS12n(): any {
    return this.s12n;
  }
}

export default S12nStore;
