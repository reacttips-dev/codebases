/* eslint-disable import/prefer-default-export */

import { NavigationItem } from 'bundles/course-v2/types/CourseNavigation';
import { getRelativeUrl } from 'bundles/course-v2/utils/Course';
import { ReplaceCustomContent } from 'bundles/custom-labels/types/CustomLabels';

import _t from 'i18n!nls/course-v2';

type NavigationItemDescription = {
  url: string;
  title: string;
  selected: boolean;
  subtitle?: string;
};

function getDescription(
  navigationItem: NavigationItem,
  courseSlug: string,
  router: any,
  replaceCustomContent: ReplaceCustomContent
): NavigationItemDescription {
  const { params } = router;

  let url = '';
  let title = '';
  let subtitle = '';
  let selected = false;

  switch (navigationItem.typeName) {
    case 'weeksNavigationItem':
      title = _t('Overview');
      url = getRelativeUrl(courseSlug, 'home/welcome');
      selected =
        router.isActive({ name: 'welcome', params }) || (params.week && router.isActive({ name: 'week', params }));
      break;

    case 'previewFirstWeekNavigationItem':
      title = replaceCustomContent(_t('Preview #{capitalizedWeekWithNumber}'), { weekNumber: 1, returnsString: true });
      url = getRelativeUrl(courseSlug, 'home/welcome');
      selected =
        router.isActive({ name: 'welcome', params }) || (params.week && router.isActive({ name: 'week', params }));
      break;

    case 'previewCourseNavigationItem':
      title = replaceCustomContent(_t('Preview #{capitalizedCourse}'), { returnsString: true });
      url = getRelativeUrl(courseSlug, 'home/welcome');
      selected =
        router.isActive({ name: 'welcome', params }) || (params.week && router.isActive({ name: 'week', params }));
      break;

    case 'gradesNavigationItem':
      title = _t('Grades');
      url = getRelativeUrl(courseSlug, 'home/assignments');
      selected = router.isActive({ name: 'assignments', params });
      break;

    case 'notesNavigationItem':
      title = _t('Notes');
      url = getRelativeUrl(courseSlug, 'home/notes');
      selected = router.isActive({ name: 'notes', params });
      break;

    case 'discussionForumsNavigationItem':
      title = _t('Discussion Forums');
      url = getRelativeUrl(courseSlug, 'discussions');
      selected = router.isActive({ name: 'discussions', params });
      break;

    case 'inboxNavigationItem':
      title = _t('Messages');
      url = getRelativeUrl(courseSlug, 'course-inbox');
      selected = router.isActive({ name: 'course-inbox', params });
      break;

    case 'resourcesNavigationItem':
      title = _t('Resources');
      url = getRelativeUrl(courseSlug, `resources/${navigationItem.definition.resources[0].shortId}`);
      selected =
        router.isActive({ name: 'resources', params }) ||
        (params.reference_id && router.isActive({ name: 'resourcesWithRefId', params })) ||
        (params.reference_id && params.short_slug && router.isActive({ name: 'resourcesWithRefIdAndSlug', params }));
      break;

    case 'officeHoursNavigationItem':
      title = _t('Live Events');
      url = getRelativeUrl(courseSlug, 'office-hours');
      selected = router.isActive({ name: 'office-hours', params });
      break;

    case 'teamworkNavigationItem':
      title = _t('Teamwork');
      url = getRelativeUrl(courseSlug, 'teamwork');
      selected = router.isActive({ name: 'teamwork', params });
      break;

    case 'classmatesNavigationItem':
      title = _t('Classmates');
      url = getRelativeUrl(courseSlug, 'classmates');
      selected = router.isActive({ name: 'classmates', params });
      break;

    case 'courseInfoNavigationItem':
      title = replaceCustomContent(_t('#{capitalizedCourse} Info'), { returnsString: true });
      url = getRelativeUrl(courseSlug, 'home/info');
      selected = router.isActive({ name: 'CDP', params });
      break;

    case 'courseManagerNavigationItem':
      title = replaceCustomContent(_t('#{capitalizedCourse} Manager'), { returnsString: true });
      subtitle = _t('Staff & Mentors Only');
      url = getRelativeUrl(courseSlug, 'course-manager');
      selected = router.isActive({ name: 'course-manager', params });
      break;

    default:
      break;
  }

  return { url, title, subtitle, selected };
}

export { getDescription };
