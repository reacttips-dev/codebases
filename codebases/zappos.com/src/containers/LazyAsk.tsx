import loadable from '@loadable/component';
import React from 'react';

import IntersectionObserver from 'components/common/IntersectionObserver';
import { ProductDetailState } from 'reducers/detail/productDetail';
export const Ask = loadable(() => import('containers/Ask'));

interface Params {
  productId: string;
  colorId?: string;
  seoName?: string;
}

interface Props {
  params: Params;
  product: ProductDetailState;
}

export const LazyAsk = ({ params, product }: Props) => <IntersectionObserver><Ask params={params} product={product} /></IntersectionObserver>;
