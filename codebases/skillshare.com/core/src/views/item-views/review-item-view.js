import Review from 'core/src/models/review';
import BaseView from 'core/src/views/base/base-view';
import ReviewEditForm from 'core/src/views/forms/review-edit-form';
import ConfirmationPopoverView from 'core/src/views/modules/confirmation-popover';
import TimestampHelper from 'core/src/helpers/timestamp-helper';
import reviewTemplate from 'text!core/src/templates/items/_review-item-view.mustache';
import userSnippetTemplate from 'text!core/src/templates/partials/_user-snippet-reviews.mustache';
import Mustache from 'mustache';

const ReviewItemView = BaseView.extend({
  //TODO: Update ReviewItemView to extend SSView

  tagName: 'div',

  className: 'review',

  events: {
    'click .review-edit': 'onEdit',
  },

  initialize: function() {
    this.levelSelectors = ['none', 'beginner', 'intermediate', 'advanced', 'all', 'beg-int', 'int-adv'];

    this.listenTo(this.model, 'change', this.render);
    BaseView.prototype.initialize.apply(this, arguments);
  },

  render: function() {
    const data = this.model.attributes;
    const partials = {
      'partials/_user-snippet-reviews': userSnippetTemplate,
    };
    const html = Mustache.render(reviewTemplate, data, partials);

    this.$el.html(html);
  },

  afterRender: function() {
    this.setViewOptions();
    this.setTimeAgo();
    const confimDelete = new ConfirmationPopoverView({
      message: 'Delete this review?',
      confirmButtonText: 'Delete',
      anchor: this.$('.review-delete'),
    });
    this.listenTo(confimDelete, 'confirm', this.destroy);

    const confirmFlag = new ConfirmationPopoverView({
      message: 'Flag this review as low quality? It will no longer show up across the site.',
      confirmButtonText: 'Flag',
      anchor: this.$('.review-flag'),
    });
    this.listenTo(confirmFlag, 'confirm', this.flag);
  },

  onEdit: function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    this.$el.find('.content').hide();

    const reviewEditForm = new ReviewEditForm({
      initialModel: this.model,
      container: this.$el.find('.edit-form'),
    });

    this.listenTo(reviewEditForm, 'cancel', this.update);
  },

  destroy: function() {
    this.model.destroy({
      dataType: 'text',
      success: () => {
        SS.events.trigger('alerts:create', {
          title: 'Your review has been deleted.',
          type: 'success',
        });
      },
    });
  },

  flag: function() {
    this.model.save({
      flag_status: Review.FLAG_STATUS.LOW_QUALITY,
    });
  },

  setViewOptions: function() {
    this.$('.expectations li, .level li').removeClass('active');
    this.$(`.expectations li[data-value='${this.model.attributes.overallRating}']`).addClass('active');
    this.$(`.level li[data-value='${this.model.attributes.levelingRating}']`).addClass('active');
    this.$('.level-indicator').addClass(this.levelSelectors[this.model.attributes.levelingRating]);
  },

  setTimeAgo: function() {
    const timestamp = this.model.get('createTime');
    const text = `Posted ${TimestampHelper.getTimeAgo(timestamp)}`;

    this.$('.review-timestamp').text(text);
  },

});

export default ReviewItemView;

