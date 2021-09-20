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
let PluginCardDetailBadgeView;
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const PluginBadgeView = require('app/scripts/views/plugin/plugin-badge-view');
const t = require('teacup');
const { Util } = require('app/scripts/lib/util');
const {
  sendPluginUIEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');

const template = t.renderable(function (param) {
  if (param == null) {
    param = {};
  }
  const { callback, url, title, text } = param;
  t.h3('.card-detail-item-header', () => t.text(title));

  if (url && pluginValidators.isValidUrlForIframe(url)) {
    return t.a(
      '.card-detail-badge.plugin-card-detail-badge.is-clickable.js-badge',
      {
        href: url,
        rel: 'noreferrer nofollow noopener',
        target: url,
        title: text,
      },
      () => t.text(text),
    );
  } else if (callback) {
    return t.a(
      '.card-detail-badge.plugin-card-detail-badge.is-clickable.js-badge',
      { href: '#', title: text },
      () => t.text(text),
    );
  } else {
    return t.span(
      '.card-detail-badge.plugin-card-detail-badge.static-detail-badge.js-badge',
      { title: text },
      () => t.text(text),
    );
  }
});

module.exports = PluginCardDetailBadgeView = (function () {
  PluginCardDetailBadgeView = class PluginCardDetailBadgeView extends (
    PluginBadgeView
  ) {
    static initClass() {
      this.prototype.tagName = 'div';
      this.prototype.className = 'card-detail-item';

      this.prototype.events = {
        'click .js-badge'(e) {
          if (
            this.pluginBadge.callback == null &&
            this.pluginBadge.url == null
          ) {
            return;
          }
          Util.stopPropagation(e);
          const { idPlugin } = this.pluginBadge;
          sendPluginUIEvent({
            idPlugin,
            idBoard: this.model.getBoard().id,
            idCard: this.model.id,
            event: {
              action: 'clicked',
              actionSubject: 'badge',
              actionSubjectId: 'cardDetailBadge',
              source: 'cardDetailScreen',
            },
          });
          if (this.pluginBadge.callback != null) {
            e.preventDefault();
            return this.pluginBadge
              .callback({
                el: e.currentTarget,
              })
              .done();
          }
        },
      };
    }

    renderBadge(badge) {
      this.$el.html(template(badge));
      return this.$('.js-badge');
    }
  };
  PluginCardDetailBadgeView.initClass();
  return PluginCardDetailBadgeView;
})();
