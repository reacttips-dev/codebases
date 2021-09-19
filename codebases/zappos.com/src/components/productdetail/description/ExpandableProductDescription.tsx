import React from 'react';
import cn from 'classnames';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import ProductDescription from 'components/productdetail/description/ProductDescription';
import useMartyContext from 'hooks/useMartyContext';

import styles from 'styles/components/productdetail/expandableProductDescription.scss';

const numberOfItemsToShowWhenCollapsed = 5;

interface Props {
  allowCollapse: boolean;
  brandId: string;
  brandLogo: JSX.Element;
  brandName: string;
  defaultProductType: string;
  descriptionItems?: {
    bulletPoints: string[];
    sizeCharts: string[];
  };
  isExpanded?: boolean;
  focusableRef?: React.RefObject<HTMLElement>;
  productId: string;
  hydraBlueSkyPdp: boolean;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onReportError: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCollapse?(ref: React.RefObject<HTMLElement>): void;
}

export const ExpandableProductDescription = ({
  allowCollapse,
  brandId,
  brandLogo,
  brandName,
  defaultProductType,
  descriptionItems,
  isExpanded = false,
  focusableRef,
  onReportError,
  onToggle,
  onCollapse,
  productId,
  hydraBlueSkyPdp
}: Props) => {
  const { marketplace, testId } = useMartyContext();
  const {
    links: {
      glossaryLink
    },
    pdp: {
      productDescriptionTitle,
      showDescriptionSizeChart,
      showDescriptionGlossary,
      showDescriptionReportError
    }
  } = marketplace;
  let toggleButton;

  // If the bullet points are less than five, then pass isExpanded as true
  if (descriptionItems && descriptionItems.bulletPoints.length <= 5) {
    isExpanded = true;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onToggle(event);

    if (onCollapse && isExpanded && focusableRef && focusableRef.current) {
      onCollapse(focusableRef);
    }
  };

  // Don't show expand collapse if there are less items then numberOfItemsToShowWhenCollapsed
  if (allowCollapse && descriptionItems && descriptionItems.bulletPoints.length > numberOfItemsToShowWhenCollapsed) {
    toggleButton = (
      <button type="button" className={cn(styles.descriptionToggleButton, { [styles.blueSky]: hydraBlueSkyPdp })} onClick={handleClick}>
        {isExpanded ? (
          <span
            data-track-action="Product-Page"
            data-track-label="Information"
            data-track-value="Show-less"
            data-test-id={testId('productDescriptionExpander')}>
            Show Less Information
          </span>
        ) : (
          <span
            data-track-action="Product-Page"
            data-track-label="Information"
            data-track-value="Show-More"
            data-test-id={testId('productDescriptionExpander')}>
            Show More Information
          </span>
        )}
      </button>
    );
  }

  return (
    <div>
      <ProductDescription
        allowCollapse={allowCollapse}
        brandId={brandId}
        brandLogo={brandLogo}
        brandName={brandName}
        defaultProductType={defaultProductType}
        descriptionItems={descriptionItems}
        glossaryLink={glossaryLink}
        hydraBlueSkyPdp={hydraBlueSkyPdp}
        isExpanded={isExpanded}
        onReportError={onReportError}
        productTitle={!hydraBlueSkyPdp ? productDescriptionTitle : ''}
        productId={productId}
        showGlossary={showDescriptionGlossary}
        showReportError={showDescriptionReportError}
        showSizeChartLink={showDescriptionSizeChart}
      />
      {toggleButton}
    </div>
  );
};

export default withErrorBoundary('ExpandableProductDescription', ExpandableProductDescription);
