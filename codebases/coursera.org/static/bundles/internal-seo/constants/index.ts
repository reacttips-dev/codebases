import { InternalSeoEditorId, TransloaditConfig } from 'bundles/internal-seo/types/sharedTypes';

export const SEO_RULES_EDITOR_ID = 'seoRules';
const SEO_RULES_EDITOR_NAME = 'Metatag Rules';

export const ENTITY_KEYWORDS_EDITOR_ID = 'entityKeywords';
const SEO_ENTITY_KEYWORDS_EDITOR_NAME = 'Entity Keywords';

export const SITEMAP_OVERRIDE_EDITOR_ID = 'sitemapOverrides';
const SITEMAP_OVERRIDE_EDITOR_NAME = 'Sitemap Overrides';

const TRANSLOADIT_KEY = '05912e90e83346abb96c261bf458b615';

export const URL_LOCALES = [
  'www', // English
  'es',
  'de',
  'fr',
  'ja',
  'ko',
  'pt',
  'ru',
  'tr',
  'zh',
  'zh-tw',
];

export const SITEMAP_RESOURCE_TYPES = [
  'index', // Not an actual resource type, but will be used to update our index sitemap.xml files
  'enterprise',
  'pages',
  'courses',
  'course-reviews',
  'collections',
  'instructors',
  'partners',
  'onDemandSpecializations',
  'lectures',
  'domainsAndSubdomains',
  'queries',
  'professional-certificate',
  'university-programs',
  'mastertrack',
  'guided-projects',
];

export const LOCALE_TO_SUBDOMAIN_MAPPING = URL_LOCALES.reduce((acc, currentLocale) => {
  return { ...acc, [currentLocale]: `${currentLocale}.coursera.org` };
}, {});

export const SITEMAP_INPUT_KEYS = {
  resourceType: 'resourceType',
};

// Template IDs are sourced from https://transloadit.com/coursera-inc-prod/templates
export const getTransloaditConfig = (editorId: InternalSeoEditorId, useTestConfig?: boolean): TransloaditConfig => {
  switch (editorId) {
    case ENTITY_KEYWORDS_EDITOR_ID:
      if (useTestConfig) {
        return {
          key: TRANSLOADIT_KEY,
          templateId: '1ba1ae05ff3e4a559749b7e369fe0566',
        };
      }

      return {
        key: TRANSLOADIT_KEY,
        templateId: '923892bf26ff48d9a1c7e4f0018a9413',
      };

    case SEO_RULES_EDITOR_ID:
      if (useTestConfig) {
        return {
          key: TRANSLOADIT_KEY,
          templateId: '6d41047994d340da826153f711a45eba',
        };
      }

      return {
        key: TRANSLOADIT_KEY,
        templateId: '3202578006bd11e8af18993749f06ea2',
      };

    case SITEMAP_OVERRIDE_EDITOR_ID:
      if (useTestConfig) {
        return {
          key: TRANSLOADIT_KEY,
          templateId: 'db3cc4d3b2704694a98aee59aeb25976',
        };
      }

      return {
        key: TRANSLOADIT_KEY,
        templateId: '0307ea835d0e4f57919a9c0b29a1230e',
      };

    default:
      return {
        key: '',
        templateId: '',
      };
  }
};

export const SEO_OVERRIDE_FILE_NAME = 'seo-override.json';
export const TEST_SEO_OVERRIDE_FILE_NAME = 'seo-override-test.json';

export const TEST_SEO_ENTITY_KEYWORDS_FILENAME = 'entityKeywords-test.json';
export const SEO_ENTITY_KEYWORDS_FILENAME = 'entityKeywords.json';

export const TEST_SITEMAP_OVERRIDES_FILENAME = 'sitemap-override-test.json';
export const SITEMAP_OVERRIDES_FILENAME = 'sitemap-override.json';

export const MAX_LINES = 35;
export const DOWNLOADED_SEO_OVERRIDE_FILE_NAME = 'metatag-overrides.json';

export const LOCAL_UPLOAD_MESSAGES = {
  confirmLocalUpload(editorId: InternalSeoEditorId) {
    let editorName;
    let items;

    switch (editorId) {
      case ENTITY_KEYWORDS_EDITOR_ID:
        items = 'keywords';
        editorName = SEO_ENTITY_KEYWORDS_EDITOR_NAME;
        break;

      case SEO_RULES_EDITOR_ID:
        items = 'metatag rules';
        editorName = SEO_RULES_EDITOR_NAME;
        break;

      case SITEMAP_OVERRIDE_EDITOR_ID:
        items = 'overrides';
        editorName = SITEMAP_OVERRIDE_EDITOR_NAME;
        break;

      default:
        items = '';
        editorName = '';
        return '';
    }

    return `Your file contains valid JSON. Clicking "yes" will overwrite the current ${items} visible in the ${editorName} Preview, but will not upload them to S3. Are you sure you want to proceed?`;
  },
  editorContentSet(editorId: InternalSeoEditorId) {
    let editorName;
    let items;

    switch (editorId) {
      case ENTITY_KEYWORDS_EDITOR_ID:
        items = 'entity keywords';
        editorName = SEO_ENTITY_KEYWORDS_EDITOR_NAME;
        break;

      case SEO_RULES_EDITOR_ID:
        items = 'metatag overrides';
        editorName = SEO_RULES_EDITOR_NAME;
        break;

      case SITEMAP_OVERRIDE_EDITOR_ID:
        items = 'sitemap overrides';
        editorName = SITEMAP_OVERRIDE_EDITOR_NAME;
        break;

      default:
        items = '';
        editorName = '';
        return '';
    }

    return `New ${items} written to the ${editorName} Preview. Please verify the above window contains your ${items} and that they are formatted correctly.`;
  },
  editorContentNotSet(editorId: InternalSeoEditorId) {
    let editorName;
    let items;

    switch (editorId) {
      case ENTITY_KEYWORDS_EDITOR_ID:
        items = 'keywords';
        editorName = SEO_ENTITY_KEYWORDS_EDITOR_NAME;
        break;

      case SEO_RULES_EDITOR_ID:
        items = 'overrides';
        editorName = SEO_RULES_EDITOR_NAME;
        break;

      case SITEMAP_OVERRIDE_EDITOR_ID:
        items = 'sitemap overrides';
        editorName = SITEMAP_OVERRIDE_EDITOR_NAME;
        break;

      default:
        items = '';
        editorName = '';
        return '';
    }

    return `Could not set ${items} in the ${editorName} Preview.`;
  },
  INVALID_FILE: 'Your file is either not valid JSON or could not be read. Please upload a valid JSON file.',
} as const;
