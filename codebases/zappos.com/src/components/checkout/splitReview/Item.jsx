import cn from 'classnames';
import React from 'react';

import {
  DELIVERY_INFORMATION_MISSING,
  DELIVERY_OPTION,
  DROP_PRODUCT_DIRECT_FULFILLMENT,
  DROP_PRODUCT_NOT_AVAILABLE,
  DROP_PRODUCT_PURCHASE_AUTHORIZATION_MISSING,
  DROP_PRODUCT_QUANTITY_LIMIT,
  FULLFILMENT_NETWORK_MISSING,
  INVALID_SELECTED_DELIVERY_OPTION_FOR_LINE_ITEM,
  ITEM_QUANTITY_UNAVAILABLE,
  JURISDICTION,
  MISSING_DIGITAL_DELIVERY_INFORMATION,
  OFFER_LISTING_AND_OFFER_SKU_DIFFER,
  OFFER_LISTING_NOT_AVAILABLE_CONSTRAINT_VIOLATION,
  QUANTITY_LIMITS,
  SHIPPING_ENGINE_FILTER_BASED,
  SHIPPING_ENGINE_PROVIDER_BASED,
  SHIPPING_ENGINE_REMOVER_BASED,
  SHIPPING_ENGINE_SHIPPING_OFFERING_NOT_SET
} from 'constants/constraintViolations';
import { makeOptions } from 'components/cart/CartQuantityDropdown';
import useMartyContext from 'hooks/useMartyContext';
import RetailItemDetails from 'components/checkout/splitReview/RetailItemDetails';
import DigitalItemDetails from 'components/checkout/splitReview/DigitalItemDetails';

import css from 'styles/components/checkout/splitReview/item.scss';

export const Item = props => {
  const {
    groupDetails: {
      asinErrors,
      onChangeQuantity
    },
    lineItem: {
      asin,
      image: { url: imageUrl, alt: imageAlt },
      lineItemId,
      onHand,
      quantity
    },
    showFormControls,
    showItemLevelErrors,
    showItemTopBorder,
    type
  } = props;
  const { testId } = useMartyContext();
  const mustBeRemovedFromPurchase = checkIfMustBeRemovedFromPurchase({ asinErrors, asin });
  const hasQuantityError = hasQuantityFieldError({ asinErrors, asin });
  const showQuantitySelector = type === 'retail' && !mustBeRemovedFromPurchase;

  return (
    <div className={cn(css.wrapper, { [css.withTopBorder]: showItemTopBorder })}>
      { showItemLevelErrors && makeAsinErrors({ asinErrors, asin })}
      <div className={css.cols}>
        <div className={css.leftCol} data-test-id={testId('itemLeftCol')}>
          <div>
            <img width="100" src={imageUrl} alt={imageAlt} />
          </div>
          {
            showFormControls && showQuantitySelector && <form method="post" action="/tbd">
              <div className={cn({ [css.fieldError]: hasQuantityError })}>
                <select
                  aria-label="Quantity"
                  data-test-id={testId('quantitySelector')}
                  id={`qty-${lineItemId}`}
                  name={`qty-${lineItemId}`}
                  onChange={e => onChangeQuantity(e, lineItemId)}
                  value={quantity}>
                  <option value="0">Remove</option>
                  {makeOptions(onHand, quantity)}
                </select>
                { makeQuantityErrors({ asinErrors, asin }) }
              </div>
            </form>
          }
          {
            showFormControls && !showQuantitySelector && <select
              aria-label="Quantity"
              data-test-id={testId('quantitySelector')}
              id={`qty-${lineItemId}`}
              name={`qty-${lineItemId}`}
              disabled={mustBeRemovedFromPurchase}
              onChange={e => onChangeQuantity(e, lineItemId)}
              value={quantity}>
              <option value="0">Remove</option>
              <option value={quantity}>{quantity}</option>
            </select>
          }
        </div>
        <div className={css.rightCol} data-test-id={testId('itemRightCol')}>
          { type === 'retail'
            ? <RetailItemDetails { ...props } />
            : <DigitalItemDetails { ...props } />
          }
        </div>
      </div>
    </div>
  );
};

export function hasQuantityFieldError({ asinErrors, asin }) {
  if (!asinErrors?.hasOwnProperty(asin)) {
    return false;
  }

  const asinErrorList = [
    ITEM_QUANTITY_UNAVAILABLE,
    QUANTITY_LIMITS,
    DROP_PRODUCT_QUANTITY_LIMIT
  ];

  const result = asinErrors[asin].filter(info => asinErrorList.some(name => name === info.name));

  return !!result.length;
}

export function makeQuantityErrors({ asinErrors, asin }) {
  if (!asinErrors?.hasOwnProperty(asin)) {
    return null;
  }

  const asinErrorList = [
    DROP_PRODUCT_QUANTITY_LIMIT,
    ITEM_QUANTITY_UNAVAILABLE,
    QUANTITY_LIMITS
  ];

  const result = asinErrors[asin].reduce((acc, { name, quantityAvailable }) => {
    if (asinErrorList.some(errorListName => errorListName === name)) {
      switch (name) {
        case ITEM_QUANTITY_UNAVAILABLE: {
          const message = quantityAvailable ? `only ${quantityAvailable} left` : 'quantity not available';
          return acc.concat(<p key={name}>{message}</p>);
        }
        default: {
          return acc.concat(<p key={name}>quantity not available</p>);
        }
      }
    }
    return acc;
  }, []);

  return !!result.length && <div className={css.quantityErrorMsg}>{result}</div>;
}

export function makeAsinErrors({ asinErrors, asin }) {
  if (!asinErrors?.hasOwnProperty(asin)) {
    return null;
  }

  const asinErrorList = [
    DELIVERY_OPTION,
    DELIVERY_INFORMATION_MISSING,
    DROP_PRODUCT_DIRECT_FULFILLMENT,
    DROP_PRODUCT_NOT_AVAILABLE,
    DROP_PRODUCT_PURCHASE_AUTHORIZATION_MISSING,
    FULLFILMENT_NETWORK_MISSING,
    JURISDICTION,
    MISSING_DIGITAL_DELIVERY_INFORMATION,
    OFFER_LISTING_AND_OFFER_SKU_DIFFER,
    OFFER_LISTING_NOT_AVAILABLE_CONSTRAINT_VIOLATION,
    SHIPPING_ENGINE_FILTER_BASED,
    SHIPPING_ENGINE_REMOVER_BASED,
    SHIPPING_ENGINE_PROVIDER_BASED,
    SHIPPING_ENGINE_SHIPPING_OFFERING_NOT_SET,
    INVALID_SELECTED_DELIVERY_OPTION_FOR_LINE_ITEM
  ];

  const result = asinErrors[asin].reduce((acc, { name, message }) => {
    if (asinErrorList.some(errorListName => errorListName === name)) {
      switch (name) {
        case INVALID_SELECTED_DELIVERY_OPTION_FOR_LINE_ITEM: {
          return acc.concat(<p key={name}>
            <strong>Please select a different shipping speed.</strong>  Unfortunately, this item cannot be shipped with the chosen shipment speed.
          </p>);
        }
        case SHIPPING_ENGINE_FILTER_BASED:
        case DELIVERY_OPTION:
        case DELIVERY_INFORMATION_MISSING: {
          return acc.concat(<p key={name}>
            <strong>Please remove this item.</strong> Unfortunately, this item has no valid shipping option. We are working on fixing this issue on our end.
          </p>);
        }
        default: {
          return acc.concat(<p key={name}>{message}</p>);
        }
      }
    }
    return acc;
  }, []);

  return result.length ? (
    <div className={css.errorMsg}>
      {result}
    </div>
  ) : '';
}

export function checkIfMustBeRemovedFromPurchase({ asinErrors, asin }) {
  if (!asinErrors?.hasOwnProperty(asin)) {
    return false;
  }

  const asinErrorList = [
    DELIVERY_OPTION,
    DELIVERY_INFORMATION_MISSING,
    DROP_PRODUCT_NOT_AVAILABLE,
    SHIPPING_ENGINE_FILTER_BASED
  ];

  const result = asinErrors[asin].filter(info => asinErrorList.some(name => name === info.name));

  return !!result.length;
}

export default Item;
