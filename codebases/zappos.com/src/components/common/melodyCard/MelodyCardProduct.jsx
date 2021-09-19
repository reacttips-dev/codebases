import { Component, useCallback } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { deepEqual } from 'fast-equals';
import queryString from 'query-string';

import { SEARCH_PAGE } from 'constants/amethystPageTypes';
import Rating from 'components/Rating';
import { constructMSAImageUrl, makeAscii } from 'helpers';
import { makeHandleHeartButtonClick } from 'helpers/HeartUtils';
import ProductUtils from 'helpers/ProductUtils';
import { SmallLoader } from 'components/Loader';
import SocialCollectionsWidget from 'components/account/Collections/SocialCollectionsWidget';
import ImageLazyLoader from 'components/common/ImageLazyLoader';
import Heart from 'components/common/Heart';
import marketplace from 'cfg/marketplace.json';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import CrossSiteLabel from 'components/common/melodyCard/CrossSiteLabel';
import { HYDRA_IMAGES_BY_ZYCADA } from 'constants/hydraTests';
import { isAssigned } from 'actions/ab';
import { MartyContext } from 'utils/context';
import TrustedRetailerBanner from 'components/common/TrustedRetailerBanner';
import SponsoredBanner from 'components/common/SponsoredBanner';
import { usdToNumber } from 'helpers/NumberFormats';
import MelodyModal from 'components/common/MelodyModal';
import MelodyCarousel from 'components/common/MelodyCarousel';
import { XSLL_EXCLUDED_PRODUCT_IMAGES } from 'constants/appConstants';
import { crossSiteSellingUniqueIdentifier } from 'helpers/SearchUtils';

// order matters
import commonCardCss from 'styles/components/common/melodyCard.scss';
import css from 'styles/components/common/melodyCardProduct.scss';
import crossSiteProductsCss from 'styles/components/search/crossSiteProducts.scss';

const {
  crossSiteQsParam,
  domain,
  melodyProductCard: {
    defaultNoBackground,
    defaultComponentStyle,
    forceHighRes,
    hasStyleRoomProductFlag,
    hideMsrp = false
  },
  search: {
    hasCrossSiteSearches
  }
} = marketplace;

const LOAD_THRESHOLD = 1.8;
const VALID_CROSS_SITE_TAGS = new Set(['A', 'BUTTON']);

const MakeSocialCollectionWidget = ({ styleId, isCollectionShown, productId, colorId, price }) => {
  const getStyleId = useCallback(() => styleId, [styleId]);

  if (!(styleId && isCollectionShown)) {
    return null;
  }

  return (
    <div className={css.collection}>
      <SocialCollectionsWidget
        getStyleId={getStyleId}
        productId={productId}
        colorId={colorId}
        price={price}
        sourcePage={SEARCH_PAGE}
      />
    </div>
  );
};

/* eslint-disable css-modules/no-undef-class */
export const getComponentStyling = (componentStyle, showFavoriteHeart, crossSite) => {
  switch (componentStyle) {
    case 'recommender':
    case 'productSearchNoStyle':
      return cn(
        css.melodyCardInCarousel,
        { [css.heartListContainer]: showFavoriteHeart }
      );
    case 'melodyCurated':
      return cn(
        css.melodyCurated,
        { [css.heartListContainer]: showFavoriteHeart }
      );
    case 'melodyGrid':
      return cn(
        css.melodyGrid,
        { [css.heartListContainer]: showFavoriteHeart }
      );
    case 'oos':
      return css.melodyCardOosModal;
    case 'melodySimple':
      return css.melodySimple;
    case 'fullBleed':
      return css.fullBleed;
    case 'searchProduct':
    case 'searchProductInlineRecos':
    case 'searchProductCrossSite':
      return cn(
        css.searchOverrides,
        { [css.hasHeart]: showFavoriteHeart },
        { [css.isCrossSite]: !!crossSite }
      );
    case 'brandTrendingStyle':
      return cn(
        { [css.heartListContainer]: showFavoriteHeart }
      );
    default:
      return null;
  }
};
/* eslint-disable css-modules/no-undef-class */

export class MelodyCardProduct extends Component {
  static displayName = 'MelodyCardProduct';

  state = {
    hasProductBeenHovered: false,
    isProductFocused: false,
    isProductHovered: false,
    isCollectionShown: false,
    parentImageLoaded: false,
    crossSiteModalVisible: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    const {
      isProductFocused, hasProductBeenHovered, isProductHovered, isCollectionShown, parentImageLoaded, crossSiteModalVisible
    } = this.state;
    const { additionalClasses, msaImageParams, heartsData, cardData: { animationImages, price, originalPrice }, belowImageOptions, belowImageRenderer } = this.props;
    const { hearts, heartsList } = heartsData || {};
    const { heartsData: nextHeartsData, cardData: nextCardData, belowImageOptions: nextBelowImageOptions, belowImageRenderer: nextBelowImageRenderer } = nextProps;
    const { hearts: nextHearts, heartsList: nextHeartsList } = nextHeartsData || {};

    if (animationImages?.length > 0) {
      return true;
    }
    return !deepEqual(nextProps.additionalClasses, additionalClasses)
    || !deepEqual(nextProps.msaImageParams, msaImageParams)
    || !deepEqual(nextHearts, hearts)
    || !deepEqual(nextHeartsList, heartsList)
    || nextState.isProductFocused !== isProductFocused
    || nextState.isProductHovered !== isProductHovered
    || nextState.hasProductBeenHovered !== hasProductBeenHovered
    || nextState.isCollectionShown !== isCollectionShown
    || nextState.parentImageLoaded !== parentImageLoaded
    || nextState.crossSiteModalVisible !== crossSiteModalVisible
    || nextCardData.price !== price
    || nextCardData.originalPrice !== originalPrice
    || nextBelowImageOptions !== belowImageOptions
    || nextBelowImageRenderer !== belowImageRenderer;
  }

  testId;

  makeProductNameText = () => {
    const { cardData: { name, productName } } = this.props;
    return makeAscii(name || productName || '');
  };

  makeBrandNameText = () => {
    const { cardData: { brand, brandName } } = this.props;
    return makeAscii(brand || brandName || '');
  };

  makeBrandName = () => {
    const {
      testId,
      props: { additionalClasses }
    } = this;
    const brandName = this.makeBrandNameText();
    return (brandName &&
      <p
        className={cn(css.brandName, additionalClasses.brandName)}
        itemProp="brand"
        itemScope
        itemType="http://schema.org/Brand"
        data-test-id={testId('brand')}>
        {/* This span is unfortunately necessary for the brand schema  */}
        <span itemProp="name">{brandName}</span>
      </p>
    );
  };

  makeProductName = () => {
    const { testId } = this;
    const productName = this.makeProductNameText();
    return (productName &&
      <p
        className={css.productName}
        itemProp="name"
        data-test-id={testId('productName')}>
        {productName}
      </p>
    );
  };

  makeColorName = () => {
    const { testId } = this;
    const { cardData: { colorName } } = this.props;
    return (colorName &&
      <p
        className={css.colorName}
        itemProp="color"
        data-test-id={testId('colorName')}>
        {makeAscii(colorName)}
      </p>
    );
  };

  makePrice = () => {
    const { testId } = this;
    const {
      cardData: { price, originalPrice },
      additionalClasses,
      alwaysShowOriginalPrice
    } = this.props;
    if (price) {
      const isSale = ProductUtils.isStyleOnSale({ price, originalPrice });
      const msrp = (hideMsrp === true) ? null : <span className={css.msrpLabel}>MSRP: </span>;
      // do not use itemProp="price" because it is volatile
      return (
        <p
          className={cn(css.priceContainer, additionalClasses.priceContainer, { [css.alwaysShowOriginalPrice]: alwaysShowOriginalPrice })}
          itemProp="offers"
          itemScope
          itemType="http://schema.org/Offer">
          <meta itemProp="priceCurrency" content="USD"/>
          <span
            className={cn(css.price, { [css.priceSale]: isSale })}
            itemProp="price"
            content={usdToNumber(price)}
            data-test-id={testId('price')}>{price}</span>
          {isSale && <span className={css.originalPrice} data-test-id={testId('originalPrice')}>{msrp}{originalPrice}</span>}
        </p>
      );
    }
    return null;
  };

  makeProductRating = () => {
    const { cardData: { productRating = '0', reviewCount }, showRatingStars, crossSite } = this.props;
    const showStars = typeof showRatingStars === 'boolean' ? showRatingStars : true;
    if (productRating !== '0' && showStars && !crossSite) {
      return (
        <p>
          <Rating
            rating={productRating}
            additionalClasses={css.fromMCP}
            reviewCount={reviewCount || 0}
          />
        </p>
      );
    }
    return null;
  };

  makeEventValue = () => {
    const { eventLabel, cardData: { productId, styleId, gae } } = this.props;
    if (eventLabel) {
      if (eventLabel === 'melodyGrid') {
        return gae;
      } else {
        return `product-${productId}${styleId ? `-style-${styleId}` : ''}`;
      }
    }
    return false;
  };

  makeProductBanner = (hasStyleRoomProductFlag, isCrossSiteProduct) => {
    const { testId } = this;
    const { cardData: { isCouture, isNew, isSponsored, styleId }, crossSite } = this.props;

    if (crossSite || isCrossSiteProduct) {
      return <div className={css.trustedRetailer}><TrustedRetailerBanner styleId={styleId}/></div>;
    } else if (isSponsored) {
      return <SponsoredBanner id={styleId} />;
    } else if (hasStyleRoomProductFlag && isCouture) {
      return <p className={css.styleRoomBanner} data-test-id={testId('styleRoomBanner')}>Style Room</p>;
    } else if (`${isNew}` === 'true') { // isNew not always be bool from patron TODO: is this still true given all the datasources this component pulls from?
      return <p className={css.newBanner} data-test-id={testId('newBanner')}>New</p>;
    }
    return null;
  };

  makeImageUrl = () => {
    const {
      msaImageParams, cardData: {
        imageId, thumbnailImageId, msaImageId, msaImageUrl, thumbnailImageUrl, src
      }
    } = this.props;
    const msaId = imageId || thumbnailImageId || msaImageId || null;
    if (forceHighRes) {
      const msaImg = msaId && msaImageParams ? constructMSAImageUrl(msaId, msaImageParams) : null;
      return msaImg || msaImageUrl || thumbnailImageUrl || src;
    }
    const msaImg = !msaImageUrl && msaId && msaImageParams ? constructMSAImageUrl(msaId, msaImageParams) : null;
    return msaImageUrl || msaImg || thumbnailImageUrl || src;
  };

  getSecondaryImageFromImageMap = imageMap => {
    const { PT01, PT03, TOPP, LEFT, RGHT } = imageMap || {};
    return RGHT || TOPP || LEFT || PT03 || PT01;
  };

  parentImageLoadedCallback = () => {
    this.setState({ parentImageLoaded: true });
  };

  makeProductImage = isCrossSiteProduct => {
    const {
      additionalClasses,
      animationTimerIndex,
      componentStyle,
      cardData: { alt, productName, name, styleColor, animationImages },
      shouldLazyLoad,
      hydraImagesByZycada,
      siteName,
      crossSite
    } = this.props;
    const image = this.makeImageUrl();
    const altString = alt === '' ? alt : alt || styleColor || productName || name || '';
    const imgProps = {
      src: image,
      alt: altString,
      className: additionalClasses.image
    };

    const IMAGE_PLACEHOLDER = <div className={css.imgPlaceholder}><SmallLoader/></div>;
    const forceLoad = !shouldLazyLoad && componentStyle === 'searchProduct';
    const displayCrossSiteLabel = crossSite || isCrossSiteProduct;

    // If the product has an animation, we want to cycle through the photos, timings provided by Products.jsx for syncing
    if (animationImages?.length > 0) {
      let activeIndex;

      // If the image has less animation frames than the timer count, just show the last one
      if (animationTimerIndex > animationImages.length - 1) {
        activeIndex = animationImages.length - 1;
      } else {
        activeIndex = animationTimerIndex;
      }
      const { msaId, attrs } = animationImages[activeIndex];
      const imageSource = `https://m.media-amazon.com/images/I/${msaId}._${attrs}_SX255_AC_.jpg`;
      imgProps.src = imageSource;
      imgProps.className = css.autoZoom;
      return (
        <>
          <ImageLazyLoader
            forceLoad={forceLoad}
            imgProps={imgProps}
            loadThreshold={LOAD_THRESHOLD}
            placeholder={IMAGE_PLACEHOLDER}
            imageLoadedCallback={this.parentImageLoadedCallback} />
          {displayCrossSiteLabel && <div className={css.bottom}>
            <div className={css.storeWrapper}>
              <CrossSiteLabel storeName={siteName}/>
            </div>
          </div>}
        </>
      )
      ;
    }

    return imgProps.src && <>
      <ImageLazyLoader
        hydraImagesByZycada={hydraImagesByZycada}
        forceLoad={forceLoad}
        imgProps={imgProps}
        loadThreshold={LOAD_THRESHOLD}
        placeholder={IMAGE_PLACEHOLDER}
        imageLoadedCallback={this.parentImageLoadedCallback} />
      {displayCrossSiteLabel && <div className={css.bottom}>
        <div className={css.storeWrapper}>
          <CrossSiteLabel storeName={siteName}/>
        </div>
      </div>}
    </>;
  };

  handleCollectionToggle = isShowing => {
    this.setState({ isCollectionShown: isShowing });
  };

  handleHeartClick = () => {
    const {
      heartsData = {},
      componentStyle,
      cardData: style,
      cardData: { productId }
    } = this.props;

    const heartClick = componentStyle === 'searchProduct' ? this.handleCollectionToggle : null;

    const { onHeartClick, hearts, showFavoriteHeart } = heartsData;
    return makeHandleHeartButtonClick({
      hearts,
      onHeartClick,
      onCollectionToggle: heartClick,
      productId,
      showFavoriteHeart,
      style
    });
  };

  makeFavoriteHeart = () => {
    const {
      heartsData,
      cardData: style,
      cardData: { productId },
      extraRecoStyle = null
    } = this.props;

    const { testId } = this;

    const { hearts, heartsList, showFavoriteHeart } = heartsData || {};

    const heartProps = {
      cssHeartContainer: css.heartContainer,
      cssHeartActive: css.heartActive,
      extraRecoStyle,
      handleHeartClick: this.handleHeartClick,
      hearts,
      heartsList,
      productId,
      showFavoriteHeart,
      style,
      testId: testId('heartButton')
    };

    return <Heart {...heartProps} />;
  };

  handleClick = e => {
    const { onComponentClick } = this.props;
    if (typeof onComponentClick === 'function') {
      onComponentClick(e, this.props);
    }
  };

  makeProductLabel = () => {
    const { cardData: { price, styleColor, productRating, reviewCount } } = this.props;
    const productName = this.makeProductNameText();
    const brandName = this.makeBrandNameText();

    let label = '';
    if (productName) {
      label = `${productName}. `;
    }
    if (brandName) {
      label += `By ${brandName}. `;
    }
    if (price) {
      label += `${price}. `;
    }
    if (styleColor) {
      label += `Style: ${styleColor}. `;
    }
    if (reviewCount && typeof productRating === 'number') {
      label += `Rated ${productRating} out of 5 stars. `;
    }
    return label;
  };

  createSponsoredRef = () => {
    const { isSponsored, styleId } = this.props;
    if (isSponsored) {
      return { 'aria-describedby': `sponsoredBanner-${styleId}` };
    }
    return null;
  };

  crossSiteClick = e => {
    const { siteName, content } = this.props;
    const crossSiteModal = content?.Global?.slotData?.[`${siteName}XsModal`] || {};
    const hasCrossSiteData = Object.keys(crossSiteModal).length;
    if (hasCrossSiteData) {
      e.preventDefault();
      this.setState({ crossSiteModalVisible: true });
    }
  };

  closeCrossSiteModal = () => this.setState({ crossSiteModalVisible: false });

  handleCrossSiteModal = e => {
    const element = e.target;
    if (VALID_CROSS_SITE_TAGS.has(element.tagName)) {
      const isLink = element.tagName === 'A';
      if (isLink) {
        const crossSiteQueryParams = queryString.stringify({
          'utm_medium': 'p2p',
          'utm_campaign': `${domain}_redirect`,
          'utm_referrer': encodeURIComponent(window.location.href),
          [crossSiteQsParam]: crossSiteSellingUniqueIdentifier
        });
        const queryExists = element.search.charAt(0) === '?';
        element.href += `${queryExists ? '&' : '?'}${crossSiteQueryParams}`;
        element.target = '_blank';
      }

      this.closeCrossSiteModal();
    }
  };

  makeCrossSiteProductImage = () => {
    const PRODUCT_IMAGE_SIZE = 450;
    const MSA_IMAGE_DIMENSION = { width: PRODUCT_IMAGE_SIZE, height: PRODUCT_IMAGE_SIZE };
    const classes = { itemsContainer: crossSiteProductsCss.itemsContainer, fullHeight: crossSiteProductsCss.fullHeight };
    const arrowStyleOverrides = { top: '50%' };
    const images = Object.entries(this.props.cardData.imageMap)
      .filter(([key]) => !XSLL_EXCLUDED_PRODUCT_IMAGES.includes(key))
      .sort(([key]) => (key === 'MAIN' ? -1 : 0))
      .map(([key, imageId]) => <div key={imageId} className={crossSiteProductsCss.imageContainer}>
        <img src={constructMSAImageUrl(imageId, MSA_IMAGE_DIMENSION)} alt={key} />
      </div>);

    return <MelodyCarousel classes={classes} arrowStyleOverrides={arrowStyleOverrides}>
      {images}
    </MelodyCarousel>;
  };

  makeCrossSiteModalContent = isCrossSiteProduct => {
    const { testId } = this;
    const { siteName, content, cardData: { productSeoUrl, productUrl } } = this.props;
    const crossSiteModal = content?.Global?.slotData?.[`${siteName}XsModal`] || {};
    const { cancelCta, copy, cta, heading, subheading } = crossSiteModal;
    const hasCrossSiteData = Object.keys(crossSiteModal).length;

    if (isCrossSiteProduct && hasCrossSiteData) {
      return (
        <>
          <section className={crossSiteProductsCss.modalCarousel}>{this.makeCrossSiteProductImage()}</section>
          {/* eslint-disable-next-line */}
          <section className={cn(crossSiteProductsCss.modalContent, crossSiteProductsCss.pointer)} onClick={this.handleCrossSiteModal}>
            <h2 dangerouslySetInnerHTML={{ __html: heading }}/>
            <p dangerouslySetInnerHTML={{ __html: subheading }}/>
            <p dangerouslySetInnerHTML={{ __html: copy }}/>
            <div className={crossSiteProductsCss.modalBtnContainer}>
              <a
                data-test-id={testId('searchResultsCrossSiteModalContinue')}
                className={crossSiteProductsCss.btnContinue}
                href={productSeoUrl || productUrl}
                target="_blank"
                rel="noopener noreferrer">
                {cta}
              </a>
              <button
                data-test-id={testId('searchResultsCrossSiteModalStay')}
                type="button"
                className={crossSiteProductsCss.btnStay}>
                {cancelCta}
              </button>
            </div>
          </section>
        </>
      );
    }

    return null;
  };

  render() {
    const { isProductFocused, isProductHovered, isCollectionShown, crossSiteModalVisible } = this.state;
    const {
      eventLabel, componentStyle, additionalClasses, vertical,
      noBackground, linkElOverride, melodyCardTestId, hideBanner, crossSite, isCrossSiteSearch, siteName,
      cardData: { imageMap, productSeoUrl, productUrl, productUrlRelative, link, styleId, productId, colorId, price },
      heartsData = {}, hydraImagesByZycada, bottomOfImageRenderer: BottomOfImage, belowImageRenderer: BelowImage, intersectionRef
    } = this.props;
    // Only add event attributes if we need them
    const { showFavoriteHeart = false } = heartsData || {};
    const dataAttributes = {};
    if (eventLabel) {
      dataAttributes['data-eventlabel'] = eventLabel;
      dataAttributes['data-eventvalue'] = this.makeEventValue();
    }

    // Reassign Link element if necessary
    const LinkComponent = linkElOverride || Link;
    const moreThanOneImageInMap = !!this.getSecondaryImageFromImageMap(imageMap);
    const isCrossSiteProduct = hasCrossSiteSearches && isCrossSiteSearch && siteName;
    const url = (isCrossSiteProduct && productUrl) || productSeoUrl || productUrlRelative || link;

    const modalProps = {
      onRequestClose: () => this.closeCrossSiteModal(),
      className: crossSiteProductsCss.modal,
      contentLabel: 'Trusted Retailers',
      isOpen: !!crossSiteModalVisible
    };

    return (
      <MartyContext.Consumer>
        {({ marketplace : { msaImagesUrlZycada, msaImagesUrl }, testId }) => {
          this.testId = testId;
          const originalUrl = this.makeImageUrl();
          const metaUrl = hydraImagesByZycada && msaImagesUrlZycada ? originalUrl.replace(msaImagesUrl, msaImagesUrlZycada) : originalUrl;
          const clickHandler = isCrossSiteProduct ? this.crossSiteClick : this.handleClick;
          return (
            <article
              className={cn(
                commonCardCss.mCard,
                css.productCardShared,
                additionalClasses.container,
                getComponentStyling(componentStyle, showFavoriteHeart, crossSite),
                {
                  [css.vertical]: vertical,
                  [css.productIsFocused]: isProductFocused
                }
              )}
              itemScope
              itemType="http://schema.org/Product"
              data-test-id={testId(melodyCardTestId)}
              ref={intersectionRef}
            >
              {crossSiteModalVisible && <MelodyModal {...modalProps}>{this.makeCrossSiteModalContent(isCrossSiteProduct)}</MelodyModal>}
              <LinkComponent
                to={url}
                onClick={clickHandler}
                aria-label={this.makeProductLabel()}
                // For helping site merch collect styleIds https://github01.zappos.net/mweb/marty/pull/9699
                data-style-id={styleId}
                data-test-id={testId(`${melodyCardTestId}Link`)}
                itemProp="url"
                onMouseOver={() => this.setState({ hasProductBeenHovered: true, isProductHovered: true })}
                onMouseOut={() => this.setState({ isProductHovered: false })}
                onBlur={() => this.setState({ isProductFocused: false })}
                onFocus={() => this.setState({ isProductFocused: true, hasProductBeenHovered: true })}
                className={css.link}
                {...dataAttributes}
                {...this.createSponsoredRef()}>
                <meta itemProp="image" content={metaUrl} />
                <div className={cn(
                  commonCardCss.image,
                  {
                    [commonCardCss.imageNoBackground]: noBackground,
                    [css.hoverContainer]: moreThanOneImageInMap
                  },
                  css.productImage)}>
                  {!hideBanner && this.makeProductBanner(hasStyleRoomProductFlag, isCrossSiteProduct)}
                  {this.makeProductImage(isCrossSiteProduct)}
                </div>
              </LinkComponent>
              {BottomOfImage &&
                <div className={css.bottomOfImage}>
                  <BottomOfImage
                    onClick={clickHandler}
                    isProductFocused={isProductFocused}
                    isProductHovered={isProductHovered}
                    cardData={this.props.cardData} />
                </div>
              }
              <div className={cn(css.productContent, additionalClasses.textContainer)}>
                <MakeSocialCollectionWidget
                  styleId={styleId}
                  isCollectionShown={isCollectionShown}
                  productId={productId}
                  colorId={colorId}
                  price={price}
                />
                {BelowImage ?
                  <BelowImage
                    onClick={clickHandler}
                    isProductFocused={isProductFocused}
                    isProductHovered={isProductHovered}
                    cardData={this.props.cardData}
                    options={this.props.belowImageOptions}/>
                  : this.makeFavoriteHeart()}
                {this.makeBrandName()}
                {this.makeProductName()}
                {this.makeColorName()}
                {this.makePrice()}
                {this.makeProductRating()}
              </div>
            </article>
          );
        }}
      </MartyContext.Consumer>
    );
  }
}

MelodyCardProduct.propTypes = {
  cardData: PropTypes.object.isRequired,
  eventLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  onComponentClick: PropTypes.func,
  additionalClasses: PropTypes.shape({
    container: PropTypes.string,
    image: PropTypes.string,
    textContainer: PropTypes.string,
    priceContainer: PropTypes.string
  }),
  bottomOfImageRenderer: PropTypes.func
};

MelodyCardProduct.defaultProps = {
  additionalClasses: {},
  componentStyle: defaultComponentStyle,
  eventLabel: false,
  noBackground: defaultNoBackground
};

const mapStateToProps = state => ({
  content: state?.headerFooter?.content || null,
  hydraImagesByZycada : isAssigned(HYDRA_IMAGES_BY_ZYCADA, 1, state)
});

export default connect(mapStateToProps)(withErrorBoundary('MelodyCardProduct', MelodyCardProduct));
