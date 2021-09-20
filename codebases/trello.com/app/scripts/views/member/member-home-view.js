/* eslint-disable
    no-cond-assign,
    */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Analytics } = require('@trello/atlassian-analytics');
const { routes } = require('@trello/routes');
const { defaultRouter } = require('app/src/router');
const { Auth } = require('app/scripts/db/auth');
const AutoInsertionView = require('app/scripts/views/internal/autocomplete/auto-insertion-view');
const AutoMentionerView = require('app/scripts/views/internal/autocomplete/auto-mentioner-view');
const BoardListAnnouncementComponent = require('app/scripts/views/board-list/board-list-announcement-component');
const BoardListItemAddComponent = require('app/scripts/views/board-list/board-list-item-add-component');
const BoardListItemPrivateBoardComponent = require('app/scripts/views/board-list/board-list-item-private-board-component');
const BoardListItemComponent = require('app/scripts/views/board-list/board-list-item-component');
const BoardListItemDndComponent = require('app/scripts/views/board-list/board-list-item-dnd-component');
const BoardListSectionComponent = require('app/scripts/views/board-list/board-list-section-component');
const BoardListSectionDndComponent = require('app/scripts/views/board-list/board-list-section-dnd-component');
const BoardListSectionHeaderComponent = require('app/scripts/views/board-list/board-list-section-header-component');
const BoardListSectionHeaderLinkComponent = require('app/scripts/views/board-list/board-list-section-header-link-component');
const BoardsPageAnnouncement = require('app/scripts/data/boards-page-announcement');
const {
  HomeLeftSidebarContainer,
} = require('app/scripts/views/home/presentational/HomeLeftSidebarContainer');
const {
  StickyBoxWaitForMount,
} = require('app/src/components/StickyBoxWaitForMount');
const {
  HomeMainContentContainer,
} = require('app/scripts/views/home/home-main-content-container');
const {
  HomeRightSidebarContainer,
} = require('app/scripts/views/home/home-right-sidebar-container');
const CompleterUtil = require('app/scripts/views/internal/autocomplete/completer-util');
const { Controller } = require('app/scripts/controller');
const { Dates } = require('app/scripts/lib/dates');
const EmojiCompleterView = require('app/scripts/views/internal/autocomplete/emoji-completer-view');
const { seesVersionedVariation } = require('@trello/feature-flag-client');
const GoldBannerView = require('app/scripts/views/member/gold-banner-view');
const Language = require('@trello/locale');
const { ModelCache } = require('app/scripts/db/model-cache');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const {
  BoardListGuestSectionPopover,
} = require('app/scripts/views/board-list/board-list-guest-section-popover.tsx');
const Promise = require('bluebird');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const {
  ReactRootComponent,
} = require('app/scripts/views/internal/react-root-component');
const { RecentBoards } = require('app/scripts/lib/recent-boards');
const recentBoardsHelper = new RecentBoards();
const TeamBannerView = require('app/scripts/views/member/team-banner-view');
const TeamBoardsLinkBanner = require('app/scripts/views/board-list/board-list-team-board-link-component')
  .default;
const { TeamTemplatePicker } = require('app/src/components/TemplatePicker');
const {
  LazyBoardsPageTemplatePicker,
} = require('app/src/components/TemplatePicker');
const {
  UpgradeSmartComponentConnected,
} = require('app/src/components/UpgradePrompts/UpgradeSmartComponent');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const createBoardHelpers = require('app/scripts/views/board-create/helpers');
const f = require('effing');
const { getGoldBanner } = require('app/scripts/lib/util/get-gold-banner');
const { getTeamBanner } = require('app/scripts/lib/util/get-team-banner');
const { l } = require('app/scripts/lib/localize');
const { ninvoke } = require('app/scripts/lib/util/ninvoke');
const {
  maybeDisplayMemberLimitsError,
} = require('app/scripts/views/board-menu/member-limits-error');
const isDesktop = require('@trello/browser').isDesktop();
const {
  LazyTemplatesContainer,
} = require('app/src/components/Templates/LazyTemplatesContainer');
const {
  ClosedBoardsButtonLazyWrapped: ClosedBoardsButton,
} = require('app/src/components/ClosedBoardsButton/ClosedBoardsButtonLazyWrapped');
const { TableIcon } = require('@trello/nachos/icons/table');
const { ReduxProvider } = require('app/src/components/ReduxProvider');
const getCurrentPathname = () => {
  const routePathWithSearchParams = defaultRouter.getRoute().routePath;
  return routePathWithSearchParams
    .substr(1, routePathWithSearchParams.length)
    .replace(/\?(.*)$/, ''); // Remove search params
};
const { canViewTeamTablePage } = require('app/src/components/ViewsGenerics');
const { Button } = require('@trello/nachos/button');
const { forNamespace } = require('@trello/i18n');
const { useLazyComponent } = require('@trello/use-lazy-component');
const { PremiumFeature } = require('@trello/product-features');
const {
  BoardsListViewsPopoverButton,
} = require('app/src/components/BoardsListViewsPopoverButton');
const {
  CreateBoardOverlayBridge,
  getCreateBoardOverlayBridgeSharedState,
} = require('app/src/components/CreateBoardOverlayBridge');
const { ComponentWrapper } = require('app/src/components/ComponentWrapper');
const {
  MemberBoardsWorkspacesEmptyState,
} = require('app/src/components/MemberBoards');

// Used to control the CreateBoardOverlayBridge
const createBoardOverlayState = getCreateBoardOverlayBridgeSharedState();

// Reset the overlay state
const closeCreateBoardOverlay = () => {
  createBoardOverlayState.setValue({
    open: false,
    orgId: undefined,
  });
};

const AllClosedBoardsButton = () => {
  const ClosedBoardsOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "closed-boards-overlay" */ 'app/src/components/ClosedBoardsOverlay'
      ),
    {
      preload: false,
    },
  );
  const [showClosedBoardsOverlay, setShowClosedBoardsOverlay] = React.useState(
    false,
  );

  const onClose = React.useCallback(() => {
    setShowClosedBoardsOverlay(false);
  }, [setShowClosedBoardsOverlay]);

  const onViewClosedBoardsButtonClick = (e) => {
    setShowClosedBoardsOverlay(true);
    Analytics.sendClickedLinkEvent({
      linkName: 'viewAllClosedBoardsLink',
      source: 'memberBoardsHomeScreen',
    });
  };

  return (
    <>
      <Button
        className={'view-all-closed-boards-button'}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={onViewClosedBoardsButtonClick}
      >
        {forNamespace('home closed boards')('view all closed boards')}
      </Button>
      {showClosedBoardsOverlay && (
        <React.Suspense fallback={null}>
          <ClosedBoardsOverlay onClose={onClose} />
        </React.Suspense>
      )}
    </>
  );
};

const DEFAULT_TEAM_LIMIT = 20;
class MemberHomeView extends View {
  events() {
    return {
      'keyup .js-text': 'keyAutoMention',
      'keydown .js-text': 'keydownJsText',
      'click .js-show-all-teams': 'showAllTeams',
    };
  }

  className() {
    return 'member-boards-view';
  }

  static initClass() {
    this.prototype.focusedCard = null;
  }

  constructor(options) {
    super(options);
    this.setFocusedCard = this.setFocusedCard.bind(this);
    this.isShowingAllTeams = false;
  }

  initialize() {
    const renderReactSectionDebounced = this.frameDebounce(
      this.renderReactSection,
    );

    this.listenTo(
      this.model.organizationList,
      'add remove reset change:memberships',
      this.frameDebounce(this.renderBanner),
    );

    this.listenTo(
      this.model.organizationList,
      'add remove reset change:name change:displayName change:logoHash change:products change:limits',
      renderReactSectionDebounced,
    );

    this.listenTo(
      this.model.boardList,
      'add remove reset change:name change:idOrganization change:dateLastActivity change:dateLastView change:closed change:prefs.isTemplate',
      renderReactSectionDebounced,
    );

    this.listenTo(
      this.model.boardStarList,
      'add remove reset change:pos',
      this.renderReactSection,
    );

    this.listenTo(
      this.model,
      'change:oneTimeMessagesDismissed',
      this.renderReactSection,
    );

    this.listenTo(
      this.model,
      'change:oneTimeMessagesDismissed',
      this.renderBanner,
    );
  }

  keydownJsText(e) {
    if (
      PopOver.view instanceof EmojiCompleterView ||
      PopOver.view instanceof AutoMentionerView
    ) {
      return typeof this.checkInsert === 'function'
        ? this.checkInsert(e)
        : undefined;
    }
  }

  showAllTeams() {
    this.isShowingAllTeams = true;
    this.renderReactSection();
  }

  getCard() {
    return this.focusedCard;
  }

  setFocusedCard(idCard) {
    return (this.focusedCard = idCard);
  }

  getTextInput() {
    return this.$('.js-text:focus');
  }

  getEmojiTarget() {
    return this.$('.js-text:focus');
  }

  getMentionTarget() {
    return this.$('.js-text:focus')[0];
  }

  renderReactSection() {
    ReactDOM.render(
      <ReactRootComponent>{this.showHomeContainer()}</ReactRootComponent>,
      this.$reactRoot[0],
    );

    return this;
  }

  renderBanner() {
    const $banners = this.$('.js-boards-page-banners').empty();

    const { bannerToDisplay, idBannersToDismiss } = getTeamBanner(this.model);

    const goldBanner = getGoldBanner(this.model);

    if (bannerToDisplay) {
      if (goldBanner && !bannerToDisplay.doesIncludeGold) {
        $banners.prepend(
          this.subview(GoldBannerView, this.model, {
            banner: goldBanner,
            idTeamBannersToDismiss: idBannersToDismiss,
          }).render().el,
        );
      } else {
        $banners.prepend(
          new TeamBannerView({
            bannerToDisplay,
            idBannersToDismiss,
            model: this.model,
          }).render().el,
        );
      }
    } else if (goldBanner) {
      $banners.prepend(
        this.subview(GoldBannerView, this.model, {
          banner: goldBanner,
        }).render().el,
      );
    }

    return this;
  }

  getPrivateBoardTiles(org) {
    if (!org?.isPremium() && !isDesktop) {
      return _.range(org.getPrivateBoardCount()).map((i) => (
        <BoardListItemPrivateBoardComponent key={i} org={org} />
      ));
    }
  }

  render() {
    this.$el.html(
      '<div class="js-boards-page-banners"></div><div class="js-boards-page"></div>',
    );
    if (this.$reactRoot /* eslint-disable-line eqeqeq */ == null) {
      this.$reactRoot = this.$('.js-boards-page');
    }
    this.orgname = this.options.orgname;
    this.templatesData = this.options.templatesData;

    this.renderReactSection();
    this.renderBanner();

    return this;
  }

  getBoardsPageTemplatePicker() {
    const props = {
      isNewAccount(date) {
        return Auth.me().accountNewerThan(date);
      },
      isDismissed(dismissId) {
        return Auth.me().isDismissed(dismissId);
      },
      setDismissed(dismissId) {
        return Auth.me().dismiss(dismissId);
      },
    };

    return <LazyBoardsPageTemplatePicker {...props} />;
  }

  renderAllBoards() {
    const templatePicker = this.getBoardsPageTemplatePicker();
    Analytics.sendScreenEvent({
      name: 'memberBoardsHomeScreen',
      attributes: {
        isMarketingEvent: true,
      },
    });

    const starredItems = this.getStarredBoards().map((board) =>
      this.boardToBoardItemDndElement(board, 'Starred Boards'),
    );

    const recentItems = this.getRecentBoards().map((board) =>
      this.boardToBoardItemElement(board, 'Recent Boards'),
    );

    const sortedOrgs = this.model.getSortedOrgs();
    const orgsToShow = this.isShowingAllTeams
      ? sortedOrgs
      : sortedOrgs.slice(0, DEFAULT_TEAM_LIMIT);
    const personalBoards = this.getPersonalBoards().map((board) =>
      this.boardToBoardItemElement(board, 'Personal Boards'),
    );
    const guestBoards = this.getGuestBoards();
    const guestOrgs = this.getGuestOrganizations(guestBoards);
    return (
      <React.Fragment>
        {templatePicker}
        {starredItems.length > 0 && (
          <BoardListSectionDndComponent
            items={starredItems}
            header={
              <BoardListSectionHeaderComponent
                title={l('board section title.starred boards')}
                iconClass={'star'}
              />
            }
            noSidebarMod={true}
          />
        )}
        {recentItems.length > 0 && (
          <BoardListSectionDndComponent
            items={recentItems}
            header={
              <BoardListSectionHeaderComponent
                title={l('home board section title.recent')}
                iconClass="clock"
              />
            }
            noSidebarMod={true}
          />
        )}
        {personalBoards.length > 0 && (
          <BoardListSectionComponent
            items={personalBoards}
            header={this.getMyBoardsHeader()}
            mayBeSorted={true}
            noSidebarMod={true}
            canShowTeamTemplatePicker={false}
            createNewItem={
              Auth.me().canCreateBoardIn() && (
                <BoardListItemAddComponent
                  preloadData={f(this, 'preloadCreateBoardData')}
                  newBoard={f(
                    this,
                    'newBoard',
                    this.model,
                    undefined,
                    undefined,
                  )}
                />
              )
            }
          />
        )}
        <div>
          <h3 className="boards-page-section-header-name">
            {l('home board section title.your teams')}
          </h3>
          {orgsToShow.length === 0 && <MemberBoardsWorkspacesEmptyState />}
          {orgsToShow.map((org) => (
            <BoardListSectionComponent
              key={org.id}
              items={this.getOrgBoards(org).map((board) =>
                this.boardToBoardItemElement(board, 'Workspace Boards'),
              )}
              header={this.getOrgHeader(org)}
              mayBeSorted={true}
              noSidebarMod={true}
              topBanner={
                this.getOrgBoards(org).length === 0
                  ? this.getTeamBoardLinkBanner(org, true)
                  : undefined
              }
              bottomBanner={
                this.getOrgBoards(org).length !== 0 &&
                this.model.organizationList.length === 1
                  ? this.getTeamBoardLinkBanner(org, false)
                  : undefined
              }
              createNewItem={
                Auth.me().canCreateBoardIn(org) && (
                  <BoardListItemAddComponent
                    preloadData={f(this, 'preloadCreateBoardData')}
                    newBoard={f(this, 'newBoard', org, undefined, org.id)}
                    org={org}
                  />
                )
              }
              orgId={org.id}
              orgName={org.get('name')}
            />
          ))}
          {this.isShowingAllTeams === false &&
            sortedOrgs.length > DEFAULT_TEAM_LIMIT && (
              <button className="js-show-all-teams">
                {l('member-home.show-all-teams')}
              </button>
            )}
        </div>
        {guestOrgs.length > 0 && (
          <div>
            <h3 className="boards-page-section-header-name">
              {l('home board section title.guest teams')}
              <BoardListGuestSectionPopover className="boards-page-section-header-icon" />
            </h3>
            {guestOrgs.map((org) => (
              <BoardListSectionComponent
                key={org.id}
                items={this.getOrgBoards(org).map((board) =>
                  this.boardToBoardItemElement(board, 'Workspace Boards'),
                )}
                header={this.getGuestOrgHeader(org)}
                mayBeSorted={true}
                noSidebarMod={true}
                topBanner={
                  this.getOrgBoards(org).length === 0
                    ? this.getTeamBoardLinkBanner(org, true)
                    : undefined
                }
                bottomBanner={
                  this.getOrgBoards(org).length !== 0 &&
                  this.model.organizationList.length === 1
                    ? this.getTeamBoardLinkBanner(org, false)
                    : undefined
                }
                orgId={org.id}
                orgName={org.get('name')}
              />
            ))}
          </div>
        )}
        <AllClosedBoardsButton />
      </React.Fragment>
    );
  }

  renderTeamBoards() {
    const org = ModelCache.findOne('Organization', 'name', this.orgname);

    const items = this.getStarredOrgBoards(org).map((board) =>
      this.boardToBoardItemElement(board, 'Starred Boards'),
    );

    const nonMemberOrgBoards = this.getNonMemberOrgBoards(org).map((board) =>
      this.boardToBoardItemElement(board, 'Workspace Boards', false),
    );

    return (
      <React.Fragment>
        <TeamTemplatePicker orgId={org.id} />
        {items.length > 0 && (
          <BoardListSectionComponent
            items={items}
            header={
              <BoardListSectionHeaderComponent
                title={l('board section title.starred team boards')}
                iconClass={'star'}
              />
            }
            noSidebarMod={true}
          />
        )}
        <BoardListSectionComponent
          items={this.getOrgBoards(org).map((board) =>
            this.boardToBoardItemElement(board, 'Workspace Boards'),
          )}
          header={
            <BoardListSectionHeaderComponent
              title={l('board section title.your team boards')}
              iconClass={'member'}
            />
          }
          noSidebarMod={true}
          createNewItem={
            Auth.me().canCreateBoardIn(org) && (
              <BoardListItemAddComponent
                preloadData={f(this, 'preloadCreateBoardData')}
                newBoard={f(this, 'newBoard', org, undefined, org.id)}
                org={org}
              />
            )
          }
          orgId={org.id}
          orgName={org.get('name')}
        />
        {nonMemberOrgBoards.length > 0 && (
          <BoardListSectionComponent
            items={nonMemberOrgBoards}
            header={
              <BoardListSectionHeaderComponent
                title={l('board section title.team boards')}
                iconClass="organization"
              />
            }
            noSidebarMod={true}
            createNewItem={
              Auth.me().canCreateBoardIn(org) && (
                <BoardListItemAddComponent
                  preloadData={f(this, 'preloadCreateBoardData')}
                  newBoard={f(this, 'newBoard', org, undefined, org.id)}
                  org={org}
                />
              )
            }
            orgId={org.id}
            orgName={org.get('name')}
            privateBoardTiles={this.getPrivateBoardTiles(org)}
          />
        )}
        <ClosedBoardsButton
          orgId={org.id}
          analyticsSource="workspaceBoardsHomeScreen"
        />
      </React.Fragment>
    );
  }

  renderTemplates() {
    if (this.templatesData /* eslint-disable-line eqeqeq */ != null) {
      this.templatesData.locale = Auth.me().get('lang');
    }
    return <LazyTemplatesContainer {...this.templatesData} />;
  }

  renderHome() {
    return (
      <React.Fragment>
        <HomeMainContentContainer
          modelCache={this.modelCache}
          orgname={this.orgname}
          setFocusedCard={this.setFocusedCard}
        />
        <StickyBoxWaitForMount>
          <ReduxProvider>
            <HomeRightSidebarContainer
              modelCache={this.modelCache}
              model={this.model}
              orgname={this.orgname}
            />
          </ReduxProvider>
        </StickyBoxWaitForMount>
      </React.Fragment>
    );
  }

  showHomeContainer() {
    // TODO: When we add the sidebar with Homecoming, we should get rid
    // noSidebarMod (see also
    // views/board-list/board-list-section-component.js and
    // boards-page-board-section.less).

    const showAnnouncement =
      BoardsPageAnnouncement?.enabled &&
      !this.model.isDismissed(BoardsPageAnnouncement.id) &&
      Language.matches(Language.currentLocale, BoardsPageAnnouncement.locale) &&
      Date.now() < Dates.parse(BoardsPageAnnouncement.dateExpires);

    if (showAnnouncement) {
      if (!this._recordedDisplayed) {
        this._recordedDisplayed = true;
      }
    }

    const formattedPath = getCurrentPathname();

    return (
      <>
        <div>
          {showAnnouncement && (
            <BoardListAnnouncementComponent
              icon={BoardsPageAnnouncement.icon}
              message={BoardsPageAnnouncement.message}
              // eslint-disable-next-line react/jsx-no-bind
              onDismiss={(message) => {
                this.model.dismiss(BoardsPageAnnouncement.id);
              }}
            />
          )}
          <div className="home-container">
            <div className="home-sticky-container">
              <StickyBoxWaitForMount
                className={
                  routes.teamHighlights.regExp.test(formattedPath)
                    ? 'home-highlights-left-sidebar'
                    : ''
                }
              >
                <HomeLeftSidebarContainer
                  modelCache={this.modelCache}
                  model={this.model}
                  activeOrgname={this.orgname}
                  templateCategory={
                    this.templatesData && this.templatesData.category
                  }
                />
              </StickyBoxWaitForMount>
              {this.renderChildren(formattedPath)}
            </div>
          </div>
        </div>
        <ComponentWrapper>
          <CreateBoardOverlayBridge
            sharedState={createBoardOverlayState}
            onClose={closeCreateBoardOverlay}
          />
        </ComponentWrapper>
      </>
    );
  }

  renderChildren(formattedPath) {
    const org = this.orgname
      ? ModelCache.findOne('Organization', 'name', this.orgname)
      : null;
    // When navigating around the app, member home view will be called
    // and a new instance created. If it uses a stale instance, orgname
    // or other instance properties can change depending where you start.
    // Therefore, make sure you check all the properties you need to render
    // the specific subview you want, such as orgname, otherwise strange bugs can occur.
    // Ultimately this view is in serious need of more refactor
    if (routes.memberHome.regExp.test(formattedPath)) {
      return this.renderHome();
    } else if (routes.teamHighlights.regExp.test(formattedPath) && org) {
      return this.renderHome();
    } else {
      let children;

      if (routes.memberHomeBoards.regExp.test(formattedPath) && org) {
        children = this.renderTeamBoards();
      } else if (routes.memberAllBoards.regExp.test(formattedPath)) {
        children = this.renderAllBoards();
      } else if (
        routes.templates.regExp.test(formattedPath) ||
        routes.templatesSubmit.regExp.test(formattedPath) ||
        routes.templatesRecommend.regExp.test(formattedPath)
      ) {
        children = this.renderTemplates();
      }

      return (
        <div className="all-boards">
          <StickyBoxWaitForMount>
            <div className="content-all-boards">{children}</div>
          </StickyBoxWaitForMount>
        </div>
      );
    }
  }

  backgroundObjForBoard(board) {
    let preview;
    return {
      brightness: board.getPref('backgroundBrightness'),

      ...(board.getPref('backgroundTile')
        ? {
            image: board.getPref('backgroundImage'),
            tiled: true,
          }
        : (preview =
            Util.smallestPreviewBiggerThan(
              board.getPref('backgroundImageScaled'),
              400,
              200,
            )?.url ?? board.getPref('backgroundImage'))
        ? {
            image: preview,
            tiled: false,
          }
        : {
            color:
              board.getPref('backgroundColor') ??
              board.getClientBackgroundColor('blue'),
          }),
    };
  }

  boardToBoardItemDndElement(board, sectionName) {
    const props = this.boardToBoardItemProps(board, sectionName);
    props.onDragHover = (idBoardHoverer) => {
      const { boardStarList } = Auth.me();
      const boardStar = boardStarList.getBoardStar(idBoardHoverer);
      const index = boardStarList.getBoardIndex(board.id);
      const pos = boardStarList.getNewPos(boardStar, index);
      return boardStar.set({ pos });
    };
    props.onDragEnd = () => {
      const { boardStarList } = Auth.me();
      const boardStar = boardStarList.getBoardStar(board.id);
      Promise.using(ModelCache.getLock(), () =>
        ninvoke(boardStar, 'update', {
          pos: boardStar.get('pos'),
        }).catch(() => {}),
      ).done();
    };
    props.orgname = board.getOrganization()?.get('displayName');
    props.isDraggable = true;

    return <BoardListItemDndComponent {...props} />;
  }

  boardToBoardItemElement(board, sectionName, isMember = true) {
    return (
      <BoardListItemComponent
        {...this.boardToBoardItemProps(board, sectionName, isMember)}
      />
    );
  }

  boardToBoardItemProps(board, sectionName, isMember = true) {
    return {
      id: board.id,
      name: board.get('name'),
      hasUnseenActivity: board.hasUnseenActivity(),
      dateLastActivity: new Date(
        board.get('dateLastActivity') ?? Util.idToDate(board.id),
      ),
      isLessActive: board.isLessActive(),
      background: this.backgroundObjForBoard(board),
      showOptions: Auth.isLoggedIn(),
      isStarred:
        Auth.me().boardStarList.getBoardStar(
          board.id,
        ) /* eslint-disable-line eqeqeq */ != null,
      relUrl: board.getUrl(),
      onStarClick: (idBoard) => {
        const { boardStarList } = Auth.me();
        Promise.using(ModelCache.getLock(), () => {
          let action;
          if (
            boardStarList.getBoardStar(
              idBoard,
            ) /* eslint-disable-line eqeqeq */ == null
          ) {
            boardStarList.starBoard(idBoard);
            action = 'starred';
          } else {
            boardStarList.unstarBoard(idBoard);
            action = 'unstarred';
          }
          Analytics.sendUIEvent({
            action,
            actionSubject: 'tile',
            actionSubjectId: 'compactBoardTile',
            source: 'memberBoardsHomeScreen',
            containers: {
              workspace: {
                id: board.getOrganization()?.get('id'),
              },
              board: {
                id: idBoard,
              },
            },
            attributes: {
              sectionName,
              isMember,
            },
          });
        }).done();
      },
      isTemplate: board.isTemplate(),
      badgeComponents: [],
      tagComponents: [],
      key: board.id,
      onBoardClick() {
        Analytics.sendUIEvent({
          action: 'clicked',
          actionSubject: 'tile',
          actionSubjectId: 'compactBoardTile',
          source: 'memberBoardsHomeScreen',
          containers: {
            workspace: {
              id: board.getOrganization()?.get('id'),
            },
            board: {
              id: board.id,
            },
          },
          attributes: {
            sectionName,
            isMember,
          },
        });
      },
    };
  }

  preloadCreateBoardData() {
    return createBoardHelpers.preloadData();
  }

  newBoard(model, el, selectedOrg) {
    if (maybeDisplayMemberLimitsError($(el), null, Auth.me())) {
      return;
    }

    createBoardOverlayState.setValue({
      open: true,
      orgId: selectedOrg,
    });

    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'tile',
      actionSubjectId: 'createBoardTile',
      source: 'memberHomeScreen',
      containers: {
        workspace: {
          id: model.typeName === 'Organization' ? model.id : null,
        },
      },
    });
  }

  getMyBoardsHeader() {
    return (
      <BoardListSectionHeaderComponent
        title={l('board section title.personal boards')}
      />
    );
  }

  getMyBoards() {
    return _.filter(
      this.model.boardList.models,
      (board) => !board.isOrgBoard() && board.isOpen(),
    );
  }

  getPersonalBoards() {
    return this.model.boardList.models.filter(
      (board) =>
        !board.getOrganization() && !board.isOrgBoard() && board.isOpen(),
    );
  }

  getGuestBoards() {
    return this.model.boardList.models.filter(
      (board) =>
        board.getOrganization() && board.isGuest(Auth.me()) && board.isOpen(),
    );
  }

  getGuestOrganizations(guestBoards) {
    return [...new Set(guestBoards.map((board) => board.getOrganization()))];
  }

  getOrgHeader(org) {
    const defaultViewsFlagEnabled = seesVersionedVariation(
      'remarkable.default-views',
      'alpha',
    );
    const canSeeOrgDefaultViews =
      defaultViewsFlagEnabled && org.isFeatureEnabled(PremiumFeature.Views);
    const canSeeTeamTablePage = canViewTeamTablePage(
      org.hasPremiumFeature('views'),
      org.isBusinessClass() || org.isEnterprise(),
    );

    const linkElements = _.compact([
      {
        url: Controller.getOrganizationUrl(org),
        iconClass: 'board',
        titleKey: 'boards',
        onClick() {
          Analytics.sendClickedButtonEvent({
            buttonName: 'workspaceBoardsButton',
            source: 'memberHomeScreen',
            containers: {
              workspace: {
                id: org.id,
              },
            },
          });
        },
      },
      canSeeTeamTablePage &&
        !defaultViewsFlagEnabled && {
          url: Controller.getOrganizationTablesUrl(org),
          iconClass: 'table',
          icon: <TableIcon />,
          titleKey: 'team-table',
          onClick() {
            Analytics.sendClickedButtonEvent({
              buttonName: 'workspaceTableButton',
              source: 'memberHomeScreen',
              containers: {
                workspace: {
                  id: org.id,
                },
              },
            });
          },
        },
      org.belongsToRealEnterprise() && {
        url: Controller.getOrganizationReportsUrl(org),
        iconClass: 'home',
        titleKey: 'team-report',
        onClick() {
          Analytics.sendClickedButtonEvent({
            buttonName: 'workspaceReportButton',
            source: 'memberHomeScreen',
            containers: {
              workspace: {
                id: org.id,
              },
            },
          });
        },
      },
      {
        url: Controller.getOrganizationMembersUrl(org),
        iconClass: 'member',
        titleKey: 'members',
        count: org.get('memberships')?.length,
        onClick() {
          Analytics.sendClickedButtonEvent({
            buttonName: 'workspaceMembersButton',
            source: 'memberHomeScreen',
            containers: {
              workspace: {
                id: org.id,
              },
            },
          });
        },
      },
      {
        url: Controller.getOrganizationAccountUrl(org),
        iconClass: 'gear',
        titleKey: 'settings',
        onClick() {
          Analytics.sendClickedButtonEvent({
            buttonName: 'workspaceSettingsButton',
            source: 'memberHomeScreen',
            containers: {
              workspace: {
                id: org.id,
              },
            },
          });
        },
      },
    ]);

    const linkElementsComponents = linkElements
      .map(
        f.choke(1, React, 'createElement', BoardListSectionHeaderLinkComponent),
      )
      .concat(
        <UpgradeSmartComponentConnected
          orgId={org.id}
          promptId="teamBoardsHeaderUpgradePromptButton"
        />,
      );

    //This link replaces Workspace Table conditionally
    //It should render immediately after 'Boards'
    if (defaultViewsFlagEnabled && canSeeTeamTablePage) {
      linkElementsComponents.splice(
        1,
        0,
        <BoardsListViewsPopoverButton
          orgId={org.get('id')}
          orgName={org.get('name')}
          canSeeOrgDefaultViews={canSeeOrgDefaultViews}
        />,
      );
    }

    const props = {
      title: org.get('displayName'),
      logoHash: org.get('logoHash'),
      linkElements: linkElementsComponents,
    };

    if (org.isFeatureEnabled('enterpriseUI')) {
      props.smallIconClass = 'enterprise';
      props.smallIconTitleKey = 'enterprise';
    } else if (org.isPremium()) {
      props.smallIconClass = 'business-class';
      props.smallIconTitleKey = 'business-class';
    }

    return <BoardListSectionHeaderComponent {...props} />;
  }

  getGuestOrgHeader(org) {
    const linkElements = org.isPublic()
      ? [
          <BoardListSectionHeaderLinkComponent
            url={Controller.getOrganizationUrl(org)}
            iconClass="board"
            titleKey="boards"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              Analytics.sendClickedButtonEvent({
                buttonName: 'workspaceBoardsButton',
                source: 'memberHomeScreen',
                containers: {
                  workspace: {
                    id: org.id,
                  },
                },
                attributes: {
                  isMember: false,
                },
              });
            }}
          />,
        ]
      : undefined;

    const props = {
      title: org.get('displayName'),
      iconClass: 'organization',
      logoHash: org.get('logoHash'),
      linkElements: linkElements,
    };

    if (org.isFeatureEnabled('enterpriseUI')) {
      props.smallIconClass = 'enterprise';
      props.smallIconTitleKey = 'enterprise';
    } else if (org.isPremium()) {
      props.smallIconClass = 'business-class';
      props.smallIconTitleKey = 'business-class';
    }

    return <BoardListSectionHeaderComponent {...props} />;
  }

  getOrgBoards(org) {
    return _.filter(
      this.model.boardList.models,
      (board) => board.getOrganization()?.id === org.id && board.isOpen(),
    );
  }

  getNonMemberOrgBoards(org) {
    // gets all org boards that current user isn't a part of
    const userOrgBoardIds = this.getOrgBoards(org).map((board) =>
      board.get('id'),
    );

    return _.chain(org.boardList.models)
      .filter((board) => board.isOpen())
      .map((board) => board.get('id'))
      .difference(userOrgBoardIds)
      .map((boardId) => ModelCache.get('Board', boardId))
      .value();
  }

  getStarredBoards() {
    return _.filter(this.model.boardStarList.getBoards(), (board) =>
      board.isOpen(),
    );
  }

  getStarredOrgBoards(org) {
    return _.filter(
      this.model.boardStarList.getBoards(),
      (board) => board.getOrganization()?.id === org.id && board.isOpen(),
    );
  }

  getRecentBoards() {
    return recentBoardsHelper
      .getBoards(this.model, this.renderReactSection.bind(this))
      .slice(0, 4);
  }

  remove() {
    ReactDOM.unmountComponentAtNode(this.$reactRoot[0]);
    return super.remove(...arguments);
  }

  getTeamBoardLinkBanner(org, emptyStateBanner) {
    const props = {
      teamName: org.get('displayName'),
      teamBoardsLink: Controller.getMemberOrgUrl(org.get('name'), true),
      emptyStateBanner,
      orgId: org.id,
      children: ({ banner }) => banner,
    };

    return <TeamBoardsLinkBanner {...props} />;
  }
}
MemberHomeView.initClass();

_.extend(MemberHomeView.prototype, AutoInsertionView, CompleterUtil);

module.exports = MemberHomeView;
