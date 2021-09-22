import SSView from 'core/src/views/base/ss-view';
import ActionPopupView from 'core/src/views/popups/action-popup';
import TimestampHelper from 'core/src/helpers/timestamp-helper';
import StringHelpers from 'core/src/helpers/string-helpers';
import FormHelpers from 'core/src/helpers/form-helpers';
import ComponentInitializers from 'core/src/helpers/component-initializers';
import InlineEditable from 'core/src/views/modules/inline-editable';
import MoreTextView from 'core/src/views/modules/more-text';
import LikeButton from 'core/src/views/modules/buttons/like-button';
import template from 'text!core/src/templates/items/reply-item.html';
import userSnippetTemplate from 'text!core/src/templates/partials/user-snippet.html';
import 'jquery-autosize';

function toEditable(comment) {
  let sanitizedComment = comment.replace(/<br\s*\/?>/mg, '\n'); // convert line breaks to newline
  sanitizedComment = sanitizedComment.replace(/<[^>]+>/g, ''); // strip all html, including hyperlinks
  return sanitizedComment;
}

const ReplyItemView = SSView.extend({

  tagName: 'li',

  className: 'reply-item clear',

  template: template,

  templateData: function() {
    const user = this.model.get('user');
    // TODO: leaving these as == for now because the response we get back from /comments/<id> still includes user.id as a string
    const shouldShowEdit = (SS.currentUser.get('id') === user.id || SS.currentUser.get('isAdmin') === 1);
    const shouldShowDelete = shouldShowEdit || this.model.collection.activityModel.get('isCurrentUserGroupAdmin');

    return _.extend({}, this.model.attributes, {
      timeago: TimestampHelper.getTimeAgo(this.model.get('timestamp')),
      shouldShowLike: !SS.currentUser.isGuest(),
      shouldShowEdit: shouldShowEdit,
      shouldShowDelete: shouldShowDelete,
      comment: this.toHTML(this.model.get('comment')),
    });
  },

  initialize: function() {
    if (this.model.get('greatestAncestor') && this.model.get('greatestAncestor').user_uid === this.model.get('user').id) {
      const user = this.model.get('user');
      user.isCreator = true;
      this.model.set('user', user);
    }
    SSView.prototype.initialize.apply(this, arguments);
  },

  toHTML: function(comment) {
    return StringHelpers.addHTMLLineBreaks(comment);
  },

  templatePartials: {
    userSnippet: userSnippetTemplate,
  },

  events: {
    'click .js-action-delete': 'onClickDelete',
    'click .js-action-edit': 'onClickEdit',
  },

  render: function() {
    SSView.prototype.render.apply(this, arguments);
    ComponentInitializers.initPopovers(this);
  },

  afterRender: function() {
    this.$replyStatLikes = this.$('.reply-stat-likes');

    new MoreTextView({
      el: this.$('.body-content'),
      model: new Backbone.Model({
        text: this.model.get('comment'),
      }),
    });

    this.initializeLikeButton();

    SSView.prototype.afterRender.apply(this, arguments);
  },

  initializeLikeButton: function() {
    const data = {
      voteable_id: this.model.get('id'),
      voteable_type: 'Comment',
    };

    const userVote = this.model.get('userVote');
    if (userVote && userVote.value === 1) {
      _.extend(data, {
        voteId: userVote.id,
      });
    }

    new LikeButton({
      container: this.$('.js-action-like'),
      parentModel: this.model,
      modelData: data,
      type: 'label',
      styles: 'secondary',
    });
    this.listenTo(this.model, 'change:numLikes', this.onLikeUpdate);
  },

  onLikeUpdate: function(model, numLikes) {
    const userVote = this.model.get('userVote');
    if (userVote && userVote.value === 1) {
      this.$replyStatLikes.addClass('liked');
    } else {
      this.$replyStatLikes.removeClass('liked');
    }

    if (numLikes < 1) {
      this.$replyStatLikes.hide();
      return;
    }

    this.$replyStatLikes.html(numLikes).show();
  },

  onClickEdit: function(e) {
    e.preventDefault();

    const oldMsg = this.model.get('comment');
    this.model.set('comment', toEditable(oldMsg));

    const ie = new InlineEditable({
      el: this.$('.meta:first'),
      parentModel: this.model,
      parentView: this,
      editable: {
        'comment': {
          selector: '.body-content:first',
          type: 'textarea',
          'class': 'single-line',
        },
      },
    });
    this.$('textarea.single-line').autosize();

    ie.on('done', function() {
      const reply = this;
      // prevent empty reply
      if (this.model.get('comment') === '') {
        FormHelpers.showFieldMessage(this.$('textarea.single-line'));
        ie.stickit();
      } else {
        this.model.save(null, {
          wait: true,
          success: function() {
            reply.render();
          },
        });
      }
    }, this);
    ie.on('cancel', function() {
      this.model.set('comment', oldMsg);
      this.render();
    }, this);
  },

  onClickDelete: function(e) {
    e.preventDefault();

    const popup = new ActionPopupView({
      title: 'Delete Post',
      content: '<p>Are you sure you\'d like to delete this post?</p>',
      submitBtnVal: 'Delete',
    });

    popup.openPopup();

    popup.bind('onConfirmationDidConfirmEvent', () => {
      this.model.destroy();
    });
  },

});

export default ReplyItemView;

