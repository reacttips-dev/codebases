/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const Browser = require('@trello/browser');
const { DASHCARDS_POWER_UP_ID } = require('app/scripts/data/dashcards-id');
const { Dates } = require('app/scripts/lib/dates');
const DueDateHelpers = require('app/scripts/views/internal/due-date-helpers');
const { makePreviewCachable } = require('@trello/image-previews');
const { Label } = require('app/scripts/models/label');
const PluginModelSerializer = require('app/scripts/views/internal/plugins/plugin-model-serializer');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const _ = require('underscore');
const labelTemplate = require('app/scripts/views/templates/label');
const pluginCoverWithDefaults = require('app/scripts/lib/plugins/plugin-cover-with-defaults');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const t = require('app/scripts/views/internal/teacup-with-helpers')('badge');
const { l } = require('app/scripts/lib/localize');
const {
  featureFlagClient,
  seesVersionedVariation,
} = require('@trello/feature-flag-client');
const { Util } = require('app/scripts/lib/util');
const { UnsplashTracker } = require('@trello/unsplash');
const {
  shouldFireConfetti,
} = require('app/scripts/views/card/should-fire-confetti');
const confetti = require('canvas-confetti').default;

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

const badgesTemplate = t.renderable(function ({
  archived,
  attachments,
  attachmentsByType,
  checkItems,
  checkItemsChecked,
  checkItemsEarliestDue,
  comments,
  description,
  due,
  dueComplete,
  location,
  notifications,
  start,
  subscribed,
  viewingMemberVoted,
  votes,
  isOnBoardTemplate,
  hideVotes,
  isCardTemplate,
  showDueCompleteCheckbox,
}) {
  if (isCardTemplate) {
    t.div('.badge.is-template', { title: l('badge.template') }, function () {
      t.span('.badge-icon.icon-sm.icon-template-card');
      return t.span('.badge-text', () => t.format('template'));
    });
  }
  if (notifications) {
    t.div(
      '.badge.is-unread-notification',
      { title: l('badge.notifications') },
      function () {
        t.span('.badge-icon.icon-sm.icon-notification');
        return t.span('.badge-text', () => t.text(notifications));
      },
    );
  }
  if (subscribed) {
    t.div('.badge.is-icon-only', { title: l('badge.watch') }, () =>
      t.span('.badge-icon.icon-sm.icon-subscribe'),
    );
  }

  if (votes > 0 && !isCardTemplate) {
    if (!hideVotes) {
      t.div(
        '.badge',
        {
          title: l('badge.votes'),
          class: t.classify({ 'is-voted': viewingMemberVoted }),
        },
        function () {
          t.span('.badge-icon.icon-sm.icon-vote');
          return t.span('.badge-text', () => t.text(votes));
        },
      );
    } else if (hideVotes && viewingMemberVoted) {
      t.div(
        '.badge',
        {
          title: l('badge.votes'),
          class: t.classify({ 'is-voted': viewingMemberVoted }),
        },
        () => t.span('.badge-icon.icon-sm.icon-vote'),
      );
    }
  }

  const timelineVersion = featureFlagClient.get(
    'ecosystem.timeline-version',
    'none',
  );

  const shouldSeeCombinedbadges = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );

  const getDateBadge = (text) => {
    t.div(
      '.badge.js-due-date-badge',
      {
        title: DueDateHelpers.titleForDueDate(due, dueComplete),
        class: t.classify({
          'mod-due-date': showDueCompleteCheckbox,
          [DueDateHelpers.classForDueDate(due, dueComplete)]: true,
        }),
      },
      function () {
        t.span('.badge-icon.icon-sm.icon-clock.badge-due-icon');

        if (showDueCompleteCheckbox) {
          t.span('.badge-icon.icon-sm.icon-checkbox-checked.badge-due-checked');
          t.span(
            '.badge-icon.icon-sm.icon-checkbox-unchecked.badge-due-unchecked',
          );
        }

        return t.span('.badge-text.js-due-date-text', () => t.text(text));
      },
    );
  };

  if (shouldSeeCombinedbadges && !isCardTemplate) {
    if (start && due && start <= due) {
      getDateBadge(`${Dates.toDateString(start)} - ${Dates.toDateString(due)}`);
    } else if (due) {
      getDateBadge(`${Dates.toDateString(due)}`);
    } else if (start) {
      t.div('.badge.js-start-date-badge', function () {
        t.span('.badge-icon.icon-sm.icon-clock');
        t.span('.badge-text.js-start-date-text', function () {
          t.text(
            l(DueDateHelpers.relativeInforForStartDate(start), {
              date: Dates.toDateString(start),
            }),
          );
        });
      });
    }
  } else {
    if (start && !isCardTemplate && timelineVersion !== 'none') {
      t.div('.badge.js-start-date-badge', function () {
        t.span('.badge-icon.icon-sm.icon-clock');
        t.span('.badge-text.js-start-date-text', function () {
          t.text(Dates.toDateString(start));
        });
      });
    }

    if (due && !isCardTemplate) {
      getDateBadge(Dates.toDateString(due));
    }
  }

  if (description) {
    t.div('.badge.is-icon-only', { title: l('badge.description') }, () =>
      t.span('.badge-icon.icon-sm.icon-description'),
    );
  }

  // Hide comments badge on templates, since we're not showing comments on card detail
  if (comments > 0 && !isOnBoardTemplate) {
    t.div('.badge', { title: l('badge.comments') }, function () {
      t.span('.badge-icon.icon-sm.icon-comment');
      return t.span('.badge-text', () => t.text(comments));
    });
  }

  const trelloAttachments = attachmentsByType
    ? attachmentsByType.trello.board + attachmentsByType.trello.card
    : 0;

  attachments = attachments - trelloAttachments;
  if (attachments > 0) {
    t.div('.badge', { title: l('badge.attachments') }, function () {
      t.span('.badge-icon.icon-sm.icon-attachment');
      return t.span('.badge-text', () => t.text(attachments));
    });
  }

  if (trelloAttachments > 0) {
    t.div('.badge', { title: l('badge.trello attachments') }, function () {
      t.span('.badge-icon.icon-sm.icon-board');
      return t.span('.badge-text', () => t.text(trelloAttachments));
    });
  }

  if (checkItems > 0) {
    t.div(
      '.badge.js-checkitems-badge',
      {
        title: l('badge.checkitems'),
        class: t.classify({
          'is-complete': checkItemsChecked === checkItems,
          [DueDateHelpers.classForDueDate(checkItemsEarliestDue, false)]:
            checkItemsEarliestDue != null,
        }),
      },
      function () {
        t.span('.badge-icon.icon-sm.icon-checklist');
        return t.span('.badge-text.js-checkitems-badge-text', function () {
          t.text(checkItemsChecked);
          t.text('/');
          t.text(checkItems);
          if (checkItemsEarliestDue) {
            t.text(' • ');
            return t.text(Dates.toDateString(checkItemsEarliestDue));
          }
        });
      },
    );
  }

  if (archived) {
    t.div('.badge', { title: l('badge.archived.title') }, function () {
      t.span('.badge-icon.icon-sm.icon-archive');
      return t.span('.badge-text', () => t.text(l('badge.archived.text')));
    });
  }

  if (location) {
    return t.div('.badge', { title: l('badge.location') }, () =>
      t.span('.badge-icon.icon-sm.icon-location'),
    );
  }
});

// This whole file shouldn't exist. It only exists because the *previous*
// way that the QuickCardEditor was implemented was even worse. But I'm not
// going to fight that fight today. This is me taking the easy way out.

module.exports = {
  clearCover() {
    this.$el.removeClass('is-covered');
    this.$('.js-card-stickers').css('height', '');
    this.$('.js-card-cover')
      .css({
        'background-origin': '',
        'background-image': '',
        'background-color': '',
        height: '',
        padding: '',
      })
      .removeClass('is-no-preview-size color-card-cover');
    return this.clearColorCover();
  },

  clearColorCover() {
    return this.$('.js-card-cover').removeClass((index, className) =>
      (className.match(/\bcolor-card-cover-\S+/g) || []).join(' '),
    );
  },

  renderCover() {
    let calculatedHeight;
    const board = this.model.getBoard();
    if (!board.getPref('cardCovers') || this.onCalendar) {
      // card covers are disabled on the board or user is on calendar
      this.clearCover();
      this.clearFullCover();
      return this;
    }

    if (!this.model.hasCover()) {
      // card doesn't (or no longer) has a native cover
      this.renderPluginCover();
      return this;
    }

    const {
      idAttachment,
      idUploadedBackground,
      color,
      scaled,
      edgeColor,
      sharedSourceUrl,
      size,
      idPlugin,
    } = this.model.get('cover');

    const $cardCover = this.$('.js-card-cover');
    const $cardStickers = this.$('.js-card-stickers');

    this.clearColorCover();

    if (size === 'full' && this.shouldRenderFullCover()) {
      return this.renderFullCover();
    } else {
      this.clearFullCover();
    }

    const shouldRenderPluginCover = idPlugin && board.isPluginEnabled(idPlugin);

    if (color) {
      calculatedHeight = this.model.hasStickers() ? 64 : 32;
      $cardCover
        .css({
          'background-color': '',
          'background-image': '',
          'background-size': '',
          height: calculatedHeight,
        })
        .toggleClass('is-no-preview-size', false);
      $cardCover.addClass(`color-card-cover color-card-cover-${color}`);
      $cardStickers.css('height', calculatedHeight);
    } else if (
      idAttachment ||
      idUploadedBackground ||
      shouldRenderPluginCover
    ) {
      let left;
      const minWidth = Browser.isHighDPI() ? 600 : 300;
      let preview =
        (left = Util.smallestPreviewBiggerThan(scaled, minWidth)) != null
          ? left
          : Util.biggestPreview(scaled);

      // Not sure how this can happen but supporting it anyway just in case it's a legacy thing.
      if (
        preview == null &&
        idAttachment &&
        this.model.attachmentList != null
      ) {
        const attachmentCover = this.model.attachmentList.get(
          this.model.get('idAttachmentCover'),
        );
        if (attachmentCover == null) {
          return null;
        }
        preview = { url: attachmentCover.get('url') };
      }

      $cardCover
        .css({
          'background-color': edgeColor != null ? edgeColor : 'transparent',
          'background-image': `url("${makePreviewCachable(preview.url)}")`,
        })
        .toggleClass('is-no-preview-size', preview == null);

      if (preview != null) {
        const maxHeight = Math.min(preview.height, 260); // An arbitrarily chosen number

        // 245 is the effective width of the card (including padding and margin
        // and scrollbars)
        calculatedHeight = (preview.height * 245) / preview.width;
        if (calculatedHeight <= maxHeight) {
          $cardCover.css({
            height: calculatedHeight,
            'background-size': 'cover',
          });
          $cardStickers.css('height', calculatedHeight);
        } else {
          $cardCover.css({
            height: maxHeight,
            'background-size': 'contain',
          });
          $cardStickers.css('height', maxHeight);
        }

        if (idUploadedBackground) {
          UnsplashTracker.trackOncePerInterval(sharedSourceUrl);
        }
      }
    }

    this.$el.addClass('is-covered');

    return this;
  },

  clearFullCover() {
    this.$('.js-card-stickers').css('height', '');
    this.$el.removeClass(function (index, className) {
      // matches "color-card-cover" and "color-card-cover-<colorName>"
      const classesToRemove = className.match(/\bcolor-card-cover\S*/g) || [];
      classesToRemove.push('full-cover-list-card');
      classesToRemove.push('full-cover-list-card-dark');
      classesToRemove.push('dashcard');

      return classesToRemove.join(' ');
    });

    return this.$el.css({
      'background-size': '',
      'background-image': '',
      'background-position': '',
      'background-repeat': '',
      'background-color': '',
      'min-height': '',
    });
  },

  renderFullCover() {
    this.clearCover();
    this.clearFullCover();

    const { color, scaled, edgeColor, brightness, idPlugin } = this.model.get(
      'cover',
    );

    if (idPlugin && !this.model.getBoard().isPluginEnabled(idPlugin)) {
      return this;
    }

    if (idPlugin === DASHCARDS_POWER_UP_ID) {
      this.$el.addClass('dashcard');
    }

    this.$el.addClass('full-cover-list-card');

    if (brightness === 'dark') {
      this.$el.addClass('full-cover-list-card-dark');
    }

    if (color) {
      this.$el.addClass(`color-card-cover color-card-cover-${color}`);
    } else {
      let cardHeight, left;
      const minWidth = Browser.isHighDPI() ? 600 : 300;
      const preview =
        (left = Util.smallestPreviewBiggerThan(scaled, minWidth)) != null
          ? left
          : Util.biggestPreview(scaled);

      const styles = {
        'background-image': `url("${preview.url}")`,
        'background-size': 'cover',
      };

      const maxHeight = Math.min(preview.height, 260);

      if (this.$el.height() > maxHeight) {
        cardHeight = 'auto';
        styles['background-size'] = 'contain';
        styles['background-position'] = 'center';
        styles['background-repeat'] = 'no-repeat';
        styles['background-color'] = edgeColor;
      } else {
        const calculatedHeight = (preview.height * 245) / preview.width;

        if (calculatedHeight <= maxHeight) {
          cardHeight = calculatedHeight;
        } else {
          cardHeight = maxHeight;
        }
      }

      styles['min-height'] = cardHeight;

      this.$el.css(styles);

      this.$('.js-card-stickers').css('height', this.$el.height());
    }

    this.$el.addClass('is-covered');

    return this;
  },

  getFullCoverStylesForInitialRender() {
    let left;
    const { idAttachment, scaled } = this.model.get('cover');

    const minWidth = Browser.isHighDPI() ? 600 : 300;
    let preview =
      (left = Util.smallestPreviewBiggerThan(scaled, minWidth)) != null
        ? left
        : Util.biggestPreview(scaled);

    // Not sure how this can happen but supporting it anyway just in case it's a legacy thing.
    if (preview == null && idAttachment && this.model.attachmentList != null) {
      const attachmentCover = this.model.attachmentList.get(
        this.model.get('idAttachmentCover'),
      );
      if (attachmentCover == null) {
        return null;
      }
      preview = { url: attachmentCover.get('url') };
    }

    if (preview == null) {
      return null;
    }

    const styles = {
      'background-image': `url("${preview.url}")`,
      'background-size': 'cover',
    };

    const maxHeight = Math.min(preview.height, 260);

    const calculatedHeight = (preview.height * 245) / preview.width;

    if (calculatedHeight <= maxHeight) {
      styles['min-height'] = `${calculatedHeight}px`;
    } else {
      styles['min-height'] = `${maxHeight}px`;
    }

    return t.stylify(styles);
  },

  renderPluginCover() {
    return this.waitForId(this.model, () => {
      return PluginRunner.one({
        command: 'card-cover',
        board: this.model.getBoard(),
        card: this.model,
        list: this.model.getList(),
        timeout: 10000,
        options: {
          attachments: PluginModelSerializer.attachments(
            this.model.attachmentList.models,
            ['id', 'url'],
          ),
          cardDetail: false,
        },
        // normally we wouldn't specify the plugins as the command is enough
        // because we split the card-cover capability into an old version & new
        // we need to only hit the old style ones here
        fxPluginFilter(plugin) {
          return !(plugin.get('tags') || []).includes('plugin-cover-beta');
        },
      })
        .then((pluginCover) => {
          // to avoid race conditions since this was async, check if there is
          // a native cover again
          if (this.model.hasCover()) {
            return;
          }
          if (!pluginValidators.isValidCover(pluginCover)) {
            throw new Error('Invalid cover supplied');
          }
          const sanitizedCover = pluginCoverWithDefaults(pluginCover);
          // update the CSS
          const $cardCover = this.$('.js-card-cover');
          $cardCover
            .css({
              'background-origin': 'content-box',
              'background-color': sanitizedCover.edgeColor,
              'background-image': `url("${sanitizedCover.url}")`,
              'background-position': sanitizedCover.position,
              'background-repeat': 'no-repeat',
              'background-size': sanitizedCover.size,
              height: `${sanitizedCover.height}px`,
              padding: sanitizedCover.padding,
            })
            .removeClass('is-no-preview-size');
          this.$('.js-card-stickers').css(
            'height',
            sanitizedCover.stickerHeight,
          );
          return this.$el.addClass('is-covered');
        })
        .catch(() => {
          // to avoid race conditions since this was async, check if there is
          // a native cover again
          if (!this.model.hasCover()) {
            this.clearCover();
            return this.clearFullCover();
          }
        });
    });
  },

  getBadgesHtml() {
    let left;
    const badges = (left = this.model.get('badges')) != null ? left : {};
    const dueCompleteCheckboxFlagEnabled = featureFlagClient.get(
      'remarkable.card-front-due-complete-checkbox',
      false,
    );

    return badgesTemplate({
      subscribed: badges.subscribed,
      description: badges.description,
      comments: badges.comments,
      attachments: badges.attachments,
      attachmentsByType: badges.attachmentsByType,
      checkItems: badges.checkItems,
      checkItemsChecked: badges.checkItemsChecked,
      checkItemsEarliestDue: badges.checkItemsEarliestDue,
      hideVotes: !!__guard__(
        __guard__(this.model.getBoard(), (x1) => x1.get('prefs')),
        (x) => x.hideVotes,
      ),
      votes: badges.votes,
      viewingMemberVoted: badges.viewingMemberVoted,
      due: this.model.get('due'),
      dueComplete: this.model.get('dueComplete'),
      notifications: _.filter(
        this.modelCache.all('Notification'),
        (notification) => {
          return (
            notification.get('unread') &&
            this.model.id != null &&
            __guard__(
              __guard__(notification.get('data'), (x3) => x3.card),
              (x2) => x2.id,
            ) === this.model.id
          );
        },
      ).length,
      archived: this.model.get('closed'),
      location:
        badges.location &&
        __guard__(this.model.getBoard(), (x2) => x2.isMapPowerUpEnabled()),
      isOnBoardTemplate: this.model.isOnBoardTemplate(),
      isCardTemplate: !!this.model.get('isTemplate'),
      showDueCompleteCheckbox:
        this.model.editable() && dueCompleteCheckboxFlagEnabled,
      start: this.model.get('start'),
    });
  },

  renderBadges() {
    this.$('.js-badges').html(this.getBadgesHtml());
    return this;
  },

  updateDateBadges() {
    this.updateDueDate();
    return this.updateCheckItemsEarliestDue();
  },

  updateDueDate() {
    const due = this.model.get('due');
    const start = this.model.get('start');
    const dueComplete = this.model.get('dueComplete');

    const badgeElem = this.el.querySelector('.js-due-date-badge');
    const badgeText = this.el.querySelector('.js-due-date-text');
    const shouldSeeCombinedbadges = seesVersionedVariation(
      'ecosystem.timeline-version',
      'stable',
    );

    if (badgeElem && badgeText) {
      const currentTitle = badgeElem.getAttribute('title');
      const newTitle = DueDateHelpers.titleForDueDate(due, dueComplete);

      // If no update is necessary, return early
      if (currentTitle === newTitle) {
        return this;
      }

      badgeElem.setAttribute('title', newTitle);
      const oldClass = badgeElem.classList.value.split(' ').pop();
      badgeElem.classList.replace(
        oldClass,
        DueDateHelpers.classForDueDate(due, dueComplete),
      );
      if (shouldSeeCombinedbadges && start && start < due) {
        badgeText.innerText = `${Dates.toDateString(
          start,
        )} - ${Dates.toDateString(due)}`;
      } else {
        badgeText.innerText = Dates.toDateString(due);
      }
    }
    return this;
  },

  updateCheckItemsEarliestDue() {
    const badges = this.model.get('badges');

    if (!badges) {
      return this;
    }

    const { checkItemsEarliestDue } = badges;

    const $badgeElem = this.$('.js-checkitems-badge');

    if ($badgeElem) {
      $badgeElem.removeClass((index, className) =>
        (className.match(/\bis-due-\S+/g) || []).join(' '),
      );

      if (checkItemsEarliestDue) {
        $badgeElem.addClass(
          DueDateHelpers.classForDueDate(checkItemsEarliestDue, false),
        );
      }
    }

    return this;
  },

  toggleDueDateComplete(e) {
    if (
      !featureFlagClient.get(
        'remarkable.card-front-due-complete-checkbox',
        false,
      )
    ) {
      return;
    }

    if (!this.model.editable()) {
      return;
    }

    Util.stop(e);

    const newValue = !this.model.get('dueComplete');

    const traceId = Analytics.startTask({
      taskName: 'edit-card/dueComplete',
      source: 'cardView',
    });

    if (
      newValue &&
      (shouldFireConfetti(this.model.get('name')) ||
        shouldFireConfetti(this.model.getList().get('name')))
    ) {
      confetti({
        angle: _.random(55, 125),
        spread: _.random(50, 70),
        particleCount: _.random(40, 75),
        origin: {
          x: e.pageX / window.innerWidth,
          y: e.pageY / window.innerHeight,
        },
      });
    }

    return this.model.update(
      {
        dueComplete: newValue,
        traceId,
      },
      tracingCallback(
        {
          taskName: 'edit-card/dueComplete',
          traceId,
          source: 'cardView',
        },
        (err, card) => {
          if (card) {
            Analytics.sendUpdatedCardFieldEvent({
              field: 'dueComplete',
              source: 'cardView',
              attributes: {
                taskId: traceId,
              },
              containers: {
                card: { id: card.id },
                list: { id: card.idList },
                board: { id: card.idBoard },
              },
            });
          }
        },
      ),
    );
  },

  updateBadges() {
    if (
      featureFlagClient.get(
        'remarkable.card-front-due-complete-checkbox',
        false,
      )
    ) {
      const previousBadges = this.model.previous('badges');
      const currentBadges = this.model.get('badges');
      if (previousBadges && currentBadges) {
        const changedBadges = Object.keys(previousBadges).filter(
          (key) => !_.isEqual(currentBadges[key], previousBadges[key]),
        );

        if (
          changedBadges.length === 1 &&
          changedBadges.includes('dueComplete')
        ) {
          return this.renderDueComplete();
        }
      }
    }

    return this.renderBadges();
  },

  renderMembers(e) {
    const memberHtmls = (() => {
      const result = [];
      for (let i = this.model.memberList.models.length - 1; i >= 0; i--) {
        const member = this.model.memberList.models[i];
        result.push(this.getMemberOnCardHtml(member));
      }
      return result;
    })();
    this.$('.js-list-card-members').empty().append(memberHtmls.join(''));
    return this;
  },

  labelsData() {
    return _.chain(this.model.getLabels())
      .sort(Label.compare)
      .map((label) => this.model.dataForLabel(label))
      .filter((uiLabel) => !_.isEmpty(uiLabel.color))
      .value();
  },

  renderLabels() {
    const labelsHtml = (() => {
      const result = [];
      for (const label of Array.from(this.labelsData())) {
        const data = label;
        data.extraClasses = ['mod-card-front'];
        result.push(labelTemplate(data));
      }
      return result;
    })();

    this.$('.js-card-labels').empty().append(labelsHtml);
    return this;
  },
};
