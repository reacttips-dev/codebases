import logger from 'js/app/loggerSingleton';
import epic from 'bundles/epic/client';
import { SEO_OVERRIDE_FILE_NAME, TEST_SEO_OVERRIDE_FILE_NAME } from 'bundles/internal-seo/constants';
import { mergeRules, getOverrideRules } from 'bundles/seo/utils/utils';

// The empty rule format need to be kept in sync with the s3 file.
const EMPTY_RULE = {
  regex: [],
  absolute: [],
};

let cachedRules = null;

setInterval(() => {
  cachedRules = null;
}, 1440 * 60 * 1000);

const fetchSeoRules = () => {
  if (cachedRules) {
    return Promise.resolve(cachedRules);
  } else {
    const useTestData = epic.get('SEO', 'useSeoEditorTestFiles');
    const filename = useTestData ? TEST_SEO_OVERRIDE_FILE_NAME : SEO_OVERRIDE_FILE_NAME;
    const SEO_RULE_URL = `https://www.coursera.org/${filename}`;

    // Setting the cache to no-cache so we don't fetch stale data on page refresh after an upload is made in the editor
    return fetch(SEO_RULE_URL, { cache: 'no-cache' }).then(
      (res) => {
        const jsonRules = res.json();
        cachedRules = jsonRules;
        return jsonRules;
      },
      (err) => {
        logger.warn('Could not fetch SEO override rules, returning empty rules.');
        return EMPTY_RULE;
      }
    );
  }
};

const getSeoRules = (location, { dispatch }) => {
  return fetchSeoRules()
    .then((rules) => {
      if (location) {
        const seoRules = getOverrideRules(location, rules);
        dispatch('UPDATE_SEO_RULES', seoRules);
      } else {
        dispatch('UPDATE_SEO_RULES', rules);
      }
    })
    .catch((error) => dispatch('UPDATE_SEO_RULES', EMPTY_RULE));
};

const getSeoRulesForNextApp = () => {
  return fetchSeoRules().catch((error) => EMPTY_RULE);
};

const updateRules = ({ dispatch }, newRules) => {
  dispatch('UPDATE_SEO_RULES', newRules);
};

export { getSeoRules, updateRules, getSeoRulesForNextApp };
