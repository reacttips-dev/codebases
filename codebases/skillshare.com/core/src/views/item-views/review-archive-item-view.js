import BaseView from 'core/src/views/base/base-view';
import ConfirmationPopoverView from 'core/src/views/modules/confirmation-popover';
import archiveReviewTemplate from 'text!core/src/templates/items/_review-archive-item-view.mustache';
import userSnippetTemplate from 'text!core/src/templates/partials/_user-snippet.mustache';
import Mustache from 'mustache';

const ReviewArchiveItemView = BaseView.extend({
  //TODO: Update ReviewArchiveItemView to extend SSView
  tagName: 'div',
  className: 'archive-review',

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    BaseView.prototype.initialize.apply(this, arguments);
  },

  render: function() {
    const data = this.model.attributes;
    const partials = {
      'partials/_user-snippet': userSnippetTemplate,
    };
    const html = Mustache.render(archiveReviewTemplate, data, partials);
    this.$el.html(html);
  },

  afterRender: function() {
    const confirmDelete = new ConfirmationPopoverView({
      message: 'Delete this review?',
      confirmButtonText: 'Delete',
      anchor: this.$('.review-delete'),
    });
    this.listenTo(confirmDelete, 'confirm', this.destroy);
  },

  destroy: function() {
    this.model.destroy();
  },
});

export default ReviewArchiveItemView;
