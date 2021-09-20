/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const AttachmentEditPopOver = require('app/scripts/views/attachment/attachment-edit-popover');
const AttachmentHelpers = require('./helpers');
const AttachmentViewer = require('app/scripts/views/internal/attachment-viewer');
const { Auth } = require('app/scripts/db/auth');
const Browser = require('@trello/browser');
const {
  claimedPowerUps,
} = require('app/scripts/data/power-up-suggestions/claimed-power-ups');
const { makePreviewCachable } = require('@trello/image-previews');
const Confirm = require('app/scripts/views/lib/confirm');
const { Dates } = require('app/scripts/lib/dates');
const { getKey, Key } = require('@trello/keybindings');
const { KnownServices } = require('app/scripts/db/known-services');
const {
  sendPluginScreenEvent,
  sendPluginUIEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const pluginsChangedSignal = require('app/scripts/views/internal/plugins/plugins-changed-signal');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const PluginModelSerializer = require('app/scripts/views/internal/plugins/plugin-model-serializer');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const PluginView = require('app/scripts/views/plugin/plugin-view');
const PowerUpSuggester = require('app/scripts/lib/power-up-suggestions/power-up-suggester');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const Promise = require('bluebird');
const PluginSuggestionPopOver = require('app/scripts/views/plugin/plugin-suggestion-pop-over');
const { sandboxParams } = require('app/scripts/data/plugin-iframe-sandbox');
const { Util } = require('app/scripts/lib/util');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'plugin_attachment_thumbnail',
);
const attachmentThumbnailTemplate = require('app/scripts/views/templates/attachment_thumb');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const xtend = require('xtend');
const { IconDefaultColor } = require('@trello/nachos/tokens');

const pluginThumbnailTemplate = t.renderable(function (data) {
  let { image } = data;
  const {
    canRemove,
    canReply,
    created,
    createdBy,
    initialize,
    modified,
    modifiedBy,
    title,
    url,
  } = data;

  if (image == null || image.url == null) {
    image = { url: '' };
  }

  const linkOpts = {
    href: url,
    rel: 'noopener',
    target: url,
    title,
  };

  const titleOptions = function () {
    if (canReply) {
      t.span(() =>
        t.a(
          '.attachment-thumbnail-details-title-options-item.js-reply',
          { href: '#' },
          () =>
            t.span('.attachment-thumbnail-details-options-item-text', () =>
              t.format('comment'),
            ),
        ),
      );
    }

    if (canRemove) {
      return t.span(() =>
        t.a(
          '.attachment-thumbnail-details-title-options-item.dark-hover.js-confirm-delete',
          { href: '#' },
          () =>
            t.span('.attachment-thumbnail-details-options-item-text', () =>
              t.format('remove'),
            ),
        ),
      );
    }
  };

  if (image.logo) {
    t.a('.attachment-thumbnail-preview', _.clone(linkOpts), () =>
      t.span('.attachment-thumbnail-preview-power-up-logo', () =>
        t.img({
          class: 'attachment-thumbnail-preview-power-up-logo-image',
          src: t.addRecolorParam(
            image.url,
            `?color=${IconDefaultColor.substr(1).toLowerCase()}`,
          ),
        }),
      ),
    );
  } else {
    t.a(
      '.attachment-thumbnail-preview',
      xtend(linkOpts, {
        style: t.stylify({
          'background-image': image.url
            ? t.urlify(makePreviewCachable(image.url))
            : undefined,
          'background-position-y': image.y === 'top' ? '0px' : undefined,
          'background-position-x': image.x === 'left' ? '0px' : undefined,
          'background-size': (() => {
            switch (image.size) {
              case 'cover':
                return 'cover';
              case 'original':
                return 'inherit';
              default:
                return 'contain';
            }
          })(),
        }),
      }),
    );
  }

  t.p('.attachment-thumbnail-details', function () {
    t.span('.attachment-thumbnail-name.js-attachment-name', () =>
      t.text(title),
    );

    t.span('.quiet.attachment-thumbnail-details-options', () =>
      t.a(
        '.attachment-thumbnail-details-title-action.dark-hover.js-attachment-action',
        _.clone(linkOpts),
        function () {
          t.icon('external-link');
          return t.span(
            '.attachment-thumbnail-details-options-item-text.js-direct-link',
          );
        },
      ),
    );

    t.textarea(
      '.attachment-thumbnail-details-title.js-attachment-thumbnail-details hide',
      { maxlength: 256 },
      () => t.text(title),
    );

    t.span('.u-block.quiet.attachment-thumbnail-details-title-options', () =>
      titleOptions(),
    );

    if (created != null) {
      t.span('.u-block.quiet', function () {
        if (createdBy != null) {
          return t.format('created-by', { date: created, user: createdBy });
        } else {
          return t.format('created', { date: created });
        }
      });

      if (modified != null) {
        t.span('.u-block.quiet', function () {
          if (modifiedBy != null) {
            return t.format('modified-by', {
              date: modified,
              user: modifiedBy,
            });
          } else {
            return t.format('modified', { date: modified });
          }
        });
      }
    }

    if (
      initialize != null &&
      pluginValidators.isValidUrlForIframe(initialize.url)
    ) {
      if (initialize.type === 'iframe') {
        const { url: initializeUrl } = initialize;
        return t.iframe('.plugin-iframe.plugin-thumbnail-initialize', {
          sandbox: sandboxParams,
          src: initializeUrl,
        });
      }
    }
  });
});

function __guardMethod__(obj, methodName, transform) {
  if (
    typeof obj !== 'undefined' &&
    obj !== null &&
    typeof obj[methodName] === 'function'
  ) {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}
function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports = (function () {
  class AttachmentThumbView extends PluginView {
    static initClass() {
      this.prototype.className = 'attachment-thumbnail';

      this.prototype.events = {
        'click .js-open-viewer': 'openViewer',
        'click .js-open-in-new-window': 'openLink',
        'click .js-direct-link': 'clickDirectLink',

        'click .js-make-cover': 'makeCover',
        'click .js-remove-cover': 'removeCover',
        'click .js-confirm-delete': 'confirmDelete',
        'click .js-edit': 'editAttachment',
        'click .js-reply': 'reply',
        'click .js-attachment-name': 'enableEditAttachmentName',
        'click .js-attachment-thumbnail-details': 'dontOpenViewer',
        'click .js-show-power-up-suggestions-info':
          'showPowerUpSuggestionsInformation',

        'keydown .js-attachment-thumbnail-details': 'onEditAttachmentName',
        'blur .js-attachment-thumbnail-details': 'saveAttachmentName',

        moveattachment: 'rearrangeAttachment',
      };

      this.prototype.vigor = this.VIGOR.NONE;
    }

    initialize() {
      this.suggestedPowerUpsSuggester = new PowerUpSuggester(claimedPowerUps);

      this.isEditingAttachmentName = false;

      this.listenTo(
        Auth.me(),
        'change:oneTimeMessagesDismissed',
        this.frameDebounce(this.renderNormal),
      );
      this.listenTo(
        Auth.me(),
        'change:messagesDismissed',
        this.frameDebounce(this.renderNormal),
      );

      const card = this.model.getCard();
      const board = card.getBoard();

      return this.listenTo(
        board,
        'change:prefs.cardCovers',
        this.frameDebounce(this.renderNormal),
      );
    }
    renderOnce() {
      const card = this.model.getCard();
      const board = card.getBoard();

      this.subscribe(
        pluginsChangedSignal(board, card).combine(
          card
            .snoop('idAttachmentCover')
            .combine(
              this.model
                .snoop('previews')
                .combine(this.model.snoop('name'))
                .combine(this.model.snoop('url')),
            ),
        ),
        () => {
          return this.renderPluginThumbnail()
            .catch(
              PluginRunner.Error.NotHandled,
              this.callback(() => {
                return this.renderNormal();
              }),
            )
            .done();
        },
      );
      return this;
    }

    // We do a lot of asychronous rendering in response to attachment changes
    // (debouncing, waiting for power-ups) and that can lead to situations
    // where we try to do a render after an attachment has been deleted
    // (and this will result in console errors if we try to run @model.getCard())
    // We can use @wasRemoved() to abort renders immediately if we know the
    // view is in the process of being removed
    wasRemoved() {
      return !this.model.collection;
    }

    renderPluginThumbnail() {
      if (this.wasRemoved()) {
        return Promise.resolve();
      }

      const card = this.model.getCard();
      const board = card.getBoard();
      const name = this.model.get('name');

      return PluginRunner.one({
        command: 'attachment-thumbnail',
        card,
        board,
        options: PluginModelSerializer.attachment(this.model),
      })
        .then(
          this.callback((data) => {
            if (this.wasRemoved()) {
              return;
            }

            if (
              data == null ||
              !_.isObject(data) ||
              _.isArray(data) ||
              _.isFunction(data)
            ) {
              throw new PluginRunner.Error.NotHandled();
            }
            if (data.title != null) {
              __guardMethod__(this.options, 'onPluginThumbnail', (o) =>
                o.onPluginThumbnail(data.idPlugin),
              );
            }
            data.url = this.model.get('url');
            this.$el.html(
              pluginThumbnailTemplate(
                xtend({ url: this.model.get('url') }, data, {
                  canRemove: this.model.editable(),
                  canReply:
                    this.options.onReply != null && board.canComment(Auth.me()),
                  created: data.created ? new Date(data.created) : undefined,
                  modified: data.modified ? new Date(data.modified) : undefined,
                  title: name === data.url.slice(0, 256) ? data.title : name,
                }),
              ),
            );
            Dates.update(this.el);
            this.initIFrames(board, card);
            this.$('.js-attachment-thumbnail-details').autosize({
              append: false,
            });

            return sendPluginScreenEvent({
              idPlugin: data.idPlugin,
              idBoard: board.id,
              idCard: card.id,
              screenName: 'pupAttachmentsInlineDialog',
            });
          }),
        )
        .return();
    }

    renderNormal() {
      if (this.wasRemoved()) {
        return this;
      }

      const card = this.model.getCard();
      const board = card.getBoard();

      Promise.all([
        AttachmentHelpers.getAttachmentData(this.model),

        Promise.try(() => {
          return board
            .getAvailablePlugins()
            .filter((plugin) => {
              return (
                plugin.id ===
                this.suggestedPowerUpsSuggester.getPowerUpIdFromClaimedPowerUpDomains(
                  this.model.get('url'),
                )
              );
            })
            .get(0);
        }),
      ])
        .spread(
          this.callback((data, suggestedPlugin) => {
            if (this.wasRemoved()) {
              return;
            }

            let left;

            data.canUseViewer = AttachmentHelpers.isViewerable(
              this.model.get('url'),
            );
            data.canReply = __guard__(this.model.getCard().getBoard(), (x) =>
              x.canComment(Auth.me()),
            );

            let preview =
              (left = this.model.smallestPreviewBiggerThan(110, 80)) != null
                ? left
                : this.model.biggestPreview();
            if (Browser.isHighDPI()) {
              const hiDpipreview = this.model.smallestPreviewBiggerThan(
                220,
                160,
              );
              preview = hiDpipreview != null ? hiDpipreview : preview;
            }

            if (preview != null) {
              const showCardCovers = __guard__(
                __guard__(card.getBoard(), (x2) => x2.get('prefs')),
                (x1) => x1.cardCovers,
              );
              data.isCover =
                showCardCovers &&
                card.get('idAttachmentCover') === this.model.id;
              data.imgSrc = preview.url;
            }

            data.isUpload = this.model.get('isUpload');
            data.editable = this.model.editable();

            this.suggestedPlugin = suggestedPlugin;
            if (
              this.suggestedPlugin != null ? this.suggestedPlugin.id : undefined
            ) {
              if (!card.getBoard().isPluginEnabled(this.suggestedPlugin.id)) {
                data.plugin = this.suggestedPlugin;
              }
            }

            if (
              __guard__(card.getBoard().getOrganization(), (x3) =>
                x3.isFeatureEnabled('plugins'),
              ) ||
              !Browser.dontUpsell()
            ) {
              data.upsellEnabled = true;
            }

            this.$el.html(attachmentThumbnailTemplate(data));

            this.renderCoverState();

            Dates.update(this.el);

            if (data.isKnownService) {
              const $thumbnail = this.$('.js-attachment-thumbnail-details');
              KnownServices.thumbnailHtml(data.url, data, function (err, html) {
                if (err == null && html != null) {
                  $thumbnail.html(html);
                  return Dates.update($thumbnail);
                }
              });
            }

            return this.$('.js-attachment-thumbnail-details').autosize({
              append: false,
            });
          }),
        )
        .done();

      return this;
    }

    openViewer(e) {
      if (e.metaKey || e.ctrlKey || this.isEditingAttachmentName) {
        return;
      }

      Util.stop(e);
      if (!AttachmentViewer.isActive()) {
        AttachmentViewer.show({
          model: this.model.getCard(),
          attachmentModel: this.model,
        });
        Analytics.sendScreenEvent({
          name: 'attachmentViewerModal',
          attributes: {
            type: this.model.getType(),
          },
        });
      }
    }

    clickDirectLink(e) {
      Analytics.sendClickedLinkEvent({
        linkName: 'attachmentDirectLink',
        source: 'cardDetailScreen',
      });
      return e.stopPropagation();
    }

    dontOpenViewer(e) {
      return e.stopPropagation();
    }

    renderCoverState() {
      const allowsCardCovers = __guard__(
        __guard__(this.model.getCard(), (x1) => x1.getBoard()),
        (x) => x.getPref('cardCovers'),
      );
      const $make = this.$('.js-make-cover').addClass('hide');
      const $remove = this.$('.js-remove-cover').addClass('hide');

      if (
        __guard__(this.model.get('previews'), (x2) => x2.length) > 0 &&
        allowsCardCovers
      ) {
        const isCover =
          __guard__(this.model.getCard(), (x3) =>
            x3.get('idAttachmentCover'),
          ) === this.model.id;

        $make.toggleClass('hide', isCover);
        $remove.toggleClass('hide', !isCover);
      }
    }

    makeCover(e) {
      Util.stop(e);
      PopOver.hide();
      const traceId = Analytics.startTask({
        taskName: 'edit-card/idAttachmentCover',
        source: 'cardDetailScreen',
      });

      this.model.getCard().makeCover(
        this.model,
        traceId,
        tracingCallback(
          {
            taskName: 'edit-card/idAttachmentCover',
            traceId,
            source: 'cardDetailScreen',
          },
          (err, card) => {
            if (card) {
              Analytics.sendUpdatedCardFieldEvent({
                field: 'idAttachmentCover',
                source: 'cardDetailScreen',
                value: this.model.id,
                containers: {
                  card: { id: card.id },
                  list: { id: card.idList },
                  board: { id: card.idBoard },
                },
                attributes: { taskId: traceId },
              });
            }
          },
        ),
      );
    }

    removeCover(e) {
      Util.stop(e);
      PopOver.hide();
      const traceId = Analytics.startTask({
        taskName: 'edit-card/idAttachmentCover',
        source: 'cardDetailScreen',
      });

      this.model.getCard().removeCover(
        null,
        traceId,
        tracingCallback(
          {
            taskName: 'edit-card/idAttachmentCover',
            traceId,
            source: 'cardDetailScreen',
          },
          (err, card) => {
            if (card) {
              Analytics.sendUpdatedCardFieldEvent({
                field: 'idAttachmentCover',
                source: 'cardDetailScreen',
                value: null,
                containers: {
                  card: { id: card.id },
                  list: { id: card.idList },
                  board: { id: card.idBoard },
                },
                attributes: { taskId: traceId },
              });
            }
          },
        ),
      );
    }

    confirmDelete(e) {
      Util.stop(e);

      const babbleKey = this.model.get('isUpload')
        ? 'delete attachment'
        : 'remove attachment';

      Confirm.toggle(babbleKey, {
        elem: this.$('.js-confirm-delete'),
        model: this.model,
        confirmBtnClass: 'nch-button nch-button--danger',
        fxConfirm: () => {
          this.model.destroy();
          return Analytics.sendTrackEvent({
            action: 'deleted',
            actionSubject: 'attachment',
            source: 'cardDetailScreen',
            attributes: {
              type: this.model.getType(),
            },
          });
        },
      });

      return Analytics.sendClickedButtonEvent({
        buttonName: 'confirmDeleteAttachmentButton',
        source: 'confirmDeleteAttachmentInlineDialog',
      });
    }

    editAttachment(e) {
      Util.stop(e);
      if (!this.model.getCard().editable()) {
        return;
      }

      PopOver.toggle({
        elem: this.$(e.target),
        view: new AttachmentEditPopOver({ model: this.model }),
      });
    }

    reply(e) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'attachmentCommentButton',
        source: 'cardDetailScreen',
      });
      Util.stop(e);
      return this.options.onReply();
    }

    enableEditAttachmentName(e) {
      if (!this.model.getCard().editable()) {
        return;
      }

      Util.stopPropagation(e);

      this.isEditingAttachmentName = true;

      this.$('.js-attachment-name').addClass('hide');
      this.$('.js-attachment-action').addClass('hide');
      return this.$('.js-attachment-thumbnail-details')
        .removeClass('hide')
        .trigger('autosize.resize')
        .focus()
        .select();
    }

    showPowerUpSuggestionsInformation(e) {
      e.preventDefault();

      let card = this.model.getCard();
      let board = card.getBoard();
      sendPluginUIEvent({
        idPlugin: this.suggestedPlugin.id,
        idBoard: board.id,
        idCard: card.id,
        event: {
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'attachmentGetPowerUpButton',
          source: 'attachmentThumbnal',
        },
      });

      Util.stopPropagation(e);

      card = this.model.getCard();
      board = card.getBoard();

      const options = {
        model: this.suggestedPlugin,
        board,
        card,
      };

      PopOver.toggle({
        elem: this.$(e.target),
        view: new PluginSuggestionPopOver(options),
        autoPosition: true,
        getViewTitle: () =>
          t.l('plugin-power-up', {
            powerUpName: this.suggestedPlugin.get('listing').name,
          }),
        onClose: () => {
          return sendPluginUIEvent({
            idPlugin: this.suggestedPlugin.id,
            idBoard: board.id,
            idCard: card.id,
            event: {
              action: 'closed',
              actionSubject: 'inlineDialog',
              actionSubjectId: 'attachmentGetPowerUpInlineDialog',
              source: 'attachmentGetPowerUpInlineDialog',
            },
          });
        },
      });

      if (PopOver.isVisible) {
        sendPluginScreenEvent({
          idPlugin: this.suggestedPlugin.id,
          idBoard: board.id,
          idCard: card.id,
          screenName: 'attachmentsGetPowerUpInlineDialog',
        });
      }
    }

    onEditAttachmentName(e) {
      const $input = this.$(e.currentTarget).trigger('autosize.resize');

      if (getKey(e) === Key.Enter || getKey(e) === Key.Escape) {
        Util.stop(e); // prevents new lines (enter) and closing of card (escape)

        return $input.blur();
      }
    }

    saveAttachmentName(e) {
      this.isEditingAttachmentName = false;

      const $input = this.$(e.currentTarget);
      const $a11yName = this.$('.js-attachment-name');

      const oldName = this.model.get('name');
      const { newName, nameShortended } = AttachmentHelpers.stripAndShortenName(
        $input.val(),
      );
      if (nameShortended) {
        $input.text(newName);
      }

      if (newName !== oldName && newName.length > 0) {
        $a11yName.text(newName);
        this.model.update('name', newName);
      } else {
        $input.val(oldName);
        $a11yName.text(oldName);
      }

      this.$('.js-attachment-name').removeClass('hide');
      this.$('.js-attachment-action').removeClass('hide');
      return this.$('.js-attachment-thumbnail-details').addClass('hide');
    }

    rearrangeAttachment(e, ui) {
      const card = this.model.getCard();
      if (card != null) {
        const attachments = ui.item.parent().children();
        const index = attachments.index(ui.item);

        this.model.update('pos', card.calcAttachmentPos(index, this.model));
        this.model.collection.sort({ silent: true });

        if (this.$('.plugin-iframe').length) {
          this.renderPluginThumbnail();
        }

        return Analytics.sendTrackEvent({
          action: 'reordered',
          actionSubject: 'attachment',
          source: 'cardDetailScreen',
        });
      }
    }

    openLink() {
      const url = this.model.get('url');
      Analytics.sendClickedLinkEvent({
        linkName: 'attachmentLink',
        source: 'cardDetailScreen',
      });
      return window.open(url, url);
    }
  }
  AttachmentThumbView.initClass();
  return AttachmentThumbView;
})();
