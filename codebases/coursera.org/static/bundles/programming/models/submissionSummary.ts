import Backbone from 'backbone-associations';
import _ from 'underscore';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'page... Remove this comment to see the full error message
import Evaluation from 'pages/open-course/assessment/models/exam/evaluation';
import SubmissionPartEvaluation from 'bundles/programming/models/submissionPartEvaluation';
import submissionEvaluationsPromise from 'bundles/programming/promises/submissionEvaluations';

const SubmissionSummary = Backbone.AssociatedModel.extend({
  defaults: {
    courseId: null,
    itemId: null,
    id: null,
    submittedAt: null,
    partEvaluations: null,
    evaluation: null,
  },

  relations: [
    {
      type: Backbone.Associations.Many,
      key: 'partEvaluations',
      relatedModel: SubmissionPartEvaluation,
    },
    {
      type: Backbone.Associations.One,
      key: 'evaluation',
      relatedModel: Evaluation,
    },
  ],

  initialize() {
    _(this).bindAll('onLoadFeedbacksSuccess', 'onLoadFeedbacksError');
  },

  parse(json: $TSFixMe) {
    json.partEvaluations = _(json.partEvaluations)
      .chain()
      .pairs()
      .map(function (pair) {
        return _({}).extend(pair[1], {
          partId: pair[0],
        });
      })
      .value();

    return json;
  },

  loadFeedbacks({ itemId, courseId, courseSlug }: $TSFixMe) {
    if (!this.loadFeedbacksPromise) {
      this.set('isLoadingFeedbacks', true);
      const submissionId = this.get('id');

      this.loadFeedbacksPromise = submissionEvaluationsPromise({
        itemId,
        courseId,
        courseSlug,
        submissionId,
      }).then(this.onLoadFeedbacksSuccess, this.onLoadFeedbacksError);
    }

    return this.loadFeedbacksPromise;
  },

  onLoadFeedbacksSuccess(response: $TSFixMe) {
    this.set('isLoadingFeedbacks', false);
    this.set('areFeedbacksLoaded', true);

    _(response.definition.parts).each((part, partId) => {
      const evaluation = this.getPartEvaluation(partId);
      evaluation.set(part);

      if (part.definition) {
        evaluation.set(part.definition);
      }
    });

    return response;
  },

  onLoadFeedbacksError(error: $TSFixMe) {
    this.set('isLoadingFeedbacks', false);
    this.loadFeedbacksPromise = null;
  },

  getPartEvaluation(partId: $TSFixMe) {
    return this.get('partEvaluations').findWhere({ partId });
  },
});

export default SubmissionSummary;
