import user from 'js/lib/user';
import OpenCourseMembershipsV1 from 'bundles/naptimejs/resources/openCourseMemberships.v1';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';

export function getRelativeUrl(slug: string, relativePath: string): string {
  return `/learn/${slug}/${relativePath}`;
}

export function getWelcomeUrl(slug: string): string {
  return getRelativeUrl(slug, 'home/welcome');
}

export function getGradesUrl(slug: string): string {
  return getRelativeUrl(slug, 'home/assignments');
}

export function getNotesUrl(slug: string): string {
  return getRelativeUrl(slug, 'home/notes');
}

export function getWeekUrl(slug: string, week: number): string {
  return getRelativeUrl(slug, `home/week/${week}`);
}

export function getReferenceUrl(slug: string, id: string): string {
  return getRelativeUrl(slug, `resources/${id}`);
}

export function canAccessCourse(openCourseMemberships: OpenCourseMembershipsV1[], course?: CoursesV1 | null): boolean {
  const courseRoleBlacklist = ['BROWSER', 'NOT_ENROLLED', 'PRE_ENROLLED_LEARNER'];
  const courseRole = !!openCourseMemberships[0] && openCourseMemberships[0].courseRole;

  // checking course existence this way invalidates use of old slugs
  // openCourseMemberships doesn't
  const courseFound = !!course;
  const validRole = user.isSuperuser() || (courseRole && !courseRoleBlacklist.includes(courseRole));

  return courseFound && validRole;
}
