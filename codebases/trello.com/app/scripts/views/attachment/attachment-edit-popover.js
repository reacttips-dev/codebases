/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const AttachmentHelpers = require('./helpers');
const template = require('app/scripts/views/templates/edit_attachment');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const Promise = require('bluebird');
const PluginIOCache = require('app/scripts/views/internal/plugins/plugin-io-cache');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const PluginModelSerializer = require('app/scripts/views/internal/plugins/plugin-model-serializer');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'edit_attachment',
);
const {
  sendPluginUIEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { DropboxPluginId } = require('app/scripts/data/dropbox');

const saveAttachmentTemplate = t.renderable(function (plugins) {
  t.div('.save-attachment');
  return plugins != null
    ? plugins.map((plugin, i) =>
        t.div(
          '.js-save-attachment-button.save-attachment-section',
          { 'data-index': i },
          function () {
            t.div('.save-attachment-thumbnail', {
              style: t.stylify({
                'background-image':
                  plugin.icon != null ? t.urlify(plugin.icon) : undefined,
              }),
            });
            return t.span('.save-attachment-label', () =>
              t.format('save-attachment', { pluginName: plugin.name }),
            );
          },
        ),
      )
    : undefined;
});

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class AttachmentEditPopover extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'edit attachment';

    this.prototype.events = {
      'click .js-edit-attachment': 'submit',
      'click .js-save-attachment-button': 'executeActionCallback',
    };
  }

  constructor(options) {
    super(options);
    this.submit = this.submit.bind(this);
  }

  submit(e) {
    let canUpdate;
    Util.stop(e);

    // eslint-disable-next-line prefer-const
    let { newName, nameShortened } = AttachmentHelpers.stripAndShortenName(
      this.$('.js-attachment-name').val(),
    );
    if (nameShortened) {
      this.$('.js-attachment-name').val(newName);
    }

    let newUrl = this.$('.js-attachment-url').val();
    const type = this.model.getServiceKey();
    const oldName = this.model.get('name');
    const oldUrl = this.model.get('url');

    // eslint-disable-next-line prefer-const
    ({ newName, newUrl, canUpdate } = AttachmentHelpers.validateUrlAndName(
      newUrl,
      newName,
      oldUrl,
      oldName,
      type,
    ));

    if (canUpdate) {
      if (type === 'other') {
        this.model.update({ url: newUrl, name: newName });
      } else {
        this.model.update('name', newName);
      }
      return PopOver.hide();
    }
  }

  executeActionCallback(e) {
    Util.stop(e);
    const index = parseInt(this.$(e.currentTarget).attr('data-index'), 10);
    if (
      (this.pluginSaveActions[index] != null
        ? this.pluginSaveActions[index].idPlugin
        : undefined) != null
    ) {
      sendPluginUIEvent(this.pluginSaveActions[index].idPlugin, {
        action: 'clicked',
        actionSubject: 'button',
        source: 'cardDetailScreen',
        actionSubjectId: 'saveAttachmentButton',
        objectType: 'powerUp',
        objectId: this.pluginSaveActions[index].idPlugin,
      });
    }
    if (
      (this.pluginSaveActions[index] != null
        ? this.pluginSaveActions[index].callback
        : undefined) != null
    ) {
      const card = this.model.getCard();
      return this.pluginSaveActions[index].callback({
        el: e.currentTarget,
        options: {
          card: card.get('id'),
          board: card.get('idBoard'),
          name: this.model.get('name'),
          url: this.model.get('url'),
        },
      });
    }
  }

  render() {
    const data = {};
    data.name = this.model.get('name');
    data.url = this.model.get('url');
    data.serviceKey = this.model.getServiceKey();

    const card = this.model.getCard();
    const board = card.getBoard();

    this.$el.html(template(data));

    const renderSaveAttachment =
      featureFlagClient.get('ecosystem.save-attachment-capability', 'none') ===
      'all';
    const dropboxSaveAttachment =
      featureFlagClient.get('ecosystem.save-attachment-capability', 'none') ===
      'dropbox';

    if (
      this.model.get('isUpload') &&
      (renderSaveAttachment ||
        (dropboxSaveAttachment && board.isPluginEnabled(DropboxPluginId)))
    ) {
      Promise.try(() => {
        return PluginRunner.all({
          command: 'save-attachment',
          board,
          card,
          options: PluginModelSerializer.attachment(this.model),
          plugin: dropboxSaveAttachment ? DropboxPluginId : undefined,
        });
      }).then((saveAttachment) => {
        this.pluginSaveActions = saveAttachment
          .filter(pluginValidators.isValidSaveAttachment)
          .map((action) => {
            return {
              callback: action.callback,
              idPlugin: action.idPlugin,
            };
          });
        if (this.pluginSaveActions.length > 0) {
          const plugins = this.pluginSaveActions
            .map(({ idPlugin }) => {
              return PluginIOCache.fromId(idPlugin);
            })
            .map((plugin) => {
              if (
                pluginValidators.isValidUrlForImage(
                  __guard__(
                    plugin != null ? plugin.icon : undefined,
                    (x) => x.url,
                  ),
                )
              ) {
                return {
                  icon: plugin.icon.url,
                  name: plugin.name,
                };
              } else {
                return { name: plugin.name };
              }
            });
          const $saveAttachment = this.$('.save-attachment-container');
          $saveAttachment.append(saveAttachmentTemplate(plugins));
          return $saveAttachment.show();
        }
      });
    }

    return this;
  }
}

AttachmentEditPopover.initClass();
module.exports = AttachmentEditPopover;
