import Facebook from 'core/src/base/facebook';

const FacebookShareButtonView = Backbone.View.extend({

  // The number that should display on the Facebook counter
  currentCount: 0,

  // Whether or not to handle the count on this button
  showCounter: false,

  // The url that is used to fetch the share count
  countUrl: null,

  // Options to be passed to the Feed Dialog
  shareOptions: {},

  // Model tracking parameters to be set when the button is clicked
  modelTrackingParams: null,

  // Extra tracking parameters tobe set when the button is clicked
  trackingParams: null,

  initialize: function(options) {
    const _this = this;

    _.bindAll(this, 'setCount');

    _.extend(this, _.pick(options, ['modelTrackingParams', 'trackingParams',
      'shareOptions', 'countUrl', 'showCounter',
    ]));

    if (this.showCounter) {
      this.$countWrapper = this.$el.find('.count-wrapper');
      this.$count = this.$countWrapper.find('.count');
    }

    Facebook.loaded.done(function() {

      if (_this.showCounter && _this.countUrl) {
        Facebook.getShareCount(_this.countUrl, _this.setCount);
      }

      _this.$el.click(function() {
        SS.EventTracker.track(
          'Clicked Share Button',
          _this.modelTrackingParams,
          _.extend({}, _this.trackingParams, SS.EventTracker.classDetails({type: 'Facebook'}))
        );

        Facebook.shareObject(_this.shareOptions, function() {
          if (_this.showCounter) {
            _this.setCount(_this.currentCount + 1);
          }
        });

        _this.trigger('element:click');

        return false;
      });
    });
  },

  setCount: function(num) {
    const parsedNum = parseInt(num, 10);

    if (!_.isNaN(parsedNum)) {
      this.$count.text(parsedNum);
      this.$countWrapper.toggleClass('hidden', parsedNum <= 0);

      this.currentCount = parsedNum;
    }
  },

});

export default FacebookShareButtonView;

