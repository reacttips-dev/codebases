import React, { useContext } from 'react';

import { ProductDetailState } from 'reducers/detail/productDetail';

const ProductContext = React.createContext<ProductDetailState | null>(null);

const useProductContext = () => useContext(ProductContext);

export const ProductContextProvider = ProductContext.Provider;

export const withProductContext = <Props extends {}>(Component: React.ComponentType<Props>) => (props: Props) => (
  <Component product={useProductContext()} {...props} />
);

