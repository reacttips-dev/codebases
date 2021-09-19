import { ABSOLUTE_URL_RE, PAGE_NUMBER_IN_TITLE_RE, SLASH_SEARCH_FILTERS_RE } from 'common/regex';
import { constructMSAImageUrl } from 'helpers';
import { constructCollectionMSAImageUrl } from 'helpers/index';
import { relativizeUrl } from 'helpers/LocationUtils';
import ProductUtils from 'helpers/ProductUtils';
import { retrieveMetaInfo, retrieveTitleTag } from 'helpers/SeoOptimizedDataHelper';
import { buildSeoBrandString, buildSeoProductUrl } from 'helpers/SeoUrlBuilder';
import { makePageLink, organizeSelects } from 'helpers/SearchUtils';
import { createYouTubeContentUrl } from 'helpers/ClientUtils.js';

const NO_INDEX_META = 'noindex, nofollow';
const MY_ACCOUNT_PAGE_TYPES = ['account', 'shipments'];
const SIMPLE_PAGE_TYPES = ['cart', 'checkout', 'subscriptions', 'orders', 'orderInformation', 'address', 'payment', 'egc', 'confirmation', 'hmd', 'images', 'returns', 'rewards', 'outfit', 'influencerhub', 'favorites']
  .concat(MY_ACCOUNT_PAGE_TYPES);
const enhanceMetaWithIOSAd = (docMeta, marketplace) => {
  const { nativeApps: { ad } } = marketplace;
  docMeta.meta = docMeta.meta || { name: {} };
  if (ad) {
    const { iosAppId, iosSmartBannerBaseUrl, showiOSNativeAd } = ad;
    if (showiOSNativeAd && docMeta.canonical) {
      docMeta.meta.name['apple-itunes-app'] = `app-id=${iosAppId}, app-argument=${iosSmartBannerBaseUrl}${relativizeUrl(docMeta.canonical)}`;
    }
  }

  return docMeta;
};

const buildAlternatesForCanonical = (canonical, alts) => {
  // fix if absolute
  const canonicalPath = relativizeUrl(canonical);
  return alts.map(alt => ({ href: `${alt.baseUrl}${canonicalPath}`, ...alt.attributes }));
};
const enhanceMetaWithAlternates = (documentMeta, alts) => {
  if (!alts || !alts.alternates) {
    return documentMeta;
  }
  const link = documentMeta.link || {};
  link.rel = link.rel || {};
  link.rel.alternate = buildAlternatesForCanonical(documentMeta.canonical, alts.alternates);
  return { ...documentMeta, link };
};

export function buildTitleWithMarketplaceSuffix(defaultMeta, title) {
  return title ? `${title} ${defaultMeta.separator} ${defaultMeta.title}` : defaultMeta.title;
}

function buildGenericLandingPageMeta(defaultMeta, pageInfo) {
  return {
    name: {
      keywords: defaultMeta.keywords.concat(defaultMeta.landingKeywords).join(', '),
      description: pageInfo.description || defaultMeta.description
    }
  };
}

export const buildTaxonomyBrandPageDocMeta = (marketplace, alternates, brandId, pageInfo) => {
  const { defaultMeta, desktopBaseUrl } = marketplace ;
  const meta = {
    title: buildTitleWithMarketplaceSuffix(defaultMeta, pageInfo.brandName),
    canonical: `${desktopBaseUrl}${buildSeoBrandString(pageInfo.brandName, brandId)}`,
    meta: buildGenericLandingPageMeta(defaultMeta, pageInfo)
  };

  return enhanceMetaWithIOSAd(enhanceMetaWithAlternates(meta, alternates), marketplace);
};

//  logic -- use pageInfo.canonicalUrl if it exists and is absolute, if it is relative, use our base URL, otherwise fallback to /c/pageName
const buildLandingPageCanonical = (desktopBaseUrl, pageName, pageInfo) => {
  if (pageInfo.canonicalUrl) {
    return ABSOLUTE_URL_RE.exec(pageInfo.canonicalUrl) ? pageInfo.canonicalUrl : `${desktopBaseUrl}${pageInfo.canonicalUrl}` ;
  }
  return `${desktopBaseUrl}/c/${pageName}`;
};

export const buildLandingPageDocMeta = (marketplace, alternates, pageName, pageInfo) => {
  const { defaultMeta, desktopBaseUrl } = marketplace ;
  const meta = {
    title: buildTitleWithMarketplaceSuffix(defaultMeta, pageInfo.pageTitle),
    canonical: buildLandingPageCanonical(desktopBaseUrl, pageName, pageInfo),
    meta: buildGenericLandingPageMeta(defaultMeta, pageInfo)
  };
  return enhanceMetaWithIOSAd(enhanceMetaWithAlternates(meta, alternates), marketplace);
};

function buildBranchMetaTags({ androidDeeplinkBase }, { productId, styles }, colorId) {
  const metaTags =
    {
      'branch:deeplink:product': productId,
      'branch:deeplink:$android_deeplink_path': `${androidDeeplinkBase}/product`
    };
  const style = ProductUtils.getStyleByColor(styles, colorId);
  if (style && style.styleId) {
    metaTags['branch:deeplink:style'] = style.styleId;
  }
  return metaTags;
}

function buildOpenGraphMetaTags({ brandName, productName, youtubeVideoId }, style, pageTitle, baseSiteTitle, desktopBaseUrl, showOpenGraphVideo) {
  let styleSpecificOpts = {};
  if (style) {
    const ogImageMSAUrl = constructMSAImageUrl(style.imageId, { width: 700 });
    styleSpecificOpts = {
      'og:image': ogImageMSAUrl,
      'og:url': `${desktopBaseUrl}${style.productUrl}`
    };
  }
  const ogMeta = {
    'og:title': `${brandName} ${productName}`,
    'og:site_name': baseSiteTitle,
    'og:type': 'product',
    ...styleSpecificOpts
  };

  if (showOpenGraphVideo && youtubeVideoId) {
    ogMeta['og:video'] = createYouTubeContentUrl(youtubeVideoId);
  }
  return ogMeta;
}
function buildOpenGraphMetaTagsForCollection(collectionName, imageId, imageExtension, title) {
  const styleSpecificOpts = imageExtension ? { 'og:image': constructCollectionMSAImageUrl(imageId, imageExtension) } : imageId ? { 'og:image': constructMSAImageUrl(imageId, { width: 700 }) } : {};
  const ogMeta = {
    'og:title': `${collectionName}`,
    'og:site_name': `${title}`,
    'og:type': 'collection',
    ...styleSpecificOpts
  };
  return ogMeta;
}

export function buildCollectionPageDocMeta(marketplace, alternates, collectionSubCopy, collectionId, collectionName, imageId, imageExtension) {

  const { ampBaseUrl, desktopBaseUrl, defaultMeta: { title } } = marketplace;
  collectionName = collectionName.replace(/\u00a0/g, ' ');
  collectionSubCopy = collectionSubCopy.replace(/\u00a0/g, ' ');
  const pageTitle = buildTitleWithMarketplaceSuffix(marketplace.defaultMeta, collectionName);
  const openGraphMeta = buildOpenGraphMetaTagsForCollection(collectionName, imageId, imageExtension, title);
  const canonical = `${desktopBaseUrl}/account/favorites/${collectionId}`;
  const keywords = title;
  const meta = {
    title: pageTitle,
    canonical,
    meta: {
      name: {
        keywords
      },
      property : {
        ...openGraphMeta
      }
    }
  };
  if (collectionSubCopy.trim() !== '') {
    meta.meta.name.description = collectionSubCopy;
  }
  if (ampBaseUrl) {
    meta.link = { rel: { amphtml: `${ampBaseUrl}/account/favorites/${collectionId}` } };
  }
  return enhanceMetaWithIOSAd(enhanceMetaWithAlternates(meta, alternates), marketplace);
}

export function buildProductPageDocMeta(marketplace, alternates, compiledPdpMetaDescriptionTemplate, product, colorId) {
  const { ampBaseUrl, branchio, desktopBaseUrl, defaultMeta: { title, keywords: marketplaceKeywords, separator }, pdp: { showOpenGraphVideo } } = marketplace;
  const { brandName, defaultProductType, genders, productId, productName, styles } = product;
  const style = ProductUtils.getStyleByColor(styles, colorId);
  const pageTitle = `${brandName} ${productName} ${separator} ${title}`;
  const branchMeta = buildBranchMetaTags(branchio, product, colorId);
  const openGraphMeta = buildOpenGraphMetaTags(product, style, pageTitle, title, desktopBaseUrl, showOpenGraphVideo);
  const keywords = [productName, brandName, defaultProductType].concat(genders).concat(marketplaceKeywords).join(', ');
  const canonical = `${desktopBaseUrl}${buildSeoProductUrl(product)}`;
  const meta = {
    title: pageTitle,
    canonical,
    // this format is dumb, see react-document-meta
    meta: {
      name: {
        description: compiledPdpMetaDescriptionTemplate({ productName, brandName, title }),
        keywords,
        ...branchMeta
      },
      property : {
        ...openGraphMeta
      }
    }
  };

  if (ampBaseUrl) {
    meta.link = { rel: { amphtml: `${ampBaseUrl}/product/${productId}` } };
  }

  return enhanceMetaWithIOSAd(enhanceMetaWithAlternates(meta, alternates), marketplace);
}

// Search meta helpers
const canonical = ({ linkInfo }, desktopBaseUrl) => {
  const canonicalLink = (linkInfo || []).find(({ rel }) => rel === 'canonical');
  if (canonicalLink) {
    return `${desktopBaseUrl}${canonicalLink.href}`;
  }
};

export const buildSearchPageDocMeta = (marketplace, alternates, searchApiResponse) => {
  let title = retrieveTitleTag(searchApiResponse);

  const { search: { hasInfinitePagination }, hasSeoTermPages } = marketplace;
  if (hasInfinitePagination) {
    title = title.replace(PAGE_NUMBER_IN_TITLE_RE, '');
  }
  const meta = {
    canonical: canonical(searchApiResponse, marketplace.desktopBaseUrl),
    title,
    meta: { name: retrieveMetaInfo(searchApiResponse) },
    link: { rel: { } }
  };
  // Calypso API  field responses are 1-indexed, the URLs are (wtf) zero indexed.
  // TDo not use previous/next directly from API since it will sometimes include a `-page2` suffix to the SEO test, e.g:
  // `/espadrille-women-shoes-page2/CK_XAcABAeICAgEY.zso?t=espadrille%3F&p=1"`
  // Also, the API returns "previous" rather than "prev" which is what search engines use.
  // In order for the prev/next embedded in pagination to match, we need to "fake" the redux state from the parallel filters reducer
  const filterLikeState = { ...searchApiResponse };
  filterLikeState.si = searchApiResponse.si ? searchApiResponse.si.split(',') : null;
  filterLikeState.selected = organizeSelects(searchApiResponse.filters);
  if (searchApiResponse.currentPage > 1) {
    meta.link.rel.prev = makePageLink(filterLikeState, null, searchApiResponse.currentPage - 2, hasSeoTermPages);
  }

  if (searchApiResponse.currentPage < searchApiResponse.pageCount) {
    meta.link.rel.next = makePageLink(filterLikeState, null, searchApiResponse.currentPage, hasSeoTermPages);
  }

  if (searchApiResponse.totalResultCount < 1 || SLASH_SEARCH_FILTERS_RE.test(searchApiResponse.executedSearchUrl)) {
    meta.meta.name.robots = NO_INDEX_META;
  }
  return enhanceMetaWithIOSAd(enhanceMetaWithAlternates(meta, alternates), marketplace);
};

export const isSimpleMeta = pageType => SIMPLE_PAGE_TYPES.includes(pageType);

export const buildSimplePageMeta = (marketplace, alternates, pageType, relativeLocationString) => {
  const meta = {
    canonical: `${marketplace.desktopBaseUrl}${(relativeLocationString)}`,
    meta: { name: {} }
  };

  // could we do a hash map lookup here instead?
  if (pageType === 'cart') {
    meta.title = `My ${marketplace.cart.cartName}`;
  } else if (pageType === 'subscriptions') {
    meta.title = 'Manage Email Subscriptions';
  } else if (pageType === 'checkout') {
    meta.title = 'Checkout';
  } else if (pageType === 'orders') {
    meta.title = 'Order History';
  } else if (pageType === 'orderInformation') {
    meta.title = 'Order Information';
  } else if (pageType === 'payment') {
    meta.title = 'Manage My Payment Information';
  } else if (pageType === 'address') {
    meta.title = 'Manage My Addresses';
  } else if (pageType === 'egc') {
    meta.title = `Send a ${marketplace.shortName} e-Gift Card`;
  } else if (pageType === 'hmd') {
    meta.title = 'How\'s My Driving Survey';
  } else if (pageType === 'images') {
    meta.meta.name.robots = NO_INDEX_META;
  } else if (pageType === 'favorites') {
    meta.title = 'Your Collections';
  } else if (MY_ACCOUNT_PAGE_TYPES.indexOf(pageType) > -1) {
    meta.title = 'Your Account';
  } else if (pageType === 'returns') {
    meta.title = 'Returns';
  } else if (pageType === 'rewards') {
    meta.title = 'Zappos VIP';
  } else if (pageType === 'outfit') {
    meta.title = 'View Outfit';
    meta.meta.name.robots = 'noindex';
  } else if (pageType === 'influencerhub') {
    meta.title = 'Influencer Hub';
  }
  if (!meta.title) {
    // such as confirmation page type or anything we miss
    meta.title = marketplace.defaultTitle;
  }
  meta.title = buildTitleWithMarketplaceSuffix(marketplace.defaultMeta, meta.title);

  return enhanceMetaWithIOSAd(enhanceMetaWithAlternates(meta, alternates), marketplace);
};

export const buildProductReviewsPageDocMeta = (marketplace, alternates, url, product) => {
  const { defaultMeta, desktopBaseUrl } = marketplace;
  const { brandName, productName, productId } = product;
  const pageTitle = `${brandName} ${productName} Reviews`;
  const meta = {
    title: buildTitleWithMarketplaceSuffix(defaultMeta, pageTitle),
    canonical: `${desktopBaseUrl}/product/review/${productId}`
  };
  return enhanceMetaWithIOSAd(enhanceMetaWithAlternates(meta, alternates), marketplace);
};

export const buildWriteReviewPageDocMeta = (marketplace, alternates, url, product) => {
  const { defaultMeta, desktopBaseUrl } = marketplace;

  let pageTitle = 'Add Review';
  if (product) {
    const { brandName, productName } = product;
    pageTitle = `Add Review for ${brandName} ${productName}`;
  }

  const meta = {
    title: buildTitleWithMarketplaceSuffix(defaultMeta, pageTitle),
    canonical: `${desktopBaseUrl}${url}`
  };
  return enhanceMetaWithIOSAd(enhanceMetaWithAlternates(meta, alternates), marketplace);
};

export const updateCanonicalsAndAlternates = (marketplace, alternates, url, existingDocMeta) => {
  const docMeta = { ...existingDocMeta, canonical: `${marketplace.desktopBaseUrl}${url}` };
  return enhanceMetaWithIOSAd(enhanceMetaWithAlternates(docMeta, alternates), marketplace);
};
