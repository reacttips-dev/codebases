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
let DirectorySidebarView;
const _ = require('underscore');
const BaseDirectoryView = require('./base-directory-view');
const { asNumber } = require('@trello/i18n/formatters');
const { getKey, Key } = require('@trello/keybindings');
const pluginsChangedSignal = require('app/scripts/views/internal/plugins/plugins-changed-signal');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')('directory');

const { PowerUpTestIds } = require('@trello/test-ids');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { categories } = require('app/scripts/data/directory');

class DirectorySidebarPlaceholder extends React.Component {
  static initClass() {
    this.prototype.displayName = 'Directory Sidebar Placeholder';

    this.prototype.render = t.renderable(() =>
      t.div(function () {
        t.div('.directory-search', () =>
          t.div('.directory-navigation-option.placeholder'),
        );
        return t.ul(function () {
          t.li(() => t.div('.directory-navigation-option.placeholder'));
          t.li(() => t.div('.directory-navigation-option.placeholder'));
          t.li(() => t.div('.directory-navigation-option.placeholder'));
          return t.li('.directory-categories', function () {
            t.div('.directory-categories-heading.placeholder', function () {});
            return t.ul('.directory-navigation-categories-list', () =>
              _.forEach(categories, (categoryKey) =>
                t.li(() => t.div('.directory-navigation-option.placeholder')),
              ),
            );
          });
        });
      }),
    );
  }
}
DirectorySidebarPlaceholder.initClass();

class DirectorySidebar extends React.Component {
  static initClass() {
    this.prototype.displayName = 'Directory Sidebar';

    this.prototype.render = t.renderable(function () {
      const setDirectorySearchInput = (el) => {
        return (this.directorySearchInput = el);
      };

      const {
        enabledCount,
        showCustomCategory,
        clearSearch,
        section,
        category,
        idPlugin,
        onCategoryClick,
        onHomeClick,
        onEnabledClick,
        onCustomClick,
        onSearchKeyUp,
        onMadeByTrelloClick,
        onBonusClick,
      } = this.props;
      return t.div(function () {
        t.div('.directory-search', function () {
          t.input('.js-directory-search', {
            type: 'text',
            placeholder: t.l('search'),
            onKeyUp: onSearchKeyUp,
            ref: setDirectorySearchInput,
          });
          return t.a(
            '.icon-sm.icon-close.dark-hover.hide.js-directory-search-clear',
            { href: '#', onClick: clearSearch },
          );
        });
        t.div('.directory-navigation-section', () =>
          t.ul(function () {
            t.li({ onClick: onHomeClick }, () =>
              t.a(
                '.directory-navigation-option',
                {
                  href: '#',
                  class: t.classify({
                    active: !section && !category && !idPlugin,
                  }),
                },
                () => {
                  t.span('.icon-md.icon-star');
                  t.formatText('featured');
                },
              ),
            );
            t.li({ onClick: onEnabledClick }, () =>
              t.a(
                '.directory-navigation-option.enable-option',
                {
                  href: '#',
                  class: t.classify({
                    active: section === 'enabled',
                  }),
                  'data-test-id': PowerUpTestIds.EnabledPowerUpsLink,
                },
                function () {
                  t.span('.icon-md.icon-power-up');
                  t.formatText('enabled');
                  return t.span('.directory-navigation-power-up-count', () =>
                    t.text(enabledCount),
                  );
                },
              ),
            );
            if (showCustomCategory) {
              t.li({ onClick: onCustomClick }, () =>
                t.a(
                  '.directory-navigation-option',
                  {
                    href: '#',
                    class: t.classify({ active: section === 'custom' }),
                  },
                  () => {
                    t.span('.icon-md.icon-gear');
                    return t.formatText('custom');
                  },
                ),
              );
            }
            t.li({ onClick: onMadeByTrelloClick }, () =>
              t.a(
                '.directory-navigation-option.trello-option',
                {
                  href: '#',
                  class: t.classify({
                    active: section === 'made-by-trello',
                  }),
                  'data-test-id': PowerUpTestIds.TrelloPowerUpsLink,
                },
                function () {
                  t.span('.icon-md.icon-board');
                  return t.formatText('made-by-trello');
                },
              ),
            );
            if (featureFlagClient.get('ecosystem.bonus-powerups', false)) {
              return t.li({ onClick: onBonusClick }, () =>
                t.a(
                  '.directory-navigation-option',
                  {
                    href: '#',
                    class: t.classify({
                      active: section === 'bonus',
                    }),
                    'data-test-id': PowerUpTestIds.TrelloPowerUpsLink,
                  },
                  function () {
                    t.span('.icon-md.icon-sparkle');
                    return t.div('.directory-navigation-bonus', () => {
                      t.p(() => {
                        t.formatText('bonus');
                      });
                      return t.p('.directory-navigation-bonus-sub', () => {
                        t.formatText('bonus-sub');
                      });
                    });
                  },
                ),
              );
            }
          }),
        );
        return t.div('.directory-navigation-section', () =>
          t.ul(() =>
            _.forEach(categories, (categoryKey) =>
              t.li(
                {
                  onClick() {
                    return onCategoryClick(categoryKey);
                  },
                },
                () =>
                  t.a(
                    '.directory-navigation-option.category-link',
                    {
                      class: t.classify({ active: category === categoryKey }),
                      href: '#',
                    },
                    () => t.format(categoryKey),
                  ),
              ),
            ),
          ),
        );
      });
    });
  }

  constructor(props) {
    super(props);

    this.directorySearchInput = null;
    this.focusDirectorySearchInput = this.focusDirectorySearchInput.bind(this);
  }

  componentDidMount() {
    return this.focusDirectorySearchInput();
  }

  focusDirectorySearchInput() {
    return this.directorySearchInput?.focus();
  }
}
DirectorySidebar.initClass();

module.exports = DirectorySidebarView = (function () {
  DirectorySidebarView = class DirectorySidebarView extends BaseDirectoryView {
    static initClass() {
      this.prototype.className = 'directory-sidebar js-directory-sidebar';
    }

    initialize({ directoryView }) {
      this.directoryView = directoryView;
      super.initialize(...arguments);

      this.onSearchKeyUp = _.debounce(this.onSearchKeyUp, 100);

      this.listenTo(this.model, { 'change:powerUps': this.render });
      this.listenTo(this.model.boardPluginList, {
        'add remove reset': this.render,
      });
      return this.subscribe(pluginsChangedSignal(this.model), () =>
        this.render(),
      );
    }

    updateSearch(search) {
      this.directoryView.updateSearch(search);

      const clearButton = this.$('.js-directory-search-clear');
      if (search?.length) {
        clearButton.removeClass('hide');
      } else {
        clearButton.addClass('hide');
      }

      return this.directoryView.headerView.render();
    }

    onSearchKeyUp(e) {
      let search = e.target.value;
      const key = getKey(e);

      if (key === Key.Escape) {
        search = null;
        this.emptySearchField();
      }

      // Close the responsive sidebar on Enter
      if (key === Key.Enter && this.$el.hasClass('active')) {
        this.directoryView.toggleNavigationMenu();
      }

      // Make sure the value has changed.
      if (search !== this.directoryView.search) {
        return this.updateSearch(search);
      }
    }

    fillSearchField(search) {
      return this.$('.js-directory-search').val(search);
    }

    emptySearchField() {
      return this.$('.js-directory-search').val('');
    }

    clearSearch() {
      this.emptySearchField();
      return this.updateSearch(null);
    }

    navigateTo(section, category) {
      this.directoryView.navigate({ section, category });

      if (this.$el.hasClass('active')) {
        return this.directoryView.toggleNavigationMenu();
      }
    }

    renderContent() {
      const {
        section,
        category,
        idPlugin,
        history,
        isLoading,
      } = this.directoryView;

      if (isLoading) {
        return <DirectorySidebarPlaceholder />;
      }

      let enabledCount = '';

      const totalEnabled =
        this.model.get('powerUps').length + this.model.powerUpsCount();

      if (totalEnabled > 0) {
        enabledCount = asNumber(totalEnabled);
      }

      return (
        <DirectorySidebar
          enabledCount={enabledCount}
          section={section}
          idPlugin={idPlugin}
          category={category || (idPlugin != null && _.last(history)?.category)}
          showCustomCategory={!_.isEmpty(this.directoryView.getCustomPlugins())}
          // eslint-disable-next-line react/jsx-no-bind
          clearSearch={() => this.clearSearch()}
          // eslint-disable-next-line react/jsx-no-bind
          onSearchKeyUp={(e) => {
            return this.onSearchKeyUp(e);
          }}
          // eslint-disable-next-line react/jsx-no-bind
          onCategoryClick={(categoryKey) =>
            this.navigateTo('category', categoryKey)
          }
          // eslint-disable-next-line react/jsx-no-bind
          onHomeClick={() => this.navigateTo()}
          // eslint-disable-next-line react/jsx-no-bind
          onEnabledClick={() => this.navigateTo('enabled')}
          // eslint-disable-next-line react/jsx-no-bind
          onCustomClick={() => this.navigateTo('custom')}
          // eslint-disable-next-line react/jsx-no-bind
          onMadeByTrelloClick={() => this.navigateTo('made-by-trello')}
          // eslint-disable-next-line react/jsx-no-bind
          onBonusClick={() => this.navigateTo('bonus')}
        />
      );
    }
  };
  DirectorySidebarView.initClass();
  return DirectorySidebarView;
})();
