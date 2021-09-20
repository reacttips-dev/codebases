/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let PluginPopOverListView;
const $ = require('jquery');
const _ = require('underscore');
const { debounceSignal } = require('app/scripts/lib/util/debounce-signal');
const { getKey, Key } = require('@trello/keybindings');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const PluginView = require('app/scripts/views/plugin/plugin-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const Promise = require('bluebird');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'plugin_popover',
);
const { Util } = require('app/scripts/lib/util');
const xtend = require('xtend');

const outerTemplate = t.renderable(function (content) {
  if (content == null) {
    content = {};
  }
  const { showSearch, search } = content;

  if (search && showSearch) {
    t.input('.js-search.js-autofocus', {
      type: 'text',
      placeholder: search.placeholder,
    });
  }

  t.div('.js-results');
});

const resultsTemplate = t.renderable(function ({
  search,
  noSearchResults,
  items,
  selectedIndex,
}) {
  if (noSearchResults) {
    t.p('.empty.plugin-pop-over-search-empty', function () {
      if (search.empty) {
        t.text(search.empty);
      } else {
        t.format('no results');
      }
    });
  }

  t.ul('.pop-over-list.js-list.navigable', function () {
    for (const { text, index, callback, url } of Array.from(items)) {
      const selected = index === selectedIndex;
      t.li({ class: t.classify({ selected }) }, function () {
        const linkOpts = (() => {
          if (callback != null) {
            return { 'data-index': index };
          } else if (url != null && pluginValidators.isValidUrlForIframe(url)) {
            return {
              href: url,
              rel: 'noreferrer nofollow noopener',
              target: url,
            };
          }
        })();

        t.a(linkOpts, function () {
          t.text(text);
        });
      });
    }
  });
});

const searchingTemplate = t.renderable(function (param) {
  if (param == null) {
    param = {};
  }
  const { search } = param;
  return t.p('.quiet.plugin-pop-over-search-searching', function () {
    if (search?.searching) {
      t.text(search.searching);
    } else {
      t.format('searching');
    }
  });
});

module.exports = PluginPopOverListView = (function () {
  PluginPopOverListView = class PluginPopOverListView extends PluginView {
    static initClass() {
      this.prototype.keepInDOM = true;
    }
    initialize({ title, content }) {
      this.title = title;
      this.content = content;
      this.retain(this.content);

      return (this.searchText = this.slot(''));
    }

    getViewTitle() {
      return this.title;
    }

    events() {
      return {
        'click a[data-index]'(e) {
          let item;
          const index = parseInt($(e.currentTarget).attr('data-index'), 10);
          if (_.isFunction(this.content.items)) {
            item = this.content.searchResults[index];
          } else {
            item = this.content.items[index];
          }
          return item
            .callback({
              el: e.currentTarget,
            })
            .done();
        },

        'click a[href]'(e) {
          return PopOver.hide();
        },

        'input .js-search'(e) {
          return this.searchText.set($(e.currentTarget).val());
        },

        'mouseenter li'(e) {
          return Util.selectMenuItem(
            this.$('.js-list'),
            'li',
            $(e.currentTarget),
          );
        },

        keydown(e) {
          const key = getKey(e);
          const $list = this.$('.js-list');

          if ([Key.ArrowUp, Key.ArrowDown].includes(key)) {
            Util.stop(e);
            Util.navMenuList($list, 'li', key);
          } else if ([Key.Enter, Key.Tab].includes(key)) {
            Util.stop(e);
            $list.find('li.selected a').click();
          }
        },
      };
    }

    renderOnce() {
      const isDynamicSearch = _.isFunction(this.content.items);

      this.$el.html(
        outerTemplate({
          search: this.content.search,
          showSearch:
            this.content.search &&
            (isDynamicSearch ||
              this.content.items.length > this.content.search.count),
        }),
      );

      const $results = this.$el.find('.js-results');
      const getItems = (searchText) => {
        return Promise.try(() => {
          if (isDynamicSearch) {
            return this.content.items({
              options: {
                search: searchText,
              },
            });
          } else {
            let { items } = this.content;
            items = items.map((item, index) => xtend(item, { index }));

            if (this.content.search) {
              let limit;
              if (searchText) {
                const satisfiesFilter = Util.buildFuzzyMatcher(searchText);
                items = items.filter(
                  ({ text, alwaysVisible }) =>
                    alwaysVisible || satisfiesFilter(text),
                );
              }

              if ((limit = this.content.search?.count) != null) {
                let filterCount = 0;
                items = _.filter(items, function (item, index) {
                  if (item.alwaysVisible) {
                    return true;
                  } else if (filterCount < limit) {
                    filterCount++;
                    return true;
                  } else {
                    return false;
                  }
                });
              }
            }

            return items;
          }
        }).then((items) => {
          if (isDynamicSearch) {
            this.content.searchResults = items.map((item, index) =>
              xtend(item, { index }),
            );
            this.retain(this.content.searchResults);
            return this.content.searchResults;
          } else {
            return items;
          }
        });
      };

      if (this.content.search) {
        let debounceDelay = 300;
        if (
          _.isFinite(this.content.search.debounce) &&
          this.content.search.debounce > debounceDelay
        ) {
          // only allow the debounce to be increased, not decreased
          debounceDelay = this.content.search.debounce;
        }
        const debouncedSearch = debounceSignal(this.searchText, debounceDelay);
        this.subscribe(debouncedSearch, (searchText) => {
          $results.html(searchingTemplate({ search: this.content.search }));

          if (this._outstandingSearch != null) {
            // we have an outstanding search request that we should cancel
            this._outstandingSearch.cancel();
          }

          this._outstandingSearch = getItems(searchText).cancellable();

          return this._outstandingSearch
            .then((items) => {
              this._outstandingSearch = null;
              const noSearchResults = !_.any(
                items,
                ({ alwaysVisible }) => !alwaysVisible,
              );
              const selectedIndex = items[0]?.index ?? -1;
              return $results.html(
                resultsTemplate({
                  search: this.content.search,
                  noSearchResults,
                  items,
                  selectedIndex,
                }),
              );
            })
            .catch(Promise.CancellationError, () => {
              // Expected if another search is started before this one finishes
            });
        });
      } else {
        $results.html(searchingTemplate());

        getItems().then((allItems) =>
          $results.html(resultsTemplate({ items: allItems, selectedIndex: 0 })),
        );
      }

      return this;
    }
  };
  PluginPopOverListView.initClass();
  return PluginPopOverListView;
})();
