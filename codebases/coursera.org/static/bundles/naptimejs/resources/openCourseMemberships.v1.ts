import CourseRoles from 'bundles/common/constants/CourseRoles';
import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import NaptimeResource from './NaptimeResource';

class OpenCourseMemberships extends NaptimeResource {
  static RESOURCE_NAME = 'openCourseMemberships.v1';

  courseRole!: keyof typeof CourseRoles;

  @requireFields('courseRole')
  get isPreEnrolled() {
    return this.courseRole === CourseRoles.PRE_ENROLLED_LEARNER;
  }

  @requireFields('courseRole')
  get isLearner() {
    return this.courseRole === CourseRoles.LEARNER;
  }

  @requireFields('courseRole')
  get isMentor() {
    return this.courseRole === CourseRoles.MENTOR || this.courseRole === CourseRoles.COURSE_ASSISTANT;
  }

  static byUserAndSlug(
    userId: string | number,
    slug: string,
    opts: { [key: string]: string | number | boolean | Array<string> }
  ) {
    return this.finder(
      'findByUserAndSlug',
      Object.assign(
        {
          params: {
            slug,
            userId,
          },
        },
        opts
      )
    );
  }
}

export default OpenCourseMemberships;
