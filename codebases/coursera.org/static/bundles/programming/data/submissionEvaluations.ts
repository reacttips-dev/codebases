import submissionEvaluationsApi from 'bundles/programming/api/submissionEvaluations';

export default function ({
  itemId,
  courseId,
  courseSlug,
  submissionId,
}: {
  itemId: string;
  courseId: string;
  courseSlug: string;
  submissionId: string;
}) {
  return submissionEvaluationsApi.get({ itemId, courseId, courseSlug, submissionId });
}
