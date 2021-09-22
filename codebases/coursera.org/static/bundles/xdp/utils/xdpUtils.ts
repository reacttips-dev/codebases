import _ from 'lodash';
import moment from 'moment';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { BLOCK_TYPES } from 'bundles/xdp/constants/config';
import { RedirectError } from 'bundles/ssr/lib/errors/directives';
import type { CmlContent } from 'bundles/cml/types/Content';

import type { FeaturedInfo } from 'bundles/xdp/constants';
import { getFeaturedData } from 'bundles/xdp/constants';

import ROUTE_CONFIG from 'bundles/xdp/constants/route_config';

import epic from 'bundles/epic/client';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';

import redirect from 'js/lib/coursera.redirect';
import { languageCodeToName } from 'js/lib/language';

import type { Product } from 'bundles/xdp/components/shared/products-slider/ProductsSlider';

import type {
  Degree,
  DifficultyLevel,
  Domain,
  PageBlockData,
  StoredDegree,
  Partner,
} from 'bundles/xdp/types/xdpSharedTypes';
import { ProductVariant } from 'bundles/xdp/types/xdpSharedTypes';

import type { CDPPageQuery_XdpV1Resource_slug_elements_xdpMetadata_XdpV1_cdpMetadataMember_cdpMetadata_material_weeks as CDPWeek } from 'bundles/xdp/components/cdp/__generated__/CDPPageQuery';

import type {
  SDPPageQuery_XdpV1Resource_slug_elements_xdpMetadata_XdpV1_sdpMetadataMember_sdpMetadata_courses as Course,
  SDPPageQuery_XdpV1Resource_slug_elements_xdpMetadata_XdpV1_sdpMetadataMember_sdpMetadata_courses_material_weeks as SDPWeek,
} from 'bundles/xdp/components/__generated__/SDPPageQuery';

import _t from 'i18n!nls/xdp';

const RUNNING_ON_SERVER = typeof window === 'undefined';

type getOrderedBlocksInput = {
  blocks: Array<PageBlockData>;
  pageBlockDataOrders: Array<string>;
};

type getOrderedBlocksOutput = Array<PageBlockData>;

export function getBreadcrumbsFromDomain(domain: Domain | undefined) {
  const routes = [{ path: '/browse', name: _t('Browse') }];

  if (domain && domain.domainId && domain.domainName) {
    routes.push({ path: `/browse/${domain.domainId}`, name: domain.domainName });
  }

  if (domain && domain.subdomainId && domain.subdomainName) {
    routes.push({ path: `/browse/${domain.domainId}/${domain.subdomainId}`, name: domain.subdomainName });
  }
  return routes;
}

export function getBreadcrumbsFromCertificate() {
  const routes = [
    { path: '/certificates', name: _t('Certificates') },
    { path: '/professional-certificates', name: _t('Professional Certificates') },
  ];
  return routes;
}

export function getHoursFromDuration(duration: number) {
  return Math.round(moment.duration(duration).asHours());
}

export function getTotalHoursFromCDPWeeks(weeks: Array<CDPWeek>): number {
  function getTotalDurationFromWeek(week: CDPWeek): number {
    return week.modules.reduce((moduleDuration, module) => {
      return moduleDuration + (module?.totalDuration || 0);
    }, 0);
  }

  const totalDuration = weeks.reduce((weekDuration, week) => {
    return weekDuration + getTotalDurationFromWeek(week);
  }, 0);

  return getHoursFromDuration(totalDuration);
}

export function getTotalHoursFromSDPWeeks(weeks: Array<SDPWeek>): number {
  function getTotalDurationFromWeek(week: SDPWeek): number {
    return week.modules.reduce((moduleDuration, module) => {
      return moduleDuration + (module?.totalDuration || 0);
    }, 0);
  }

  const totalDuration = weeks.reduce((weekDuration, week) => {
    return weekDuration + getTotalDurationFromWeek(week);
  }, 0);

  return getHoursFromDuration(totalDuration);
}

export function getTotalWeeksFromCourses(courses: Array<Course>) {
  return courses.reduce((s12nWeeks, course) => {
    return s12nWeeks + (course?.material?.weeks?.length || 0);
  }, 0);
}

export function getTotalMonthsFromCourses(courses: Array<Course>) {
  const totalWeeks = getTotalWeeksFromCourses(courses);

  return Math.ceil(totalWeeks / 4);
}

export function getHoursPerWeekFromCourses(courses: Array<Course>) {
  const totalS12nHours = courses.reduce((s12nHours, course) => {
    const weeks = course?.material?.weeks;
    return s12nHours + (weeks ? getTotalHoursFromSDPWeeks(weeks) : 0);
  }, 0);
  const totalWeeks = getTotalWeeksFromCourses(courses);

  return Math.round(totalS12nHours / totalWeeks);
}

export function isAppliedProjectManagementCert(s12nId: string) {
  return s12nId === 'kLWnFWsyEeeVdhKUpvOPZg';
}

export function getNaptimeCMLShape(cml: { dtdId: string; value: string }): CmlContent {
  return {
    typeName: 'cml',
    definition: {
      value: cml.value,
      dtdId: cml.dtdId,
    },
  };
}

export function getFeaturedInfo(courseId: string): FeaturedInfo {
  const featuredData = getFeaturedData();
  return featuredData[courseId];
}

export function generateInstructorImageAltValue(instructorName: string | null) {
  return instructorName ? _t('Image of instructor, #{instructorName}', { instructorName }) : _t('Image of instructor');
}

export function shouldShowFeaturedSection(courseIds: Array<string>) {
  const featuredData = getFeaturedData();
  return courseIds.every((courseId) => featuredData[courseId]) && epic.get('XDP', 'featuredSection');
}

export function getLinkProps({
  isS12n,
  isProfessionalCertificate,
  slug,
  query,
}: {
  isS12n?: boolean;
  isProfessionalCertificate?: boolean;
  slug: string;
  query?: Record<string, string>;
}): { to: { pathname: string; query?: Record<string, string> } } {
  let subpath;

  if (isProfessionalCertificate) {
    subpath = ROUTE_CONFIG.PCDP.pathname;
  } else if (isS12n) {
    subpath = ROUTE_CONFIG.SDP.pathname;
  } else {
    subpath = ROUTE_CONFIG.CDP.pathname;
  }

  return { to: { pathname: `/${subpath}/${slug}`, query } };
}

export function addColorHashIfNeeded(color?: string) {
  if (typeof color === 'string' && !color.startsWith('#')) {
    return '#' + color;
  }
  return color;
}

export const getFaqsElementClassNames = () => ({
  wrapper: 'p-t-5 p-b-1 bg-light-blue',
  header: 'headline-4-text bold text-xs-center container-header m-b-5',
  helpLink: 'text-xs-center font-sm',
});

// TODO: This is a duplicate of code in static/bundles/collections/components/CollectionItem.jsx
// Is there a good shared place for these funcs?
export const DIFFICULTY_LEVEL_TO_ICON = {
  BEGINNER: 'SvgLevelBeginner',
  INTERMEDIATE: 'SvgLevelIntermediate',
  ADVANCED: 'SvgLevelAdvanced',
};

export function getDifficultyLevelString(level: DifficultyLevel) {
  // TODO: This means we call _t() 3 times every time this function is called.
  // But we can't put those calls at the module top level because it will cause SSR errors:
  // https://coursera.atlassian.net/wiki/spaces/EN/pages/48169658/Development+Warnings+and+Errors
  // Is this worth addressing performance-wise?
  // In OOP we would make this a class instance variable
  const DIFFICULTY_LEVEL_TO_STRING = {
    BEGINNER: _t('Beginner Level'),
    INTERMEDIATE: _t('Intermediate Level'),
    ADVANCED: _t('Advanced Level'),
  };
  return DIFFICULTY_LEVEL_TO_STRING[level];
}

export function getLanguageString(languagesArray: Array<string>) {
  return languagesArray.map(languageCodeToName).join(', ');
}

export const hexCodeRegex = /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/;

export function getComponentNameByType({
  type,
  componentName: componentNameAlt,
}: {
  type: keyof BLOCK_TYPES;
  componentName: string;
}): string {
  let componentName = type === 'TEMPLATE' ? 'Template' : componentNameAlt;
  if (type === BLOCK_TYPES.SIMPLE || type === BLOCK_TYPES.GRID) {
    componentName = 'CustomBlock';
  }
  return componentName;
}

export function getOrderedBlocks({ blocks, pageBlockDataOrders }: getOrderedBlocksInput): getOrderedBlocksOutput {
  const isPageBlockDataOrderset = pageBlockDataOrders && pageBlockDataOrders.length === blocks.length;
  const blocksObj = _.keyBy(blocks, 'id');
  const orderedBlocks = isPageBlockDataOrderset ? pageBlockDataOrders.map((id) => blocksObj[id]) : blocks;
  return orderedBlocks;
}

// this should be removed after Favo is completely cleaned up
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PageDataType = { apiData: any; uiPageData: any; uiBlockData: any; templateData: any };
export function getPageDataWithOverrides({
  pageData: { apiData = {}, uiPageData = {}, uiBlockData = {}, templateData = {} },
  pageDataOverrides = [],
  versionToDisplay = 'none',
}: {
  pageData: PageDataType;
  pageDataOverrides: Array<{ id: string; name: string; overridePageData: PageDataType }>;
  versionToDisplay?: string;
}) {
  const overrideDataIndexed = _.keyBy(pageDataOverrides, 'name') || {};

  const {
    overridePageData: {
      apiData: apiDataOverride = {},
      uiPageData: uiPageDataOverride = {},
      uiBlockData: uiBlockDataOverride = {},
      templateData: templateDataOverride = {},
    } = {},
  } = overrideDataIndexed[versionToDisplay] || {};

  return {
    apiData: { ...apiData, ...apiDataOverride },
    uiPageData: { ...uiPageData, ...uiPageDataOverride },
    uiBlockData: { ...uiBlockData, ...uiBlockDataOverride },
    templateData: { ...templateData, ...templateDataOverride },
  };
}

export const degreeFromCourseOrS12nMetadata = (metadata: { degrees: Array<StoredDegree> }): Degree | undefined => {
  const { degrees = [] } = metadata;
  const storedDegree: StoredDegree | undefined = degrees.find((degreeData) => {
    const productVariant = degreeData?.degree?.productVariant;

    const isProductUpsell =
      productVariant === ProductVariant.BachelorsDegree ||
      productVariant === ProductVariant.MastersDegree ||
      productVariant === ProductVariant.Mastertrack;

    return isProductUpsell;
  });

  return storedDegree ? storedDegree.degree : undefined;
};

interface PartialReactRouter {
  push: (location: string) => void;
  replace: (location: string) => void;
  location: {
    search: string;
  };
}
type HandleRedirectInput = {
  redirectUrl: string;
  router?: PartialReactRouter;
  isTemporaryRedirect?: boolean;
};

export function handleRedirect({ redirectUrl, router, isTemporaryRedirect }: HandleRedirectInput) {
  if (RUNNING_ON_SERVER) {
    const statusCode = isTemporaryRedirect ? 302 : 301;
    throw new RedirectError(statusCode, redirectUrl);
  } else if (router) {
    router.replace(redirectUrl);
  } else {
    redirect.setLocation(redirectUrl);
  }
}

// Generic console logger for xdp dev.
// TODO(Audrey): remove / consolidate later
export function xdpLogger(message = 'error') {
  // eslint-disable-next-line
  console.error(`MESSAGE: ${message}`);
}

export function orderRecommendations(
  entities: Array<{
    entityId: string;
  }>,
  s12nRecommendations: Array<Product>,
  coursesRecommendations: Array<Product>
): Array<Product | undefined | null> {
  return entities
    .map((entity) =>
      [...s12nRecommendations, ...coursesRecommendations].find((item) => {
        const itemId = item.isS12n || item.isProfessionalCertificate ? 's12n~' + item.id : 'course~' + item.id;
        return itemId === entity.entityId;
      })
    )
    .filter((value) => value);
}

export function formatCourseRecommendations(
  courses: Array<{
    id: string;
    name: string;
    s12ns: { elements: Array<{ id: string }> };
    partners: { elements: Array<Partner> };
    photoUrl: string;
    slug: string;
    courseTypeMetadata: {
      courseTypeMetadata: {
        rhymeProject: {
          typeNameIndex: string;
        };
      };
    };
  }>
): Array<Product> {
  return courses.map(
    ({
      id,
      name: title,
      s12ns: { elements: specializations = [] },
      partners: { elements = [] } = {},
      photoUrl: imageSrc,
      slug,
      courseTypeMetadata,
    }) => {
      const firstPartner: Partner | null = elements.length > 0 ? elements[0] : null;
      return {
        id,
        specializationIds: specializations.length > 0 ? specializations.map((s) => s.id) : [],
        title,
        subtitle: firstPartner && firstPartner.name,
        imageSrc,
        logoSrc: (firstPartner && firstPartner.squareLogo) || null,
        label: courseTypeMetadata.courseTypeMetadata?.rhymeProject?.typeNameIndex
          ? _t('1 Guided Project')
          : _t('1 course'),
        slug,
      };
    }
  );
}

export function formatS12nRecommendations(
  s12ns: Array<{
    id: string;
    name: string;
    productVariant: ProductVariant;
    partners: { elements: Array<Partner> };
    logo: string;
    slug: string;
    courses: {
      paging: { total: number };
    };
  }>
): Array<Product> {
  return s12ns.map(
    ({
      id,
      name: title,
      productVariant,
      partners: { elements = [] } = {},
      logo: imageSrc,
      slug,
      courses: {
        paging: { total: numberOfCourses },
      },
    }) => {
      const firstPartner: Partner | null = elements.length > 0 ? elements[0] : null;
      const { isProfessionalCertificate } = new OnDemandSpecializationsV1({ productVariant });
      return {
        id,
        isS12n: !isProfessionalCertificate,
        isProfessionalCertificate,
        title,
        subtitle: firstPartner && firstPartner.name,
        imageSrc,
        logoSrc: (firstPartner && firstPartner.squareLogo) || null,
        label: _t('#{numberOfCourses} courses', { numberOfCourses }),
        slug,
      };
    }
  );
}
