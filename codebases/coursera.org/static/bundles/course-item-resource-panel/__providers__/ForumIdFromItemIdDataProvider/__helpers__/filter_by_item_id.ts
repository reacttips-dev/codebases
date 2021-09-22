import { CourseForum } from 'bundles/course-item-resource-panel/__providers__/ForumIdFromItemIdDataProvider/resources/CourseForums/__types__';

export function filterByItemId(elements: CourseForum[], itemId: string) {
  return elements.filter(({ forumType: { definition } }) => definition?.itemId === itemId);
}
