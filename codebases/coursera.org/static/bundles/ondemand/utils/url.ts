import path from 'js/lib/path';
import constants from 'pages/open-course/common/constants';

export const getCourseRootPath = (courseSlug: string) => `${constants.learnRoot}/${courseSlug}`;
export const getBaseUrl = (courseRootPath: string) => path.join(courseRootPath, 'home');
export const getHomeUrl = (courseRootPath: string) => path.join(courseRootPath, 'home/welcome');
export const getCourseInfoUrl = (courseRootPath: string) => path.join(courseRootPath, 'home/info');
export const getAssignmentsUrl = (courseRootPath: string) => path.join(courseRootPath, 'home/assignments');
export const getNotesUrl = (courseRootPath: string) => path.join(courseRootPath, 'home/notes');
export const getWeekUrl = (courseRootPath: string, week: string | number) =>
  path.join(courseRootPath, 'home/week', week.toString());
export const getTeamworkUrl = (courseRootPath: string) => path.join(courseRootPath, 'teamwork');
export const getClassmatesUrl = (courseRootPath: string) => path.join(courseRootPath, 'classmates');
export const getDiscussionsUrl = (courseRootPath: string) => path.join(courseRootPath, 'discussions');
export const getCourseInboxUrl = (courseRootPath: string) => path.join(courseRootPath, 'course-inbox');
export const getCourseReferencesUrl = (courseRootPath: string, id: string) =>
  path.join(courseRootPath, 'resources', id);
export const getOfficeHoursUrl = (courseRootPath: string) => path.join(courseRootPath, 'office-hours');
export const getCourseProfileUrl = (courseRootPath: string, externalId: string) =>
  path.join(courseRootPath, 'profiles', externalId);
export const getCourseManagerUrl = (courseRootPath: string) => path.join(courseRootPath, 'course-manager');
export const getGenericItemUrl = (courseRootPath: string, itemId: string) => path.join(courseRootPath, 'item', itemId);
