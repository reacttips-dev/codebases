import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';

import shippingBox from 'images/shipping-box.svg';
import { AppState } from 'types/app';
import { ProductImage, ProductStyle } from 'types/cloudCatalog';
import { FormattedProductBundle } from 'reducers/detail/productDetail';
import useMartyContext from 'hooks/useMartyContext';
import { onEvent } from 'helpers/EventHelpers';
import { constructMSAImageUrl } from 'helpers/index.js';
import { generateRetinaImageParams } from 'helpers/ProductUtils';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/productdetail/addToCartSticky.scss';
// eslint-disable-next-line css-modules/no-unused-class
import cssAddToCart from 'styles/components/productdetail/addToCart.scss';

interface Props {
  addToCartText: string;
  isAppAdvertisementShowing: boolean;
  productDetail?: FormattedProductBundle;
  inView: boolean;
  entry: IntersectionObserverEntry | undefined;
  isDisabled: boolean | undefined;
  isSelectionValid: boolean;
  stockId: string | undefined;
  productStyle: ProductStyle;
  onHideSelectSizeTooltip: () => void;
  onShowSelectSizeTooltip: () => void;
  onAddToCart: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => void;
}

/**
 * PDP Sticky Add To Cart component ids
 */
const CONFIG = {
  STICKY_PARENT : 'root', // The parent node for the sticky add to cart
  BUY_BOX_FORM : 'buyBoxForm', // The buy box form
  SIZE_SELECTION : 'sizingChooser' // The container for the sizing options
};

/**
 * PDP Sticky Add To Cart Button
 * @returns {FunctionComponent}
 */
const AddToCartSticky: FunctionComponent<Props> = ({
  inView,
  entry,
  addToCartText,
  productDetail,
  isDisabled,
  stockId,
  productStyle,
  isSelectionValid,
  isAppAdvertisementShowing,
  onAddToCart,
  onShowSelectSizeTooltip,
  onHideSelectSizeTooltip
}) => {

  const { preventOnTouchDevice, testId } = useMartyContext();

  // Retrieves the featured image
  const featuredImage: ProductImage = productStyle.images?.[0] || false;

  // Figures out pricing
  const { originalPrice, percentOff, price } = productStyle;
  const hasDiscount = percentOff !== '0%';

  // Mounts the sticky add to cart button on the "root" div
  const addToCartStickyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const martyRoot = document.getElementById(CONFIG.STICKY_PARENT);
    const addToCartStickyNode = addToCartStickyRef.current;
    if (martyRoot && addToCartStickyNode) {
      martyRoot.appendChild(addToCartStickyNode);
    }
    return () => {
      if (martyRoot && addToCartStickyNode) {
        martyRoot.removeChild(addToCartStickyNode);
      }
    };
  }, [addToCartStickyRef]);

  // Checks upper boundary
  const [upperBoundary, setUpperBoundary] = useState(false);
  const checkUpperBoundary = useCallback(debounce(() => {
    const addToCartStickyNode = addToCartStickyRef.current;
    if (addToCartStickyNode) {
      const topDistance = window.pageYOffset + addToCartStickyNode.getBoundingClientRect().top;
      setUpperBoundary(topDistance > 0 && topDistance < 290);
    }
  }, 250), []);
  useEffect(() => {
    const scrollHandler = onEvent(window, 'scroll', checkUpperBoundary);
    const resizeHandler = onEvent(window, 'resize', checkUpperBoundary);
    return () => {
      scrollHandler.unbind();
      resizeHandler.unbind();
    };
  }, [checkUpperBoundary]);

  // Handles add to cart action
  const addToCartAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isSelectionValid || isDisabled) {
      // 1 - If user is missing selections, scrolls smoothly the user to it
      // 2 - If the item is auto of stock, scrolls with no animation to it (the out of stock modal actually break the animation)
      document.getElementById(CONFIG.SIZE_SELECTION)?.scrollIntoView({ behavior: isDisabled ? 'auto' : 'smooth', block: 'center' });
    } else {
      // 3 - User is good to go, scrolls with no animation to it (the add to cart success modal actually break the animation)
      document.getElementById(CONFIG.STICKY_PARENT)?.scrollIntoView();
    }
    onAddToCart(e);
  };

  return (
    <div
      aria-hidden={true}
      ref={addToCartStickyRef}
      className={cn(css.wrapper, {
        [css.shouldStick]: entry && !inView && !upperBoundary,
        [css.stickToTheTop]: entry && entry?.boundingClientRect.top <= 0,
        [css.stickToTheBottom]: entry && entry?.boundingClientRect.top > 0,
        [css.appDownloadBanner]: isAppAdvertisementShowing
      })}
    >
      <div className={css.container}>
        <div className={css.productInfo}>
          {featuredImage && (
            <div className={css.featuredImage}>
              <img
                alt={featuredImage.type}
                src={constructMSAImageUrl(featuredImage.imageId, { width: 93, height: 62, autoCrop: true })}
                srcSet={`${constructMSAImageUrl(featuredImage.imageId, generateRetinaImageParams({ width: 93, height: 62, autoCrop: true }, 2))} 2x`}
              />
            </div>
          )}
          <div className={css.productName}>
            {`${productDetail?.brandName} ${productDetail?.productName}`}
          </div>
          <div className={css.shipsFree}>
            <img src={shippingBox} alt="Ships Free" />
            ships free
          </div>
          <div className={cn(css.price, { [css.hasDiscount]: hasDiscount })}>
            {price}
            {hasDiscount && (
              <span className={css.originalPrice}>{originalPrice}</span>
            )}
          </div>
        </div>
        <div className={css.addToCart}>
          <button
            className={cn(cssAddToCart.cartButton, { [css.disabled]: isDisabled })}
            type="submit"
            form={CONFIG.BUY_BOX_FORM}
            data-stock-id={stockId}
            data-track-action="Product-Page"
            data-track-label="PrForm"
            data-track-value="Add-To-Cart-Sticky"
            data-test-id={testId('addToCartSticky')}
            onClick={addToCartAction}
            onMouseEnter={preventOnTouchDevice(onShowSelectSizeTooltip)}
            onMouseLeave={preventOnTouchDevice(onHideSelectSizeTooltip)}
            onFocus={preventOnTouchDevice(onShowSelectSizeTooltip)}
            onBlur={preventOnTouchDevice(onHideSelectSizeTooltip)}
          >
            {addToCartText}
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  isAppAdvertisementShowing: state?.appAdvertisement?.isShowing
});

export default withErrorBoundary('AddToCartSticky', connect(mapStateToProps)(AddToCartSticky));
