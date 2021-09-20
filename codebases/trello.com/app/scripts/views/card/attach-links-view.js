/* eslint-disable
 */
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
const Alerts = require('app/scripts/views/lib/alerts');
const LimitExceeded = require('app/scripts/views/attachment/attachment-limit-exceeded-error');
const limitExceededTemplate = require('app/scripts/views/templates/popover_limit_exceeded');
const parseURL = require('url-parse');
const Promise = require('bluebird');
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/card_attach_links');
const xtend = require('xtend');
const { Analytics } = require('@trello/atlassian-analytics');

class CardAttachLinksView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'attach links';

    this.prototype.events = { 'click .js-attach:not([disabled])': 'attach' };
  }
  initialize({ links }) {
    this.links = links;

    return this.listenTo(
      this.model.attachmentList,
      'add remove reset',
      this.render,
    );
  }

  render() {
    if (!this.model.canAttach()) {
      if (this.model.isOverLimit('attachments', 'perCard')) {
        this.$el.html(limitExceededTemplate('perCard'));
      } else if (this.model.getBoard().isOverLimit('attachments', 'perBoard')) {
        this.$el.html(limitExceededTemplate('perBoard'));
      }

      return this;
    }

    const entries = Array.from(this.links).map((link) =>
      xtend(link, {
        domain: parseURL(link.url).host,
        attached: this.model.attachmentList.any(
          (att) => att.get('url') === link.url,
        ),
      }),
    );

    this.$el.html(template(entries));
    return this;
  }

  attach(e) {
    const $target = $(e.currentTarget);
    const url = $target.attr('data-url');
    const text = $target.attr('data-text');

    $target.attr('disabled', 'disabled');
    return Promise.fromNode((next) =>
      this.model.uploadUrl({ url, name: text }, next),
    )
      .then(() => Analytics.sendTrackEvent({
        action: 'attached',
        actionSubject: 'link',
        source: 'cardDetailScreen',
      }))
      .catch(LimitExceeded, () =>
        Alerts.show('unable to attach link', 'error', 'linkattachment', 5000),
      );
  }
}

CardAttachLinksView.initClass();
module.exports = CardAttachLinksView;
