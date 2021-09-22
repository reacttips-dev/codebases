import _ from 'underscore';

import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

const SERIALIZED_PROPS: Array<keyof CourseReferencesStore$DehydratedState> = [
  'loaded',
  'referencesList',
  'currentReference',
  'cachedReferences',
];

type CourseReferencesStore$DehydratedState = {
  loaded: boolean;
  referencesList: Array<any>;
  currentReference: any;
  cachedReferences: any;
};

class CourseReferencesStore extends BaseStore {
  static storeName = 'CourseReferencesStore';

  static handlers = {
    LOAD_REFERENCES_LIST: 'onLoadReferencesList',
    LOAD_REFERENCE: 'onLoadReference',
  };

  onLoadReferencesList(response) {
    // response is of the following format
    // [Object, Object, ...]
    // Object: {id, shortId, content, name, slug}
    this.referencesList = response;
    this.loaded = true;
    this.emitChange();
  }

  onLoadReference(response) {
    // this is an object of the following format
    // {name, shortId, id, slug, content: {dtdType, definition, id}}
    if (response) {
      this.currentReference = response;
      this.cachedReferences[response.shortId] = response;
      this.emitChange();
    }
  }

  emitChange!: () => void;

  currentReference: any;

  cachedReferences: any = {};

  loaded = false;

  referencesList!: Array<any>;

  dehydrate(): CourseReferencesStore$DehydratedState {
    return _(this).pick(...SERIALIZED_PROPS);
  }

  rehydrate(state: CourseReferencesStore$DehydratedState) {
    Object.assign(this, _(state).pick(...SERIALIZED_PROPS));
  }

  getReferencesList() {
    return this.referencesList;
  }

  getCurrentReference() {
    return this.currentReference;
  }

  getCurrentReferenceShortId() {
    return this.currentReference ? this.currentReference.shortId : null;
  }

  getCachedReference(shortId: string) {
    return this.cachedReferences && this.cachedReferences[shortId];
  }

  hasLoaded() {
    return this.loaded;
  }
}

export default CourseReferencesStore;
