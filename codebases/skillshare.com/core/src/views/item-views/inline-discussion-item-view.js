import SSView from 'core/src/views/base/ss-view';
import RepliesCollection from 'core/src/collections/replies';
import RepliesView from 'core/src/views/modules/replies';
import LikeButton from 'core/src/views/modules/buttons/like-button';
import FollowDiscussionButton from 'core/src/views/modules/buttons/follow-discussion-button';
import MoreTextView from 'core/src/views/modules/more-text';
import ActionPopupView from 'core/src/views/popups/action-popup';
import FormPopupView from 'core/src/views/popups/form-popup';
import Common from 'core/src/common';
import ComponentInitializers from 'core/src/helpers/component-initializers';
import TimestampHelper from 'core/src/helpers/timestamp-helper';
import defaultTemplate from 'text!core/src/templates/discussions/default.mustache';
import viewTemplate from 'text!core/src/templates/discussions/view.mustache';
import 'jquery-autosize';

const InlineDiscussionItemView = SSView.extend({

  className: 'inline-discussion',

  templateData: function() {
    const comments = this.model.get('comments');
    return _.extend({}, this.model.attributes, {
      isPremiumMember: SS.currentUser.isPremiumMember(),
      isAdmin: SS.currentUser.isAdmin(),
      timeAgo: this.getTimeAgo(),
      currentUser: SS.currentUser.attributes,
      userIsGuest: SS.currentUser.isGuest(),
      numReplies: comments.length,
      truncateReplies: this.shouldTruncateReplies(comments, this.model.get('expanded')),
      discussableCreator: function() {
        return this.discussableCreatorId && this.discussableCreatorId === this.author.uid;
      },
    });
  },

  templatePartials: {
    'discussions/default': defaultTemplate,
  },

  events: {
    'click .js-discussion-reply': 'onClickReply',
    'click .js-discussion-edit': 'onClickEdit',
    'click .js-discussion-delete': 'onClickDelete',
    'click .js-discussion-pin': 'onClickPin',
    'click .js-show-all': 'onClickShowAll',
    'click .js-group-preview-join-btn': 'onClickJoinGroup',
    'click .navigation.back': 'onClickBack',
  },

  initialize: function(options) {
    this.template = this.model.get('discussionsUrl') ? viewTemplate : defaultTemplate;

    let comments = this.model.get('comments');
    _.extend(this, _.pick(options, ['collectionView']));
    this.model.set('expanded', false);
    this.model.set('additionalReplyCount', comments.length - 2);
    this.model.set('hiddenCreatorReplyCount', this.countHiddenCreatorReplies(comments));

    this.on('addedToParent', () => {
      Common.initRestrictedAccessHandlers(this);
    });

    // TODO if things get slow, load comments incrementally and change show all to fetch more
    if (comments.length > 2) {
      comments = _.last(comments, 2);
    }

    this.replies = new RepliesCollection(comments, {
      activityModel: this.model,
      parse: true,
    });

    SSView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    this.$discussionStatFollowers = this.$('.js-discussion-stat-followers');
    this.$discussionStatLikes = this.$('.js-discussion-stat-likes');
    this.$discussionStatReplies = this.$('.js-discussion-stat-replies');

    this.initializeLikeButton();
    this.initializeFollowButton();
    this.initializePinButton();

    this.repliesView = new RepliesView({
      el: this.$('.js-replies'),
      activityModel: this.model,
      collection: this.replies,
    });
    this.listenTo(this.replies, 'add remove', this.onRepliesUpdate);

    ComponentInitializers.initUserPopovers(this);
    Common.initAllImages(this.$el);

    new MoreTextView({
      el: this.$('.js-discussion-body'),
      model: new Backbone.Model({
        text: this.model.get('description'),
      }),
    });

    this.$('.js-comment').autosize();

    SSView.prototype.afterRender.apply(this, arguments);
  },

  initializeLikeButton: function() {
    const data = {
      voteable_id: this.model.get('id'),
      voteable_type: 'Discussion',
    };

    const userVote = this.model.get('userVote');
    if (userVote && parseInt(userVote.value, 10) === 1) {
      _.extend(data, {
        voteId: this.model.get('userVote').id,
      });
    }

    new LikeButton({
      container: this.$('.js-discussion-like'),
      parentModel: this.model,
      modelData: data,
      type: 'label',
      styles: 'secondary',
    });
    this.listenTo(this.model, 'change:numLikes', this.onLikeUpdate);
  },

  initializeFollowButton: function() {
    const followModel = new Backbone.Model({
      discussion: this.model.get('id'),
      id: this.model.get('userFollow'),
    });

    new FollowDiscussionButton({
      el: this.$('.js-discussion-follow'),
      model: followModel,
      parentModel: this.model,
    });
    this.listenTo(this.model, 'change:numFollowers', this.onFollowerUpdate);
  },

  initializePinButton: function() {
    if (this.$('.js-discussion-pin').length) {
      const isPinned = this.model.get('isPinned');
      this.$('.js-discussion-pin').text(isPinned ? 'Unpin' : 'Pin to Top');
    }
  },

  getTimeAgo: function() {
    if (this.model.get('isGroup')) {
      const timestamp = this.model.get('createTimeTimestamp');
      return `Posted ${TimestampHelper.getTimeAgo(timestamp)}`;
    } else {
      const comments = this.model.get('comments');
      let timestamp = this.model.get('updateTimeTimestamp');

      if (comments && comments.length) {
        const mostRecentComment = _.last(comments);
        ({ timestamp } = mostRecentComment);
      }

      return `Last active ${TimestampHelper.getTimeAgo(timestamp)}`;
    }
  },

  onFollowerUpdate: function(model, numFollowers) {
    if (numFollowers < 1) {
      this.$discussionStatFollowers.hide();
      return;
    }

    this.$discussionStatFollowers.html(numFollowers).show();
  },

  onLikeUpdate: function(model, numLikes) {
    const userVote = this.model.get('userVote');
    if (userVote && userVote.value === 1) {
      this.$discussionStatLikes.addClass('liked');
    } else {
      this.$discussionStatLikes.removeClass('liked');
    }

    if (numLikes < 1) {
      this.$discussionStatLikes.hide();
      return;
    }

    this.$discussionStatLikes.html(numLikes).show();
  },

  onRepliesUpdate: function() {
    const comments = this.model.get('comments');
    if (this.replies.length < 1) {
      this.$discussionStatReplies.hide();
      return;
    }

    let totalReplyCount = this.replies.length;
    if (this.shouldTruncateReplies(comments, this.model.get('expanded'))) {
      totalReplyCount = (comments.length - 2) + totalReplyCount;
    }
    this.$discussionStatReplies.html(totalReplyCount).show();
  },

  onClickReply: function() {
    this.$('.reply-form textarea').focus();
  },

  onClickEdit: function(e) {
    e.preventDefault();

    new FormPopupView({
      endpoint: '/discussions/renderForm',
      endpointData: {
        'discussionId': this.model.get('id'),
        'showRichDescription': 'true',
      },
    });
  },

  onClickDelete: function(e) {
    e.preventDefault();

    const popup = new ActionPopupView({
      title: 'Delete Discussion',
      content: '<p>Are you sure you\'d like to delete this discussion?</p>',
      submitBtnVal: 'Delete',
    });

    popup.openPopup();

    this.listenTo(popup, 'onConfirmationDidConfirmEvent', () => {
      this.model.destroy();
      if (SS.serverBootstrap.pageData && SS.serverBootstrap.pageData.baseUrl) {
        window.location = SS.serverBootstrap.pageData.baseUrl;
      }
    });
  },

  onClickPin: function(e) {
    e.preventDefault();

    Backbone.trigger('change:discussions:pinDiscussion', this.model);
  },

  onClickShowAll: function() {

    this.replies = new RepliesCollection(this.model.get('comments'), {
      activityModel: this.model,
      parse: true,
    });
    this.model.set('expanded', true);
    this.render();
  },

  shouldTruncateReplies: function(replies, expanded) {
    return replies.length > 2 && !expanded;
  },

  onClickJoinGroup: function() {
    Backbone.trigger('change:groups:joinGroupFromDiscussionItem');
  },

  onClickBack: function(e) {
    e.preventDefault();
    const discussionsUrl = this.model.get('discussionsUrl');
    Backbone.history.navigate(discussionsUrl, true);
  },

  countHiddenCreatorReplies: function(replies) {
    if (replies.length <= 2) {
      return 0;
    } else {
      const hiddenReplies = replies.slice(0, replies.length - 2);
      return _.filter(hiddenReplies, function(reply) {
        return reply.greatestAncestor && reply.greatestAncestor.user_uid === reply.user.id;
      }).length;
    }
  },

});

export default InlineDiscussionItemView;

