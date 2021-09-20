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
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { ActionHistory } = require('@trello/action-history');
const { Auth } = require('app/scripts/db/auth');
const { Card } = require('app/scripts/models/card');
const { getKey, Key } = require('@trello/keybindings');
const { Label } = require('app/scripts/models/label');
const LabelCreateView = require('app/scripts/views/label/label-create-view');
const LabelEditView = require('app/scripts/views/label/label-edit-view');
const LabelKeyHelper = require('app/scripts/views/label/label-key-helper');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { l } = require('app/scripts/lib/localize');
const { Analytics } = require('@trello/atlassian-analytics');

const MAX_SUGGESTIONS = 5;

let PAGE_SIZE = undefined;

class LabelsView extends View {
  static initClass() {
    PAGE_SIZE = 12;

    this.prototype.labelsToShow = PAGE_SIZE;

    this.prototype.events = {
      'click .js-select-label': 'clickLabel',
      'click .js-toggle-color-blind-mode': 'toggleColorBlindMode',
      'click .js-edit-label': 'clickEditLabel',
      'click .js-add-label': 'clickAddLabel',
      'click .js-show-more': 'showMore',
      'input .js-label-search': 'renderLabels',
      'keyup .js-label-search': 'keyUp',
      'mouseover .card-label': 'hoverLabel',
    };
  }

  initialize({
    selectLabel,
    board,
    modelCache,
    renderOn,
    popOverMethod,
    searchInit,
    onEditSubmit,
  }) {
    this.selectLabel = selectLabel;
    this.board = board;
    this.modelCache = modelCache;
    this.renderOn = renderOn;
    this.popOverMethod = popOverMethod;
    this.searchInit = searchInit;
    this.onEditSubmit = onEditSubmit;
    this.makeDebouncedMethods('render', 'renderLabels');

    this.listenTo(Auth.me(), { 'change:prefs': this.renderDebounced });
    this.listenTo(this.board.labelList, {
      'add remove reset change': this.renderLabelsDebounced,
    });

    for (const spec of Array.from(this.renderOn != null ? this.renderOn : [])) {
      this.listenTo(spec.source, spec.events, this.renderLabelsDebounced);
    }

    this._keepVisible = {};

    Analytics.sendScreenEvent({
      name: 'labelsInlineDialog',
      containers: this.board.getAnalyticsContainers(),
    });

    return super.initialize(...arguments);
  }

  render() {
    const labelColors = this.board.labelColors();
    const permsData = { editable: this.board.editable() };
    const data = {
      colors: labelColors,
      isColorBlindEnabled:
        Auth.isLoggedIn() && Auth.me().get('prefs').colorBlind,
      searchInit: this.searchInit != null ? this.searchInit : '',
    };
    this.searchInit = null;
    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/popover_change_labels'),
        data,
        permsData,
      ),
    );
    return this.renderLabels();
  }

  renderLabels() {
    const filteredLabels = this._filteredLabels();
    const allLabels = _.map(filteredLabels, (label) => {
      return this.model.dataForLabel(label);
    });

    // Ideally we'll show @labelsToShow labels, but we want
    // to make sure all of the enabled labels are visible,
    // and labels that were initially visible stay visible
    const shouldShow = (label) => {
      return label.isActive || this._keepVisible[label.id];
    };

    const labels = (() => {
      if (allLabels.length > this.labelsToShow) {
        const enabledLabels = allLabels.filter(shouldShow);
        // How many non-enabled labels do we have space for?
        let remaining = this.labelsToShow - enabledLabels.length;
        return _.chain(allLabels)
          .filter((label) => {
            return shouldShow(label) || remaining-- > 0;
          })
          .first(this.labelsToShow)
          .value();
      } else {
        return allLabels;
      }
    })();

    this.$('.js-show-more').toggleClass(
      'hide',
      labels.length === allLabels.length,
    );

    const data = { labels };
    const permsData = { editable: this.board.editable() };

    this.$('.js-labels-list')
      .empty()
      .append(
        templates.fill(
          require('app/scripts/views/templates/select_labels'),
          data,
          permsData,
        ),
      );

    const search = this._searchVal();
    const text =
      _.isEmpty(search) || filteredLabels.length > 0
        ? l('create new label.unnamed')
        : l('create new label.named', { name: search }, { raw: true });
    this.$('.js-add-label').text(text);

    if (!_.isEmpty(search) && filteredLabels.length > 0) {
      this.selectFirstLabelInList();
    }

    const showSuggestions =
      !this._searchVal() &&
      // This is also used on CardComposer
      this.model instanceof Card &&
      labels.length < allLabels.length;

    const suggestedLabels = showSuggestions ? this.getSuggestedLabels() : [];

    this.$('.js-suggestions').toggleClass('hide', suggestedLabels.length === 0);

    this.$('.js-suggested-labels-list')
      .empty()
      .append(
        templates.fill(
          require('app/scripts/views/templates/select_labels'),
          { labels: suggestedLabels },
          permsData,
        ),
      );

    return this;
  }

  getSuggestedLabels() {
    const history = ActionHistory.get();

    const board = this.model.getBoard();
    const idList = this.model.get('idList');

    const suggested = new Set();

    return history
      .filter(
        ({ action, context }) =>
          action.type === 'add-label' && context.idList === idList,
      )
      .filter(function ({ action }) {
        if (suggested.has(action.idLabel)) {
          return false;
        } else {
          suggested.add(action.idLabel);
          return true;
        }
      })
      .filter(({ action }) => this.model.isValidSuggestion(action))
      .map(({ action }) => {
        const label = board.labelList.get(action.idLabel);
        return this.model.dataForLabel(label);
      })
      .slice(0, MAX_SUGGESTIONS);
  }

  highlightElement($elem) {
    return Util.selectMenuItem(
      this.$('.js-labels-list,.js-suggested-labels-list'),
      '.card-label',
      $elem,
    );
  }

  getHighlightedElement() {
    return this.$('.js-labels-list,.js-suggested-labels-list')
      .find('.card-label.selected')
      .first();
  }

  selectFirstLabelInList(e) {
    this.highlightElement(
      this.$('.js-labels-list,.js-suggested-labels-list')
        .find('.card-label')
        .first(),
    );
  }

  toggleColorBlindMode(e) {
    const me = Auth.me();
    me.toggleColorBlindMode();

    Analytics.sendTrackEvent({
      action: 'toggled',
      actionSubject: 'colorBlindFriendlyMode',
      source: 'cardLabelsScreen',
      containers: {
        card: {
          id: this.model.id,
        },
      },
      attributes: {
        value: me.get('prefs').colorBlind,
      },
    });
  }

  clickEditLabel(e) {
    Util.stop(e);
    const $label = $(e.target).closest('.js-edit-label');
    const idLabel = $label.attr('data-idLabel');
    return this.editLabel(idLabel);
  }

  selectLabelViaElem($elem) {
    const idLabel = $elem.attr('data-idLabel');
    const fromSuggestion = $elem.closest('.js-suggestions').length > 0;

    // If we've interacted with this label, we want to keep it around
    // even if we're hiding some of the other labels
    this._keepVisible[idLabel] = true;
    return this.selectLabel(idLabel, fromSuggestion);
  }

  clickLabel(e) {
    Util.stop(e);
    const $label = $(e.target).closest('.js-select-label');
    return this.selectLabelViaElem($label);
  }

  findElementForLabel(idLabel) {
    return this.$('.js-edit-label').filter((i, el) => {
      return $(el).attr('data-idLabel') === idLabel;
    });
  }

  editLabel(idLabel) {
    const $target = this.findElementForLabel(idLabel);
    const label = this.modelCache.get('Label', idLabel);

    return PopOver[this.popOverMethod]({
      elem: $target,
      view: LabelEditView,
      options: {
        model: label,
        board: this.board,
        modelCache: this.modelCache,
        onSubmit: this.onEditSubmit,
      },
    });
  }

  clickAddLabel(e) {
    Util.stop(e);
    const search = this._searchVal();
    PopOver[this.popOverMethod]({
      elem: this.$('.js-add-label'),
      view: LabelCreateView,
      options: {
        board: this.board,
        name: search,
        color: this._nextColor(),
        onSubmit: (name, color, traceId, onFail, onAbort, onSuccess) => {
          this.model.createLabel(
            name,
            color,
            traceId,
            onFail,
            onAbort,
            onSuccess,
          );

          return this.clearSearch();
        },
      },
    });
  }

  showMore() {
    this.labelsToShow += PAGE_SIZE;
    return this.renderLabels();
  }

  hoverLabel(e) {
    this.highlightElement($(e.target).closest('.card-label'));
  }

  keyUp(e) {
    const key = getKey(e);

    if ([Key.ArrowUp, Key.ArrowDown].includes(key)) {
      Util.stop(e);
      Util.navMenuList(
        this.$('.js-labels-list,.js-suggested-labels-list'),
        '.card-label',
        key,
      );
      return;
    }

    if (key !== Key.Enter) {
      return;
    }

    const labels = this._filteredLabels();

    if (labels.length > 0) {
      const $highlightedElement = this.getHighlightedElement();
      if ($highlightedElement.length > 0) {
        this.selectLabelViaElem($highlightedElement);
        this.clearSearch();
      }

      if (this.sendGASEevent) {
        return Analytics.sendTrackEvent({
          action: 'added',
          actionSubject: 'label',
          source: 'cardLabelFilter',
          containers: {
            card: {
              id: this.model.id,
            },
          },
        });
      }
    } else {
      return this.clickAddLabel();
    }
  }

  clearSearch() {
    this.$('.js-label-search').val('');
    return this.renderLabels();
  }

  _nextColor() {
    let left;
    const used = _.chain(this.board.getLabels())
      .map((label) => label.get('color'))
      .uniq()
      .value();
    return (left = _.difference(Label.colors, used)[0]) != null ? left : '';
  }

  _searchVal() {
    const searchVal = this.$('.js-label-search').val();
    return searchVal ? searchVal.trim() : '';
  }

  _filteredLabels() {
    const search = this._searchVal().toLowerCase();

    const stringResults = _.chain(this.board.getLabels())
      .filter((label) => {
        if (_.isEmpty(search)) return true;

        return (
          (label.has('name') &&
            label.get('name').toLowerCase().indexOf(search) > -1) ||
          (label.has('color') &&
            label.get('color').toLowerCase().indexOf(search) === 0)
        );
      })
      .value();

    // Return numeric labels by their numeric only *after* string matches.
    const indexResults = this.board
      .getLabels()
      .filter(
        (label) =>
          label.has('color') &&
          label.get('color') ===
            LabelKeyHelper.keyboardIndex[parseInt(search, 10)] &&
          stringResults.filter(
            (stringResult) => Label.compare(label, stringResult) === 0,
          ).length === 0,
      );

    return stringResults.concat(indexResults);
  }
}

LabelsView.initClass();
module.exports = LabelsView;
