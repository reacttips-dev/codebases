import { store } from 'entrypoints/bootstrapOnClient';
import { getAmethystPageType } from 'helpers/analytics';
import { getType } from 'history/historyFactory';
import { PRODUCT_ACCORDION_EVENT, PRODUCT_BADGES_EVENT } from 'constants/amethyst';

// https://code.amazon.com/packages/AmethystEvents/blobs/7a3d24ee742860cd220c9a9664005064bd91eae9/--/configuration/include/com/zappos/amethyst/website/WebsiteEnums.proto#L274
const heroImageTypeMap = {
  0: 'UNKNOWN_HERO_IMAGE_TYPE',
  1: 'SINGLE_IMAGE_HERO',
  2: 'TWO_IMAGE_HERO',
  3: 'THREE_IMAGE_HERO'
};
const getHeroImageType = heroCount => heroImageTypeMap[heroCount] || 'UNKNOWN_HERO_IMAGE_TYPE';

/**
  * Check if URL goes to PDP or Search
  * @param {string} url URL to check destination for.
*/
export const isShoppableLink = url => ['search', 'pdp'].includes(getType(url));

/**
  * Shared object builder for hero clicks & impressions because they are pretty much the same.
  * @param {boolean} shoppableLink Send explicit value instead of inferring from slotDetails.
  * @param {number} heroCount Number for how many hero images there are for the component. Uses getHeroImageType
  * to covert it to an Amethyst friendly string.
  * @param {string} linkText Explicit link or CTA copy.
  * @param {string} componentTitle Explicit value for heading or title of the component.
  * @param {object} slotDetails The object sent back from ZCS/Symphony. From these we try to infer data values.
  * There are a lot of different key names for the same thing right now so there are unfortunately many fallbacks.
*/
const makeHeroData = heroEvtObj => {
  const {
    shoppableLink,
    heroCount,
    linkText,
    slotDetails,
    componentTitle,
    linkSearchContext
  } = heroEvtObj;
  const {
    heading, title,
    cta, calltoaction, ctacopy, cta2,
    link, links, url, ctalink, ctasecondarylink
  } = slotDetails;
  return {
    shoppableLink: typeof shoppableLink === 'boolean' ? shoppableLink : !!(link || ctalink || ctasecondarylink || url || links?.[0]?.href),
    heroImageType: getHeroImageType(heroCount),
    linkText:  linkText || cta || calltoaction || ctacopy || cta2 || links?.[0]?.text,
    componentTitle: componentTitle || heading || title,
    symphonyDetails: makeSymphonyDetailsData(heroEvtObj),
    linkSearchContext
  };
};

/**
  * Shared object builder for symphony specific data requested by Amethyst.
  * @param {string} name The Symphony technical component name, ex: 'melodyHero'.
  * @param {string} identifier The gae click value for a component.
  * @param {object} slotDetails The object sent back from ZCS/Symphony. From these we try to infer data values.
  * There are a lot of different key names for the same thing right now so there are unfortunately many fallbacks.
  * @param {string} slotName Symphony name of slot, ex: 'primary-1'.
  * @param {number} slotIndex Index the component is shown if in a list.
*/
const makeSymphonyDetailsData = ({
  name,
  identifier,
  slotDetails,
  slotName,
  slotIndex,
  heading: headingOverride
}) => {
  const {
    testName,
    heading, title, links,
    gae, ctagae, ctasecondarygae,
    componentName, style
  } = slotDetails;
  return {
    placement: slotName,
    name: name || ((componentName === 'productSearch' && style) ? `${componentName}:${style}` : componentName),
    identifier: identifier || gae || ctagae || ctasecondarygae || links?.[0]?.gae,
    testName,
    index: slotIndex,
    title: headingOverride || heading || title,
    sourcePage: getAmethystPageType(store.getState().pageView.pageType)
  };
};

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/HeroImpression.proto
  * Any hero-like component shown. Usually coming from Symphony but can be repurposed for other hero-y features.
  * @param {object} evtObj Object including slotDetails, slotName, slotIndex, heroCount, and possibly more. See makeHeroData for details.
*/
export const evHeroImpression = evtObj => ({
  heroImpression: makeHeroData(evtObj)
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/HeroClick.proto
  * Any hero-like component shown. Usually coming from Symphony but can be repurposed for other hero-y features.
  * @param {object} evtObj Object including slotDetails, slotName, slotIndex, heroCount, and possibly more. See makeHeroData for details.
*/
export const evHeroClick = evtObj => ({
  heroClick: makeHeroData(evtObj)
});

/**
  * Shared object builder for productStream clicks & impressions because they are almost the same. The differences
  * can be handled by the "type" flag.
  * @param {object} evtObj Bundle of all the data we get from symphony and more. See destructuring for which keys we're looking for.
  * @param {string} type Type of event - either 'click' or 'impression'.
*/
export const makeProductStreamData = (evtObj, type) => {
  const { slotDetails, personalized, numberOfItems, displayedItems, displayedItemsDirty, indexClicked, product } = evtObj;
  const { products, title } = slotDetails;
  const evt = {
    personalized: personalized,
    sourcePage: getAmethystPageType(store.getState().pageView.pageType),
    searchProductStreamType: 'UNKNOWN_SEARCH_PRODUCT_STREAM_TYPE',
    componentName: title,
    symphonyDetails: makeSymphonyDetailsData(evtObj)
  };
  if (type === 'click') {
    const { colorId, styleId, productId } = product.cardData || product;
    evt.indexClicked = indexClicked || product.index;
    evt.clickedItem = { colorId, styleId, productId };
  } else if (type === 'impression') {
    const productsList = products || displayedItemsDirty;
    evt.numberOfItems = numberOfItems || productsList?.length;
    evt.displayedItems = displayedItems || productsList?.map(({ productId, styleId, colorId }) => ({ productId, styleId, colorId }));
  }
  return evt;
};

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/HeroWithProductStreamImpression.proto
  * Hero with products in tandem. This is applicable for many of the different productSearch components.
  * @param {object} evtObj Object including slotDetails, slotName, slotIndex, and possibly more. See makeSymphonyDetailsData, makeProductStreamData, and
  * makeHeroData for how that data is passed.
*/
export const evHeroWithProductStreamImpression = evtObj => ({
  heroWithProductStreamImpression: {
    heroImpression: makeHeroData(evtObj),
    searchProductStreamImpression: makeProductStreamData(evtObj, 'impression'),
    symphonyDetails: makeSymphonyDetailsData(evtObj)
  }
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/HeroWithProductStreamClick.proto
  * Hero with products in tandem. This is applicable for many of the different productSearch components.
  * @param {object} evtObj Object including slotDetails, slotName, slotIndex, and possibly more. See makeSymphonyDetailsData, makeProductStreamData, and
  * makeHeroData for how that data is passed.
*/
export const evHeroWithProductStreamClick = evtObj => {

  const evt = {
    symphonyDetails: makeSymphonyDetailsData(evtObj)
  };

  if (evtObj.product) { // if we have product data assume product click
    evt.searchProductStreamClick = makeProductStreamData(evtObj, 'click');
  } else { // otherwise assume hero click
    evt.heroClick = makeHeroData(evtObj);
  }

  return {
    heroWithProductStreamClick: { ...evt }
  };
};

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/SearchProductStreamImpression.proto
  * Component that lists products.
  * @param {object} evtObj Object including slotDetails, slotName, slotIndex, and possibly more. See makeProductStreamData for details.
*/
export const evSearchProductStreamImpression = evtObj => ({
  searchProductStreamImpression: makeProductStreamData(evtObj, 'impression')
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/SearchProductStreamClick.proto
  * Component that lists products.
  * @param {object} evtObj Object including slotDetails, slotName, slotIndex, and possibly more. See makeProductStreamData for details.
*/
export const evSearchProductStreamClick = evtObj => ({
  searchProductStreamClick: makeProductStreamData(evtObj, 'click')
});

const makeCategoryStreamData = evtObj => {
  const { slotDetails, numberOfItems, personalized } = evtObj;
  const { componentName, categories } = slotDetails;

  return {
    numberOfItems: numberOfItems || categories?.length,
    personalized: personalized,
    sourcePage: getAmethystPageType(store.getState().pageView.pageType),
    componentName,
    symphonyDetails: makeSymphonyDetailsData(evtObj)
  };
};

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/CategoryStreamImpression.proto
  * @param {object} evtObj Object including slotDetails, slotName, slotIndex, and more. See makeCategoryStreamData for details.
*/
export const evCategoryStreamImpression = evtObj => ({
  categoryStreamImpression: makeCategoryStreamData(evtObj)
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/CategoryStreamClick.proto
  * @param {object} evtObj Object including slotDetails, slotName, slotIndex, and iframe URL.
*/
export const evCategoryStreamClick = evtObj => ({
  categoryStreamClick: makeCategoryStreamData(evtObj)
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/IFrameImpression.proto
  * @param {object} evtObj Object including slotDetails, slotName, slotIndex, and iframe URL.
*/
export const evIFrameImpression = evtObj => ({
  iframeImpression: {
    url: evtObj.url,
    symphonyDetails: makeSymphonyDetailsData(evtObj)
  }
});

const makeVideoData = ({ slotDetails = {} }) => {
  const { source, src, autoplay, heading } = slotDetails;
  return {
    videoUrl: source || src,
    autoplay,
    componentTitle: heading
  };
};

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/VideoClick.proto
  * @param {object} evtObj Object including slotDetails, slotName, slotIndex, and interactionType(PAUSED, PLAY, SEEKED).
*/
export const evVideoClick = evtObj => ({
  videoClick: {
    ...makeVideoData(evtObj),
    interactionType: evtObj.interactionType,
    symphonyDetails: makeSymphonyDetailsData(evtObj)
  }
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/VideoImpression.proto
  * @param {object} evtObj Object including slotDetails, slotName, and slotIndex.
*/
export const evVideoImpression = evtObj => ({
  videoImpression: {
    ...makeVideoData(evtObj),
    symphonyDetails: makeSymphonyDetailsData(evtObj)
  }
});

export const getFirstFiveWords = (str = '') => str.split(' ').splice(0, 5).join(' ');

export const evPageContentImpression = evtObj => {
  const { slotDetails: { pageContent: { heading, title, style } = {} } = {}, content } = evtObj;
  return {
    pageContentImpression: {
      bodySnippet: getFirstFiveWords(content),
      symphonyDetails: makeSymphonyDetailsData({ ...evtObj, heading: heading || title }),
      style
    }
  };
};

export const evPageContentClick = evtObj => {
  const { slotDetails: { pageContent: { heading, title, style } = {} } = {}, content, linkText, linkUrl } = evtObj;
  return {
    pageContentClick: {
      bodySnippet: getFirstFiveWords(content),
      symphonyDetails: makeSymphonyDetailsData({ ...evtObj, heading: heading || title }),
      style, linkText, linkUrl
    }
  };
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/ProductAccordionEvent.proto
export const evProductAccordionEvent = ({ opened, closed, headerName }) => ({
  [PRODUCT_ACCORDION_EVENT]: {
    accordion_opened : opened,
    accordion_closed : closed,
    header_name : headerName
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/ProductBadgesEvent.proto
export const evProductBadgesEvent = ({ opened, closed, badgeName }) => ({
  [PRODUCT_BADGES_EVENT]: {
    tooltip_open : opened,
    tooltip_closed : closed,
    name: badgeName
  }
});
