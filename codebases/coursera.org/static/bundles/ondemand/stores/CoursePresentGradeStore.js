import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
import CoursePresentGrade from 'bundles/ondemand/models/CoursePresentGrade';

class CoursePresentGradeStore extends BaseStore {
  static storeName = 'CoursePresentGradeStore';

  static handlers = {
    LOAD_COURSE_PRESENT_GRADE: 'handleLoadCoursePresentGrade',
    LOAD_COURSE_PRESENT_GRADE_FAIL: 'handleLoadCoursePresentGradeFail',
  };

  handleLoadCoursePresentGrade({ presentGrade }) {
    this.presentGrade = new CoursePresentGrade(presentGrade);

    this.emitChange();
  }

  handleLoadCoursePresentGradeFail() {
    this.presentGrade = new CoursePresentGrade({});

    this.emitChange();
  }

  constructor(dispatcher) {
    super(dispatcher);

    this.presentGrade = undefined;
  }

  dehydrate() {
    return this.presentGrade;
  }

  rehydrate(state) {
    Object.assign(this, new CoursePresentGrade(state));
  }

  hasLoaded() {
    return this.presentGrade !== undefined;
  }

  getPresentGrade() {
    return this.presentGrade;
  }
}

export default CoursePresentGradeStore;
