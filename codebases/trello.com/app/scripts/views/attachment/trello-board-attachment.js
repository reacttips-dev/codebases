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
const $ = require('jquery');
const { ApiError } = require('app/scripts/network/api-error');
const Confirm = require('app/scripts/views/lib/confirm');
const { ModelCache } = require('app/scripts/db/model-cache');
const { ModelLoader } = require('app/scripts/db/model-loader');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
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
  TrelloBoardAttachmentComponent,
  TrelloBoardAttachmentGenericError,
  TrelloBoardAttachmentLoading,
  TrelloBoardAttachmentSpecificError,
  TrelloBoardAttachmentUnauthorized,
} = require('./trello-board-attachment-components');

const {
  ReactRootComponent,
} = require('app/scripts/views/internal/react-root-component');

class TrelloBoardAttachment extends View {
  static initClass() {
    this.prototype.className = 'trello-board-attachment-container';
  }

  initialize() {
    if (this.$reactRoot == null) {
      this.$reactRoot = $('<div></div>');
    }

    return this.getBoard()
      .then(
        this.callback((board) => {
          this.board = board;
          if (this.board) {
            this.setUpListeners();
          }
          return this.renderReactSection();
        }),
      )
      .catch((e) => console.error(e));
  }

  setUpListeners() {
    if (this.board.id !== this.model.getCard().getBoard().id) {
      this.startPolling();
      return;
    }

    const renderReactSectionDebounced = this.frameDebounce(
      this.renderReactSection,
    );

    this.listenTo(this.board, {
      change: renderReactSectionDebounced,
      destroy: () => {
        this.board = null;
        this.error = 'not found';
        return this.renderReactSection();
      },
    });

    return this.listenTo(this.board.listList, {
      'add remove': renderReactSectionDebounced,
    });
  }

  startPolling() {
    const renderBoard = () => {
      return this.fetchBoard().then(
        this.callback(() => {
          return this.renderReactSection();
        }),
      );
    };

    // Limit server requests using decaying interval
    return (this.cancelDecayingInterval = startDecayingInterval(renderBoard));
  }

  renderReactSection() {
    ReactDOM.render(
      <ReactRootComponent>
        {this.getTrelloBoardAttachment()}
      </ReactRootComponent>,
      this.$reactRoot[0],
    );

    return this;
  }

  render() {
    this.$el.append(this.$reactRoot);
    this.renderReactSection();

    return this;
  }

  getTrelloBoardAttachmentError() {
    const canEdit = this.model.getCard().editable();

    const props = {
      error: this.error,
      canEdit,
      onRemove: this.confirmDelete.bind(this),
    };

    return recup.render(() =>
      recup.div(() => {
        if (this.error === 'unauthorized') {
          return recup.createElement(TrelloBoardAttachmentUnauthorized, props);
        } else if (
          ['server', 'bad request', 'not found'].includes(this.error)
        ) {
          return recup.createElement(TrelloBoardAttachmentSpecificError, props);
        } else {
          return recup.createElement(
            TrelloBoardAttachmentGenericError,
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

  getTrelloBoardAttachment() {
    if (this.error) {
      return this.getTrelloBoardAttachmentError();
    }

    return recup.render(() => {
      return recup.div(() => {
        if (!this.board) {
          return recup.createElement(TrelloBoardAttachmentLoading);
        }

        const canRemove = this.model.getCard().editable();

        return recup.createElement(TrelloBoardAttachmentComponent, {
          board: this.board,
          canRemove,
          onRemove: this.confirmDelete.bind(this),
        });
      });
    });
  }

  getShortLink() {
    if (!this.shortLink) {
      this.shortLink = parseTrelloUrl(this.options.boardUrl).shortLink;
    }

    return this.shortLink;
  }

  getBoard() {
    // Refreshing from the server as board structure gets stale

    return this.fetchBoard();
  }

  fetchBoard() {
    const shortLink = this.getShortLink();

    return ModelLoader.loadBoardAttachment(shortLink)
      .then(() => {
        this.error = null;
        return ModelCache.get('Board', shortLink);
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
      source: 'cardDetailScreen',
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

TrelloBoardAttachment.initClass();
module.exports = TrelloBoardAttachment;
