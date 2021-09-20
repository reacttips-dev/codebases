const _ = require('underscore');
const Hearsay = require('hearsay');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const PluginView = require('app/scripts/views/plugin/plugin-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const Promise = require('bluebird');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const { sandboxParams } = require('app/scripts/data/plugin-iframe-sandbox');
const {
  sendPluginScreenEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'plugin_section',
);
const { IconDefaultColor } = require('@trello/nachos/tokens');
const xtend = require('xtend');

const CARD_BACK_SECTION_MAX_HEIGHT = 1500;

const template = t.renderable(function (data) {
  const { content, popoverIsVisible } = data;
  t.div('.window-module.u-clearfix', function () {
    t.div(
      '.window-module-title.window-module-title-no-divider.plugin-window-module-title',
      function () {
        t.span('.window-module-title-icon.icon-lg.plugin-section-icon.js-icon');
        t.h3('.u-inline-block.plugin-section-title.js-title');
        t.a('.subtle.button.hide.js-section-action');
      },
    );

    if (
      content.type === 'iframe' &&
      pluginValidators.isValidUrlForIframe(content.url)
    ) {
      let { height } = content;
      if (
        !pluginValidators.isValidHeight(height, CARD_BACK_SECTION_MAX_HEIGHT)
      ) {
        height = CARD_BACK_SECTION_MAX_HEIGHT;
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
          t.iframe('.plugin-iframe.plugin-section.plugin-card-back-section', {
            allow: 'microphone; camera',
            sandbox: sandboxParams,
            src: content.url,
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

module.exports = class PluginCardBackSectionView extends PluginView {
  initialize() {
    return (this.section = new Hearsay.Slot(null));
  }

  events() {
    return { 'click a.js-section-action': 'clickAction' };
  }

  clickAction(e) {
    this.section.get().action.callback({ el: e.currentTarget });
  }

  renderOnce() {
    const section = this.section.get();
    if (!section) {
      throw Error('updateSection not called before render');
    }

    this.$el.html(
      template(xtend(section, { popoverIsVisible: PopOver.isVisible })),
    );

    this.subscribe(this.section, (latestSection) => {
      // we allow title's to be a promise we will wait to resolve
      // useful if the PUp needs to wait on a network request to get
      // the title of the content
      Promise.resolve(_.result(latestSection, 'title'))
        .then((title) => {
          this.$('.js-title').text(title);
        })
        .catch(PluginRunner.Error.Timeout, function () {});

      Promise.resolve(_.result(latestSection, 'icon'))
        .then((icon) => {
          const iconUrl = t.addRecolorParam(
            icon,
            `?color=${IconDefaultColor.substr(1).toLowerCase()}`,
          );
          this.$('.js-icon')
            .css('background-image', t.urlify(iconUrl))
            .toggleClass('mod-reset', latestSection.monochrome === false);
        })
        .catch(PluginRunner.Error.Timeout, function () {});

      const action = latestSection.action;
      const actionBtn = this.$('.js-section-action');
      if (
        action &&
        typeof action.text === 'string' &&
        typeof action.callback === 'function'
      ) {
        // this section has a valid action let's show the button
        actionBtn.text(action.text);
        actionBtn.toggleClass('hide', false);
      } else {
        // ensure the button is hidden
        actionBtn.text('');
        actionBtn.toggleClass('hide', true);
      }
    });
    this.initIFrames(this.model.getBoard(), this.model, this.section);

    sendPluginScreenEvent({
      idPlugin: section.idPlugin,
      idBoard: this.model.getBoard().id,
      idCard: this.model.id,
      screenName: 'pupCardBackSectionInlineDialog',
    });

    return this;
  }

  updateSection(section) {
    return this.section.set(section);
  }
};
