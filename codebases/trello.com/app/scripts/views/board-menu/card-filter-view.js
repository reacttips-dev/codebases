/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { getKey, Key } = require('@trello/keybindings');
const { Analytics } = require('@trello/atlassian-analytics');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { l } = require('app/scripts/lib/localize');
const { navigate } = require('app/scripts/controller/navigate');
const { Controller } = require('app/scripts/controller');

const { featureFlagClient } = require('@trello/feature-flag-client');
const isInFilteringExperiment = featureFlagClient.getTrackedVariation(
  'board-header-filtering-experiment',
  false,
);

class CardFilterView extends View {
  static initClass() {
    this.prototype.viewTitleKey = isInFilteringExperiment
      ? 'filter cards'
      : 'search cards';
    this.prototype.viewIcon = 'search cards';

    this.prototype.className = 'board-menu-content-frame';

    this.prototype.events = {
      'click .js-toggle-label-filter': 'toggleLabelFilter',
      'click .js-select-member': 'toggleMemberFilter',
      'click .js-show-all-labels': 'showAllLabels',
      'click .js-show-all-members': 'showAllMembers',
      'click .js-clear-all': 'clearFilter',
      'click .js-due-filter': 'toggleDateFilter',
      'click .js-mode-filter': 'toggleModeFilter',

      'mouseenter .js-filter-search-results li': 'hoverSelect',
      'mouseenter .js-clear-all': 'clearAllSelected',
      'mouseenter .js-show-all-members': 'clearAllSelected',

      'keydown .js-input': 'keyDownEvent',
      'keyup .js-input': 'keyUpEvent',
    };
  }

  initialize() {
    this.listenTo(
      this.model.board,
      'change:labelNames change:memberships',
      this.renderFilterOptions,
    );
    return this.listenTo(this.model, 'change', this.renderFilterOptions);
  }

  render() {
    if (isInFilteringExperiment) {
      Analytics.sendScreenEvent({
        name: 'viewsCardFilterInlineDialog',
        containers: {
          board: {
            id: this.model.board.id,
          },
          organization: {
            id: this.model.board.getOrganization()?.id,
          },
          enterprise: {
            id: this.model.board.getEnterprise()?.id,
          },
        },
      });
    }

    this.isFiltering = false;

    const data = this.model.toJSON();

    this.$el.html(
      templates.fill(require('app/scripts/views/templates/filter_cards'), data),
    );

    this.renderFilterOptions();

    return this;
  }

  renderFilterOptions() {
    const data = this.model.toJSON({ board: true, expanded: true });

    const hasLabelsMatchingFilter = !_.isEmpty(data.labels);
    const hasMembersMatchingFilter = !_.isEmpty(data.members);
    const filtering =
      this.model.get('title') &&
      (hasLabelsMatchingFilter || hasMembersMatchingFilter);
    const board = this.model.getBoard();

    if (!filtering) {
      let left, left1;
      const limit = 6;
      if ((left = this.model.get('limitMembers')) != null ? left : true) {
        // Don't show a "more" menu if we're exactly one more than the limit,
        // in that case we may as well just show the item
        if (data.members.length === limit + 1) {
          data.limitMembers = false;
        } else {
          data.remainingMembers = Math.max(0, data.members.length - limit);
          data.members = _.first(data.members, limit).map(function (member) {
            member.isDeactivated = board.isDeactivated(member);
            return member;
          });
          data.limitMembers = data.remainingMembers > 0;
        }
      }

      if ((left1 = this.model.get('limitLabels')) != null ? left1 : true) {
        if (data.labels.length === limit + 1) {
          data.limitLabels = false;
        } else {
          data.remainingLabels = Math.max(0, data.labels.length - limit);
          data.labels = _.first(data.labels, limit);
          data.limitLabels = data.remainingLabels > 0;
        }
      }
    } else {
      data.limitMembers = false;
      data.limitLabels = false;
    }

    _.extend(data, {
      filtering,
      showHelper: !filtering,
      showLabels: !filtering || hasLabelsMatchingFilter,
      showMembers: !filtering || hasMembersMatchingFilter,
      showDueTimes: !filtering,
      showMatchMode: !filtering,
      isFiltering: this.model.isFiltering(),
      labels: data.labels.map(function (label) {
        const defaultColorName = label.color ? l(['labels', label.color]) : '';
        return _.extend({ defaultColorName }, label);
      }),
    });

    this.$('.js-filter-search-results').html(
      templates.fill(
        require('app/scripts/views/templates/filter_cards_search_results'),
        data,
        {},
        { member: templates.member, select_member: templates.select_member },
      ),
    );

    if (this.model.get('title') === null) {
      this.$('.js-input').val('');
    }

    if (isInFilteringExperiment) {
      if (data.isFiltering) {
        $('.board-header-filter-clear-btn').removeClass('hide');
      } else {
        $('.board-header-filter-clear-btn').addClass('hide');
      }
    }
    return this;
  }

  keyDownEvent(e) {
    const key = getKey(e);
    if (![Key.Enter, Key.ArrowUp, Key.ArrowDown].includes(key)) {
      return;
    }

    Util.stop(e);

    const matchesSelector = '.item, .label-list-item';

    const $items = this.$(matchesSelector);
    const $selected = $items.filter('.selected').first();

    if (key === Key.Enter) {
      $selected.find('a').click();
    } else if ([Key.ArrowUp, Key.ArrowDown].includes(key)) {
      if ($selected.length === 0) {
        $items.first().addClass('selected');
      } else {
        Util.navMenuList(this.$el, matchesSelector, key);
      }
    }
  }

  keyUpEvent(e) {
    // esc will remove the input value and subsequently the search
    // title from filter array if selected, so just return if esc
    // is hit (will close the popover like normal)
    const key = getKey(e);
    if ([Key.Escape, Key.Enter, Key.ArrowUp, Key.ArrowDown].includes(key)) {
      return;
    }

    return this.model.save({
      title: this.$('.js-input').val(),
      limitMembers: true,
      limitLabels: true,
    });
  }

  showAllMembers(e) {
    Util.stop(e);
    this.model.save('limitMembers', false);
  }

  showAllLabels(e) {
    Util.stop(e);
    this.model.save('limitLabels', false);
  }

  _clearAndFocusInput() {
    this.model.save({ title: '' });
    return this.$('.js-input').val('').focus();
  }

  toggleLabelFilter(e) {
    Util.stop(e);
    // Figure this out before doing @_clearAndFocusInput, which could cause
    // a re-render
    const idLabel = $(e.target).closest('a').attr('data-idlabel');
    // If the label they clicked matches the thing they were searching for
    // then clear the search
    if (isInFilteringExperiment) {
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'dropdownItem',
        actionSubjectId: 'viewsCardFilterDropdownItem',
        source: 'viewsCardFilterInlineDialog',
        containers: {
          board: {
            id: this.model.board.id,
          },
          organization: {
            id: this.model.board.getOrganization()?.id,
          },
          enterprise: {
            id: this.model.board.getEnterprise()?.id,
          },
        },
        attributes: {
          type: 'label',
          id: idLabel,
        },
      });
    } else {
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'dropdownItem',
        actionSubjectId: 'viewsCardFilterDropdownItem',
        source: 'boardMenuDrawerFilterScreen',
        containers: {
          board: {
            id: this.model.board.id,
          },
          organization: {
            id: this.model.board.getOrganization()?.id,
          },
          enterprise: {
            id: this.model.board.getEnterprise()?.id,
          },
        },
        attributes: {
          type: 'label',
          id: idLabel,
        },
      });
    }
    const data = this.model.toJSON({ expanded: true });
    if (!_.isEmpty(data.labels)) {
      this._clearAndFocusInput();
    }
    this.navigateToBoard();
    return this.model.toggleIdLabel(idLabel);
  }

  toggleMemberFilter(e) {
    Util.stop(e);
    // Figure this out before doing @_clearAndFocusInput, which could cause
    // a re-render
    const idMember = $(e.target).closest('a').attr('idMember');
    // If the member they clicked matches the thing they were searching for
    // then clear the search
    if (isInFilteringExperiment) {
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'dropdownItem',
        actionSubjectId: 'viewsCardFilterDropdownItem',
        source: 'viewsCardFilterInlineDialog',
        containers: {
          board: {
            id: this.model.board.id,
          },
          organization: {
            id: this.model.board.getOrganization()?.id,
          },
          enterprise: {
            id: this.model.board.getEnterprise()?.id,
          },
        },
        attributes: {
          type: 'member',
          id: idMember,
        },
      });
    } else {
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'dropdownItem',
        actionSubjectId: 'viewsCardFilterDropdownItem',
        source: 'boardMenuDrawerFilterScreen',
        containers: {
          board: {
            id: this.model.board.id,
          },
          organization: {
            id: this.model.board.getOrganization()?.id,
          },
          enterprise: {
            id: this.model.board.getEnterprise()?.id,
          },
        },
        attributes: {
          type: 'member',
          id: idMember,
        },
      });
    }

    const data = this.model.toJSON({ expanded: true });
    if (!_.isEmpty(data.members)) {
      this._clearAndFocusInput();
    }
    Util.stop(e); // Don't open the member detail if they click on the avatar
    this.navigateToBoard();
    return this.model.toggleMember(idMember);
  }

  toggleDateFilter(e) {
    Util.stop(e);
    if (isInFilteringExperiment) {
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'dropdownItem',
        actionSubjectId: 'viewsCardFilterDropdownItem',
        source: 'viewsCardFilterInlineDialog',
        containers: {
          board: {
            id: this.model.board.id,
          },
          organization: {
            id: this.model.board.getOrganization()?.id,
          },
          enterprise: {
            id: this.model.board.getEnterprise()?.id,
          },
        },
        attributes: {
          type: 'date',
        },
      });
    } else {
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'dropdownItem',
        actionSubjectId: 'viewsCardFilterDropdownItem',
        source: 'boardMenuDrawerFilterScreen',
        containers: {
          board: {
            id: this.model.board.id,
          },
          organization: {
            id: this.model.board.getOrganization()?.id,
          },
          enterprise: {
            id: this.model.board.getEnterprise()?.id,
          },
        },
        attributes: {
          type: 'date',
        },
      });
    }

    const newDateFilter = $(e.target).closest('a').attr('time');
    this.navigateToBoard();
    if (this.model.get('due') === newDateFilter) {
      return this.model.save('due', null);
    } else {
      return this.model.save('due', newDateFilter);
    }
  }

  toggleModeFilter(e) {
    Util.stop(e);
    const newMode = $(e.target).closest('a').attr('mode');
    if (this.model.get('mode') !== newMode) {
      this.navigateToBoard();
      return this.model.save('mode', newMode);
    }
  }

  clearFilter(e) {
    if (isInFilteringExperiment) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'viewsCardFilterClearFilterButton',
        source: 'viewsCardFilterInlineDialog',
        containers: {
          board: {
            id: this.model.board.id,
          },
          organization: {
            id: this.model.board.getOrganization()?.id,
          },
          enterprise: {
            id: this.model.board.getEnterprise()?.id,
          },
        },
      });
    } else {
      Analytics.sendClickedButtonEvent({
        buttonName: 'viewsCardFilterClearFilterButton',
        source: 'boardMenuDrawerFilterScreen',
        containers: {
          board: {
            id: this.model.board.id,
          },
          organization: {
            id: this.model.board.getOrganization()?.id,
          },
          enterprise: {
            id: this.model.board.getEnterprise()?.id,
          },
        },
      });
    }

    return this.model.clear();
  }

  clearAllSelected() {
    return this.$('li').removeClass('selected');
  }

  hoverSelect(e, list) {
    this.clearAllSelected();
    return Util.selectMenuItem(
      $(e.currentTarget).closest('ul'),
      'li',
      $(e.currentTarget),
    );
  }

  navigateToBoard() {
    if (Controller.showingDashboard()) {
      const boardUrl = Controller.getBoardUrl(this.model.board.id);
      navigate(boardUrl, { trigger: true });
    }
  }
}

CardFilterView.initClass();
module.exports = CardFilterView;
