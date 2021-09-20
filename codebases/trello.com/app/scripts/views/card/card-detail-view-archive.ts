import $ from 'jquery';
import { Analytics, tracingCallback } from '@trello/atlassian-analytics';
import { CardModel } from 'app/gamma/src/types/models';
import Confirm from 'app/scripts/views/lib/confirm';
import Dialog from 'app/scripts/views/lib/dialog';

import { maybeDisplayLimitsErrorOnCardOpen } from 'app/scripts/views/card/card-limits-error';

export const archiveCard = function (e: MouseEvent) {
  const traceId = Analytics.startTask({
    taskName: 'edit-card/closed',
    source: 'cardDetailScreen',
  });

  this.model.close(traceId, (err: Error | null, card: CardModel) => {
    if (err) {
      throw Analytics.taskFailed({
        taskName: 'edit-card/closed',
        traceId,
        source: 'cardDetailScreen',
        error: err,
      });
    } else {
      Analytics.sendUpdatedCardFieldEvent({
        field: 'closed',
        source: 'cardDetailScreen',
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
        source: 'cardDetailScreen',
      });
    }
  });
};

export const unarchiveCard = function (e: MouseEvent) {
  const options = {
    $elem: e.target ? $(e.target) : $(),
    hasAttachments: this.model.attachmentList.length > 0,
    destinationBoard: this.model.getBoard(),
    destinationList: this.model.getList(),
  };
  if (maybeDisplayLimitsErrorOnCardOpen(options)) {
    return;
  }

  const traceId = Analytics.startTask({
    taskName: 'edit-card/closed',
    source: 'cardDetailScreen',
  });

  this.model.reopen(traceId, (err: Error | null, card: CardModel) => {
    if (err) {
      throw Analytics.taskFailed({
        taskName: 'edit-card/closed',
        traceId,
        source: 'cardDetailScreen',
        error: err,
      });
    } else {
      Analytics.sendUpdatedCardFieldEvent({
        field: 'closed',
        source: 'cardDetailScreen',
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
        source: 'cardDetailScreen',
      });
    }
  });
};

export const renderArchived = function () {
  const isArchived = this.model.get('closed') === true;
  this.$('.js-archive-card').toggleClass('hide', isArchived);
  this.$('.js-unarchive-card').toggleClass('hide', !isArchived);
  return this;
};

export const renderDelete = function () {
  const isArchived = this.model.get('closed') === true;
  const shouldShowDeleteButton = isArchived || !!this.model.get('isTemplate');
  this.$('.js-delete-card').toggleClass('hide', !shouldShowDeleteButton);
  return this;
};

interface CardResponse {
  id: string;
}

export const deleteCardSidebar = function (e: MouseEvent) {
  Confirm.toggle('delete card', {
    elem: e.target,
    model: this.model,
    confirmBtnClass: 'nch-button nch-button--danger',
    fxConfirm: (function (_this) {
      return function (confirmClickEvent: MouseEvent) {
        Dialog.hide();
        const traceId = Analytics.startTask({
          taskName: 'delete-card',
          source: 'cardDetailScreen',
        });
        _this.model.deleteWithTracing(
          traceId,
          tracingCallback(
            {
              taskName: 'delete-card',
              source: 'cardDetailScreen',
              traceId,
            },
            (_err: Error, response: CardResponse) => {
              if (response) {
                Analytics.sendTrackEvent({
                  action: 'deleted',
                  actionSubject: 'card',
                  source: 'cardDetailScreen',
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
      };
    })(this),
  });
  Analytics.sendScreenEvent({
    name: 'confirmDeleteCardInlineDialog',
    containers: this.model.getAnalyticsContainers(),
    attributes: {
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
  });
};
