import React, { useState } from 'react';
import { connect } from 'react-redux';

import useMartyContext from 'hooks/useMartyContext';
import Link from 'components/hf/HFLink'; // Need to use dynamic link as MSFT products link externally
import { fetchProductDetail } from 'actions/productDetail';
import { makeAscii } from 'helpers';
import TrustedRetailerBanner from 'components/common/TrustedRetailerBanner';
import MelodyModal from 'components/common/MelodyModal';
import Card from 'components/common/card/Card';
import CardMedia from 'components/common/card/CardMedia';
import CardPrice from 'components/common/card/CardPrice';
import Rating from 'components/Rating';
import SponsoredBanner from 'components/common/SponsoredBanner';
import getCardData from 'data/getCardData';
import useHover from 'hooks/useHover';
import useCrossSite from 'hooks/useCrossSite';
import Hearts from 'components/common/Hearts';
import CrossSiteLabel from 'components/common/melodyCard/CrossSiteLabel';
import LowStockLabel from 'components/common/melodyCard/LowStockLabel';
import { SEARCH_IMGS_NOT_LAZY_LOADED } from 'constants/appConstants';
import { getCardFlag } from 'helpers/cardUtils';

import css from 'styles/components/common/productCard.scss';
import { modal } from 'styles/components/search/crossSiteProducts.scss';

const ProductCard = props => {
  const {
    index,
    linkProps,
    className,
    brandName,
    intersectionRef,
    isSponsored,
    onClick,
    productName,
    productSeoUrl,
    productUrl,
    styleColor,
    storeName,
    styleId,
    CardDetailsTopSlot,
    CardBottomSlot,
    isLowStock,
    adsRecosCard
  } = props;

  const { testId, marketplace: { search: { showRatingStars, hasStyleRoomFlag, showLowStockLabel } } } = useMartyContext();
  const [ref, setRef] = useState(null);

  const { isHovered } = useHover(ref);
  const { onClick: crossSiteClick, closeClick, content, visible } = useCrossSite(props);
  const { hearts, media, price, reviews } = getCardData({ ...props, isHovered });

  const productLink = productSeoUrl || productUrl || null;
  const encodedBrandName = makeAscii(brandName);
  const encodedProductName = makeAscii(productName);

  const clickHandler = crossSiteClick || onClick;

  const flags = {
    'sponsored': <SponsoredBanner newCard={true} index={index}/>,
    'style room': <p className={css.styleRoom} data-test-id={testId('styleRoomBanner')}>Style Room</p>,
    'trusted retailer': <div className={css.isTrusted}><TrustedRetailerBanner styleId={styleId}/></div>,
    'new': <p className={css.new} data-test-id={testId('newBanner')}>New</p>
  };

  const flagType = getCardFlag({ ...props, hasStyleRoomFlag });
  const flag = flags[flagType] || null;
  const displayLowStockLabel = !!showLowStockLabel && isLowStock;
  const productLabel = `${isSponsored ? 'Sponsored Result. ' : ''}${encodedBrandName} - ${encodedProductName}. Color ${styleColor}.${displayLowStockLabel ? ' Low Stock.' : ''}`;

  const modalProps = {
    onRequestClose: () => closeClick(),
    className: modal,
    contentLabel: 'Trusted Retailers',
    isOpen: !!visible
  };

  const makeStars = () => {
    if (!showRatingStars) {
      return null;
    }

    return (
      <>
        <dt>Rating</dt>
        <dd>
          <Rating
            rating={reviews.roundedRating}
            reviewCount={reviews.ratingCount}
            hasDisplayReviewCount={true}/>
        </dd>
      </>
    );
  };

  return (
    <Card
      className={className}
      // For helping site merch collect styleIds https://github01.zappos.net/mweb/marty/pull/9699
      data-style-id={styleId}
      data-test-id={props['data-test-id']}
      data-adsrecos-card={adsRecosCard}
      data-low-stock={displayLowStockLabel}
      itemScope
      itemType="http://schema.org/Product"
      ref={intersectionRef}
    >
      {visible && <MelodyModal {...modalProps}>{content}</MelodyModal>}
      <Link
        className={css.productLink}
        data-style-id={styleId}
        to={productLink}
        itemProp="url"
        data-test-id={testId('searchResultLink')}
        onClick={clickHandler}
        innerRef={setRef}
        {...linkProps}>
        {productLabel} {price.label}. {reviews.label}
      </Link>
      <CardMedia forceLoadIndex={SEARCH_IMGS_NOT_LAZY_LOADED} {...media}>
        <div className={css.top}>
          {flag}
          <Hearts {...hearts} />
        </div>
        <div className={css.bottom}>
          {storeName && <div className={css.storeWrapper}><CrossSiteLabel storeName={storeName}/></div>}
          {displayLowStockLabel && <LowStockLabel />}
        </div>
      </CardMedia>
      <div className={css.details}>
        {!!CardDetailsTopSlot && <CardDetailsTopSlot {...props} />}
        <dl>
          <dt>Brand Name</dt>
          <dd
            className={css.mainText}
            itemProp="brand"
            itemScope
            itemType="http://schema.org/Brand"
            data-test-id={testId('brand')}>
            {encodedBrandName}
          </dd>
          <dt>Product Name</dt>
          <dd className={css.subText} itemProp="name" data-test-id={testId('productName')}>{encodedProductName}</dd>
          <dt>Color</dt>
          <dd className={css.colorName} itemProp="color" data-test-id={testId('colorName')}>{styleColor}</dd>
          <CardPrice {...price} />
          {makeStars()}
        </dl>
        {!!CardBottomSlot && <CardBottomSlot {...props} onClick={clickHandler}/>}
      </div>
    </Card>
  );
};

const mapDispatchToProps = {
  fetchProductDetail
};

const mapStateToProps = state => {
  const { headerFooter: { content }, filters: { term } } = state;
  return {
    term,
    content
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
