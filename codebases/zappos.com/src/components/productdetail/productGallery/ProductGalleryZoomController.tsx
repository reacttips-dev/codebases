import React, { Dispatch, FunctionComponent, MouseEventHandler, useEffect, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import useMartyContext from 'hooks/useMartyContext';
import useEvent from 'hooks/useEvent';
import { getPDPTrackingPropsFormatted } from 'helpers/ProductUtils';
import { PDPFeaturedImage } from 'types/product';
import MelodyModal from 'components/common/MelodyModal';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { AriaLiveTee } from 'components/common/AriaLive';

import css from 'styles/components/productdetail/productGallery/productGalleryZoomController.scss';

interface ZoomInstructionsProps {
  showInstructions: boolean;
  setShowInstructions: Dispatch<React.SetStateAction<boolean>>;
}

/**
 * PDP Assets gallery zoom instructions banner
 * @returns {FunctionComponent}
 */
const ZoomInstructions: FunctionComponent<ZoomInstructionsProps> = ({
  showInstructions,
  setShowInstructions
}) => {
  const { testId } = useMartyContext();
  return showInstructions ? (
    <AriaLiveTee>
      <div
        className={css.zoom__banner}
        data-test-id={testId('productGalleryZoomBanner')}
      >
        <div>Drag image to see more details</div>
        <button
          type="button"
          onClick={() => setShowInstructions(false)}
          aria-label="Close zoom instructions"
          data-test-id={testId('productGalleryZoomBannerClose')}
          {...getPDPTrackingPropsFormatted('Zoom-Instructions-Close', 'Button-Click')}
        />
      </div>
    </AriaLiveTee>
  ) : null;
};

interface ZoomControlsProps {
  scale: number;
  zoomIn: MouseEventHandler<HTMLButtonElement>;
  zoomOut: MouseEventHandler<HTMLButtonElement>;
  positionX: number;
  positionY: number;
  setPositionX: Dispatch<React.SetStateAction<number>>;
  setPositionY: Dispatch<React.SetStateAction<number>>;
  minScale: number;
  maxScale: number;
}

/**
 * PDP Assets gallery zoom controls
 * @returns {FunctionComponent}
 */
const ZoomControls: FunctionComponent<ZoomControlsProps> = ({
  scale,
  minScale,
  maxScale,
  zoomIn,
  zoomOut,
  positionX,
  positionY,
  setPositionX,
  setPositionY
}) => {
  const { testId } = useMartyContext();

  // Handler for panning trough the image using arrow keys
  useEvent(document, 'keyup', ((keyboard: KeyboardEvent) => {
    const moveFactor = 25;
    switch (keyboard.code) {
      case 'ArrowUp':
        setPositionY(positionY + moveFactor);
        break;
      case 'ArrowDown':
        setPositionY(positionY - moveFactor);
        break;
      case 'ArrowLeft':
        setPositionX(positionX + moveFactor);
        break;
      case 'ArrowRight':
        setPositionX(positionX - moveFactor);
        break;
      default:
        break;
    }
  }) as EventListener);

  return (
    <div className={css.zoom__controls}>
      <button
        type="button"
        onClick={zoomOut}
        aria-label="Zoom Out"
        disabled={scale === minScale}
        data-test-id={testId('zoomOut')}
        {...getPDPTrackingPropsFormatted('Zoom-Out', 'Zoom-Control-Click')}
      />
      <div data-test-id={testId('zoomValue')}>{`${Math.round(scale * 100)}%`}</div>
      <button
        type="button"
        onClick={zoomIn}
        aria-label="Zoom In"
        disabled={scale === maxScale}
        data-test-id={testId('zoomIn')}
        {...getPDPTrackingPropsFormatted('Zoom-In', 'Zoom-Control-Click')}
      />
    </div>
  );
};

interface ImageZoomedProps {
  scale: number;
  zoomIn: MouseEventHandler<HTMLButtonElement>;
  zoomOut: MouseEventHandler<HTMLButtonElement>;
  positionX: number;
  positionY: number;
  setPositionX: Dispatch<React.SetStateAction<number>>;
  setPositionY: Dispatch<React.SetStateAction<number>>;
  image: PDPFeaturedImage;
  showInstructions: boolean;
  setShowInstructions: Dispatch<React.SetStateAction<boolean>>;
  minScale: number;
  maxScale: number;
}

/**
 * PDP Assets gallery zoomed image
 * @returns {FunctionComponent}
 */
const ImageZoomed: FunctionComponent<ImageZoomedProps> = ({
  scale,
  minScale,
  maxScale,
  zoomIn,
  zoomOut,
  positionX,
  positionY,
  setPositionX,
  setPositionY,
  image,
  showInstructions,
  setShowInstructions
}) => {

  // Needs to make sure image is loaded before auto-zooming
  const [imageLoaded, setImageLoaded] = useState(false);
  const { testId } = useMartyContext();
  useEffect(() => {
    // Auto zoom in effect when in zoom mode for the first time
    if (imageLoaded) {
      setTimeout(zoomIn, 250, {});
    }
  }, [imageLoaded, zoomIn]);

  return (
    <>
      <ZoomInstructions
        showInstructions={showInstructions}
        setShowInstructions={setShowInstructions}
      />
      <ZoomControls
        scale={scale}
        minScale={minScale}
        maxScale={maxScale}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        positionX={positionX}
        positionY={positionY}
        setPositionX={setPositionX}
        setPositionY={setPositionY}
      />
      <TransformComponent>
        <img
          data-test-id={testId('zoomedImg')}
          alt={`${image.alt} Zoom`}
          src={image.zoom.src}
          srcSet={image.zoom.retinaSrc}
          onLoad={() => setImageLoaded(true)}
        />
      </TransformComponent>
    </>
  );
};

interface ZoomWrapperProps {
  scale: number;
  zoomIn: MouseEventHandler<HTMLButtonElement>;
  zoomOut: MouseEventHandler<HTMLButtonElement>;
  positionX: number;
  positionY: number;
  setPositionX: Dispatch<React.SetStateAction<number>>;
  setPositionY: Dispatch<React.SetStateAction<number>>;
}

interface ImageFeaturedZoomProps {
  image: PDPFeaturedImage;
  showInstructions: boolean;
  setShowInstructions: Dispatch<React.SetStateAction<boolean>>;
}
/**
 * PDP Assets gallery asset zoom
 * @see https://github.com/prc5/react-zoom-pan-pinch
 * @returns {FunctionComponent}
 */
export const ImageFeaturedZoom: FunctionComponent<ImageFeaturedZoomProps> = ({
  image,
  showInstructions,
  setShowInstructions
}) => {
  // Zoom framework config objects
  const BASE_CONTROLS = {
    minScale: 1,
    maxScale: 8,
    limitToWrapper: true,
    wrapperClass: css.zoom,
    contentClass: css.zoom__content
  };
  const ZOOM_CONTROLS = {
    step: 12
  };
  const DISABLE_CONTROLS = {
    disabled: true
  };

  return (
    <TransformWrapper
      defaultScale={BASE_CONTROLS.minScale}
      defaultPositionX={-1}
      defaultPositionY={-1}
      pinch={ZOOM_CONTROLS}
      zoomIn={ZOOM_CONTROLS}
      zoomOut={ZOOM_CONTROLS}
      wheel={DISABLE_CONTROLS}
      options={BASE_CONTROLS}
    >
      {({ scale, zoomIn, zoomOut, positionX, positionY, setPositionX, setPositionY }: ZoomWrapperProps) => (
        <ImageZoomed
          image={image}
          showInstructions={showInstructions}
          setShowInstructions={setShowInstructions}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          positionX={positionX}
          positionY={positionY}
          setPositionX={setPositionX}
          setPositionY={setPositionY}
          scale={scale}
          minScale={BASE_CONTROLS.minScale}
          maxScale={BASE_CONTROLS.maxScale} />
      )}
    </TransformWrapper>
  );
};

interface Props {
  children: (zoomIsActive: boolean, setZoomIsActive: Dispatch<React.SetStateAction<boolean>>) => React.ReactNode;
}

/**
 * PDP Assets gallery zoom mode
 * @returns {FunctionComponent}
 */
const ProductGalleryZoomController: FunctionComponent<Props> = ({
  children
}) => {
  // Controls the zoom mode
  const [zoomIsActive, setZoomIsActive] = useState(false);

  return (
    // When zoom is active, the product gallery gets rendered inside of a fullscreen modal
    zoomIsActive ? (
      <MelodyModal
        isOpen={true}
        className={css.zoom__modal}
        heading="Product Gallery Zoom"
        buttonTestId="productGalleryZoomClose"
        onRequestClose={() => setZoomIsActive(false)}
      >
        {children(zoomIsActive, setZoomIsActive)}
      </MelodyModal>
    ) : (
      <>
        {children(zoomIsActive, setZoomIsActive)}
      </>
    )
  );
};

export default withErrorBoundary('ProductGalleryZoomController', ProductGalleryZoomController);
