

const PinterestShareButtonView = Backbone.View.extend({

  events: {
    'click': 'onClick',
  },

  initialize: function(options) {
    _.extend(this, _.pick(options, ['modelTrackingParams', 'trackingParams']));
  },

  onClick: function() {
    this.trigger('element:click');
    SS.EventTracker.track(
      'Clicked Share Button',
      this.modelTrackingParams,
      _.extend({}, this.trackingParams, SS.EventTracker.classDetails('Pinterest'))
    );
  },

});

export default PinterestShareButtonView;

