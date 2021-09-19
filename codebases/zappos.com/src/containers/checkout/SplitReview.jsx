import { connect } from 'react-redux';
import cn from 'classnames';

import { getNumberOfEligibleShipOptionsFromDeliveryOptions, isDigitalCart, isDigitalDeliveryOnlyCart } from 'helpers/CheckoutUtils';
import ShippingOptionGroupWithDates from 'components/checkout/splitReview/ShippingOptionGroupWithDates';
import ReviewGroup from 'components/checkout/splitReview/ReviewGroup';
import useMartyContext from 'hooks/useMartyContext';
import SectionTitle from 'components/checkout/SectionTitle';

import css from 'styles/containers/checkout/splitReview.scss';

export const SplitReview = props => {
  const {
    checkoutData:{
      cartType,
      digitalItemLineItemId,
      productsByLineItem,
      selectedShipOptionId,
      asinErrors,
      constraintViolations,
      isLoading: isFetchingCheckoutData
    },
    isReviewStep,
    onChangeQuantity,
    onDeleteItem,
    onMoveToFavoritesClick,
    onSelectAndUseShippingOptionClick,
    shipOption: { lineItemDeliveryOptions = [] } = {},
    showEcoShipping,
    showFormControls,
    ecoShippingShipOptionMessaging
  } = props;

  const { marketplace: { checkout: { allowMoveToFavorites } } } = useMartyContext();
  const hasDigitalItem = isDigitalCart(cartType);
  const isOnlyDigitalDelivery = isDigitalDeliveryOnlyCart(cartType);
  const allLineItemIds = Object.keys(productsByLineItem);

  const groupDetails = {
    allowMoveToFavorites,
    asinErrors,
    constraintViolations,
    onChangeQuantity,
    onDeleteItem,
    onMoveToFavoritesClick
  };

  if (!lineItemDeliveryOptions.length) {
    return (
      <>
        <SectionTitle
          isActive={false}
          id="split-review-section"
          isComplete={false}
          step="3"
          title="Item Review and Shipping" />
          <div className={css.groupsNoOptions}>
            <div className={cn(css.deliveryGroup, { [css.updating]: isFetchingCheckoutData })}>
              <div>
                <ReviewGroup
                  groupDetails={groupDetails}
                  isForEGC={isOnlyDigitalDelivery}
                  lineItemIds={allLineItemIds}
                  productsByLineItem={productsByLineItem}
                  showFormControls={showFormControls}
                  showItemLevelErrors={isOnlyDigitalDelivery}
                />
              </div>
              {
                isOnlyDigitalDelivery
                  ? <ShippingOptionGroupWithDates
                    isForEGC={true}
                    numShipments={1}
                    onSelectAndUseShippingOptionClick={f => f}
                    selectedShipOptionId={selectedShipOptionId}
                    shipmentNumber={1}
                  />
                  : <div>
                    <div className={css.noOptions}>
                      Please add or select a shipping address to view delivery options.
                    </div>
                  </div>
              }
            </div>
          </div>
      </>
    );
  }

  return (
    <>
    <SectionTitle
      isActive={isReviewStep}
      id="split-review-section"
      isComplete={true}
      step="3"
      title="Item Review and Shipping" />
      <div className={css.groups}>
        {
          lineItemDeliveryOptions.map((lineItemDeliveryOption, i) => {
            const { deliveryOptions, lineItemIds, purchaseDelivery } = lineItemDeliveryOption;
            const isForEGC = deliveryOptions.length === 0 && lineItemIds[0] === digitalItemLineItemId;
            const showEcoShippingEvenAfterFiltering = showEcoShipping && (getNumberOfEligibleShipOptionsFromDeliveryOptions(lineItemDeliveryOption) > 1);
            return (
              <div className={cn(css.deliveryGroup, { [css.updating]: isFetchingCheckoutData, [css.withTopBorder]: i > 0 })} key={lineItemIds.join('')}>
                <div>
                  <ReviewGroup
                    groupDetails={groupDetails}
                    isForEGC={isForEGC}
                    lineItemIds={lineItemIds}
                    productsByLineItem={productsByLineItem}
                    showFormControls={showFormControls}
                    showItemLevelErrors={isReviewStep}
                  />
                </div>
                <div>
                  <ShippingOptionGroupWithDates
                    deliveryOptions={deliveryOptions}
                    isForEGC={isForEGC}
                    numShipments={hasDigitalItem ? lineItemDeliveryOptions.length - 1 : lineItemDeliveryOptions.length}
                    onSelectAndUseShippingOptionClick={e => onSelectAndUseShippingOptionClick(e, lineItemIds)}
                    purchaseDelivery={purchaseDelivery}
                    selectedShipOptionId={selectedShipOptionId}
                    shipmentNumber={i + 1}
                    showEcoShipping={showEcoShippingEvenAfterFiltering}
                    ecoShippingMessaging={ecoShippingShipOptionMessaging}
                  />
                </div>
              </div>
            );
          }
          )
        }
      </div>
    </>
  );
};

const mapStateToProps = ({ checkoutData, shipOption }) => ({ checkoutData, shipOption });

export default connect(mapStateToProps, {})(SplitReview);

