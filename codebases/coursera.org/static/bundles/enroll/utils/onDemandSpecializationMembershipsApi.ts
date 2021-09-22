import Q from 'q';

import CourseRoles from 'bundles/common/constants/CourseRoles';
import API from 'bundles/phoenix/lib/apiWrapper';

import user from 'js/lib/user';

const onDemandSpecializationMemberships = API('/api/onDemandSpecializationMemberships.v1', {
  type: 'rest',
});

const onDemandSpecializationMembershipsApi = {
  create(s12nId: string): Q.Promise<Object> {
    const data = {
      s12nId,
      role: CourseRoles.LEARNER,
      userId: user.get().id,
    };

    return Q(
      onDemandSpecializationMemberships.post('', {
        data,
      })
    );
  },

  enrollInOwnedS12n(s12nId: string, courseId: string): Q.Promise<Object> {
    const data = {
      s12nId,
      courseId,
    };

    return Q(
      onDemandSpecializationMemberships.post('?action=enrollInOwnedS12n', {
        data,
      })
    );
  },
};

export default onDemandSpecializationMembershipsApi;

export const { create, enrollInOwnedS12n } = onDemandSpecializationMembershipsApi;
