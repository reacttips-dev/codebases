import React from 'react';
import { Link } from 'react-router';
import cn from 'classnames';

import { buildSeoBrandString, buildSeoProductUrl } from 'helpers/SeoUrlBuilder';
import ProductUtils from 'helpers/ProductUtils';
import useMartyContext from 'hooks/useMartyContext';
import { FormattedProductBundle } from 'reducers/detail/productDetail';

import styles from 'styles/components/productdetail/productName.scss';

interface Props {
  product: FormattedProductBundle;
  className?: string;
  colorId: string | undefined;
  hydraBlueSkyPdp: boolean;
  brandNameClass?: string;
  productNameClass?: string;
}

export const ProductNameContents = (props: Props) => {
  const {
    brandNameClass,
    className,
    colorId,
    product,
    productNameClass
  } = props;
  const { brandName, brandId, productName, defaultProductType } = product;
  const isNotGiftCard = !ProductUtils.isGiftCard(defaultProductType);
  const { testId } = useMartyContext();
  const isCanonicalColor = colorId === product.styles[0].colorId;
  const urlForStructuredData = buildSeoProductUrl(product, isCanonicalColor ? undefined : colorId);
  // We keep the space after the brand name for screen readers reading the brand then the product name.
  return <div className={className}>
    {isNotGiftCard && <span
      className={cn(styles.brandName, brandNameClass)}
      itemProp="brand"
      itemScope
      itemType="http://schema.org/Brand">
      <Link to={buildSeoBrandString(brandName, brandId)} itemProp="url" data-test-id={testId('pdpBrandName')}>
        <span itemProp="name">{brandName}</span>
      </Link>
      {' '}
    </span>
    }
    <span className={cn(styles.productName, productNameClass)} data-test-id={testId('pdpProductName')}>
      {productName}
    </span>
    {/*
      #12759 - We need to prepend the brand name to the product name
      for SEO. We can't prepend the brandname value to the span below this one
      because it would cause the brand name to double up in the title.
    */}
    <div itemProp="name" className={styles.hidden}>{brandName} {productName}</div>
    <meta itemProp="url" content={urlForStructuredData} />
  </div>;
};

const ProductName = ({ className, colorId, product, hydraBlueSkyPdp }: Props) => (
  <h1 className={cn(styles.container, { [styles.blueSky]: hydraBlueSkyPdp }, { [styles.breakLongProductName]: product.productName.length > 45 })}>
    <ProductNameContents
      product={product}
      className={className}
      hydraBlueSkyPdp={hydraBlueSkyPdp}
      colorId={colorId} />
  </h1>
);

export default ProductName;
