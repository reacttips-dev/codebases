// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const ArchivedListView = require('app/scripts/views/archive/archived-list-view');
const { ModelLoader } = require('app/scripts/db/model-loader');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const { l } = require('app/scripts/lib/localize');
const React = require('react');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { ArchivedLists } = require('app/scripts/views/templates/ArchivedLists');

class ArchivedListsView extends View {
  static initClass() {
    // TODO: effing once
    this.prototype.hasBeenActiveBefore = false;

    this.prototype.vigor = this.VIGOR.SOME;
  }
  initialize({ searchText }) {
    this.searchText = searchText;
    this.isLoading = this.slot(true);
    this.allArchivedLists = this.slot([]);

    this.sortedFilteredLists = this.allArchivedLists
      .combine(this.searchText)
      .map(function (...args) {
        const [lists, searchText] = Array.from(args[0]);
        if (searchText === '') {
          return lists;
        } else {
          const isMatch = Util.buildFuzzyMatcher(searchText);
          return _.filter(lists, (list) => isMatch(list.get('name')));
        }
      })
      .map((lists) => _.sortBy(lists, (list) => list.get('name')));

    this.using(this.sortedFilteredLists);

    return this.listenTo(this.modelCache, 'change:List:closed', (list) => {
      if (list.get('closed')) {
        return this.allArchivedLists.set([
          list,
          ...Array.from(this.allArchivedLists.get()),
        ]);
      } else {
        return this.allArchivedLists.set(
          _.without(this.allArchivedLists.get(), list),
        );
      }
    });
  }

  remove() {
    this.unmountArchivedLists && this.unmountArchivedLists();
    return super.remove(...arguments);
  }

  didBecomeActive() {
    if (this.hasBeenActiveBefore) {
      return;
    }
    this.hasBeenActiveBefore = true;

    ModelLoader.loadArchivedLists(this.model.id).then((lists) => {
      const archivedLists = this.modelCache.find('List', (list) => {
        return list.get('idBoard') === this.model.id && list.get('closed');
      });
      this.allArchivedLists.set(archivedLists);
      return this.isLoading.set(false);
    });
  }

  renderOnce() {
    if (this.unmountArchivedLists) {
      this.unmountArchivedLists();
    }
    this.unmountArchivedLists = renderComponent(<ArchivedLists />, this.$el[0]);

    this.watch('searchText', function (searchText) {
      const key = searchText.length === 0 ? 'no archived lists' : 'no results';
      return this.$('.js-empty-message').text(l(key));
    });

    this.watch('sortedFilteredLists', function (lists) {
      return this.$('.js-empty-message').toggleClass('hide', lists.length > 0);
    });

    return this.watch(
      'sortedFilteredLists',
      this.frameDebounce(this.renderLists),
    );
  }

  renderLists() {
    this.$('.js-archive-items').children().detach();

    const itemSubviews = Array.from(this.sortedFilteredLists.get()).map(
      (list) =>
        this.subview(ArchivedListView, list, {
          reOpenText: l('unarchive list'),
          canDelete: false,
        }),
    );

    this.appendSubviews(itemSubviews, this.$('.js-archive-items'));
    return this;
  }
}

ArchivedListsView.initClass();
module.exports = ArchivedListsView;
