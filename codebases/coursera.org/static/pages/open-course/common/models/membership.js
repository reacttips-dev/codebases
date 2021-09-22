import Backbone from 'backbone-associations';
import Q from 'q';
import _ from 'underscore';
import CourseRoles from 'bundles/common/constants/CourseRoles';
import user from 'js/lib/user';
import constants from 'pages/open-course/common/constants';
import membershipApi from 'pages/open-course/common/membershipApi';

const Membership = Backbone.AssociatedModel.extend(
  {
    api: membershipApi,

    defaults() {
      return {
        timestamp: Date.now(),
      };
    },

    initialize(options) {
      if (!_(options).has('courseId')) {
        throw new Error('You must instantiate a Membership with a courseId');
      }

      if (!this.get('userId')) {
        this.set('userId', options.userId || user.get().id);
      }

      if (!_(options).has('id')) {
        this.set('id', this.get('userId') + '~' + this.get('courseId'), {
          silent: true,
        });
      }
    },

    hasTeachingRole() {
      return _(constants.courseRolesWithTeachAccess).contains(this.get('courseRole').toUpperCase());
    },

    hasModerationRole() {
      return _(constants.courseRolesWithModeratorAccess).contains(this.get('courseRole').toUpperCase());
    },

    hasEnrolledRole() {
      return !_([CourseRoles.BROWSER, CourseRoles.NOT_ENROLLED, CourseRoles.PRE_ENROLLED_LEARNER]).contains(
        this.get('courseRole')
      );
    },

    hasPreEnrolled() {
      return this.get('courseRole') === CourseRoles.PRE_ENROLLED_LEARNER;
    },

    enroll(role) {
      this.set('courseRole', role || CourseRoles.LEARNER);
      const options = {
        data: this.toJSON(),
      };
      return Q(this.api.post('', options));
    },

    unenroll() {
      this.set('courseRole', CourseRoles.NOT_ENROLLED);
      return Q(this.api.delete(this.get('id')));
    },
  },
  CourseRoles
);

export default Membership;
