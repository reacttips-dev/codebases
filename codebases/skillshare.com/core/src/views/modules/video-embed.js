import Common from 'core/src/common';
import SSView from 'core/src/views/base/ss-view';
import FormHelpers from 'core/src/helpers/form-helpers';
import VideoSize from 'core/src/models/video-size';
import template from 'text!core/src/templates/partials/_video-embed-form.mustache';
import embedTemplate from 'text!core/src/templates/partials/_video-embed.mustache';
import Mustache from 'mustache';

const VideoEmbedView = SSView.extend({

  events: {
    'change .video-size-selector': 'onDropdownChange',
    'keyup .custom-height': 'onHeightInput',
    'keyup .custom-width': 'onWidthInput',
  },

  template: template,

  templateData: function() {
    return _.extend({
      sizes: this.sizes,
      width: this.model.get('width'),
      height: this.model.get('height'),
      hostName: 'https://' + window.location.hostname,
    }, this.options.templateOptions);
  },

  templatePartials: function() {
    return {
      '_video-embed': this.getEmbedCode(),
    };
  },

  sizes: [
    { value: 'small', width: 480, height: 270 },
    { value: 'medium', width: 640, height: 360 },
    { value: 'large', width: 800, height: 450 },
  ],

  maxWidth: 1920,
  maxHeight: 1080,
  minWidth: 0,
  minHeight: 0,

  initialize: function(options) {
    this.options = options;

    // Initialize models
    this.model = new VideoSize();
    this.model.on('change', this.onChange, this);

    // Render the view
    this.render();

    this.customDimensionsEl = this.$('.custom-dimensions');
    this.textareaEl = this.$('textarea');
    this.previewImageEl = this.$('.preview-image');
    this.customWidthEl = this.$('.custom-width');
    this.customHeightEl = this.$('.custom-height');
  },

  render: function() {
    SSView.prototype.render.apply(this, arguments);

    // Update all form elements
    Common.addShortUrlFocusEvents();
    FormHelpers.initInputsAndSelectMenus(this.$el);
    FormHelpers.initPlaceholders(this.$el);
  },

  // Get the HTML for the embed code
  getEmbedCode: function() {
    return Mustache.render(embedTemplate, this.templateData());
  },

  onDropdownChange: function(ev) {
    const input = $(ev.currentTarget);
    const selected = input.find(':selected');
    const value = input.val();

    if (value === 'custom') {
      this.customDimensionsEl.css('display', 'inline-block');
    } else {
      this.customDimensionsEl.css('display', '');

      const width = selected.data('ss-width');
      const height = selected.data('ss-height');

      this.model.set({ width, height });
    }
  },

  onHeightInput: function(ev) {
    const input = $(ev.currentTarget);
    const height = parseInt(input.val(), 10);
    const isValid = !_.isNaN(height);

    if (!isValid) {
      return;
    }

    // User input higher than the maximum height, so set it to the maximum
    if (height > this.maxHeight) {
      this.setMaximum();
    } else if (height < this.minHeight) {
      this.setMinimum();
    } else {
      const width = Math.round((16 / 9) * height);
      this.model.set({ width: width, height: height });
    }
  },

  onWidthInput: function(ev) {
    const input = $(ev.currentTarget);
    const width = parseInt(input.val(), 10);
    const isValid = !_.isNaN(width);

    if (!isValid) {
      return;
    }

    if (width > this.maxWidth) {
      this.setMaximum();
    } else if (width < this.minWidth) {
      this.setMinimum();
    } else {
      const height = Math.round((width / 16) * 9);
      this.model.set({ width: width, height: height });
    }
  },

  setMaximum: function() {
    this.model.set({ width: this.maxWidth, height: this.maxHeight });
  },

  setMinimum: function() {
    this.model.set({ width: this.minWidth, height: this.minHeight });
  },

  // When the width or height has been updated
  onChange: function() {
    this.customWidthEl.removeClass('placeholder');
    this.customHeightEl.removeClass('placeholder');

    // Update the input values
    this.customWidthEl.val(this.model.get('width'));
    this.customHeightEl.val(this.model.get('height'));

    // Update the textarea with the new embed code
    const embedCode = this.getEmbedCode();
    this.textareaEl.text(embedCode);
  },

});

export default VideoEmbedView;
