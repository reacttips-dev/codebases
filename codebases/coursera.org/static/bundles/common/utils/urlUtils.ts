import urlJoin from 'url-join';
import Uri from 'jsuri';
import redirect from 'js/lib/coursera.redirect';
import config from 'js/app/config';
import { RedirectError } from 'bundles/ssr/lib/errors/directives';
import inServerContext from 'bundles/ssr/util/inServerContext';

const domain = new Uri(config.url.base).host().split('.').slice(1).join('.');
export const urlConstants = {
  absoluteDomainRootWithProcotocol: config.url.base,
  domain,
  degreeUrlRoot: 'degrees',
  certificateUrlRoot: 'professional-certificates',
  certificatesUrlRoot: 'certificates',
  mastertrackRoot: 'mastertrack',
  protocol: 'https',
  programRoot: 'teach-program',
  learnerHelpCenterHome: 'https://learner.coursera.help',
  partnerHelpCenterHome: 'https://partner.coursera.help',
} as const;

export const { degreeUrlRoot, certificateUrlRoot, protocol } = urlConstants;

export const getLectureVideoUrl = (courseSlug: string, lectureItemId: string, lectureItemSlug: string): string =>
  urlJoin('/lecture', courseSlug, `${lectureItemSlug}-${lectureItemId}`);

type UrlBuilderFunc = (slug: string, path?: string) => string;

/**
 * Builds an absolute URL.
 * like https://www.coursera.org/
 */
export const buildCanonicalUrl: UrlBuilderFunc = (path = '') => {
  return urlJoin(urlConstants.absoluteDomainRootWithProcotocol, path);
};

/**
 * Builds a URL like /professional-certificate/google-it-support or
 * /professional-certificate/google-it-support/your/extra/path
 */
export const buildProfessionalCertificateUrlRelative: UrlBuilderFunc = (slug, path = '') =>
  urlJoin('/', urlConstants.certificateUrlRoot, slug, path);

/**
 * Builds a URL like https://www.coursera.org/professional-certificate/google-it-support or
 * https://www.coursera.org/professional-certificate/google-it-support/your/extra/path
 */
export const buildProfessionalCertificateUrlAbsolute: UrlBuilderFunc = (slug, path = '') =>
  urlJoin(urlConstants.absoluteDomainRootWithProcotocol, buildProfessionalCertificateUrlRelative(slug, path));

/**
 * Builds a URL like /degrees/imba or /degrees/imba/your/extra/path
 */
export const buildDegreeUrlRelative: UrlBuilderFunc = (slug, path = '') =>
  urlJoin('/', urlConstants.degreeUrlRoot, slug, path);

/**
 * Builds a URL like /degrees/business or /degrees/business/your/extra/path
 */
export const buildDegreeCategoryUrlRelative: UrlBuilderFunc = (category, path = '') =>
  urlJoin('/', urlConstants.degreeUrlRoot, category, path);

/**
 * Builds a URL like https://www.coursera.org/degrees/imba or https://www.coursera.org/degrees/imba/your/extra/path
 */
export const buildDegreeUrlAbsolute: UrlBuilderFunc = (slug, path = '') => {
  return urlJoin(urlConstants.absoluteDomainRootWithProcotocol, buildDegreeUrlRelative(slug, path));
};

/**
 * Builds a URL like /certificates/launch-a-program
 */
export const buildCertificatesUrlRelative: UrlBuilderFunc = (slug, path = '') =>
  urlJoin('/', urlConstants.certificatesUrlRoot, slug, path);

/**
 * Builds a URL like https://www.coursera.org/certificates/launch-a-program or https://www.coursera.org/degrees/imba/your/extra/path
 */
export const buildCertificatesUrlAbsolute: UrlBuilderFunc = (slug, path = '') => {
  return urlJoin(urlConstants.absoluteDomainRootWithProcotocol, buildCertificatesUrlRelative(slug, path));
};

/**
 * Builds a URL for using on external sharing services like email, gplus, facebook, etc.
 * like coursera.org/degrees/imba
 */
export const buildDegreeShareLink: UrlBuilderFunc = (slug, path = '') => {
  return urlJoin(urlConstants.domain, buildDegreeUrlRelative(slug, path));
};

export const buildMastertrackUrlRelative: UrlBuilderFunc = (slug, path = '') =>
  urlJoin('/', urlConstants.mastertrackRoot, slug, path);

/**
 * Builds a URL like https://www.coursera.org/mastertrack/
 */
export const buildMastertrackUrlAbsolute: UrlBuilderFunc = (slug, path = '') => {
  return urlJoin(urlConstants.absoluteDomainRootWithProcotocol, buildMastertrackUrlRelative(slug, path));
};

export const prependUrlProtocolIfNone: (x0: string) => string | null = (path) => {
  if (!path) {
    return null;
  }
  const currentPathHasProtocol = !!new Uri(path).protocol();
  return currentPathHasProtocol ? path : new Uri(path).setProtocol(urlConstants.protocol).toString();
};

/**
 * Builds an URL for teach-program app.
 * like https://www.coursera.org/teach-program/imba/analytics...
 */
export const buildTeachProgramUrl: UrlBuilderFunc = (slug, path = '') => {
  return urlJoin(urlConstants.absoluteDomainRootWithProcotocol, urlConstants.programRoot, slug, path);
};

/**
 * Redirect in server or client environment
 */

export const redirectClientOrServer: (url: string, statusCode?: number) => void = (url, statusCode = 302) => {
  if (inServerContext) {
    throw new RedirectError(statusCode, url);
  } else {
    redirect.setLocation(url);
  }
};

/**
 * @deprecated This builds a Zendesk help URL, but Zendesk has been replaced by Salesforce.    Please use bundles/common/utils/salesforceUrlBuilder.ts and see https://go.dkandu.me/fe-sf-links
 */
export const buildLearnerHelpUrl = (articleId?: string, sectionId?: string) => {
  if (articleId) {
    return `${urlConstants.learnerHelpCenterHome}/hc/articles/${articleId}`;
  } else if (sectionId) {
    return `${urlConstants.learnerHelpCenterHome}/hc/sections/${sectionId}`;
  } else {
    return urlConstants.learnerHelpCenterHome;
  }
};

/**
 * @deprecated This builds a Zendesk help URL, but Zendesk has been replaced by Salesforce.    Please use bundles/common/utils/salesforceUrlBuilder.ts and see https://go.dkandu.me/fe-sf-links
 */
export const buildPartnerHelpUrl = (articleId?: string, categoryId?: string, sectionId?: string): string => {
  if (articleId) {
    return `${urlConstants.partnerHelpCenterHome}/hc/articles/${articleId}`;
  } else if (categoryId) {
    return `${urlConstants.partnerHelpCenterHome}/hc/categories/${categoryId}`;
  } else if (sectionId) {
    return `${urlConstants.partnerHelpCenterHome}/hc/sections/${sectionId}`;
  } else {
    return urlConstants.partnerHelpCenterHome;
  }
};
