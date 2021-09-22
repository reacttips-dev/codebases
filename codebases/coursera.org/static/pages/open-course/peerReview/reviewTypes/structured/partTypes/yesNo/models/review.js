import Backbone from 'backbone';

const YesNoReviewModel = Backbone.Model.extend({
  toJSON() {
    const json = Backbone.Model.prototype.toJSON.apply(this, arguments);

    if (json.choice === 'Yes') {
      delete json.explanation;
    }

    return json;
  },
});

export default YesNoReviewModel;
