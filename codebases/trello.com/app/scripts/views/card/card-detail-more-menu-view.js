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
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const { Auth } = require('app/scripts/db/auth');
const BoardDisplayHelpers = require('app/scripts/views/internal/board-display-helpers');
const Confirm = require('app/scripts/views/lib/confirm');
const { Dates } = require('app/scripts/lib/dates');
const Dialog = require('app/scripts/views/lib/dialog');
const { htmlEncode } = require('app/scripts/lib/util/text/html-encode');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const { print } = require('@trello/browser-compatibility');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');
const { trelloForWebsites } = require('@trello/config');
const _ = require('underscore');

const { featureFlagClient } = require('@trello/feature-flag-client');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { QrCodeToggle } = require('app/src/components/QrCode');

class CardDetailMoreMenuView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'share-and-more-ellipsis';

    this.prototype.events = {
      'click .js-delete': 'deleteCard',
      'click .js-short-url, .js-email, .js-embed'(e) {
        return this.focusInput(e.currentTarget);
      },
      'click .js-print': 'printModel',
      'click .js-export-json': 'exportJSON',

      'copy .js-short-url, .js-email, .js-embed': 'handleCopy',
    };
  }

  initialize() {
    return this.listenTo(this.model, 'change:shortUrl', this.render);
  }

  remove() {
    this.unmountQrCodeToggle();
    return super.remove(...arguments);
  }

  handleCopy(e) {
    switch (false) {
      case !this.$(e.currentTarget).hasClass('js-short-url'):
        return Analytics.sendTrackEvent({
          action: 'copied',
          actionSubject: 'url',
          source: 'cardDetailMoreInlineDialog',
          attributes: {
            isLoggedIn: Auth.isLoggedIn(),
          },
          containers: this.model.getAnalyticsContainers(),
        });
      case !this.$(e.currentTarget).hasClass('js-email'):
        return Analytics.sendTrackEvent({
          action: 'copied',
          actionSubject: 'email',
          source: 'cardDetailMoreInlineDialog',
          containers: this.model.getAnalyticsContainers(),
        });
      case !this.$(e.currentTarget).hasClass('js-embed'):
        return Analytics.sendTrackEvent({
          action: 'copied',
          actionSubject: 'embed',
          source: 'cardDetailMoreInlineDialog',
          attributes: {
            isLoggedIn: Auth.isLoggedIn(),
          },
          containers: this.model.getAnalyticsContainers(),
        });
      default:
        break;
    }
  }

  focusInput(el) {
    return this.$(el).focus().select();
  }

  getShortLinkData() {
    if (this.model.get('shortUrl') == null) {
      this.model.fetch({ fields: ['shortUrl'] });
    }
  }

  deleteCardConfirm(e) {
    Confirm.pushView('delete card', {
      model: this.model,
      confirmBtnClass: 'nch-button nch-button--danger',
      fxConfirm: () => {
        Dialog.hide();
        const traceId = Analytics.startTask({
          taskName: 'delete-card',
          source: 'cardDetailMoreInlineDialog',
        });
        this.model.deleteWithTracing(
          traceId,
          tracingCallback(
            {
              taskName: 'delete-card',
              source: 'cardDetailMoreInlineDialog',
              traceId,
            },
            (_err, response) => {
              if (response) {
                Analytics.sendTrackEvent({
                  action: 'deleted',
                  actionSubject: 'card',
                  source: 'cardDetailMoreInlineDialog',
                  attributes: {
                    taskId: traceId,
                  },
                  containers: {
                    card: { id: response.id },
                  },
                });
              }
            },
          ),
        );
      },
    });
  }

  render() {
    const data = {
      dateAdded: Util.idToDate(this.model.id).toISOString(),
      jsonURL: `/${this.model.typeName.toLowerCase()}/${
        this.model.id
      }/${Util.makeSlug(this.model.get('name'))}.json`,
      isLoggedIn: Auth.isLoggedIn(),
    };

    const board = this.model.getBoard();
    if (board != null) {
      _.extend(data, {
        pLevelClass: BoardDisplayHelpers.getPermLevelIconClassForBoard(board),
        pLevelAltText: BoardDisplayHelpers.getPermLevelAltTextForBoard(board),
      });
    }

    data.embed = [
      '<blockquote class="trello-card">',
      `<a href="${htmlEncode(this.model.get('url'))}">${htmlEncode(
        this.model.get('name'),
      )}</a>`,
      '</blockquote>',
      `<script src="${trelloForWebsites}/embed.min.js"></script>`,
    ].join('');

    this.$el.html(
      templates.fillFromModel(
        require('app/scripts/views/templates/card_detail_more_menu'),
        this.model,
        data,
        { meta: templates.card_menu_meta },
      ),
    );

    this.getShortLinkData();
    Dates.update(this.el);
    this.focusInput(this.$('.js-autofocus')[0]);

    if (featureFlagClient.get('aaaa.qr-codes', false)) {
      const shortUrl = this.model.get('shortUrl');
      this.mountQrCodeToggle(shortUrl);
    }

    Analytics.sendScreenEvent({
      name: 'cardDetailMoreInlineDialog',
      containers: {
        card: {
          id: this.model.id,
        },
        board: {
          id: board?.id,
        },
      },
    });

    return this;
  }

  deleteCard(e) {
    Util.stop(e);
    Analytics.sendClickedLinkEvent({
      buttonName: 'deleteCardLink',
      source: 'cardDetailMoreInlineDialog',
      containers: this.model.getAnalyticsContainers(),
    });

    this.deleteCardConfirm();
  }

  printModel(e) {
    Util.stop(e);
    PopOver.hide();

    Analytics.sendClickedButtonEvent({
      buttonName: 'printButton',
      source: 'cardDetailMoreInlineDialog',
      containers: this.model.getAnalyticsContainers(),
    });

    this.defer(() => print());
  }

  exportJSON(e) {
    return Analytics.sendClickedButtonEvent({
      buttonName: 'exportJSONButton',
      source: 'cardDetailMoreInlineDialog',
      containers: this.model.getAnalyticsContainers(),
    });
  }

  mountQrCodeToggle(url) {
    const qrCodeToggleRoot = this.$el.find('.js-qr-code')[0];
    if (qrCodeToggleRoot) {
      renderComponent(
        <QrCodeToggle url={url} type="card" style="inline" />,
        qrCodeToggleRoot,
      );
    }
  }

  unmountQrCodeToggle() {
    const qrCodeToggleRoot = this.$el.find('.js-qr-code')[0];
    if (qrCodeToggleRoot) {
      ReactDOM.unmountComponentAtNode(qrCodeToggleRoot);
    }
  }
}

CardDetailMoreMenuView.initClass();
module.exports = CardDetailMoreMenuView;
