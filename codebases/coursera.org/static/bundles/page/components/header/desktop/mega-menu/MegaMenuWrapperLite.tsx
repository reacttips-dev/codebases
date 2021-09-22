// This component lazy loads in the mega menu content, for pages that rely on mega menu links for SEO, use MegaMenuWrapper
import React from 'react';
import classNames from 'classnames';
import { compose } from 'recompose';

import { isUserRightToLeft } from 'js/lib/language';

import ExploreButtonRedesign from 'bundles/page/components/header/redesign-experiment/ExploreButton';

import withHasPageScrolled from 'bundles/page/utils/withHasPageScrolled';
import withHasPageLoaded from 'bundles/page/utils/withHasPageLoaded';

import { disableScrolling } from 'bundles/browse/utils';
import { MD_SCREEN_BREAKPOINT_PX } from 'bundles/page/components/header/mobile/constants';
import { DEFAULT_MENU_ORIGIN } from 'bundles/megamenu/constants/constants';

import 'css!bundles/page/components/header/desktop/mega-menu/__styles__/MegaMenuWrapper';
import 'css!js/vendor/styl/coursera-ui.v0-1-4'; // eslint-disable-line import/extensions

type PropsFromCaller = {
  // Lazy Loadable component from createLoadableComponent. Expecting either MegaMenu or MegaMenuContent from 'bundles/browse/components/PageHeader'.
  // This allows us to pass in data directly if we have it (MegaMenuContent) or fetch it (MegaMenu).
  LoadableMegaMenu: React.ComponentType<any>;
  renderMenuOnServer?: boolean;
  delayLoadUntilScroll?: boolean;
};

type PropsToComponent = PropsFromCaller & {
  hasPageScrolled?: boolean;
  hasPageLoaded?: boolean;
};

type State = {
  menuIsOpen: boolean;
  menuHasLoaded: boolean;
  anchorElementForDropDown?: HTMLElement | null;
  isUsingKeyboard: boolean;
};

class MegaMenuWrapperLite extends React.Component<PropsToComponent, State> {
  cursorIsOnMenuOrExploreButton: boolean | undefined;

  state: State = {
    menuIsOpen: false,
    // Once menu has been loaded once we don't want to remove it from the DOM (it's hidden via CSS) or it breaks some onClick events in menu
    menuHasLoaded: false,
    anchorElementForDropDown: null,
    // comment TBA
    isUsingKeyboard: false,
  };

  exploreButtonRef: HTMLButtonElement | null = null;

  setAnchorElement = (anchorElementForDropDown: HTMLElement) => {
    this.setState(() => ({ anchorElementForDropDown }));
  };

  setExploreButtonRef = (buttonRef: HTMLButtonElement | null) => {
    this.exploreButtonRef = buttonRef;
  };

  openMenu = () => {
    const menuIsOpen = true;
    this.cursorIsOnMenuOrExploreButton = menuIsOpen;
    disableScrolling(menuIsOpen);
    this.setState(() => ({ menuIsOpen, menuHasLoaded: true }));
  };

  openMenuUsingKeyboard = () => {
    const menuIsOpen = true;
    this.cursorIsOnMenuOrExploreButton = menuIsOpen;
    disableScrolling(menuIsOpen);
    this.setState(() => ({ menuIsOpen, menuHasLoaded: true, isUsingKeyboard: true }));
  };

  closeMenu = () => {
    const menuIsOpen = false;
    this.cursorIsOnMenuOrExploreButton = menuIsOpen;
    setTimeout(() => {
      if (!this.cursorIsOnMenuOrExploreButton) {
        disableScrolling(menuIsOpen);
        this.setState(() => ({ menuIsOpen, isUsingKeyboard: false }));
        this.exploreButtonRef?.focus();
      }
    }, 100);
  };

  render() {
    const { hasPageScrolled, hasPageLoaded, LoadableMegaMenu, renderMenuOnServer, delayLoadUntilScroll } = this.props;
    const { menuIsOpen, anchorElementForDropDown, menuHasLoaded, isUsingKeyboard } = this.state;

    const anchorBoundingRect = anchorElementForDropDown?.getBoundingClientRect();
    let containerStyle: React.CSSProperties | undefined;
    if (anchorBoundingRect) {
      if (isUserRightToLeft()) {
        containerStyle = { right: DEFAULT_MENU_ORIGIN.x };
      } else {
        containerStyle = { left: DEFAULT_MENU_ORIGIN.x };
      }
    }
    const overlayClassNames = classNames('mega-menu-overlay', 'mega-menu-overlay--lazy-loading', {
      'is-active': menuIsOpen,
    });

    // This covers a few conditions that will trigger the mega menu content to start loading.
    // The mega menu shows/hides via css so once we show it once this will always be true (via menuHasLoaded).
    // The other conditions will trigger loading in certain stages of the page life cycle to improve TTI.
    const shouldLoadMegaMenu =
      // Start loading mega menu after initial page load if not waiting for scroll event.
      (hasPageLoaded && window.innerWidth >= MD_SCREEN_BREAKPOINT_PX && !delayLoadUntilScroll) ||
      // Start loading mega menu only after user has scrolled (so doesn't interfere with TTI).
      (hasPageScrolled && delayLoadUntilScroll) ||
      menuIsOpen ||
      menuHasLoaded ||
      // If menu needs to be in SSR (like for front-page).
      (renderMenuOnServer && typeof window === 'undefined');

    return (
      <div
        className={classNames('rc-MegaMenuWrapper rc-MegaMenuWrapperLite', {
          menuIsOpen,
        })}
        data-e2e="megamenu-dropdown"
      >
        <div>
          <ExploreButtonRedesign
            menuIsOpen={menuIsOpen}
            openMenu={this.openMenu}
            openMenuUsingKeyboard={this.openMenuUsingKeyboard}
            closeMenu={this.closeMenu}
            setAnchorElement={this.setAnchorElement}
            setExploreButtonRef={this.setExploreButtonRef}
          />
          {shouldLoadMegaMenu && (
            <div className={overlayClassNames} aria-hidden={!menuIsOpen}>
              <nav
                className="mega-menu-container"
                onMouseEnter={this.openMenu}
                onMouseLeave={this.closeMenu}
                style={containerStyle}
              >
                <LoadableMegaMenu
                  menuIsOpen={menuIsOpen}
                  isUsingKeyboard={isUsingKeyboard}
                  openMenu={this.openMenu}
                  closeMenu={this.closeMenu}
                  anchorElement={anchorElementForDropDown}
                  renderMenuOnServer={renderMenuOnServer}
                  renderContentsOnly
                  showLoadingState
                />
              </nav>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default compose<PropsToComponent, PropsFromCaller>(withHasPageScrolled, withHasPageLoaded)(MegaMenuWrapperLite);
