

const Review = Backbone.Model.extend({
  urlRoot: function() {
    if (this.isNew() && this.get('parentClassSku')) {
      return '/classes/' + this.get('parentClassSku') + '/reviews';
    }

    return '/reviews';
  },
});

// sync with Reviews.php
Review.FLAG_STATUS = {
  OK: 0,
  NOT_COMPLETED: 1,
  LOW_QUALITY: 2,
};

export default Review;

