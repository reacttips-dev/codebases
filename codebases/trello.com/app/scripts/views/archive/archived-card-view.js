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
const { Analytics } = require('@trello/atlassian-analytics');
const CardView = require('app/scripts/views/card/card-view');
const {
  maybeDisplayLimitsErrorOnCardOpen,
} = require('app/scripts/views/card/card-limits-error');
const Confirm = require('app/scripts/views/lib/confirm');
const { Controller } = require('app/scripts/controller');
const Dialog = require('app/scripts/views/lib/dialog');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const React = require('react');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const {
  ArchivedCardOptions,
} = require('app/scripts/views/templates/ArchivedCardOptions');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class ArchivedCardView extends View {
  static initClass() {
    this.prototype.tagName = 'div';

    this.prototype.className = 'archived-list-card';

    this.prototype.events = {
      'click .list-card': 'openCard',
      'click .js-delete': 'deleteModel',
      'click .js-reopen': 'reopen',
    };

    this.prototype.vigor = this.VIGOR.NONE;
  }

  initialize() {
    if (this.$reactRoot == null) {
      this.$reactRoot = $('<div></div>');
    }

    this.linkCardsEnabled = featureFlagClient.get('wildcard.link-cards', false);

    return (this.sendGASEvent = featureFlagClient.get(
      'dataeng.gasv3-event-tracking',
      false,
    ));
  }

  render() {
    const cardView = this.subview(CardView, this.model, {
      dontFilter: true,
      quickEditHidden: true,
    });
    cardView.render();
    this.$el.append(cardView.el);

    const props = {
      editable: this.model.editable(),
      canDelete: this.options.canDelete,
      canReopen: this.model.getList() != null,
      reOpenText: this.options.reOpenText,
    };
    this.$el.append(this.$reactRoot);

    if (!this.unmountArchivedCardOptions) {
      this.unmountArchivedCardOptions = renderComponent(
        <ArchivedCardOptions {...props} />,
        this.$reactRoot[0],
      );
    }

    return super.render();
  }

  remove() {
    if (this.unmountArchivedCardOptions) {
      this.unmountArchivedCardOptions();
      this.unmountArchivedCardOptions = null;
    }
    return super.remove(...arguments);
  }

  openCard(e) {
    if (this.model.get('cardRole')) {
      return;
    }

    Util.stop(e);
    Controller.showCardDetail(this.model);
    Dialog.calcPos();
  }

  deleteModel(e) {
    Util.stop(e);
    Confirm.toggle('delete card', {
      elem: __guard__($(e.target).closest('.js-delete'), (x) => x[0]),
      model: this.model,
      confirmBtnClass: 'nch-button nch-button--danger',
      fxConfirm: () => {
        this.model.destroy();
        this.unmountArchivedCardOptions && this.unmountArchivedCardOptions();
        return Analytics.sendTrackEvent({
          action: 'deleted',
          actionSubject: 'card',
          source: 'archiveScreen',
          containers: {
            card: {
              id: this.model.id,
            },
            list: {
              id: this.model.getList().id,
            },
            board: {
              id: this.model.getBoard().id,
            },
          },
        });
      },
    });
  }

  reopen(e) {
    Util.preventDefault(e);
    const options = {
      $elem: $(e.target),
      hasAttachments: this.model.attachmentList.length > 0,
      destinationBoard: this.model.getBoard(),
      destinationList: this.model.getList(),
    };
    if (maybeDisplayLimitsErrorOnCardOpen(options)) {
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'edit-card/closed',
      source: 'archiveScreen',
    });

    this.model.update({ closed: false, traceId }, (err, card) => {
      if (err) {
        throw Analytics.taskFailed({
          taskName: 'edit-card/closed',
          traceId,
          source: 'archiveScreen',
          error: err,
        });
      } else {
        Analytics.sendUpdatedCardFieldEvent({
          field: 'closed',
          source: 'archiveScreen',
          containers: {
            card: { id: card.id },
            board: { id: card.idBoard },
            list: { id: card.idList },
          },
          attributes: {
            taskId: traceId,
          },
        });
        Analytics.taskSucceeded({
          taskName: 'edit-card/closed',
          traceId,
          source: 'archiveScreen',
        });
      }

      if (this.unmountArchivedCardOptions) {
        this.unmountArchivedCardOptions();
        this.unmountArchivedCardOptions = null;
      }
      return Analytics.sendTrackEvent({
        action: 'reopened',
        actionSubject: 'card',
        source: 'archiveScreen',
        containers: {
          card: {
            id: this.model.id,
          },
          list: {
            id: this.model.getList().id,
          },
          board: {
            id: this.model.getBoard().id,
          },
        },
      });
    });
    return false;
  }
}

ArchivedCardView.initClass();
module.exports = ArchivedCardView;
