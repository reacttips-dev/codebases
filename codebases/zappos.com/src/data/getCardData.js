import { constructMSAImageUrl } from 'helpers';
import ProductUtils from 'helpers/ProductUtils';
import { createCurrencyObj } from 'helpers/DataFormatUtils';

const getCardData = props => {
  const {
    colorId,
    hearts,
    index,
    imageId,
    imageMap = {},
    isHovered,
    msaImageId,
    msaImageParams,
    originalPrice,
    price = null,
    productId,
    productRating,
    reviewCount,
    reviewRating,
    styleId,
    thumbnailImageId,
    imageNoBackground = false,
    animationTimerIndex,
    animationImages
  } = props;

  /**
   * Media props
   */

  const media = {
    imageIndex: index,
    isHovered: false,
    imageNoBackground,
    mainImage: {}
  };

  const msaId = imageId || thumbnailImageId || msaImageId || null;

  if (msaId) {
    const makeProductHoverImage = () => {
      const { PT01, PT03, TOPP, LEFT, RGHT, BACK } = imageMap;
      return RGHT || TOPP || LEFT || BACK || PT03 || PT01 || msaId;
    };

    const mainImage = msaId;
    const hoverImageId = makeProductHoverImage();
    const hasHoverImage = hoverImageId && mainImage !== hoverImageId;

    media.isHovered = isHovered;

    const imageParams = { ...msaImageParams, width: 255, height: 340 };
    const imageHiResParams = { ...msaImageParams, width: 768, height: 1024 };

    if (animationImages?.length > 0) {
      let activeIndex;
      // If the image has less animation frames than the timer count, just show the last one
      if (animationTimerIndex > animationImages.length - 1) {
        activeIndex = animationImages.length - 1;
      } else {
        activeIndex = animationTimerIndex;
      }

      const { msaId, attrs } = animationImages[activeIndex];

      // this doesn't get a srcSet or else animation doesn't happen
      media.mainImage = {
        src: `https://m.media-amazon.com/images/I/${msaId}._${attrs}_AC_SR255,340.jpg`
      };
    } else {
      const mainImageUrl = constructMSAImageUrl(mainImage, imageParams);
      const imageHiRes = constructMSAImageUrl(mainImage, imageHiResParams);

      media.mainImage = {
        src: mainImageUrl,
        srcSet: `${mainImageUrl} 1x, ${imageHiRes} 2x`
      };
    }

    if (hasHoverImage) {
      const hoverImageUrl = constructMSAImageUrl(hoverImageId, imageParams);
      const hoverImageHiRes = constructMSAImageUrl(hoverImageId, imageHiResParams);
      media.hoverImage = {
        src: hoverImageUrl,
        srcSet: `${hoverImageUrl} 1x, ${hoverImageHiRes} 2x`
      };
    }
  }

  /**
   * Price component props
   */

  const priceData = {};

  const priceObj = createCurrencyObj(price);

  if (price) {
    priceData.price = priceObj;
    priceData.label = priceData.price.string;
  }

  if (priceObj.string && originalPrice) {
    priceData.msrp = createCurrencyObj(originalPrice);
    priceData.onSale = ProductUtils.isStyleOnSale({ price: priceObj.string, originalPrice: priceData.msrp.string });
    if (priceData.onSale) {
      priceData.label = `On sale for ${priceData.price.string}. MSRP ${priceData.msrp.string}.`;
    }
  }

  /**
   * Review component props
   */

  const reviews = {};

  if (productRating || reviewRating) {
    const rating = typeof reviewRating === 'number' ? reviewRating : productRating;
    const floatRating = rating.toFixed(1);
    reviews.roundedRating = productRating;
    reviews.rating = floatRating;
    reviews.label = floatRating > 0 ? `${floatRating} out of 5 stars` : '';
  }

  if (reviewCount) {
    reviews.ratingCount = reviewCount;
  }

  /**
   * Hearts component props
   */
  let heartProps = {};

  if (hearts) {
    heartProps = { ...hearts, styleId, productId, colorId, price: priceData.price.string };
  }

  return { hearts: heartProps, media, price: priceData, reviews };
};

export default getCardData;
