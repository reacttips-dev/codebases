import cn from 'classnames';
import React from 'react';

import { IS_GIFT_CARD } from 'common/regex';
import { toUSD } from 'helpers/NumberFormats';
import useMartyContext from 'hooks/useMartyContext';
import FinalSale from 'components/common/FinalSale';

import css from 'styles/components/checkout/splitReview/retailItemDetails.scss';

export const RetailItemDetails = props => {
  const {
    groupDetails: {
      allowMoveToFavorites,
      onDeleteItem,
      onMoveToFavoritesClick
    },
    lineItem: {
      asin,
      brandName,
      color,
      displaySize,
      finalSale,
      itemLengthDescription,
      lineItemId,
      price,
      originalPrice,
      quantity,
      shoeWidth,
      style
    },
    showFormControls
  } = props;
  const { testId, marketplace: { checkout: { asinVerbiage = 'Asin' } } } = useMartyContext();
  const isDiscounted = price < originalPrice;
  const totalPrice = price * quantity;
  const totalOriginalPrice = originalPrice * quantity;

  return (
    <div className={css.container} data-test-id={testId('retailShippableItemContainer')}>
      <span data-test-id={testId('productBrand')}>{brandName}</span>
      <span
        className={css.productName}
        data-test-id={testId('productName')}>
        { style }
      </span>
      <dl className={css.dimensions}>
        <dt>{asinVerbiage}</dt>
        <dd className={css.asin} data-test-id={testId('itemAsin')}>{asin}</dd>
        {
          !IS_GIFT_CARD.test(brandName) && <>
          <dt>Color</dt>
          <dd data-test-id={testId('itemColor')}>{color}</dd>
        </>
        }
        {
          !!displaySize && <>
          <dt>Size</dt>
          <dd data-test-id={testId('itemSize')}>{displaySize}</dd>
        </>
        }
        {
          !!shoeWidth && <>
          <dt>Width</dt>
          <dd data-test-id={testId('itemWidth')}>{shoeWidth}</dd>
        </>
        }
        {
          !!itemLengthDescription && <>
          <dt>Inseam</dt>
          <dd data-test-id={testId('itemLengthDescription')}>{itemLengthDescription}</dd>
        </>
        }
      </dl>

      <p>
        { isDiscounted && <span>Sale: </span> }
        <span className={cn(css.price, { [css.sale]: isDiscounted })} data-test-id={testId('itemPrice')}>{toUSD(totalPrice)}</span>
        { quantity > 1 && <span className={css.unitPrice}> ({toUSD(price)} each)</span>}
      </p>

      {
        isDiscounted && <p className={cn(css.originalPrice, { [css.multiQuantity]: quantity > 1 })}>
                MSRP: {toUSD(totalOriginalPrice)}
          { quantity > 1 && <span className={css.unitPrice}> ({toUSD(originalPrice)} each)</span> }
        </p>
      }

      { finalSale && <FinalSale /> }

      <form method="post" action="/tbd">
        {
          showFormControls && allowMoveToFavorites && <p>
            <button
              className={css.moveToFavs}
              data-asin={asin}
              data-line-item-id={lineItemId}
              onClick={onMoveToFavoritesClick}
              type="button">Move to <span>Favorites</span></button>
          </p>
        }
        {
          showFormControls && allowMoveToFavorites && <p>
            <button
              className={css.deleteItem}
              data-line-item-id={lineItemId}
              onClick={onDeleteItem}
              type="button">Remove</button>
          </p>
        }
      </form>
    </div>
  );
};

export default RetailItemDetails;
