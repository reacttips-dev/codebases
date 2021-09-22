import NaptimeResource from './NaptimeResource';

class OnDemandCoursePresentGrades extends NaptimeResource {
  static RESOURCE_NAME = 'onDemandCoursePresentGrades.v1';

  static getById(id, params) {
    return this.get(id, params, (presentGrade) => {
      return presentGrade || {};
    });
  }
}

export default OnDemandCoursePresentGrades;
