export function courseItemForumURI({ courseSlug, itemId }: { courseSlug: string; itemId: string }) {
  return `/learn/${courseSlug}/item/${itemId}/discussions`;
}

export function assignmentForumURI({ courseSlug, forumId }: { courseSlug: string; forumId: string }) {
  const idsplit = forumId.split('~');
  let id: string | undefined = '';
  if (idsplit.length >= 1) {
    id = idsplit.pop();
  }
  return `/learn/${courseSlug}/discussions/forums/${id}`;
}
