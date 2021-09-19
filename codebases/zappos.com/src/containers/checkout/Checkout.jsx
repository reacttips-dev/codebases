import PropTypes from 'prop-types';
import React, { Component } from 'react';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import throttle from 'lodash.throttle';
import { deepEqual } from 'fast-equals';

import GiftOptions from 'components/checkout/GiftOptions';
import PaymentCouponCode from 'components/checkout/payment/PaymentCouponCode';
import { isAssigned, isInAssignment, triggerAssignment } from 'actions/ab';
import { setHeaderFooterVisibility } from 'actions/headerfooter';
import { onPrimeTwoDayShippingImpression } from 'actions/impressions';
import { onToggleGiftOptions } from 'store/ducks/giftoptions/actions';
import { titaniteView } from 'apis/amethyst';
import { CHECKOUT_PAGE } from 'constants/amethystPageTypes';
import { PageLoader } from 'components/Loader';
import SiteAwareMetadata from 'components/SiteAwareMetadata';
import {
  getNumberOfEligibleShipOptionsFromDeliveryOptions,
  inIframe,
  isDigitalDeliveryOnlyCart,
  isGiftCardOnlyCart,
  isReadyToSubmitCheckout,
  isShippingOptionEligibleForEcoShipping,
  isTwoDayPrimeShippingPerk
} from 'helpers/CheckoutUtils';
import ChargeSummary from 'components/checkout/ChargeSummary';
import OrderTotal from 'components/checkout/OrderTotal/OrderTotal';
import SplitReview from 'containers/checkout/SplitReview';
import PaymentMethod from 'containers/checkout/PaymentMethod';
import ShippingAddress from 'containers/checkout/ShippingAddress';
import UseAsDefaults from 'containers/checkout/UseAsDefaults';
import SectionDivider from 'components/checkout/SectionDivider';
import Note from 'components/checkout/Note';
import FeatureFeedback from 'components/FeatureFeedback';
import TermsAndConditions from 'components/checkout/TermsAndConditions';
import {
  CART_STEP,
  CHECKOUT_STEP_MAP,
  REVIEW_STEP,
  TBD_STEP
} from 'constants/checkoutFlow';
import {
  HYDRA_CHECKOUT_DISCOUNTS,
  HYDRA_CHECKOUT_SHIPPING_DOWNGRADE,
  HYDRA_CHECKOUT_STICKY_PLACE_ORDER,
  HYDRA_ECO_SHIPPING
} from 'constants/hydraTests';
import { isDesktop } from 'helpers/ClientUtils';
import { onEvent, supportsPassiveEventListener } from 'helpers/EventHelpers';
import {
  configurePurchase,
  fetchCheckoutContent,
  onApplyPromo,
  onChangeQuantityEvent,
  onCheckoutJustLoaded,
  onCheckoutPromiseDateHasChanged,
  onCheckoutShipOptionsLoaded,
  onFetchAkitaEstimate,
  onHadConstraintViolation,
  onHadShipOptionAutoSelected,
  onMaxStepIsCartStep,
  onMoveToFavoritesClick,
  onRedeemPoints,
  onRemoveItem,
  onRequestRedeemableRewards,
  onSendToDesiredPage,
  onSendToMaxAvailableStep,
  onToggleItemsEvent,
  onTogglePromoBox,
  onUseShippingDowngradeClick,
  onUseShippingOptionClick,
  onViewEcoShipping,
  placeCheckoutOrder,
  resetCheckout,
  trackCheckoutDeliveryPromise,
  trackEventNotMaxAvailable
} from 'store/ducks/checkout/actions';
import {
  forceAssignAssignNextShipOption
} from 'actions/weblab';
import {
  getCleanPath,
  getStepFromPath
} from 'helpers/CheckoutFlowControl';

import css from 'styles/containers/checkout/checkout.scss';

export class Checkout extends Component {
  componentDidMount() {
    const {
      configurePurchase,
      resetCheckout,
      checkoutData: {
        content,
        isLoaded
      },
      location: { search },
      wasLastPageOrderConfirmation,
      triggerAssignment,
      forceAssignAssignNextShipOption,
      fetchCheckoutContent
    } = this.props;
    const { pid } = queryString.parse(search);
    const {
      marketplace: { checkout: { allowForceSynceOfShipHydraTest } }
    } = this.context;

    titaniteView();

    triggerAssignment(HYDRA_CHECKOUT_STICKY_PLACE_ORDER);
    triggerAssignment(HYDRA_CHECKOUT_SHIPPING_DOWNGRADE);

    const opts = supportsPassiveEventListener() ? { passive: true } : false;

    if (inIframe()) {
      const { setHeaderFooterVisibility } = this.props;
      setHeaderFooterVisibility(false);
    } else {
      onEvent(window, 'resize', throttle(this.onResize, 100), opts, this);
      this.onResize();
    }

    if (wasLastPageOrderConfirmation) {
      return;
    }

    if (isLoaded) {
      resetCheckout();
    }

    if (allowForceSynceOfShipHydraTest) {
      forceAssignAssignNextShipOption();
    }

    if (!content) {
      fetchCheckoutContent();
    }

    configurePurchase({ purchaseId: pid, includePaymentsAndAddresses: true });
  }

  componentDidUpdate(prevProps) {
    const {
      checkoutData: {
        isLoaded: prevIsLoaded,
        purchase: { constraintViolations: prevConstraintViolations = [], shippingAddressId: prevShippingAddressId }
      },
      shipOption: {
        changedPromiseDates: prevChangedPromiseDates,
        isLoaded: prevIsShipOptionsLoaded,
        isLoading: prevIsShipOptionsLoading
      },
      location: { pathname: prevPathname }
    } = prevProps;

    const {
      trackEventNotMaxAvailable,
      onCheckoutJustLoaded,
      onCheckoutPromiseDateHasChanged,
      onMaxStepIsCartStep,
      onSendToDesiredPage,
      onSendToMaxAvailableStep,
      checkoutData: {
        cartType,
        maxAvailableStep,
        isLoaded: nextIsLoaded,
        purchase: { constraintViolations = [], shippingBenefitReason, shippingAddressId: nextShippingAddressId, shipmentSpeed }
      },
      shipOption: {
        changedPromiseDates,
        lineItemDeliveryOptions,
        isLoaded: isShipOptionsLoaded,
        isLoading: isShipOptionsLoading,
        hasAutoSelectedShipOption
      },
      location: { pathname: nextPathname, query },
      isAssignedInShippingDowngrade,
      onCheckoutShipOptionsLoaded,
      onFetchAkitaEstimate,
      onPrimeTwoDayShippingImpression,
      onRequestRedeemableRewards,
      triggerAssignment,
      onViewEcoShipping,
      trackCheckoutDeliveryPromise,
      onHadConstraintViolation,
      configurePurchase,
      onHadShipOptionAutoSelected
    } = this.props;
    const {
      marketplace: {
        checkout: { allowRewardsRedemption, allowEcoShipping },
        hasShippingDowngrades
      }
    } = this.context;
    const isJustLoaded = nextIsLoaded && prevIsLoaded !== nextIsLoaded;
    const isJustGotShippingAddressId = nextShippingAddressId && prevShippingAddressId !== nextShippingAddressId;
    const isJustGotDeliveryOptions = isShipOptionsLoaded && !prevIsShipOptionsLoaded;

    if (isShipOptionsLoaded && !prevIsShipOptionsLoaded) {
      lineItemDeliveryOptions.forEach(deliveryOption => {
        const { deliveryOptions, filteredShipSpeeds = [], isDigitalDelivery, lineItemIds } = deliveryOption;

        // fire Eco Shipping assignment and pageview if atleast 2 ship options are available
        if (allowEcoShipping && (getNumberOfEligibleShipOptionsFromDeliveryOptions(deliveryOption) > 1)) {
          const ecoShippingAssignmentValue = triggerAssignment(HYDRA_ECO_SHIPPING);
          const isAssignedEcoShipping = isInAssignment(ecoShippingAssignmentValue);

          if (isAssignedEcoShipping) {
            onViewEcoShipping();
          }
        }

        if (!hasAutoSelectedShipOption && !isDigitalDelivery && filteredShipSpeeds?.includes(shipmentSpeed)) {
          let optionToUse = {};
          for (let i = deliveryOptions.length - 1; i >= 0; i--) {
            if (deliveryOptions[i].isFiltered === false) {
              optionToUse = deliveryOptions[i];
              break;
            }
          }

          const { id: shipmentOptionId, name } = optionToUse;
          if (shipmentOptionId && name !== shipmentSpeed) {
            onHadShipOptionAutoSelected();
            configurePurchase({ shipmentOptionId, includeShipmentOptions: true, shipmentOptionLineItemIds: lineItemIds, filterShipOptionsOnFirstLoad: true });
          }
        }
      });
    }

    if (!deepEqual(prevConstraintViolations, constraintViolations)) {
      constraintViolations.forEach(({ name }) => {
        onHadConstraintViolation(name);
      });
    }

    if (!nextIsLoaded || !nextPathname.includes('checkout')) {
      return;
    }

    if (isJustGotShippingAddressId) {
      trackCheckoutDeliveryPromise();
    }

    if (isJustLoaded) {
      onCheckoutJustLoaded();

      if (!nextShippingAddressId && !isDigitalDeliveryOnlyCart(cartType)) {
        triggerAssignment(HYDRA_CHECKOUT_DISCOUNTS);
      }

      const isInIframe = inIframe();

      if (isAssignedInShippingDowngrade && hasShippingDowngrades && !isInIframe) {
        onFetchAkitaEstimate();
      }

      if (allowRewardsRedemption && !isInIframe) {
        onRequestRedeemableRewards();
      }

      if (isTwoDayPrimeShippingPerk(shippingBenefitReason)) {
        onPrimeTwoDayShippingImpression(CHECKOUT_PAGE);
      }
    }

    if (maxAvailableStep === CART_STEP) {
      onMaxStepIsCartStep();
      return;
    }

    if (isJustGotDeliveryOptions || (!isShipOptionsLoading && prevIsShipOptionsLoading)) {
      onCheckoutShipOptionsLoaded();
    }

    if (changedPromiseDates?.length && !deepEqual(changedPromiseDates, prevChangedPromiseDates)) {
      changedPromiseDates.forEach(data => onCheckoutPromiseDateHasChanged(data));
    }

    const stepForPrevPath = getStepFromPath(prevPathname);
    const stepForNextPath = getStepFromPath(nextPathname);

    if (stepForNextPath > maxAvailableStep) {
      onSendToMaxAvailableStep(maxAvailableStep);
      return;
    } else if (stepForNextPath !== stepForPrevPath) {
      trackEventNotMaxAvailable(stepForNextPath);
    }

    if (isJustLoaded) {
      const step = stepForNextPath === TBD_STEP ? REVIEW_STEP : stepForNextPath;
      onSendToDesiredPage(step, query);
    }
  }

  componentWillUnmount() {
    const { resetCheckout, setHeaderFooterVisibility } = this.props;
    resetCheckout();
    setHeaderFooterVisibility(true);
    document.body.classList.remove('hideMobileHeader');
    document.body.classList.remove('hideMobileFooter');
  }

  onDeleteItem = e => {
    e.preventDefault();
    const { target: { dataset: { lineItemId } } } = e;
    const quantity = '0';
    const {
      configurePurchase,
      onRemoveItem,
      onChangeQuantityEvent,
      checkoutData: { isFetchingCheckoutData, productsByLineItem },
      giftOptions: { giftMessage }
    } = this.props;

    if (!isFetchingCheckoutData) {
      onRemoveItem();
      onChangeQuantityEvent(quantity, productsByLineItem[lineItemId].quantity, productsByLineItem[lineItemId]);
      const quantityUpdate = { lineItemId, quantity };
      const params = { quantityUpdate, advanceOnSuccess: false };
      if (giftMessage) {
        const options = buildGiftOptions(giftMessage, productsByLineItem, lineItemId); // we store gift message on only 1 item so we must move the message around as items are removed
        params.giftOptions = options;
      }
      configurePurchase(params);
    }
  };

  onChangeQuantity = (e, lineItemId) => {
    const {
      configurePurchase,
      onChangeQuantityEvent,
      checkoutData: { isFetchingCheckoutData, productsByLineItem },
      giftOptions: { giftMessage }
    } = this.props;
    const { target: { value: quantity } } = e;

    if (!isFetchingCheckoutData) {
      onChangeQuantityEvent(quantity, productsByLineItem[lineItemId].quantity, productsByLineItem[lineItemId]);
      const quantityUpdate = { lineItemId, quantity };
      const params = { quantityUpdate, advanceOnSuccess: false };
      if (quantity === '0' && giftMessage) {
        const options = buildGiftOptions(giftMessage, productsByLineItem, lineItemId); // we store gift message on only 1 item so we must move the message around as items are removed
        params.giftOptions = options;
      }
      configurePurchase(params);
    }
  };

  onAddCouponClick = coupon => {
    const { configurePurchase, onApplyPromo } = this.props;
    onApplyPromo();
    configurePurchase({ coupon, advanceOnSuccess: true });
  };

  onRedeemRewardsPoints = spendPoints => {
    this.props.onRedeemPoints(spendPoints);
  };

  onToggleItems = isShown => {
    this.props.onToggleItemsEvent(isShown);
  };

  onPlaceOrderClick = () => {
    const { placeCheckoutOrder } = this.props;
    placeCheckoutOrder();
  };

  onResize = () => {
    const { setHeaderFooterVisibility } = this.props;
    setHeaderFooterVisibility(isDesktop());
  };

  moveToFavoritesClick = ({ currentTarget: { dataset: { asin, lineItemId } } }) => {
    const {
      onMoveToFavoritesClick,
      checkoutData: { productsByLineItem },
      giftOptions: { giftMessage }
    } = this.props;
    const params = { addedFrom: CHECKOUT_PAGE, asin, lineItemId };
    if (giftMessage) {
      const options = buildGiftOptions(giftMessage, productsByLineItem, lineItemId); // we store gift message on only 1 item so we must move the message around as items are removed
      params.giftOptions = options;
    }
    onMoveToFavoritesClick(params);
  };

  onToggleGiftOptionsBox = () => {
    this.props.onToggleGiftOptions();
  };

  onSavingGiftOptions = giftMessage => {
    const { configurePurchase, checkoutData: { isFetchingCheckoutData, productsByLineItem } } = this.props;
    if (isFetchingCheckoutData) {
      return;
    }
    const options = buildGiftOptions(giftMessage, productsByLineItem);
    configurePurchase({ giftOptions: [ ...options ], advanceOnSuccess: false, isSavingGiftOptions: true });
  };

  onRemovingGiftOptions = () => {
    const { configurePurchase, checkoutData: { isFetchingCheckoutData, productsByLineItem } } = this.props;
    if (isFetchingCheckoutData) {
      return;
    }
    const options = [];
    Object.keys(productsByLineItem).forEach(lineItemId => {
      const { quantity } = productsByLineItem[lineItemId];
      const option = {
        quantity,
        lineItemId,
        removeGiftOptions: true,
        giftReceipt: false,
        giftMessage: ''
      };
      options.push(option);
    });
    configurePurchase({ giftOptions: [ ...options ], advanceOnSuccess: false, isRemovingGiftOptions: true, isSavingGiftOptions: true });
  };

  onSelectAndUseShippingOptionClick = (event, shipmentOptionLineItemIds) => {
    const {
      currentTarget: {
        dataset: {
          shippingPromise,
          shipmentSpeed,
          shipmentOptionId
        }
      }
    } = event;

    const {
      configurePurchase,
      checkoutData,
      onUseShippingDowngradeClick,
      onUseShippingOptionClick,
      shipOption: {
        savedShipOptions
      }
    } = this.props;

    if (this.checkIfCanDowngrade() && shipmentSpeed === 'next-wow') {
      const { estimate: { shippingDowngrade } } = checkoutData;

      const shipmentOption = (savedShipOptions || []).find(
        item => item.name === 'next-wow') || false;

      if (shipmentOption) {
        const { points: rewardsPoints, dollar_value: dollarAmount } = shippingDowngrade['next-wow'] || { dollar_value: 0, points: 0 };
        onUseShippingDowngradeClick({ dollarAmount, offeredSpeed: 1, rewardsPoints });
      }
    }

    onUseShippingOptionClick(shippingPromise);
    configurePurchase({ shipmentOptionId, shipmentOptionLineItemIds });
  };

  checkIfCanDowngrade = () => {
    const {
      checkoutData: {
        estimate: { shippingDowngrade },
        purchase: { shipmentSpeed }
      },
      shipOption: { hasNextWow },
      isAssignedInShippingDowngrade
    } = this.props;

    if (!isAssignedInShippingDowngrade) {
      return false;
    }

    const { marketplace: { hasShippingDowngrades } } = this.context;
    const downgradeEstimatePoints = shippingDowngrade['next-wow']?.points;
    return hasShippingDowngrades && shipmentSpeed !== 'next-wow' && hasNextWow && !!downgradeEstimatePoints;
  };

  render() {
    const {
      isAssignedDiscounts,
      isAssignedInShippingDowngrade,
      isStickyPlaceOrder,
      isAssignedEcoShipping,
      giftOptions: { giftMessage },
      checkoutData: {
        cartType,
        content = {},
        asinErrors,
        constraintViolations,
        isEnrolledInRewards,
        isLoading,
        isPlacingOrder,
        showPromoSuccessMessage,
        purchase: {
          chargeSummary = {},
          nameOnAccount,
          shippingAddressId,
          termsAndConditionReminders: {
            inShowGroup: isTermsAndConditionsShown
          } = {}
        },
        isLoaded,
        redeemableRewards,
        spendPointDollarValue,
        spendPoints
      },
      shipOption: {
        lineItemDeliveryOptions
      },
      killswitch: { autoExpandCheckoutGiftOptions, autoExpandCheckoutPromoBox },
      location: { pathname },
      onTogglePromoBox,
      wasLastPageOrderConfirmation,
      rewards: { isRedeemingRewards, redeemingRewardsStatus }
    } = this.props;
    const currentStep = getStepFromPath(pathname);
    const isOrderReadyToSubmit = !isPlacingOrder && !isLoading && isReadyToSubmitCheckout({ currentStep, constraintViolations });
    const { grandTotal } = chargeSummary;
    const isReviewStep = getCleanPath(pathname) === CHECKOUT_STEP_MAP[REVIEW_STEP];

    const { marketplace: { hasShippingDowngrades, checkout: { allowGiftOptions, allowRewardsRedemption, allowFeatureFeedback, allowTermsAndConditionsText, allowEcoShipping } }, testId } = this.context;
    const isEligibleForShippingDowngrade = isAssignedInShippingDowngrade && hasShippingDowngrades;
    const isInIframe = inIframe();
    const showEcoShipping = isAssignedEcoShipping && allowEcoShipping && isShippingOptionEligibleForEcoShipping(lineItemDeliveryOptions);
    const ecoShippingMessaging = content['shipping-downgrade-message'];
    const isGcOnlyCart = isGiftCardOnlyCart(cartType);
    const showAddAddressMessage = isAssignedDiscounts && !shippingAddressId && !isDigitalDeliveryOnlyCart(cartType);

    if (wasLastPageOrderConfirmation) {
      return (
        <div className={css.orderPlaced}>Your order has been placed.  If you wish to modify or cancel it, please do so from your <Link to="/orders">order history</Link>.</div>
      );
    }

    if (!isLoaded) {
      return (
        <>
          <PageLoader />
        </>
      );
    }

    const paymentCouponCodeBody = (<PaymentCouponCode
      isGcOnlyCart={isGcOnlyCart}
      hideRewardsRedemption={!isEnrolledInRewards || !allowRewardsRedemption || inIframe()}
      constraintViolations={constraintViolations}
      isRedeemingRewards={isRedeemingRewards}
      openByDefault={!!autoExpandCheckoutPromoBox}
      onAddCouponClick={this.onAddCouponClick}
      showPromoSuccessMessage={showPromoSuccessMessage}
      onRedeemRewardsPoints={this.onRedeemRewardsPoints}
      onTogglePromoBox={onTogglePromoBox}
      purchaseDataIsLoading={isLoading}
      redeemableRewards={redeemableRewards}
      redeemingRewardsStatus={redeemingRewardsStatus}
      spendPointDollarValue={spendPointDollarValue}
      spendPoints={spendPoints}
      purchaseHasShippingAddress={!!shippingAddressId} />);

    return (
      <SiteAwareMetadata>
        <h1 className="screenReadersOnly">Checkout</h1>
        <div className={css.page}>
          <div className={css.container}>
            <div className={css.spcWrapper}>
              <ShippingAddress />
              <SectionDivider />
              <PaymentMethod />
              <SectionDivider />
              { // re-mount is important!
                isReviewStep && <UseAsDefaults />
              }

              {
                <SplitReview
                  canDowngrade={this.checkIfCanDowngrade()}
                  isReviewStep={isReviewStep}
                  onSelectAndUseShippingOptionClick={this.onSelectAndUseShippingOptionClick}
                  onChangeQuantity={this.onChangeQuantity}
                  onDeleteItem={this.onDeleteItem}
                  isEligibleForShippingDowngrade={isEligibleForShippingDowngrade}
                  onMoveToFavoritesClick={this.moveToFavoritesClick}
                  showFormControls={isReviewStep}
                  showEcoShipping={showEcoShipping}
                  ecoShippingShipOptionMessaging={ecoShippingMessaging?.shippingMessage}
                />
              }
              <SectionDivider />
              {
                !isInIframe && allowFeatureFeedback && <div className={css.feedbackMobile}>
                  <FeatureFeedback
                    additionalFeedbackMessage="Provide Additional Feedback"
                    autoOpenOnYesNoClick={true}
                    feedbackQuestionId="feedbackQuestionMobile"
                    completionMessage="Thank you for the feedback!"
                    feedbackQuestion="Is your checkout experience easy?"
                    feedbackType="CHECKOUT_EXPERIENCE_FEEDBACK"
                    pageType={CHECKOUT_PAGE}
                    source="checkout"
                    responseClass={css.feedbackResponseWrapper}
                  />
                </div>
              }

              <OrderTotal
                isOrderReadyToSubmit={isOrderReadyToSubmit}
                isPlacingOrder={isPlacingOrder}
                isStickyPlaceOrder={isStickyPlaceOrder}
                onPlaceOrderClick={this.onPlaceOrderClick}
                orderTotal={grandTotal} />
              <SectionDivider />
              <Note />
              {showEcoShipping && ecoShippingMessaging &&
              <p className={css.ecoShippingNote}>
                {ecoShippingMessaging.legalFooter}
              </p>
              }
            </div>
            <div>
              <div className={css.chargeSummaryContainer} data-test-id={testId('chargeSummaryContainer')}>
                <div className={css.chargeSummaryWrapper}>
                  <ChargeSummary
                    giftMessage={giftMessage}
                    asinErrors={asinErrors}
                    isOrderReadyToSubmit={isOrderReadyToSubmit}
                    isPlacingOrder={isPlacingOrder}
                    isReviewStep={isReviewStep}
                    isStickyPlaceOrder={isStickyPlaceOrder}
                    onPlaceOrderClick={this.onPlaceOrderClick}
                    showAddAddressMessage={showAddAddressMessage}
                  />
                </div>
                { allowTermsAndConditionsText && isTermsAndConditionsShown && <TermsAndConditions /> }

                <div>
                  {paymentCouponCodeBody}
                </div>

                {
                  allowGiftOptions && <GiftOptions
                    customerName={nameOnAccount}
                    openByDefault={!!autoExpandCheckoutGiftOptions}
                    onToggleBox={this.onToggleGiftOptionsBox}
                    purchaseDataIsLoading={isLoading}
                    onSavingGiftOptions={this.onSavingGiftOptions}
                    onRemovingGiftOptions={this.onRemovingGiftOptions}
                  />
                }
                {
                  !isInIframe && allowFeatureFeedback && <div className={css.feedback}>
                    <FeatureFeedback
                      additionalFeedbackMessage="Provide Additional Feedback"
                      autoOpenOnYesNoClick={true}
                      completionMessage="Thank you for the feedback!"
                      feedbackQuestion="Is your checkout experience easy?"
                      feedbackType="CHECKOUT_EXPERIENCE_FEEDBACK"
                      pageType={CHECKOUT_PAGE}
                      source="checkout"
                      responseClass={css.feedbackResponseWrapper}
                    />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </SiteAwareMetadata>
    );
  }
}

const buildGiftOptions = (giftMessage, productsByLineItem, excludeLineItemId) => {
  const options = [];
  let setGiftMessage = false;

  Object.keys(productsByLineItem).forEach(lineItemId => {
    const { quantity, giftMessagable } = productsByLineItem[lineItemId];

    if (lineItemId !== excludeLineItemId) {
      const option = {
        lineItemId,
        quantity,
        removeGiftOptions: false,
        giftReceipt: giftMessagable
      };

      if (giftMessagable && !setGiftMessage) {
        option.giftMessage = giftMessage;
        setGiftMessage = true;
      }

      options.push(option);
    }
  });
  return options;
};

function mapStateToProps(state) {
  const {
    address,
    checkoutData,
    giftOptions,
    shipOption,
    history: { wasLastPageOrderConfirmation },
    killswitch,
    sharedRewards: rewards,
    routing: { locationBeforeTransitions }
  } = state;
  const isAssignedInShippingDowngrade = isAssigned(HYDRA_CHECKOUT_SHIPPING_DOWNGRADE, 1, state);
  const isStickyPlaceOrder = isAssigned(HYDRA_CHECKOUT_STICKY_PLACE_ORDER, 1, state);
  const isAssignedEcoShipping = isAssigned(HYDRA_ECO_SHIPPING, 1, state);
  const isAssignedDiscounts = isAssigned(HYDRA_CHECKOUT_DISCOUNTS, 1, state);

  return {
    isAssignedDiscounts,
    isAssignedInShippingDowngrade,
    isAssignedEcoShipping,
    isStickyPlaceOrder,
    address,
    killswitch,
    checkoutData,
    giftOptions,
    rewards,
    shipOption,
    wasLastPageOrderConfirmation,
    location: locationBeforeTransitions
  };
}

Checkout.contextTypes = {
  testId: PropTypes.func,
  marketplace: PropTypes.object
};

export default connect(mapStateToProps, {
  onViewEcoShipping,
  onUseShippingDowngradeClick,
  configurePurchase,
  onHadShipOptionAutoSelected,
  onChangeQuantityEvent,
  onCheckoutJustLoaded,
  onCheckoutPromiseDateHasChanged,
  onCheckoutShipOptionsLoaded,
  onFetchAkitaEstimate,
  onMaxStepIsCartStep,
  onMoveToFavoritesClick,
  onPrimeTwoDayShippingImpression,
  onRemoveItem,
  onRequestRedeemableRewards,
  onSendToDesiredPage,
  onSendToMaxAvailableStep,
  onToggleGiftOptions,
  onToggleItemsEvent,
  placeCheckoutOrder,
  resetCheckout,
  setHeaderFooterVisibility,
  onHadConstraintViolation,
  onTogglePromoBox,
  trackCheckoutDeliveryPromise,
  trackEventNotMaxAvailable,
  forceAssignAssignNextShipOption,
  onApplyPromo,
  onUseShippingOptionClick,
  onRedeemPoints,
  fetchCheckoutContent,
  triggerAssignment
})(Checkout);
