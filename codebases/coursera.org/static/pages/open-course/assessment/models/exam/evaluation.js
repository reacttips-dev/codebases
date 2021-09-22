/**
 * Represents a single assessment evaluation. This includes the number of questions,
 * the number of questions answered correctly, whether the learner passed, etc.
 *
 * Arguments:
 *   options:
 *     maxScore: The total number of questions.
 *     score: The number of questions answered correctly.
 */

import Backbone from 'backbone-associations';

import constants from 'pages/open-course/common/constants';

const Evaluation = Backbone.AssociatedModel.extend({
  defaults: {
    maxScore: 1,
    score: 0,
    sessionId: '',
    passingFraction: constants.assessments.defaultPassingFraction,
  },

  reset() {
    this.set(this.defaults);
  },

  isValid() {
    return (
      typeof this.get('score') === 'number' &&
      typeof this.get('maxScore') === 'number' &&
      typeof this.get('passingFraction') === 'number'
    );
  },

  getPercentScore() {
    return this.get('score') / this.get('maxScore');
  },

  getHumanPercentScore() {
    return Math.floor(this.getPercentScore() * 100);
  },

  getDisplayScore() {
    const score = this.get('score');
    return score.toString();
  },

  getMinimumPassingScore() {
    return Math.ceil(this.get('passingFraction') * this.get('maxScore'));
  },

  getDisplayPassingPercent() {
    return `${Math.round(this.get('passingFraction') * 100)}%`;
  },

  isPassed() {
    const passingScore = (this.get('maxScore') * this.get('passingFraction')).toFixed(2);
    return this.get('score') >= passingScore;
  },
});

export default Evaluation;
