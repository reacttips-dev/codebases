import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import loadable from '@loadable/component';

import { evExplicitSearch, evNavigationClick, evTopLevelNavigationClick } from 'events/headerFooter';
import { CHECKOUT_URL_RE } from 'common/regex';
import { track } from 'apis/amethyst';
import RewardsTransparency from 'components/common/RewardsTransparency';
import SkipLinks from 'components/common/SkipLinks';
import Link from 'components/hf/HFLink';
import { onEvent } from 'helpers/EventHelpers';
import { closeBranchAppAdBanner } from 'helpers/AppAdvertisement';
import { getSearchInputValue } from 'helpers/HFHelpers';
import { ensureClass, ensureNoClass, pluralize } from 'helpers';
import { termEncoder } from 'helpers/SearchUtils';
import { trackEvent, trackLegacyEvent } from 'helpers/analytics';
import { triggerAssignment } from 'actions/ab';
import {
  checkForHFBreakpoint,
  dismissGlobalBanner,
  fetchRewardsInfoForTopBanner,
  getCartCount,
  getZapposGlobalBannerData,
  handleHFSearchChange,
  handleSearchKeyDown,
  searchByTerm,
  setFederatedLoginModalVisibility,
  setHFSearchSuggestionsActiveIndex,
  setHFSearchTerm,
  toggleMobileHeaderExpand
} from 'actions/headerfooter';
import {
  closeAllNavs,
  handleDocClickForNav,
  handleSubNavClick,
  handleSubNavClose,
  handleTopNavClick,
  handleTopNavCloseClick,
  setNavPositioning
} from 'actions/headerfooterNav';
import { changeCartCount, showCartModal } from 'actions/cart';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import FocusTrap from 'components/common/FocusTrap';
import TopBar from 'components/hf/zappos/TopBar';
import HeaderNav from 'components/hf/zappos/HeaderNav';
import BottomBanner from 'components/hf/zappos/BottomBanner';
import AccountDropdown from 'components/hf/zappos/AccountDropdown';
import SearchSuggestions from 'components/hf/SearchSuggestions';
import marketplace from 'cfg/marketplace.json';
import konami from 'helpers/konami';
import batmanBounce from 'helpers/batmanBounce';
import { redirectTo, redirectToAuthenticationFor } from 'actions/redirect';
import { fetchIsInfluencer } from 'actions/influencer/influencer';

import css from 'styles/containers/hf/zappos/header.scss';

const FederatedLoginModal = loadable(() => import('components/account/FederatedLoginModal'));
FederatedLoginModal.displayName = 'FederatedLoginModal';

export class Header extends Component {
  static displayName = 'Header';

  static defaultProps = {
    closeBranchAppAdBanner
  };

  constructor(props) {
    super(props);
    this.onResize = debounce(this.onResize.bind(this), 500);
    this.searchInputRef = createRef();
    this.firstNavLinkRef = createRef();
  }

  componentDidMount() {
    const { isRemote, isCustomer, changeCartCount, konamiEasterEgg = konami, checkForHFBreakpoint, getZapposGlobalBannerData, fetchIsInfluencer } = this.props;
    const { features: { showAccountRewards } } = marketplace;

    const { getCartCount, handleDocClickForNav, fetchRewardsInfoForTopBanner } = this.props;

    // Set which viewport we're in the state
    checkForHFBreakpoint();
    // Get cart count
    getCartCount();
    // Get global banner
    getZapposGlobalBannerData();
    // Handle clicks on the body to close any open dropdown
    onEvent(window, 'click', handleDocClickForNav, null, this);

    // Handle key events for navigating search suggestions
    onEvent(window, 'keydown', this.handleKeyDown, null, this);

    // Handle resizing for knowing if we're at a mobile breakpoint or not
    onEvent(window, 'resize', this.onResize, null, this);
    onEvent(window, 'load', this.onResize, null, this);
    this.onResize();

    // See if we need the small lilz version of the header
    this.checkForSmallerHeader();

    // Add listener for cartcount changes when remote
    if (isRemote) {
      onEvent(document, 'cart_item_count_change', ({ detail } = {}) => {
        if (typeof detail === 'number') {
          changeCartCount(detail);
        }
      }, null, this);
    }

    if (showAccountRewards) {
      fetchRewardsInfoForTopBanner();
    }

    konamiEasterEgg(batmanBounce, 'batman');

    if (isCustomer) {
      fetchIsInfluencer();
    }
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname: prevPathname } } = prevProps;
    const { openedNav, isMobileHeaderExpanded, location: { pathname }, cartCount, getCartCount, isMobile, toggleMobileHeaderExpand } = this.props;
    const hasLocationChanged = prevPathname !== pathname;

    // Add body class for when dropdown is open
    if (!isMobile && openedNav) {
      ensureClass(document.body, 'inactive');
      return;
    }
    if (isMobileHeaderExpanded || this.isOpen('headerMyAccountDropdownToggle')) {
      ensureClass(document.body, 'inactive');
      this.focusFirstNavLink();
    } else {
      ensureNoClass(document.body, 'inactive');
    }

    // Close mobile menu when we go from mobile to desktop
    if (isMobileHeaderExpanded && !isMobile) {
      toggleMobileHeaderExpand();
    }

    if (hasLocationChanged) {
      this.checkForSmallerHeader(pathname);
    }

    if (hasLocationChanged && typeof cartCount !== 'number') {
      getCartCount();
    }
  }

  focusFirstNavLink = () => {
    this.firstNavLinkRef?.current?.focus();
  };

  headerTopNavClickCleanup = () => {
    const { closeBranchAppAdBanner } = this.props;
    // Close branch.io banner
    closeBranchAppAdBanner();
    // Recalculate nav positioning as the app ads muck things up a bit.
    // Need a timeout cuz closing the banner takes a few milliseconds
    setTimeout(this.onResize, 200);
  };

  handleTopNavToggle = e => {
    this.headerTopNavClickCleanup();
    this.props.handleTopNavClick(e);
  };

  handleAccountDropdownToggle = e => {
    const { handleTopNavClick, toggleMobileHeaderExpand, isMobileHeaderExpanded } = this.props;
    // Close the expanded header if you click the account dropdown
    if (isMobileHeaderExpanded) {
      toggleMobileHeaderExpand();
    }
    this.headerTopNavClickCleanup();
    handleTopNavClick(e);
  };

  handleKeyDown = e => {
    const { isMobileHeaderExpanded, handleSearchKeyDown, toggleMobileHeaderExpand } = this.props;
    const isEscape = e.key === 'Escape';
    if (isEscape && isMobileHeaderExpanded) {
      toggleMobileHeaderExpand();
    }
    handleSearchKeyDown(e);
    this.handleNavKeyDown(e);
  };

  handleMobileNavToggle = () => {
    const { toggleMobileHeaderExpand } = this.props;
    toggleMobileHeaderExpand();
    this.headerTopNavClickCleanup();
  };

  handleNavKeyDown = e => {
    const { keyCode } = e;
    const { openedNav, closeAllNavs } = this.props;
    if (openedNav && keyCode === 27) {
      closeAllNavs();
    }
  };

  handleCartClick = e => {
    const { showCartModal, isRemote, isMobile } = this.props;
    const canShowCartModal = !isMobile && window.location.pathname !== '/cart';

    if (canShowCartModal && !isRemote) {
      e.preventDefault();
      showCartModal(true);
    }

    trackEvent('TE_HEADER_CART');
    trackLegacyEvent('Global', 'Header', 'Cart');
    track(() => ([
      evTopLevelNavigationClick, {
        valueClicked: 'Header Cart'
      }
    ]));
  };

  checkForSmallerHeader = (pathname = this.props.location.pathname) => {
    const showMiniHeader = pathname.match(CHECKOUT_URL_RE);
    if (showMiniHeader) {
      document.documentElement.classList.add('lilz');
    } else {
      document.documentElement.classList.remove('lilz');
    }
  };

  onResize() {
    const { checkForHFBreakpoint, setNavPositioning } = this.props;
    checkForHFBreakpoint();
    setNavPositioning();
  }

  isOpen = id => {
    const { openedNav } = this.props;
    return openedNav === id;
  };

  isSubNavOpen = id => {
    const { openedSubNav } = this.props;
    return openedSubNav === id;
  };

  makeLogo = () => {
    const { testId } = this.context;
    const { content } = this.props;
    const data = content?.Header?.slotData?.logo?.images?.[0];
    return (data &&
      <Link
        data-test-id={testId('headerLogo')}
        className="hfImagesComponent"
        to={data.href || '/'}
        onClick={() => {
          trackLegacyEvent('Global-Header-zapposheader', 'Promos', 'header-logo');
          trackEvent('TE_HEADER_LOGO', data.gae || data.alt);
          track(() => ([
            evTopLevelNavigationClick, {
              valueClicked: 'Header Logo'
            }
          ]));
        }}>
        <img
          src={data.src}
          alt={data.alt}
          height={data.height}
          width={data.width}/>
      </Link>
    );
  };

  handleOpenFederatedLogin = () => {
    const { location, setFederatedLoginModalVisibility } = this.props;
    const { pathname, search } = location;
    const returnTo = encodeURIComponent(`${pathname}${search}`);
    setFederatedLoginModalVisibility(true, { returnTo });
  };

  handleSearchSubmit = e => {
    const {
      props: {
        redirectTo,
        searchByTerm, suggestionIndex, suggestions, setHFSearchTerm, isMobileHeaderExpanded
      }, context: { router }, handleMobileNavToggle
    } = this;
    const { target } = e;
    e.preventDefault();
    const term = target['term'].value;
    const inputValueWithSuggestions = getSearchInputValue(term, suggestionIndex, suggestions);
    const facet = target.dataset.searchCategory;
    const { searchId } = target.dataset;

    if (isMobileHeaderExpanded) {
      handleMobileNavToggle();
    }

    if (facet === 'kids') {
      // Nested in nav header search for kids
      const kidsTerm = `kids ${term}`;
      searchByTerm({ term: kidsTerm }, router);
      trackEvent('TE_HEADER_SEARCH_NAV', `${searchId}:${term}`);
      trackEvent('TE_HEADER_SEARCHBAR_SUBMIT', `${searchId}:${term}`);
      track(() => ([
        evNavigationClick, {
          parent: searchId,
          searchOccurred: true,
          explicitSearchTerm: term
        }
      ]));
    } else if (facet) {
      // Nested in nav header search (Women/Men)
      searchByTerm({ term, facet }, router);
      trackEvent('TE_HEADER_SEARCH_NAV', `${searchId}:${term}`);
      trackEvent('TE_HEADER_SEARCHBAR_SUBMIT', `${searchId}:${term}`);
      track(() => ([
        evNavigationClick, {
          parent: searchId,
          searchOccurred: true,
          explicitSearchTerm: term
        }
      ]));
    } else if (typeof suggestionIndex === 'number' && suggestions?.[suggestionIndex]) {
      // Search suggestion submit
      const item = suggestions[suggestionIndex];
      if (item?.searchUrl) {
        redirectTo(item.searchUrl);
      } else {
        const searchObj = { term: item.suggestion };
        if (item.categories?.length) {
        // For when we're using searchsuggest with a category
          searchObj.facet = `zc2/${termEncoder(item.categories[0])}`;
        }
        searchByTerm(searchObj, router);
        trackEvent('TE_HEADER_SEARCH_SUGGESTION', inputValueWithSuggestions);
        trackEvent('TE_HEADER_SEARCHBAR_SUBMIT', inputValueWithSuggestions);
        setHFSearchTerm(item.suggestion);
        track(() => ([evExplicitSearch, { term: searchObj.term, autosuggestionShown: true, autosuggestionClicked: true }]));
      }
    } else {
      // Normal header search
      searchByTerm({ term }, router);
      trackEvent('TE_HEADER_SEARCHBAR_SUBMIT', term);
      track(() => ([evExplicitSearch, { term, autosuggestionShown: !!suggestions?.length, autosuggestionClicked: false }]));
    }
  };

  handleCloseFederatedLogin = () => {
    const { federatedLoginModal: { redirectOnClose }, setFederatedLoginModalVisibility, redirectTo } = this.props;
    setFederatedLoginModalVisibility(false);
    !!redirectOnClose && redirectTo(redirectOnClose);
  };

  makeSkipLink = () => {
    const links = [{ id: 'main', value: 'Skip to main content' }];
    return (<SkipLinks links={links}/>);
  };

  getPlaceholder = () => {
    const { holmes: { firstName }, isMobile } = this.props;
    if (isMobile) {
      return 'Shoes, clothing, etc.';
    }
    if (firstName) {
      return `${decodeURIComponent(firstName)}, search for shoes, clothes, etc`;
    }
    return 'Search for shoes, clothes, etc.';
  };

  handleSearchFocus = e => {
    const { isMobileHeaderExpanded, handleHFSearchChange } = this.props;
    const { handleMobileNavToggle } = this;

    if (isMobileHeaderExpanded) {
      handleMobileNavToggle();
    } else {
      handleHFSearchChange(e);
    }
  };

  handleSearchClick = () => {
    this.searchInputRef.current.focus();// When the search input is clicked from the mobile expanded header, ensure it gets focused
  };

  render() {
    const { testId } = this.context;
    const {
      cartCount,
      content,
      customerServiceNumber,
      customerServiceDropdown,
      desktopStyles,
      dismissGlobalBanner,
      federatedLoginModal,
      globalBanner,
      holmes,
      handleHFSearchChange,
      handleSubNavClick,
      handleSubNavClose,
      handleTopNavCloseClick,
      hydraHFDynamicBanner,
      isCustomer,
      isMobile,
      isMobileHeaderExpanded,
      isMockApi,
      isRemote,
      isTopBannerShowing,
      isVip,
      killswitch,
      location,
      mobileStyles,
      navsThatHaveBeenOpened,
      openedSubNav,
      redirectToAuthenticationFor,
      rewards,
      savedSuggestions,
      suggestions,
      suggestionIndex,
      tbContent,
      term,
      triggerAssignment,
      isInfluencer
    } = this.props;
    const { isOpen, isSubNavOpen, handleTopNavToggle } = this;
    const { showCheckoutNonStandardShipOptionLabels } = killswitch;
    const hasSuggestions = !!(suggestions && suggestions.length);
    const { isFederatedLoginModalShowing, returnTo } = federatedLoginModal;
    const { Global: { slotData: { federatedLoginModalCopy } = {} } = {} } = content;

    return (
      <header role="banner" className={css.zapposHeaderContainer} data-header-container>
        {/*
          Show hidden fallback msg so we can know we're using the fallback content data and something
          is definitely probably very wrong.
         */}
        {content?.fallback && <p className={css.hidden}>***Using Fallback Header***</p>}
        {this.makeSkipLink()}
        <TopBar
          handleTopNavClick={handleTopNavToggle}
          handleTopNavCloseClick={handleTopNavCloseClick}
          isOpen={isOpen}
          holmes={holmes}
          isVip={isVip}
          isTopBannerShowing={isTopBannerShowing}
          content={content}
          tbContent={tbContent}
          Link={Link}
          hydraHFDynamicBanner={hydraHFDynamicBanner}
          killswitch={killswitch}
          customerServiceNumber={customerServiceNumber}
          customerServiceDropdown={customerServiceDropdown}
        />
        <FocusTrap active={isMobileHeaderExpanded || isOpen('headerMyAccountDropdownToggle')}>
          {focusRef => (
            <div className={css.zapposHeader} ref={focusRef}>
              <div className="headerContainer">
                <button
                  type="button"
                  data-test-id={testId('headerHamberderMenu')}
                  className={cn(css.hamberder, { [css.close]: isMobileHeaderExpanded })}
                  onClick={this.handleMobileNavToggle}
                  aria-label={`${isMobileHeaderExpanded ? 'Close' : 'Open'} Navigation`}
                >
                </button>
                {this.makeLogo()}
                <div className={cn(css.searchContainer)}>
                  <form
                    data-test-id={testId('headerSearchForm')}
                    onSubmit={this.handleSearchSubmit}
                    method="GET"
                    action="/search"
                    className={css.searchbar}
                    data-search-container
                    role="search">
                    {/*
                  A lot of conflicting info around comboboxes in regards to a11y.
                  Might be worth using a library to handle it down the line because
                  I trust random libraries on npm more than I do myself.
                */}
                    <input // eslint-disable-line jsx-a11y/no-access-key
                      type="search"
                      name="term"
                      id="searchAll"
                      onFocus={this.handleSearchFocus}
                      onChange={handleHFSearchChange}
                      onClick={this.handleSearchClick}
                      role="combobox"
                      aria-controls={hasSuggestions ? 'hfSearchSuggest' : null}
                      aria-owns={hasSuggestions ? 'hfSearchSuggest' : null}
                      aria-autocomplete="list"
                      aria-haspopup="listbox"
                      aria-expanded={hasSuggestions}
                      value={getSearchInputValue(term, suggestionIndex, suggestions, savedSuggestions)}
                      placeholder={this.getPlaceholder()}
                      accessKey="s"
                      ref={this.searchInputRef}
                      autoComplete="off"/>
                    <label htmlFor="searchAll">{this.getPlaceholder()}</label>
                    <SearchSuggestions
                      suggestions={suggestions}
                      savedSuggestions={savedSuggestions}
                      suggestionIndex={suggestionIndex}
                      isCustomer={isCustomer}
                      redirectToAuthenticationFor={redirectToAuthenticationFor}
                    />
                    <button type="submit">Search</button>
                  </form>
                </div>
                <Link
                  to="/cart"
                  data-test-id={testId('headerCart')}
                  onClick={this.handleCartClick}
                  aria-label={`Go to my cart. ${cartCount ? `${cartCount} ${pluralize('item', cartCount)} in cart.` : 'Cart empty.'}`}
                  className={cn(css.cartBtn, { [css.fullCart]: cartCount, [css.cartActive]: location.pathname === '/cart' })}>
                  {cartCount ?
                    `${cartCount} ${pluralize('Item', cartCount)} in Cart` :
                    'My Cart'}
                  <span aria-hidden>{cartCount}</span>
                </Link>
                <nav
                  className={cn('hfHeaderNav', { [css.mobileNavHidden]: !isMobileHeaderExpanded }) }
                  data-test-id={testId('headerNav')}
                  data-headernav>{/* Linter says role="navigation" is redundant so leaving that out*/}
                  <ul>
                    <HeaderNav
                      handleSearchSubmit={this.handleSearchSubmit}
                      desktopStyles={desktopStyles}
                      mobileStyles={mobileStyles}
                      isOpen={isOpen}
                      isSubNavOpen={isSubNavOpen}
                      isMobile={isMobile}
                      handleTopNavClick={handleTopNavToggle}
                      handleTopNavCloseClick={handleTopNavCloseClick}
                      handleSubNavClick={handleSubNavClick}
                      handleSubNavClose={handleSubNavClose}
                      openedSubNav={openedSubNav}
                      navsThatHaveBeenOpened={navsThatHaveBeenOpened}
                      topLevelNavs={content?.Header?.slotData?.navmenu?.navMenu}
                      subNavs={content?.HeaderMenues}
                      isRecognized={isCustomer}
                      triggerAssignment={triggerAssignment}
                      firstNavLinkRef={this.firstNavLinkRef}/>
                  </ul>
                </nav>
                <div className={css.accountDropdowns}>
                  <AccountDropdown
                    location={location}
                    isMobile={isMobile}
                    handleTopNavClick={this.handleAccountDropdownToggle}
                    handleTopNavCloseClick={handleTopNavCloseClick}
                    openFederatedLoginModal={this.handleOpenFederatedLogin}
                    holmes={holmes}
                    isExpanded={isOpen('headerMyAccountDropdownToggle')}
                    isRemote={isRemote}
                    rewards={rewards}
                    triggerAssignment={triggerAssignment}
                    areApisMocked={isMockApi}
                    isInfluencer={isInfluencer}/>
                </div>
              </div>
            </div>
          )}
        </FocusTrap>
        <BottomBanner globalBanner={globalBanner} dismissGlobalBanner={dismissGlobalBanner}/>
        <RewardsTransparency />
        {isFederatedLoginModalShowing && isRemote &&
          <FederatedLoginModal
            copy={federatedLoginModalCopy}
            handleClose={this.handleCloseFederatedLogin}
            showCheckoutNonStandardShipOptionLabels={showCheckoutNonStandardShipOptionLabels}
            isOpen={isFederatedLoginModalShowing}
            returnTo={returnTo}
          />
        }
      </header>
    );
  }
}

Header.contextTypes = {
  router: PropTypes.object, // Not passed when we're a remote HF
  testId: PropTypes.func
};

function mapStateToProps(state) {
  const {
    cart: { cartCount },
    cookies,
    headerFooter: {
      content,
      desktopStyles,
      federatedLoginModal,
      globalBanner,
      isMobileHeaderExpanded,
      isMobile,
      isRemote,
      isTopBannerShowing,
      mobileStyles,
      openedNav,
      openedSubNav,
      navsThatHaveBeenOpened,
      savedSuggestions,
      suggestions,
      suggestionIndex,
      tbContent,
      term
    },
    killswitch,
    holmes,
    rewards,
    environmentConfig:{
      isMockApi
    },
    routing: { locationBeforeTransitions },
    influencer: { isInfluencer }
  } = state;
  return {
    cartCount,
    content,
    customerServiceNumber: content.Header.slotData['clthours'],
    customerServiceDropdown: content.Header.slotData['customer-service-menu'],
    desktopStyles,
    federatedLoginModal,
    globalBanner,
    holmes,
    isMobileHeaderExpanded,
    isMockApi,
    isCustomer: !!cookies['x-main'],
    isMobile,
    isRemote,
    isTopBannerShowing,
    isVip: rewards?.rewardsInfo?.isVipOrConsented,
    killswitch,
    location: locationBeforeTransitions,
    mobileStyles,
    navsThatHaveBeenOpened,
    openedNav,
    openedSubNav,
    rewards,
    savedSuggestions,
    suggestionIndex,
    suggestions,
    tbContent,
    term,
    isInfluencer
  };
}

const HeaderConnected = connect(mapStateToProps, {
  changeCartCount,
  checkForHFBreakpoint,
  closeAllNavs,
  dismissGlobalBanner,
  fetchRewardsInfoForTopBanner,
  getCartCount,
  getZapposGlobalBannerData,
  handleDocClickForNav,
  handleHFSearchChange,
  handleSearchKeyDown,
  handleSubNavClick,
  handleSubNavClose,
  handleTopNavClick,
  handleTopNavCloseClick,
  redirectTo,
  redirectToAuthenticationFor,
  searchByTerm,
  setHFSearchTerm,
  setHFSearchSuggestionsActiveIndex,
  setFederatedLoginModalVisibility,
  setNavPositioning,
  showCartModal,
  toggleMobileHeaderExpand,
  triggerAssignment,
  fetchIsInfluencer
})(Header);

const HeaderConnectedWithErrorBoundary = withErrorBoundary('Header', HeaderConnected);

export default HeaderConnectedWithErrorBoundary;
