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
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const _ = require('underscore');
const { Analytics } = require('@trello/atlassian-analytics');
const { Auth } = require('app/scripts/db/auth');
const { Controller } = require('app/scripts/controller');
const directoryLegacyPowerUps = require('./directory-legacy-power-ups');
const DirectoryBonusView = require('app/scripts/views/directory/directory-bonus-view');
const DirectoryEnabledView = require('app/scripts/views/directory/directory-enabled-view');
const DirectoryListingView = require('app/scripts/views/directory/directory-listing-view');
const DirectoryHeaderView = require('app/scripts/views/directory/directory-header-view');
const DirectoryHomeView = require('app/scripts/views/directory/directory-home-view');
const DirectorySearchView = require('app/scripts/views/directory/directory-search-view');
const DirectorySpinnerView = require('app/scripts/views/directory/directory-spinner-view');
const DirectoryPageView = require('app/scripts/views/directory/directory-page-view');
const DirectoryPluginEnableView = require('app/scripts/views/directory/directory-plugin-enable-view');
const DirectorySidebarView = require('app/scripts/views/directory/directory-sidebar-view');
const { firstPartyPluginsOrg } = require('@trello/config');
const { BUTLER_POWER_UP_ID } = require('app/scripts/data/butler-id');
const { mapPowerUpId: MAP_POWER_UP_ID, e2bId } = require('@trello/config');
const pluginsChangedSignal = require('app/scripts/views/internal/plugins/plugins-changed-signal');
const PluginIOCache = require('app/scripts/views/internal/plugins/plugin-io-cache');
const {
  Key,
  registerShortcut,
  Scope,
  unregisterShortcut,
} = require('@trello/keybindings');
const View = require('app/scripts/views/internal/view');
const {
  createSearchIndex,
} = require('app/src/components/PowerUpDirectory/SearchHelper');

const { categories } = require('app/scripts/data/directory');
const {
  workspaceNavigationState,
  workspaceNavigationHiddenState,
} = require('app/src/components/WorkspaceNavigation');

const getPageName = function (section, category, idPlugin, search) {
  let page = 'home page';

  if (search) {
    page = 'search';
  } else if (idPlugin) {
    page = 'list page';
  } else if (
    ['enabled', 'custom', 'made-by-trello', 'bonus'].includes(section)
  ) {
    page = section + ' page';
  } else if (section === 'category') {
    page = `category ${category} page`;
  }

  return `Power-Up directory ${page}`;
};

class DirectoryView extends View {
  static initClass() {
    this.prototype.className = 'directory-wrapper';

    this.prototype.events = {
      'click .js-directory-responsive-overlay': 'toggleNavigationMenu',
    };
  }

  constructor(options) {
    super(options);
    this.onShortcut = this.onShortcut.bind(this);
    registerShortcut(this.onShortcut, {
      scope: Scope.PowerUpsDirectory,
      key: Key.Escape,
    });
  }

  initialize({ boardView }) {
    this.boardView = boardView;
    super.initialize(...arguments);

    // State
    this.featuredPlugins = [];
    this.history = [];
    this.isLoading = true;
    this.plugins = [];
    this.search = null;

    // Layout Subviews
    this.headerView = this.subview(DirectoryHeaderView, this.model, {
      directoryView: this,
    });
    this.sidebarView = this.subview(DirectorySidebarView, this.model, {
      directoryView: this,
    });

    // Routes
    this.category = this.options.category;
    this.section = this.options.section;
    this.idPlugin = this.options.idPlugin;
    this.isEnabling = this.options.isEnabling;

    // Redirect invalid routes to home.
    if (
      this.section != null &&
      !_.contains(
        ['enabled', 'category', 'custom', 'made-by-trello', 'bonus'],
        this.section,
      )
    ) {
      this.navigate();
    }

    if (this.category != null && !_.contains(categories, this.category)) {
      this.navigate();
    }

    this.preparePlugins();

    this.makeDebouncedMethods('onOrganizationChange');

    this.listenTo(this.model.boardPluginList, {
      'add remove reset': this.onPluginChange,
    });
    this.listenTo(this.model, {
      'change:powerUps': this.onPluginChange,
      'change:idOrganization': this.onOrganizationChangeDebounced,
    });

    this.subscribe(pluginsChangedSignal(this.model), () =>
      this.onPluginChange(),
    );

    this.workspaceNavExpanded = workspaceNavigationState.value.expanded;
    this.workspaceNavEnabled = workspaceNavigationState.value.enabled;
    this.workspaceNavHidden = workspaceNavigationHiddenState.value.hidden;

    // listen for changes to workspae nav expanded/collapsed
    const toggleWorkspaceNavClasses = () => {
      const directoryWrapper = $('.directory-wrapper');
      this.workspaceNavExpanded = workspaceNavigationState.value.expanded;
      this.workspaceNavEnabled = workspaceNavigationState.value.enabled;
      this.workspaceNavHidden = workspaceNavigationHiddenState.value.hidden;

      if (
        !workspaceNavigationState.value.enabled ||
        workspaceNavigationHiddenState.value.hidden
      ) {
        directoryWrapper.removeClass(
          'directory-wrapper--workspace-nav-expanded',
        );
        directoryWrapper.removeClass(
          'directory-wrapper--workspace-nav-collapsed',
        );
      } else if (workspaceNavigationState.value.expanded) {
        directoryWrapper.addClass('directory-wrapper--workspace-nav-expanded');
        directoryWrapper.removeClass(
          'directory-wrapper--workspace-nav-collapsed',
        );
      } else {
        directoryWrapper.addClass('directory-wrapper--workspace-nav-collapsed');
        directoryWrapper.removeClass(
          'directory-wrapper--workspace-nav-expanded',
        );
      }
    };
    this.unsubscribeFromWorkspaceNavigationState = workspaceNavigationState.subscribe(
      toggleWorkspaceNavClasses,
    );
    this.unsubscribeFromWorkspaceNavigationHiddenState = workspaceNavigationHiddenState.subscribe(
      toggleWorkspaceNavClasses,
    );

    return (this.trackSearch = _.debounce(this.trackSearch, 5000, true));
  }

  remove() {
    unregisterShortcut(this.onShortcut);
    this.unsubscribeFromWorkspaceNavigationState();
    this.unsubscribeFromWorkspaceNavigationHiddenState();
    return super.remove(...arguments);
  }

  onShortcut() {
    if (!this.$('.js-directory-search').is(':focus')) {
      this.boardView.closeDirectory();
      Analytics.sendPressedShortcutEvent({
        shortcutName: 'escapeShortcut',
        keyValue: 'esc',
        source: 'boardDirectoryScreen',
        containers: {
          board: { id: this.model.id },
          organization: { id: this.model.get('idOrganization') },
        },
      });
    }
  }

  onOrganizationChange() {
    this.isLoading = true;
    this.sidebarView.render();
    this.renderSubview();

    return this.model.loadPlugins().then(() => this.preparePlugins());
  }

  onPluginChange(e) {
    return this.setBodyHeight();
  }

  toggleNavigationMenu() {
    const directorySidebar = $('.js-directory-sidebar');
    const responsiveOverlay = $('.js-directory-responsive-overlay');

    if (directorySidebar.hasClass('active')) {
      directorySidebar.removeClass('active');
      return responsiveOverlay.removeClass('active');
    } else {
      directorySidebar.addClass('active');
      return responsiveOverlay.addClass('active');
    }
  }

  // ------- Data Methods -------
  // Get Power-Ups and prepare search index.
  preparePlugins() {
    let pluginPromise;
    if (this.boardView.reloadDirectoryPlugins) {
      pluginPromise = this.model.loadPlugins();
      this.boardView.reloadDirectoryPlugins = false;
    } else {
      pluginPromise = this.model.getAvailablePlugins();
    }

    return pluginPromise.then((plugins) => {
      this.plugins = plugins;
      if (this.model.isTemplate()) {
        this.plugins = plugins.filter((plugin) => plugin.id !== e2bId);
      }

      // pass the plugin objects in as plain objects instead of ModelCache models
      this.index = createSearchIndex(
        this.plugins.map((plugin) => plugin.toJSON()),
      );

      this.isLoading = false;

      // Redirect to home if there are no custom plugins or plugin does not exist
      if (
        (this.section === 'custom' && !this.getCustomPlugins().length) ||
        (this.idPlugin && !this.getPlugin())
      ) {
        return this.navigate();
      }

      // Redirect to home if plugin exists, but is hidden
      if (this.idPlugin) {
        let needle;
        const plugin = this.getPlugin();
        if (
          ((needle = plugin.get('moderatedState')),
          ['hidden', 'moderated'].includes(needle))
        ) {
          return this.navigate();
        }

        if (plugin.get('idOrganizationOwner') === firstPartyPluginsOrg) {
          this.isEnabling = false;
          return this.navigate({
            section: this.section,
            idPlugin: this.idPlugin,
          });
        }
      }

      this.sidebarView.render();
      return this.renderSubview();
    });
  }

  // Return common attributes to send in tracking events
  getCommonTrackingAttributes() {
    return {
      boardPaidStatus: (() => {
        switch (false) {
          case !this.model.isEnterpriseBoard():
            return 'enterprise';
          case !this.model?.getOrganization()?.isBusinessClass():
            return 'bc';
          case !this.model?.getOrganization()?.isStandard():
            return 'standard';
          default:
            return 'free';
        }
      })(),
      maxUserPaidStatus: !Auth.isLoggedIn()
        ? 'notLoggedIn'
        : Auth?.me()?.getMaxPaidStatus(),
    };
  }

  // Get plugin by @idPlugin
  getPlugin() {
    return _.find(this.plugins, (p) => p.id === this.idPlugin);
  }

  // Get plugins for the current category
  getPluginsForCategory() {
    let needle;
    return _.chain(this.plugins)
      .filter(
        (plugin) => (
          (needle = this.category),
          Array.from(plugin.get('categories')).includes(needle)
        ),
      )
      .shuffle()
      .value();
  }

  // Get custom plugins for board
  getCustomPlugins() {
    return _.chain(this.plugins)
      .filter((plugin) => !plugin.get('public'))
      .sortBy((plugin) => PluginIOCache.get(plugin).getName().toLowerCase())
      .value();
  }

  // Search logic
  getPluginsForSearch() {
    // results come back as plain objects, not ModelCache models
    return this.index.search(this.search).map((result) => {
      return this.plugins.find((plugin) => plugin.id === result.id);
    });
  }

  // Get plugins with `made-by-trello` tag
  getTrelloPlugins() {
    let needle;
    return _.chain(this.plugins)
      .filter(
        (plugin) => (
          (needle = 'made-by-trello'),
          Array.from(plugin.get('tags')).includes(needle)
        ),
      )
      .sortBy((plugin) => PluginIOCache.get(plugin).getName().toLowerCase())
      .value();
  }

  // Get plugins with `promotional` tag
  getBonusPlugins() {
    let needle;
    return _.chain(this.plugins)
      .filter(
        (plugin) => (
          (needle = 'promotional'),
          Array.from(plugin.get('tags')).includes(needle)
        ),
      )
      .sortBy((plugin) => PluginIOCache.get(plugin).getName().toLowerCase())
      .value();
  }

  getEnabledPlugins() {
    const combinedPlugins = _.flatten([
      this.model.idPluginsEnabled(),
      this.model.get('powerUps'),
    ]);
    return _.chain(combinedPlugins)
      .filter((idOrName) => {
        return (
          (!this.model.isButlerCore() || idOrName !== BUTLER_POWER_UP_ID) &&
          (!this.model.isMapCore() || idOrName !== MAP_POWER_UP_ID)
        );
      })
      .map((idOrName) => {
        return _.find(this.plugins, (plugin) => {
          return (
            plugin.id === idOrName ||
            _.findWhere(directoryLegacyPowerUps, {
              id: plugin.id,
              name: idOrName,
            })
          );
        });
      })
      .compact()
      .sortBy((plugin) => PluginIOCache.get(plugin).getName().toLowerCase())
      .value();
  }

  // Filter out hidden and moderated plugins from existing list of plugins
  filterOutHiddenPlugins(plugins) {
    return _.filter(plugins, function (plugin) {
      let needle;
      return (
        (needle = plugin.get('moderatedState')),
        !['hidden', 'moderated'].includes(needle)
      );
    });
  }

  updateSearch(searchTerm) {
    if (searchTerm === this.search) {
      return;
    }
    this.search = searchTerm;
    if (
      !this.section &&
      !this.category &&
      !this.idPlugin &&
      !this.isEnabling &&
      searchTerm === null
    ) {
      this.history.splice(0, this.history.length);
    }
    return this.renderSubview();
  }

  trackSearch() {
    this.trackScreenEvent('boardDirectorySearchResultsScreen');
  }

  trackScreenEvent(name, attributes) {
    return Analytics.sendScreenEvent({
      name,
      attributes: _.extend(attributes, this.getCommonTrackingAttributes()),
      containers: {
        board: { id: this.model.id },
        organization: { id: this.model.get('idOrganization') },
      },
    });
  }

  // ------- Navigation Methods -------
  getCurrentPage() {
    return getPageName(this.section, this.category, this.idPlugin, this.search);
  }

  navigate(param) {
    // Push to history if we're not traversing back or already on the same page
    if (param == null) {
      param = {};
    }
    const {
      section,
      category,
      idPlugin,
      isNavigatingBack,
      isEnabling,
      search,
    } = param;
    if (
      !isNavigatingBack &&
      !_.isEqual(
        {
          section: this.section,
          category: this.category,
          idPlugin: this.idPlugin,
          isEnabling: this.isEnabling,
        },
        { section, category, idPlugin, isEnabling },
      )
    ) {
      if (
        this.search &&
        (this.section || this.category || this.idPlugin || this.isEnabling)
      ) {
        this.history.push({
          section: this.section,
          category: this.category,
          idPlugin: this.idPlugin,
          isEnabling: this.isEnabling,
          search: null,
        });
        this.history.push({
          section: undefined,
          category: undefined,
          idPlugin: undefined,
          isEnabling: undefined,
          search: this.search,
        });
      } else {
        this.history.push({
          section: this.section,
          category: this.category,
          idPlugin: this.idPlugin,
          isEnabling: this.isEnabling,
          search: this.search,
        });
      }
    }

    const baseSlug = idPlugin ? 'power-up' : 'power-ups';

    this.section = section;
    this.category = category;
    this.idPlugin = idPlugin;
    this.isEnabling = !!isEnabling;

    const path = [];
    if (this.section != null) {
      path.push(this.section);
    }
    if (this.category != null) {
      path.push(this.category);
    }

    if (this.idPlugin != null) {
      path.push(this.idPlugin);
      if (this.isEnabling) {
        path.push('enable');
      }
    }

    Controller.setBoardLocation(this.model.id, baseSlug, path, {
      replace: false,
    });

    if (!(this.search && idPlugin)) {
      this.sidebarView.clearSearch();
    }
    this.search = null;

    if (isNavigatingBack && search) {
      this.sidebarView.updateSearch(search);
      this.sidebarView.fillSearchField(search);
    }

    this.sidebarView.render();
    this.headerView.render();
    this.$directoryBody.scrollTop(0);
    return this.renderSubview();
  }

  navigateBack() {
    if (_.isEmpty(this.history)) {
      return this.navigate({ isNavigatingBack: true });
    }

    const { section, category, idPlugin, search } = this.history.pop();
    return this.navigate({
      section,
      category,
      idPlugin,
      isNavigatingBack: true,
      search,
    });
  }

  activeEventSource() {
    // as long as its loaded, use the more-specific event source
    if (this.activeSubview) {
      return this.activeSubview.eventSource();
    } else {
      return 'boardDirectoryScreen';
    }
  }

  // ------- Subviews and UI Methods -------
  // When the upsell banner pops up we need to reduce the space in the directory body.
  setBodyHeight(manuallyDismissed) {
    if (manuallyDismissed || this.model.canEnableAdditionalPowerUps()) {
      return this.$('.js-directory-body').removeClass('has-upsell');
    } else if (!Auth.me().isAdDismissed('DirectoryBusinessClassBanner')) {
      return this.$('.js-directory-body').addClass('has-upsell');
    }
  }

  homeSubview() {
    return this.subview(DirectoryHomeView, this.model, {
      currentPage: this.getCurrentPage(),
      directoryView: this,
    });
  }

  bonusSubview() {
    return this.subview(DirectoryBonusView, this.model, {
      plugins: this.plugins,
      currentPage: this.getCurrentPage(),
      directoryView: this,
    });
  }

  enabledSubview() {
    return this.subview(DirectoryEnabledView, this.model, {
      plugins: this.plugins,
      currentPage: this.getCurrentPage(),
      directoryView: this,
    });
  }

  pluginListingSubview() {
    return this.subview(DirectoryListingView, this.model, {
      plugin: this.getPlugin(),
      currentPage: this.getCurrentPage(),
      directoryView: this,
    });
  }

  pluginEnableView() {
    return this.subview(DirectoryPluginEnableView, this.model, {
      plugin: this.getPlugin(),
      currentPage: this.getCurrentPage(),
      directoryView: this,
    });
  }

  searchSubview() {
    this.trackSearch();
    return this.subview(DirectorySearchView, this.model, {
      plugins: this.filterOutHiddenPlugins(this.getPluginsForSearch()),
      searchTerm: this.search,
      currentPage: this.getCurrentPage(),
      directoryView: this,
    });
  }

  pageSubView(title, plugins) {
    return this.subview(DirectoryPageView, this.model, {
      title,
      plugins: this.filterOutHiddenPlugins(plugins),
      currentPage: this.getCurrentPage(),
      directoryView: this,
    });
  }

  renderSubview() {
    // Clear out current subview
    this.$contentContainer = this.$('#directory-content');
    this.$contentContainer.empty();
    if (this.activeSubview != null) {
      this.deleteSubview(this.activeSubview);
    }

    // Fancy CoffeeScript switch on nothing.
    // switch statements can also be used without a control expression,
    // turning them in to a cleaner alternative to if/else chains. :shrug:
    this.activeSubview = (() => {
      switch (false) {
        case !this.isLoading:
          return this.subview(DirectorySpinnerView, this.model, {
            section: this.section,
            idPlugin: this.idPlugin,
            isEnabling: this.isEnabling,
          });
        case !this.search:
          return this.searchSubview();
        case this.section !== 'category' || !this.category:
          return this.pageSubView(this.category, this.getPluginsForCategory());
        case this.section !== 'made-by-trello':
          return this.pageSubView(this.section, this.getTrelloPlugins());
        case this.section !== 'bonus':
          return this.bonusSubview();
        case this.section !== 'custom':
          return this.pageSubView(this.section, this.getCustomPlugins());
        case this.section !== 'enabled':
          return this.enabledSubview();
        case !this.idPlugin || !this.isEnabling:
          return this.pluginEnableView();
        case !this.idPlugin:
          return this.pluginListingSubview();
        default:
          return this.homeSubview();
      }
    })();

    return this.appendSubview(this.activeSubview, this.$contentContainer);
  }

  // This sets up the layout of the directory.
  renderOnce() {
    this.trackScreenEvent('boardDirectoryScreen', {
      totalEnabled: this.model.powerUpsCount(),
      allPowerUpsEnabled: this.model.idPluginsEnabled(),
    });
    this.appendSubview(this.headerView);

    this.$el.append('<div class="directory-body js-directory-body"></div>');
    this.$directoryBody = this.$('.js-directory-body');

    // If the upsell banner is present.
    this.setBodyHeight();

    this.$directoryBody.append(
      '<div class="directory-responsive-overlay js-directory-responsive-overlay"></div>',
    );

    this.appendSubview(this.sidebarView, this.$directoryBody);

    this.$directoryBody.append('<div id="directory-content"></div>');

    if (this.workspaceNavEnabled && !this.workspaceNavHidden) {
      if (this.workspaceNavExpanded) {
        this.$el.addClass('directory-wrapper--workspace-nav-expanded');
      } else {
        this.$el.addClass('directory-wrapper--workspace-nav-collapsed');
      }
    }

    this.renderSubview();

    return this;
  }
}

DirectoryView.initClass();
module.exports = DirectoryView;
