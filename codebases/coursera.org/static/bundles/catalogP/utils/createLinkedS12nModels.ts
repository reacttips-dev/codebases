import user from 'js/lib/user';
import _ from 'underscore';
import S12n from 'bundles/catalogP/models/s12n';
import Courses from 'bundles/catalogP/models/courses';
import Memberships from 'bundles/catalogP/models/memberships';
import S12nMembership from 'bundles/catalogP/models/s12nMembership';
import createLinkedModels from 'bundles/catalogP/lib/createLinkedModels';

const createLinkedS12nModels = (data: $TSFixMe) => {
  if (data.linked && data.linked['courses.v1']) {
    _(data.linked['courses.v1']).map((element) => {
      element.memberships = new Memberships(element.memberships);
      return element;
    });
  }

  const s12ns = createLinkedModels(S12n.prototype.resourceName, data);

  s12ns.each(function (s12n: $TSFixMe) {
    if (!s12n.has('membership')) {
      const userId = user.get().id;

      s12n.set(
        'membership',
        new S12nMembership({
          id: userId + '~' + s12n.get('id'),
          userId,
          s12nId: s12n.get('id'),
          role: 'NOT_ENROLLED',
        })
      );
    }

    if (s12n.has('interchangeableMap')) {
      /**
       * Take
       * interchangeableCourseIds: {
       *   'PRIMARY_COURSE_ID': [
       *      [SPARK_COURSE_1_ID, SPARK_COURSE_2_ID],
       *      [ONDEMAND_COURSE_1_ID]
       *   ]
       * }
       *
       * and set it as:
       * interchangeableMap: {
       *   'PRIMARY_COURSE_ID': [CoursesCollection([SPARK_COURSE_1, SPARK_COURSE_2]),
       *      CoursesCollection([ONDEMAND_COURSE_1])]
       * }
       */
      const interchangeableCourses = s12n.get('interchangeableCourses');

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'mapObject' does not exist on type 'Under... Remove this comment to see the full error message
      const interchangeableMap = _(s12n.get('interchangeableMap')).mapObject(function (courseCombinations) {
        return courseCombinations.map(function (courseIdArray: $TSFixMe) {
          return new Courses(
            _(courseIdArray).map(function (courseId) {
              return interchangeableCourses.get(courseId);
            })
          );
        });
      });

      s12n.set('interchangeableMap', interchangeableMap);
    }
  });

  return s12ns;
};

export default createLinkedS12nModels;
