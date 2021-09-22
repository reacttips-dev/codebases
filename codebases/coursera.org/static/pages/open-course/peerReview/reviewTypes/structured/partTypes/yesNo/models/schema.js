import _ from 'underscore';
import Backbone from 'backbone';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const YesNoSchema = Backbone.Model.extend({
  defaults() {
    return {
      prompt: '',
    };
  },

  getChoicePoints(choice) {
    if (this.get('points')) {
      if (choice === 'Yes') {
        return this.get('points').yes;
      } else if (choice === 'No') {
        return this.get('points').no;
      }
    }

    return undefined;
  },

  getMaxScore() {
    return Math.max(..._(this.get('points')).values());
  },

  /**
   * Like getChoiceBestRepresentingReviews, but only works for scored parts. The sidebar review view uses this.
   * TODO(marc): Remove this when we remove the sidebar review view.
   */
  getOption(points) {
    const pair = _(this.get('points'))
      .chain()
      .pairs()
      .filter(function (pair) {
        return pair[1] <= points;
      })
      .sortBy(_.property(1))
      .last()
      .value();

    return {
      display: capitalize(pair[0]),
      points: pair[1],
    };
  },

  /**
   * Does the same thing as options/models/schema for Yes/No options.
   */
  getChoiceBestRepresentingReviews(reviewChoices, score) {
    if (reviewChoices.length === 0) {
      return null;
    }

    const counts = _(reviewChoices).countBy(_.identity);

    if ((counts.Yes || 0) > (counts.No || 0)) {
      return 'Yes';
    } else {
      return 'No';
    }
  },
});

export default YesNoSchema;
