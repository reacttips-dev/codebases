import NaptimeResource from 'bundles/naptimejs/resources/NaptimeResource';

class GroupMemberships extends NaptimeResource {
  static RESOURCE_NAME = 'groupMemberships.v2';

  static byUserAndCourse(userId, courseId, options) {
    return this.finder('userAndCourse', {
      params: { userId, courseId },
      ...options,
    });
  }
}

export default GroupMemberships;
