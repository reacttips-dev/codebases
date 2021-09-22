const SubtitleButtonView = Backbone.View.extend({
    initialize: function() {
      this._setupTooltip();
      this._setupBindings();
    },

    render: function() {
      if (this.model.isLanguageOptionsEmpty()) {
        this.$el.addClass(SubtitleButtonView.CSS_CLASS_DISABLED);
        this.$el.removeClass(SubtitleButtonView.CSS_CLASS_ON);
      } else {
        let tooltipTitle = "";
        
        if (this.model.languageIsSelected()) {
          this.$el.addClass(SubtitleButtonView.CSS_CLASS_ON);
          tooltipTitle = SubtitleButtonView.TOOLTIP_OFF;
        } else {
          this.$el.removeClass(SubtitleButtonView.CSS_CLASS_ON);
          tooltipTitle = SubtitleButtonView.TOOLTIP_ON;
        }

        this.$el.attr('title', tooltipTitle).tooltip('fixTitle');

        /**
         * Showing the tooltip just when there is a single language option
         * since otherwise it will interfere with the language options
         * list when displayed.
         */
        if (this.model.isSingleLanguageOption()) {
          this.$el.tooltip("enable");
        } else {
          this.$el.tooltip("disable");
          this.$el.tooltip('hide');
        }
        
        this.$el.removeClass(SubtitleButtonView.CSS_CLASS_DISABLED);
      }
    },

    _setupTooltip: function() {
      this.$el.attr({
        rel: 'tooltip',
        'data-title': SubtitleButtonView.TOOLTIP_OFF
      }).data('ss-tooltip-delay', 150);

      this.$el.tooltip('hide');
    },

    _setupBindings: function() {
      this.listenTo(this.model, "change", this.render);

      this.$el.on('click touchstart', () => {
        this.model.toggleOrSelect();
      });

      this.$el.on('mouseenter', () => {
        if (this.model.isSingleLanguageOption()) {
          this.$el.tooltip('show');
        }
      });
        
      this.$el.on('mouseleave', () => {
        this.$el.tooltip('hide');
      });
    },
}, {
    TOOLTIP_ON: "Show Subtitles",
    TOOLTIP_OFF: "Hide Subtitles",
    CSS_CLASS_ON: 'vjs-on',
    CSS_CLASS_DISABLED: 'vjs-disabled',
});

export default SubtitleButtonView;
