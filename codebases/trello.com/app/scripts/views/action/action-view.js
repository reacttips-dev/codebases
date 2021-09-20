/* eslint-disable
    eqeqeq,
    no-empty,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const ActivityMemberMenuView = require('app/scripts/views/member-menu-profile/activity-member-menu-view');
const { siteDomain } = require('@trello/config');
const AttachmentHelpers = require('app/scripts/views/attachment/helpers');
const AttachmentViewer = require('app/scripts/views/internal/attachment-viewer');
const { Auth } = require('app/scripts/db/auth');
const BoardDisplayHelpers = require('app/scripts/views/internal/board-display-helpers');
const Browser = require('@trello/browser');
const { Controller } = require('app/scripts/controller');
const { Dates } = require('app/scripts/lib/dates');
const { EntityDisplay } = require('app/scripts/lib/entity-display');
const {
  hasSelection,
} = require('app/scripts/lib/util/selection/has-selection');
const { KnownServices } = require('app/scripts/db/known-services');
const { ModelCache } = require('app/scripts/db/model-cache');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const ReactionPiles = require('app/scripts/views/reactions/reaction-piles');
const TFM = require('app/scripts/lib/markdown/tfm');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const friendlyLinks = require('app/scripts/views/internal/friendly-links');
const moment = require('moment');
const templates = require('app/scripts/views/internal/templates');
const { Analytics } = require('@trello/atlassian-analytics');
const { track, trackUe } = require('@trello/analytics');
const { l } = require('app/scripts/lib/localize');
const actionTemplate = require('app/scripts/views/templates/action');
const Promise = require('bluebird');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const CommentUnfurlPreview = require('app/scripts/views/templates/comment-unfurl-preview');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { navigate } = require('app/scripts/controller/navigate');
const {
  isLoomIntegrationEnabled,
} = require('app/src/components/VideoRecordButton');
const parseURL = require('url-parse');

const events = {
  'click .js-show-mem-menu': 'viewMemberActionMenu',
  'click .js-open-attachment-viewer': 'openAttachmentViewer',
  'click .js-open-card': 'openCard',
  'click .js-reply-to-action': 'reply',
  'click .js-reply-to-all-action': 'replyAll',
  'click .js-expand-comment': 'expandComment',
  'click .js-app-creator-link': 'onAppCreatorLinkClicked',
  'click a': 'checkAttachment',
};

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class ActionView extends View {
  static initClass() {
    this.prototype.className = 'phenom';
    this.prototype.events = events;
  }

  initialize({ context, highlighted, source }) {
    let checklist;
    this.context = context;
    this.highlighted = highlighted;
    this.source = source;
    this.listenTo(this.model, 'takingTooLong change', this.render);
    const data = this.model.get('data');
    if ((data.card != null ? data.card.id : undefined) != null && data.board) {
      let card;
      this.listenTo(
        this.modelCache,
        `remove:Action:${this.model.get('id')}`,
        () => {
          return this.remove();
        },
      );

      if (
        (card = this.model.getCard()) != null &&
        card.id !== this.context.id
      ) {
        this.listenTo(card, 'change:name', this.render);
      }
    }

    if ((checklist = this.model.getChecklist()) != null) {
      this.listenTo(checklist, 'change:name', this.render);
    }

    this.listenTo(
      this.model.reactionList,
      'add remove reset',
      this.renderReactions,
    );

    this.linkCardFlagEnabled = featureFlagClient.get(
      'wildcard.link-cards',
      false,
    );
  }

  getData() {
    const entities = new EntityDisplay('action').getEntities(
      this.model.getDisplay(),
      this.context.id,
    );

    return {
      saved: this.model.id != null,
      entities: _.map(entities, this._withEntityInfo.bind(this)),
      date: this.model.get('date'),
      dateLastEdited: this.model.get('data').dateLastEdited,
      textData: this.model.get('data').textData,
      url:
        this.model.getCard() != null
          ? Controller.getActionUrl(this.model)
          : null,
      appCreator: this.model.getAppCreator(),
    };
  }

  getTrackingContext() {
    const { card, list, board } = this.model.get('data');

    const category =
      this.context.typeName === 'Card' ? 'card detail' : 'board sidebar';

    return _.extend(
      {},
      {
        actionId: this.model.id,
        cardId: card != null ? card.id : undefined,
        listId: list != null ? list.id : undefined,
        boardId: board != null ? board.id : undefined,
      },
      { category },
    );
  }

  trackWithData(verb, dirObj, prepObj, indObj, method) {
    const { category } = this.getTrackingContext();
    const actionData = JSON.stringify(
      _.omit(this.getTrackingContext(), 'category'),
    );

    return trackUe(category, verb, dirObj, prepObj, indObj, method, actionData);
  }

  getContext() {
    const context = {};
    const me = Auth.me();

    const board = this.modelCache.get(
      'Board',
      __guard__(
        __guard__(this.model.get('data'), (x1) => x1.board),
        (x) => x.id,
      ),
    );
    if (this.options.showBoard) {
      if (board != null) {
        context.board = board.toJSON({ prefs: true, url: true });
        context.boardPLevelIconClass = BoardDisplayHelpers.getPermLevelIconClassForBoard(
          board,
        );
        context.boardPLevelAltText = BoardDisplayHelpers.getPermLevelAltTextForBoard(
          board,
        );
      }
    }

    if (this.options.showOrganization) {
      const organization = this.modelCache.get(
        'Organization',
        __guard__(
          __guard__(this.model.get('data'), (x3) => x3.organization),
          (x2) => x2.id,
        ),
      );
      if (organization != null) {
        context.organization = organization.toJSON({
          prefs: true,
          url: true,
        });
        context.orgPLevelIconClass = organization.getPermLevel();
        context.orgPLevelAltText = l([
          'org perms',
          organization.getPermLevel(),
          'text',
        ]);
      }
    }

    const memberCreator = this.modelCache.get(
      'Member',
      this.model.get('idMemberCreator'),
    );

    context.canReply =
      (board != null ? board.canComment(me) : undefined) &&
      (this.model.isAddAttachment() ||
        (this.model.isCommentLike() &&
          memberCreator != null &&
          !Auth.isMe(memberCreator)));
    context.canReplyAll =
      context.canReply &&
      new RegExp(/@([a-z0-9_]+)/).test(this.model.get('data').text);
    context.canDelete = this.model.deletable();
    context.canEdit = this.model.editable();
    context.member = memberCreator != null ? memberCreator.toJSON() : undefined;
    if (context.member != null) {
      context.member.url = Controller.getMemberProfileUrl(context.member.id);
    }
    if (context.member != null) {
      context.member.isDeactivated =
        board != null ? board.isDeactivated(context.member) : undefined;
    }
    context.showReactions =
      this.context.typeName === 'Card' &&
      this.model.get('type') === 'commentCard';
    context.canReact = this.model.canReact();
    context.showInlineReactionButton =
      context.showReactions && !this.model.reactionList.length;
    context.canLinkAppCreator = this.source !== 'memberActivityScreen';

    context.canRecordVideo = isLoomIntegrationEnabled(
      this.model.getBoard()?.get('idEnterprise'),
    );

    // We want to prevent enterprises from recording Loom videos.  However,
    // if someone happens to paste a Loom URL into a card comment on a
    // board in an enterprise, we still want to unfurl the link (display
    // an embedded smart link).
    context.canViewVideo = featureFlagClient.get(
      'teamplates.web.loom-integration',
      false,
    );

    return context;
  }

  getOptions() {
    let left;
    return {
      showCompactAttachmentPreview: this.options.compact,
      truncateComment:
        (left =
          typeof this.options.truncateComments === 'function'
            ? this.options.truncateComments(this.model)
            : undefined) != null
          ? left
          : false,
      showOptions:
        !this.model.isPlaceholder() &&
        !this.options.compact &&
        !this.options.readOnly,
      useEmbedly: !this.options.compact && this.model.isCommentLike(),
      usePreviews: !this.options.compact && this.model.isAddAttachment(),
      useCommentUnfurl:
        this.options.compact != null &&
        !this.options.compact &&
        this.model.isCommentLike(),
      extremeTruncation: this.options.extremeTruncation,
    };
  }

  render() {
    let board, url;
    const data = this.getData();
    const options = this.getOptions();
    const context = this.getContext();
    const source = this.source;
    const isComment = this.model.isCommentLike();

    this.$el.addClass(isComment ? 'mod-comment-type' : 'mod-attachment-type');
    this.$el.html(actionTemplate(data, context, options));

    const containers = {
      ...(this.model?.getCard?.()?.getAnalyticsContainers?.() ?? {}),
      ...(this.model?.getBoard?.()?.getAnalyticsContainers?.() ?? {}),
    };

    // Some actions wouldn't have a board associated with them
    if ((board = this.model.getBoard()) != null) {
      this.$('.js-friendly-links').each(function () {
        return friendlyLinks(this, board, {
          analyticsContext: {
            source,
            containers,
            attributes: {
              fromSection: isComment ? 'comment' : 'attachment',
            },
          },
        });
      });

      if (this.linkCardFlagEnabled) {
        this.$('.js-friendly-links-for-link-card').each(function () {
          return friendlyLinks(this, board, {
            analyticsContext: {
              source,
              containers,
              attributes: {
                fromSection: isComment ? 'comment' : 'attachment',
              },
            },
          });
        });
      }

      const renderCommentLinkUnfurls = featureFlagClient.get(
        'ecosystem.comment-link-unfurl-preview',
        false,
      );
      if (renderCommentLinkUnfurls && options.useCommentUnfurl) {
        this.$('.js-friendly-links').each(() =>
          this.renderCommentPreviews(this, board),
        );
      }
    }

    if (options.useEmbedly) {
      const $embedly = this.$('.js-embedly');
      // Let's see if there's any embedly stuff to throw on here
      for (const entity of Array.from(data.entities)) {
        if (entity.type === 'comment' && entity.embedly != null) {
          try {
            const object = JSON.parse(entity.embedly);
            for (url in object) {
              // Wistia includes have a security vulnerability, don't use them
              const urlData = object[url];
              if (/wistia/i.test(url)) {
                continue;
              }
              urlData[`type_${urlData.type}`] = true;
              urlData.requireHttps = true;
              $embedly
                .show()
                .append(
                  templates.fill(
                    require('app/scripts/views/templates/embedly'),
                    urlData,
                  ),
                );
            }
          } catch (error) {}
        }
      }
    }

    if (options.usePreviews) {
      const attachments = _.filter(
        data.entities,
        (entity) => entity.type === 'attachment',
      );

      if (!_.isEmpty(attachments)) {
        const $previews = this.$('.js-previews');
        KnownServices.previewHtml(attachments[0].url, function (err, preview) {
          $previews.empty();
          if (err != null) {
            if (err.login != null) {
              $('<div>')
                .addClass('attachment-extra-info-login')
                .html(err.login)
                .appendTo($previews);

              return $previews.removeClass('hide');
            }
          } else if (preview != null) {
            $('<div>')
              .addClass('attachment-extra-info')
              .html(preview)
              .appendTo($previews);

            return $previews.removeClass('hide');
          }
        });
      }
    }

    Dates.update(this.el);

    this.$el.toggleClass('unsent', !!this.model.isTakingTooLong);
    this.renderHighlighted();
    this.renderReactions();

    return this;
  }

  renderHighlighted() {
    this.$el.toggleClass('mod-highlighted', !!this.highlighted);
    return this;
  }

  renderReactions() {
    const context = this.getContext();

    if ((this.reactRoot = this.$('.js-reaction-piles')[0])) {
      return ReactDOM.render(
        <ReactionPiles
          actionId={this.model.id}
          reactionList={this.model.reactionList}
          canReact={context.canReact}
          trackingContext={this.getTrackingContext()}
        />,
        this.reactRoot,
      );
    }
  }

  renderCommentPreviews(els, board) {
    const urls = _.flatten(
      this.$('.js-friendly-links')
        .toArray()
        .map(function (el) {
          if ((el.tagName != null) === 'A') {
            return [el];
          } else {
            return _.toArray(el.querySelectorAll('a'));
          }
        }),
    )
      .map((a) => a.href)
      .filter((url) => url != null);

    return Promise.map(urls, (url) =>
      Promise.try(() => {
        const formatRequest = PluginRunner.one({
          command: 'format-url',
          board,
          options: {
            url,
          },
        });
        return formatRequest;
      })
        .then(function (response) {
          if (response != null) {
            return _.extend(response, { url });
          } else {
            return null;
          }
        })
        .catch(PluginRunner.Error.NotHandled, () => null),
    ).then((formattedUrls) => {
      if (formattedUrls != null && formattedUrls.length > 0) {
        const subviews = formattedUrls
          .filter(pluginValidators.isValidUrlUnfurl)
          .map((data) => {
            if (
              __guard__(
                data != null ? data.actions : undefined,
                (x) => x.length,
              ) > 2
            ) {
              data.actions = data.actions.slice(0, 2);
            }
            return this.subview(
              CommentUnfurlPreview,
              this.model,
              { commentUnfurl: data },
              data.url,
            );
          });
        const $commentPreview = this.$('.comment-preview');
        this.ensureSubviews(subviews, $commentPreview);
        return $commentPreview.show();
      }
    });
  }

  remove() {
    if (this.reactRoot) {
      ReactDOM.unmountComponentAtNode(this.reactRoot);
    }
    return super.remove(...arguments);
  }

  // TrelloFlavoredMarkdown opts for this action entity
  _tfmFormatOpts() {
    ({
      card: this.model.get('data').card,
      board: this.model.get('data').board,
    });
    siteDomain;
    return { textData: this.model.get('data').textData };
  }

  // Add additional info to an entity for rendering
  _withEntityInfo(entityIn) {
    let card, checklist;
    const entity = _.clone(entityIn);

    if (entity.type === 'attachment') {
      entity.url = this.model.get('data').attachment.url;

      // Handle friendly deleted link
      if (!entity.url && entity.isFriendly) {
        entity.url = entity.text;
      }
    }

    if (entity.type === 'attachmentPreview') {
      // Set preview URL to use for the browser's DPI
      // The entity has preview URLs already, but those don't always do the right thing with EXIF rotation
      let attachment, left, left1;
      entity.previewUrlForRes =
        (card = ModelCache.get(
          'Card',
          __guard__(this.model.get('data').card, (x) => x.id),
        )) != null &&
        (attachment = card.attachmentList.get(
          __guard__(this.model.get('data').attachment, (x1) => x1.id),
        ))
          ? Browser.isHighDPI()
            ? __guard__(
                (left = attachment.smallestPreviewBiggerThan(1000)) != null
                  ? left
                  : attachment.biggestPreview(),
                (x2) => x2.url,
              )
            : __guard__(
                (left1 = attachment.smallestPreviewBiggerThan(500)) != null
                  ? left1
                  : attachment.biggestPreview(),
                (x3) => x3.url,
              )
          : undefined;

      if (entity.previewUrlForRes == null) {
        entity.previewUrlForRes =
          Browser.isHighDPI() && entity.previewUrl2x != null
            ? entity.previewUrl2x
            : entity.previewUrl;
      }
    }

    if (entity.type === 'comment') {
      entity.textHtml = TFM.comments.format(
        entity.text,
        this._tfmFormatOpts(),
      ).output;
    }

    if (entity.type === 'checkItem') {
      entity.nameHtml = TFM.checkItems.format(
        entity.text,
        this._tfmFormatOpts(),
      ).output;
    }

    if (entity.type === 'date') {
      entity.text = moment(entity.date).calendar();
    }

    // Use the most recent name for the card, if available
    if (
      entity.type === 'card' &&
      (card = ModelCache.get('Card', entity.id)) != null
    ) {
      if (card.get('cardRole') === 'link' && this.linkCardFlagEnabled) {
        entity.nameHtml = TFM.name.format(
          card.get('name'),
          this._tfmFormatOpts(),
        ).output;
      } else {
        entity.text = card.get('name');
      }
    }

    if (
      entity.type === 'checklist' &&
      (checklist = ModelCache.get('Checklist', entity.id)) != null
    ) {
      entity.text = checklist.get('name');
    }

    return entity;
  }

  viewMemberActionMenu(e) {
    let left;
    Util.stop(e);

    const member = this.modelCache.get(
      'Member',
      (left = $(e.target).closest('[idmember]').attr('idmember')) != null
        ? left
        : this.model.get('idMemberCreator'),
    );

    PopOver.toggle({
      elem: this.$(e.target).closest('.js-show-mem-menu'),
      view: ActivityMemberMenuView,
      options: {
        model: member,
        modelCache: this.modelCache,
        board: this.modelCache.get(
          'Board',
          __guard__(
            __guard__(this.model.get('data'), (x1) => x1.board),
            (x) => x.id,
          ),
        ),
      },
    });
  }

  expandComment(e) {
    Util.stop(e);
    return this.$('.js-comment').removeClass('is-truncated');
  }

  openCard(e) {
    let url;
    if (this.context.typeName === 'Card' || $(e.target).is('a,textarea')) {
      // Let the browser do the normal thing, e.g. open the link or edit
      return;
    }

    // If they've just selected some text, they aren't trying to open the card
    if (hasSelection()) {
      return;
    }

    Util.stop(e);
    // Navigate to the action URL
    if ((url = Controller.getActionUrl(this.model)) != null) {
      navigate(url, { trigger: true });
    }
  }

  openAttachmentViewer(e) {
    if (e.metaKey || e.ctrlKey) {
      return;
    }

    const $target = $(e.target);
    if ($target.closest('.window-main-col').length > 0) {
      Util.stop(e);
      if (!AttachmentViewer.isActive()) {
        const idAttachment = $target
          .closest('.js-open-attachment-viewer')
          .attr('data-idattachment');
        AttachmentViewer.show({
          model: this.model.getCard(),
          idAttachment,
        });
      }
    }
  }

  reply(e) {
    Util.stop(e);
    this.$el.trigger('replyToAction', this.model);
    return track('Card', 'Reply to Comment');
  }

  replyAll(e) {
    Util.stop(e);
    this.$el.trigger('replyToAllAction', this.model);
    return track('Card', 'Reply to all Comment');
  }

  setHighlighted(highlighted) {
    if (highlighted !== this.highlighted) {
      this.highlighted = highlighted;
      this.renderHighlighted();
    }
  }

  checkAttachment(e) {
    if (e.metaKey || e.ctrlKey) {
      return;
    }

    const card = this.model.getCard();
    const { href } = e.currentTarget;
    const hrefPath = parseURL(href).pathname;
    const attachment = card?.attachmentList?.find(
      (att) => parseURL(att.get('url')).pathname === hrefPath,
    );
    if (attachment && AttachmentHelpers.isViewerable(attachment.get('url'))) {
      e.preventDefault();

      return AttachmentViewer.show({
        model: card,
        idAttachment: attachment.id,
      });
    }
  }

  onAppCreatorLinkClicked(e) {
    Util.stop(e);
    const board = this.model.getBoard();
    if (!board) {
      return;
    }
    const appCreator = this.model.getAppCreator();
    Analytics.sendClickedLinkEvent({
      linkName: 'appCreatorLink',
      source: this.source,
      attributes: {
        appCreatorId: appCreator?.id,
        appCreatorIdPlugin: appCreator?.idPlugin,
        actionType: this.model.get('type'),
      },
      containers: {
        card: {
          id: this.model.id,
        },
        board: {
          id: board.id,
        },
      },
    });

    if (appCreator?.idPlugin) {
      const idMe = Auth.myId();
      if (
        (board.get('memberships') || []).some(
          ({ idMember }) => idMember === idMe,
        )
      ) {
        // Member is a board member, so can run a plugin
        PluginRunner.one({
          plugin: appCreator.idPlugin,
          command: 'show-settings',
          board,
          el: e.currentTarget,
        });
      } else {
        // Member is not a board member, take them to the plugin listing
        window.open('/power-ups/' + appCreator.idPlugin);
      }
    }
  }
}

ActionView.initClass();

module.exports.events = events;
module.exports.ActionView = ActionView;
