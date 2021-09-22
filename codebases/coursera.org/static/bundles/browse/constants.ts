import _t from 'i18n!nls/browse';

const NUM_ENTRIES_PER_COLLECTION_ON_SERVER = 12;
const NUM_COLLECTIONS_PER_PAGE_ON_SERVER = 6;

const NUM_ENTRIES_PER_COLLECTION_ON_CLIENT = 12;
const NUM_COLLECTIONS_PER_PAGE_ON_CLIENT = 15;

const NUM_ENTRIES_PER_COLLECTION_ON_MOBILE = 12;
const NUM_COLLECTIONS_PER_PAGE_ON_MOBILE = 3;

const BROWSE_ROOT_URL = '/browse';

const CURATED_COLLECTION_PARAMETER = {
  TRENDING_COURSES: 'trendingByEnrollmentsNumericTag',
  TOP_RATED_COURSES: 'ratingNumericTag',
  MOST_POPULAR_CERTIFICATES: 'mostPaidEnrollmentsNumericTag',
  MOST_POPULAR_COURSES: 'mostPopularByEnrollmentsNumericTag',
};

export enum PRODUCT_TYPE_NAMES {
  PROJECT = 'GUIDED PROJECT',
  COURSE = 'COURSE',
  SPECIALIZATION = 'SPECIALIZATION',
  CERTIFICATE = 'CERTIFICATE',
  MASTERTRACK = 'MASTERTRACK',
  DEGREE = 'DEGREE',
}

export const POSTGRADUATE_DIPLOMA_ENTITY_NAME = 'POSTGRADUATE DIPLOMA';

export type ProductTypeName = keyof typeof PRODUCT_TYPE_NAMES;

const getMappedProductTypeToDescription = () => {
  return {
    PROJECT: _t(
      'Learn a job-relevant skill that you can use today in under 2 hours through an interactive experience guided by a subject matter expert. Access everything you need right in your browser and complete your project confidently with step-by-step instructions.'
    ),
    COURSE: _t(
      "Take courses from the world's best instructors and universities. Courses include recorded auto-graded and peer-reviewed assignments, video lectures, and community discussion forums. When you complete a course, you’ll be eligible to receive a shareable electronic Course Certificate for a small fee."
    ),
    SPECIALIZATION: _t(
      'Enroll in a Specialization to master a specific career skill. You’ll complete a series of rigorous courses, tackle hands-on projects, and earn a Specialization Certificate to share with your professional network and potential employers.'
    ),
    CERTIFICATE: _t(
      'Whether you’re looking to start a new career or change your current one, Professional Certificates on Coursera help you become job ready. Learn at your own pace from top companies and universities, apply your new skills to hands-on projects that showcase your expertise to potential employers, and earn a career credential to kickstart your new career.'
    ),
    MASTERTRACK: _t(
      "With MasterTrack® Certificates, portions of Master’s programs have been split into online modules, so you can earn a high quality university-issued career credential at a breakthrough price in a flexible, interactive format. Benefit from a deeply engaging learning experience with real-world projects and live, expert instruction. If you are accepted to the full Master's program, your MasterTrack coursework counts towards your degree."
    ),
    DEGREE: _t(
      "Transform your resume with a degree from a top university for a breakthrough price. Our modular degree learning experience gives you the ability to study online anytime and earn credit as you complete your course assignments. You'll receive the same credential as students who attend class on campus. Coursera degrees cost much less than comparable on-campus programs."
    ),
  };
};

const getMappedProductTypeToDescriptionWithContextualLinks = () => {
  return {
    // this contextual link will be for blue whales to decide what they want to link Rhyme to
    PROJECT: _t(
      'Learn a job-relevant skill that you can use today in under 2 hours through an interactive experience guided by a subject matter expert. Access everything you need right in your browser and complete your project confidently with step-by-step instructions.'
    ),
    COURSE: _t(
      "Learn {domainOrSubdomainName} with online {domainOrSubdomainName} courses. Take courses from the world's best instructors and universities. Courses include recorded auto-graded and peer-reviewed assignments, video lectures, and community discussion forums. When you complete a course, you’ll be eligible to receive a shareable electronic Course Certificate for a small fee."
    ),
    SPECIALIZATION: _t(
      'Learn {domainOrSubdomainName} with online {domainOrSubdomainName} Specializations. Enroll in a Specialization to master a specific career skill. You’ll complete a series of rigorous courses, tackle hands-on projects, and earn a Specialization Certificate to share with your professional network and potential employers.'
    ),
    CERTIFICATE: _t(
      'Whether you’re looking to start a new career or change your current one, {productHubLink} on Coursera help you become job ready. Learn at your own pace from top companies and universities, apply your new skills to hands-on projects that showcase your expertise to potential employers, and earn a career credential to kickstart your new career.'
    ),
    MASTERTRACK: _t(
      "With {productHubLink}, portions of Master’s programs have been split into online modules, so you can earn a high quality university-issued career credential at a breakthrough price in a flexible, interactive format. Benefit from a deeply engaging learning experience with real-world projects and live, expert instruction. If you are accepted to the full Master's program, your MasterTrack coursework counts towards your degree."
    ),
    DEGREE: _t(
      "Transform your resume with {productHubLink} for a breakthrough price. Our modular degree learning experience gives you the ability to study online anytime and earn credit as you complete your course assignments. You'll receive the same credential as students who attend class on campus. Coursera degrees cost much less than comparable on-campus programs."
    ),
  };
};

const constructCourseOrSpecializationContextualLink = (
  productType: string,
  domainSlug: string,
  subdomainId: string | undefined
) => {
  return subdomainId
    ? `/browse/${domainSlug}/${subdomainId}?facets=skillNameMultiTag%2CjobTitleMultiTag%2CdifficultyLevelTag%2Clanguages%2CentityTypeTag%3A${productType}%2CpartnerMultiTag%2CcategoryMultiTag%2CsubcategoryMultiTag%3A${subdomainId}&sortField=`
    : `/browse/${domainSlug}?facets=skillNameMultiTag%2CjobTitleMultiTag%2CdifficultyLevelTag%2Clanguages%2CentityTypeTag%3A${productType}%2CpartnerMultiTag%2CcategoryMultiTag%3A${domainSlug}%2CsubcategoryMultiTag&sortField=`;
};

const getMappedProductTypeToContextualLinks = () => {
  return {
    COURSE: {
      getLabel: (domainOrSubdomainName: string) => _t('Learn #{domainOrSubdomainName}', { domainOrSubdomainName }),
      getHref: (domainSlug: string, subdomainId: string | undefined) =>
        constructCourseOrSpecializationContextualLink('Courses', domainSlug, subdomainId),
    },
    SPECIALIZATION: {
      getLabel: (domainOrSubdomainName: string) => _t('Learn #{domainOrSubdomainName}', { domainOrSubdomainName }),
      getHref: (domainSlug: string, subdomainId: string | undefined) =>
        constructCourseOrSpecializationContextualLink('Specializations', domainSlug, subdomainId),
    },
    CERTIFICATE: {
      label: _t('Professional Certificates'),
      href: '/professional-certificates',
    },
    MASTERTRACK: {
      label: _t('MasterTrack® Certificates'),
      href: '/mastertrack',
    },
    DEGREE: {
      label: _t('an online degree from a top university'),
      href: '/degrees',
    },
    PROJECT: undefined,
  };
};

const SCREEN_TABLET = 768;
const COLLECTION_CAROUSEL_MAX_WIDTH = 1200;
const PRODUCT_CARD_HEIGHT = 400;
const PRODUCT_CARD_HEIGHT_MOBILE = 252 + 5; // to accommodate for the bottom dropshadow
const PRODUCT_CARD_WIDTH = 268;
const PRODUCT_CARD_SQUARE_PARTNER_LOGO_SIDE_LENGTH = 72;
const BANNER_HEIGHT = 220;
const GENERIC_HEADER = 'http://d2j5ihb19pt1hq.cloudfront.net/sdp_page/header_images_2/generic_header.jpg';
const OFFERING_LOADING = 'https://s3.amazonaws.com/coursera_assets/browse/offering_loading.png';
const DEGREE_CARD_HEIGHT = 256;

const ONDEMAND_SPECIALIZATIONS_V1 = 'OnDemandSpecializationsV1';

// for SEO (GR-14325)
const seoMetaTitleExceptions = ['Data Science', 'Machine Learning', 'Entrepreneurship', 'Algorithms', 'Business'];

const productDifficultyLevels: { [level: string]: string } = {
  INTERMEDIATE: 'Intermediate',
  BEGINNER: 'Beginner',
  ADVANCED: 'Advanced',
  MIXED: 'Mixed',
};

// Because difficulty levels from OnDemandSpecializationsV1 are delivered as a readable capitalized string, it's necessary to uppercase the response to match with our constants.

// scale from 1 to 3
const domainBackgroundScoreMap: Record<string, { url: string; bannerUrl: string; score: number }> = {
  'arts-and-humanities': {
    url: 'https://s3.amazonaws.com/coursera_assets/browse/domains/arts_and_humanities.png',
    bannerUrl: 'https://s3.amazonaws.com/coursera_assets/browse/domain-banner/arts_and_humanities.png',
    score: 1,
  },
  business: {
    url: 'https://s3.amazonaws.com/coursera_assets/browse/domains/business.png',
    bannerUrl: 'https://s3.amazonaws.com/coursera_assets/browse/domain-banner/business.png',
    score: 10,
  },
  'computer-science': {
    url: 'https://s3.amazonaws.com/coursera_assets/browse/domains/computer_science.png',
    bannerUrl: 'https://s3.amazonaws.com/coursera_assets/browse/domain-banner/computer_science.png',
    score: 9,
  },
  'data-science': {
    url: 'https://s3.amazonaws.com/coursera_assets/browse/domains/data_science.png',
    bannerUrl: 'https://s3.amazonaws.com/coursera_assets/browse/domain-banner/data_science.png',
    score: 11,
  },
  'information-technology': {
    url: 'https://s3.amazonaws.com/coursera_assets/browse/domains/information_technology.png',
    bannerUrl: 'https://s3.amazonaws.com/coursera_assets/browse/domain-banner/information_technology.png',
    score: 7,
  },
  'life-sciences': {
    url: 'https://s3.amazonaws.com/coursera_assets/browse/domains/health.png',
    bannerUrl: 'https://s3.amazonaws.com/coursera_assets/browse/domain-banner/health.png',
    score: 5,
  },
  'math-and-logic': {
    url: 'https://s3.amazonaws.com/coursera_assets/browse/domains/math_and_logic.png',
    bannerUrl: 'https://s3.amazonaws.com/coursera_assets/browse/domain-banner/math_and_logic.png',
    score: 4,
  },
  'personal-development': {
    url: 'https://s3.amazonaws.com/coursera_assets/browse/domains/personal_development.png',
    bannerUrl: 'https://s3.amazonaws.com/coursera_assets/browse/domain-banner/personal_development.png',
    score: 8,
  },
  'physical-science-and-engineering': {
    url: 'https://s3.amazonaws.com/coursera_assets/browse/domains/physical_science_and_engineering.png',
    bannerUrl: 'https://s3.amazonaws.com/coursera_assets/browse/domain-banner/physical_science_and_engineering.png',
    score: 2,
  },
  'social-sciences': {
    url: 'https://s3.amazonaws.com/coursera_assets/browse/domains/social_sciences.png',
    bannerUrl: 'https://s3.amazonaws.com/coursera_assets/browse/domain-banner/social_sciences.png',
    score: 3,
  },
  'language-learning': {
    url: 'https://s3.amazonaws.com/coursera_assets/browse/domains/language_learning.png',
    bannerUrl: 'https://s3.amazonaws.com/coursera_assets/browse/domain-banner/language_learning.png',
    score: 6,
  },
};

// We don't recommend having a domain map to a list of certificates AND
// degrees because each list will create its own column on explore tab hover over.
const domainsCertificatesMapping = {
  'arts-and-humanities': [],
  business: [],
  'computer-science': [],
  'data-science': [],
  'information-technology': ['google-it-cert'],
  'life-sciences': [],
  'math-and-logic': [],
  'personal-development': [],
  'physical-science-and-engineering': [],
  'social-sciences': [],
  'language-learning': [],
};
// for BrowseCarousel
const responsiveProperty = [
  { breakpoint: 630, settings: { slidesToShow: 1, slidesToScroll: 1, variableWidth: true, infinite: false } },
  { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 2, infinite: false } },
  { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3, infinite: false } },
  { breakpoint: 100000, settings: { slidesToShow: 4, slidesToScroll: 4, infinite: false } },
];
// for careerPlansBrowseCarousel
const careerPlansResponsiveProperty = [
  { breakpoint: 630, settings: { slidesToShow: 1, slidesToScroll: 1, variableWidth: true } },
  { breakpoint: 780, settings: { slidesToShow: 2, slidesToScroll: 2, infinite: false } },
  { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 3, infinite: false } },
  { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 4, infinite: false } },
  { breakpoint: 100000, settings: { slidesToShow: 5, slidesToScroll: 5, infinite: false } },
];

const getDegreeCollectionLabel = (domainName?: string): string => {
  // domain name is translated in backend
  return domainName ? `${_t('Earn Your Degree in')} ${domainName}` : _t('Earn Your Degree');
};

const getMastertrackCollectionLabel = (): string => _t('Explore MasterTrack® Certificates');

const MENU_COLUMN_WIDTH = 280;

const domainToCategoryMapping: Record<string, string> = {
  business: '/degrees/business',
  'computer-science': '/degrees/computer-science',
  'data-science': '/degrees/data-science',
  'information-technology': '/degrees/computer-science',
  'life-sciences': '/degrees/public-health',
  'math-and-logic': '/degrees',
  'social-sciences': '/degrees/public-health',
  degrees: '/degrees',
  certificates: '/professional-certificate',
};

const domainUrlToAcademyUrlMapping = {
  '/browse/data-science': '/academy/data-science',
};

export {
  BROWSE_ROOT_URL,
  CURATED_COLLECTION_PARAMETER,
  NUM_ENTRIES_PER_COLLECTION_ON_SERVER,
  NUM_COLLECTIONS_PER_PAGE_ON_SERVER,
  NUM_ENTRIES_PER_COLLECTION_ON_CLIENT,
  NUM_COLLECTIONS_PER_PAGE_ON_CLIENT,
  NUM_ENTRIES_PER_COLLECTION_ON_MOBILE,
  NUM_COLLECTIONS_PER_PAGE_ON_MOBILE,
  SCREEN_TABLET,
  COLLECTION_CAROUSEL_MAX_WIDTH,
  BANNER_HEIGHT,
  PRODUCT_CARD_HEIGHT,
  PRODUCT_CARD_HEIGHT_MOBILE,
  PRODUCT_CARD_WIDTH,
  PRODUCT_CARD_SQUARE_PARTNER_LOGO_SIDE_LENGTH,
  DEGREE_CARD_HEIGHT,
  GENERIC_HEADER,
  seoMetaTitleExceptions,
  domainBackgroundScoreMap,
  OFFERING_LOADING,
  domainsCertificatesMapping,
  responsiveProperty,
  careerPlansResponsiveProperty,
  getDegreeCollectionLabel,
  MENU_COLUMN_WIDTH,
  ONDEMAND_SPECIALIZATIONS_V1,
  domainToCategoryMapping,
  domainUrlToAcademyUrlMapping,
  productDifficultyLevels,
  getMappedProductTypeToDescription,
  getMappedProductTypeToDescriptionWithContextualLinks,
  getMappedProductTypeToContextualLinks,
  getMastertrackCollectionLabel,
};
