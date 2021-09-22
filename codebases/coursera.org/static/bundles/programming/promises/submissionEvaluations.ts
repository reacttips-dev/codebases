import Q from 'q';
import handleResponse from 'bundles/naptime/handleResponse';
import user from 'js/lib/user';
import submissionEvaluationsData from 'bundles/programming/data/submissionEvaluations';

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
  if (!user.isAuthenticatedUser()) {
    return Q({});
  } else {
    return Q(submissionEvaluationsData({ itemId, courseId, courseSlug, submissionId }))
      .then(handleResponse)
      .then((naptimeResponse) => naptimeResponse.elements[0]);
  }
}
