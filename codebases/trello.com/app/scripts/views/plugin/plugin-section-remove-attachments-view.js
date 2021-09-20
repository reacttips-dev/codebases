// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const Confirm = require('app/scripts/views/lib/confirm');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const Promise = require('bluebird');
const t = require('teacup');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const xtend = require('xtend');
const { Analytics } = require('@trello/atlassian-analytics');

const template = t.renderable(function (entries) {
  t.ul('.pop-over-list', function () {
    for (const { name, id } of Array.from(entries)) {
      t.li(function () {
        t.a('.js-remove', { 'data-id-attachment': id }, function () {
          t.text(name);
        });
      });
    }
  });
});

class PluginSectionRemoveAttachmentsView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'remove attachments';

    this.prototype.events = { 'click .js-remove': 'confirmRemove' };
  }

  initialize({ section }) {
    return (this.section = section);
  }

  renderOnce() {
    const board = this.model.getBoard();
    const card = this.model;

    Promise.map(this.section.claimed, (claim) =>
      PluginRunner.one({
        command: 'format-url',
        board,
        card,
        options: {
          url: claim.url,
        },
      })
        .get('text')
        .catch(PluginRunner.Error.NotHandled, () => claim.name || claim.url)
        .then((name) => xtend(claim, { name })),
    ).then((claimed) => {
      return this.$el.html(template(claimed));
    });
    return this;
  }

  confirmRemove(e) {
    Util.stop(e);
    const idAttachment = $(e.currentTarget).attr('data-id-attachment');
    const model = this.model.attachmentList.get(idAttachment);

    return Confirm.pushView('remove attachment', {
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
  }
}

PluginSectionRemoveAttachmentsView.initClass();
module.exports = PluginSectionRemoveAttachmentsView;
