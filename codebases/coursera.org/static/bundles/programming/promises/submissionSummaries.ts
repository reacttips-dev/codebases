import Q from 'q';
import _ from 'underscore';
import handleResponse from 'bundles/naptime/handleResponse';
import user from 'js/lib/user';
import submissionSummariesData from 'bundles/programming/data/submissionSummaries';
import SubmissionHistory from 'bundles/programming/models/submissionHistory';
import SubmissionSummary from 'bundles/programming/models/submissionSummary';

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
  if (!user.isAuthenticatedUser()) {
    return Q({});
  } else {
    return submissionSummariesData({ itemId, itemTypeName, courseId, courseSlug, userId })
      .then(handleResponse)
      .then(function (naptimeResponse: $TSFixMe) {
        const submissionSummaries = _(naptimeResponse.elements).map(function (summary) {
          return new SubmissionSummary(
            _({}).extend(summary, summary.submissionSummary, {
              partEvaluations: summary.submissionSummary.parts,
            }),
            { parse: true }
          );
        });
        return new SubmissionHistory(submissionSummaries);
      });
  }
}
