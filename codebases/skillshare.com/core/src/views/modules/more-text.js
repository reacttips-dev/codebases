import SSView from 'core/src/views/base/ss-view';
import template from 'text!core/src/templates/modules/more-text.mustache';
import 'jquery-truncate';

const MoreTextView = SSView.extend({

  truncateLength: 350,

  template: template,

  templateData: function() {
    // when initailized model should be new Backbone.Model() w/ text and optionally truncatedText
    // if truncatedText is not passed in we try to truncate the text here
    // attributes (see workshop-discussion-item-view.js for example
    if (!_.has(this.model.attributes, 'truncatedText')) {
      const text = this.model.get('text');
      let truncatedText = null;
      if (text.length > this.truncateLength) {
        truncatedText = $.truncate(text, { length: this.truncateLength, ellipsis: '... <a href="javascript:;" class="text-more">Read More</a>' });
      }
      this.model.set('truncatedText', truncatedText);
    }
    return this.model.attributes;
  },

  events: {
    'click .text-more': 'onClickTextMore',
  },

  onClickTextMore: function() {
    this.$('.more-text-container').html(this.model.get('text'));
  },

});

export default MoreTextView;

