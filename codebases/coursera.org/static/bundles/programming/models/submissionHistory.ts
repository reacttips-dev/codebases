import _ from 'underscore';
import Backbone from 'backbone';
import SubmissionSummary from 'bundles/programming/models/submissionSummary';

const SubmissionHistory = Backbone.Collection.extend({
  model: SubmissionSummary,

  comparator: '-submittedAt',

  getBestSubmission() {
    if (this.length === 0) {
      return null;
    }

    return this.max(function (submission: $TSFixMe) {
      const evaluation = submission.get('evalution');
      return evaluation ? evaluation.get('score') : 0;
    });
  },

  getLatestSubmission() {
    if (this.length === 0) {
      return null;
    }

    return this.at(0);
  },

  getLatestForPart(partId: $TSFixMe) {
    const latestSubmissionSummaryWithPartEval = _(this.models).find(function (submissionSummary) {
      return submissionSummary.getEvaluationForPart(partId) !== null;
    });

    if (latestSubmissionSummaryWithPartEval === undefined) {
      return null;
    }

    return {
      evaluation: latestSubmissionSummaryWithPartEval.getEvaluationForPart(partId),
      submittedAt: latestSubmissionSummaryWithPartEval.get('submittedAt'),
    };
  },

  getHistoryForPart(partId: $TSFixMe) {
    return _(this.models)
      .map(function (submissionSummary) {
        return {
          evaluation: submissionSummary.getEvaluationForPart(partId),
          submittedAt: submissionSummary.get('submittedAt'),
        };
      })
      .filter(function (partSummary) {
        // @ts-expect-error TSMIGRATION
        return partSummary.evalution !== null;
      });
  },

  doesSubmissionExist() {
    return this.length !== 0;
  },
});

export default SubmissionHistory;
