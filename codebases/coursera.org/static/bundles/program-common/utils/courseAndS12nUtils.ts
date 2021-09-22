import _ from 'lodash';

// TODO(Audrey):remove after https://coursera.atlassian.net/browse/UP-7587
export function getNextCourseSlug({
  s12n,
  s12nProgress = {},
}: {
  s12n: {
    courses: {
      elements: Array<{ id: string; slug: string }>;
    };
  };
  s12nProgress?: {
    lastActiveCourseId?: string;
  };
}) {
  const allCourses = s12n.courses.elements;
  if (allCourses.length === 0) return undefined;
  const firstCourse = allCourses[0];
  const coursesObj = _.keyBy(allCourses, 'id');
  const activeCourseId = s12nProgress.lastActiveCourseId;

  if (!activeCourseId || !coursesObj[activeCourseId]) {
    return coursesObj[firstCourse.id].slug;
  }

  return coursesObj[activeCourseId].slug;
}

export function getCourseHomeLinkBySlug(slug: string) {
  return `/learn/${slug}/home/welcome`;
}
