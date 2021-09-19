/* eslint-disable css-modules/no-unused-class */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';
import sanitizer from 'sanitizer';
import { Link } from 'react-router';
import { deepEqual } from 'fast-equals';

import { BEST_FOR_YOU_FACETFIELD } from 'constants/appConstants';
import {
  SAVI_COOKIE,
  SAVI_SIZE_COOKIE,
  SEARCH_BEST_FOR_YOU_COOKIE
} from 'constants/cookies';
import {
  HYDRA_AUTO_FACET_SUGGESTION,
  HYDRA_COLOR_SWATCHES,
  HYDRA_FILTER_KEYWORD,
  HYDRA_IMAGES_BY_ZYCADA,
  HYDRA_MICROSOFT_SPONSORED_PRODUCTS,
  HYDRA_SEARCH_QUICK_SHOP
} from 'constants/hydraTests';
import { evSortSearchClick } from 'events/search';
import marketplace from 'cfg/marketplace.json';
// constants & regex
import {
  SLASH_SEARCH_FILTERS_RE,
  ZSO_URL_WITH_FILTERS_RE
} from 'common/regex';
// actions
import { addAdToQueue } from 'actions/ads';
import { fetchProductDetail } from 'actions/productDetail';
import { deleteSavedFilters, fetchFromSearch, fetchFromZso, saveFilters } from 'actions/fancyUrls';
import { clearAutoComplete } from 'actions/autoComplete';
import { setOosMessaging, trackMicrosoftAdImpressions } from 'actions/products';
import { redirectToAuthenticationFor, redirectWithAppRoot } from 'actions/redirect';
import { removeFromStoredCookies, sessionExpiration, setAndStoreCookie } from 'actions/session';
import { getHeartCounts, getHearts, heartProduct, toggleHeartingLoginModal, unHeartProduct } from 'actions/hearts';
import { getAssignmentGroup, triggerAssignment } from 'actions/ab';
import { clearInlineRecos, fetchSearchInlineRecos, searchFeedbackClick, setUrlUpdated, toggleFacetsContainer, toggleSavedFilters, updateBestForYou, updateSort } from 'actions/search';
import { removePersonalizedSize, resetFacetGroup, setFacetChosen, toggleFacetGroupShowMore, togglePersonalizedSize, toggleSelectedFacet, toggleSelectedFacetGroup, toggleSizingFacetGroup } from 'actions/facets';
import { pageTypeChange } from 'actions/common';
import { setHFSearchTerm } from 'actions/headerfooter';
import { fetchSymphonySearchComponents } from 'store/ducks/search/actions';
import { fetchLandingPageInfo } from 'actions/landing/landingPageInfo.js';
// resources
import { track } from 'apis/amethyst';
import { evSearchCrossSiteRecoImpression } from 'events/recommendations';
import { ensureClass, removeCookie, sanitizeForEvent, setCookie } from 'helpers';
import {
  SRP_NARROW_TOP,
  SRP_WIDE_MID,
  SRP_WIDE_TOP
} from 'helpers/apsAdvertisement';
import { isDesktop, isNotBot } from 'helpers/ClientUtils';
import { onEvent } from 'helpers/EventHelpers';
import { getHeartProps } from 'helpers/HeartUtils';
import { trackEvent, trackLegacyEvent } from 'helpers/analytics';
import { buildSearchTermEventPayload, formatProductClickEvent, formatSavedFilters, sortStringToObject } from 'helpers/SearchUtils';
// containers/components
import HtmlToReact from 'components/common/HtmlToReact';
import JanusPixel from 'components/common/JanusPixel';
import GamSlot from 'components/common/GamSlot';
import DesktopSearchHeader from 'components/search/DesktopSearchHeader';
import CompactSingleSelects from 'components/search/CompactSingleSelects';
import Facets from 'components/search/Facets';
import FacetActions from 'components/search/FacetActions';
import FacetMenu from 'components/search/FacetMenu';
import Pagination from 'components/common/Pagination';
import TopBannerAd from 'components/search/TopBannerAd';
import SearchLogic from 'containers/SearchLogic';
import Products from 'components/search/Products';
import SiteAwareMetadata from 'components/SiteAwareMetadata';
import SkipLinks from 'components/common/SkipLinks';
import { MoreInfo } from 'components/icons';
import Tooltip from 'components/common/Tooltip';
import FocusTrap from 'components/common/FocusTrap';

import css from 'styles/containers/search.scss';

// marketplace
const {
  cookieDomain,
  features: {
    showRatings
  },
  hasHearting,
  search: {
    autoCompleteMinValues,
    facetHeader,
    hasFacetListClear,
    mobileCloseFiltersText,
    mobileFacetHeader,
    mobileRemoveSelectionsText,
    msaMelodyImageParams,
    showRatingStars,
    showSeoText,
    sortOptions
  }
} = marketplace;

export class StandardSearch extends Component {
  static fetchDataOnServer(store, location, params, fetchParams = {}) {
    const state = store.getState();
    const { cookies } = state;

    if (!cookies?.[SAVI_COOKIE]) {
      store.dispatch(toggleSavedFilters());
    }

    return SearchLogic.fetchDataOnServer(store, location, params, fetchParams);
  }

  static afterFetchDataOnServer(store) {
    return SearchLogic.afterFetchDataOnServer(store);
  }

  static beforeFetchDataOnServer({ dispatch, getState }) {
    const state = getState();
    const { url: { userAgent } } = state;
    dispatch(triggerAssignment(HYDRA_FILTER_KEYWORD));
    dispatch(triggerAssignment(HYDRA_SEARCH_QUICK_SHOP));
    dispatch(triggerAssignment(HYDRA_AUTO_FACET_SUGGESTION));

    if (isNotBot(userAgent)) {
      dispatch(triggerAssignment(HYDRA_IMAGES_BY_ZYCADA));
    }
  }

  state = {
    hasFilters: false,
    locationPathname: null,
    stickyHeaderTop: 0,
    seoCopyCollapsed: true,
    feedbackSubmitted: false
  };

  componentDidMount() {
    const { cookieDomain, saveFilters, saviSizeCookie, isShowingThirdPartyAds, userAgent, isCustomer, products: { trustedRetailers } } = this.props;
    triggerAssignment(HYDRA_FILTER_KEYWORD);
    triggerAssignment(HYDRA_SEARCH_QUICK_SHOP);
    triggerAssignment(HYDRA_AUTO_FACET_SUGGESTION);

    if (isNotBot(userAgent)) {
      triggerAssignment(HYDRA_IMAGES_BY_ZYCADA);
    }

    if (saviSizeCookie && isCustomer) {
      removeCookie(SAVI_SIZE_COOKIE, cookieDomain);
      saveFilters(null, true);
    }

    if (isShowingThirdPartyAds) {
      this.includeApsAds();
    }

    if (trustedRetailers.length) {
      this.sendTrustedRetailersImpression(trustedRetailers);
    }

    // resets facet to account for menu change at m-tabletPortrait
    this.resizeListener = window.matchMedia('(max-width: 768px)');
    this.resizeListener.addListener(this.resetFacet);
  }

  componentDidUpdate(prevProps) {
    // Mobile sticky header
    ensureClass(document.body, 'fixedSearchMenu');

    // If search term changes at all, reset the feedback form for another submission
    const { filters: { originalTerm, savedsizes }, location, products: { trustedRetailers } } = this.props;
    const { filters: { originalTerm: prevOriginalTerm }, location: oldLocation, products: { oldTrustedRetailers } } = prevProps;
    const locationsDiffer = !deepEqual(location, oldLocation);

    if (originalTerm !== prevOriginalTerm) {
      this.setState({ feedbackSubmitted: false });
    }

    if (this.state.locationPathname !== location.pathname) {
      this.setState({
        locationPathname: location.pathname,
        hasFilters: ZSO_URL_WITH_FILTERS_RE.test(location.pathname) || SLASH_SEARCH_FILTERS_RE.test(location.pathname)
      });
    }

    if (locationsDiffer) {
      if (Object.values(savedsizes.filters).length && savedsizes.id && !this.sentSavedSizeImpression) {
        trackEvent('TE_SAVED_FILTERS_VISIBLE');
        this.sentSavedSizeImpression = true;
      } else if (this.sentSavedSizeImpression) {
        this.sentSavedSizeImpression = false;
      }
    }

    if (trustedRetailers.length && !deepEqual(trustedRetailers), oldTrustedRetailers) {
      this.sendTrustedRetailersImpression(trustedRetailers);
    }
  }

  componentWillUnmount() {
    this.resizeListener.removeListener(this.resetFacet);
  }

  sentSavedSizeImpression = false;

  includeApsAds = () => {
    const { addAdToQueue } = this.props;
    const slots = [
      { name: SRP_WIDE_TOP },
      { name: SRP_WIDE_MID },
      { name: SRP_NARROW_TOP }
    ];

    addAdToQueue(slots);
  };

  sendTrustedRetailersImpression = trustedRetailers => {
    track(() => ([evSearchCrossSiteRecoImpression, trustedRetailers]));
  };

  onPagination = page => {
    const { trackEvent } = this.props;
    trackEvent('TE_SEARCH_PAGINATION', `${page}`);
  };

  makePagination = () => {
    const { filters } = this.props;
    return filters.pageCount > 1 && <Pagination
      firstPageIndex={0}
      page={filters.page}
      filters={filters}
      compact={false}
      smallerButtons={true}
      totalPages={filters.pageCount}
      onPagination={this.onPagination}
      useSearchPageStyles={true} />;
  };

  searchScrollTop = () => {
    if (window) {
      const originalTop = window.scrollY;
      const step = originalTop / 10;
      setTimeout(() => {
        window.scrollTo(0, originalTop - step);
        if (window.scrollY > 0) {
          this.searchScrollTop();
        }
      }, 10);
    }
    document.querySelector('.searchPage article a').focus();
  };

  makeScrollButton = () => {
    const { testId } = this.context;
    return <button
      type="button"
      ref={el => this.backToTop = el}
      className={css.backToTop}
      onClick={this.searchScrollTop}
      aria-label="scroll to top"
      data-test-id={testId('scrollToTop')} />;
  };

  makeSearchFooter = () => (
    <div className={css.searchFooterWrapper} id="searchPagination">
      {this.makePersonalizedSortToggle('bestForYouMobileMessaging', true)}
      {this.makePagination()}
      {this.makeSeoCopyBottomPosition()}
    </div>
  );

  makeScrollhandler = () => {
    const { backToTop } = this;
    if (window && document) {
      onEvent(document, 'scroll', () => {
        const scrollTop = window.scrollY;
        if (scrollTop > 200 && !backToTop.classList.contains(css.visible)) {
          backToTop.classList.add(css.visible);
        } else if (scrollTop < 200 && backToTop.classList.contains(css.visible)) {
          backToTop.classList.remove(css.visible);
        }
      }, null, this);
    }
  };

  onSortSelected = ({ target }) => {
    const { filters, trackEvent, cookieDomain, trackLegacyEvent, updateSort, updateBestForYou } = this.props;
    if (target.value === 'bestForYou-desc') {
      setCookie(SEARCH_BEST_FOR_YOU_COOKIE, '', { domain: cookieDomain });
      updateBestForYou(true);
    } else {
      updateBestForYou(false);
    }
    updateSort(sortStringToObject(target.value));
    const payload = buildSearchTermEventPayload(filters.term);
    const { label } = (target[target.selectedIndex] || target).dataset;

    const sortByEventInfo = sanitizeForEvent(label);
    trackLegacyEvent('Search-Results-Page', `Sort-By-${sortByEventInfo}`, payload);
    trackEvent('TE_SORTMENU_SELECTSORT', sortByEventInfo);
    track(() => ([
      evSortSearchClick, {
        sortType: label
      }
    ]));
  };

  runToggleFacetsContainer = opening => {
    const { toggleFacetsContainer } = this.props;
    toggleFacetsContainer(opening);
  };

  onApplyFilters = () => {
    const { trackEvent } = this.props;
    this.resetFacet();
    trackEvent('TE_SEARCH_APPLYFILTERS');
  };

  makeAccessibilityAnchors = hasProductResults => {
    const { filters: { selected: { singleSelects, multiSelects } }, toggleFacetsContainer } = this.props;
    if (hasProductResults()) {
      const links = [
        {
          id: 'searchPage',
          value: 'Skip to search results'
        },
        {
          id: 'searchFilters',
          value: 'Skip to filters',
          callback: () => !isDesktop() && toggleFacetsContainer(true)
        },
        {
          id: 'searchSort',
          value: 'Skip to sort'
        },
        {
          id: 'searchSelectedFilters',
          value: !!Object.keys(singleSelects).length || !!Object.keys(multiSelects).length ? 'Skip to selected filters' : null
        }
      ];
      return <SkipLinks links={links} />;
    }
    return null;
  };

  handlePersonalizedBestForYou = () => {
    const { updateBestForYou, cookieDomain, filters, updateSort } = this.props;
    const isNewBestForYouStateActive = !filters.bestForYou || !filters.sort.bestForYou;
    updateBestForYou(isNewBestForYouStateActive);
    updateSort(isNewBestForYouStateActive ? { bestForYou: 'desc' } : { relevance: 'desc' });
    setCookie(SEARCH_BEST_FOR_YOU_COOKIE, isNewBestForYouStateActive ? '' : 'active', { domain: cookieDomain });
    trackEvent('TE_PERSONALIZED_SEARCH_BFU_BUTTON', `${isNewBestForYouStateActive}`);
  };

  onToggleFacetsContainer = () => {
    const { isFacetsVisible, trackEvent } = this.props;
    const opening = !isFacetsVisible;
    this.runToggleFacetsContainer(opening);

    if (opening) {
      trackEvent('TE_SEARCH_OPENFILTERS');
    } else {
      trackEvent('TE_SEARCH_CLOSEFILTERS');
    }
  };

  resetFacet = () => {
    // toggles facets when screen hits tablet portrait
    this.runToggleFacetsContainer(false);
  };

  makeSeoCopyBottomPosition() {
    return this.makeSeoCopy(css.copyBottom);
  }

  makeSeoCopy(positionCSS) {
    const { filters: { seoData } } = this.props;

    const copy = seoData?.copy;
    if (copy) {

      return (
        <div className={cn(css.seoWrapper, positionCSS)}>
          <HtmlToReact>
            {copy}
          </HtmlToReact>
        </div>
      );
    }
    return '';
  }

  toggleSeoCopy = () => {
    this.setState({ seoCopyCollapsed: !this.state.seoCopyCollapsed });
  };

  makeSeoText = () => {
    const { filters: { seoText, termLander, originalTerm }, showSeoText } = this.props;
    const { testId } = this.context;

    if (showSeoText && (seoText || (termLander && originalTerm))) {
      return (
        <div className={css.seoWrapper}>
          {seoText && <div className={css.seoText}>
            <p dangerouslySetInnerHTML={{ __html: sanitizer.sanitize(seoText) }} />
          </div>}
          {termLander && originalTerm && <p data-test-id={testId('termLanderMessage')}>We adjusted your search results to be more relevant. <Link to={`/search/null/orig/${originalTerm}`}>Not what you were looking for? Click here.</Link></p>}
        </div>
      );
    }
    return '';
  };

  onProductClicked = (productPosition, productId, styleId) => {
    const { filters, trackEvent, trackLegacyEvent } = this.props;
    const searchTerm = buildSearchTermEventPayload(filters.term);
    trackEvent('TE_SEARCH_CLICKPRODUCT', `${productId}:${styleId}:${productPosition}:${filters.page}`);
    // Duplicate event is expected #8854
    trackEvent('TE_SEARCH_CLICKTHROUGHPRODUCT', `${productId}:${styleId}:${productPosition}:${filters.page}`);
    trackLegacyEvent('Search-Results-Click-Through', formatProductClickEvent(filters.page, productPosition), searchTerm);
    trackLegacyEvent('Search-Results-Page', 'Results', productId);
  };

  makeStickyHeader = () => {
    const { state: { stickyHeaderTop } } = this;
    const {
      filters,
      removePersonalizedSize,
      hydraAutoFacetSuggestion
    } = this.props;
    const { router } = this.context;
    const stickyHeaderStyles = { top: `${stickyHeaderTop}px` };

    return (
      <div ref={e => this.stickyHeader = e} className={css.stickyHeader} style={stickyHeaderStyles}>
        <div className={cn(css.desktopSearchMenu, css.pillsDesktopSearchMenu)}>
          <CompactSingleSelects
          // The key below ensures this component re-renders each time a page is navigated,
          // Forcing pill state in search to reset to the left
            key={router.location.pathname}
            filters={filters}
            handlePillClick={this.handlePillClick}
            removePersonalizedSize={removePersonalizedSize}
            hasAutoScroll={true}
            hydraAutoFacetSuggestion={hydraAutoFacetSuggestion}
          />
        </div>
      </div>
    );
  };

  makeJanusPixel = () => {
    const { filters: { originalTerm }, location } = this.props;
    const queryParams = {
      widget : 'RecordSearch',
      txt : originalTerm || 'no-term'
    };
    return <JanusPixel location={location} queryParams={queryParams}/>;
  };

  onFacetGroupSelect = event => {
    const { toggleSelectedFacetGroup } = this.props;
    const {
      selectedFacetGroupName: groupName,
      selectedFacetSection: section
    } = event.currentTarget.dataset;
    toggleSelectedFacetGroup(groupName, section);
  };

  makeProducts = ({ isCustomer, inlineBannerData } = {}) => {
    const { onProductClicked, onSortSelected, props, state, handleSearchFeedbackClick } = this;
    const {
      filters,
      getHeartProps,
      location,
      msaImageParams,
      pixelServerHost,
      products,
      showRatingStars,
      triggerAssignment,
      fetchProductDetail,
      heartProduct,
      unHeartProduct,
      toggleHeartingLoginModal,
      isFacetsVisible,
      hydraMicrosoftSponsoredProducts,
      trackMicrosoftAdImpressions,
      hydraColorSwatches
    } = props;
    const { feedbackSubmitted } = state;
    const heartsData = getHeartProps({ ...props, hasHearting }, { heartEventName: 'TE_SEARCH_PRODUCT_HEART', unHeartEventName: 'TE_SEARCH_PRODUCT_UNHEART' });
    const imageParams = { ...msaImageParams, width: 510 };
    return (
      <>
        <Products
          makeScrollButton={this.makeScrollButton}
          products={products}
          filters={filters}
          onSortSelected={onSortSelected}
          page={filters.page}
          onProductClicked={onProductClicked}
          showRatings={showRatings}
          heartsData={heartsData}
          msaImageParams={imageParams}
          showRatingStars={showRatingStars}
          feedbackSubmitted={feedbackSubmitted}
          handleSearchFeedbackClick={handleSearchFeedbackClick}
          inlineBannerData={inlineBannerData}
          isCustomer={isCustomer}
          trackMicrosoftAdImpressions={trackMicrosoftAdImpressions}
          triggerAssignment={triggerAssignment}
          getProductInfo={fetchProductDetail}
          location={location}
          pixelServerHost={pixelServerHost}
          heartProduct={heartProduct}
          unHeartProduct={unHeartProduct}
          toggleHeartingLoginModal={toggleHeartingLoginModal}
          isFacetsVisible={isFacetsVisible}
          hydraMicrosoftSponsoredProducts={hydraMicrosoftSponsoredProducts}
          hydraColorSwatches={hydraColorSwatches}
        />
      </>
    );
  };

  clearFacetGroup = () => {
    const { resetFacetGroup, facets } = this.props;
    const facetField = (hasFacetListClear && facets.chosenFacetGroup) ? facets.chosenFacetGroup.facetField : null;
    resetFacetGroup(facetField);
  };

  handlePillClick = ({ name, value }, index) => {
    this.onFacetSelect(name, value, null, index);
  };

  clearChosenFacet = () => {
    const { setFacetChosen } = this.props;
    setFacetChosen(null);
    this.facets.scrollTop = 0;
  };

  facetDone = () => {
    this.resetFacet();
    this.clearChosenFacet();
  };

  saveFiltersRedirectToLogin = () => {
    const { cookieDomain, location, redirectToAuthenticationFor, filters } = this.props;
    const canSave = formatSavedFilters(filters);
    if (canSave) {
      setCookie(SAVI_SIZE_COOKIE, '1', { domain: cookieDomain });
    }
    redirectToAuthenticationFor(location);
  };

  onSaveSizeClick = () => {
    const { saveFilters, isCustomer } = this.props;
    if (!isCustomer) {
      this.saveFiltersRedirectToLogin();
    } else {
      saveFilters();
      trackEvent('TE_SAVED_FILTERS_SAVE_CLICK');
    }
  };

  onResetSizeClick = facetField => {
    const { deleteSavedFilters, filters: { savedsizes }, saveFilters } = this.props;
    const savedFiltersWithValues = Object.values(savedsizes.filters).filter(v => v.length);
    const savedFilter = savedsizes.filters[facetField] || [];
    if (savedFilter.length) {
      if (savedFiltersWithValues.length > 1) {
        saveFilters(facetField);
      } else {
        if (savedsizes?.id) {
          deleteSavedFilters(savedsizes.id);
        }
      }
      trackEvent('TE_SAVED_FILTERS_RESET_CLICK');
    }
  };

  onSaveFeatureToggle = () => {
    const { cookieDomain, isCustomer, toggleSavedFilters, filters: { applySavedFilters } } = this.props;
    if (!isCustomer) {
      this.saveFiltersRedirectToLogin();
    } else {
      if (applySavedFilters) {
        trackEvent('TE_SAVED_FILTERS_TOGGLE_OFF');
      }
      setCookie(SAVI_COOKIE, applySavedFilters ? 'true' : '', { domain: cookieDomain });
      toggleSavedFilters();
    }
  };

  onFacetSelect = (facetGroup, facetName, selectedFacetGroupIndex, selectedFacetIndex, isPcm, section = null) => {
    const { filters, facets, togglePersonalizedSize } = this.props;
    if (facetGroup === BEST_FOR_YOU_FACETFIELD) {
      togglePersonalizedSize(facets);
      trackEvent('TE_PERSONALIZED_SEARCH_SIZE', `${!filters.personalizedSize?.facets?.[0]?.selected}`);
    } else {
      const { facets, filters, toggleSelectedFacet, trackEvent, trackLegacyEvent, clearAutoComplete } = this.props;

      if (filters.personalizedSize?.facets?.[0]?.selected && (filters.personalizedSize?.sizes.indexOf(facetName) > -1)) {
        togglePersonalizedSize();
      }

      toggleSelectedFacet(facetGroup, facetName, selectedFacetGroupIndex, selectedFacetIndex, section);
      clearAutoComplete(facetGroup);
      const facetLocation = isPcm ? 'pcm' : 'toDisplay';
      const facet = facets[facetLocation][selectedFacetGroupIndex];

      if (facet) {
        const facetGroupDisplayName = sanitizeForEvent(facet.facetFieldDisplayName);
        const sanitizedName = sanitizeForEvent(facetName);
        const searchTerm = buildSearchTermEventPayload(filters.term);
        trackLegacyEvent('Search-Results-Page', `Facet-Click-${facetGroupDisplayName}-${sanitizedName}`, searchTerm);
        trackLegacyEvent('Search-Results-Page', `FCT${facetGroup.toLowerCase()}`, sanitizedName);
        trackEvent('TE_SEARCH_FILTERS', `${facetGroupDisplayName}:${facetName}${isPcm ? ':pcm:true' : ''}`);
      }
    }
  };

  handleSearchFeedbackClick = feedback => {
    this.setState({ feedbackSubmitted: true });
    this.props.searchFeedbackClick(feedback);
  };

  makePersonalizedMessage = (isCompact = false) => {
    const { testId } = this.context;
    const { filters: { sort, bestForYouSortEligible } } = this.props;
    const optedText = !sort.bestForYou ? 'not ' : '';
    const toggleText = `Results are ${optedText}sorted based on your Preferences. `;

    if (bestForYouSortEligible) {
      return (
        <>
          <Tooltip
            tooltipId="personalizedSearch"
            wrapperClassName={css.tooltipWrapper}
            tooltipClassName={css.tooltip}
            direction="left"
            content={'Your own special blend is here! We\'re combining your feedback, recent purchases, and shopping behavior to sort your best results to the top.'}>
            <MoreInfo/>
          </Tooltip>
          <span>
            {!isCompact && toggleText}
            <button
              type="button"
              onClick={this.handlePersonalizedBestForYou}
              data-test-id={testId('bestForYouButton')}
              aria-label={`Turn ${sort.bestForYou ? 'off' : 'on'} best for you sort.`}
            >
              Turn {sort.bestForYou ? 'off' : 'on'}
            </button>
          </span>
        </>
      );
    }
  };

  makePersonalizedSortToggle = (testIdName, isFooter = false, isCompact = false) => {
    const { testId } = this.context;
    return (
      <div data-test-id={testId(testIdName)} className={cn(css.hpsMessage, { [css.footer]: isFooter })}>
        {this.makePersonalizedMessage(isCompact)}
      </div>
    );
  };

  toggleShowMore = (facetField, index, section) => {
    const { toggleFacetGroupShowMore } = this.props;

    if (facetField && index >= 0 && section) {
      toggleFacetGroupShowMore(facetField, index, section);
    }
  };

  onModalOverlayClick = e => {
    const { isFacetsVisible } = this.props;
    if (isFacetsVisible && e.target.id === 'searchFilterModalOverlay') {
      this.facetDone();
    }
  };

  render() {
    const {
      autoComplete,
      facets,
      filters,
      isFacetsVisible,
      location,
      onApplyFilters,
      params,
      products,
      topBannerData,
      inlineBannerData,
      isCustomer,
      toggleSizingFacetGroup,
      fetchSearchInlineRecos,
      redirectWithAppRoot,
      toggleFacetsContainer,
      clearInlineRecos,
      setOosMessaging,
      getHearts,
      pageTypeChange,
      getHeartCounts,
      setHFSearchTerm,
      setAndStoreCookie,
      sessionExpiration,
      fetchFromZso,
      fetchFromSearch,
      fetchSymphonySearchComponents,
      hydraMicrosoftSponsoredProducts,
      setUrlUpdated,
      triggerAssignment,
      isVip,
      landingPage,
      fetchLandingPageInfo
    } = this.props;
    const { testId } = this.context;
    const isLoading = !!products.isLoading;

    return (
      <SiteAwareMetadata loading={isLoading || !products.executedSearchUrl}>
        <SearchLogic
          makeScrollhandler={this.makeScrollhandler}
          location={location}
          params={params}
          fetchSearchInlineRecos={fetchSearchInlineRecos}
          products={products}
          facets={facets}
          filters={filters}
          isFacetsVisible={isFacetsVisible}
          redirectWithAppRoot={redirectWithAppRoot}
          toggleFacetsContainer={toggleFacetsContainer}
          clearInlineRecos={clearInlineRecos}
          setOosMessaging={setOosMessaging}
          getHearts={getHearts}
          pageTypeChange={pageTypeChange}
          getHeartCounts={getHeartCounts}
          setHFSearchTerm={setHFSearchTerm}
          setAndStoreCookie={setAndStoreCookie}
          sessionExpiration={sessionExpiration}
          fetchFromZso={fetchFromZso}
          fetchFromSearch={fetchFromSearch}
          fetchSymphonySearchComponents={fetchSymphonySearchComponents}
          setUrlUpdated={setUrlUpdated}
          triggerAssignment={triggerAssignment}
          fetchLandingPageInfo={fetchLandingPageInfo}
          landingPage={landingPage}
          isVip={isVip}
          hydraMicrosoftSponsoredProducts={hydraMicrosoftSponsoredProducts}
        >
          {({
            hasProductResults,
            shouldShowNoResults
          }) => (
            <div ref={e => this.stickyPlaceholder = e} className={cn(css.wrap, 'searchWrapper')}>
              {!shouldShowNoResults() &&
                <div>
                  {this.makeAccessibilityAnchors(hasProductResults)}
                  <GamSlot slot={SRP_WIDE_TOP} className={css.displayAd} />
                  <GamSlot slot={SRP_NARROW_TOP} />
                  <DesktopSearchHeader
                    trustedRetailers={products.trustedRetailers}
                    totalProductCount={products.totalProductCount}
                    onSortSelected={this.onSortSelected}
                    filters={filters}
                    makePersonalizedSortToggle={this.makePersonalizedSortToggle}
                    isFacetsVisible={isFacetsVisible}
                    onToggleFacetsContainer={this.onToggleFacetsContainer}
                  />
                  {topBannerData && !this.state.hasFilters && <TopBannerAd
                    slotDetails={topBannerData}
                    searchTerm={filters.term}
                    selectedFilters={filters.selected}
                    isFacetsVisible={isFacetsVisible} />}
                  {this.makeStickyHeader()}
                  {this.makeSeoText()}
                  {this.makeProducts({ isCustomer, inlineBannerData })}
                  <div // eslint-disable-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
                    id="searchFilterModalOverlay"
                    className={cn({ [css.modalOverlay]: isFacetsVisible })}
                    onClick={this.onModalOverlayClick}
                  >
                    <aside id="searchFilters" className={'facetWrapper facets'} ref={c => this.facets = c}>
                      <FocusTrap active={isFacetsVisible} shouldFocusFirstElement>
                        {focusRef => (
                          <div
                            ref={focusRef}
                            data-test-id={testId('facets')}>
                            <FacetMenu
                              clearChosenFacet={this.clearChosenFacet}
                              totalProductCount={products.totalProductCount}
                              facets={facets}
                              hasMobileLayeredFacets={true}
                              mobileFacetHeader={mobileFacetHeader}
                              facetDone={this.facetDone} />
                            <Facets
                              autoComplete={autoComplete}
                              autoCompleteMinValues={autoCompleteMinValues}
                              onApplyFilters={onApplyFilters}
                              isFacetsVisible={isFacetsVisible}
                              filters={filters}
                              facets={facets}
                              products={products}
                              onFacetSelect={this.onFacetSelect}
                              onFacetGroupSelect={this.onFacetGroupSelect}
                              clearFacetGroup={this.clearFacetGroup}
                              runToggleFacetsContainer={this.runToggleFacetsContainer}
                              facetDone={this.facetDone}
                              facetHeader={facetHeader}
                              hasMultiSelectMessaging={true}
                              sortOptions={sortOptions}
                              onSortSelected={this.onSortSelected}
                              hasAutoComplete={true}
                              isCustomer={isCustomer}
                              onSaveSizeClick={this.onSaveSizeClick}
                              onResetSizeClick={this.onResetSizeClick}
                              saveFilters={saveFilters}
                              onSaveFeatureToggle={this.onSaveFeatureToggle}
                              toggleShowMore={this.toggleShowMore}
                              onSortSelected={this.onSortSelected}
                              makePersonalizedSortToggle={this.makePersonalizedSortToggle}
                              toggleSizingFacetGroup={toggleSizingFacetGroup} />
                            <FacetActions
                              clearFacetGroup={this.clearFacetGroup}
                              isFacetsVisible={isFacetsVisible}
                              onApplyFilters={onApplyFilters}
                              selectedFacet={facets.chosenFacetGroup}
                              facetDone={this.facetDone}
                              mobileCloseFiltersText={mobileCloseFiltersText}
                              mobileRemoveSelectionsText={mobileRemoveSelectionsText} />
                          </div>
                        )}
                      </FocusTrap>
                      <GamSlot slot={SRP_WIDE_MID} />
                    </aside>
                  </div>
                  {this.makeJanusPixel()}
                  {this.makeSearchFooter({ hasProductResults })}
                </div>
              }
            </div>
          )}
        </SearchLogic>
      </SiteAwareMetadata>
    );
  }
}

StandardSearch.defaultProps = {
  trackEvent,
  trackLegacyEvent
};

StandardSearch.contextTypes = {
  router: PropTypes.object.isRequired,
  testId: PropTypes.func.isRequired,
  marketplace: PropTypes.object.isRequired
};

StandardSearch.propTypes = {
  products: PropTypes.object.isRequired,
  filters: PropTypes.object,
  facets: PropTypes.object
};

function mapStateToProps(state) {
  const {
    autoComplete, cookies, facets, filters,
    environmentConfig: { pixelServerHost },
    hearts: { heartsStyleIds, heartLoginPrompt }, isFacetsVisible, search: { symphony },
    products, url: { userAgent },
    killswitch: { isShowingThirdPartyAds },
    landingPage,
    rewards
  } = state;

  const isCustomer = state.cookies['x-main'];

  return {
    autoComplete,
    cookieDomain,
    facets,
    filters,
    getHeartProps,
    hearts: heartsStyleIds,
    heartLoginPrompt,
    hydraMicrosoftSponsoredProducts: getAssignmentGroup(HYDRA_MICROSOFT_SPONSORED_PRODUCTS, state),
    isFacetsVisible,
    isShowingThirdPartyAds,
    isCustomer,
    landingPage,
    msaImageParams: msaMelodyImageParams,
    pixelServerHost,
    products,
    saviSizeCookie: cookies[SAVI_SIZE_COOKIE] || null,
    showRatingStars,
    showSeoText,
    topBannerData: symphony?.slotData?.['search-header-1'],
    inlineBannerData: symphony?.slotData?.['search-results-1'],
    isVip: rewards?.rewardsInfo?.isVipOrConsented,
    hydraAutoFacetSuggestion: getAssignmentGroup(HYDRA_AUTO_FACET_SUGGESTION, state),
    hydraColorSwatches: getAssignmentGroup(HYDRA_COLOR_SWATCHES, state),
    userAgent
  };
}

export const mapDispatchToProps = {
  addAdToQueue,
  clearAutoComplete,
  deleteSavedFilters,
  fetchProductDetail,
  heartProduct,
  redirectToAuthenticationFor,
  removeFromStoredCookies,
  removePersonalizedSize,
  resetFacetGroup,
  toggleHeartingLoginModal,
  setFacetChosen,
  toggleFacetGroupShowMore,
  toggleFacetsContainer,
  togglePersonalizedSize,
  toggleSelectedFacet,
  toggleSelectedFacetGroup,
  trackMicrosoftAdImpressions,
  toggleSizingFacetGroup,
  triggerAssignment,
  updateBestForYou,
  unHeartProduct,
  updateSort,
  searchFeedbackClick,
  saveFilters,
  toggleSavedFilters,
  fetchSearchInlineRecos,
  redirectWithAppRoot,
  clearInlineRecos,
  setOosMessaging,
  getHearts,
  pageTypeChange,
  getHeartCounts,
  setHFSearchTerm,
  setAndStoreCookie,
  sessionExpiration,
  fetchFromZso,
  fetchFromSearch,
  fetchSymphonySearchComponents,
  setUrlUpdated,
  fetchLandingPageInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(StandardSearch);
