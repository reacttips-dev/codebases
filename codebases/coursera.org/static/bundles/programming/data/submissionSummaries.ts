import submissionSummariesApi from 'bundles/programming/api/submissionSummaries';

export default function ({
  itemId,
  itemTypeName,
  courseId,
  courseSlug,
  userId,
}: {
  itemId: string;
  itemTypeName: string;
  courseId: string;
  courseSlug: string;
  userId: number;
}) {
  return submissionSummariesApi.list({ itemId, itemTypeName, courseId, courseSlug, userId });
}
