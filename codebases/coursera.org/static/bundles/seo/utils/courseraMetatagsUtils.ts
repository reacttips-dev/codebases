import URI from 'jsuri';
import intersection from 'lodash/intersection';
import { CourseraMetatagsProps, LinkRelationAndProperties, OverrideRule } from 'bundles/seo/types';
import { blackListedUrlParameters, blackListedSubdomains, defaultImageHref } from 'bundles/seo/common/constants';
import { supportedLanguageSubdomains, localesWithHomePages, localeToRegionalHomePage } from 'js/lib/language';
import config from 'js/app/config';

import _tPage from 'i18n!nls/page';

type Translate = typeof _tPage;

type InjectedLocation = Location & { query: Record<string, string> };

export const META_DESC_MAX_LEN = 250;
const TWITTER_DESC_MAX_LEN = 60;
// REF http://stackoverflow.com/questions/10805125/how-to-remove-all-line-breaks-from-a-string
const removeLineBreakFromString = (s: string) => s.replace(/(\r\n|\n|\r)/gm, ' ');
const limitDescriptionLength = (s: string, limit = META_DESC_MAX_LEN) => {
  return s.length > limit ? `${s.substring(0, s.lastIndexOf(String.fromCharCode(32), limit - 4) + 1)}...` : s;
};

// pagetest and staging are used for e2e testing edge, behavior should be the same as www
const isSubdomainWWW = (subdomain?: string) =>
  subdomain === 'www' || subdomain === 'pagetest' || subdomain === 'staging';

const isProductPrimaryLanguageOnSupportedLanguageDomain = (productPrimaryLanguage: string, subdomain: string) => {
  if (productPrimaryLanguage === subdomain) {
    return true;
  }

  // We check this because 'en' primary language is served on 'www' subdomain
  if (isSubdomainWWW(subdomain) && productPrimaryLanguage === 'en') {
    return true;
  }

  // Products with primary language of pt-BR i.e Brazilian portuguese should be served under the pt subdomain
  if (subdomain === 'pt' && productPrimaryLanguage === 'pt-BR') {
    return true;
  }

  if (
    isSubdomainWWW(subdomain) &&
    productPrimaryLanguage !== 'pt-BR' &&
    !supportedLanguageSubdomains.includes(productPrimaryLanguage)
  ) {
    // We allow product primary language that are not part of the supported language domains to live on www subdomain
    return true;
  }

  return false;
};

const getPageUrl = (pageHref: string | undefined | null, location: InjectedLocation) => {
  if (!pageHref && (!location.hostname || !location.protocol)) {
    return null;
  }
  const pageURL = pageHref || `https://${location.hostname}${location.pathname}`;

  return pageURL;
};

const getPageSubdomainAndPath = (pageHref: string | undefined | null, location: InjectedLocation) => {
  const pageURL = getPageUrl(pageHref, location);

  if (!pageURL) {
    return null;
  }

  if (pageURL.indexOf('https://coursera.org') >= 0 || !pageURL.includes('.coursera.org')) {
    return null;
  }

  const parsedURL = new URI(pageURL);

  return {
    subdomain: parsedURL.host().split('.')[0],
    path: parsedURL.path(),
  };
};

function getDefaultImageHref() {
  return defaultImageHref;
}

function getMetaDescription(
  _t: Translate,
  props: CourseraMetatagsProps,
  overrideRule: OverrideRule | null | undefined,
  limit?: number
): string {
  const { disableDescLimit, description, descriptionSuffix, disableCourseraDescriptionSuffix } = props;
  if (overrideRule && Object.prototype.hasOwnProperty.call(overrideRule, 'description')) {
    return overrideRule.description;
  }

  const defaultDescription = _t(
    'Learn online and earn valuable credentials from top universities like Yale, Michigan, Stanford, and leading companies like Google and IBM. Join Coursera for free and transform your career with degrees, certificates, Specializations, & MOOCs in data science, computer science, business, and dozens of other topics.'
  );

  const newDescription = description || '';
  const combinedDescription = disableCourseraDescriptionSuffix
    ? newDescription
    : `${newDescription} ${defaultDescription}`;

  const combinedDescriptionWithoutLineBreaks = removeLineBreakFromString(combinedDescription);
  const combinedDescriptionWithLengthLimit = limitDescriptionLength(combinedDescriptionWithoutLineBreaks, limit);
  const combinedDescriptionWithLengthLimitOrLimitWithSuffix = descriptionSuffix
    ? `${combinedDescriptionWithLengthLimit} ${descriptionSuffix}`
    : combinedDescriptionWithLengthLimit;

  return description && !disableDescLimit
    ? combinedDescriptionWithLengthLimitOrLimitWithSuffix
    : combinedDescriptionWithoutLineBreaks.trim();
}

const checkIfPageHasBlackListedUrlParams = (pageUrlParams: Array<string>): boolean => {
  return Boolean(intersection(blackListedUrlParameters, pageUrlParams).length);
};

function generateMetaTitle(
  title: string | undefined | null,
  _t: Translate,
  disableCourseraSuffix: boolean | undefined,
  overrideRule: OverrideRule | null | undefined
): string | undefined {
  if (overrideRule && Object.prototype.hasOwnProperty.call(overrideRule, 'title')) {
    return overrideRule.title;
  }
  const defaultMetaTitle = _t('Coursera | Online Courses & Credentials From Top Educators. Join for Free');
  return disableCourseraSuffix
    ? title || defaultMetaTitle
    : _t('#{title} | Coursera', { title: title || defaultMetaTitle });
}

function generateMetaNameAndProperties(
  _t: Translate,
  props: CourseraMetatagsProps,
  location: InjectedLocation,
  overrideRule: OverrideRule | null | undefined
): Array<{ property?: string; content?: string; name?: string }> {
  const {
    pageHref,
    disableCrawlerIndexing,
    useFollowForDisablingIndexing,
    enableViewportFitCover,
    productPrimaryLanguage,
    ogAndTwitterTitle,
    twitterCardWithLargeImage,
    disableCrawlerIndexingForInternationalSubdomain,
    title,
    disableCourseraSuffix,
    imageHref,
    descriptionLengthLimit,
  } = props;

  // TODO(jzhao): deprecate 'js/lib/metatags' usage
  const metaDescription = getMetaDescription(_t, props, overrideRule, descriptionLengthLimit);
  const twitterMetaDescription = getMetaDescription(_t, props, overrideRule, TWITTER_DESC_MAX_LEN);
  const metaImageHref = imageHref || defaultImageHref;
  // Every meta tag here should also be in page/components/MetatagsWrapper.jsx, where the default is set
  const metaNameAndProperties = [
    { name: 'description', content: metaDescription },
    { name: 'image', content: metaImageHref },
    {
      property: 'og:title',
      content: ogAndTwitterTitle || generateMetaTitle(title, _t, disableCourseraSuffix, overrideRule),
    },
    { property: 'og:description', content: metaDescription },
    { property: 'og:image', content: metaImageHref },
    {
      property: 'twitter:title',
      content: ogAndTwitterTitle || generateMetaTitle(title, _t, disableCourseraSuffix, overrideRule),
    },
    { property: 'twitter:description', content: twitterMetaDescription },
    { property: 'twitter:image:src', content: metaImageHref },
    { property: 'twitter:image', content: metaImageHref },
    { property: 'twitter:card', content: twitterCardWithLargeImage ? 'summary_large_image' : 'summary' },
  ];

  if (enableViewportFitCover) {
    metaNameAndProperties.push({
      property: 'viewport',
      content: 'width=device-width, initial-scale=1, viewport-fit=cover',
    });
  }

  const disableIndex =
    overrideRule && Object.prototype.hasOwnProperty.call(overrideRule, 'disableCrawlerIndexing')
      ? overrideRule.disableCrawlerIndexing
      : disableCrawlerIndexing;

  const useFollowDisableIndex =
    overrideRule && Object.prototype.hasOwnProperty.call(overrideRule, 'useFollowForDisablingIndexing')
      ? overrideRule.useFollowForDisablingIndexing
      : useFollowForDisablingIndexing;

  const pageSubdomainAndPathname = getPageSubdomainAndPath(props.pageHref, location);
  const pageSubdomain = pageSubdomainAndPathname?.subdomain;
  // Check for international subdomain
  const isInternationalSubdomain = !isSubdomainWWW(pageSubdomain);
  const pageHasBlackListedUrlParams = checkIfPageHasBlackListedUrlParams(Object.keys(location.query));

  // We want to disable crawler indexing for product pages with primary languages that does not match the subdomain https://coursera.atlassian.net/browse/GR-21513
  const productPrimaryLanguageOnWrongSubdomain =
    productPrimaryLanguage &&
    pageSubdomainAndPathname &&
    !isProductPrimaryLanguageOnSupportedLanguageDomain(productPrimaryLanguage, pageSubdomainAndPathname.subdomain);

  // This means 'www-origin' and international subdomains are auto disabled to avoid duplicate page entries
  // We also want to disable indexing for pages that have the auth modal params in its URL e.g https://www.coursera.org?authMode=login
  if (
    (pageSubdomain && blackListedSubdomains.includes(pageSubdomain)) ||
    pageHasBlackListedUrlParams ||
    productPrimaryLanguageOnWrongSubdomain ||
    disableIndex ||
    (disableCrawlerIndexingForInternationalSubdomain && isInternationalSubdomain)
  ) {
    metaNameAndProperties.push({
      name: 'robots',
      content: useFollowDisableIndex ? 'noindex, follow' : 'noindex, nofollow',
    });
  }
  if (pageHref) {
    metaNameAndProperties.push({ property: 'og:url', content: pageHref });
  }

  return metaNameAndProperties;
}

const uri = new URI(config.url.base);
const hostWithoutSubdomain = uri.host().split('.').slice(1).join('.');
const originalSubdomain = uri.host().split('.')[0];
const LANGUAGE_DOMAIN_TO_SUBDOMAIN: Record<string, string> = {
  en: originalSubdomain,
  'en-in': originalSubdomain,
};

function generateHref(location: InjectedLocation, languageDomain: string): string {
  const PAGINATION_QUERY_KEY = 'page';
  const { pathname, query, hash } = location;
  const queryString = Object.keys(query)
    .map((key) => {
      // Remove pagination query key from href
      if (key === PAGINATION_QUERY_KEY) return '';
      return `${key}=${key === 'languages' ? languageDomain : query[key]}`;
    })
    .filter((queryStringVal) => !!queryStringVal)
    .join('&');
  const pathQueryAndHash = `${pathname}${queryString ? `?${queryString}` : ''}${hash}`;
  const subdomain = LANGUAGE_DOMAIN_TO_SUBDOMAIN[languageDomain || ''] ?? languageDomain;
  return `https://${subdomain}.${hostWithoutSubdomain}${pathQueryAndHash}`;
}

type AlternateLink = {
  rel: 'alternate';
  hreflang: string;
  href: string;
};

const generateAlternateLink = (location: InjectedLocation, languageDomain: string): AlternateLink => {
  const href = generateHref(location, languageDomain);
  return {
    rel: 'alternate',
    hreflang: languageDomain,
    href,
  };
};

const generateSubdomainsLinks = (location: InjectedLocation): Array<AlternateLink> =>
  // our locale sites are hosted at matching subdomains like es.coursera.org
  supportedLanguageSubdomains.map((languageDomain: string) => generateAlternateLink(location, languageDomain));

const generateRegionalHomePageLinks = (location: InjectedLocation): Array<AlternateLink> => {
  // Our regional landing pages are hosted at pathnames like /in/ at www.coursera.org/in/
  return localesWithHomePages.map((locale: string) => {
    const regionalLocation = { ...location, pathname: localeToRegionalHomePage[locale || ''] };
    return generateAlternateLink(regionalLocation, locale);
  });
};

function generateLinkRelationAndProperties(
  props: CourseraMetatagsProps,
  location: InjectedLocation,
  overrideRule: OverrideRule | null | undefined
): Array<LinkRelationAndProperties> {
  const {
    prevPageHref,
    nextPageHref,
    canonicalLinkHrefOverride,
    disableLanguageSubdomainsLinks,
    includeRegionalHomePageLinks,
    stripPathnameFromHreflangLinks,
    productPrimaryLanguage,
  } = props;

  const linkRelationAndProperties: Array<LinkRelationAndProperties> = [];
  const pageURL = getPageUrl(props.pageHref, location);
  const pageSubdomainAndPathname = getPageSubdomainAndPath(props.pageHref, location);

  // We want to disable language subdomains links for product pages with languages that does not match the subdomain https://coursera.atlassian.net/browse/GR-21513
  const productPrimaryLanguageOnWrongSubdomain =
    productPrimaryLanguage &&
    pageSubdomainAndPathname &&
    !isProductPrimaryLanguageOnSupportedLanguageDomain(productPrimaryLanguage, pageSubdomainAndPathname.subdomain);

  if (!disableLanguageSubdomainsLinks && !productPrimaryLanguage) {
    // When generating tags on a regional home page like www.coursera.org/in/ for India,
    // exclude the pathname (e.g. "/in/") for subdomain languages; "es.coursera.org/in/" wouldn't make sense
    const locationWithRootPathname = { ...location, pathname: '/' };
    const locationForSubdomainsLinks = stripPathnameFromHreflangLinks ? locationWithRootPathname : location;
    const languageSubdomainsLinks = generateSubdomainsLinks(locationForSubdomainsLinks);
    languageSubdomainsLinks.forEach((link) => linkRelationAndProperties.push(link));

    if (includeRegionalHomePageLinks) {
      const regionalHomePageLinks = generateRegionalHomePageLinks(location);
      regionalHomePageLinks.forEach((link) => linkRelationAndProperties.push(link));
    }

    const defaultHref = generateHref(locationForSubdomainsLinks, 'en');
    linkRelationAndProperties.push({
      rel: 'alternate',
      hreflang: 'x-default',
      href: defaultHref,
    });
  }

  const hasOverride =
    overrideRule &&
    Object.prototype.hasOwnProperty.call(overrideRule, 'canonicalLinkHrefOverride') &&
    overrideRule.canonicalLinkHrefOverride;
  let canonicalLinkHref = hasOverride || canonicalLinkHrefOverride;

  if (!canonicalLinkHref && pageURL && productPrimaryLanguageOnWrongSubdomain) {
    const newCanonicalUri = new URI(pageURL);
    let newCanonicalUrlHostName;

    if (productPrimaryLanguage && supportedLanguageSubdomains.includes(productPrimaryLanguage)) {
      newCanonicalUrlHostName = `${
        productPrimaryLanguage === 'en' ? originalSubdomain : productPrimaryLanguage
      }.${hostWithoutSubdomain}`;
    } else if (productPrimaryLanguage === 'pt-BR') {
      newCanonicalUrlHostName = `pt.${hostWithoutSubdomain}`;
    } else {
      newCanonicalUrlHostName = uri.host();
    }

    newCanonicalUri.setHost(newCanonicalUrlHostName);
    canonicalLinkHref = newCanonicalUri.toString();
  }

  if (canonicalLinkHref) {
    linkRelationAndProperties.push({
      rel: 'canonical',
      href: canonicalLinkHref,
    });
  }

  if (prevPageHref) {
    linkRelationAndProperties.push({ rel: 'prev', href: prevPageHref });
  }

  if (nextPageHref) {
    linkRelationAndProperties.push({ rel: 'next', href: nextPageHref });
  }

  return linkRelationAndProperties;
}

export {
  TWITTER_DESC_MAX_LEN,
  removeLineBreakFromString,
  limitDescriptionLength,
  isProductPrimaryLanguageOnSupportedLanguageDomain,
  getMetaDescription,
  checkIfPageHasBlackListedUrlParams,
  generateMetaTitle,
  generateMetaNameAndProperties,
  getPageUrl,
  getPageSubdomainAndPath,
  generateHref,
  generateLinkRelationAndProperties,
  getDefaultImageHref,
};
