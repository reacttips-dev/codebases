import React, { MouseEvent, Suspense, useCallback, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { loadOutfitData } from 'actions/outfits';
import { AppState } from 'types/app';
import { isAssigned } from 'actions/ab';
import { HYDRA_BLUE_SKY_PDP, HYDRA_OUTFITS_ON_WEB } from 'constants/hydraTests';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import IntersectionObserver from 'components/common/IntersectionObserver';
import { SmallLoader } from 'components/Loader';
import { Outfit } from 'types/outfits';
import useMartyContext from 'hooks/useMartyContext';
import { evOutfitStreamClick } from 'events/outfits';
import { PRODUCT_PAGE } from 'constants/amethystPageTypes';
import { isLeftClickEvent, isModifiedEvent } from 'helpers/EventHelpers';

const OutfitStream = React.lazy(() => import('components/outfits/OutfitStream'));
const LazyOutfitQuickView = React.lazy(() => import('components/outfits/OutfitQuickView'));
type ExplicitProps = { productId: string; styleId: string; treatmentToShow: number};
type DataLoadingOutfitTreatmentProps = ExplicitProps & PropsFromRedux;

export type ModalStateOutfit = { outfit: Outfit; productId: string; styleId: string; link: string};

type ModalState = { open: boolean; selectedValue?: ModalStateOutfit};
const QUICKVIEW_OPTIONS = { };
export const DataLoadingOutfitTreatment = (props: DataLoadingOutfitTreatmentProps) => {
  const { productId, styleId, fullWidth, data, loadOutfitData, shouldDisplay } = props;
  const [modalState, setModalState] = useState<ModalState>({ open: false });
  const { amethystTrack } = useMartyContext();
  const closeModal = useCallback(() => setModalState({ open: false }), [setModalState]);
  useEffect(() => {
    loadOutfitData(productId, styleId);
  }, [productId, styleId, loadOutfitData]);
  const openPopup = useCallback((e: MouseEvent, outfit: Outfit, styleId: string) => {
    if (isLeftClickEvent(e) && !isModifiedEvent(e)) {
      e.preventDefault();
      const selectedItem = outfit.items.find(item => item.styleId === styleId);
      if (selectedItem) {
        amethystTrack(() => [evOutfitStreamClick, {
          pageType: PRODUCT_PAGE,
          outfit,
          allOutfits: data,
          productId,
          styleId
        }]);
        setModalState({
          open: true,
          selectedValue: {
            outfit,
            productId: selectedItem.productId,
            styleId: selectedItem.styleId,
            link: selectedItem.link
          }
        });
      }
    }

  }, [amethystTrack, data, productId]);
  // lazy load via code splitting
  return shouldDisplay && data.length ? (
    <Suspense fallback={null}>
      <OutfitStream
        outfits={data}
        fullWidth={fullWidth}
        productId={productId}
        styleId={styleId}
        onOpen={openPopup}/>
      { modalState.open && modalState.selectedValue && <LazyOutfitQuickView closeModal={closeModal} cardData={modalState.selectedValue} options={QUICKVIEW_OPTIONS}/> }
    </Suspense>
  ) : null;
};
const mapStateToProps = (state: AppState, { treatmentToShow }: ExplicitProps) => ({
  // Once we get firmer requirements on page placement this will potentially be in multiple places
  shouldDisplay: isAssigned(HYDRA_OUTFITS_ON_WEB, treatmentToShow, state),
  fullWidth: isAssigned(HYDRA_BLUE_SKY_PDP, 1, state),
  data: state.outfits.currentStyleId ? state.outfits.data[state.outfits.currentStyleId] || [] : []
});

const connector = connect(mapStateToProps, { loadOutfitData });

type PropsFromRedux = ConnectedProps<typeof connector>;

export const ConnectedOutfitExperimentWrapper = connector(DataLoadingOutfitTreatment);
// Trigger the data loading and rendering when this component is about to be shown in the viewport
const LazyConnectedComponent = (props: ExplicitProps) => (
  <IntersectionObserver>
    <Suspense fallback={SmallLoader}>
      <ConnectedOutfitExperimentWrapper {...props}/>
    </Suspense>
  </IntersectionObserver>
);
LazyConnectedComponent.displayName = 'LazyDataLoadingOutfitTreatment';
export const StoreConnectedDataLoadingOutfitTreatment = withErrorBoundary(LazyConnectedComponent.displayName, LazyConnectedComponent);
