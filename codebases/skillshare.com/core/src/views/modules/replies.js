import BaseView from 'core/src/views/base/base-view';
import RepliesCollectionView from 'core/src/views/collection-views/replies-collection-view';
import ReplyModel from 'core/src/models/reply';
import ReplyItemView from 'core/src/views/item-views/reply-item-view';
import FormHelpers from 'core/src/helpers/form-helpers';
import StickitHelpers from 'core/src/helpers/stickit-helpers';
import 'jquery-autosize';

const RepliesView = BaseView.extend({

  activityModel: null,

  bindings: {
    '.comment': {
      observe: 'comment',
      updateView: false,
    },
  },

  events: function() {
    return _.extend(BaseView.prototype.events.call(this), {
      'click .btn-submit': 'onClickPost',
      'focus textarea': 'onFocus',
    });
  },

  initialize: function(options) {
    BaseView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'fetchAll', 'onClickPost', 'onPostError');
    _.extend(this, _.pick(options, ['replyItemView']));

    this.$el.show();

    this.repliesListEl = this.$('.replies-list');

    // Marks whether we have fetched everything
    // If the collection already contains the number of replies (or more) then everything has been fetched.
    this.fetched = this.collection.length >= this.options.activityModel.get('numReplies') ? true : false;

    if (!_.isUndefined(this.options.activityModel.get('lastReply'))) {
      this.lastReply = this.collection.last();
    }

    // Automatically renders any items that are already in the collection
    this.repliesCollectionView = new RepliesCollectionView({
      collection: this.collection,
      el: this.repliesListEl,
      autoRender: true,
      animateOnRemove: true,
      itemView: this.replyItemView ? this.replyItemView : ReplyItemView,
    });

    // Render reply form
    FormHelpers.renderForm(this.$('form'));

    this.model = new ReplyModel();

    this.stickit();

    // ActivityItemView shares this model which triggers a showAll event
    this.options.activityModel.on('showAll', this.fetchAll);
  },

  afterRender: function() {
    BaseView.prototype.afterRender.apply(this, arguments);
    // Allow reply textarea to autosize
    // We need a timeout in order for the el to be visible before we render
    window.setTimeout(() => {
      if (this.$('form textarea').length > 0) {
        this.$('form textarea').autosize();
      }
    }, 1000);
  },

  fetchAll: function() {
    if (this.fetched) {return;}

    const timestamp = this.lastReply ? this.lastReply.get('timestamp') : undefined;

    this.options.activityModel.trigger('loading', true, this.repliesListEl);

    this.collection.fetchMore({ data: { baseTimestamp: timestamp } });

    this.collection.on('update', () => {
      this.repliesCollectionView.renderAllItems();
      this.options.activityModel.trigger('loading', false, this.repliesListEl);
      this.fetched = true;
    });
  },

  onFocus: function(e) {
    e.stopPropagation();

    $(e.currentTarget).parent()
      .addClass('hasButton');
    $(e.currentTarget).parent()
      .find('.post-button-wrapper')
      .show();
  },

  onClickPost: function(e) {
    e.preventDefault();
    if ($(e.currentTarget).hasClass('disabled')) {
      return;
    }

    $(e.currentTarget).addClass('disabled');

    // Reset form by clearing any exiting errors
    const textareaEl = this.$('textarea');

    FormHelpers.hideFieldMessage(textareaEl);


    // Wait defines that we're not going to immediately add the new model to the collection
    // Instead, we'll wait for the server to return success
    this.collection.create(this.model.attributes, {
      wait: true,
      error: this.onPostError,
      success: () => {
        this.repliesListEl.show();
        // Re-enable button
        this.$('.btn-submit').removeClass('disabled');
        // Clear out textarea
        textareaEl.val('').trigger('blur');
        // Reset height
        textareaEl.css('height', '16px');
        // Empty model of reply we just created
        this.model.set('comment', '');
      },
    });

  },

  onPostError: function(model, response) {
    this.$('.btn-submit').removeClass('disabled');

    if (response.status === 400) {
      const errors = $.parseJSON(response.responseText);

      StickitHelpers.handleValidationErrors(this, errors.errors, {
        inErrorState: true,
        showErrors: true,
      });
    }
  },

});

export default RepliesView;
