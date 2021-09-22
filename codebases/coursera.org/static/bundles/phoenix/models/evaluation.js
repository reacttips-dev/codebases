/**
 * Encapsulates `Option[Evaluation]` objects returned by the APIs.
 *
 * The non-empty objects are of the form
 *   {
 *     "score": Number
 *     "maxScore": Number,
 *     "passingFraction": Number
 *   }
 */

import _ from 'lodash';

/**
 * Construct an evaluation.
 * @param {object=} data - JSON for the evaluation. Gives you a singleton "null object" if you don't specify this.
 */
class Evaluation {
  constructor(data) {
    if (data) {
      _.extend(this, _.pick(data, 'score', 'maxScore', 'passingFraction'));
    } else {
      return Evaluation.none;
    }
  }

  isDefined() {
    return this !== Evaluation.none;
  }

  isPassed() {
    if (this === Evaluation.none) {
      return undefined;
    } else {
      return this.getPercentScore() >= this.passingFraction;
    }
  }

  /**
   * This is not the same as !isPassed() because both isPassed() and isFailed() return `undefined` for the
   * "null object."
   */
  isFailed() {
    if (this === Evaluation.none) {
      return undefined;
    } else {
      return this.getPercentScore() < this.passingFraction;
    }
  }

  getMinimumPassingScore() {
    return Math.ceil(this.passingFraction * this.maxScore);
  }

  getDisplayScore() {
    return this.score.toString();
  }

  getPercentScore() {
    return this.score / this.maxScore;
  }

  getHumanPercentScore() {
    return Math.floor(this.getPercentScore() * 100);
  }
}

Evaluation.none = new Evaluation({});

export default Evaluation;
