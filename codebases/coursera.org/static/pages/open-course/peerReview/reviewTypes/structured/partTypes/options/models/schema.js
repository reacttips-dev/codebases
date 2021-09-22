import _ from 'underscore';
import Backbone from 'backbone';

const OptionsSchema = Backbone.Model.extend({
  defaults() {
    return {
      prompt: '',
      options: {},
    };
  },

  getMaxScore() {
    const pointValues = _(this.get('options')).chain().values().map(_.property('points')).value();
    return Math.max(...pointValues);
  },

  /**
   * Like getOptionBestRepresentingReviews, but only works for scored parts. The sidebar review view uses this.
   * TODO(marc): Remove this when we remove the sidebar review view.
   */
  getOption(points) {
    const pair = _(this.get('options'))
      .chain()
      .pairs()
      .filter(function (pair) {
        return pair[1].points <= points;
      })
      .sortBy(function (pair) {
        return pair[1].points;
      })
      .last()
      .value();

    return pair[1];
  },

  /**
   * Returns options in an array sorted by order. Adds the option's id to the `optionId` property, and adds the
   * option's index to the `normalizedOrder` property.
   */
  getSortedOptions() {
    return _(this.get('options'))
      .chain()
      .map((value, key) => _({}).extend(value, { optionId: key }))
      .sortBy('order')
      .map((value, index) => _({}).extend(value, { normalizedOrder: index }))
      .value();
  },

  /**
   * Returns the option "best representing" a list of reviews and a score.
   *
   * For scored parts, the option "best representing" the score is the closest option with a lower-or-equal score. If
   * there are multiple options with the same score, then we tiebreak by highest number of reviews and then lowest
   * order.
   *
   * For unscored parts, the option "best representing" the list of reviews is the median option by order. If the
   * median order falls between options, then we take the lowest ordered option with order higher than the median.
   *
   * Returns null if there are no reviews or if there are no options satisfying the conditions of "best representing"
   * the reviews and score.
   */
  getOptionBestRepresentingReviews(reviewChoices, score) {
    if (reviewChoices.length === 0) {
      return null;
    }

    if (this.get('isScored') && score != null) {
      return this.getOptionBestRepresentingReviewsForScored(reviewChoices, score);
    } else {
      return this.getOptionBestRepresentingReviewsForUnscored(reviewChoices);
    }
  },

  /**
   * See explanation above getOptionBestRepresentingReviews().
   */
  getOptionBestRepresentingReviewsForScored(reviewChoices, score) {
    const countReviews = (optionId) => reviewChoices.filter((choice) => choice === optionId).length;

    const candidateOptions = this.getSortedOptions().filter((option) => option.points <= score);
    if (candidateOptions.length === 0) {
      return null;
    }

    return candidateOptions.reduce((a, b) => {
      // Find the option with the most points.
      if (a.points > b.points) {
        return a;
      } else if (a.points < b.points) {
        return b;
      }

      // If there is a tie by points, find the option with the most reviews.
      const aReviewCount = countReviews(a.optionId);
      const bReviewCount = countReviews(b.optionId);
      if (aReviewCount > bReviewCount) {
        return a;
      } else if (aReviewCount < bReviewCount) {
        return b;
      }

      // If there is still a tie, find the option with the lowest order.
      if (a.normalizedOrder < b.normalizedOrder) {
        return a;
      } else {
        return b;
      }
    });
  },

  /**
   * See explanation above getOptionBestRepresentingReviews().
   */
  getOptionBestRepresentingReviewsForUnscored(reviewChoices) {
    const median = (numbers) => {
      const half = Math.floor(numbers.length / 2);
      numbers.sort((a, b) => a - b);
      if (numbers.length % 2 === 1) {
        return numbers[half];
      } else {
        return numbers[half - 1] / 2 + numbers[half] / 2;
      }
    };

    const options = this.getSortedOptions();
    const reviewOrders = reviewChoices.map((reviewChoice) => {
      return options.filter((option) => option.optionId === reviewChoice)[0].normalizedOrder;
    });
    if (reviewOrders.length === 0) {
      return null;
    }

    const medianReviewOrder = median(reviewOrders);
    return options.filter((option) => option.normalizedOrder >= medianReviewOrder)[0];
  },
});

export default OptionsSchema;
