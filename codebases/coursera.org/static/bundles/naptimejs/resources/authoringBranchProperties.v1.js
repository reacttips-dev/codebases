import NaptimeResource from 'bundles/naptimejs/resources/NaptimeResource';
import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';

export default class AuthoringBranchProperties extends NaptimeResource {
  static RESOURCE_NAME = 'authoringBranchProperties.v1';

  static byCourse(courseId) {
    return this.finder('course', {
      params: { courseId },
      fields: ['properties'],
    });
  }

  @requireFields('properties')
  get associatedSessions() {
    return this.properties && this.properties.associatedSessions;
  }
}
