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
const $ = require('jquery');
const { ApiError } = require('app/scripts/network/api-error');
const Confirm = require('app/scripts/views/lib/confirm');
const { Label } = require('app/scripts/models/label');
const { ModelCache } = require('app/scripts/db/model-cache');
const { ModelLoader } = require('app/scripts/db/model-loader');
const Promise = require('bluebird');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const { l } = require('app/scripts/lib/localize');
const {
  localizeServerError,
} = require('app/scripts/lib/localize-server-error');
const { parseTrelloUrl } = require('app/scripts/lib/util/url/parse-trello-url');
const recup = require('recup');
const { Analytics } = require('@trello/atlassian-analytics');
const {
  startDecayingInterval,
} = require('app/scripts/lib/util/decaying-interval');

const {
  TrelloCardAttachmentComponent,
  TrelloCardAttachmentGenericError,
  TrelloCardAttachmentLoading,
  TrelloCardAttachmentSpecificError,
  TrelloCardAttachmentUnauthorized,
} = require('./trello-card-attachment-components');

const {
  ReactRootComponent,
} = require('app/scripts/views/internal/react-root-component');
const { Auth } = require('app/scripts/db/auth');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class TrelloCardAttachment extends View {
  static initClass() {
    this.prototype.className = 'trello-card-attachment-container';
  }

  initialize() {
    if (this.$reactRoot == null) {
      this.$reactRoot = $('<div></div>');
    }

    return this.getCard()
      .then(
        this.callback((card) => {
          this.card = card;
          if (this.card) {
            this.setUpListeners();
          }
          return this.renderReactSection();
        }),
      )
      .catch((e) => console.error(e));
  }

  setUpListeners() {
    if (this.card.getBoard().id !== this.model.getCard().getBoard().id) {
      this.startPolling();
      return;
    }

    const renderReactSectionDebounced = this.frameDebounce(
      this.renderReactSection,
    );

    this.listenTo(this.card, {
      change: renderReactSectionDebounced,
      destroy: () => {
        this.card = null;
        this.error = 'not found';
        return this.renderReactSection();
      },
    });

    this.listenTo(this.card.getList(), {
      'change:name': renderReactSectionDebounced,
    });

    this.listenTo(Auth.me(), {
      'change:prefs': renderReactSectionDebounced,
    });

    return this.listenTo(this.card.getBoard(), {
      'change:name': renderReactSectionDebounced,
      'change:prefs'(board) {
        if (
          __guard__(board.get('prefs'), (x) => x.backgroundImage) !==
            __guard__(board.previous('prefs'), (x1) => x1.backgroundImage) ||
          __guard__(board.get('prefs'), (x2) => x2.backgroundColor) !==
            __guard__(board.previous('prefs'), (x3) => x3.backgroundColor)
        ) {
          return this.renderReactSection();
        }
      },
    });
  }

  startPolling() {
    const renderCard = () => {
      return this.fetchCard().then(
        this.callback(() => {
          return this.renderReactSection();
        }),
      );
    };

    // Limit server requests using decaying interval
    return (this.cancelDecayingInterval = startDecayingInterval(renderCard));
  }

  renderReactSection() {
    ReactDOM.render(
      <ReactRootComponent>{this.getTrelloCardAttachment()}</ReactRootComponent>,
      this.$reactRoot[0],
    );

    return this;
  }

  render() {
    this.$el.append(this.$reactRoot);
    this.renderReactSection();

    return this;
  }

  getTrelloCardAttachmentError() {
    const canEdit = this.model.getCard().editable();

    const props = {
      error: this.error,
      canEdit,
      onRemove: this.confirmDelete.bind(this),
    };

    return recup.render(() =>
      recup.div(() => {
        if (this.error === 'unauthorized') {
          return recup.createElement(TrelloCardAttachmentUnauthorized, props);
        } else if (
          ['server', 'bad request', 'not found'].includes(this.error)
        ) {
          return recup.createElement(TrelloCardAttachmentSpecificError, props);
        } else {
          return recup.createElement(
            TrelloCardAttachmentGenericError,
            _.extend(
              {
                errorText: localizeServerError(this.error),
              },
              props,
            ),
          );
        }
      }),
    );
  }

  getTrelloCardAttachment() {
    if (this.error) {
      return this.getTrelloCardAttachmentError();
    }

    return recup.render(() => {
      return recup.div(() => {
        if (!this.card) {
          return recup.createElement(TrelloCardAttachmentLoading);
        }

        const canRemove = this.model.getCard().editable();
        const canUnarchive = this.card.editable();
        const isTemplate = this.card.get('isTemplate');
        const canLink = this.card.canAttach();

        const modelShortLink = this.model.getCard().get('shortLink');
        const isLinked = _.some(this.card.get('attachments'), (attachment) => {
          return parseTrelloUrl(attachment.url).shortLink === modelShortLink;
        });

        // This handles the case where the card is linked and then unlinked
        // in the middle of polling (otherwise, "Link" stays hidden indefinitely)
        this.$('.link-trello-card').toggle(!isLinked);

        const numNotifications = ModelCache.find(
          'Notification',
          (notification) => {
            return (
              notification.get('unread') &&
              __guard__(
                __guard__(notification.get('data'), (x1) => x1.card),
                (x) => x.id,
              ) === this.card.id
            );
          },
        ).length;

        return recup.createElement(TrelloCardAttachmentComponent, {
          card: this.card,
          board: this.card.getBoard(),
          canLink,
          canRemove,
          canUnarchive,
          isLinked,
          isTemplate,
          labels: this.card.getLabels().sort(Label.compare),
          list: this.card.getList(),
          members: this.card.memberList.models,
          numNotifications,
          onLink: this.confirmLink.bind(this, this.card),
          onRemove: this.confirmDelete.bind(this),
          onUnarchive: this.unarchiveCard.bind(this, this.card),
        });
      });
    });
  }

  getShortLink() {
    if (!this.shortLink) {
      this.shortLink = parseTrelloUrl(this.options.cardUrl).shortLink;
    }

    return this.shortLink;
  }

  getCard() {
    const shortLink = this.getShortLink();

    const card = ModelCache.get('Card', shortLink);

    if (this.isCardDataAvailable(card)) {
      return Promise.resolve(card);
    }

    return this.fetchCard();
  }

  isCardDataAvailable(card) {
    return (
      card &&
      card.getBoard() &&
      card.getList() &&
      card.getLabels() &&
      card.get('attachments')
    );
  }

  fetchCard() {
    const shortLink = this.getShortLink();

    return ModelLoader.loadCardAttachment(shortLink)
      .then((e) => {
        this.error = null;
        return ModelCache.get('Card', shortLink);
      })
      .catch(ApiError.Unauthorized, (e) => {
        this.error = 'unauthorized';
        return null;
      })
      .catch(ApiError.NotFound, (e) => {
        this.error = 'not found';
        return null;
      })
      .catch(ApiError.Server, (e) => {
        this.error = 'server';
        return null;
      })
      .catch(ApiError.BadRequest, (e) => {
        this.error = 'bad request';
        return null;
      })
      .catch((e) => {
        this.error = e.message;
        return null;
      });
  }

  confirmDelete(e) {
    Util.stop(e);

    Confirm.toggle('remove attachment', {
      elem: this.$(e.currentTarget),
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
      source: 'cardDetailScreen',
    });
  }

  unarchiveCard(card, e) {
    return card.update({ closed: false }, () => {
      return Analytics.sendTrackEvent({
        action: 'reopened',
        actionSubject: 'card',
        source: 'cardDetailScreen',
      });
    });
  }

  confirmLink(card, e) {
    Util.stop(e);

    return Confirm.toggle('link attached card', {
      elem: this.$(e.currentTarget),
      confirmBtnClass: 'nch-button nch-button--primary',
      html:
        `<img src="${require('resources/images/relate-both-cards.png')}" /><br/>` +
        l('confirm.link attached card.text', {
          currentCard: this.model.getCard().get('name'),
          attachedCard: card.get('name'),
        }),
      fxConfirm: () => {
        this.$('.link-trello-card').hide();
        const url =
          this.model.getCard().get('shortUrl') ||
          this.model.getCard().get('url');
        card.uploadUrl(url);
        return Analytics.sendClickedButtonEvent({
          buttonName: 'linkCardsButton',
          source: 'cardDetailScreen',
        });
      },
    });
  }

  remove() {
    if (typeof this.cancelDecayingInterval === 'function') {
      this.cancelDecayingInterval();
    }
    ReactDOM.unmountComponentAtNode(this.$reactRoot[0]);
    return super.remove(...arguments);
  }
}

TrelloCardAttachment.initClass();
module.exports = TrelloCardAttachment;
