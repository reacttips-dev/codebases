import React from 'react';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import { CurrencyObj } from 'helpers/DataFormatUtils';

import css from 'styles/components/common/card/cardPrice.scss';

interface CardPriceProps {
  price: CurrencyObj;
  msrp: CurrencyObj;
  onSale: boolean;
  prefix?: string;
}

const CardPrice = (props: CardPriceProps) => {
  const { testId } = useMartyContext();
  const { price, msrp, onSale, prefix } = props;
  const isOnSale = onSale && !prefix;
  return (
    <>
      <dt>Price</dt>
      <dd
        className={cn({ [css.onSale]: isOnSale }) }
        itemProp="offers"
        itemScope
        itemType="http://schema.org/Offer">
        <meta itemProp="priceCurrency" content="USD"/>
        <span
          className={css.price}
          itemProp="price"
          content={price.int}
          data-test-id={testId('price')}>
          {prefix}{price.string}
        </span>
        {isOnSale && <span data-test-id={testId('originalPrice')}>MSRP: {msrp.string}</span>}
      </dd>
    </>
  );
};

export default CardPrice;
