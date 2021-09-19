import { hasRelatedProducts } from 'actions/relatedProducts';
import { RelatedProductResponse } from 'apis/cloudcatalog';
import { RECEIVE_RELATED_PRODUCTS, REQUEST_PRODUCT_DETAIL } from 'constants/reduxActions';
import { toUSD } from 'helpers/NumberFormats';
import { AppAction } from 'types/app';
import { RelatedProductStyle } from 'types/cloudCatalog';

interface ProcessedStyle {
  colorId: string;
  imageId: string;
  mainImageId: string;
  productUrl: string;
  styleId: string;
  swatchId: string;
  basePrice: string | undefined;
  salePrice: string | undefined;
}

export interface DontForgetProduct {
  brandName: string;
  productName: string;
  styles: ProcessedStyle[];
  productId: string;
}

const processPrice = (p: number | undefined) => (p ? toUSD(p) : undefined);

const processPrices = ({ basePrice, salePrice }: { basePrice: number; salePrice: number }) => {
  const processedBasePrice = processPrice(basePrice);
  const processedSalePrice = processPrice(salePrice);
  return {
    basePrice: processedBasePrice || processedSalePrice,
    salePrice: processedSalePrice || processedBasePrice
  };
};

const processStyle = ({ basePrice, salePrice, ...rest }: RelatedProductStyle): ProcessedStyle => {
  const prices = processPrices({ basePrice, salePrice });
  return { ...prices, ...rest };
};

const processDontForgetProduct = (relatedProducts: RelatedProductResponse | {}): DontForgetProduct | null => {
  if (!relatedProducts || !hasRelatedProducts(relatedProducts)) {
    return null;
  }
  const { dontForget: { productId, styles, ...rest } } = relatedProducts;
  if (!productId) {
    return null;
  }
  return {
    styles: styles.map(processStyle),
    productId,
    ...rest
  };
};

export interface DontForgetState {
  isLoading: boolean;
  product?: DontForgetProduct;
}

export default function dontForget(state: Readonly<DontForgetState> = { isLoading: true }, action: AppAction): DontForgetState {
  switch (action.type) {
    case RECEIVE_RELATED_PRODUCTS: {
      const { data } = action;
      const product = processDontForgetProduct(data);
      return product ? { isLoading: false, product } : { isLoading: false };
    }
    case REQUEST_PRODUCT_DETAIL: {
      return { isLoading: true };
    }
    default: {
      return state;
    }
  }
}
