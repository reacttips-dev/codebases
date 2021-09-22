import S12nOwnership from 'bundles/s12n-common/service/models/s12nOwnership';
import CourseOwnerships from 'bundles/product/models/courseOwnerships';
import SpecializationMembership from 'bundles/catalogP/models/specializationMembership';

// TODO: Remove this logic once its no longer necessary. This is likely when we have unified models for
// Spark and Phoenix Specializations in the backend.

function transform({ specialization, specializationMembership = new SpecializationMembership() }: $TSFixMe) {
  function buildCourseOwnerships(coursesWithVCMemberships: $TSFixMe) {
    return new CourseOwnerships(
      specialization.get('courses').map((course: $TSFixMe) => {
        const courseId = course.get('id');

        return {
          courseId,
          owns: !!coursesWithVCMemberships.find((c: $TSFixMe) => c.get('id') === courseId),
        };
      })
    );
  }

  const courseOwnerships = buildCourseOwnerships(
    specialization.get('courses').filter((course: $TSFixMe) => {
      return course.has('memberships') && course.get('memberships').some((m: $TSFixMe) => m.has('vcMembership'));
    })
  );

  return new S12nOwnership({
    owns: specializationMembership.has('bulkVoucherId'),
    s12nCourseOwnerships: courseOwnerships,
  });
}

export default transform;
