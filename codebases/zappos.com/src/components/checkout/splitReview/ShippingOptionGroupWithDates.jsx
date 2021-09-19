import cn from 'classnames';

import { DIGITAL_DELIVERY_ONLY_MESSAGE } from 'constants/siteMessages';
import { dateFromPromise, ECO_SHIPPING_SPEEDS, getEndDateFromRange } from 'helpers/CheckoutUtils';
import PurchaseDelivery from 'components/checkout/splitReview/PurchaseDelivery';
import useMartyContext from 'hooks/useMartyContext';
import {
  BUSINESS_UNKNOWN_NON_PERK_TEXT,
  BUSINESS_UNKNOWN_NON_PERK_TEXT_WHEN_SELECTED,
  EGC_PRICE_LINE_TEXT
} from 'constants/shipOptionMessaging';

import css from 'styles/components/checkout/splitReview/shippingOptionGroupWithDates.scss';

export const ShippingOptionGroupWithDates = params => {
  const {
    deliveryOptions = [],
    purchaseDelivery,
    isForEGC,
    onSelectAndUseShippingOptionClick,
    selectedShipOptionId,
    shipmentNumber,
    numShipments,
    showEcoShipping,
    ecoShippingMessaging
  } = params;
  const { testId } = useMartyContext();

  if (isForEGC) {
    return (
      <fieldset className={css.wrapper}>
        <legend className={css.deliveryLine}>Digital Delivery:</legend>
        <PurchaseDelivery description={DIGITAL_DELIVERY_ONLY_MESSAGE} />
        <div className={cn(css.item, css.selected)} key={'egc'}>
          <div className={css.selectionBlock}>
            <input
              checked={true}
              data-shipping-promise={'promise'}
              data-shipment-speed={'shipmentSpeed'}
              data-shipment-option-id={'shippingOptionId'}
              onChange={onSelectAndUseShippingOptionClick}
              type="radio"
              id={'shipOption-egc'}
              name="shippingOptionListEgc"
              data-test-id={testId('shipOptionInput')} />
            <label className={css.optionLabel} htmlFor={`shipOption-${'egc'}`} data-test-id={testId('innerShipOptionLabel')}>
              <span className={css.optionLabelText}>
                <span data-test-id={testId('shipOptionPromise')}>Email</span>
                <span className={css.labelSubText} data-test-id={testId('shipOptionDescription')}>{EGC_PRICE_LINE_TEXT}</span>
              </span>
            </label>
          </div>
        </div>
      </fieldset>
    );
  }

  if (!deliveryOptions.length) {
    return (
      <div className={css.noOptions}>Sorry, no shipping options are available at this time. Please select or add a different shipping address.</div>
    );
  }

  return (
    <form method="post" action="/selectShipOption">
      <fieldset className={css.wrapper} data-test-id="shippingOptionListSection">
        <legend className={css.deliveryLine}>
          <span>Estimated Delivery</span>
          { numShipments > 1 && <span>Shipment {shipmentNumber} of {numShipments}</span>}
        </legend>
        <PurchaseDelivery {...purchaseDelivery} />
        {
          deliveryOptions
            .filter(({ price, isFiltered }) => (price === 0 || price) && !isFiltered)
            .map(({ deliveryPromise: { displayString }, description, name, id, promise }) => {
              const isSelected = id === selectedShipOptionId || selectedShipOptionId === name;
              const isEcoShippingOption = ECO_SHIPPING_SPEEDS.has(name) && ecoShippingMessaging && showEcoShipping;
              const inputId = `shipOption-${id}`;
              return (
                <div className={cn(css.item, { [css.selected]: isSelected, [css.leaf]: isEcoShippingOption })} key={id}>
                  { isEcoShippingOption &&
                <p className={css.leafMessage}>
                  {ecoShippingMessaging}
                </p>
                  }
                  <div className={css.selectionBlock}>
                    <input
                      checked={isSelected}
                      data-shipping-promise={promise}
                      data-shipment-speed={name}
                      data-shipment-option-id={id}
                      onChange={onSelectAndUseShippingOptionClick}
                      type="radio"
                      id={inputId}
                      name="shippingOptionList"
                      data-test-id={testId('shipOptionInput')} />
                    <label className={css.optionLabel} htmlFor={inputId} data-test-id={testId('innerShipOptionLabel')}>
                      <span className={css.optionLabelText}>
                        { !!displayString && <span data-test-id={testId('shipOptionPromise')}>{getEndDateFromRange(dateFromPromise(displayString))}</span> }
                        { !displayString && isSelected && BUSINESS_UNKNOWN_NON_PERK_TEXT_WHEN_SELECTED }
                        { !displayString && !isSelected && BUSINESS_UNKNOWN_NON_PERK_TEXT }
                        { !!description && <span className={css.labelSubText} data-test-id={testId('shipOptionDescription')}>{description}</span> }
                      </span>
                    </label>
                  </div>
                </div>
              );
            })
        }
      </fieldset>
    </form>
  );
};

export default ShippingOptionGroupWithDates;
