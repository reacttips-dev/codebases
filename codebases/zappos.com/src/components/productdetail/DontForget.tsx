import React, { useEffect } from 'react';
import { Link } from 'react-router';
import cn from 'classnames';

import ImageLazyLoader from 'components/common/ImageLazyLoader';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import MelodyCarousel from 'components/common/MelodyCarousel';
import Heart from 'components/common/Heart';
import { constructMSAImageUrl } from 'helpers/index';
import { makeHandleHeartButtonClick } from 'helpers/HeartUtils';
import { DontForgetProduct } from 'reducers/dontForget';
import { ProductStyle } from 'types/cloudCatalog';
import { trackEvent } from 'helpers/analytics';

import css from 'styles/components/productdetail/dontForget.scss';

const imagePlaceholder = <div className={css.thumbnailPlaceholder} />;

interface Props {
  heading?: string;
  heartsData: any;
  imageHeight?: number;
  imageWidth?: number;
  isLoading: boolean;
  product?: DontForgetProduct;
  showDots?: boolean;
}

const trackDontForgetCarouselInteract = (productId: string) => () => {
  trackEvent('TE_DONTFORGET_CAROUSEL_INTERACT', `ProductID:${productId}`);
};

const trackDontForgetItemClick = (styleId: string) => () => {
  trackEvent('TE_DONTFORGET_ITEM_CLICK', `StyleID:${styleId}`);
};

export const DontForget = ({
  product,
  isLoading,
  heartsData = {},
  showDots = false,
  imageHeight = 102,
  imageWidth = 136,
  heading = 'Don\'t Forget...'
}: Props) => {
  const maybeProductId = (!isLoading && product) ? product.productId : null;
  useEffect(() => {
    if (maybeProductId) {
      trackEvent('TE_DONTFORGET_VIEW', `ProductID:${maybeProductId}`);
    }
  }, [maybeProductId]);

  if (isLoading || !product) {
    return null;
  }

  const {
    brandName,
    productId,
    productName,
    styles
  } = product;

  const handleHeartClick = (style: ProductStyle, productId: string) => {
    const { onHeartClick, showFavoriteHeart, hearts } = heartsData;
    return makeHandleHeartButtonClick(({
      hearts,
      onHeartClick,
      productId,
      showFavoriteHeart,
      style
    }) as any); // TODO ts fix this if/when hearts are typed
  };

  const returnArrowOverrideObj = { top: 'calc(50% - 30px)' };
  const { showFavoriteHeart, hearts, heartsList } = heartsData;

  return (
    <div id="dontForget" className={css.dontForget}>
      <h2 className={css.heading}>{heading}</h2>
      <MelodyCarousel showDots={showDots} arrowStyleOverrides={returnArrowOverrideObj} afterSlide={trackDontForgetCarouselInteract(productId)}>
        {styles.map((style, index) => {
          const { swatchId, productUrl, basePrice, salePrice, styleId } = style;
          const onSale = basePrice !== salePrice;
          const { imageId } = styles[index];
          const imgProps = {
            src: constructMSAImageUrl(imageId, { height: imageHeight, width: imageWidth, autoCrop: true }),
            alt: `${brandName} ${productName}`,
            className: css.thumbnail
          };

          const heartProps = {
            cssHeartContainer: css.heartContainer,
            cssHeartActive: css.heartActive,
            handleHeartClick,
            hearts,
            heartsList,
            productId,
            showFavoriteHeart,
            style
          };
          return (
            <div key={swatchId} className={css.dontForgetElemContainer}>
              <Link
                to={productUrl}
                className={css.link}
                onClick={trackDontForgetItemClick(styleId)}
              >
                <div>
                  <ImageLazyLoader imgProps={imgProps} placeHolder={imagePlaceholder} />
                </div>
                <div>
                  <Heart {...heartProps} />

                  <div className={css.brandName}>{brandName}</div>
                  <div className={css.productNameWithoutBrand}>{productName}</div>
                  <span className={css.priceContainer}>
                    <span className={cn(css.price, { [css.salePrice]: !!onSale })}>{salePrice}</span>
                    {!!onSale && !!basePrice && (
                      <div>
                        <span className={css.originalPricePrefix}>MSRP: </span>
                        <span className={css.originalPrice}>{basePrice}</span>
                      </div>
                    )}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </MelodyCarousel>
    </div>
  );
};

export default withErrorBoundary('DontForget', DontForget);
