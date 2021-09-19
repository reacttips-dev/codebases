import {
  API_ERROR,
  FEEDBACK_CLICK,
  ON_FEDERATED_LOGIN_MODAL_PAGE_VIEW,
  ON_PRIME_TWO_DAY_SHIPPING_IMPRESSION_VIEW
} from 'constants/reduxActions';
import { federatedLoginModalEventMap, isFederatedLoginModalSignInEvent } from 'constants/federatedLoginModalInteractionTypes';
import { middlewareTrack } from 'apis/amethyst';
import { getAmethystPageType, trackEvent, trackLegacyEvent } from 'helpers/analytics';
import {
  CLOSE_LA,
  LOGIN_FROM_LA,
  REDIRECT_FROM_LA,
  SHOW_LA
} from 'store/ducks/loginAssistant/types';
import {
  STORE_REWARDS_TRANSPARENCY_POINTS_FOR_ITEM
} from 'store/ducks/rewards/types';
import {
  cartModalClose,
  cartView,
  modifyQuantity,
  monetateCartView,
  navigateToCheckout,
  removeFromCart,
  viewCartClick
} from 'events/cart';
import {
  CART_PAGEVIEW,
  EVENT_CART_MODAL_CLOSE,
  EVENT_CART_QUANTITY,
  EVENT_MODIFY_QUANTITY,
  EVENT_NAVIGATE_TO_CHECKOUT,
  EVENT_REMOVE_FROM_CART,
  EVENT_VIEW_CART_CLICK
} from 'store/ducks/cart/types';
/*
  Global Events:
  This will allow you to fire events based on client-side actions across the site
*/

const EVENT_CART_MODAL_VIEW = 'EVENT_CART_MODAL_VIEW';

export const cartModalViewEvent = () => ({
  type: EVENT_CART_MODAL_VIEW
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/SentimentFeedback.proto
  *
  * @param {boolean} feedback - Customer input on whether search results were helpful -> this comes from the 'feedback' payload from the Redux action
*/
const evFeedbackClick = (_, { feedback, pageType, feedbackType }) => {
  middlewareTrack({
    sentimentFeedback: {
      pageType,
      feedbackType,
      positive: feedback,
      negative: !feedback
    }
  });
};

const evOnApiError = (_, { pageType, apiErrorType, endpointUrl }) => {
  middlewareTrack({
    apiError: {
      pageType,
      apiErrorType,
      endpointUrl
    }
  });
};

export const evPrimeTwoDayShippingImpression = (_, { pageType }) => {
  middlewareTrack({
    primeTwoDayShippingImpression: {
      pageType
    }
  });
};

const teOnCloseLoginAssistantClick = (appState, { buttonText }) => trackEvent('TE_CLOSE_LA', `buttonText:${buttonText}`);

const teOnLoginFromLoginAssistantClick = (appState, { buttonText, redirectPath = '' }) => trackEvent('TE_LOGIN_FROM_LA', `buttonText:${buttonText}:uri:${redirectPath}`);

const teOnRedirectFromLoginAssistantClick = (appState, { buttonText, redirectPath = '' }) => trackEvent('TE_REDIRECT_FROM_LA', `buttonText:${buttonText}:uri:${redirectPath}`);
const teOnShowLoginAssistant = () => trackEvent('TE_SHOW_LA');

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/LoginAssistantImpression.proto
const evLoginAssistantImpression = appState => {
  const sourcePage = getAmethystPageType(appState.pageView.pageType);
  middlewareTrack({
    loginAssistantImpression:{
      sourcePage
    }
  });
};

const evOnShowRewardsTransparencyPdp = appState => {
  const { cookies: { 'x-main': xMain }, pageView: { pageType }, sharedRewards: { transparencyPointsForItem, isEnrolled } } = appState;

  if (transparencyPointsForItem?.totalPoints?.points) {

    const { totalPoints: { points, dollarValue } } = transparencyPointsForItem;

    // ZFC event
    const recognizedStatus = xMain ? 'recognized' : 'unrecognized';
    const enrolledStatus = isEnrolled ? 'enrolled' : 'unenrolled';
    trackEvent('TE_SHOW_REWARDS_TRANSPARENCY', `${pageType}:${points}:${recognizedStatus}:${enrolledStatus}`);

    // Amethyst event
    middlewareTrack({
      rewardsTransparencyImpression: {
        sourcePage: getAmethystPageType(pageType),
        isEnrolled: !!isEnrolled,
        rewardsPoints: points,
        rewardsDollars: dollarValue
      }
    });
  }
};

const evOnShowRewardsTransparencyCartModal = appState => {
  const { cookies: { 'x-main': xMain }, sharedRewards: { transparencyPointsForCart, isEnrolled } } = appState;

  if (transparencyPointsForCart?.totalPoints?.points) {

    const { totalPoints: { points, dollarValue } } = transparencyPointsForCart;

    // ZFC event
    const recognizedStatus = xMain ? 'recognized' : 'unrecognized';
    const enrolledStatus = isEnrolled ? 'enrolled' : 'unenrolled';
    trackEvent('TE_SHOW_REWARDS_TRANSPARENCY', `cartModal:${points}:${recognizedStatus}:${enrolledStatus}}`);

    // Amethyst event
    middlewareTrack({
      rewardsTransparencyImpression: {
        sourcePage: 'CART_PAGE_MODAL',
        isEnrolled: !!isEnrolled,
        rewardsPoints: points,
        rewardsDollars: dollarValue
      }
    });
  }
};

export const evOnShowRewardsTransparencyClick = ({ isForCartModal, pageType, rewards, rewardsForCurrentPage, isRecognizedCustomer }) => {
  const { isEnrolled, transparencyPointsForCart } = rewards;
  const recognizedStatus = isRecognizedCustomer ? 'recognized' : 'unrecognized';
  const currentRewards = isForCartModal ? transparencyPointsForCart : rewardsForCurrentPage;
  const { totalPoints: { points, dollarValue } = {} } = currentRewards;
  const enrolledStatus = isEnrolled ? 'enrolled' : 'unenrolled';
  const view = isForCartModal ? 'cartModal' : pageType;

  trackEvent('TE_CLICK_REWARDS_TRANSPARENCY', `${view}:${points}:${recognizedStatus}:${enrolledStatus}`);

  return {
    rewardsTransparencyClick: {
      sourcePage: getAmethystPageType(pageType),
      isEnrolled: !!isEnrolled,
      rewardsPoints: points,
      rewardsDollars: dollarValue
    }
  };
};

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/LoginAssistantClick.proto
export const evLoginAssistantClick = (appState, { buttonText, actionType = 'UNKNOWN_LOGIN_ASSISTANT_ACTION_TYPE' }) => {
  const sourcePage = getAmethystPageType(appState.pageView.pageType);
  middlewareTrack({
    loginAssistantClick: {
      sourcePage,
      buttonText,
      actionType
    }
  });
};

// amethyst event: https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/FederatedLoginModalInteraction.proto
export const evFederatedLoginModalInteraction = interactionType => {
  // zfc event
  const interactionEvent = federatedLoginModalEventMap[interactionType];
  if (interactionEvent) {
    trackEvent(interactionEvent);
  }

  if (isFederatedLoginModalSignInEvent(interactionEvent)) {
    trackEvent('TE_HEADER_ACCOUNT_SIGNIN');
    trackLegacyEvent('Main-Nav', 'SignIn', 'LoginRegister');
  }

  middlewareTrack({
    federatedLoginModalInteraction: {
      interactionType
    }
  });
};

// amethyst event: https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/FederatedLoginModalView.proto
export const evOnShowFederatedLoginModal = ({ pageView: { pageType: pageTypeFromState } }, { sourcePageType }) => {
  const sourcePage = getAmethystPageType(sourcePageType || pageTypeFromState);

  // ZFC event
  trackEvent('TE_SHOW_FEDERATED_LOGIN_MODAL');

  // Amethyst event
  middlewareTrack({
    federatedLoginModalView: {
      sourcePage
    }
  });
};

export default {
  events: {
    [FEEDBACK_CLICK]: [evFeedbackClick],
    [CLOSE_LA]: [teOnCloseLoginAssistantClick, evLoginAssistantClick],
    [LOGIN_FROM_LA]: [teOnLoginFromLoginAssistantClick, evLoginAssistantClick],
    [REDIRECT_FROM_LA]: [teOnRedirectFromLoginAssistantClick, evLoginAssistantClick],
    [SHOW_LA]: [teOnShowLoginAssistant, evLoginAssistantImpression],
    [STORE_REWARDS_TRANSPARENCY_POINTS_FOR_ITEM]: [evOnShowRewardsTransparencyPdp],
    [EVENT_CART_MODAL_VIEW]: [evOnShowRewardsTransparencyCartModal],
    [API_ERROR]: [evOnApiError],
    [ON_PRIME_TWO_DAY_SHIPPING_IMPRESSION_VIEW]: [evPrimeTwoDayShippingImpression],
    [EVENT_MODIFY_QUANTITY]: [modifyQuantity],
    [EVENT_REMOVE_FROM_CART]: [removeFromCart],
    [EVENT_CART_QUANTITY]: [monetateCartView],
    [EVENT_NAVIGATE_TO_CHECKOUT]: [navigateToCheckout],
    [CART_PAGEVIEW]: [monetateCartView, cartView],
    [EVENT_VIEW_CART_CLICK]: [viewCartClick],
    [EVENT_CART_MODAL_CLOSE]: [ cartModalClose],
    [ON_FEDERATED_LOGIN_MODAL_PAGE_VIEW]: [evOnShowFederatedLoginModal]
  }
};
