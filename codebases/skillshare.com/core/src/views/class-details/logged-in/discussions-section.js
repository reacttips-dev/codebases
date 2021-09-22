import ClassSectionView from 'core/src/views/class-details/logged-in/section';
import Common from 'core/src/common';
import InlineDiscussionModel from 'core/src/models/inline-discussion';
import InlineDiscussionsCollection from 'core/src/collections/inline-discussions';
import InlineDiscussionsCollectionView from 'core/src/views/collection-views/inline-discussions-collection-view';
import InlineDiscussionItemView from 'core/src/views/item-views/inline-discussion-item-view';
import InfiniteScrollerView from 'core/src/views/modules/infinite-scroller';
import DiscussionForm from 'core/src/views/forms/discussion-form';
import UserListPopupView from 'core/src/views/popups/user-list-popup';
import template from 'text!core/src/templates/class-details/shared/_discussions-section.mustache';
import userProjectTemplate from 'text!core/src/templates/class-details/shared/_user-project.mustache';
import smallListViewGridItemTemplate from 'text!core/src/templates/shared/_small-list-view-grid-item.mustache';
import ComponentInitializers from 'core/src/helpers/component-initializers';
import FormHelpers from 'core/src/helpers/form-helpers';
import Utils from 'core/src/base/utils';

const DiscussionsSectionView = ClassSectionView.extend({

  template: template,
  
  templatePartials: {
    'class-details/shared/_user-project': userProjectTemplate,
    'shared/_small-list-view-grid-item': smallListViewGridItemTemplate,
  },

  templateData: function() {
    return this.model.attributes;
  },

  events: {
    'click .sidebar-section-title-students': 'openUserListPopup',
  },

  initialize: function(options) {
    const preRendered = options && !!options.el;

    if (preRendered) {
      this.afterRender();
    }

    this.on('attached', this.onAttached);
    this.on('unattach', this.onUnattach);
    ClassSectionView.prototype.initialize.apply(this, arguments);
  },

  onAttached: function() {
    FormHelpers.initRichTextareas(this.$el);
    this.listenTo(Backbone, 'change:discussions:pinDiscussion', this.onPinDiscussion);
  },

  onUnattach: function() {
    this.$('textarea.rich').data('ss-initialized', false);
    this.stopListening(Backbone, 'change:discussions:pinDiscussion');
  },

  afterRender: function() {
    const $discussionsList = this.$('.discussions-list');
    const listData = this.model.get('list');

    this.discussions = new InlineDiscussionsCollection(listData.discussions, {
      loadMore: listData.loadMore,
      _modelId: this.model.get('parentClassData').id,
      comparator: model => -model.get('lastActivityTimeTimestamp'),
    });
    this.discussions.url = listData.discussionsUrl;

    this.discussionsCollectionView = new InlineDiscussionsCollectionView({
      collection: this.discussions,
      el: $discussionsList,
      fallbackEl: this.$('.empty-discussions'),
    });

    new InfiniteScrollerView({
      collection: this.discussions,
      container: $discussionsList,
    });

    this.createDiscussionForm();
    this.setupPinnedDiscussion();

    ComponentInitializers.initUserPopovers(this);
    Common.initRestrictedAccessHandlers(this);
    ClassSectionView.prototype.afterRender.apply(this, arguments);

    SS.events.on('userCanCreateDiscussion', this.setUserCanCreateDiscussion.bind(this));
  },

  createDiscussionForm: function() {
    if (!this.model.get('canUserCreate')) {
      return;
    }

    const parentClassDiscussion = new InlineDiscussionModel({
      discussable_id: this.model.get('parentClassData').id,
      type: 'Announcement',
      discussable_type: 'ParentClasses',
    });

    this.discussionForm = new DiscussionForm({
      model: parentClassDiscussion,
      currentUser: SS.currentUser,
      container: this.$('.discussion-form-wrapper'),
      templateData: {
        formTogglePlaceholder: 'Post a question or start a conversation with your class!',
        currentUser: _.extend({
          canNotifyAll: this.model.get('canNotifyAll'),
        }, SS.currentUser.attributes),
        discussionTypes: this.model.get('discussionTypes'),
      },
    });
    this.listenTo(this.discussionForm, 'new:discussion', this.onNewDiscussion);
  },

  setupPinnedDiscussion: function() {
    if (this.pinnedDiscussion) {
      this.pinnedDiscussion.unbind();
      this.pinnedDiscussion.remove();
    }

    const data = this.model.get('pinnedDiscussionData');
    this.$('.pinned-discussion-wrapper').toggleClass('hidden', _.isEmpty(data));

    if (!_.isEmpty(data)) {
      const pinnedDiscussionModel = new InlineDiscussionModel(data);
      this.pinnedDiscussion = new InlineDiscussionItemView({
        model: pinnedDiscussionModel,
        container: this.$('.pinned-discussion'),
      });

      pinnedDiscussionModel.on('destroy', () => {
        this.$('.pinned-discussion-wrapper').toggleClass('hidden', true);
        this.model.set('pinnedDiscussionData', null);
      });
    }
  },

  onNewDiscussion: function(discussion) {
    this.discussions.unshift(discussion);
    this.discussionForm.remove();
    this.createDiscussionForm();
  },

  openUserListPopup: function () {
    new UserListPopupView({
      title: 'Students',
      emptyMessage: 'There are no students in this class.',
      url: this.model.get('studentsListUrl'),
    });
  },

  setUserCanCreateDiscussion: function ({canUserCreateDiscussion}) {
    this.model.set('canUserCreate', canUserCreateDiscussion);
  },

  onPinDiscussion: function (discussion) {
    const wasPinned = discussion.get('isPinned');
    const verb = wasPinned ? 'DELETE' : 'POST';
    const endpoint = `/discussions/${discussion.get('id')}/pin`;

    Utils.ajaxRequest(endpoint, {
      type: verb,
      success: () => {
        const data = this.model.get('pinnedDiscussionData');
        if (wasPinned) {
          this.model.set('pinnedDiscussionData', null);
          discussion.set('isPinned', false);
          this.discussions.add(discussion);
          this.setupPinnedDiscussion();
        } else {
          if (!_.isEmpty(data)) {
            const oldPinnedDiscussion = JSON.parse(JSON.stringify(data));
            oldPinnedDiscussion.isPinned = false;
            this.discussions.add(new InlineDiscussionModel(oldPinnedDiscussion));
          }

          discussion.set('isPinned', true);
          this.model.set({ pinnedDiscussionData: discussion.attributes }, { silent: true });
          this.setupPinnedDiscussion();
          this.discussions.remove(discussion.get('id'));
        }
      },
      error: () => {
        SS.events.trigger('alerts:create', {
          title: 'Discussion could not be pinned, please try again',
          type: 'error',
        });
      },
    });
  },

});

export default DiscussionsSectionView;
