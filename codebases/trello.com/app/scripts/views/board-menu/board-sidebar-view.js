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
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const ArchiveView = require('app/scripts/views/archive/archive-view');
const { Auth } = require('app/scripts/db/auth');
const BoardMenuAboutThisBoardView = require('app/scripts/views/board-menu/board-menu-about-this-board-view');
const BoardLabelsView = require('app/scripts/views/board-menu/board-labels-view');
const BoardMenuActivityView = require('app/scripts/views/board-menu/board-menu-activity-view');
const BoardSidebarDefaultView = require('app/scripts/views/board-menu/board-sidebar-default-view');
const BoardSettingsView = require('app/scripts/views/board-menu/board-settings-view');
const BoardMenuMoreView = require('app/scripts/views/board-menu/board-menu-more-view');
const BoardCollectionsView = require('app/scripts/views/board-menu/board-collections-view');
const CardFilterView = require('app/scripts/views/board-menu/card-filter-view');
const ChangeBoardBackgroundView = require('app/scripts/views/board-menu/change-board-background-view');
const ChangeBoardBackgroundSelectView = require('app/scripts/views/board-menu/change-board-background-select-view');
const {
  Key,
  registerShortcut,
  Scope,
  unregisterShortcut,
} = require('@trello/keybindings');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const StickerPickerView = require('app/scripts/views/board-menu/sticker-picker-view');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const { featureFlagClient } = require('@trello/feature-flag-client');
const templates = require('app/scripts/views/internal/templates');
const { Analytics } = require('@trello/atlassian-analytics');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const {
  LazyTemplateTipsPopover,
} = require('app/src/components/TemplateTips/LazyTemplateTipsPopover');

const isInFilteringExperiment = featureFlagClient.getTrackedVariation(
  'board-header-filtering-experiment',
  false,
);

const isBoardHeaderFilterEnabled = featureFlagClient.get(
  'ecosystem.board-header-filter',
  false,
);

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class BoardSidebarView extends View {
  static initClass() {
    this.prototype.events = {
      'click .js-hide-sidebar': 'hideSidebar',
      'click .js-pop-widget-view': 'popView',
    };

    this.prototype.className = 'board-menu-container';

    this.prototype.hackySidebarLifetimeEvents = {
      filter: {
        didBecomeVisible(view) {
          const input = view.$('.js-autofocus')[0];
          return Util.setCaretAtEnd(input);
        },
      },
      more: {
        didBecomeVisible(view) {
          return view.selectUrl();
        },
      },
      archive: {
        didBecomeVisible(view) {
          const input = view.$('.js-autofocus')[0];
          return Util.setCaretAtEnd(input);
        },
        didBecomeRemoved(view) {
          // this is to trigger `remove()` on subviews that may contain mounted react components
          view.removeSubviews();
          return view.remove();
        },
      },
    };
  }

  constructor(options) {
    super(options);
    if (!isInFilteringExperiment && !isBoardHeaderFilterEnabled) {
      this.onShortcut = this.onShortcut.bind(this);
      registerShortcut(this.onShortcut, { scope: Scope.Sidebar, key: Key.f });
    }
  }

  initialize({ boardView }) {
    this.boardView = boardView;
    this.listenTo(this.model, {
      'change:prefs.isTemplate'() {
        this.handleTemplateMode();
        return this.renderTemplateTips();
      },
    });

    this.listenTo(this.model, {
      'change:prefs.permissionLevel'() {
        return this.renderTemplateTips();
      },
    });

    this.aboutView = this.subview(BoardMenuAboutThisBoardView, this.model, {
      sidebarView: this,
    });
    this.defaultView = this.subview(BoardSidebarDefaultView, this.model, {
      sidebarView: this,
    });

    // Set up default view
    const isTemplate = this.model.isTemplate();
    if (
      isTemplate &&
      !(this.model != null ? this.model.isMember(Auth.me()) : undefined)
    ) {
      // visiting a template as a non-admin/non-member
      this.viewStack = [{ name: 'about', view: this.aboutView }];
    } else {
      this.viewStack = [{ name: 'default', view: this.defaultView }];
      const hasDescOrIsOwner =
        !!this.model.get('desc') || this.model.ownedByMember(Auth.me());
      if ((this.model.isPublic() && hasDescOrIsOwner) || isTemplate) {
        this.pushView(
          'about',
          {},
          {
            easeIn: false,
            showSidebar: this.model.viewState.get('showSidebar'),
          },
        );
      }
    }
  }

  remove() {
    if (!isInFilteringExperiment && !isBoardHeaderFilterEnabled) {
      unregisterShortcut(this.onShortcut);
    }
    const archiveView = this.viewNamed('archive', {});
    this.hackySidebarLifetimeEvents.archive.didBecomeRemoved(archiveView);

    return super.remove(...arguments);
  }

  onShortcut() {
    this.pushView('filter');
    return Analytics.sendPressedShortcutEvent({
      shortcutName: 'searchAndFilterCardsShortcut',
      source: 'boardScreen',
      keyValue: 'F',
    });
  }

  render() {
    this.$el.html(
      templates.fill(require('app/scripts/views/templates/board_sidebar')),
    );

    // Defer until LD flag value is updated
    this.defer(() => {
      return this.renderView();
    });

    return this;
  }

  // Because of these classes aren't yet defined, we need to make this a
  // function. When we get proper requiring, this can become a normal object.
  sidebarSubviews() {
    return {
      default: BoardSidebarDefaultView,
      filter: CardFilterView,
      about: BoardMenuAboutThisBoardView,
      archive: ArchiveView,
      stickers: StickerPickerView,
      labels: BoardLabelsView,
      background: ChangeBoardBackgroundView,
      backgroundColors: ChangeBoardBackgroundSelectView,
      backgroundPhotos: ChangeBoardBackgroundSelectView,
      activity: BoardMenuActivityView,
      more: BoardMenuMoreView,
      settings: BoardSettingsView,
      collections: BoardCollectionsView,
    };
  }

  viewNamed(viewName, options) {
    for (const { name, view } of Array.from(this.viewStack)) {
      if (viewName === name) {
        return view;
      }
    }

    const viewClass = _.result(this, 'sidebarSubviews')[viewName];
    if (viewClass == null) {
      throw new Error(`Unknown sidebar view ${viewName}`);
    }
    const model = viewName === 'filter' ? this.model.filter : this.model;
    return new viewClass(
      _.extend(
        {
          model,
          modelCache: this.modelCache,
          sidebarView: this,
          viewState: options != null ? options.viewState : undefined,
        },
        options,
      ),
    );
  }

  topSidebarView() {
    return _.last(this.viewStack).view;
  }

  topSidebarViewOptions() {
    return _.last(this.viewStack).options;
  }

  topSidebarViewName() {
    return _.last(this.viewStack).name;
  }

  getScreenFromViewName(viewName) {
    if (viewName == null) {
      viewName = this.topSidebarViewName();
    }
    const screenName = viewName[0].toUpperCase() + viewName.slice(1);
    return `boardMenuDrawer${screenName}Screen`;
  }

  sendDrawerScreenEvent(sourceScreen, method) {
    return Analytics.sendScreenEvent({
      name: this.getScreenFromViewName(),
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: __guard__(this.model.getOrganization(), (x) => x.id) || '',
        },
      },
      attributes: {
        previousDrawerScreen: this.getScreenFromViewName(sourceScreen),
        drawerNavigationMethod: method,
      },
    });
  }

  renderView(options) {
    if (options == null) {
      options = {};
    }
    const { direction, callOnce, easeIn } = options;
    const $title = this.$('.js-board-menu-title');
    const $titleText = this.$('.js-board-menu-title-text').empty();
    const $contentWrapper = this.$('.js-board-menu-content-wrapper')
      .empty()
      .scrollTop(0);

    const view = this.topSidebarView();

    this.$('.board-menu-header').toggleClass('no-transition', !easeIn);
    $contentWrapper.toggleClass('no-padding', view.noPadding === true);

    if (view.headerDisplayTypeClass != null) {
      this.$('.js-board-menu-title').addClass(view.headerDisplayTypeClass);
    } else if (this.viewStack.length === 1) {
      this.$('.js-board-menu-title').addClass('is-board-menu-default-view');
    } else {
      this.$('.js-board-menu-title').removeClass('is-board-menu-default-view');
    }

    const $content = view.renderIfNecessary().$el;

    if (direction != null) {
      $content.addClass(direction);
    }

    const title = view.getViewTitle();
    if (title) {
      $title.addClass('is-in-frame');
      $titleText.append(title);
    } else {
      $title.removeClass('is-in-frame');
    }

    $contentWrapper.append($content);

    // this needs to be instantiated after the $contentWrapper has been cleared
    // of `.board-menu-content-frame`s and after inserting the current frame.
    // Otherwise, the transitionend triggers earlier on an old frame and we
    // don't get our didBecomeVisible.
    if (callOnce != null) {
      $('.board-menu-content-frame').one(
        'transitionend webkitTransitionEnd',
        (e) => {
          return callOnce(view);
        },
      );
    }

    this.defer(() => {
      // without the defer, the browser removes the class too quickly and
      // doesn't animate. i think they are batched somehow.
      if (direction != null) {
        return $content.removeClass(direction);
      }
    });

    // the view can drop events, like when loading a bunch of other sidebar
    // views then using the 'f' shortcut, so reattach them here just in case.
    view.delegateEvents();
    return this;
  }

  renderTemplateTips() {
    if (
      this.model.isTemplate() &&
      (this.model != null ? this.model.isMember(Auth.me()) : undefined) &&
      (this.model != null ? this.model.isPublic() : undefined)
    ) {
      $('.board-wrapper').append('<div class="template-tips"></div>');
      this.targetDiv = $('.template-tips')[0];
      return renderComponent(
        <LazyTemplateTipsPopover
          boardId={this.model.id}
          name={this.model.get('name')}
          username={Auth.me().get('username')}
          // eslint-disable-next-line react/jsx-no-bind
          toggleAboutThisTemplate={() => this.pushView('about')}
          // eslint-disable-next-line react/jsx-no-bind
          toggleBackgroundSelector={() => this.pushView('background')}
          isInGallery={!!this.model.get('templateGallery')}
        />,
        this.targetDiv,
      );
    } else if (this.targetDiv) {
      ReactDOM.unmountComponentAtNode(this.targetDiv);
      return (this.targetDiv = null);
    }
  }

  pushView(name, viewOptions, options) {
    let callOnce;
    if (viewOptions == null) {
      viewOptions = {};
    }
    if (options == null) {
      options = {};
    }
    let { animate, showSidebar, easeIn } = options;
    if (animate == null) {
      animate = true;
    }
    if (showSidebar == null) {
      showSidebar = true;
    }
    if (easeIn == null) {
      easeIn = true;
    }

    const view = this.viewNamed(name, viewOptions);

    const didBecomeVisible =
      __guard__(
        this.hackySidebarLifetimeEvents != null
          ? this.hackySidebarLifetimeEvents[name]
          : undefined,
        (x) => x.didBecomeVisible,
      ) != null
        ? __guard__(
            this.hackySidebarLifetimeEvents != null
              ? this.hackySidebarLifetimeEvents[name]
              : undefined,
            (x) => x.didBecomeVisible,
          )
        : function () {};

    const isCurrentTopView = view === this.topSidebarView();
    const isSidebarVisible = this.model.viewState.get('showSidebar');

    if (!isSidebarVisible) {
      $('.board-menu').one('transitionend webkitTransitionEnd', (e) => {
        return didBecomeVisible(view);
      });
    } else if (!isCurrentTopView) {
      callOnce = didBecomeVisible;
    } else {
      didBecomeVisible(view);
    }

    if (showSidebar && !isSidebarVisible) {
      this.model.viewState.setShowSidebar(true);
    }

    if (isCurrentTopView) {
      return;
    }

    const previousViewName = this.topSidebarViewName();
    this.viewStack.push({ name, view, options: viewOptions });
    const direction = animate ? 'is-right-of-frame' : undefined;
    this.renderView({ direction, callOnce, easeIn });

    this.sendDrawerScreenEvent(previousViewName, 'push');

    PopOver.hide();
  }

  popView() {
    if (this.viewStack.length === 1) {
      // This is fine -- the board view will try to call this if you hit
      // escape. There's no reason to let the board view know anything
      // about our view stack, as it's internal, so we just silently ignore
      // such a request.
      return;
    }

    const resetView = __guard__(this.topSidebarViewOptions(), (x) => x.resetTo);
    if (resetView) {
      return this.resetTo(resetView);
    }

    const previousViewName = this.topSidebarViewName();
    this.topSidebarView().remove();
    this.viewStack.pop();
    this.renderView({ animate: 'is-left-of-frame', easeIn: true });

    this.sendDrawerScreenEvent(previousViewName, 'back');

    PopOver.hide();
  }

  resetTo(view, options) {
    if (options == null) {
      options = {};
    }
    let { animate } = options;
    if (animate == null) {
      animate = true;
    }

    const previousViewName = this.topSidebarViewName();
    while (this.viewStack.length !== 1) {
      this.viewStack.pop();
    }

    if (view) {
      this.pushView(view, {}, options);
    }

    this.renderView({ animate: animate ? 'is-left-of-frame' : undefined });

    this.sendDrawerScreenEvent(previousViewName, 'reset');

    PopOver.hide();
  }

  hideSidebar() {
    this.model.viewState.setShowSidebar(false);

    Analytics.sendClickedButtonEvent({
      buttonName: 'boardMenuDrawerCloseButton',
      source: this.getScreenFromViewName(),
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: __guard__(this.model.getOrganization(), (x1) => x1.id),
        },
      },
    });
  }

  getBoardView() {
    return this.boardView;
  }

  handleTemplateMode() {
    const isTemplate = this.model.isTemplate();
    const visitingTemplate = isTemplate && !this.model.owned();
    if (visitingTemplate) {
      // ATB becomes default view for visitors on templates
      this.viewStack = [{ name: 'about', view: this.aboutView }];
      return this.renderView();
    } else if (isTemplate || this.topSidebarViewName() === 'about') {
      // In template mode: Bring them to ATB
      // Not in template mode: Reset ATB to update view title
      this.viewStack = [{ name: 'default', view: this.defaultView }];
      return this.pushView(
        'about',
        {},
        {
          easeIn: false,
          showSidebar: this.model.viewState.get('showSidebar'),
        },
      );
    }
  }

  sendClickedDrawerNavItemEvent(menuName, navItem, attributes) {
    if (attributes == null) {
      attributes = {};
    }

    // Ensure that values are camel cased appropriately
    menuName = menuName[0].toUpperCase() + menuName.slice(1).toLowerCase();
    navItem = navItem[0].toLowerCase() + navItem.slice(1);

    const eventProperties = {
      action: 'clicked',
      actionSubject: 'drawerNavigationItem',
      actionSubjectId: navItem + 'DrawerNavigationItem',
      source: `boardMenuDrawer${menuName}Screen`,
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: __guard__(this.model.getOrganization(), (x) => x.id),
        },
      },
    };

    if (Object.keys(attributes).length) {
      eventProperties.attributes = attributes;
    }

    return Analytics.sendUIEvent(eventProperties);
  }
}

BoardSidebarView.initClass();
module.exports = BoardSidebarView;
