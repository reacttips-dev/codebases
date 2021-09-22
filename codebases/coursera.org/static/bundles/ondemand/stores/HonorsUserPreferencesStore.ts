import _ from 'lodash';

import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

const SERIALIZED_PROPS: Array<keyof HonorsUserPreferencesStore$DehydratedState> = [
  'loaded',
  'skippedHonorsModalMap',
  'skippedLessons',
];

type HonorsUserPreferencesStore$DehydratedState = {
  loaded: boolean;
  skippedLessons: any;
  skippedHonorsModalMap: any;
};

class HonorsUserPreferencesStore extends BaseStore {
  static storeName = 'HonorsUserPreferencesStore';

  loaded: boolean;

  skippedLessons: any;

  skippedHonorsModalMap: any;

  static handlers = {
    LOAD_HONORS_USER_PREFERENCES: 'handleLoadHonorsUserPreferences',
    SET_LESSON_SKIPPED: 'handleSetLessonSkipped',
  };

  constructor(dispatcher: any) {
    super(dispatcher);

    this.loaded = false;
    this.skippedLessons = {};
    this.skippedHonorsModalMap = {};
  }

  dehydrate(): HonorsUserPreferencesStore$DehydratedState {
    return _.pick(this, ...SERIALIZED_PROPS);
  }

  rehydrate(state: HonorsUserPreferencesStore$DehydratedState) {
    Object.assign(this, _.pick(state, ...SERIALIZED_PROPS));
  }

  handleLoadHonorsUserPreferences(honorsUserPreferences: any) {
    this.loaded = true;
    this.skippedHonorsModalMap = honorsUserPreferences ? honorsUserPreferences.honorsModalDisabledAt : {};
    this.emitChange();
  }

  handleSetLessonSkipped({ lessonId, skipped }: { lessonId: string; skipped: boolean }) {
    this.skippedLessons[lessonId] = skipped;
  }

  hasLoaded() {
    return this.loaded;
  }

  getLessonSkipped(lessonId: string) {
    return this.skippedLessons[lessonId];
  }

  hasUserSkippedHonorsModalForCourseId(courseId: string): boolean {
    return !!(this.skippedHonorsModalMap && this.skippedHonorsModalMap[courseId]);
  }

  getUserPreferencesWithSkippedCourseId(courseId: string) {
    const skippedHonorsModalMap = Object.assign({}, this.skippedHonorsModalMap);
    skippedHonorsModalMap[courseId] = Date.now();
    return { honorsModalDisabledAt: skippedHonorsModalMap };
  }
}

export default HonorsUserPreferencesStore;
