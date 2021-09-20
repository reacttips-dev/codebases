/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { importWithRetry } = require('@trello/use-lazy-component');

const React = require('react');

const { Auth } = require('app/scripts/db/auth');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const { ModelLoader } = require('app/scripts/db/model-loader');
const PluginHeaderButtonsView = require('app/scripts/views/plugin/plugin-header-buttons-view');
const { Controller } = require('app/scripts/controller');
const Dialog = require('app/scripts/views/lib/dialog');
const { Analytics } = require('@trello/atlassian-analytics');
const { seesVersionedVariation } = require('@trello/feature-flag-client');
const { PremiumFeature } = require('@trello/product-features');
const { WindowSize } = require('app/scripts/lib/window-size');
const DirectoryView = require('app/scripts/views/directory/directory-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const {
  sendPluginUIEvent,
  sendPluginScreenEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const { LegacyPowerUps } = require('app/scripts/data/legacy-power-ups');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const {
  renderPluginDropdownList,
} = require('app/src/components/PluginHeaderButton/renderPluginDropdownList');
const {
  CalendarBoardButton,
} = require('app/scripts/views/board/calendar-board-button');
const CardFilterView = require('app/scripts/views/board-menu/card-filter-view');
const { navigate } = require('app/scripts/controller/navigate');
const { isUrl } = require('app/gamma/src/util/url');
const { Urls } = require('app/scripts/controller/urls');
const { getBoardUrl } = Urls;

const PluginViewView = require('app/scripts/views/plugin/plugin-view-view');

const { BUTLER_POWER_UP_ID } = require('app/scripts/data/butler-id');
const CUSTOM_FIELDS_ID = require('@trello/config').customFieldsId;
const MAP_POWER_UP_ID = require('@trello/config').mapPowerUpId;
const CALENDAR_POWER_UP_ID = LegacyPowerUps.calendar;

module.exports.reloadCustomFields = function () {
  if (this.model.isPluginEnabled(CUSTOM_FIELDS_ID)) {
    // we need to give the server a second to prevent any race conditions
    // mainly if we were the ones to enable custom fields
    return setTimeout(() => {
      return ModelLoader.loadCustomFields(this.model.id);
    }, 1000);
  }
};

module.exports.renderPluginButtons = function () {
  if (this.pluginHeaderButtonsView != null) {
    this.pluginHeaderButtonsView.requestButtonsDebounced();
  } else {
    this.pluginHeaderButtonsView = this.subview(
      PluginHeaderButtonsView,
      this.model,
    );
  }
  this.appendSubview(
    this.pluginHeaderButtonsView,
    this.$('.js-plugin-header-btns'),
  );

  return this;
};

module.exports.renderBoardHeaderCalendar = function (options) {
  if (options == null) {
    options = {};
  }
  const container = this.$('.js-calendar-board-btn');
  if (!container.length) {
    return;
  }

  const isCalendarEnabled = this.model.isPowerUpEnabled('calendar');
  container.toggleClass('hide', !isCalendarEnabled);
  if (isCalendarEnabled) {
    return renderComponent(
      <CalendarBoardButton
        backgroundBrightness={this.model.get('prefs').backgroundBrightness}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => {
          sendPluginUIEvent({
            idPlugin: LegacyPowerUps.calendar,
            idBoard: this.model.id,
            event: {
              action: 'clicked',
              actionSubject: 'button',
              actionSubjectId: 'powerUpBoardButton',
              source: 'boardScreen',
            },
          });
          return this.toggleCalendar();
        }}
      />,
      container[0],
    );
  }
};

module.exports.renderPluginDropdownList = function () {
  return renderPluginDropdownList(
    this.$('.js-pup-dropdown-list-btn')[0],
    this.model,
    () => {
      const directoryUrl = getBoardUrl(this.model.id, 'power-ups/enabled');
      navigate(directoryUrl, { trigger: true });
      if (!WindowSize.fExtraLarge) {
        return this.sidebarView.hideSidebar();
      }
    },
    () => {
      return this.toggleDirectory();
    },
  );
};

module.exports.navigateToBoard = function () {
  const boardUrl = Controller.getBoardUrl(this.model.id);
  return navigate(boardUrl, { trigger: true });
};

module.exports.closeDetailView = function () {
  Dialog.hide(true);
  this.closeCalendar(false);
  this.closeDirectory(false);
  this.closeMap(false);
  this.closeButler(false);
  this.closeSingleBoardView();
  this.closePowerUpView(false);
};

module.exports.clickCloseDirectory = function () {
  if (this.directoryView) {
    Analytics.sendClickedButtonEvent({
      buttonName: 'boardDirectoryCloseButton',
      attributes: {
        boardId: this.model.id,
        organizationId: this.model.get('idOrganization'),
      },
      source: this.directoryView.activeEventSource(),
    });
  }

  return this.toggleDirectory();
};

module.exports.toggleDirectory = function () {
  if (this.directoryView) {
    if (this.directoryReturnCard) {
      this.closeDirectory(false);
      Controller.showCardDetail(this.directoryReturnCard);
      return (this.directoryReturnCard = null);
    } else {
      return this.navigateToBoard();
    }
  } else {
    return this.navigateToDirectory();
  }
};

module.exports.navigateToDirectory = function (returnCard) {
  const directoryUrl = Controller.getBoardUrl(this.model.id, 'power-ups');
  navigate(directoryUrl, { trigger: true });

  this.directoryReturnCard = returnCard;

  // Close the sidebar menu for window sizes that aren't extra large.
  if (!WindowSize.fExtraLarge) {
    return this.sidebarView.hideSidebar();
  }
};

module.exports.showDirectory = function (
  section,
  category,
  idPlugin,
  isEnabling,
) {
  this.$('#board').addClass('hide');

  this.directoryView = new DirectoryView({
    model: this.model,
    modelCache: this.modelCache,
    section,
    category,
    idPlugin,
    isEnabling,
    boardView: this,
  });
  return this.$('.board-canvas').append(this.directoryView.render().el);
};

module.exports.closeDirectory = function (navigateToBoard) {
  if (navigateToBoard == null) {
    navigateToBoard = true;
  }
  if (this.directoryView != null) {
    this.directoryView.remove();
    this.directoryView = null;
    if (navigateToBoard) {
      this.navigateToBoard();
    }
    this.$('#board').removeClass('hide');
    this.$('.js-list-name-input').trigger('autosize.resize', false);
  }
};

module.exports.toggleCalendar = function () {
  if (this.calendarView) {
    if (this.calendarReturnCard) {
      this.closeCalendar(false);
      Controller.showCardDetail(this.calendarReturnCard);
      return (this.calendarReturnCard = null);
    } else {
      return this.navigateToBoardEvent();
    }
  } else {
    return this.navigateToCalendarEvent();
  }
};

module.exports.dismissFeedback = function () {
  Auth.me().setPluginDataByKey(
    CALENDAR_POWER_UP_ID,
    'private',
    'dismissedFeedback',
    true,
  );
  this.$('.calendar-header-toolbar-feedback').addClass('hide');
};

module.exports.navigateToCalendarEvent = function () {
  sendPluginScreenEvent({
    idPlugin: LegacyPowerUps.calendar,
    idBoard: this.model.id,
    screenName: 'calendarViewScreen',
  });
  return this.navigateToCalendar();
};

module.exports.navigateToCalendar = function (returnCard) {
  this.calendarReturnCard = returnCard;
  const calendarBoardUrl = Controller.getBoardUrl(this.model.id, 'calendar');
  return navigate(calendarBoardUrl, { trigger: true });
};

module.exports.navigateToBoardEvent = function () {
  return this.navigateToBoard();
};

module.exports.isShowingCalendar = function () {
  return this.calendarView != null;
};

module.exports.showCalendar = function (date) {
  if (!this.model.isPowerUpEnabled('calendar') || this.isShowingCalendar()) {
    return;
  }

  this.$('.calendar-btn').addClass('board-header-btn-enabled');
  this.$('#board').addClass('hide');

  return importWithRetry(() =>
    import(
      /* webpackChunkName: "calendar-controller-view" */ 'app/scripts/views/calendar/calendar-controller-view'
    ),
  )
    .then((m) => m.default)
    .then((CalendarControllerView) => {
      this.calendarView = new CalendarControllerView({
        model: this.model,
        modelCache: this.modelCache,
      });
      this.$('.board-canvas').append(this.calendarView.render(date).el);
      this.calendarView.addedToDOM();

      return this.renderBoardViewsButtonDebounced();
    });
};

module.exports.closeCalendar = function (navigateToBoard) {
  if (navigateToBoard == null) {
    navigateToBoard = true;
  }
  if (this.calendarView != null) {
    this.calendarView.remove();
    this.calendarView = null;
    if (navigateToBoard) {
      this.navigateToBoard();
    }
    this.$('.calendar-btn').removeClass('board-header-btn-enabled');
    this.$('#board').removeClass('hide');
    this.renderBoardViewsButtonDebounced();

    // Hack to resolve a bug where the lists won't have been
    // sized properly if the calendar was visible on initial
    // render (and the board and it's lists were hidden)
    this.$('.js-list-name-input').trigger('autosize.resize', false);
  }
};

module.exports.toggleFilter = function (e) {
  Analytics.sendClickedButtonEvent({
    buttonName: 'viewsCardFilterButton',
    source: 'boardScreen',
    containers: {
      board: {
        id: this.model.id,
      },
      organization: {
        id: this.model.getOrganization()?.id,
      },
      enterprise: {
        id: this.model.getEnterprise()?.id,
      },
    },
  });

  return PopOver.isVisible ? this.closeFilter() : this.showFilter(e);
};

module.exports.showFilter = function (e) {
  const cardFilterView = new CardFilterView({
    model: this.model.filter,
    modelCache: this.modelCache,
  });

  PopOver.show({
    elem: this.$('.js-header-filter-btn'),
    view: cardFilterView,
    isFilterPopover: true,
    clearFilter: () => {
      cardFilterView.clearFilter();
    },
    alignRight: true,
  });

  return this.renderBoardViewsButtonDebounced();
};

module.exports.closeFilter = function () {
  PopOver.hide();

  this.renderBoardViewsButtonDebounced();
};

module.exports.toggleMap = function () {
  sendPluginUIEvent({
    idPlugin: MAP_POWER_UP_ID,
    idBoard: this.model.id,
    event: {
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'powerUpBoardButton',
      source: 'boardScreen',
    },
  });
  if (this.mapView) {
    if (this.mapReturnCard) {
      this.closeMap(false);
      Controller.showCardDetail(this.mapReturnCard);
      return (this.mapReturnCard = null);
    } else {
      return this.navigateToBoardEvent();
    }
  } else {
    return this.navigateToMapEvent();
  }
};

module.exports.navigateToMapEvent = function () {
  sendPluginScreenEvent({
    idPlugin: MAP_POWER_UP_ID,
    idBoard: this.model.id,
    screenName: 'boardMapPowerUpScreen',
  });
  return this.navigateToMap();
};

module.exports.navigateToMap = function (centerTo, returnCard) {
  this.mapCenterTo = centerTo;
  this.mapReturnCard = returnCard;
  const mapBoardUrl = Controller.getBoardUrl(this.model.id, 'map');
  return navigate(mapBoardUrl, { trigger: true });
};

module.exports.showMap = function ({ mapCenterTo, zoom }) {
  if (!this.model.isMapPowerUpEnabled() || this.mapView != null) {
    return;
  }

  this.$('.js-map-btn').addClass('board-header-btn-enabled');
  this.$('#board').addClass('hide');

  return importWithRetry(() =>
    import(/* webpackChunkName: "map-view" */ 'app/scripts/views/map/map-view'),
  )
    .then((m) => m.default)
    .then((MapView) => {
      this.mapView = new MapView({
        model: this.model,
        modelCache: this.modelCache,
        mapCenterTo: this.mapCenterTo || mapCenterTo,
        zoom,
      });
      this.$('.board-canvas').append(this.mapView.render().el);
      return this.renderBoardViewsButtonDebounced();
    });
};

module.exports.closeMap = function (navigateToBoard) {
  if (navigateToBoard == null) {
    navigateToBoard = true;
  }
  if (this.mapView != null) {
    this.mapView.remove();
    this.mapView = null;
    if (navigateToBoard) {
      this.navigateToBoard();
    }
    this.$('.js-map-btn').removeClass('board-header-btn-enabled');
    this.$('#board').removeClass('hide');
    this.$('.js-list-name-input').trigger('autosize.resize', false);
    this.renderBoardViewsButtonDebounced();
  }
};

module.exports.renderBoardHeaderMap = function () {
  // don't show the header button if map is a feature--it'll be in the switcher instead
  if (this.model.isMapCore()) {
    this.$('.js-map-btn').addClass('hide');

    return;
  }

  if (this.model.isMapPowerUpEnabled()) {
    this.$('.js-map-btn').removeClass('hide');
  } else {
    this.$('.js-map-btn').addClass('hide');
  }
  return this;
};

module.exports.showDashboard = async function () {
  this.$('#board').addClass('hide');

  const board = this.model;
  const isDashboardFeatureFlagEnabled = seesVersionedVariation(
    'wildcard.board-dashboard-view',
    'stable',
  );
  const hasViewsFeature = board.isFeatureEnabled(PremiumFeature.Views);

  const canShowDashboard = isDashboardFeatureFlagEnabled && hasViewsFeature;

  if (canShowDashboard) {
    const { BoardDashboardView } = await importWithRetry(() =>
      import(
        /* webpackChunkName: "board-dashboard-view" */ 'app/src/components/BoardDashboardView'
      ),
    );
    renderComponent(
      <BoardDashboardView
        idBoard={board.id}
        // eslint-disable-next-line react/jsx-no-bind
        navigateToBoardView={this.navigateToBoard.bind(this)}
      />,
      this.$('.js-board-view-container').get(0),
    );
  } else {
    this.navigateToBoard();
  }
};

module.exports.showPowerUpView = async function ({ idPlugin, viewKey }) {
  if (!this.model.isPluginEnabled(idPlugin)) {
    return;
  }

  const availableViews = await PluginRunner.one({
    plugin: idPlugin,
    command: 'board-views',
    board: this.model,
  });

  const selectedView = availableViews.find(
    (availableView) => availableView.key === viewKey,
  );

  if (!selectedView) {
    console.warn('Power-Up View not found.');
    this.navigateToBoard();
    return;
  }

  this.pluginView = new PluginViewView({
    model: this.model,
    content: selectedView,
  });

  this.$('#board').addClass('hide');
  this.$('.board-canvas').append(this.pluginView.render().el);
  this.renderBoardViewsButtonDebounced();
};

module.exports.closePowerUpView = function (navigateToBoard) {
  if (navigateToBoard == null) {
    navigateToBoard = true;
  }
  if (this.pluginView != null) {
    this.pluginView.remove();
    this.pluginView = null;
    if (navigateToBoard) {
      this.navigateToBoard();
    }
    this.$('#board').removeClass('hide');
    this.$('.js-list-name-input').trigger('autosize.resize', false);
  }
};

module.exports.navigateToButler = function () {
  const butlerBoardUrl = Controller.getBoardUrl(this.model.id, 'butler');
  return navigate(butlerBoardUrl, { trigger: true });
};

/**
 * Navigates the user to butler-client for a given board with optional parameters
 * @param {string} idBoard the id of the board
 * @param {Object} [obj] optional Butler parameters
 * @param {ButlerTab | undefined} [obj.tab] the Butler tab to open
 * @param {string | undefined} [obj.edit] the Butler command to open in edit mode
 * @param {string | undefined} [obj.log] the Butler command log to open
 * @param {string | undefined} [obj.newCommand] the string (lz-compressed or not) for a new Butler command
 * @param {string | undefined} [obj.newIcon] the icon for a new Butler command
 * @param {string | undefined} [obj.newLabel] the label for a new Butler command
 */
module.exports.navigateToButlerView = function ({
  tab,
  edit,
  log,
  newCommand,
  newIcon,
  newLabel,
} = {}) {
  const params = {};
  if (newCommand) {
    params['c'] = newCommand;
    edit = 'new';
    if (newIcon) {
      params['i'] = newIcon;
    }
    if (newLabel) {
      params['l'] = newLabel;
    }
  }
  const butlerUrl = getButlerUrl(this.model.id, { tab, edit, log });
  const paramsString = newCommand
    ? `?${new URLSearchParams(params).toString()}`
    : '';
  navigate(`${butlerUrl}${paramsString}`, { trigger: true });
};

const getButlerUrl = function (
  idBoard,
  { tab = null, edit = null, log = null } = {},
) {
  const extras = [];
  if (tab) {
    extras.push(tab);
  }
  if (edit && edit === 'new' && tab) {
    extras.push('new');
  } else if (edit) {
    extras.push('edit', edit);
  } else if (log) {
    extras.push('log', log);
  }
  const boardUrl = Controller.getBoardUrl(idBoard, 'butler', extras);
  return boardUrl;
};

function isButlerViewActive() {
  return !!this.butlerView;
}
module.exports.isButlerViewActive = isButlerViewActive;

/**
 * Toggles the display of butler-client. If currently displayed, this will
 * close it; otherwise this will open it to the default tab
 */
module.exports.toggleButlerView = function () {
  if (this.butlerView) {
    return this.closeButler();
  }
  const butlerUrl = getButlerUrl(this.model.id);
  return navigate(butlerUrl, { trigger: true });
};

/**
 * Creates and renders the butler view
 * this should only be called by showButlerView
 * @param {string} url iframe url for butler-client
 */
module.exports.setButlerView = function (url) {
  if (!isUrl(url)) {
    this.navigateToBoard();
    return;
  }
  this.$('#board').addClass('hide');
  return importWithRetry(() =>
    import(
      /* webpackChunkName: "butler-view" */ 'app/scripts/views/butler/butler-view'
    ),
  ).then(({ default: ButlerView }) => {
    if (this.butlerView) {
      this.butlerView.remove();
    }
    this.butlerView = new ButlerView({ butlerUrl: url });
    this.$('.board-canvas').append(this.butlerView.render().el);
  });
};

/**
 * Retrieves the iframe url for butler-client
 * this should only be called by showBoardDetailView.
 * To open butler-client from elsewhere, either navigateToButlerView or
 * toggleButlerView should be used
 * @param {Object} [obj] optional Butler parameters
 * @param {string} [obj.butlerTab] the Butler tab to open
 * @param {string} [obj.butlerCmdEdit] the Butler command to open in edit mode
 * @param {string} [obj.butlerCmdLog] the Butler command log to open
 * @param {string} [obj.newCommand] the string (lz-compressed or not) for a new Butler command
 * @param {string} [obj.newIcon] the icon for a new Butler command
 * @param {string} [obj.newLabel] the label for a new Butler command
 */
module.exports.showButlerView = function ({
  butlerTab,
  butlerCmdEdit,
  butlerCmdLog,
  newCommand,
  newIcon,
  newLabel,
} = {}) {
  if (this.butlerView != null) {
    return;
  }
  if (!this.model.editable()) {
    this.navigateToBoardEvent();
    return;
  }
  PluginRunner.one({
    plugin: BUTLER_POWER_UP_ID,
    command: 'show-settings',
    board: this.model,
    options: {
      butlerTab,
      butlerCmdEdit,
      butlerCmdLog,
      newCommand,
      newIcon,
      newLabel,
    },
  }).then((res) => {
    const showButler = this.model.canShowButlerUI();
    // In the case showButler is true lets open the Butler dashboard
    if (showButler) {
      return this.setButlerView(res);
    }
    // Otherwise let's close the Butler dashboard and redirect them to the
    // board. They will still receive an alert letting them know that the
    // Butler dashboard has been restricted to only enterprise admins by their
    // Enterprise.
    this.closeButler();
    this.navigateToBoard();
  });
};

module.exports.closeButler = function (navigateToBoard) {
  if (navigateToBoard == null) {
    navigateToBoard = true;
  }
  if (this.butlerView != null) {
    this.butlerView.remove();
    this.butlerView = null;
    if (navigateToBoard) {
      this.navigateToBoard();
    }
    this.$('#board').removeClass('hide');
    this.$('.js-list-name-input').trigger('autosize.resize', false);
  }
};
