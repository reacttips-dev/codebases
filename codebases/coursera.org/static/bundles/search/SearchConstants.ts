/* eslint-disable camelcase */
import _t from 'i18n!nls/search';
import { getCourseraPlusDisplayName } from 'bundles/enroll/utils/courseraPlusUtils';

export const ZERO_STATE_ITEMS_PER_SECTION = 3;
export const RECENT_SEARCHES_LOCAL_STORAGE_NAME = 'recent-searches';
export const RECENTLY_VIEWED_LOCAL_STORAGE_NAME = 'recently-viewed';
export const SEARCH_TABS_NUMBER_OF_RESULTS = 10;
export const SEARCH_TABS_NUMBER_OF_RESULTS_ON_ENTITY_PAGE = 20;
export const SEARCH_RENDER_DELAY = 1200;
export const SEARCH_CAROUSEL_NUMBER_OF_RESULTS = 3;
export const TABLET_SCREEN_WIDTH = 992;
export const FILTER_OVERFLOW_WIDTH = 1023;
export const PROGRAM_HOME_DOMAIN_PAGE_OVERFLOW_WIDTH = 1160;
export const RECENT_ITEM_NUMBER_OF_DAYS_TO_LAST = 7;
export const MOBILE_FILTER_LIMIT = 10;
export const DESKTOP_FILTER_LIMIT = 1000;

export const AUTOCOMPLETE_ICON_SIZE = 16;
export const AUTOCOMPLETE_PHOTO_SIZE = 32;

export const NUMBER_OF_ITEMS_TO_FIT_IN_FILTER_DROPDOWN = 9;

export const ON_SITE_SEARCH_PATH = '/search';
export const NEXTJS_ON_SITE_SEARCH_PATH = '/search-next';
export const SEO_ENTITY_SEARCH_PATH = '/courses';

export const SEARCH_PAGE_INDEX_TYPE_TO_SLUG = {
  all: 'all',
  projects: 'guided-projects',
  degrees: 'degrees',
  learning_paths: 'learning-paths',
};

export const SEARCH_PAGE_SLUG_TO_INDEX_TYPE = (indexType: string) => {
  switch (indexType) {
    case SEARCH_PAGE_INDEX_TYPE_TO_SLUG.all:
      return 'all';
    case SEARCH_PAGE_INDEX_TYPE_TO_SLUG.projects:
      return 'projects';
    case SEARCH_PAGE_INDEX_TYPE_TO_SLUG.degrees:
      return 'degrees';
    case SEARCH_PAGE_INDEX_TYPE_TO_SLUG.learning_paths:
      return 'learning_paths';
    default:
      return '';
  }
};

export const DegreeIcon = {
  imageUrl: 'https://s3.amazonaws.com/coursera_assets/search/assets/hat.png',
  size: AUTOCOMPLETE_ICON_SIZE,
};
export const CareerIcon = {
  imageUrl: 'https://s3.amazonaws.com/coursera_assets/search/assets/collection.png',
  size: AUTOCOMPLETE_ICON_SIZE,
};
export const CourseIcon = {
  imageUrl: 'https://s3.amazonaws.com/coursera_assets/search/assets/course.png',
  size: AUTOCOMPLETE_ICON_SIZE,
};
export const SearchesIcon = {
  imageUrl: 'https://s3.amazonaws.com/coursera_assets/search/assets/Search.png',
  size: AUTOCOMPLETE_ICON_SIZE,
};
export const MasterTrackIcon = {
  imageUrl: 'https://s3.amazonaws.com/coursera_assets/search/assets/hat.png',
  size: AUTOCOMPLETE_ICON_SIZE,
};
export const SpecializationIcon = {
  imageUrl: 'https://s3.amazonaws.com/coursera_assets/search/assets/specialization.png',
  size: AUTOCOMPLETE_ICON_SIZE,
};

export const PLACEHOLDER_ICON_URL = 'https://s3.amazonaws.com/coursera_assets/search/assets/certificate.png';
export const DEFAULT_RESULTS_ICON = 'https://s3.amazonaws.com/coursera_assets/search/assets/degree-zero-state.png';

export const ALGOLIA_APP_ID = 'LUA9B20G37';
// This is a search only API key that is safe to check in
export const ALGOLIA_API_KEY = 'dcc55281ffd7ba6f24c3a9b18288499b';
// NOTE: This index name MUST exist in our Algolia application, we are using an empty index
// as placeholder for this purpose rather than using an existing index in case we delete them later
// given we are using multi-index
export const ALGOLIA_INDEX_NAME = 'DO_NOT_DELETE_PLACEHOLDER_INDEX_NAME';

export const IS_PART_OF_COURSERA_PLUS = 'isPartOfCourseraPlus';

// TODO(htran) remove after UCI APM Contentful migration is done in GNG-1259
export const UCI_APM_OBJECT_ID = 's12n~kLWnFWsyEeeVdhKUpvOPZg';
export const UCI_APM_IMAGE_URL = 'https://s3.amazonaws.com/coursera_assets/search/assets/uci_apm.png';

export const SEARCH_FILTERS = [
  'allLanguages',
  'productDifficultyLevel',
  'productDurationEnum',
  'topic',
  'skills',
  'partners',
  'entityTypeDescription',
];

export const SEARCH_FILTERS_WITH_COURSERA_PLUS = [...SEARCH_FILTERS, IS_PART_OF_COURSERA_PLUS];

type FilterData = {
  getName: () => string;
  getNameMobile: () => string;
  property: string;
  showOutsideOfAllTab: boolean;
};

export const FILTER_INDEX_TO_FILTER_DATA: Record<string, FilterData | undefined> = {
  allLanguages: {
    getName: () => _t('Language'),
    getNameMobile: () => _t('Language'),
    property: 'allLanguages',
    showOutsideOfAllTab: false,
  },
  productDifficultyLevel: {
    getName: () => _t('Level'),
    getNameMobile: () => _t('Level'),
    property: 'productDifficultyLevel',
    showOutsideOfAllTab: false,
  },
  productDurationEnum: {
    getName: () => _t('Duration'),
    getNameMobile: () => _t('Duration'),
    property: 'productDurationEnum',
    showOutsideOfAllTab: false,
  },
  partners: {
    getName: () => _t('Partner'),
    getNameMobile: () => _t('Partner'),
    property: 'partners',
    showOutsideOfAllTab: true,
  },
  skills: {
    getName: () => _t('Skills'),
    getNameMobile: () => _t('Skills'),
    property: 'skills',
    showOutsideOfAllTab: false,
  },
  entityTypeDescription: {
    getName: () => _t('Learning Product'),
    getNameMobile: () => _t('Learning Product'),
    property: 'entityTypeDescription',
    showOutsideOfAllTab: true,
  },
  isPartOfCourseraPlus: {
    getName: () => getCourseraPlusDisplayName(),
    getNameMobile: () => getCourseraPlusDisplayName(),
    property: IS_PART_OF_COURSERA_PLUS,
    showOutsideOfAllTab: true,
  },
  topic: {
    getName: () => _t('Subject'),
    getNameMobile: () => _t('Subject'),
    property: 'topic',
    showOutsideOfAllTab: true,
  },
};

const SEARCH_FILTER_LEARNING_PRODUCT_ORDER = [
  'Courses',
  'Guided Projects',
  'Specializations',
  'Certificates',
  'Professional Certificates',
  'MasterTrack®',
  'MasterTrack® Certificates',
  'Degrees',
];

const getSearchFilterLearningProductTranslations = () => ({
  Courses: _t('Courses'),
  Specializations: _t('Specializations'),
  'Rhyme Projects': _t('Guided Projects'),
  Certificates: _t('Professional Certificates'),
  'Professional Certificates': _t('Professional Certificates'),
  Degrees: _t('Degrees'),
  'MasterTrack®': _t('MasterTrack® Certificates'),
  'MasterTrack® Certificates': _t('MasterTrack® Certificates'),
});

const getSearchFilterLanguageTranslations = () => ({
  English: _t('English'),
  Spanish: _t('Spanish'),
  Russian: _t('Russian'),
  French: _t('French'),
  Arabic: _t('Arabic'),
  'Chinese (China)': _t('Chinese (China)'),
  Vietnamese: _t('Vietnamese'),
  Korean: _t('Korean'),
  German: _t('German'),
  'Portuguese (Brazil)': _t('Portuguese (Brazil)'),
  Turkish: _t('Turkish'),
  Italian: _t('Italian'),
  'Portuguese (Portugal)': _t('Portuguese (Portugal)'),
  Japanese: _t('Japanese'),
  Portuguese: _t('Portuguese'),
  'Chinese (Traditional)': _t('Chinese (Traditional)'),
  Romanian: _t('Romanian'),
  Afrikaans: _t('Afrikaans'),
  Polish: _t('Polish'),
  Tamil: _t('Tamil'),
  Mongolian: _t('Mongolian'),
  Czech: _t('Czech'),
  Chinese: _t('Chinese'),
  Bengali: _t('Bengali'),
  Bulgarian: _t('Bulgarian'),
  Estonian: _t('Estonian'),
  Albanian: _t('Albanian'),
  Slovak: _t('Slovak'),
  Telugu: _t('Telugu'),
  Croatian: _t('Croatian'),
  Nepali: _t('Nepali'),
  Georgian: _t('Georgian'),
  Lithuanian: _t('Lithuanian'),
  Kazakh: _t('Kazakh'),
});

const getSearchFilterLevelTranslations = () => ({
  Beginner: _t('Beginner'),
  Intermediate: _t('Intermediate'),
  Mixed: _t('Mixed'),
  Advanced: _t('Advanced'),
});

const getSearchFilterDurationTranslations = () => ({
  '1-3 Months': _t('1-3 Months'),
  '1-4 Weeks': _t('1-4 Weeks'),
  'Less Than 2 Hours': _t('Less Than 2 Hours'),
  '3+ Months': _t('3+ Months'),
});

export const SEARCH_FILTER_OPTION_ORDER_OVERRIDES: Record<string, string[] | undefined> = {
  entityTypeDescription: SEARCH_FILTER_LEARNING_PRODUCT_ORDER,
};

type SearchFilterOptionItemTranslations = Record<string, Record<string, string | undefined> | undefined>;

export const getSearchFilterOptionItemTranslations = (): SearchFilterOptionItemTranslations => ({
  entityTypeDescription: getSearchFilterLearningProductTranslations(),
  allLanguages: getSearchFilterLanguageTranslations(),
  productDifficultyLevel: getSearchFilterLevelTranslations(),
  productDurationEnum: getSearchFilterDurationTranslations(),
  // unfortunately it's not possible for skills because too many
});

export const COURSERA_PLUS_POPULAR_DOMAINS_MAPPING = [
  { id: 'business', name: 'Business' },
  { id: 'computer-science', name: 'Computer Science' },
  { id: 'data-science', name: 'Data Science' },
  { id: 'life-sciences', name: 'Health' },
  { id: 'information-technology', name: 'Information Technology' },
  { id: 'arts-and-humanities', name: 'Arts and Humanities' },
];
