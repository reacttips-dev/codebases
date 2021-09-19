import { CLEAR_SAVED_FILTERS, TOGGLE_FACET_GROUP_SHOW_MORE, TOGGLE_SAVED_FILTERS, UPDATE_SAVED_FILTERS } from 'constants/reduxActions';
import {
  SEARCH_FACET_CLICK,
  SEARCH_PAGE_CLICKTHROUGH,
  SEARCH_PAGE_VIEW,
  SEARCH_PILL_GROUP_TOGGLE,
  SEARCH_SHOW_MORE_TOGGLE,
  SEARCH_SORT_CLICK,
  TOP_BANNER_AD_CLICK,
  TOP_BANNER_AD_IMPRESSION
} from 'constants/amethyst';
import { trackEvent } from 'helpers/analytics';
import { middlewareTrack, titaniteView } from 'apis/amethyst';
import { sendMonetateEvent } from 'apis/monetate';

const mapSortType = value => {
  switch (value) {
    case 'bestForYou/desc':
      return 'BEST_FOR_YOU';
    case 'relevance/desc':
      return 'RELEVANCE';
    case 'isNew/desc/goLiveDate/desc/recentSalesStyle/desc':
      return 'NEW_ARRIVALS';
    case 'productRating/desc':
      return 'CUSTOMER_RATING';
    case 'recentSalesStyle/desc':
      return 'BEST_SELLERS';
    case 'price/asc':
      return 'PRICE_LOW_TO_HIGH';
    case 'price/desc':
      return 'PRICE_HIGH_TO_LOW';
    case 'brandNameFacetLC/asc/productName/asc':
      return 'BRAND_SORT';
    case 'percentOff/desc':
      return 'PERCENT_OFF';
    case 'onSale/desc':
      return 'ON_SALE';
    case 'trending/desc':
      return 'TRENDING';
    default:
      return 'UNKNOWN_SORT';
  }
};

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/SearchPageView.proto
  *
  * Note: reco impressions are sent separately with the recommendationWrapper
  *
  * @param {integer} itemsFound - # of items in results
  * @param {string} searchTerm - Search term duh
  * @param {object} selected - Object of selected filters from Redux state
  * @param {object} sort - Object of sort from Redux state
*/
export const pvSearch = ({ products: { totalProductCount, list, trustedRetailers }, filters: { originalTerm, selected, sort, page, autocorrect } }) => {
  titaniteView();

  const autoFacets = [];
  const { singleSelects, multiSelects } = selected;

  const addSelectedFacets = selects => {
    Object.keys(selects).forEach(attribute => {
      selects[attribute].forEach(value => {
        autoFacets.push({ attribute, value });
      });
    });
  };

  if (singleSelects) {
    addSelectedFacets(singleSelects);
  }
  if (multiSelects) {
    addSelectedFacets(multiSelects);
  }

  let currentSort = 'relevance/desc';
  const sortKeys = Object.keys(sort);
  if (sortKeys.length > 0) {
    currentSort = Object.keys(sort).map(v => `${v}/${sort[v]}`).join('/');
  }

  const productList = [ ...list, ...trustedRetailers ];

  const productsImpressed = productList.map((p, i) => {
    const { productId, styleId, colorId } = p;
    return {
      pageNumber: page + 1,
      pageResultNumber: i + 1,
      productIdentifiers: {
        productId,
        styleId,
        colorId
      }
    };
  });

  const defaultSort = mapSortType(currentSort);
  const spvObj = {
    autoFacets,
    itemsFound: totalProductCount,
    searchTerm: originalTerm,
    defaultSort,
    productsImpressed
  };

  if (autocorrect?.termBeforeAutocorrect) {
    spvObj.autocorrectTerm = autocorrect.termBeforeAutocorrect;
  }

  middlewareTrack({
    [SEARCH_PAGE_VIEW]: spvObj
  });
};

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/FacetClick.proto
  *
  * @param {string} facetGroup - Attribute of facet
  * @param {string} facetName - Name of facet
  * @param {object} crumb - Clean crumb object containing the facet name & value in the object
  * @param {object} breadcrumbRemove - A little dirty object for the name & value of the facet. Need
  * to clean the removeName so it sends a sensible attribute property.
  * @param {bool} selected - true if selected
  * @param {bool} deselected - true if deselected
*/
export const evFacetClick = ({ facetGroup, facetName, crumb, breadcrumbRemove, facetClickSource, selected, deselected }) => {
  let attribute, value;

  if (facetGroup) {
    attribute = facetGroup;
  } else if (crumb) {
    attribute = crumb.name;
  } else if (breadcrumbRemove) {
    // sometimes we get something like: 'Remove brandFacet: Ugg' and we need it to be 'brandFacet'
    attribute = breadcrumbRemove.removeName.replace(/:.*|Remove /g, '');
  }

  if (facetName) {
    value = facetName;
  } else if (crumb) {
    ({ value } = crumb);
  } else if (breadcrumbRemove) {
    value = breadcrumbRemove.name;
  }

  return {
    [SEARCH_FACET_CLICK]: {
      facetClick: {
        attribute,
        value
      },
      selected,
      deselected,
      facetClickSource
    }
  };
};

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/FacetAttributeDropdownClick.proto
  *
  * @param {string} facetGroup - Attribute of facet
  * @param {string} facetClickSource - Facet click source
  * @param {bool} collapse - true if not open
*/
export const evGroupedPillToggle = ({ facetGroup, facetClickSource, collapse }) => ({
  [SEARCH_PILL_GROUP_TOGGLE]: {
    attributeName: facetGroup,
    facetClickSource,
    collapse
  }
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/FacetAttributeShowMoreClick.proto
  *
  * @param {string} facetClickSource - Source of click
  * @param {bool} collapse - true if not open
*/
export const evShowMoreToggle = ({ facets }, { section, selectedFacetIndex }) => {
  const facetClickSource = 'FACET_SHOW_MORE';
  const hasShowMore = facets.navigation[section][selectedFacetIndex]?.showMore;
  middlewareTrack({
    [SEARCH_SHOW_MORE_TOGGLE]: {
      facetClickSource,
      collapse: !hasShowMore
    }
  });
};

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/SortSearchClick.proto
  *
  * @param {string} sortType - See WebsiteEnums.proto file for potential values
  * Sort Map used to find value based off of values in WebsiteEnums file
*/
const SortTypeMap = {
  'unknown': 'UNKNOWN_SORT',
  'relevance': 'RELEVANCE',
  'new arrivals': 'NEW_ARRIVALS',
  'customer rating': 'CUSTOMER_RATING',
  'best sellers': 'BEST_SELLERS',
  'price: low to high': 'PRICE_LOW_TO_HIGH',
  'price: high to low': 'PRICE_HIGH_TO_LOW',
  'brand name': 'BRAND_SORT'
};
export const evSortSearchClick = ({ sortType }) => ({
  [SEARCH_SORT_CLICK]: {
    sortType: SortTypeMap[sortType.toLowerCase().trim()] || 'UNKNOWN_SORT'
  }
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/SearchPageClickthrough.proto
  *
  * @param {integer} pageNumber - Page number, ex: 1
  * @param {integer} pageResultNumber - Position out of all results on page
  * @param {string} productIdentifiers - Keys: productId, styleId, colorId, stockId, asin
  * @param {bool} isLowStock - Clicked product is low stock or not
*/
export const evSearchPageClickthrough = ({ pageNumber, pageResultNumber, product, numberOfHearts, swatchCount, swatchIndex, isLowStock }) => {
  const { productId, styleId, colorId } = product;
  return event = {
    [SEARCH_PAGE_CLICKTHROUGH]: {
      pageNumber,
      pageResultNumber,
      clickedProduct: {
        productId,
        styleId,
        colorId,
        supplementalData: {
          numberOfHearts,
          swatchCount,
          swatchIndex,
          isLowStock
        }
      }
    }
  };
};

const tePageView = appState => {
  const { filters: { term, bestForYouSortEligible, personalizedSize } } = appState;
  trackEvent('TE_PV_SEARCHPAGE');
  if (personalizedSize) {
    trackEvent('TE_PERSONALIZED_SIZE_AVAILABLE');
  }

  if (bestForYouSortEligible) {
    trackEvent('TE_PERSONALIZED_SEARCH_BFU_ELIGIBLE');
    if (!term) {
      trackEvent('TE_PERSONALIZED_SEARCH_BFU_ELIGIBLE_NO_TERM');
    }
  }
};

const ameSavedSizeImpression = ({ filters: { savedsizes, applySavedFilters } }) => {
  if (Object.keys(savedsizes.filters).length > 0) {
    trackEvent('TE_SAVED_FILTERS_VISIBLE');
    const sizes = formatSavedFilters(savedsizes);
    const noSavedSizes = sizes.length <= 0;
    middlewareTrack({
      savedSizeImpression: {
        toggle: !!applySavedFilters,
        saved_sizes: sizes,
        no_saved_sizes: noSavedSizes
      }
    });
  }
};

const formatSavedFilters = savedsizes => {
  const sizes = [];
  for (const filter of Object.keys(savedsizes.filters)) {
    savedsizes.filters[filter].map(v => sizes.push({ attribute: filter, value: v }));
  }
  return sizes;
};

const ameSavedFilterChange = ({ filters: { savedsizes } }, { oldFilters }) => {
  const deletedFilters = Object.keys(savedsizes.filters).some(f => oldFilters[f].length && !savedsizes.filters[f].length);
  let eventKey = 'saveSizeClick';
  const payload = {};

  if (deletedFilters) {
    eventKey = 'resetSavedSizeClick';
  }

  payload[eventKey] = { saved_sizes: formatSavedFilters(savedsizes) };

  middlewareTrack(payload);
};

const ameSavedFilterDelete = () => {
  middlewareTrack({
    resetSavedSizeClick: {
      saved_sizes: []
    }
  });
};

const ameSavedFilterToggle = ({ filters: { applySavedFilters } }) => {
  const toggleOff = !applySavedFilters;
  const toggleOn = !toggleOff;

  middlewareTrack({
    savedSizeToggle: {
      toggle_on: toggleOn,
      toggle_off: toggleOff
    }
  });
};

const monetateSearchView = appState => {
  const { products } = appState;
  if (!products.isLoading && products?.list?.length > 0) {
    const viewedProducts = products.list.map(p => p.styleId);
    sendMonetateEvent(
      ['setPageType', 'search'],
      ['addProducts', viewedProducts]
    );
  } else {
    sendMonetateEvent(
      ['setPageType', 'noSearchResults']
    );
  }
};

export const evSearchAdClick = ({ slotLocation, searchTerm, advertisementType, endpoint }) => {
  const adDetails = {
    keyword: searchTerm,
    adLocation: slotLocation,
    endpoint
  };

  return {
    [TOP_BANNER_AD_CLICK]: {
      pageType: 'SEARCH_PAGE',
      advertisementType,
      adDetails
    }
  };
};

export const evSearchAdView = ({ slotLocation, searchTerm, advertisementType, endpoint }) => {
  const adDetails = {
    keyword: searchTerm,
    adLocation: slotLocation,
    endpoint
  };

  return {
    [TOP_BANNER_AD_IMPRESSION]: {
      advertisementImpression: [{
        pageType: 'SEARCH_PAGE',
        advertisementType,
        adDetails
      }]
    }
  };
};

export default {
  pageEvent: SEARCH_PAGE_VIEW,
  events: {
    [UPDATE_SAVED_FILTERS]: [ameSavedFilterChange],
    [CLEAR_SAVED_FILTERS]: [ameSavedFilterDelete],
    [TOGGLE_SAVED_FILTERS]: [ameSavedFilterToggle],
    [SEARCH_PAGE_VIEW]: [pvSearch, tePageView, monetateSearchView, ameSavedSizeImpression],
    [TOGGLE_FACET_GROUP_SHOW_MORE]: [evShowMoreToggle]
  }
};
