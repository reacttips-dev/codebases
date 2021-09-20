const { Util } = require('app/scripts/lib/util');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const { l } = require('app/scripts/lib/localize');
const { sendErrorEvent } = require('@trello/error-reporting');
const { Feature } = require('app/scripts/debug/constants');
const cardDetailToggleButtonTemplate = require('app/scripts/views/templates/card_detail_toggle_button');

module.exports.convertToTemplate = function (e) {
  Util.stop(e);
  const traceId = Analytics.startTask({
    taskName: 'edit-card/isTemplate',
    source: 'cardDetailScreen',
  });
  Analytics.sendClickedButtonEvent({
    buttonName: 'convertToTemplateButton',
    source: 'cardDetailScreen',
    container: {
      board: {
        id: this.model.id,
      },
      organization: {
        id: this.model.get('idOrganization') || '',
      },
    },
  });
  this.model.update(
    { isTemplate: true, traceId },
    tracingCallback(
      {
        taskName: 'edit-card/isTemplate',
        traceId,
        source: 'cardDetailScreen',
      },
      (err, card) => {
        if (card) {
          Analytics.sendUpdatedCardFieldEvent({
            field: 'isTemplate',
            source: 'cardDetailScreen',
            attributes: {
              taskId: traceId,
              value: true,
            },
            containers: {
              board: { id: card.idBoard },
              card: { id: card.id },
              list: { id: card.idList },
            },
          });
        }
      },
    ),
  );
};

module.exports.convertToCard = function (e) {
  Util.stop(e);
  const traceId = Analytics.startTask({
    taskName: 'edit-card/isTemplate',
    source: 'cardDetailScreen',
  });
  this.model.update(
    { isTemplate: false, traceId },
    tracingCallback(
      {
        taskName: 'edit-card/isTemplate',
        traceId,
        source: 'cardDetailScreen',
      },
      (err, card) => {
        if (card) {
          Analytics.sendUpdatedCardFieldEvent({
            field: 'isTemplate',
            source: 'cardDetailScreen',
            attributes: {
              taskId: traceId,
              value: false,
            },
            containers: {
              board: { id: card.idBoard },
              card: { id: card.id },
              list: { id: card.idList },
            },
          });
        }
      },
    ),
  );
};

module.exports.renderCardTemplate = function () {
  try {
    const $templateSidebar = this.$('.js-template-sidebar-button');
    const $addHeading = this.$('.js-sidebar-add-heading');
    const $archiveButtonText = this.$(
      '.js-archive-card .js-sidebar-action-text',
    );
    const $unarchiveButtonText = this.$(
      '.js-unarchive-card .js-sidebar-action-text',
    );

    const isTemplate = !!this.model.get('isTemplate');

    $templateSidebar.next('.toggle-button').remove();
    if (isTemplate) {
      $templateSidebar.after(
        cardDetailToggleButtonTemplate({
          isOn: isTemplate,
          text: 'template',
          title: 'convert-this-template-back-to-a-card',
          icon: 'template-card',
          selectorOn: 'js-convert-to-card',
          selectorOff: 'js-convert-to-template',
        }),
      );

      $addHeading.text(l(['templates', 'card_detail', 'add-to-template']));
      $archiveButtonText.text(
        l(['templates', 'card_detail', 'hide-from-list']),
      );
      $archiveButtonText.attr(
        'title',
        l(['templates', 'card_detail', 'hide-from-list']),
      );
      $unarchiveButtonText.text(
        l(['templates', 'card_detail', 'show-in-list']),
      );
      $unarchiveButtonText.attr(
        'title',
        l(['templates', 'card_detail', 'show-in-list']),
      );
    } else {
      $addHeading.text(l(['templates', 'card_detail', 'add-to-card']));
      $archiveButtonText.text(l(['templates', 'card_detail', 'archive']));
      $archiveButtonText.attr(
        'title',
        l(['templates', 'card_detail', 'archive']),
      );
      $unarchiveButtonText.text(
        l(['templates', 'card_detail', 'send-to-board']),
      );
      $unarchiveButtonText.attr(
        'title',
        l(['templates', 'card_detail', 'send-to-board']),
      );
    }

    this.$('.js-convert-to-template').toggleClass('hide', isTemplate);

    const $cardHeaderIcon = this.$('.js-card-header-icon');
    $cardHeaderIcon.toggleClass('icon-card', !isTemplate);
    $cardHeaderIcon.toggleClass('icon-template-card', isTemplate);
    this.$('.js-convert-to-template').toggleClass('hide', isTemplate);

    return this;
  } catch (error) {
    sendErrorEvent(error, {
      tags: {
        ownershipArea: 'trello-panorama',
        feature: Feature.TemplateCard,
      },
    });
  }
};

module.exports.isOnBoardTemplate = function () {
  return this.model.isOnBoardTemplate();
};
