import React from 'react';
import cn from 'classnames';

import { PRICE } from 'common/regex';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import ProductUtils from 'helpers/ProductUtils';
import useMartyContext from 'hooks/useMartyContext';
import { ProductStyle } from 'types/cloudCatalog';
import { IdentityFn } from 'types/utility';

import styles from 'styles/components/productdetail/price.scss';

interface Props {
  productStyle: ProductStyle;
  percentOffText: string;
  showPercentOffBanner: boolean;
  className?: string;
  hydraBlueSkyPdp: boolean;
  small?: boolean;
}

function getPriceComponents(priceString: string): string[] | undefined {
  const match = priceString.match(PRICE);
  if (!match) {
    return undefined;
  }
  if (!match[2]) {
    return [match[1]];
  }
  return [match[1], match[2]];
}

const makePercentOff = (style: ProductStyle, percentOffText: string, testId: IdentityFn<string>) => {
  const percentOff = ProductUtils.getPercentOff(style);
  if (percentOff > 0) {
    return (
      <span data-test-id={testId('percentOff')}>{percentOff}% {percentOffText}</span>
    );
  }
};

export const Price = ({
  className,
  hydraBlueSkyPdp,
  percentOffText,
  productStyle,
  showPercentOffBanner,
  small
}: Props) => {
  const { testId } = useMartyContext();
  const showDiscount = ProductUtils.isStyleOnSale(productStyle);
  const percentOff = makePercentOff(productStyle, percentOffText, testId);

  const mainPrice = productStyle.price || productStyle.originalPrice;
  const components = getPriceComponents(mainPrice);
  const dollarSign = components ? '$' : '';
  const priceDollarValue = components ? components[0] : mainPrice;
  const priceCentsValue = components?.[1] ? components[1] : '';
  const structuredDataPrice = priceDollarValue + (priceCentsValue ? `.${priceCentsValue}` : '');

  return (
    <div className={cn(className, { [styles.small]: small, [styles.blueSky]: hydraBlueSkyPdp })}>
      {showPercentOffBanner && (
        <span className={styles.percentOffBanner}>
          {percentOff}
        </span>
      )}
      <div
        className={styles.container}
        itemProp="offers"
        itemScope
        itemType="https://schema.org/Offer">
        {/* aria-label tells price to screen reader */}
        <span
          aria-label={mainPrice}
          className={cn(styles.price, { [styles.sale]: showDiscount })}
          data-test-id={testId('pdpProductPrice')}
          itemProp="price"
          content={structuredDataPrice}
        >
          {/*
            hide the fancy-formatted price (superscript dollar sign and cents)
            because the styling alone causes it to be broken up. a screen
            reader will see "$\n24\n.\n99" for a price of "$24.99"
          */}
          <span aria-hidden="true">
            {/* TODO refactor all this into a StylizedPrice component (working name) */}
            <span className={styles.dollarSign} itemProp="priceCurrency" content="USD">{dollarSign}</span>
            {priceDollarValue}
            {priceCentsValue && (
              <>
                <span className={styles.priceDecimalPoint}>.</span>
                <span className={styles.priceCentsValue}>{priceCentsValue}</span>
              </>
            )}
          </span>
        </span>
        {showDiscount && (
          <span className={styles.discount}>
            {percentOff && (
              <span className={styles.percentOff}>
                {percentOff}
              </span>
            )}
            <span className={styles.originalPrice} data-test-id={testId('pdpOriginalPrice')}>
              {showDiscount && (
                <span className={styles.msrpLabel}><abbr title="Manufacturer's Suggested Retail Price">MSRP</abbr>: </span>
              )}
              <span className={styles.msrp} data-test-id={testId('msrpPrice')}>{productStyle.originalPrice}</span>
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

export default withErrorBoundary('Price', Price);
