import React from 'react';
import { Link } from 'react-router';

import JsonLd from 'components/common/JsonLd';
import ProductUtils from 'helpers/ProductUtils';
import { buildSeoBrandString } from 'helpers/SeoUrlBuilder';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { FormattedProductBundle } from 'reducers/detail/productDetail';
import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/productdetail/productBreadcrumbs.scss';

interface Props {
  product: FormattedProductBundle;
  onBack: (e: React.MouseEvent<Element>) => void;
  showBreadcrumbsSku: boolean;
}

export const makeProductTypeLink = ({ defaultProductType }: {
  defaultProductType: string;
}) => `/search/null/filter/zc1/%22${encodeURIComponent(defaultProductType)}%22`;

export const makeCategoryLink = ({ defaultProductType, defaultCategory }: {
  defaultProductType: string;
  defaultCategory: string;
}) => `/search/null/filter/zc1/%22${encodeURIComponent(defaultProductType)}%22/zc2/%22${encodeURIComponent(defaultCategory)}%22`;

export const makeBreadcrumbStructuredData = (product: FormattedProductBundle) => {
  const { defaultProductType, defaultCategory, brandName, brandId } = product;
  const data = {
    '@type': 'BreadcrumbList',
    'itemListElement': [{
      '@type': 'ListItem',
      'position': 1,
      'item': {
        '@id': makeProductTypeLink(product),
        'name': defaultProductType
      }
    }]
  };

  if (defaultCategory) {
    data.itemListElement.push({
      '@type': 'ListItem',
      'position': 2,
      'item': {
        '@id': makeCategoryLink(product),
        'name': defaultCategory
      }
    });
  }

  data.itemListElement.push({
    '@type': 'ListItem',
    'position': data.itemListElement.length + 1,
    'item': {
      '@id': buildSeoBrandString(brandName, brandId),
      'name': brandName
    }
  });
  return <JsonLd data={data} />;
};

const makeBrandName = (brandName: string) => <span className={css.selected}>{brandName}</span>;

const makeBreadcrumbFragment = (product: FormattedProductBundle, testId: <T extends string | undefined>(id: T) => T) => {
  const { brandName, brandId, defaultProductType, defaultCategory } = product;
  const breadcrumbForward = <span className={css.breadcrumbForward}>{'/'}</span>;
  const productType = <Link to={makeProductTypeLink(product)} data-test-id={testId('breadcrumbProductType')}>{defaultProductType}</Link>;
  const productCategory = <Link to={makeCategoryLink(product)} data-test-id={testId('breadcrumbProductCategory')}>{defaultCategory}</Link>;
  const productBrand = <Link to={buildSeoBrandString(brandName, brandId)} data-test-id={testId('breadcrumbProductBrand')}>{makeBrandName(brandName)}</Link>;

  const productCategoryMarkup = defaultCategory ? <>{breadcrumbForward} {productCategory}</> : null;
  return <>{productType} {productCategoryMarkup} {breadcrumbForward} {productBrand}</>;
};

const makeGiftCardBreadcrumbFragment = (pdpConfig: { giftCardLink: string }, product: FormattedProductBundle, testId: <T extends string | undefined>(id: T) => T) => {
  const typeLink = pdpConfig.giftCardLink || makeProductTypeLink(product); // try to fallback to something sensible since only zappos has a GC LP.
  return <Link to={typeLink} data-test-id={testId('breadcrumbProductType')}>{product.defaultProductType}</Link>;
};

export const ProductBreadcrumbs = ({ product, onBack, showBreadcrumbsSku }: Props) => {
  const { marketplace: { pdp }, testId } = useMartyContext();
  const { productId, defaultProductType } = product;
  const isGiftCard = ProductUtils.isGiftCard(defaultProductType);
  const breadcrumbBack = <span className={css.breadcrumbBack}>«</span>;
  const goBack = <Link to="#" onClick={onBack} data-test-id={testId('breadcrumbBack')}>{breadcrumbBack} Back</Link>;
  const breadcrumbs = isGiftCard ? makeGiftCardBreadcrumbFragment(pdp, product, testId) : makeBreadcrumbFragment(product, testId);

  return (
    <div id="breadcrumbs" className={css.breadcrumbsRow}>
      <div data-test-id={testId('breadcrumbs')}>
        {goBack} | {breadcrumbs}
      </div>
      {showBreadcrumbsSku && <div data-test-id={testId('sku')}>SKU <span itemProp="sku">{productId}</span></div>}
      {makeBreadcrumbStructuredData(product)}
    </div>
  );
};

export default withErrorBoundary('ProductBreadcrumbs', ProductBreadcrumbs);
