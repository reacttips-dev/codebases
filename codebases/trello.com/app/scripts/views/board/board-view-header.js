const _ = require('underscore');

const { Analytics } = require('@trello/atlassian-analytics');
const { Util } = require('app/scripts/lib/util');

const BoardCleanUpView = require('app/scripts/views/board/board-clean-up-view');
const { Auth } = require('app/scripts/db/auth');
const { l } = require('app/scripts/lib/localize');
const headerTemplate = require('app/scripts/views/templates/board_header');
const {
  InspiringBoardsWorkspaceIds,
} = require('app/scripts/data/inspiring-boards-workspace-ids');
const {
  featureFlagClient,
  seesVersionedVariation,
} = require('@trello/feature-flag-client');
const { logoDomain } = require('@trello/config');
const isDesktop = require('@trello/browser').isDesktop();
const Dialog = require('app/scripts/views/lib/dialog');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { BoardViewsButton } = require('app/src/components/BoardViewsButton');
const {
  ErrorBoundary,
} = require('app/src/components/ErrorBoundary/ErrorBoundary');
const { Feature } = require('app/scripts/debug/constants');
const {
  TimelineViewWrapper,
} = require('app/src/components/TimelineViewWrapper');
const {
  SingleBoardCalendarView,
} = require('app/src/components/BoardCalendarView');
const { Controller } = require('app/scripts/controller');
const { AutomaticReports } = require('app/src/components/Butler');
const { LegacyPowerUps } = require('app/scripts/data/legacy-power-ups');
const { navigate } = require('app/scripts/controller/navigate');
const {
  sendPluginTrackEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const { WindowSize } = require('app/scripts/lib/window-size');
const {
  ButlerBoardButtons,
} = require('app/src/components/Butler/Buttons/ButlerBoardButtons');
const { PremiumFeature } = require('@trello/product-features');
const { BoardHeaderTestIds } = require('@trello/test-ids');
const { canViewTeamTablePage } = require('app/src/components/ViewsGenerics');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');

// icons for board views switcher
const { CalendarIcon } = require('@trello/nachos/icons/calendar');
const { TimelineIcon } = require('@trello/nachos/icons/timeline');
const { LocationIcon } = require('@trello/nachos/icons/location');
const { ListIcon } = require('@trello/nachos/icons/list');
const { DashboardIcon } = require('@trello/nachos/icons/dashboard');
const { TableIcon } = require('@trello/nachos/icons/table');
const { sendErrorEvent } = require('@trello/error-reporting');

const { Null } = require('app/src/components/Null');

const MAP_POWER_UP_ID = require('@trello/config').mapPowerUpId;
const {
  BoardHeaderFilterButton,
} = require('app/src/components/BoardHeaderFilter');
const {
  SingleBoardTableView,
} = require('app/src/components/BoardTableView/SingleBoardTableView');

const CALENDAR_POWER_UP_ID = LegacyPowerUps.calendar;
module.exports.renderBoardHeader = function () {
  const isPremOrgAdmin = this.model.isPremOrgAdmin(Auth.me());

  const data = {
    name: this.model.get('name'),
    canRename: isPremOrgAdmin || this.model.owned(),
    isLoggedIn: Auth.isLoggedIn(),
    isAdmin: this.model.ownedByMember(Auth.me()),
    isMember: this.model.isMember(Auth.me()),
    isPrivateTeam:
      this.model.hasOrganization() && !this.model.getOrganization(),
    isPrivateTeamForEnterpriseVisibleBoard:
      this.model.hasOrganization() &&
      this.model.getPref('permissionLevel') === 'enterprise',
    isUntitled: this.model.get('name') === l(['untitled board']),
    canJoin: this.model.canJoin(),
    canInviteMembers: this.model.canInviteMembers(),
    selfJoin: this.model.allowsSelfJoin(),
    canAssign: this.model.editable(),
    boardCardCount: this.model
      .openCards()
      ?.filter((card) => this.model.filter.satisfiesFilter(card)).length,
    isTemplate: this.model.isTemplate(),
  };

  if (this.calendarView) {
    data.currentBoardView = 'calendar';
  } else if (this.mapView) {
    data.currentBoardView = 'map';
  } else {
    data.currentBoardView = 'list';
  }

  data.starTooltipKey = this.model.isTemplate()
    ? 'click-to-star-or-unstar-this-template-starred-templates-show-up-at-the-top-of-your-boards-list'
    : 'click-to-star-or-unstar-this-board-starred-boards-show-up-at-the-top-of-your-boards-list';

  const organization = this.model.getOrganization();
  if (organization) {
    data.orgDisplayName = organization.get('displayName');
    data.orgName = organization.get('name');
    data.showCopyButton = _.contains(
      InspiringBoardsWorkspaceIds,
      organization.id,
    );
    const _hash = organization.get('logoHash');
    const enterprise_hash = organization.getEnterprise()?.get('logoHash');
    if (enterprise_hash) {
      data.orgLogoUrl = `${logoDomain}/${enterprise_hash}/30.png`;
      data.orgLogoUrl2x = `${logoDomain}/${enterprise_hash}/170.png`;
    } else if (_hash) {
      data.orgLogoUrl = `${logoDomain}/${_hash}/30.png`;
      data.orgLogoUrl2x = `${logoDomain}/${_hash}/170.png`;
    }

    data.isStandard = organization.isStandard();
    data.hasBusinessClass = organization.isPremium();
    data.isBusinessClass = organization.isBusinessClass();
    data.isRetiredBusinessClass = organization.isRetiredBusinessClass();
    data.isEnterprise = organization.get('idEnterprise');
  }

  // Work-around to avoid data loss from re-populating header and
  // over-writing filtering react component
  const filterReactRoot = this.el.querySelector(
    '.js-board-header-filter-btn-container',
  );

  this.$('.js-board-header').html(headerTemplate(data));

  const newFilterReactRoot = this.el.querySelector(
    '.js-board-header-filter-btn-container',
  );

  if (filterReactRoot) {
    newFilterReactRoot.parentNode.replaceChild(
      filterReactRoot,
      newFilterReactRoot,
    );
  }

  const isBoardHeaderFilterEnabled = featureFlagClient.get(
    'ecosystem.board-header-filter',
    false,
  );

  if (isBoardHeaderFilterEnabled) {
    this.renderBoardHeaderFilterButton(data.boardCardCount);
  }

  this.renderWorkspacesPreambleInviteButton();
  if (organization) {
    this.unmountWorkspacesPreambleBoardHeaderButton();
  } else {
    this.renderWorkspacesPreambleBoardHeaderButton();
  }

  this.renderPermissionLevel();
  this.renderBoardHeaderCalendar();
  this.renderBoardHeaderSubscribed();
  this.renderBoardHeaderMap();
  this.renderFilteringStatus();
  this.renderBoardHeaderStarred();
  this.renderPluginButtons();
  this.renderButlerBoardButtons();
  this.renderBoardHeaderFacepile();
  this.renderBoardTemplateBadge();
  this.renderWorkspacesAutoNameAlert();

  if (featureFlagClient.get('ecosystem.pup-header-cleanup', false)) {
    this.renderPluginDropdownList();
  }

  this.renderBoardViewsButton();
  this.loadPowerUpViewsButtonOptions();

  return this;
};

module.exports.renderBoardHeaderStarred = function () {
  this.$('.js-star-board').toggleClass(
    'board-header-btn-enabled',
    this.model.isStarred(),
  );
  return this;
};

module.exports.toggleStarred = function () {
  const { boardStarList } = Auth.me();
  const boardStar = boardStarList.getBoardStar(this.model.id);
  if (boardStar) {
    boardStarList.unstarBoard(this.model.id);
  } else {
    boardStarList.starBoard(this.model.id);
  }

  Analytics.sendUpdatedBoardFieldEvent({
    field: 'star',
    value: !!boardStar,
    source: 'boardScreen',
    containers: {
      board: {
        id: this.model.id,
      },
    },
  });

  return this;
};

module.exports.openFilter = function (e) {
  Util.stop(e);
  Analytics.sendClickedButtonEvent({
    buttonName: 'boardFilterButton',
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

  this.sidebarView.pushView('filter');
};

module.exports.clearFilters = function (e) {
  Util.stop(e);
  Analytics.sendClickedButtonEvent({
    buttonName: 'clearBoardFilterButton',
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

  this.model.filter.clear();
};

module.exports.showCleanUp = function (e) {
  Util.stop(e);

  const view = new BoardCleanUpView({
    model: this.model,
    modelCache: this.modelCache,
  });
  Dialog.show({
    view,
    maxWidth: 800,
    hide() {
      return view.abort();
    },
  });
};

module.exports.renderBoardHeaderFilterButton = function (cardCount) {
  const targetNodeForButton = this.el.querySelector(
    '.js-board-header-filter-btn-container',
  );

  if (!targetNodeForButton) {
    return;
  }

  renderComponent(
    <BoardHeaderFilterButton
      idBoard={this.model.id}
      idOrganization={this.model.getOrganization()?.id}
      idEnterprise={this.model.getEnterprise()?.id}
      // eslint-disable-next-line react/jsx-no-bind
      clearFilters={() => {
        Analytics.sendClickedButtonEvent({
          buttonName: 'viewsCardFilterClearFilterButton',
          source: 'viewsCardFilterInlineDialog',
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

        this.model.filter.clear();
      }}
      // eslint-disable-next-line react/jsx-no-bind
      isFiltering={() => this.model.filter.isFiltering()}
      backgroundBrightness={this.model.getPref('backgroundBrightness')}
      cardCount={cardCount}
    />,
    targetNodeForButton,
  );
};

module.exports.renderBoardViewsButton = function () {
  const targetNodeForButton = this.el.querySelector(
    '.js-board-views-btn-container',
  );

  if (!targetNodeForButton) {
    return;
  }

  const renderBoardViewsButtonWithReact = async () => {
    const me = Auth.me();

    let orgName = undefined;
    let idOrg = undefined;

    let hasTeamTable = false;
    let isOrgPrivate = undefined;
    let isTeamMember = false;
    let hasViewsFeature = false;
    let paidStatus;

    let isPublicTeamGuest = undefined;
    let isStandardOrFreeTeamBoardGuest = undefined;

    if (this.model.hasOrganization()) {
      idOrg = this.model.get('idOrganization');
      const org = this.model.getOrganization();

      // checks to disables board switcher button for standard and free board guests
      const isStandardOrFreeTeamBoard =
        !this.model.isEnterpriseBoard() && !this.model.isBcBoard();
      isPublicTeamGuest = this.model.isGuest(me);
      isStandardOrFreeTeamBoardGuest =
        isPublicTeamGuest && isStandardOrFreeTeamBoard;

      if (org) {
        orgName = org.get('name');
        isTeamMember = Boolean(org.isMember(me));
        hasViewsFeature = org.isFeatureEnabled(PremiumFeature.Views);
        hasTeamTable = canViewTeamTablePage(
          hasViewsFeature,
          org.isBusinessClass() || org.isEnterprise(),
        );
        paidStatus = org.getPaidStatus();
      } else {
        isOrgPrivate = true;
      }
    }

    renderComponent(
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-panorama',
          feature: Feature.BoardViewsButton,
        }}
        errorHandlerComponent={Null}
      >
        <BoardViewsButton
          isTeamMember={isTeamMember}
          orgName={orgName}
          idOrg={idOrg}
          isOrgPrivate={isOrgPrivate}
          paidStatus={paidStatus}
          isStandardOrFreeTeamBoardGuest={isStandardOrFreeTeamBoardGuest}
          hasViewsFeature={hasViewsFeature}
          shouldShowTeamTableLink={hasTeamTable}
          idBoard={this.model.id}
          oneTimeMessagesDismissed={me.attributes.oneTimeMessagesDismissed}
          shortLink={this.model.get('shortLink')}
          // eslint-disable-next-line react/jsx-no-bind
          preloadPlugins={() => {
            return this.model.getAvailablePlugins();
          }}
          viewOptions={this.getBoardViewsButtonOptions()}
          // eslint-disable-next-line react/jsx-no-bind
          clearFilters={() => this.model.filter.clear()}
          backgroundBrightness={this.model.getPref('backgroundBrightness')}
          isLoadingPowerUpViews={this.isLoadingPowerUpViews}
          powerUpViewOptions={this.getPowerUpViewOptions()}
          // eslint-disable-next-line react/jsx-no-bind
          setIframePopoverOverlayVisibility={(visibility) => {
            this.$('.js-plugin-iframe-container').toggleClass(
              'plugin-iframe-container-pop-over-shown',
              visibility,
            );
          }}
        />
      </ErrorBoundary>,
      targetNodeForButton,
    );
  };

  if (!this.boardViewsButtonPreviouslyRender) {
    // Defer here since the target div that is being rendered by Backbone may
    // not be available yet.
    _.defer(() => {
      renderBoardViewsButtonWithReact();
      return (this.boardViewsButtonPreviouslyRender = true);
    });
  } else {
    renderBoardViewsButtonWithReact();
  }
};

// returns an array of view options, which are passed into the BoardViewButtons component
module.exports.getBoardViewsButtonOptions = function () {
  const enterprise = this.model.getEnterprise();
  const me = Auth.me();
  const boardViewableBy = this.model.getViewPermState(me) !== 'none';
  const hasReachedPowerUpLimit = !this.model.canEnableAdditionalPowerUps();
  const boardEditable = this.model.editable();
  const isPrivateTeam =
    this.model.hasOrganization() && !this.model.getOrganization();
  const isPublicTeamGuest =
    this.model.hasOrganization() &&
    this.model.getOrganization() &&
    !this.model.getOrganization().isMember(me);
  const isBoardGuest = isPrivateTeam || isPublicTeamGuest;
  const hasViewsFeature = this.model.isFeatureEnabled(PremiumFeature.Views);

  // used to determine if the Calendar or Map view option should appear.
  // If the pup is enabled, we show the options if you're a member or the board is public.
  // If the pup is not enabled, we still show the options, unless:
  //   - the pup is enterprise-disallowed
  //   - you can't enable more pups on this board and we are not upselling to you
  //   - you can view the board but not edit it

  // see https://hello.atlassian.net/wiki/spaces/TRELLO/pages/677256084/
  const shouldShowPupOption = ({ isPowerUpEnabled, isPowerUpAllowed }) => {
    if (!isPowerUpEnabled) {
      if (!isPowerUpAllowed) {
        return false;
      }

      if (hasReachedPowerUpLimit && boardEditable) {
        //Board Guests have no way to upgrade team, nor enable extra pups
        if (isBoardGuest) {
          return false;
        } else return !isDesktop;
      }

      if (boardViewableBy) {
        return boardEditable;
      }
    }
    return boardEditable || boardViewableBy;
  };

  // used to navigate to Calendar and Map's respective board routes.
  // but only if the pup is either successfully enabled first, or already enabled.
  const enablePupThenNavigate = (idPlugin, name) => {
    const pluginAttributes = {
      pluginName: name,
      pluginId: idPlugin,
      pluginTags: this.model.get('tags'),
    };
    const powerUpBoardUrl = Controller.getBoardUrl(this.model.id, name);
    if (this.model.isPluginEnabled(idPlugin)) {
      navigate(powerUpBoardUrl, { trigger: true });
    } else if (this.model.editable()) {
      const isPowerUpAllowed = enterprise
        ? enterprise.isPluginAllowed(idPlugin)
        : true;
      if (!isPowerUpAllowed) {
        return;
      }

      const traceId = Analytics.startTask({
        taskName: 'enable-plugin',
        source: 'boardViewsInlineDialog',
        attributes: pluginAttributes,
      });
      this.model.enablePluginWithTracing(idPlugin, {
        traceId,
        attributes: pluginAttributes,
        taskName: 'enable-plugin',
        source: 'boardViewsInlineDialog',
        next: (err) => {
          if (!err) {
            sendPluginTrackEvent({
              idPlugin,
              idBoard: this.model.id,
              event: {
                action: 'added',
                actionSubject: 'powerUp',
                source: 'boardViewsInlineDialog',
                attributes: {
                  tags: this.model.get('tags'),
                  taskId: traceId,
                },
              },
            });
            navigate(powerUpBoardUrl, { trigger: true });
          }
        },
      });
    }
  };

  const trackOptionClick = (actionSubjectId) => {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'dropdownItem',
      actionSubjectId,
      source: 'boardViewsInlineDialog',
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
  };

  const boardOption = {
    name: 'board',
    descriptionString: 'board-view-description',
    icon: ListIcon,
    navigateTo: () => {
      const boardUrl = Controller.getBoardUrl(this.model.id);

      navigate(boardUrl, { trigger: true });

      // When maneuvering back to Board, we need to check again
      // for filters when updating the URL
      const queryString = this.model.filter.toQueryString();

      if (queryString) {
        return history.replaceState(null, null, boardUrl + queryString);
      }
    },
    track: () => trackOptionClick('boardViewDropdownItem'),
    isVisible: true,
    isGA: true,
    testId: BoardHeaderTestIds.BoardViewOption,
  };

  const isCalendarViewVisible =
    seesVersionedVariation('ecosystem.calendar-view', 'stable') &&
    hasViewsFeature;

  const isPupTransitionEnabled = featureFlagClient.get(
    'ecosystem.pups-views-transition',
    false,
  );

  const canShowCalendarInSwitcher = !isPupTransitionEnabled;

  const calendarPupOption = {
    name: 'calendar',
    descriptionString: 'calendar-view-description',
    icon: CalendarIcon,
    showUpsell:
      !this.model.canEnableAdditionalPowerUps() &&
      !this.model.isPluginEnabled(CALENDAR_POWER_UP_ID) &&
      !isDesktop,
    navigateTo: () => enablePupThenNavigate(CALENDAR_POWER_UP_ID, 'calendar'),
    track: () => trackOptionClick('calendarViewDropdownItem'),
    isVisible:
      canShowCalendarInSwitcher &&
      !isCalendarViewVisible &&
      shouldShowPupOption({
        isPowerUpEnabled: this.model.isPluginEnabled(CALENDAR_POWER_UP_ID),
        isPowerUpAllowed: enterprise
          ? enterprise.isPluginAllowed(CALENDAR_POWER_UP_ID)
          : true,
      }),
    isGA: true,
  };

  const canShowMapInSwitcher = !isPupTransitionEnabled || hasViewsFeature;

  const mapOption = {
    name: 'map',
    descriptionString: 'map-view-description',
    icon: LocationIcon,
    showUpsell:
      !this.model.canEnableAdditionalPowerUps() &&
      !this.model.isPluginEnabled(MAP_POWER_UP_ID) &&
      !isDesktop,
    navigateTo: () => enablePupThenNavigate(MAP_POWER_UP_ID, 'map'),
    track: () => trackOptionClick('mapViewDropdownItem'),
    isVisible:
      canShowMapInSwitcher &&
      shouldShowPupOption({
        isPowerUpEnabled: this.model.isPluginEnabled(MAP_POWER_UP_ID),
        isPowerUpAllowed: enterprise
          ? enterprise.isPluginAllowed(MAP_POWER_UP_ID)
          : true,
      }),
    isGA: true,
    testId: BoardHeaderTestIds.MapViewOption,
  };

  const isBetaTransitionEnabled = featureFlagClient.get(
    'ecosystem.views-beta-phase-transition',
    false,
  );
  const timelineVersion = featureFlagClient.get(
    'ecosystem.timeline-version',
    'none',
  );
  const timelineOption = {
    name: 'timeline',
    descriptionString: 'timeline-view-description',
    icon: TimelineIcon,
    navigateTo: () => {
      const timelineUrl = Controller.getBoardUrl(this.model.id, 'timeline');
      navigate(timelineUrl, { trigger: true });
    },
    track: () => trackOptionClick('timelineViewDropdownItem'),
    isVisible: timelineVersion !== 'none' && hasViewsFeature,
    isBeta: !isBetaTransitionEnabled,
    testId: BoardHeaderTestIds.TimelineViewOption,
  };

  const calendarViewOption = {
    name: 'calendar-view',
    descriptionString: 'calendar-view-description',
    icon: CalendarIcon,
    navigateTo: () => {
      const calendarViewUrl = Controller.getBoardUrl(
        this.model.id,
        'calendar-view',
      );
      navigate(calendarViewUrl, { trigger: true });
    },
    track: () => trackOptionClick('advancedCalendarViewDropdownItem'),
    isVisible: isCalendarViewVisible,
    isBeta: !isBetaTransitionEnabled,
    testId: BoardHeaderTestIds.CalendarViewOption,
  };

  const dashboardOption = {
    name: 'dashboard',
    descriptionString: 'dashboard-view-description',
    icon: DashboardIcon,
    navigateTo: () => {
      const dashboardUrl = Controller.getBoardUrl(this.model.id, 'dashboard');
      navigate(dashboardUrl, { trigger: true });
    },
    track: () => trackOptionClick('dashboardViewDropdownItem'),
    isBeta: !isBetaTransitionEnabled,
    isVisible:
      seesVersionedVariation('wildcard.board-dashboard-view', 'stable') &&
      hasViewsFeature,
    testId: BoardHeaderTestIds.DashboardViewOption,
  };

  const tableEnabled = featureFlagClient.get(
    'panorama.single-board-table-view',
    false,
  );

  const tableOption = {
    name: 'table',
    descriptionString: 'table-view-description',
    icon: TableIcon,
    navigateTo: () => {
      const tableUrl = Controller.getBoardUrl(this.model.id, 'table');
      navigate(tableUrl, { trigger: true });
    },
    track: () => trackOptionClick('singleBoardTableView'),
    isVisible: tableEnabled && hasViewsFeature,
    isBeta: !isBetaTransitionEnabled,
    testId: BoardHeaderTestIds.SingleBoardTableViewOption,
  };

  return [
    boardOption,
    calendarPupOption,
    mapOption,
    timelineOption,
    calendarViewOption,
    dashboardOption,
    tableOption,
  ];
};

module.exports.removeBoardViewsButton = function () {
  if (this.$('.js-board-views-btn-container').length) {
    return ReactDOM.unmountComponentAtNode(
      this.$('.js-board-views-btn-container')[0],
    );
  }
};

module.exports.loadPowerUpViewsButtonOptions = async function () {
  const powerUpViewsEnabled = featureFlagClient.get(
    'ecosystem.power-up-views',
    false,
  );

  if (!powerUpViewsEnabled) {
    return;
  }

  try {
    this.isLoadingPowerUpViews = true;
    const powerUpViews = await PluginRunner.all({
      timeout: 5000,
      command: 'board-views',
      board: this.model,
    });
    this.powerUpViews = powerUpViews;
  } catch (e) {
    console.warn('Failed to request Power-Up views.');
  }

  this.isLoadingPowerUpViews = false;
  this.renderBoardViewsButton();
};

module.exports.getPowerUpViewOptions = function () {
  if (!this.powerUpViews || this.powerUpViews.length === 0) {
    return [];
  }

  return this.powerUpViews.map((powerUpView) => ({
    ...powerUpView,
    navigateTo: () => {
      const powerUpViewUrl = Controller.getBoardUrl(this.model.id, 'power-up', [
        powerUpView.idPlugin,
        'view',
        powerUpView.key,
      ]);
      navigate(powerUpViewUrl, { trigger: true });
    },
  }));
};

module.exports.showTimeline = function () {
  const timelineVersion = featureFlagClient.get(
    'ecosystem.timeline-version',
    'none',
  );

  const hasViewsFeature = this.model.isFeatureEnabled(PremiumFeature.Views);

  if (timelineVersion !== 'none' && hasViewsFeature) {
    this.$('#board').addClass('hide');
    const container = this.$('.js-board-view-container')[0];
    renderComponent(
      <TimelineViewWrapper
        idBoard={this.model.id}
        // eslint-disable-next-line react/jsx-no-bind
        navigateToCard={(id, params) => {
          Controller.showCardDetail(this.modelCache.get('Card', id), params);
        }}
        // eslint-disable-next-line react/jsx-no-bind
        closeView={() => {
          const boardUrl = Controller.getBoardUrl(this.model.id);
          navigate(boardUrl, { trigger: true });

          const queryString = this.model.filter.toQueryString();

          if (queryString) {
            return history.replaceState(null, null, boardUrl + queryString);
          }
        }}
      />,
      container,
    );
  } else {
    const boardUrl = Controller.getBoardUrl(this.model.id);
    navigate(boardUrl, { trigger: true });
  }
};

module.exports.showCalendarView = function () {
  const isCalendarViewEnabled = seesVersionedVariation(
    'ecosystem.calendar-view',
    'stable',
  );

  const hasViewsFeature = this.model.isFeatureEnabled(PremiumFeature.Views);

  const canShowCalendarView = isCalendarViewEnabled && hasViewsFeature;

  if (canShowCalendarView) {
    this.$('#board').addClass('hide');
    const container = this.$('.js-board-view-container')[0];
    renderComponent(
      <SingleBoardCalendarView
        idBoard={this.model.id}
        // eslint-disable-next-line react/jsx-no-bind
        navigateToCard={(id) => {
          Controller.showCardDetail(this.modelCache.get('Card', id));
        }}
        // eslint-disable-next-line react/jsx-no-bind
        closeView={() => {
          const boardUrl = Controller.getBoardUrl(this.model.id);
          navigate(boardUrl, { trigger: true, shouldTrack: false });

          const queryString = this.model.filter.toQueryString();

          if (queryString) {
            return history.replaceState(null, null, boardUrl + queryString);
          }
        }}
      />,
      container,
    );
  } else {
    const boardUrl = Controller.getBoardUrl(this.model.id);
    navigate(boardUrl, { trigger: true, shouldTrack: false });
  }
};

module.exports.showTable = function () {
  const isTableViewEnabled = featureFlagClient.get(
    'panorama.single-board-table-view',
    false,
  );

  const hasViewsFeature = this.model.isFeatureEnabled(PremiumFeature.Views);

  if (isTableViewEnabled && hasViewsFeature) {
    this.$('#board').addClass('hide');

    const container = this.$('.js-board-view-container')[0];
    renderComponent(
      <SingleBoardTableView
        idOrg={this.model.getOrganization().id}
        idBoard={this.model.id}
        // eslint-disable-next-line react/jsx-no-bind
        navigateToCard={(id) => {
          Controller.showCardDetail(this.modelCache.get('Card', id));
        }}
        // eslint-disable-next-line react/jsx-no-bind
        closeView={() => {
          const boardUrl = Controller.getBoardUrl(this.model.id);
          navigate(boardUrl, { trigger: true });

          const queryString = this.model.filter.toQueryString();

          if (queryString) {
            return history.replaceState(null, null, boardUrl + queryString);
          }
        }}
      />,
      container,
    );
  } else {
    const boardUrl = Controller.getBoardUrl(this.model.id);
    navigate(boardUrl, { trigger: true });
  }
};

module.exports.closeSingleBoardView = function () {
  const viewContainer = this.$('.js-board-view-container')[0];
  ReactDOM.unmountComponentAtNode(viewContainer);
  this.$('#board').removeClass('hide');
  this.$('.js-list-name-input').trigger('autosize.resize', false);
  this.renderBoardViewsButtonDebounced();
};

module.exports.renderButlerBoardButtons = function () {
  const reactRoot = this.$('.js-butler-header-btns')[0];
  if (this.model?.editable()) {
    if (reactRoot) {
      try {
        renderComponent(
          <ButlerBoardButtons idBoard={this.model.id} />,
          reactRoot,
        );
      } catch (err) {
        sendErrorEvent(err, {
          tags: {
            ownershipArea: 'trello-workflowers',
            feature: Feature.ButlerOnBoards,
          },
        });
      }
    }
  }
};

module.exports.navigateToAutomaticReports = function (reportType) {
  const automaticReportView = Controller.getBoardUrl(
    this.model.id,
    `butler/reports/${reportType}`,
  );

  navigate(automaticReportView, { trigger: true });

  // Close the sidebar menu for window sizes that aren't extra large.

  if (!WindowSize.fExtraLarge) {
    this.sidebarView.hideSidebar();
  }
};

// This is actually pretty generic and just closes any overlays;
// if it ever needs reuse, feel free to rename it.
function closeAutomaticReports(idBoard) {
  const boardUrl = Controller.getBoardUrl(idBoard || this.model.id);
  navigate(boardUrl, { trigger: true });
}
module.exports.closeAutomaticReports = closeAutomaticReports;

module.exports.showAutomaticReports = function (reportType) {
  const idBoard = this.model.id;
  const container = this.$('.js-board-view-container')[0];
  this.$('#board').addClass('hide');

  renderComponent(
    <AutomaticReports
      reportType={reportType}
      idBoard={idBoard}
      idOrganization={this.model.get('idOrganization')}
      boardName={this.model.get('name')}
      // eslint-disable-next-line react/jsx-no-bind
      closeView={() => closeAutomaticReports(idBoard)}
    />,
    container,
  );
  Analytics.sendViewedComponentEvent({
    componentType: 'overlay',
    componentName: 'butlerReportBuilderOverlay',
    source: 'butlerReportBuilderOverlay',
    attributes: {
      reportType,
    },
  });
};
