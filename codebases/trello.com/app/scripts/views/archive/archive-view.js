// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const ArchivedCardsView = require('app/scripts/views/archive/archived-cards-view');
const ArchivedListsView = require('app/scripts/views/archive/archived-lists-view');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const { l } = require('app/scripts/lib/localize');
const React = require('react');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { BoardArchive } = require('app/scripts/views/templates/BoardArchive');

class ArchiveView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'archive';
    this.prototype.className = 'board-menu-content-frame';

    this.prototype.events = {
      'click .js-switch-section': 'didClickSwitchSections',
      'input .js-search': 'searchChanged',
    };
  }

  initialize() {
    this.searchText = this.slot('');

    this.cardsView = this.subview(ArchivedCardsView, this.model, {
      searchText: this.searchText,
    }).render();
    this.listsView = this.subview(ArchivedListsView, this.model, {
      searchText: this.searchText,
    }).render();

    return (this.activeSubview = this.slot(this.cardsView));
  }

  searchChanged() {
    return this.searchText.set(this.$searchInput.val().trim());
  }

  didClickSwitchSections(e) {
    const other = function (actual, opt1, opt2) {
      if (actual === opt1) {
        return opt2;
      } else {
        return opt1;
      }
    };

    this.activeSubview.set(
      other(this.activeSubview.get(), this.cardsView, this.listsView),
    );

    this.$searchInput.focus();
    // We have to stop this, or else the
    // button will steal keyboard focus
    return Util.stop(e);
  }

  injectSubview(subview) {
    this.$('.js-archive-content').append(subview.el);
    return subview.didBecomeActive();
  }

  remove() {
    this.unmountBoardArchive && this.unmountBoardArchive();
    return super.remove(...arguments);
  }

  renderOnce() {
    if (!this.unmountBoardArchive) {
      this.unmountBoardArchive = renderComponent(<BoardArchive />, this.$el[0]);
    }

    this.$searchInput = this.$('.js-search');

    this.subscribeChanges(this.activeSubview, {
      in: this.injectSubview,
      out(view) {
        return view.$el.detach();
      },
    });

    this.watch('activeSubview', (newSubview) => {
      const key =
        newSubview === this.cardsView
          ? 'switch to archived lists'
          : 'switch to archived cards';
      return this.$('.js-switch-section').text(l(key));
    });

    this.watch('activeSubview.isLoading', (isLoading) => {
      this.$('.js-loading-spinner').toggleClass('hide', !isLoading);
      return this.$('.js-archive-content').toggleClass('hide', isLoading);
    });

    return this;
  }
}

ArchiveView.initClass();
module.exports = ArchiveView;
