import React, { useCallback, useEffect, useReducer } from 'react';
import { Link } from 'react-router';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import { evMediaStreamClick, evMediaStreamImpression, evModalMediaImpression } from 'events/media';
import AmethystViewableImpression from 'components/common/AmethystViewableImpression';
import { OUTFIT_GALLERY_MODAL } from 'constants/amethystModalTypes';
import MelodyModalGallery from 'components/common/MelodyModalGallery';
import useApi from 'hooks/useApi';
import useEvent from 'hooks/useEvent';
import useMartyContext from 'hooks/useMartyContext';
import { getLooks } from 'apis/outfits';
import { getOutfitMedia } from 'apis/ugcmetadata';
import MelodyCarousel from 'components/common/MelodyCarousel';
import { HOW_IT_WAS_WORN } from 'constants/amethystMediaWidgets';
import { IMAGE } from 'constants/appConstants';
import { track } from 'apis/amethyst';
import LazyABTest from 'components/common/LazyABTest';
import { HYDRA_HOW_IT_WAS_WORN } from 'constants/hydraTests';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { OutfitMedia } from 'types/outfitMedia';

import css from 'styles/components/productdetail/howItWasWorn.scss';

export interface HowItWasWornProps {
  colorId?: string;
  hydraBlueSkyPdp: boolean;
  pageType: string;
  productId: string;
  productName: string;
}

interface State {
  isModalOpen: boolean;
  clickedIndex: number;
  imagesLoaded: number;
  isMobile: boolean;
}

const classes = {
  itemsContainer: css.carouselItemsContainer
};

const initialState: State = {
  isModalOpen: false,
  clickedIndex: 0,
  imagesLoaded: 0,
  isMobile: false
};

type ActionTypes =
  | { type: 'close' }
  | { type: 'imageLoaded' }
  | { type: 'open'; index: number }
  | { type: 'resize'; width: number };

const reducer = (state: State, action: ActionTypes) => {
  switch (action.type) {
    case 'open':
      return { ...state, isModalOpen: true, clickedIndex: action.index || 0 };
    case 'close':
      return { ...state, isModalOpen: false };
    case 'imageLoaded':
      return { ...state, imagesLoaded: state.imagesLoaded + 1 };
    case 'resize':
      return { ...state, isMobile: action.width <= 650 };
  }
};

interface OutfitMediaCarouselProps {
  media: OutfitMedia[];
  eventProps: {
    pageType: string;
    widgetType: string;
    productId: string;
    colorId?: string;
  };
}

const OutfitMediaCarousel = ({ media, eventProps }: OutfitMediaCarouselProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { testId } = useMartyContext();
  const { clickedIndex, imagesLoaded, isMobile, isModalOpen } = state;

  const onImageLoaded = () => dispatch({ type: 'imageLoaded' });

  const onCloseModal = () => dispatch({ type: 'close' });

  // useCallback to ensure that we don't cause infinite re-renders when this gets called during intialization
  const onResize = useCallback(debounce(() => dispatch({ type: 'resize', width: window.innerWidth }), 100), []);

  interface Media {
    mediaUrl: string;
    mediaType: string;
  }

  const makeOpenModalHandler = (index?: number, media?: Media) => () => {
    dispatch({ type: 'open', index: index || 0 });
    track(() => ([evMediaStreamClick, { ...eventProps, index, media }]));
  };

  useEvent(window, 'resize', onResize);

  // initialize isMobile to the proper value
  useEffect(() => {
    onResize();
    // cancel debounced event on unmount to ensure we don't try to update state when unmounted
    return () => onResize.cancel();
  }, [onResize]);

  const heading = 'Outfit Gallery';

  return (
    <>
      <MelodyCarousel
        showArrows={true}
        showDots={false}
        classes={classes}
        reconfigureNonce={imagesLoaded}
        snap={isMobile ? MelodyCarousel.snap.none : MelodyCarousel.snap.page}
      >
        {media
          .filter(outfit => outfit.mediaType === IMAGE)
          .map(({ mediaUrl, mediaType }, i) => {
            const media = { mediaUrl, mediaType };
            const mediaList = [media];
            return (
              <AmethystViewableImpression
                key={mediaUrl}
                event={evMediaStreamImpression}
                media={mediaList}
                {...eventProps}
              >
                <button
                  type="button"
                  onClick={makeOpenModalHandler(i, media)}
                  aria-label={`Outfit ${i + 1}`}
                  data-test-id={testId('outfit')}
                >
                  <img
                    alt="outfit"
                    src={mediaUrl}
                    onLoad={onImageLoaded}
                  />
                </button>
              </AmethystViewableImpression>
            );
          })}
      </MelodyCarousel>
      <button
        type="button"
        className={css.seeAllLink}
        onClick={makeOpenModalHandler()}
        data-test-id={testId('seeAllOutfits')}
      >
        See All {media.length} Outfits
      </button>
      <MelodyModalGallery
        heading={heading}
        items={media}
        itemName="Outfits"
        isOpen={isModalOpen}
        clickedIndex={clickedIndex}
        onRequestClose={onCloseModal}
        eventModalType={OUTFIT_GALLERY_MODAL}
        className={css.smallModal}
      >
        {({ mediaUrl, mediaType }) => {
          const mediaList = [{ mediaUrl, mediaType }];
          return (
            <AmethystViewableImpression
              {...eventProps}
              event={evModalMediaImpression}
              modal={OUTFIT_GALLERY_MODAL}
              media={mediaList}
              key={mediaUrl}
            >
              <img alt="outfit" src={mediaUrl} className={css.modalImage}/>
            </AmethystViewableImpression>
          );
        }}
      </MelodyModalGallery>
    </>
  );
};

export const HowItWasWorn = ({ colorId, media = [], hydraBlueSkyPdp, productId, productName, pageType }: HowItWasWornProps & { media: OutfitMedia[] }) => {
  const eventProps = {
    pageType,
    productId,
    colorId,
    widgetType: HOW_IT_WAS_WORN
  };
  const { testId } = useMartyContext();
  const hasMedia = media.length > 0;

  return (
    <div className={cn(css.wrapper, { [css.fullWidth]: hydraBlueSkyPdp })} data-test-id={testId('hiwwContainer')}>
      <h2>{hasMedia ? 'How It Was Worn' : 'Show how you wore it!'}</h2>
      {!hasMedia && (
        <p className={css.noLooksMessage}>
          Be the first to add your {productName} outfit to this gallery!
        </p>
      )}
      <Link
        className={css.shareBtn}
        to={`/product/review/add/media/${productId}${
          colorId ? `/color/${colorId}` : ''
        }`}
        data-test-id={testId('outfitShareButton')}
      >
        Share Your Outfit
      </Link>
      {hasMedia && <OutfitMediaCarousel media={media} eventProps={eventProps} />}
      <div className={css.footer}>
        <hr />
      </div>
    </div>
  );
};

const HowItWasWornExperiment = (props: HowItWasWornProps) => {
  const { productId } = props;
  const { isLoaded: looksLoaded, data: oldOutfitMedia } = useApi(getLooks, [productId]);
  const { isLoaded, data: outfitMedia } = useApi(getOutfitMedia, [productId]);

  if (!isLoaded && !looksLoaded) {
    return null;
  }

  const hasMedia = (oldOutfitMedia && oldOutfitMedia?.media.length > 0) || (outfitMedia && outfitMedia?.media.length > 0) || false;
  const defaultMedia: OutfitMedia[] = [];

  const treatments = [
    () => <HowItWasWorn media={oldOutfitMedia?.media || defaultMedia} {...props} />,
    () => <HowItWasWorn media={outfitMedia?.media || defaultMedia} {...props} />
  ];

  return (
    <LazyABTest
      test={HYDRA_HOW_IT_WAS_WORN}
      triggerCondition={hasMedia}
      treatments={treatments}
    />
  );
};

HowItWasWornExperiment.displayName = 'HowItWasWornExperiment';

export default withErrorBoundary(HowItWasWornExperiment.displayName, HowItWasWornExperiment);
