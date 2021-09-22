import React from 'react';
import PropsTypes from 'prop-types';
import _ from 'lodash';
import type BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
import type ApplicationStore from 'bundles/ssr/stores/ApplicationStore';
import getS12nProductLabels from 'bundles/s12n-common/constants/s12nProductLabels';
import Media from 'react-media';
import { isGuidedProject } from 'bundles/program-common/utils/courseUtils';
import epic from 'bundles/epic/client';
import {
  ONDEMAND_SPECIALIZATIONS_V1,
  SCREEN_TABLET,
  POSTGRADUATE_DIPLOMA_ENTITY_NAME,
  PRODUCT_TYPE_NAMES,
  productDifficultyLevels,
} from 'bundles/browse/constants';
import { productVariant } from 'bundles/s12n-common/service/constants';
import { MOBILE_BREAKPOINT_PX } from 'bundles/page/components/global-footer/constants';
import type { InjectedRouter } from 'js/lib/connectToRouter';
import type { DegreeListsV3 } from 'bundles/browse/types/degree-list';
import { config } from 'bundles/browse/components/cds/shared/browseTheme';

import type {
  ProgramCurriculumDomainsQuery_ProgramCurriculumDomainsV1Resource_get_domains as Domain,
  ProgramCurriculumDomainsQuery_SubdomainsV1Resource_getAll_elements as Subdomain,
} from 'bundles/program-home/utils/__generated__/ProgramCurriculumDomainsQuery';

import type {
  DiscoveryCollection,
  DiscoveryCollectionEntity,
} from 'bundles/browse/components/types/DiscoveryCollections';

import { isRightToLeft } from 'js/lib/language';
import _t from 'i18n!nls/browse';

type CourseTypeMetadata = {
  courseTypeMetadata: {
    __typename: string;
  };
};

export function filterUndefined<T>(item: T | undefined | null | false): item is T {
  return !!(item as T);
}

export const getCurrentPageFromRouter = (router: InjectedRouter) => {
  const hasPageQuery: string = router.location.query.page;
  const queryPageNum = Number(hasPageQuery);
  const currentPage: number = queryPageNum > 1 ? queryPageNum : 1;
  return currentPage;
};

export const disableScrolling = (disabled: boolean) => {
  const bodyStyle = document?.body?.style;
  if (bodyStyle) bodyStyle.overflow = disabled ? 'hidden' : 'visible';
};

type Context = {
  getStore?: (storeName: string) => BaseStore;
};

export type PropsFromWithMediaMaxWidthScreenTablet = {
  matches: boolean;
};

export const withMediaMaxWidthScreenTablet = <TProps extends {} = {}>(
  Component: React.ComponentType<TProps & PropsFromWithMediaMaxWidthScreenTablet>
) => {
  const MediaHOC: React.FunctionComponent<TProps> = (props: TProps, { getStore }: Context) => {
    const applicationStore = getStore && (getStore('ApplicationStore') as ApplicationStore);
    const userAgent = applicationStore?.getUserAgent();
    return (
      <Media query={{ maxWidth: SCREEN_TABLET }} defaultMatches={userAgent?.isMobileBrowser}>
        {(matches: boolean) => <Component {...props} matches={matches} />}
      </Media>
    );
  };
  MediaHOC.contextTypes = {
    getStore: PropsTypes.func,
  };
  return MediaHOC;
};

export type PropsFromWithMediaMinWidthMobile = {
  matches: boolean;
};

export const withMediaMinWidthMobile = <TProps extends {} = {}>(
  Component: React.ComponentType<TProps & PropsFromWithMediaMinWidthMobile>
): React.ComponentType<TProps> => {
  const MediaHOC: React.FunctionComponent<TProps> = (props, { getStore }: Context) => {
    const applicationStore = getStore && (getStore('ApplicationStore') as ApplicationStore);
    const userAgent = applicationStore?.getUserAgent();
    return (
      <Media query={{ minWidth: MOBILE_BREAKPOINT_PX }} defaultMatches={!userAgent?.isMobileBrowser}>
        {(matches) => <Component {...props} matches={matches} />}
      </Media>
    );
  };
  MediaHOC.contextTypes = {
    getStore: PropsTypes.func,
  };
  return MediaHOC;
};

export const disableMobileScrolling = (() => {
  let scrollYPosition = 0;
  return (disabled: boolean) => {
    const bodyStyle = document && document.body && document.body.style;
    if (disabled && bodyStyle) {
      scrollYPosition = window.scrollY;
      bodyStyle.position = 'fixed';
    } else if (bodyStyle) {
      bodyStyle.position = '';
      window.scrollTo(0, scrollYPosition);
    }
  };
})();

export const isProductS12n = (
  product: Partial<{
    id: string;
    __typename: string;
    onDemandSpecializationId: string | null;
  }>
): boolean => {
  return product.id === product.onDemandSpecializationId || product.__typename === ONDEMAND_SPECIALIZATIONS_V1;
};

export const isProductProfessionalCertificate = (product: {
  productVariant?: string;
  ProfessionalCertificateS12n?: string;
}): boolean => {
  return product.productVariant === productVariant.ProfessionalCertificateS12n;
};

export const generateMegaMenuDomainUrl = ({
  currentProgramSlug,
  domainSlug,
  subdomainSlug,
}: {
  currentProgramSlug?: string;
  domainSlug?: string;
  subdomainSlug?: string | null;
}) => {
  let generatedUrl = '/browse';

  if (currentProgramSlug) generatedUrl = `/programs/${currentProgramSlug}`;
  if (domainSlug) generatedUrl += `/${domainSlug}`;
  if (domainSlug && subdomainSlug && domainSlug !== subdomainSlug) generatedUrl += `/${subdomainSlug}`;

  return generatedUrl;
};

export type DomainWithSubdomain = Domain & {
  subdomains: {
    elements: Array<Subdomain>;
  };
};

export function injectSubdomainsToDomains(domains: Domain[], subdomains: Subdomain[]): DomainWithSubdomain[] {
  return _.map(domains, (domain): DomainWithSubdomain => {
    return {
      ...domain,
      subdomains: {
        elements: _.filter(subdomains, (subdomain) => domain.subdomainIds.includes(subdomain.id)),
      },
    };
  });
}

export const getProductDifficultyLevelsTranslated = (key: string) => {
  const translations = {
    [productDifficultyLevels.INTERMEDIATE.toUpperCase()]: _t('Intermediate'),
    [productDifficultyLevels.BEGINNER.toUpperCase()]: _t('Beginner'),
    [productDifficultyLevels.ADVANCED.toUpperCase()]: _t('Advanced'),
    [productDifficultyLevels.MIXED.toUpperCase()]: _t('Mixed'),
  };
  return translations[key] || key;
};

export const getTranslatedProductName = (productName?: string) => {
  switch (productName) {
    case PRODUCT_TYPE_NAMES.COURSE:
      return _t('COURSE');
    case PRODUCT_TYPE_NAMES.PROJECT:
      return _t('GUIDED PROJECT');
    case PRODUCT_TYPE_NAMES.SPECIALIZATION:
      return _t('SPECIALIZATION');
    case PRODUCT_TYPE_NAMES.CERTIFICATE:
      return _t('PROFESSIONAL CERTIFICATE');
    case PRODUCT_TYPE_NAMES.MASTERTRACK:
      return _t(`${isRightToLeft(_t.getLocale()) ? '#{R}MASTERTRACK CERTIFICATE' : 'MASTERTRACK#{R} CERTIFICATE'}`, {
        R: String.fromCharCode(174),
      });
    case PRODUCT_TYPE_NAMES.DEGREE:
      return _t('DEGREE');
    case POSTGRADUATE_DIPLOMA_ENTITY_NAME:
      return _t('POSTGRADUATE');
    default:
      return productName;
  }
};

export const getProductCardDisplayProps = (
  product: {
    isRhymeProject?: boolean;
    courseIds?: string[];
    courseTypeMetadata?: CourseTypeMetadata | null;
    ProfessionalCertificateS12n?: string;
    productVariant?: string;
    slug?: string;
  },
  isS12n?: boolean,
  isCDS?: boolean
): {
  cardHref?: string;
  label: string | JSX.Element;
  labelAsText: string;
  gradient?: {
    deg: number;
    start: string;
    end: string;
  };
} => {
  const isProject = product.isRhymeProject || isGuidedProject(product.courseTypeMetadata);
  const isProfessionalCertificate = isProductProfessionalCertificate(product);
  const { SPECIALIZATION_LABEL, PROFESSIONAL_CERTIFICATE_LABEL } = getS12nProductLabels();
  let label: string | JSX.Element;
  let labelAsText: string;
  let gradient: { deg: number; start: string; end: string } | undefined;
  let subpath: string;

  // Order matters - currently Professional Certificates live on the s12n model.
  if (isProfessionalCertificate) {
    label = PROFESSIONAL_CERTIFICATE_LABEL;
    labelAsText = label;
    subpath = 'professional-certificates';
    gradient = {
      deg: 135,
      start: '#046082',
      end: '#046082',
    };
    if (isCDS) {
      gradient = {
        deg: 135,
        start: config.colors.blue900,
        end: config.colors.blue900,
      };
    }
  } else if (isS12n) {
    if (product.courseIds && product.courseIds.length > 0) {
      label = _t('#{specialization} (#{numCourses} Courses)', {
        numCourses: product.courseIds.length,
        specialization: SPECIALIZATION_LABEL,
      });
    } else {
      label = SPECIALIZATION_LABEL;
    }
    labelAsText = label;
    subpath = 'specializations';
    gradient = {
      deg: 135,
      start: '#046082',
      end: '#046082',
    };
    if (isCDS) {
      gradient = {
        deg: 135,
        start: config.colors.purple800,
        end: config.colors.purple800,
      };
    }
  } else if (isProject) {
    labelAsText = _t('Guided Project');
    label = <span style={{ color: '#1859AA' }}>{labelAsText}</span>;
    subpath = 'projects';
  } else {
    label = _t('Course');
    labelAsText = label;
    subpath = 'learn';
  }

  const cardHref = product?.slug && `/${subpath}/${product.slug}`;

  return {
    cardHref,
    label,
    labelAsText,
    gradient,
  };
};

export const getDiscoverCollectionProductCardDisplayProps = (
  product: DiscoveryCollectionEntity,
  isCDS?: boolean
): {
  cardHref?: string;
  label: string | JSX.Element;
  labelAsText: string;
  gradient?: {
    deg: number;
    start: string;
    end: string;
  };
} => {
  const isProject = product.__typename === 'DiscoveryCollections_guidedProject';
  const isProfessionalCertificate = product.__typename === 'DiscoveryCollections_professionalCertificate';
  const isS12n = product.__typename === 'DiscoveryCollections_specialization';
  const { SPECIALIZATION_LABEL, PROFESSIONAL_CERTIFICATE_LABEL } = getS12nProductLabels();
  let label: string | JSX.Element;
  let labelAsText: string;
  let gradient: { deg: number; start: string; end: string } | undefined;
  let subpath: string;

  if (isProfessionalCertificate) {
    label = PROFESSIONAL_CERTIFICATE_LABEL;
    labelAsText = label;
    subpath = 'professional-certificates';
    gradient = {
      deg: 135,
      start: '#046082',
      end: '#046082',
    };
    if (isCDS) {
      gradient = {
        deg: 135,
        start: config.colors.blue900,
        end: config.colors.blue900,
      };
    }
  } else if (isS12n) {
    label = _t('#{specialization} (#{numCourses} Courses)', {
      numCourses: product.__typename === 'DiscoveryCollections_specialization' && product.courseCount,
      specialization: SPECIALIZATION_LABEL,
    });
    labelAsText = label;
    subpath = 'specializations';
    gradient = {
      deg: 135,
      start: '#046082',
      end: '#046082',
    };
    if (isCDS) {
      gradient = {
        deg: 135,
        start: config.colors.purple800,
        end: config.colors.purple800,
      };
    }
  } else if (isProject) {
    labelAsText = _t('Guided Project');
    label = <span style={{ color: '#1859AA' }}>{labelAsText}</span>;
    subpath = 'projects';
  } else {
    label = _t('Course');
    labelAsText = label;
    subpath = 'learn';
  }

  const cardHref = product?.slug && `/${subpath}/${product.slug}`;

  return {
    cardHref,
    label,
    labelAsText,
    gradient,
  };
};

export const retrieveGuidedProjectsUrl = ({ domainSlug }: { domainSlug: string }) =>
  epic.get('Growth', 'domainToGuidedProjectsMapping')[domainSlug];

export const indexToInsertMastertrackCollection = (collections: ({ id?: string } | DegreeListsV3 | undefined)[]) => {
  const indexOfGuidedProject = collections.findIndex(
    (collection) => collection && 'id' in collection && collection?.id?.includes('Rhyme')
  );
  const indexOfMostPopularCourses = collections.findIndex(
    (collection) => collection && 'id' in collection && collection?.id?.includes('mostPopularByEnrollments')
  );
  const indexToInsert =
    (indexOfGuidedProject >= 0 && indexOfGuidedProject + 1) ||
    (indexOfMostPopularCourses >= 0 && indexOfMostPopularCourses + 1);
  return indexToInsert || collections.length;
};

// For use with new DiscoveryCollections resource.
export const indexToInsertMastertracksInDiscoveryCollections = (
  collections: (DiscoveryCollection | DegreeListsV3 | null)[]
) => {
  const indexOfGuidedProject = collections.findIndex(
    (collection) => collection && 'id' in collection && collection?.label.includes('Guided Projects')
  );
  const indexOfMostPopularCourses = collections.findIndex(
    (collection) => collection && 'id' in collection && collection?.id?.includes('mostPopularByEnrollments')
  );
  const indexToInsert =
    (indexOfGuidedProject >= 0 && indexOfGuidedProject + 1) ||
    (indexOfMostPopularCourses >= 0 && indexOfMostPopularCourses + 1);
  return indexToInsert || collections.length;
};

export const retrieveCareerPathCLPAnchorLinks = ({ learningPathSlug }: { learningPathSlug: string }) =>
  epic.get('Growth', 'careerLearningtoCLPAnchorMapping')[learningPathSlug];

export const isDiscoveryCollectionsEnabled = () => {
  return epic.get('GrowthDiscovery', 'discoveryCollectionsEnabled');
};
