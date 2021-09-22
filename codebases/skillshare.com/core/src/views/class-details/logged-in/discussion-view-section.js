import ClassSectionView from 'core/src/views/class-details/logged-in/section';
import ClassDiscussionModel from 'core/src/models/class-discussion';
import FollowFormView from 'core/src/views/forms/follow-form';
import InlineDiscussionItemView from 'core/src/views/item-views/inline-discussion-item-view';
import FormHelpers from 'core/src/helpers/form-helpers';

const DiscussionViewSectionView = ClassSectionView.extend({

  legacyRender: true,

  initialize: function(options = {}) {
    _.extend(this, _.pick(options, 'classModel'));

    this.on('attached', this.onAttached);
    this.on('unattach', this.onUnattach);

    ClassSectionView.prototype.initialize.apply(this, arguments);
  },

  onAttached: function() {
    FormHelpers.initRichTextareas(this.$el);
  },

  onUnattach: function() {
    this.$('textarea.rich').data('ss-initialized', false);
  },

  afterRender: function() {
    this.discussionModel = new ClassDiscussionModel(this.model.get('discussion'), {
      classModel: this.classModel,
    });

    new InlineDiscussionItemView({
      model: this.discussionModel,
      el: this.$el,
    });

    new FollowFormView({
      el: this.$('.discussion-meta .action-follow-unfollow'),
    });

    ClassSectionView.prototype.afterRender.apply(this, arguments);
  },

});

export default DiscussionViewSectionView;


