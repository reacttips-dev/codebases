import NaptimeResource from './NaptimeResource';

class OnDemandInstructorNotes extends NaptimeResource {
  static RESOURCE_NAME = 'onDemandInstructorNotes.v1';

  static byCourse(courseId, opts) {
    return this.finder(
      'byCourse',
      Object.assign(
        {
          params: {
            courseId,
          },
        },
        opts
      )
    );
  }

  static byModule({ courseId, moduleId }, opts) {
    return this.finder(
      'byModule',
      Object.assign(
        {
          params: {
            courseId,
            moduleId,
          },
        },
        opts
      )
    );
  }
}

export default OnDemandInstructorNotes;
