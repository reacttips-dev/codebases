import React from 'react';

import { pluralize } from 'helpers/index.js';
import ProductName from 'components/productdetail/ProductName';
import Price from 'components/productdetail/Price';
import ReviewSummary from 'components/productdetail/ReviewSummary';
import Tooltip from 'components/common/Tooltip';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { FormattedProductBundle } from 'reducers/detail/productDetail';
import { ProductStyle } from 'types/cloudCatalog';

import styles from 'styles/components/productdetail/productSummary.scss';

interface Props {
  hydraBlueSkyPdp: boolean;
  percentOffText: string;
  product: FormattedProductBundle;
  style: ProductStyle;
  showPercentOffBanner: boolean;
  showReviewSummary: boolean;
}

export const ProductSummary = ({ hydraBlueSkyPdp, product, style, percentOffText, showPercentOffBanner, showReviewSummary }: Props) => {
  const { productId, productRating, overallRating, reviewCount } = product;

  const content = (
    <ul className={styles.reviewSummaryTooltip}>
      {overallRating.map((rating, index) => {
        const i = 5 - index;
        return (
          <li key={`rating${i}`} className={styles.reviewRating}>
            <span className={styles.percentPrefix}>{i} {pluralize('star', i)}</span>
            <span className={styles.percentBar}><span
              style={{ width: `${rating}%` }}/></span>
            <span className={styles.percentNumber}>{rating}%</span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={styles.productSummary}>
      <span id="overview" className={styles.productName}>
        <ProductName hydraBlueSkyPdp={hydraBlueSkyPdp} product={product} colorId={style.colorId} />
        {showReviewSummary && (
          <span className={styles.reviewSummaryWrapper}>
            <Tooltip
              tooltipId="reviewSummary"
              content={content}>
              <ReviewSummary
                numReviews={reviewCount}
                rating={productRating}
                productId={productId}/>
            </Tooltip>
          </span>
        )}
      </span>
      <span className={styles.price}>
        <Price
          productStyle={style}
          percentOffText={percentOffText}
          showPercentOffBanner={showPercentOffBanner}
          hydraBlueSkyPdp={hydraBlueSkyPdp}
        />
      </span>
    </div>
  );
};

export default withErrorBoundary('ProductSummary', ProductSummary);
