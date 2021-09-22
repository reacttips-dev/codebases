import NaptimeResource from 'bundles/naptimejs/resources/NaptimeResource';

class OnDemandSessionMemberships extends NaptimeResource {
  static RESOURCE_NAME = 'onDemandSessionMemberships.v1';

  static byUserAndCourse(userId, courseId, options = {}) {
    return this.finder('activeByUserAndCourse', {
      params: { userId, courseId },
      ...options,
    });
  }
}

export default OnDemandSessionMemberships;
