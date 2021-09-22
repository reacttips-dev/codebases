const SubtitleTextOverlayView = Backbone.View.extend({
    initialize: function() {
      this._setupBindings();
    },

    render: function() {
        if (this.model.languageIsSelected()) {
            this.$el.css('visibility', 'visible');
        }
        else {
            this.$el.css('visibility', 'hidden');
        }
    },

    _setupBindings: function() {
        this.listenTo(this.model, "change", this.render);
    },
});

export default SubtitleTextOverlayView;
