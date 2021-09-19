import { LOCATION_CHANGE } from 'react-router-redux';

import {
  DISMISS_GLOBAL_BANNER,
  RECEIVE_REMOTE_HF_CONTENT,
  SET_FEDERATED_LOGIN_MODAL_VISIBILITY,
  SET_FOOTER_HISTORY_RECOS,
  SET_GLOBAL_BANNER_DATA,
  SET_HF_DATA,
  SET_HF_DESKTOP_NAV_POSITIONING,
  SET_HF_FOOT_SUBSCRIBE_ERROR,
  SET_HF_FOOT_SUBSCRIBE_SUBMIT,
  SET_HF_MOBILE_BREAKPOINT,
  SET_HF_MOBILE_NAV_POSITIONING,
  SET_HF_OPENED_NAV,
  SET_HF_OPENED_SUBNAV,
  SET_HF_REMOTE,
  SET_HF_SEARCH_SUGGEST,
  SET_HF_SEARCH_SUGGEST_ACTIVE_INDEX,
  SET_HF_SEARCH_TERM,
  SET_HF_SIGN_UP_MODAL,
  SET_HF_TOPBANNER_DATA,
  SHOW_HF_TOP_BANNER,
  TOGGLE_HF,
  TOGGLE_MOBILE_HEADER_EXPAND
} from 'constants/reduxActions';
import {
  CHANCE_OF_SHOWING_UPS_PICKUP, HF_TOPBANNER_CONTENT_TYPE_PHRASES, HF_TOPBANNER_CONTENT_TYPE_REWARDS,
  TIER_INFO
} from 'constants/rewardsInfo';
import { markdownToHtml } from 'helpers/HtmlHelpers';

const STYLEID_FROM_IMAGE_URL_RE = /(\d+)-.+-SQ\.jpg/; // ex. https://www.zappos.com/images/z/4/5/4/9/5/6/4549566-p-SQ.jpg --> 4549566

export const initialState = {
  content: null,
  openedNav: null,
  openedSubNav: null,
  navsThatHaveBeenOpened: [],
  isMobile: null,
  mobileStyles: {
    marginTop: null,
    subCatHeight: null
  },
  desktopStyles: {
    categories: []
  },
  isTopBannerShowing: false,
  isHfVisible: true,
  term: '',
  suggestions: [],
  suggestionIndex: null,
  footerRecos: null,
  isSignUpModalOpen: false,
  isFooterSubscribeSubmitted: false,
  hasFooterSubscribeError: false,
  isRemote: false,
  isMobileHeaderExpanded: false,
  federatedLoginModal: {
    isFederatedLoginModalShowing: false,
    redirectOnClose: undefined,
    returnTo: undefined
  },
  globalBanner: {
    isDismissed: false,
    data: undefined
  }
};

const parseMarkdownAndTemplate = (text, pointsToNextTier) => {
  if (text) {
    return markdownToHtml(`${text.replace('{tierpoints}', pointsToNextTier || '')}`);
  }
  return '';
};

function getRandomRewardEntry(listName, linkListName, tbContent, fallbackListName, fallbackLinkListName) {
  const { phrases, pointsToNextTier } = tbContent;

  let listOfPhrases = [];
  let listOfLinks = [];

  // We must make sure that there is a 1-to-1 correspondence between phrase and link.
  // That's why we don't use the more convenient this || that || whatevs approach.
  if (phrases[listName]) {
    listOfPhrases = phrases[listName];
    listOfLinks = phrases[linkListName] || [];
  } else if (phrases[fallbackListName]) {
    listOfPhrases = phrases[fallbackListName];
    listOfLinks = phrases[fallbackLinkListName] || [];
  } else if (phrases.generic) {
    listOfPhrases = phrases.generic;
    listOfLinks = phrases.genericlink || [];
  }
  const chosenEntry = Math.floor(Math.random() * listOfPhrases.length);
  return {
    text: parseMarkdownAndTemplate(listOfPhrases[chosenEntry], pointsToNextTier),
    link: listOfLinks[chosenEntry] || ''
  };
}

export default function headerFooter(state = initialState, action) {

  const {
    bannerContent,
    bannerType,
    categories,
    data,
    footerRecos,
    hasFooterSubscribeError,
    isHfVisible,
    isMobile,
    isFooterSubscribeSubmitted,
    isRemote,
    isSignUpModalOpen,
    marginTop,
    openedNav,
    openedSubNav,
    payload,
    remoteHf,
    showSigninIncentive,
    subCatHeight,
    suggestions,
    suggestionIndex,
    term,
    type
  } = action;

  switch (type) {
    case SET_HF_DATA:
      return { ...state, content: data };
    case SET_HF_TOPBANNER_DATA:
      const tbContent = { ...state.tbContent };
      if (!tbContent?.chosenPhrase) {
        switch (bannerType) {
          case HF_TOPBANNER_CONTENT_TYPE_PHRASES:
            const phrases = { ...bannerContent };
            if (phrases.genericLink && !phrases.genericlink) { // Temporary.  This if can go away if/when ZCS provides all-lowercase keys.
              phrases.genericlink = phrases.genericLink;
              delete phrases.genericLink;
            }
            tbContent.phrases = phrases;
            break;
          case HF_TOPBANNER_CONTENT_TYPE_REWARDS:
            tbContent.rewards = { data: bannerContent };
            break;
        }

        const { phrases, rewards } = tbContent;

        if (phrases && rewards) {
          // In case there is no rewards data to analyze, pick some generic phrase.
          let phraseGroupLabel = showSigninIncentive ? 'nonloggedin' : 'generic';
          let phraseGroupLink = showSigninIncentive ? 'nonloggedinlink' : 'genericlink';
          let fallbackPhraseGroupLabel;
          let fallbackPhraseGroupLink;
          const { data } = rewards || {};

          if (data) {
            const { tier, pointsToNextTier = 0, spendPoints, benefits = {} } = data;

            // What tier is the customer in?
            const { name: currentTierLabel, start, size = 0, nextTier } = TIER_INFO[tier - 1] || {};

            if (currentTierLabel) {
              let groupLabel;

              // At which point should we tell the customer that they're X points away from the next tier?
              const showMessageBoundary = start + size * 0.5;

              const { upsPickup = false } = benefits;
              if (upsPickup && (Math.random() < CHANCE_OF_SHOWING_UPS_PICKUP)) {
                // If the customer has the UPS Pick-Up benefit, ocassionally remind them.
                groupLabel = 'UPSPickup';
              } else if (
                size &&
                nextTier &&
                pointsToNextTier &&
                spendPoints >= showMessageBoundary
              ) {
                // Customer is close to the next tier.
                groupLabel = `CloseTo${nextTier}`;
                tbContent.pointsToNextTier = pointsToNextTier;
              } else {
                // Customer still has a long way to go.  Show them a phrase related to the tier they are in.
                groupLabel = currentTierLabel;
              }

              phraseGroupLabel = `tiercontent${groupLabel}`;
              phraseGroupLink = `tierlink${groupLabel}`;
              fallbackPhraseGroupLabel = `tiercontent${currentTierLabel}`;
              fallbackPhraseGroupLink = `tierlink${currentTierLabel}`;
            }
          }

          // Let's grab that phrase now.
          tbContent.chosenPhrase = getRandomRewardEntry(phraseGroupLabel, phraseGroupLink, tbContent, fallbackPhraseGroupLabel, fallbackPhraseGroupLink);
        }
      }
      return { ...state, tbContent };
    case SHOW_HF_TOP_BANNER:
      return { ...state, isTopBannerShowing: true };
    case SET_HF_OPENED_NAV:
      return {
        ...state, openedNav,
        navsThatHaveBeenOpened: [ ...state.navsThatHaveBeenOpened, openedNav ]
      };
    case SET_HF_OPENED_SUBNAV:
      return { ...state, openedSubNav };
    case LOCATION_CHANGE:
      // reset necessary parts of state if we change pages
      return {
        ...state,
        hasFooterSubscribeError: false,
        isMobileHeaderExpanded: false,
        isFooterSubscribeSubmitted: false,
        openedNav: null,
        openedSubNav: null,
        suggestionIndex: null,
        suggestions: []
      };
    case SET_HF_MOBILE_BREAKPOINT:
      return { ...state, isMobile };
    case SET_HF_MOBILE_NAV_POSITIONING:
      return { ...state, mobileStyles: { marginTop, subCatHeight } };
    case SET_HF_DESKTOP_NAV_POSITIONING:
      return { ...state, desktopStyles: { categories } };
    case SET_HF_SEARCH_TERM:
      return { ...state, term };
    case SET_HF_SEARCH_SUGGEST:
      return { ...state, suggestions };
    case SET_HF_SEARCH_SUGGEST_ACTIVE_INDEX:
      return { ...state, suggestionIndex };
    case SET_FOOTER_HISTORY_RECOS:
      footerRecos.recs = (footerRecos.recs || [])
        .map(reco => {
          const styleId = (reco.image_SQ?.match(STYLEID_FROM_IMAGE_URL_RE) || [])[1] || null;
          return { ...reco, styleId };
        });
      return { ...state, footerRecos };
    case SET_HF_SIGN_UP_MODAL:
      return { ...state, isSignUpModalOpen };
    case SET_HF_FOOT_SUBSCRIBE_SUBMIT:
      return { ...state, isFooterSubscribeSubmitted, hasFooterSubscribeError: false };
    case SET_HF_FOOT_SUBSCRIBE_ERROR:
      return { ...state, hasFooterSubscribeError, isFooterSubscribeSubmitted: false };
    case SET_HF_REMOTE:
      return { ...state, isRemote };
    case TOGGLE_HF:
      return { ...state, isHfVisible };
    case TOGGLE_MOBILE_HEADER_EXPAND:
      return { ...state, isMobileHeaderExpanded: !state.isMobileHeaderExpanded };
    case SET_FEDERATED_LOGIN_MODAL_VISIBILITY:
      return { ...state, federatedLoginModal: { ...payload } };
    case SET_GLOBAL_BANNER_DATA:
      return { ...state, globalBanner: { ...state.globalBanner, data } };
    case DISMISS_GLOBAL_BANNER:
      return { ...state, globalBanner: { ...state.globalBanner, isDismissed: true } };
    case RECEIVE_REMOTE_HF_CONTENT:
      return { ...state, remoteHf };
    default:
      return state;
  }
}
