import React, { createElement } from 'react';
import { Link } from 'react-router';
import cn from 'classnames';

import ImageLazyLoader from 'components/common/ImageLazyLoader';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { constructLayeredMsaImageSizingPositioning, constructLayeredMsaImageUrl, constructMSAImageUrl, makeAscii } from 'helpers';
import { SmallLoader } from 'components/Loader';
import { usdToNumber } from 'helpers/NumberFormats';
import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/zen/smallProduct.scss';

const defaultRegularMsaDimensions = 73;
const defaulThreeSixtyDimensions = 94;
const loaderPlaceholder = <SmallLoader additionalClassNames={css.imagePlaceholder}/>;

export const SmallProductCard = props => {
  const { testId } = useMartyContext();
  const {
    cardData, shouldLazyLoad = true, alt = '', type, productClass, onClick, overrideContainer,
    msaImageDimensions = defaultRegularMsaDimensions, threeSixtyDimensions = defaulThreeSixtyDimensions
  } = props;
  const { imageMap, productSeoUrl, productName, brandName, srcUrl, retinaUrl, msaImageId, imageId, price, productUrlRelative, productUrl } = cardData;

  let imageUrl = srcUrl;
  let imageUrlRetina = retinaUrl;
  const has360 = imageMap?.['TSD'];
  if (!srcUrl) {
    if (has360?.backgroundId && has360.imageIds?.length) {
      // 360 imgs
      imageUrl = constructLayeredMsaImageUrl({
        ...constructLayeredMsaImageSizingPositioning(threeSixtyDimensions),
        topImageId: has360.imageIds[0],
        botImageId: has360.backgroundId
      });
      imageUrlRetina = constructLayeredMsaImageUrl({
        ...constructLayeredMsaImageSizingPositioning(threeSixtyDimensions * 2),
        topImageId: has360.imageIds[0],
        botImageId: has360.backgroundId
      });
    } else {
      // Non-360 imgs, or the background image is missing for the 360s
      const imgId = msaImageId || imageId;
      const msaImageDimensionsRetina = msaImageDimensions * 2;
      imageUrl = constructMSAImageUrl(imgId, { width: msaImageDimensions, height: msaImageDimensions, autoCrop: true });
      imageUrlRetina = constructMSAImageUrl(imgId, { width: msaImageDimensionsRetina, height: msaImageDimensionsRetina, autoCrop: true });
    }
  }

  const handleClick = evt => onClick && onClick(evt, props);
  const imgProps = { alt, src: imageUrl, srcSet: imageUrlRetina ? `${imageUrl} 1x, ${imageUrlRetina} 2x` : null };
  const contents = (
    <>
      <figure className={css.imageWrapper} data-test-id={testId('productImage')}>
        <meta itemProp="image" content={imageUrl} />
        <ImageLazyLoader
          className={cn({ [css.has360]: has360 })}
          forceLoad={!shouldLazyLoad}
          placeholder={loaderPlaceholder}
          imgProps={imgProps}/>
      </figure>
      <div className={css.productInfo}>
        <p
          className={css.productBrandName}
          data-test-id={testId('brandName')}
          itemProp="brand"
          itemScope
          itemType="http://schema.org/Brand">{makeAscii(brandName)}</p>
        <p className={css.productStyleName} data-test-id={testId('productName')} itemProp="name">{makeAscii(productName)}</p>
        <p
          itemProp="offers"
          itemScope
          itemType="http://schema.org/Offer">
          <meta itemProp="priceCurrency" content="USD"/>
          <span
            className={css.productPrice}
            data-test-id={testId('price')}
            itemProp="price"
            content={usdToNumber(price)}>{price}</span>
        </p>
      </div>
    </>
  );

  return createElement(
    overrideContainer || Link,
    {
      'onClick': handleClick,
      'itemScope': true,
      'itemType': 'http://schema.org/Product',
      'data-test-id': testId('smallProductCard'),
      'className': cn(
        css.product,
        { [css.flexv]: type === 'flexv' },
        { [css.flexvsimple]: type === 'flexvsimple' },
        productClass),
      'to': productSeoUrl || productUrlRelative || productUrl
    },
    contents
  );
};

SmallProductCard.displayName = 'SmallProductCard';

export default withErrorBoundary('SmallProductCard', SmallProductCard);
