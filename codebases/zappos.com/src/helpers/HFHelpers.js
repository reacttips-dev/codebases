import { desktopBaseUrl } from 'cfg/marketplace.json';

// Urls are relative in dev but absolute in prod for external consumers

export const createJsTag = (url, isMartyEnvProduction) => `<script src="${isMartyEnvProduction ? desktopBaseUrl : ''}${url}"></script>`;

export const createCssTag = (url, isMartyEnvProduction) => `<link href="${isMartyEnvProduction ? desktopBaseUrl : ''}${url}" rel="stylesheet"/>`;

export const createInlineCssTag = css => `<style>${css}</style>`;

export const createHfAssets = (webpackAssets, isNodeEnvProduction, isMartyEnvProduction) => {
  const { assets, styles, javascript } = webpackAssets;
  let endpointScripts = '', endpointStyles = '';
  if (isNodeEnvProduction) {
    // We compile our styles differently in prod vs dev
    endpointStyles += createCssTag(styles.hfRemote, isMartyEnvProduction);
  } else {
    Object.keys(assets).forEach(v => {
      if (v.substr(v.length - 5) === '.scss' && assets[v]._style) {
        endpointStyles += createInlineCssTag(assets[v]._style);
      }
    });
  }

  endpointScripts += createJsTag(javascript.vendor, isMartyEnvProduction);
  endpointScripts += createJsTag(javascript.hfRemote, isMartyEnvProduction);

  return { endpointStyles, endpointScripts };
};

export const getSearchInputValue = (term, suggestionIndex, suggestions) => {
  if (typeof suggestionIndex === 'number' && suggestions?.length) {
    const suggestion = suggestions[suggestionIndex];
    const { categories } = suggestion;
    if (suggestion?.searchUrl) {
      return '';
    } else if (categories?.length && suggestionIndex === 0) {
      return `${suggestion.suggestion} in ${categories[0]}`;
    } else if (typeof suggestion === 'object') {
      return `${suggestion.suggestion}`;
    } else {
      return `${suggestion}`;
    }
  }
  return term;
};

export const isDisplayPhraseDataEqual = (displayPhraseData1, displayPhraseData2) => {
  if (displayPhraseData1 && !displayPhraseData2 ||
      !displayPhraseData1 && displayPhraseData2) {
    return false;
  }

  const { link: link1 = '', text: text1 = '' } = displayPhraseData1 || {};
  const { link: link2 = '', text: text2 = '' } = displayPhraseData2 || {};
  return link1 === link2 && text1 === text2;
};

/*
 * overwriteNavItem()
 *
 * Always returns a navigation object.
 * <First clause>: If assignment node is an object, return that nav object for overwrite.
 * <Second clause>: If assignment node equals `DoNotRender`, set text to blank string and return nav.
 * Header nav logic says if there is no text belonging to a nav item, don't render it.
 * <Defaut>: Return nav object.
 *
 * overwriteSubNavItems()
 *
 * If the test treatment is an object, then return overwriteSubNavItems
 * or return undefined
 */

const isValidTestTreatment = (index, state) => state && state[index] && !!state[index].treatment;
const treatmentExistsAndIsObject = (index, state) => isValidTestTreatment(index, state) && typeof state[index].treatment === 'object';

export function overwriteNavItem(nav, state, index) {
  if (treatmentExistsAndIsObject(index, state)) {
    return state[index].treatment;
  } else if (isValidTestTreatment(index, state) && state[index].treatment === 'DoNotRender') {
    nav.text = '';
  }
  return nav;
}

export function overwriteSubNavItems(index, state) {
  if (treatmentExistsAndIsObject(index, state)) {
    return state[index].treatment.subNavMenuItems;
  }
  return undefined;
}
