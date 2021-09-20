/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let PluginSectionView;
const $ = require('jquery');
const _ = require('underscore');
const Confirm = require('app/scripts/views/lib/confirm');
const Hearsay = require('hearsay');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const PluginSectionRemoveAttachmentsView = require('app/scripts/views/plugin/plugin-section-remove-attachments-view');
const PluginView = require('app/scripts/views/plugin/plugin-view');
const Promise = require('bluebird');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const { sandboxParams } = require('app/scripts/data/plugin-iframe-sandbox');
const {
  sendPluginScreenEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'plugin_section',
);

const { Util } = require('app/scripts/lib/util');
const { Analytics } = require('@trello/atlassian-analytics');
const { IconDefaultColor } = require('@trello/nachos/tokens');

const template = t.renderable(function (data) {
  const { canRemove, content, popoverIsVisible } = data;
  t.div('.window-module.u-clearfix', function () {
    t.div('.window-module-title.window-module-title-no-divider', function () {
      t.span('.window-module-title-icon.icon-lg.plugin-section-icon.js-icon');
      t.h3('.u-inline-block.plugin-section-title.js-title');
      t.div('.window-module-title-options', function () {
        if (canRemove) {
          t.a('.quiet.js-remove', { href: '#' }, function () {
            t.format('remove');
          });
        }
      });
    });

    if (
      content.type === 'iframe' &&
      pluginValidators.isValidUrlForIframe(content.url)
    ) {
      let { height } = content;
      const { url } = content;
      if (!pluginValidators.isValidHeight(height)) {
        height = undefined;
      }
      t.div(
        {
          class: t.classify({
            'u-gutter': true,
            'js-plugin-iframe-container': true,
            'plugin-iframe-container-pop-over-shown': popoverIsVisible,
          }),
        },
        function () {
          t.iframe('.plugin-iframe.plugin-section', {
            allow: 'microphone; camera',
            sandbox: sandboxParams,
            src: url,
            style: t.stylify({
              height: height ? `${height}px;` : undefined,
            }),
          });
          t.div('.plugin-iframe-popover-overlay');
        },
      );
    }
  });
});

module.exports = PluginSectionView = (function () {
  PluginSectionView = class PluginSectionView extends PluginView {
    static initClass() {
      this.prototype.events = { 'click .js-remove': 'confirmRemove' };
    }
    initialize() {
      return (this.section = new Hearsay.Slot(null));
    }

    renderOnce() {
      const section = this.section.get();
      if (section == null) {
        throw Error('updateSection not called before render');
      }

      this.$el.html(
        template({
          ...section,
          canRemove: this.model.editable(),
          popoverIsVisible: PopOver.isVisible,
        }),
      );

      this.subscribe(this.section, (latestSection) => {
        Promise.resolve(_.result(latestSection, 'title'))
          .then((title) => {
            return this.$('.js-title').text(title);
          })
          .catch(PluginRunner.Error.Timeout, function () {});

        return Promise.resolve(_.result(latestSection, 'icon'))
          .then((icon) => {
            const iconUrl = t.addRecolorParam(
              icon,
              `?color=${IconDefaultColor.substr(1).toLowerCase()}`,
            );
            return this.$('.js-icon')
              .css('background-image', t.urlify(iconUrl))
              .toggleClass('mod-reset', latestSection.monochrome === false);
          })
          .catch(PluginRunner.Error.Timeout, function () {});
      });

      this.initIFrames(this.model.getBoard(), this.model, this.section);

      const claimed = section.claimed || [];
      sendPluginScreenEvent({
        idPlugin: section.idPlugin,
        idBoard: this.model.getBoard().id,
        idCard: this.model.id,
        screenName: 'pupAttachmentSectionInlineDialog',
        attributes: {
          totalAttachments: claimed.length,
        },
      });

      return this;
    }

    updateSection(section) {
      this.retain(section);
      return this.section.set(section);
    }

    confirmRemove(e) {
      let model;
      Util.stop(e);

      const section = this.section.get();

      if (section.claimed.length === 1) {
        model = this.model.attachmentList.get(section.claimed[0].id);
        Confirm.toggle('remove attachment', {
          elem: this.$(e.currentTarget),
          model,
          confirmBtnClass: 'nch-button nch-button--danger',
          fxConfirm: (e) => {
            model.destroy();
            Analytics.sendTrackEvent({
              action: 'deleted',
              actionSubject: 'attachment',
              source: 'cardDetailScreen',
              containers: this.model.getAnalyticsContainers(),
            });
          },
        });
      } else {
        PopOver.toggle({
          elem: $(e.currentTarget),
          view: new PluginSectionRemoveAttachmentsView({
            model: this.model,
            section,
          }),
        });
      }
    }
  };
  PluginSectionView.initClass();
  return PluginSectionView;
})();
