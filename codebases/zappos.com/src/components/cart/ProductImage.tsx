import React from 'react';
import { Link } from 'react-router';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import { constructLayeredMsaImageSizingPositioning, constructLayeredMsaImageUrl, constructMSAImageUrl } from 'helpers/index';
import { FILE_NAME_NO_EXT } from 'common/regex';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { TsdImages } from 'types/cloudCatalog';

import css from 'styles/components/cart/productImage.scss';
import { imageNoBackground, mCard, image as mImage } from 'styles/components/common/melodyCard.scss';

const imageDimensions = { width: 500, height: 500, autoCrop: true };
const layeredImageSizing = constructLayeredMsaImageSizingPositioning(500);

interface Props {
  item: any; // TODO ts use correct type when cloudlist is typed
  className?: string;
  dataTe?: string;
  tabIndex?: number;
  ariaHidden?: boolean;
}
export const ProductImage = ({ item, className, dataTe, tabIndex = 0, ariaHidden = false, ...rest }: Props) => {
  const { testId, marketplace: { shortName, isTsdImage, pdp: { egcUrl } } } = useMartyContext();

  const {
    imageId,
    imageUrl,
    image: { defaultUrl = undefined } = {},
    egc,
    asin,
    productId,
    brandName,
    brand,
    style,
    productName,
    recoName
  } = item;

  let link: string = '';
  let alt: string = '';
  const parsedImageId = imageId ? imageId : (imageUrl || defaultUrl).match(FILE_NAME_NO_EXT)[0];
  const catalogueBundleImages: TsdImages = item.catalogBundle?.tsdImages;
  let botImageId, topImageId;
  if (catalogueBundleImages) {
    topImageId = catalogueBundleImages.imageIds?.[0];
    botImageId = catalogueBundleImages.backgroundId;
  }

  let url;
  if (isTsdImage && topImageId && botImageId) {
    url = constructLayeredMsaImageUrl({
      ...layeredImageSizing,
      topImageId,
      botImageId
    } as any); // TODO ts `as any` copied from reducers/detail/productDetail.ts, probably use something better here
  } else {
    url = constructMSAImageUrl(parsedImageId, imageDimensions);
  }
  if (egc) {
    link = egcUrl;
    alt = `${shortName} Gift Card`;
  } else {
    link = asin ? `/p/asin/${asin}` : `/product/${productId}`;
    alt = `${brandName || brand} ${productName || style}`;
  }

  link = recoName ? `${link}?ref=${recoName}` : link;

  return (
    <div className={cn(css.container, mCard, className)} {...rest}>
      <Link
        data-test-id={testId('cartItemImage')}
        tabIndex={tabIndex}
        aria-hidden={ariaHidden}
        to={link}
        data-te={dataTe || 'TE_CART_PRODUCTCLICKED'}
        data-ted={asin}
        className={cn(mImage, { [imageNoBackground]: isTsdImage })}>
        <img src={url} alt={alt} data-test-id={testId('imageSrc')}/>
      </Link>
    </div>
  );
};

const WithErrorBoundaryProductImage = withErrorBoundary('ProductImage', ProductImage);
export default WithErrorBoundaryProductImage;
