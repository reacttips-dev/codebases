import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Location } from 'history';

import useMartyContext from 'hooks/useMartyContext';
import RecommendedSizeTooltip from 'components/productdetail/stylepicker/RecommendedSizeTooltip';
import { RecommendedSizeFinderModal } from 'components/productdetail/asyncProductPageModals';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { AppState } from 'types/app';
import { ProductDetailState } from 'reducers/detail/productDetail';

import css from 'styles/components/productdetail/recommendedSizing.scss';

interface LinkRecommendedSizingProps {
  predictedSize: string;
  selectedSize?: string;
  onOpenModal: () => void;
  isDesktopView: boolean;
  onDemandSizingCopy: any;
}

export const LinkStyleRecommendedSizing = ({ predictedSize, selectedSize, onOpenModal, isDesktopView, onDemandSizingCopy = {} }: LinkRecommendedSizingProps) => {
  const bothSizesSelected = predictedSize && selectedSize;
  const tooltipId = 'recommendedSizeTooltip';
  const {
    ignoredcopy, ignoredimage,
    selectedcopy, selectedimage,
    availablecopy, availableimage
  } = onDemandSizingCopy;

  const { testId } = useMartyContext();

  if (bothSizesSelected && selectedSize !== predictedSize && ignoredcopy) {
    return <p style={ignoredimage && { 'backgroundImage': `url('${ignoredimage}')` }} className={css.linkStyleCopy}>{ignoredcopy.replace(/%s/g, predictedSize)}</p>;
  } else if (bothSizesSelected && selectedSize === predictedSize && selectedcopy) {
    return <p style={selectedimage && { 'backgroundImage': `url('${selectedimage}')` }} className={css.linkStyleCopy}>{selectedcopy}</p>;
  } else if (availablecopy) {
    return (
      <>
        { isDesktopView === true && <RecommendedSizeTooltip id={tooltipId} openModal={onOpenModal} /> }
        <button
          style={availableimage && { 'backgroundImage': `url('${availableimage}')` }}
          className={css.linkStyleCopy}
          type="button"
          aria-describedby={tooltipId}
          data-test-id={testId('initiateSizePrediction')}
          onClick={onOpenModal}>
          {availablecopy}
        </button>
      </>
    );
  } else {
    return null;
  }
};

interface RecommendedSizingOwnProps {
  gender: string | null;
  handleCalculateSizeClick: () => void;
  handleSetRecommendedFit: (predictedSize: string) => void;
  isOnDemandSizingModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  product: ProductDetailState;
  selectedSize?: string;
  location: Location;
  isDesktopView: boolean;
}
type PropsFromRedux = ConnectedProps<typeof connector>;
type RecommendedSizingProps = RecommendedSizingOwnProps & PropsFromRedux;

export const RecommendedSizing = (props: RecommendedSizingProps) => {
  const {
    predictedSize,
    selectedSize,
    onOpenModal,
    onCloseModal,
    handleSetRecommendedFit,
    gender,
    product: { detail },
    handleCalculateSizeClick,
    isOnDemandSizingModalOpen,
    location,
    isDesktopView,
    onDemandSizingCopy
  } = props;

  if (!detail) {
    return null;
  }

  const { productId } = detail;

  return (
    <div className={css.recommendedFitContainer}>
      <LinkStyleRecommendedSizing
        predictedSize={predictedSize}
        selectedSize={selectedSize}
        onOpenModal={onOpenModal}
        isDesktopView={isDesktopView}
        onDemandSizingCopy={onDemandSizingCopy}
      />
      {isOnDemandSizingModalOpen && <RecommendedSizeFinderModal
        productId={productId}
        gender={gender}
        onSetRecommendedFit={handleSetRecommendedFit}
        onClose={onCloseModal}
        location={location}
        handleCalculateSizeClick={handleCalculateSizeClick}
        isOpen={isOnDemandSizingModalOpen}
        predictedSize={predictedSize}/>
      }
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  const {
    product: { sizingPredictionValue },
    sizingChooser: { sizingChooser : { recommendedFit } },
    headerFooter: { content: { Global: { slotData: { onDemandSizingCopy } } = { slotData: { onDemandSizingCopy: '' } } } = {} }
  } = state;
  return {
    predictedSize : recommendedFit || sizingPredictionValue || '',
    onDemandSizingCopy
  };
};

const connector = connect(mapStateToProps);

const ConnectedRecommendedSizing = connector(RecommendedSizing);

export default withErrorBoundary('ConnectedRecommendedSizing', ConnectedRecommendedSizing);
