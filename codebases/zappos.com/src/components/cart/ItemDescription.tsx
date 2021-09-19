import React from 'react';
import { Link } from 'react-router';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { IS_GIFT_CARD } from 'common/regex';

import css from 'styles/components/cart/itemDescription.scss';

interface Props {
  item: any; // TODO ts use correct type when cloudlist stuff is typed
  isUnavailable: boolean;
  isModal: boolean;
  isRecommendedFit: boolean;
}

export const ItemDescription = ({ item, isUnavailable, isModal, isRecommendedFit }: Props) => {
  const {
    stock,
    sizing,
    quantity,
    egc,
    asin,
    color,
    brandName
  } = item;

  const { testId, marketplace } = useMartyContext();

  const makeProductName = () => {
    const { productName, brandName } = item;
    return productName.replace(brandName, '');
  };

  const makeSizingFields = () => {
    let { size, width, inseam } = item;

    if (!sizing && !size) {
      return null;
    }

    if (sizing) {
      const { displaySize, shoeWidth, inseam: productInseam } = sizing.languageTagged;
      size = displaySize,
      width = shoeWidth,
      inseam = productInseam;
    }

    return (
      <>
        { !!size &&
          <>
            {isRecommendedFit
              ?
              <div className={css.recommendedFit}>
                <dt>Recommended Size</dt>
                <dd data-test-id={testId('itemSize')}>{size}</dd>
              </div>
              :
              <>
                <dt>Size</dt>
                <dd data-test-id={testId('itemSize')}>{size}</dd>
              </>
            }
          </>
        }
        { !!width && <><dt>Width</dt><dd data-test-id={testId('itemWidth')}>{width}</dd></> }
        { !!inseam && <><dt>Inseam</dt><dd data-test-id={testId('itemInseam')}>{inseam}</dd></> }
      </>
    );
  };

  const availableAmount = stock || quantity;
  const { pdp: { egcUrl }, checkout: { asinVerbiage } } = marketplace;

  if (egc) {
    const { recipientEmail, deliveryDate } = item;
    return (
      <div className={cn(css.container, { [css.modal] : isModal })}>
        <Link to={egcUrl} className={css.productName} data-test-id={testId('itemName')}>
          {makeProductName()}
        </Link>
        <dl className={css.dimensions}>
          <dt>Color</dt>
          <dd data-test-id={testId('itemColor')}>{color}</dd>

          <dt>Email To</dt>
          <dd className={css.recipientEmail} data-test-id={testId('recipientEmail')}>{recipientEmail}</dd>

          <dt>Deliver On</dt>
          <dd data-test-id={testId('deliveryDate')}>{deliveryDate}</dd>
        </dl>
      </div>
    );
  }

  return (
    <div className={cn(css.container, { [css.modal] : isModal })}>
      <Link
        to={`/p/asin/${asin}`}
        data-te="TE_CART_PRODUCTCLICKED"
        data-ted={asin}>
        <span data-test-id={testId('brandName')}>{brandName}</span>
        <span className={css.productName} data-test-id={testId('itemName')}>
          { makeProductName() }
        </span>
      </Link>
      <dl className={css.dimensions}>
        { !IS_GIFT_CARD.test(brandName) && // dont render color for physical gift cards
          <>
            <dt>Color</dt>
            <dd data-test-id={testId('itemColor')}>{color}</dd>
          </>
        }

        { makeSizingFields() }

        <dt>{asinVerbiage}</dt>
        <dd data-test-id={testId('itemAsin')}>{asin}</dd>
      </dl>

      { !isUnavailable && availableAmount < 4 && <span className={css.lowStock}>{availableAmount} left</span> }
    </div>
  );
};

const WithErrorBoundaryItemDescription = withErrorBoundary('ItemDescription', ItemDescription);
export default WithErrorBoundaryItemDescription;
