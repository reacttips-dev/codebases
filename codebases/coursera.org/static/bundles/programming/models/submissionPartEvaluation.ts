import _ from 'underscore';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'page... Remove this comment to see the full error message
import Evaluation from 'pages/open-course/assessment/models/exam/evaluation';

const SubmissionPartEvaluation = Evaluation.extend({
  defaults: _({}).extend(Evaluation.prototype.defaults, {
    partId: null,
  }),
});

export default SubmissionPartEvaluation;
