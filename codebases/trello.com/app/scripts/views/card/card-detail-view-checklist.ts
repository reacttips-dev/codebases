import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';
import { Analytics, tracingCallback } from '@trello/atlassian-analytics';
import DueDateHelpers from 'app/scripts/views/internal/due-date-helpers';
import { shouldFireConfetti } from 'app/scripts/views/card/should-fire-confetti';
import confetti from 'canvas-confetti';
import { Util } from 'app/scripts/lib/util';
import ChecklistView from 'app/scripts/views/checklist/checklist-view';
import { PopOver } from 'app/scripts/views/lib/pop-over';
import DragSort from 'app/scripts/views/lib/drag-sort';
import DatePickerView from 'app/scripts/views/card/date-picker-view';
import AddChecklistMenu from 'app/scripts/views/checklist/add-checklist-menu';
import { toggleDatePopoverV2 } from 'app/scripts/views/checklist/toggle-date-popover';
import {
  DateRangePickerButton,
  DateRangePickerBadge,
} from 'app/src/components/DateRangePicker';
import { renderComponent } from 'app/src/components/ComponentWrapper';
import React from 'react';
import { LazyDateRangePicker } from 'app/src/components/DateRangePicker/LazyDateRangePicker';
import {
  featureFlagClient,
  seesVersionedVariation,
} from '@trello/feature-flag-client';

const { forTemplate } = require('@trello/i18n');

const formatTemplate = forTemplate('card_detail');

export const renderAddChecklists = function () {
  const cardOver = this.model.isOverLimit('checklists', 'perCard');
  const boardOver = this.model.getBoard().isOverLimit('checklists', 'perBoard');
  const disabled = cardOver || boardOver;
  this.$('.js-add-checklist-menu').toggleClass('disabled', disabled);
  return this;
};

export const renderStartDate = function () {
  const start = this.model.get('start');
  const isTemplate = !!this.model.get('isTemplate');

  const combinedBadgesFlag = featureFlagClient.get(
    'ecosystem.combined-card-back-date-badges',
    false,
  );
  const areBadgesCombined = combinedBadgesFlag && this.model.get('due');

  this.$('.js-add-start-date').toggleClass('hide', isTemplate);
  if (!start || isTemplate || areBadgesCombined) {
    this.$('.js-card-detail-start-date').addClass('hide');
    return this;
  }
  const $badge = this.$('.js-card-detail-start-date-badge').toggleClass(
    'is-clickable',
    this.model.editable(),
  );

  // Timeline users should see the new start date badge, which visually looks the same
  // as the old one, but pops up the new Date Range Picker when clicked.
  const openDateRangePickerOnDateBadges = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );

  if (openDateRangePickerOnDateBadges) {
    const container = $badge.find(
      '.card-detail-badge-start-date-react-container',
    )[0];
    if (container) {
      renderComponent(
        React.createElement(DateRangePickerBadge, {
          type: 'startDate',
          due: this.model.get('due'),
          start: start,
          dueReminder: this.model.get('dueReminder'),
          idCard: this.model.id,
          idBoard: this.model.getBoard()?.id,
          idOrg: this.model.getBoard()?.get('idOrganization'),
          canEdit: this.model.editable(),
        }),
        container,
      );
    }
  } else {
    $badge
      .find('.card-detail-badge-start-date-button')
      .toggleClass('js-details-edit-start-date', this.model.editable());
    const startDateDate = moment(start).calendar();
    $badge.find('.js-date-text').text(startDateDate);
  }

  this.$('.js-card-detail-start-date').removeClass('hide');
  return this;
};

export const renderDueDate = function () {
  const due = this.model.get('due');
  const dueComplete = this.model.get('dueComplete');
  const isTemplate = !!this.model.get('isTemplate');
  this.$('.js-add-due-date').toggleClass('hide', isTemplate);
  if (!due || isTemplate) {
    this.$('.js-card-detail-due-date').addClass('hide');
    return this;
  }
  const dueDateDate = moment(due).calendar();
  const relativeDueDateStatus = DueDateHelpers.relativeInfoForDueDate(
    due,
    dueComplete,
  );
  const classForDueDate = DueDateHelpers.classForDueDate(due, dueComplete);
  const classes = [];
  classes.push(classForDueDate);
  if (this.model.editable()) {
    classes.push('is-clickable');
  }
  const $badge = this.$('.js-card-detail-due-date-badge')
    .removeClass(function (index: number, css: string) {
      return (css.match(/is-due-\S+/g) || []).join(' ');
    })
    .addClass(classes.join(' '))
    .attr('title', DueDateHelpers.titleForDueDate(due, dueComplete));

  // Timeline users should see the new due date badge, which visually looks the same
  // as the old one, but pops up the new Date Range Picker when clicked.
  const openDateRangePickerOnDateBadges = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );

  if (openDateRangePickerOnDateBadges) {
    const combinedBadgesFlag = featureFlagClient.get(
      'ecosystem.combined-card-back-date-badges',
      false,
    );

    // the badge header should say "Dates" if both dates are present, or just
    // "Due date" if only the due date is present.
    const areBadgesCombined = combinedBadgesFlag && this.model.get('start');
    const headerString = areBadgesCombined
      ? formatTemplate('dates')
      : formatTemplate('due-date');
    this.$('.js-card-detail-due-date')
      .find('.card-detail-item-header')
      .html(headerString);

    const container = $badge.find(
      '.card-detail-badge-due-date-react-container',
    )[0];
    if (container) {
      renderComponent(
        React.createElement(DateRangePickerBadge, {
          type: 'dueDate',
          relativeDueDateStatus,
          classForDueDate,
          due,
          start: this.model.get('start'),
          dueReminder: this.model.get('dueReminder'),
          idCard: this.model.id,
          idBoard: this.model.getBoard()?.id,
          idOrg: this.model.getBoard()?.get('idOrganization'),
          canEdit: this.model.editable(),
        }),
        container,
      );
    }
  } else {
    $badge
      .find('.card-detail-badge-due-date-button')
      .toggleClass('js-details-edit-due-date', this.model.editable());
    $badge.find('.js-date-text').text(dueDateDate);
    if (relativeDueDateStatus) {
      $badge
        .find('.js-due-status')
        .removeClass('hide')
        .text(relativeDueDateStatus);
    } else {
      $badge.find('.js-due-status').addClass('hide');
    }
  }
  $badge
    .find('.js-card-detail-due-date-badge-complete')
    .toggleClass('js-details-toggle-due-date-complete', this.model.editable());
  this.$('.js-card-detail-due-date').removeClass('hide');
  return this;
};

export const sortChecklists = function () {
  const $checklistList = this.$('.js-checklist-list');
  Util.withoutAlteringSelection(
    (function (_this) {
      return function () {
        return _this.model.checklistList.forEach(function <T>(checklist: T) {
          const checklistView = _this.existingSubview(ChecklistView, checklist);
          return $checklistList.append(checklistView.el);
        });
      };
    })(this),
  );
  return this;
};

export const removeChecklist = function <T>(checklist: T) {
  return this.deleteSubview(this.existingSubview(ChecklistView, checklist));
};

export const renderChecklists = function () {
  const $checklistList = this.$('.js-checklist-list').empty();
  const subviews = function () {
    const ref = this.model.checklistList.models;
    const results = [];
    for (let i = 0, len = ref.length; i < len; i++) {
      const checklist = ref[i];
      results.push(
        this.subview(ChecklistView, checklist, {
          card: this.model,
        }),
      );
    }
    return results;
  }.call(this);
  this.appendSubviews(subviews, $checklistList);
  DragSort.refreshIfInitialized($checklistList);
  if (!!this.model && this.model.editable()) {
    DragSort.refreshCardSortable(this.$('.js-checklist-list'), {
      axis: 'y',
      handle: '.window-module-title',
      delay: 75,
      distance: 7,
      tolerance: 'pointer',
      placeholder: 'checklist placeholder',
      items: '.checklist',
      start: function (event: MouseEvent, ui: JQueryUI.SortableUIParams) {
        const placeholder = $(ui.placeholder);
        const _height = $(ui.helper).outerHeight();
        return _height ? placeholder.height(_height) : placeholder;
      },
    });
  }
  return this;
};

export const sortStop = function (e: Event, ui: JQueryUI.SortableUIParams) {
  Util.stopPropagation(e);
  ui.item.trigger('movechecklist', [ui]);
};

export const onChecklistClick = function (e: MouseEvent) {
  Util.preventDefault(e);
  Analytics.sendClickedButtonEvent({
    buttonName: 'checklistButton',
    source: 'cardDetailScreen',
    containers: this.model.getAnalyticsContainers(),
  });
  return this.addChecklistSidebar(e.target);
};

export const onChecklistShortcut = function () {
  return this.addChecklistSidebar(this.$('.js-add-checklist-menu'));
};

export const addChecklistSidebar = function (mountPoint: HTMLElement) {
  PopOver.toggle({
    elem: mountPoint,
    view: AddChecklistMenu,
    options: {
      model: this.model,
      modelCache: this.modelCache,
      cardView: this,
    },
  });
  return false;
};

export const showDueDateBadgeMenu = function (e: Event) {
  Util.stop(e);
  PopOver.toggle({
    elem: this.$('.js-details-edit-due-date'),
    view: DatePickerView,
    options: {
      model: this.model,
      modelCache: this.modelCache,
      trackingCategory: 'card detail',
    },
  });
};

interface CardResponse {
  id: string;
  idList: string;
  idBoard: string;
}

export const toggleDueDateComplete = function (e: MouseEvent) {
  const newValue = !this.model.get('dueComplete');
  const traceId = Analytics.startTask({
    taskName: 'edit-card/dueComplete',
    source: 'cardDetailScreen',
  });
  this.model.update(
    {
      dueComplete: newValue,
      traceId,
    },
    tracingCallback(
      {
        taskName: 'edit-card/dueComplete',
        traceId,
        source: 'cardDetailScreen',
      },
      (err, card: CardResponse) => {
        if (card) {
          Analytics.sendUpdatedCardFieldEvent({
            field: 'dueComplete',
            source: 'cardDetailScreen',
            attributes: {
              taskId: traceId,
              cardIsTemplate: this.model.get('isTemplate'),
              cardIsClosed: this.model.get('closed'),
              value: newValue ? 'complete' : 'incomplete',
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
};

export const dueDateSidebar = function (e: Event) {
  Util.preventDefault(e);
  Analytics.sendClickedButtonEvent({
    buttonName: 'dueDateButton',
    source: 'cardDetailScreen',
    containers: this.model.getAnalyticsContainers(),
  });
  PopOver.toggle({
    elem: this.$('.js-add-due-date'),
    view: DatePickerView,
    options: {
      model: this.model,
      modelCache: this.modelCache,
      trackingCategory: 'card detail',
    },
  });
  return false;
};

export const editStartDatePopOver = function (e: Event) {
  // Adding this GASv3 event because the popover uses snowplow for tracking
  Analytics.sendClickedButtonEvent({
    buttonName: 'startDateButton',
    source: 'cardDetailScreen',
  });
  toggleDatePopoverV2({
    title: formatTemplate('start-date'),
    toggleSource: 'startDate',
    setDate: (date: Date | null) => {
      if (date) {
        this.model.update('start', date.getTime());
      } else {
        this.model.update('start', null);
      }
    },
    getInitialDate: () => this.model.get('start'),
    // since this is for setting start date, set the hour time to 8am
    hourTime: 8,
  })(e);
  return false;
};

export const renderDateRangePickerButton = function () {
  const isTemplate = this.model.get('isTemplate');
  this.$('.js-date-range-picker').addClass('hide');
  const container = this.$('.js-date-range-picker')[0];
  if (container && !isTemplate) {
    renderComponent(
      React.createElement(DateRangePickerButton, {
        due: this.model.get('due'),
        start: this.model.get('start'),
        dueReminder: this.model.get('dueReminder'),
        idCard: this.model.id,
        idBoard: this.model.getBoard()?.id,
        idOrg: this.model.getBoard()?.get('idOrganization'),
        canEdit: this.model.editable(),
        inContainer: true,
      }),
      container,
    );
    this.$('.js-date-range-picker').addClass('button-link');
    this.$('.js-date-range-picker').removeClass('hide');
  }
  return this;
};

// Use this to pop open the date range picker from outside the context
// of clicking a button. E.g. keyboard shortcut.
export const showDateRangePicker = function () {
  const elem = this.$('.js-date-range-picker');
  if (elem) {
    PopOver.toggle({
      elem,
      getViewTitle: () => formatTemplate('dates'),
      keepEdits: true,
      reactElement: React.createElement(LazyDateRangePicker, {
        due: this.model.get('due'),
        start: this.model.get('start'),
        dueReminder: this.model.get('dueReminder'),
        hidePopover: () => PopOver.hide(),
        idCard: this.model.id,
        idBoard: this.model.getBoard()?.id,
        idOrg: this.model.getBoard()?.get('idOrganization'),
      }),
    });
  }
  return this;
};

export const focusChecklistAdd = function <T>(checklist: T) {
  return this.existingSubview(ChecklistView, checklist).focusNewTaskInput();
};
