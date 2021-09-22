export function extractForumPostId(userCourseForumPostIdsCombo: string): string {
  const ids = userCourseForumPostIdsCombo.split('~');
  return ids[ids.length - 1];
}
