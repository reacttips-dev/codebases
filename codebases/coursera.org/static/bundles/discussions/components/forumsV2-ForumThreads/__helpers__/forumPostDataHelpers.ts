export function extractForumPostId(forumPostIdsCombo: string): string {
  const ids = forumPostIdsCombo.split('~');
  return ids[ids.length - 1];
}
