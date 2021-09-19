import React from 'react';
import { Link } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import cn from 'classnames';

import HtmlToReact from 'components/common/HtmlToReact';
import ProductUtils from 'helpers/ProductUtils';
import { makeSizeCharts } from 'components/productdetail/description/sizeChartBuilder';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import useMartyContext from 'hooks/useMartyContext';
import { buildSeoBrandString } from 'helpers/SeoUrlBuilder';
import { AppState } from 'types/app';

import css from 'styles/components/productdetail/productDescription.scss';

export interface DescriptionItems {
  bulletPoints: string[];
  sizeCharts: string[];
}

interface OwnProps {
  allowCollapse: boolean;
  brandId: string;
  brandLogo: JSX.Element;
  brandName: string;
  descriptionItems?: DescriptionItems;
  defaultProductType: string;
  glossaryLink: string;
  hydraBlueSkyPdp: boolean;
  isExpanded: boolean;
  onReportError: (event: React.MouseEvent<HTMLButtonElement>) => void;
  productId: string;
  productTitle: string;
  showGlossary: boolean;
  showReportError: boolean;
  showSizeChartLink: boolean;
  showSkuBullet?: boolean;
}
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export const ProductDescription = ({
  hydraBlueSkyPdp,
  allowCollapse,
  brandId,
  brandLogo,
  brandName,
  descriptionItems,
  defaultProductType,
  gcTerms,
  glossaryLink,
  isExpanded,
  onReportError,
  productId,
  productTitle,
  showGlossary,
  showReportError,
  showSkuBullet = true,
  showSizeChartLink
}: Props) => {
  const { testId } = useMartyContext();
  let featuredDescription;
  let remainingDescriptionItems: string[] = [];
  const isGiftCard = ProductUtils.isGiftCard(defaultProductType);
  if (descriptionItems && descriptionItems.bulletPoints.length > 0) {
    featuredDescription = descriptionItems.bulletPoints[0];
    remainingDescriptionItems = descriptionItems.bulletPoints.slice(1);
  }

  return (
    <div className={cn(css.productDescription, { [css.blueSky]: hydraBlueSkyPdp })} itemProp="description" data-test-id={testId('productDescriptionSection')}>
      <div className={cn(css.headingContainer, { [css.blueSky]: hydraBlueSkyPdp })}>
        <h2 className={css.vNeck}>{productTitle}</h2>
        <Link to={buildSeoBrandString(brandName, brandId)} className={cn(css.moreFrom, { [css.blueSky]: hydraBlueSkyPdp })} data-test-id={testId('moreFromBrand')}>More from {brandName}</Link>
      </div>
      <div className={cn(css.description, { [css.more]: !isExpanded && allowCollapse && descriptionItems }, { [css.blueSky]: hydraBlueSkyPdp })}>
        {!isGiftCard && <div className={cn(css.brandLogo, { [css.blueSky]: hydraBlueSkyPdp })}>{brandLogo}</div>}
        {descriptionItems ? (
          <ul>
            {showSizeChartLink && makeSizeCharts(defaultProductType, descriptionItems, css.viewSizeChart, testId)}
            {featuredDescription && <li className={cn(css.featuredDescription, { [css.blueSky]: hydraBlueSkyPdp })} data-test-id={testId('featuredDescription')}><HtmlToReact noContainer={true}>{featuredDescription}</HtmlToReact></li>}
            {showSkuBullet && <li className={css.descriptionSku} data-test-id={testId('descriptionSku')}>SKU: #<span itemProp="sku">{productId}</span></li>}
            {remainingDescriptionItems.map(
              (item, index) => <li key={`description_${index}`} data-test-id={testId('descriptionItem')}><HtmlToReact noContainer={true}>{item}</HtmlToReact></li>)}
            { isGiftCard && gcTerms && <li><HtmlToReact noContainer={true}>{gcTerms}</HtmlToReact></li> }
          </ul>
        ) : null}
        {!isGiftCard && showGlossary && (
          <Link
            to={glossaryLink}
            className={css.glossary}
            data-track-action="Product-Page"
            data-track-label="PrDescription"
            data-track-value="View-Glossary"
            data-test-id={testId('glossaryTermsLink')}>
            View Zappos.com Glossary of Terms
          </Link>
        )}
        {showReportError && (
          <div className={css.reportError}>
            Find something wrong in this description?&nbsp;
            <span>Help us fix it!&nbsp;
              <button
                type="button"
                className={css.reportErrorButton}
                onClick={onReportError}
                data-track-action="Product-Page"
                data-track-label="PrDescription"
                data-track-value="Report-An-Error"
                data-test-id={testId('reportAnError')}>
                Report An Error
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const mapStateToProps = (state: AppState) => {
  const {
    headerFooter: { content: { Global: { slotData: { giftCardTerms: { gcTerms } = { gcTerms: undefined } } } } }
  } = state;
  return {
    gcTerms
  };
};

const connector = connect(mapStateToProps);

const ProductDescriptionConnected = connector(ProductDescription);

export default withErrorBoundary('ProductDescription', ProductDescriptionConnected);
