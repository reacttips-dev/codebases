import { sendMonetateEvent } from 'apis/monetate';
import { HOME_PAGE_VIEW, LANDING_PAGE_VIEW } from 'constants/amethyst';

const LANDING_PAGEVIEW = 'LANDING_PAGEVIEW';
/*
  For landing/home page views to get survey and reco impressions.
  Basically loop through slots and see if we have a component
  that is a reco or survey and add it to the impressions.
*/
function impressionCreator(slotData) {
  const surveyComponentNames = ['melodyNewsFeed'];
  let fitSurveyImpression;
  const recos = [];

  if (slotData) {
    Object.keys(slotData).forEach(v => {
      const slot = slotData[v];
      const { componentName } = slot;

      if (surveyComponentNames.includes(componentName)) {
        try {
          const event = JSON.parse(slot.data).events[0];
          fitSurveyImpression = {
            eventId: event.eventId,
            productIdentifiers: {
              asin: event.item.asin
            }
          };
        } catch (e) { /* We tried, just don't send the impression */ }
      }

      if (componentName === 'melodyPersonalizedBrand') {
        recos.push({
          numberOfRecommendations: slot.brands?.length || 0,
          recommendationType: 'BRAND_RECOMMENDATION',
          widgetType: 'BRAND_RECOMMENDATION_WIDGET',
          recommendationSource: 'ZAPPOS_DATA_SCIENCE'
        });
      }

    });
  }
  return {
    fitSurveyImpression,
    recommendationImpression: recos
  };
}

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/HomePageView.proto
  *
  * @param {array} recommendationImpression - List of evRecommendationImpression returned objects. We're using the RecommendationImpressionWrapper to send these async and independent from the view event, so we don't really use this.
  * @param {object} fitSurveyImpression - See evFitSurveyImpression
*/
export const pvHome = ({ slotData }) => {

  const { fitSurveyImpression, recommendationImpression } = impressionCreator(slotData);
  return {
    [HOME_PAGE_VIEW]: {
      recommendationImpression,
      fitSurveyImpression
    }
  };
};

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/LandingPageView.proto
  *
  * @param {string} landingPageType - See proto file for LandingPageType values.
  * Current available values: UNKNOWN_PAGE_TYPE, BRAND_PAGE, VERTICAL
  * @param {string} pageName - Name of page from ZCS API, ex: 'zappos-homepage'
  * @param {array} recommendationImpression - List of evRecommendationImpression returned objects. We're using the RecommendationImpressionWrapper to send these async and independent from the view event, so we don't really use this.
*/
export const pvLanding = ({ slotData, landingPageType = 'UNKNOWN_PAGE_TYPE', pageName }) => {

  const { recommendationImpression } = impressionCreator(slotData);

  return {
    [LANDING_PAGE_VIEW]: {
      landingPageType,
      pageName,
      recommendationImpression
    }
  };
};

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/FitSurveyImpression.proto
  *
  * @param {array} eventId - Explicitly override the field since this proto is re-used with different options in different roots.
  * @param {string} dialogueId - Campaign id. Populate with campaign id that is passed on from Ollivanders stream Impression to be reused in Newsfeed, email and push representations of the fit survey.
  * @param {object} productIdentifiers - Keys: productId, styleId, colorId, stockId, asin
*/
export const evFitSurveyImpression = ({ eventId, dialogueId, productIdentifiers }) => ({
  fitSurveyImpression: {
    eventId,
    dialogueId,
    productIdentifiers
  }
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/FitSurveyResponse.proto
  *
  * @param {string} dialogueId - Campaign id. Populate with campaign id that is passed on from Ollivanders stream Impression to be reused in Newsfeed, email and push representations of the fit survey.
  * @param {object} productIdentifiers - Keys: productId, styleId, colorId, stockId, asin
  * @param {string} fitIndicator - See WebsiteEnums file for options FitSurveyReponse options.
  * Examples: UNKNOWN_FIT_SURVEY_RESPONSE, TOO_SMALL, TOO_BIG, FIT
*/
export const evFitSurveyResponse = ({ dialogueId, productIdentifiers, fitIndicator }) => ({
  fitSurveyResponse: {
    dialogueId,
    productIdentifiers,
    fitIndicator
  }
});

// Parse utm_content qs param to see what the clicked response in the email was
const getFitResponseSize = contentParam => {
  if (contentParam) {
    if (contentParam.includes('small')) {
      return 'TOO_SMALL';
    } else if (contentParam.includes('big')) {
      return 'TOO_BIG';
    } else if (contentParam.includes('perfect')) {
      return 'FIT';
    }
  }
};

// Based on evFitSurveyResponse but uses querystring to infer values
export const evFitSurveyResponseFromUrl = ({ query }) => {
  const { utm_content: contentParam, utm_campaign: dialogueId, asin } = query;
  const fitIndicator = getFitResponseSize(contentParam.toLowerCase());
  return evFitSurveyResponse({ dialogueId, productIdentifiers: { asin }, fitIndicator });
};

export const evVipLwaPromoClick = ({ promoIngress }) => ({
  vipLwaPromoClick: {
    promoIngress
  }
});

export const evVipLwaPromoReturnImpression = ({ isVipEnrolled, isLwaLinked }) => ({
  vipLwaPromoReturnImpression: {
    isVipEnrollSuccessful: isVipEnrolled,
    isLwaLinkSuccessful: isLwaLinked
  }
});

const monetateLandingView = () => {
  sendMonetateEvent(
    ['setPageType', 'landing']
  );
};

export default {
  pageEvent: LANDING_PAGEVIEW,
  events: {
    [LANDING_PAGEVIEW]: [monetateLandingView]
  }
};
