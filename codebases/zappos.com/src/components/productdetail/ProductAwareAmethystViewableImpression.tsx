import React from 'react';

import AmethystViewableImpression from 'components/common/AmethystViewableImpression';
import { withProductContext } from 'components/productdetail/ProductContext';
import { ProductDetailState } from 'reducers/detail/productDetail';

interface Props {
  product?: ProductDetailState;
  event: (...args: any[]) => any;
  [key: string]: any;
}

const ProductAwareAmethystViewableImpression = ({ product, event, ...rest }: Props) => (
  <AmethystViewableImpression
    productId={product?.detail?.productId}
    event={event}
    colorId={product?.colorId}
    {...rest} />
);

export default withProductContext(ProductAwareAmethystViewableImpression);
