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
const { getKey, Key } = require('@trello/keybindings');
const View = require('app/scripts/views/internal/view');
const SearchInputTemplate = require('app/scripts/views/templates/board_sidebar_search_input');

function __guardMethod__(obj, methodName, transform) {
  if (
    typeof obj !== 'undefined' &&
    obj !== null &&
    typeof obj[methodName] === 'function'
  ) {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}

class SearchInputView extends View {
  static initClass() {
    this.prototype.className = 'board-menu-content-frame';

    this.prototype.events = {
      'keyup .js-input': 'keyUpEvent',
      'keydown .js-input': 'keyDownEvent',
      'click .js-search-clear-title': 'clearAndFocusInput',
      'click .js-search-open-card-filter': 'showCardFilter',
    };
  }

  initialize() {
    return this.listenTo(this.model, 'change', this.renderInputIcon);
  }

  render() {
    this.$el.html(
      SearchInputTemplate.renderInputRow({
        title: this.model.get('title'),
        showFilterButton:
          (this.options != null ? this.options.showCardFilter : undefined) !=
          null,
      }),
    );

    this.renderInputIcon();

    return this;
  }

  renderInputIcon() {
    return this.$('.js-input-search-icon').html(
      SearchInputTemplate.renderInputIcon({
        title: this.model.get('title'),
      }),
    );
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

  keyDownEvent(e) {
    const key = getKey(e);
    if (key === Key.Enter) {
      return this.showCardFilter();
    }
  }

  clearAndFocusInput() {
    this.model.save({ title: '' });
    return this.$('.js-input').val('').focus();
  }

  showCardFilter() {
    return __guardMethod__(this.options, 'showCardFilter', (o) =>
      o.showCardFilter(),
    );
  }
}

SearchInputView.initClass();
module.exports = SearchInputView;
