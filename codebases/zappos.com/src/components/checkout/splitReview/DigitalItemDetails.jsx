import React from 'react';
import { Link } from 'react-router';

import { toUSD } from 'helpers/NumberFormats';
import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/checkout/splitReview/digitalItemDetails.scss';

export const DigitalItemDetails = props => {
  const {
    groupDetails: {
      allowMoveToFavorites,
      onDeleteItem
    },
    lineItem: {
      asin,
      brandName,
      gcCustomization: { message, recipientEmail, senderName },
      lineItemId,
      price,
      style
    },
    showFormControls
  } = props;
  const { testId } = useMartyContext();

  return (
    <div className={css.container}>
      <span data-test-id={testId('productBrand')}>{brandName}</span>
      <Link
        to={`/p/asin/${asin}`}
        data-te="TE_CHECKOUT_REV_GO_TO_PDP"
        data-ted={asin}
        className={css.productName}
        data-test-id={testId('productName')}>
        { style }
      </Link>
      <dl className={css.dimensions}>
        <dl>
          {
            !!message && <>
            <dt>Message</dt>
            <dd data-test-id={testId('itemMessage')}>{message}</dd>
          </>
          }
          {
            !!recipientEmail && <>
            <dt>Send To</dt>
            <dd data-test-id={testId('itemRecipient')}>{recipientEmail}</dd>
          </>
          }
          {
            !!senderName && <>
            <dt>From</dt>
            <dd data-test-id={testId('itemSenderName')}>{senderName}</dd>
          </>
          }
        </dl>
      </dl>

      <span className={css.price} data-test-id={testId('itemPrice')}>{toUSD(price)}</span>

      <form method="post" action="/tbd">
        {
          showFormControls && allowMoveToFavorites && <div>
            <button
              className={css.deleteItem}
              data-line-item-id={lineItemId}
              onClick={onDeleteItem}
              type="button">Remove</button>
          </div>
        }
      </form>
    </div>
  );
};

export default DigitalItemDetails;
