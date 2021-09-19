import { store } from 'entrypoints/bootstrapOnClient';
import { getAmethystPageType } from 'helpers/analytics';
import { getFirstFiveWords, isShoppableLink } from 'events/symphony';
import { EXPLICIT_SEARCH, NAVIGATION_CLICK, TOP_LEVEL_NAV_CLICK } from 'constants/amethyst';

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/TopLevelNavigationClick.proto
  *
  * @param {string} valueClicked - Event value, could be description of link or text value
  * @param {string} recommendationImpression - only send if there are recos inside the dropdown. Not applicable currently as we never do this. See evRecommendationImpression func.
*/
export const evTopLevelNavigationClick = ({ valueClicked, recommendationImpression }) => ({
  [TOP_LEVEL_NAV_CLICK]: {
    valueClicked,
    recommendationImpression
  }
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/NavigationClick.proto
  *
  * @param {string} valueClicked - Event value, could be description of link or text value
  * @param {string} parentDropdown - parent dropdown, ex: 'Kids', 'Mens', etc.
  * @param {bool} searchOccurred - for when search form submitted inside dropdown
  * @param {object} explicitSearch (required when searchOccurred = true) - See evExplicitSearch
*/
export const evNavigationClick = ({ valueClicked, parentDropdown, searchOccurred, explicitSearchTerm: term }) => ({
  [NAVIGATION_CLICK]: {
    valueClicked,
    parentDropdown,
    searchOccurred,
    ...(term ? evExplicitSearch({ term }) : {})
  }
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/ExplicitSearch.proto
  *
  * @param {string} term - string searched, ex: 'nike red shoes'
  * Note: searchType is always 'TYPED'. Only other is VOICE which we don't do.
*/
export const evExplicitSearch = ({ term, autosuggestionShown = false, autosuggestionClicked = false }) => ({
  [EXPLICIT_SEARCH]: {
    term,
    searchType: 'TYPED',
    sourcePage: getAmethystPageType(store.getState().pageView.pageType),
    autosuggestionShown,
    autosuggestionClicked
  }
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/DynamicBannerImpression.proto
  *
  * @param {object} content - This contains the text, imageUrl, and link for the banner.
*/
export const evDynamicBannerImpression = ({ content }) => ({
  dynamicBannerImpression: {
    content
  }
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/DynamicBannerClick.proto
  *
  * @param {object} content - This contains the text, imageUrl, and link for the banner.
*/
export const evDynamicBannerClick = ({ content }) => ({
  dynamicBannerClick: {
    content
  }
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/GlobalBannerImpression.proto
  *
  * @param {object} globalBanner - Object we get from Symphony.
  * @param {string} text - String of text rendered in the container.
*/

export const evGlobalBannerImpression = ({ globalBanner, text }) => {
  const { data: { gae, href } } = globalBanner;
  return {
    globalBannerImpression: {
      bodySnippet: getFirstFiveWords(text),
      shoppableLink: isShoppableLink(href),
      sourcePage: getAmethystPageType(store.getState().pageView.pageType),
      symphonyDetails: {
        identifier: gae
      }
    }
  };
};

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/GlobalBannerClick.proto
  *
  * @param {object} globalBanner - Object we get from Symphony.
  * @param {string} text - String of text rendered in the container.
  * @param {string} linkText - String of link clicked on.
  * @param {bool} shoppableLink - If the URL is shoppable(PDP or search).
  * @param {string} linkUrl - href of link.
  * @param {bool} isDismiss - If this was a button to dismiss the banner.
*/

export const evGlobalBannerClick = ({ globalBanner, text, linkText, shoppableLink, linkUrl, isDismiss }) => {

  const { data: { gae } } = globalBanner;
  return {
    globalBannerClick: {
      bodySnippet: getFirstFiveWords(text),
      linkText,
      linkUrl,
      shoppableLink: (typeof shoppableLink === 'boolean' ? shoppableLink : isShoppableLink(linkUrl)),
      isDismiss,
      sourcePage: getAmethystPageType(store.getState().pageView.pageType),
      symphonyDetails: {
        identifier: gae
      }
    }
  };
};
