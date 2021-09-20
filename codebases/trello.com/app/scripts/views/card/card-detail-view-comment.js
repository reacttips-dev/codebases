/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const _ = require('underscore');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const { Util } = require('app/scripts/lib/util');
const TFM = require('app/scripts/lib/markdown/tfm');
const { TrelloStorage } = require('@trello/storage');
const { Auth } = require('app/scripts/db/auth');
const Layout = require('app/scripts/views/lib/layout');
const { getKey, isForceSubmitEvent, Key } = require('@trello/keybindings');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const AutoMentionerView = require('app/scripts/views/internal/autocomplete/auto-mentioner-view');
const {
  applyMarkdownShortcuts,
} = require('app/scripts/views/lib/markdown-transform');
// const {
//   commentInputFocusedState,
// } = require('app/src/components/VideoRecordButton');
const {
  isLoomIntegrationEnabled,
} = require('app/src/components/VideoRecordButton');

const attachmentAsMarkdown = (attachment) =>
  `[${attachment.get('name')}](${attachment.get('url')}) `;

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports._commentDraftKey = function () {
  return `draft_${this.model.id}_comment`;
};

module.exports.saveCommentDraft = function (didCloseCard) {
  if (didCloseCard == null) {
    didCloseCard = false;
  }
  const $input = this.$('.js-new-comment-input');
  if ($input.length === 0) {
    return;
  }
  const commentText = $input.val();
  if (commentText) {
    TrelloStorage.set(this._commentDraftKey(), commentText);
    if (didCloseCard) {
      Analytics.sendTrackEvent({
        action: 'saved',
        actionSubject: 'comment',
        source: 'cardDetailScreen',
        attributes: {
          cardIsTemplate: this.model.get('isTemplate'),
          cardIsClosed: this.model.get('closed'),
          saveWhileClosing: true,
        },
        containers: this.model.getAnalyticsContainers(),
      });
    }
  } else {
    TrelloStorage.unset(this._commentDraftKey());
  }
};

module.exports.keydownCommentEvent = function (e) {
  Auth.me().editing({
    idBoard: this.model.getBoard().id,
    idCard: this.model.id,
    action: 'commenting',
  });

  applyMarkdownShortcuts(e);

  const key = getKey(e);

  if (
    key === Key.Tab &&
    $(e.target).hasClass('new-comment-input') &&
    this.model.editable() &&
    !(PopOver.view instanceof AutoMentionerView) &&
    $(e.target).val() === ''
  ) {
    Util.stop(e);
    this.submitComment(e);
  }

  if (isForceSubmitEvent(e) && !this._isCommentTooLong()) {
    return this.submitComment(e);
  } else {
    return this.checkInsert(e);
  }
};

module.exports._isCommentTooLong = function () {
  return (
    __guard__(this.$('.js-new-comment-input').val(), (x) => x.length) >
    this.maximumCommentLength
  );
};

module.exports.renderCommentSubmitAbility = function (e) {
  const isTooLong = this._isCommentTooLong();
  const noInput =
    __guard__(this.$('.js-new-comment-input').val(), (x) => x.length) === 0;
  const isDisabled = noInput || isTooLong;
  this.$('.js-add-comment').prop('disabled', isDisabled);
  this.$('.js-comment-subscribe').toggleClass(
    'is-visible',
    !isDisabled && !this.model.isSubscribed(),
  );
  this.$('.comment-too-long-warning').toggleClass('is-shown', isTooLong);
  this.$('.comment-too-long-warning')
    .find('.js-attach-comment')
    .toggle(typeof Blob !== 'undefined' && Blob !== null);
  this.renderCommentControls();
  return this;
};

module.exports.renderCommentControls = function (e) {
  const $comment = this.$('.js-new-comment');
  const hasInput =
    __guard__(this.$('.js-new-comment-input').val(), (x) => x.length) > 0;
  $comment.toggleClass('is-show-controls', hasInput);
  return this;
};

module.exports.renderCommentAndSubscribeBox = function (e) {
  this.$('.js-comment-subscribe').toggleClass('is-subscribed');
  return this;
};

module.exports._cancelEditing = function () {
  return Auth.me().editing({ idBoard: this.model.getBoard().id });
};

module.exports.commentInputEvent = function (e) {
  this.renderCommentSubmitAbility();
  this.renderCommentControls();
  this.$('.js-new-comment-input').trigger('autosize.resize');
  return this;
};

module.exports.clearComment = function () {
  const $input = $(this.commentInput);

  $input.val('').css('height', ''); // In case they resized the textarea

  return this.renderCommentSubmitAbility();
};

module.exports.submitComment = function (e) {
  const traceId = Analytics.startTask({
    taskName: 'create-comment',
    source: 'cardDetailScreen',
  });
  let left;
  Analytics.sendTrackEvent({
    action: 'submitted',
    actionSubject: 'comment',
    source: 'cardDetailScreen',
    attributes: {
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
    containers: this.model.getAnalyticsContainers(),
  });
  Util.stop(e);

  const $input = $(this.commentInput);
  const text = $input.val();

  // Check if text contains a Loom link and if so add an attribute
  // to the "added comment" analytics for tracking Loom usage.
  let hasLoomLink = false;
  const isLoomEnabled = isLoomIntegrationEnabled(
    this.model.getBoard()?.get('idEnterprise'),
  );
  if (isLoomEnabled) {
    hasLoomLink = text && /https?:\/\/(?:[^./]+\.)*loom\.com(\/?|$)/.test(text);
  }

  this.clearComment();

  this._cancelEditing();
  this.model.addComment(
    text,
    traceId,
    tracingCallback(
      {
        taskName: 'create-comment',
        source: 'cardDetailScreen',
        traceId,
      },
      (err, response) => {
        if (!err && response) {
          Analytics.sendTrackEvent({
            action: 'added',
            actionSubject: 'comment',
            source: 'cardDetailScreen',
            attributes: {
              taskId: traceId,
              ...(isLoomEnabled && { hasLoomLink }),
            },
            containers: {
              card: { id: response.data?.card?.id },
              list: { id: response.data?.list?.id },
              board: { id: response.data?.board?.id },
              enterprise: {
                id: this.model.getBoard()?.get('idEnterprise'),
              },
              organization: {
                id: this.model?.getBoard()?.getOrganization()?.id,
              },
            },
          });
        }
      },
    ),
  );

  // Tracking for direct mentions of invitees
  let mentionedUsernames =
    (left = __guard__(text != null ? text.match(/@\w+/g) : undefined, (x) =>
      x.map((s) => s.substring(1).toLowerCase()),
    )) != null
      ? left
      : [];
  mentionedUsernames = _.uniq(mentionedUsernames);
  const boardMembers = this.model.getBoard().memberList.models;
  const myId = Auth.me().id;
  mentionedUsernames.forEach((mentionedUsername) => {
    if (
      mentionedUsername !== 'card' &&
      mentionedUsername !== 'board' &&
      mentionedUsername !== 'commenters'
    ) {
      // Find the board member with this username, see if we invited them
      return boardMembers.forEach((boardMember) => {
        if (
          boardMember.get('username') === mentionedUsername &&
          boardMember.get('idMemberReferrer') === myId
        ) {
          return Analytics.sendTrackEvent({
            action: 'mentioned',
            actionSubject: 'invitee',
            source: 'cardDetailScreen',
            attributes: {
              member: myId,
              mentionedMember: boardMember.id,
            },
            containers: this.model.getAnalyticsContainers(),
          });
        }
      });
    }
  });

  if (Auth.me().isSubscribeOnCommentEnabled() && !this.model.isSubscribed()) {
    const subscribeTraceId = Analytics.startTask({
      taskName: 'edit-card/subscribed',
      source: 'cardDetailScreen',
    });
    this.model.subscribeWithTracing(
      true,
      subscribeTraceId,
      tracingCallback(
        {
          taskName: 'edit-card/subscribed',
          source: 'cardDetailScreen',
          traceId: subscribeTraceId,
        },
        (_err, response) => {
          if (response) {
            Analytics.sendUpdatedCardFieldEvent({
              field: 'subscribed',
              source: 'cardDetailScreen',
              containers: {
                card: { id: response.id },
                board: { id: response.idBoard },
                list: { id: response.idList },
              },
              attributes: {
                taskId: subscribeTraceId,
              },
            });
          }
        },
      ),
    );
  }

  Layout.cancelEdits();
  this.collapseComment();
  this.renderCommentSubmitAbility();

  PopOver.hide();
  return false;
};

module.exports.subscribeOnComment = function (e) {
  Util.stop(e);

  const me = Auth.me();

  if (!me.isSubscribeOnCommentEnabled()) {
    Analytics.sendTrackEvent({
      action: 'enabled',
      actionSubject: 'commentAndSubscribe',
      source: 'cardDetailScreen',
      attributes: {
        cardIsTemplate: this.model.get('isTemplate'),
        cardIsClosed: this.model.get('closed'),
      },
      containers: this.model.getAnalyticsContainers(),
    });
  } else {
    Analytics.sendTrackEvent({
      action: 'disabled',
      actionSubject: 'commentAndSubscribe',
      source: 'cardDetailScreen',
      attributes: {
        cardIsTemplate: this.model.get('isTemplate'),
        cardIsClosed: this.model.get('closed'),
      },
      containers: this.model.getAnalyticsContainers(),
    });
  }

  this.renderCommentAndSubscribeBox();

  me.toggleSubscribeOnComment();

  return false;
};

module.exports.truncateComment = function (e) {
  const $comment = this.$('.js-new-comment-input');
  $comment.val($comment.val().substr(0, this.maximumCommentLength));
  this.$('.js-new-comment-input').autosize({ append: false });
  return this.renderCommentSubmitAbility();
};

module.exports.inputComment = function (e) {
  const $comment = this.$('.js-new-comment');
  Layout.cancelEdits(this.commentInput);
  $comment.addClass('is-focused');
  this.$('.js-new-comment-input').autosize({ append: false });
};

module.exports.clickAwayFromComment = function (e) {
  // If there's a popover open, and someone "clicks away," they're
  // *probably* trying to dismiss the popover, not the comment box.
  if (PopOver.isVisible) {
    return;
  }

  // Don't collapse the comment box unless the textarea has blurred.
  // This fixes a bug where you can `mousedown` (to focus the textarea)
  // hold your mouse down, move it out of the comment box, then
  // release (`click`), causing the comment box to collapse.
  if (document.activeElement === this.commentInput) {
    return;
  }

  // Don't collapse if we're clicking anywhere inside the comment area,
  // like on buttons.
  const el = e.target;
  const $comment = this.$('.js-new-comment');

  // We might not have a comment input if we're in template or don't
  // have permission to comment
  if ($comment[0] != null ? $comment[0].contains(el) : undefined) {
    return;
  }

  return this.collapseComment();
};

module.exports.collapseComment = function () {
  this.$('.js-new-comment').removeClass('is-focused');
  // commentInputFocusedState.setValue(false);
  return this.$('.js-new-comment-input').trigger('autosize:destroy');
};

module.exports.replyToAction = function (e, action) {
  const memberCreator = this.modelCache.get(
    'Member',
    action.get('idMemberCreator'),
  );
  const username =
    memberCreator != null ? memberCreator.get('username') : undefined;

  const $comment = this.$(this.commentInput);

  const replyText = (() => {
    let attachment;
    if (action.isCommentLike() && username != null) {
      Layout.cancelEdits(this.commentInput);
      // Only add the @mention if they haven't already added one; maybe they
      // clicked 'reply' twice or something
      if (new RegExp(`@${username}(\\W|$)`).test($comment.val())) {
        $comment.focus();
        return null;
      } else {
        return `@${username} `;
      }
    } else if (
      action.isAddAttachment() &&
      (attachment = this.model.attachmentList.get(
        __guard__(action.get('data').attachment, (x) => x.id),
      )) != null
    ) {
      const attachmentMarkdown = attachmentAsMarkdown(attachment);
      if (Auth.isMe(memberCreator)) {
        return attachmentMarkdown;
      } else {
        return [`@${username}`, attachmentMarkdown].join(' ');
      }
    }
  })();

  if (replyText) {
    $comment.addClass('is-focused');
    Util.insertSelection($comment, replyText);
    $comment.trigger('autosize.resize');
    this.$('.js-new-comment-input').autosize({ append: false });
  }
};

module.exports.replyToAllAction = function (e, action) {
  const memberCreator = this.modelCache.get(
    'Member',
    action.get('idMemberCreator'),
  );
  let username =
    memberCreator != null ? memberCreator.get('username') : undefined;

  // Cache the current values for comment
  const $comment = this.$(this.commentInput);
  const commentText = $comment.val();

  const mentionsFromText = (markdown) =>
    _.uniq(TFM.comments.getMatches(markdown, { atMention: true }).atMention);

  let mentions = _.chain([`@${username}`])
    .concat(mentionsFromText(action.get('data').text))
    .uniq((a) => a.toLowerCase())
    .filter(function (mention) {
      let isMe;
      [username, isMe] = Array.from(TFM.lookupMember(mention.replace('@', '')));
      return !isMe;
    })
    .without(...Array.from(mentionsFromText(commentText) || []))
    .value();

  mentions = _.without(mentions, '@card', '@board');

  Analytics.sendTrackEvent({
    action: 'mentioned',
    actionSubject: 'member',
    source: 'cardDetailScreen',
    attributes: {
      method: _.contains(mentions, '@card')
        ? '@card'
        : _.contains(mentions, '@board')
        ? '@board'
        : '@[member]',
      mentionCount: mentions.length,
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
    containers: this.model.getAnalyticsContainers(),
  });

  if (mentions.length) {
    const replyText = mentions.join(' ') + ' ';
    $comment.addClass('is-focused');
    Util.insertSelection($comment, replyText);
    $comment.trigger('autosize.resize');
  } else {
    $comment.focus();
  }
};

module.exports.replyToAttachment = function (attachment) {
  Layout.cancelEdits(this.commentInput);
  const $comment = this.$(this.commentInput);
  $comment.addClass('is-focused');
  Util.insertSelection($comment, attachmentAsMarkdown(attachment));
  return $comment.trigger('autosize.resize');
};

module.exports.replyToComment = function (replyToComment) {
  if (this.model.getBoard().canComment(Auth.me()) && replyToComment) {
    const $newCommentInput = this.$('.js-new-comment-input');
    $newCommentInput.val(`@${replyToComment} `);
    $newCommentInput.focus();
    Util.setCaretAtEnd($newCommentInput[0]);
  }

  this.renderCommentSubmitAbility();
};
