import React, { Dispatch, FunctionComponent, useEffect, useRef, useState } from 'react';
import { useEmblaCarousel } from 'embla-carousel/react';
import cn from 'classnames';

import useWindowSize from 'hooks/useWindowSize';
import useMartyContext from 'hooks/useMartyContext';
import { LeafPortal, PortalNode } from 'helpers/PortalNodeManager';
import { ProductStyle, ProductVideo } from 'types/cloudCatalog';
import { PDPFeaturedImage, PDPFeaturedVideo } from 'types/product';
import { FormattedProductBundle } from 'reducers/detail/productDetail';
import { getProductImagesFormatted, getProductVideoFormatted } from 'helpers/ProductUtils';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import ProductGalleryFeatured from 'components/productdetail/productGallery/ProductGalleryFeatured';
import ProductGalleryThumbnails from 'components/productdetail/productGallery/ProductGalleryThumbnails';
import ProductGalleryZoomController from 'components/productdetail/productGallery/ProductGalleryZoomController';

import css from 'styles/components/productdetail/productGallery/productGallery.scss';

interface AddToCollectionProps {
  blueSkyCollectionNode: PortalNode;
}

/**
 * PDP Assets gallery add to collection heart <3
 * only rendered when not in zoom mode
 * @returns {FunctionComponent}
 */
const AddToCollection: FunctionComponent<AddToCollectionProps> = ({
  blueSkyCollectionNode
}) => (
  <div className={css.addToCollection}>
    <LeafPortal node={blueSkyCollectionNode} />
  </div>
);

interface ProductGalleryGroupProps {
  zoomIsActive: boolean;
  setZoomIsActive: Dispatch<React.SetStateAction<boolean>>;
  selectedAsset: number;
  setSelectedAsset: Dispatch<React.SetStateAction<number>>;
  productAssets: (PDPFeaturedImage | PDPFeaturedVideo)[];
  hasHorizontalThumbnails?: boolean;
}

/**
 * PDP Assets gallery  group
 * (needed to created a separate component so hooks wouldn't cause linting issues)
 * @returns {FunctionComponent}
 */
const ProductGalleryGroup: FunctionComponent<ProductGalleryGroupProps> = ({
  zoomIsActive,
  setZoomIsActive,
  selectedAsset,
  setSelectedAsset,
  productAssets,
  hasHorizontalThumbnails
}) => {

  // Pointers to the thumbnails/featured carousel
  const [baseConfig] = useState({ speed: 100, startIndex: selectedAsset });
  const [productFeaturedRef, productFeaturedCarousel] = useEmblaCarousel(baseConfig); // [containerRef, carouselApi]
  const [productThumbnailsRef, productThumbnailsCarousel] = useEmblaCarousel(baseConfig); // [containerRef, carouselApi]

  return (
    <>
      <ProductGalleryThumbnails
        productAssets={productAssets}
        // State props
        zoomIsActive={zoomIsActive}
        selectedAsset={selectedAsset}
        // Carousel ref props
        productThumbnailsRef={productThumbnailsRef}
        productThumbnailsCarousel={productThumbnailsCarousel}
        productFeaturedCarousel={productFeaturedCarousel}
        hasHorizontalThumbnails={hasHorizontalThumbnails}
      />
      <ProductGalleryFeatured
        productAssets={productAssets}
        // State props
        zoomIsActive={zoomIsActive}
        setZoomIsActive={setZoomIsActive}
        selectedAsset={selectedAsset}
        setSelectedAsset={setSelectedAsset}
        // Carousel ref props
        productFeaturedRef={productFeaturedRef}
        productFeaturedCarousel={productFeaturedCarousel}
        productThumbnailsCarousel={productThumbnailsCarousel}
      />
    </>
  );
};

interface Props {
  style: ProductStyle;
  product: FormattedProductBundle;
  productVideos: ProductVideo[];
  isYouTubeVideo: boolean;
  youtubeSrc: string | undefined;
  blueSkyCollectionNode: PortalNode | undefined;
  inQuickShop?: boolean;
  hasHorizontalThumbnails?: boolean;
}

/**
 * PDP Assets gallery container (carousel of images + videos with thumbnails + zoom controller)
 * @returns {FunctionComponent}
 */
const ProductGallery: FunctionComponent<Props> = ({
  style,
  product,
  productVideos,
  isYouTubeVideo,
  youtubeSrc,
  blueSkyCollectionNode,
  inQuickShop,
  hasHorizontalThumbnails
}) => {
  const { testId } = useMartyContext();

  // Controls the current selected gallery asset
  const [selectedAsset, setSelectedAsset] = useState(0);

  // Controls the gallery height (this is responsible for the sticky functionality not relying on css 'vh')
  const productGalleryRef = useRef<HTMLElement>(null);
  const { height: windowHeight } = useWindowSize();
  useEffect(() => {
    if (windowHeight && productGalleryRef.current !== null) {
      productGalleryRef.current.style.height = `${windowHeight}px`;
    }
  }, [windowHeight, productGalleryRef]);

  // Creates a gallery of combined assets (featured images + featured videos)
  const productAssets: (PDPFeaturedImage | PDPFeaturedVideo)[] = [];

  // Featured Images
  const productImages: PDPFeaturedImage[] = getProductImagesFormatted(style?.images, product?.defaultProductType);
  if (productImages) {
    productAssets.push(...productImages);
  }

  // Featured Videos
  const productVideo: PDPFeaturedVideo | undefined = getProductVideoFormatted(productVideos, product.productId, productAssets.length, isYouTubeVideo, youtubeSrc);
  if (productVideo) {
    productAssets.push(productVideo);
  }

  return (
    <section
      ref={productGalleryRef}
      aria-label="Product gallery"
      className={cn(css.productGallery, { [css.inQuickShop]: inQuickShop })}
      data-test-id={testId('productGalleryContainer')}
    >
      <ProductGalleryZoomController>
        {(zoomIsActive, setZoomIsActive) =>
          <>
            {!zoomIsActive && blueSkyCollectionNode && (
              <AddToCollection blueSkyCollectionNode={blueSkyCollectionNode} />
            )}
            <ProductGalleryGroup
              zoomIsActive={zoomIsActive}
              setZoomIsActive={setZoomIsActive}
              selectedAsset={selectedAsset}
              setSelectedAsset={setSelectedAsset}
              productAssets={productAssets}
              hasHorizontalThumbnails={hasHorizontalThumbnails}
            />
          </>
        }
      </ProductGalleryZoomController>
    </section>
  );
};

export default withErrorBoundary('ProductGallery', ProductGallery);
