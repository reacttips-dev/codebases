import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import MelodyCardProduct from 'components/common/melodyCard/MelodyCardProduct';
import LandingPageImage from 'components/landing/LandingPageImage';
import LandingPageLink from 'components/landing/LandingPageLink';
import { evHeroWithProductStreamClick, evHeroWithProductStreamImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import css from 'styles/components/landing/productImageInline.scss';

const additionalCardClasses = { container: css.card };

export const ProductImageInline = ({ slotName, slotIndex, slotDetails, onComponentClick, slotHeartsData, shouldLazyLoad, eventLabel }) => {
  const {
    products = [], title, link, ctacopy, copy, gae, flip, monetateId,
    image, retina, alt, mobilesrc, mobileretina, tabletsrc, tabletretina, isCrossSiteSearch, siteName
  } = slotDetails;

  useEffect(() => {
    track(() => ([evHeroWithProductStreamImpression, { slotDetails, slotIndex, slotName }]));
  }, [slotDetails, slotIndex, slotName]);

  const onHeroClick = useCallback(evt => {
    onComponentClick && onComponentClick(evt);
    track(() => ([evHeroWithProductStreamClick, { slotDetails, slotIndex, slotName }]));
  }, [onComponentClick, slotDetails, slotIndex, slotName]);

  const onProductClick = useCallback((evt, product) => {
    onComponentClick && onComponentClick(evt);
    track(() => ([evHeroWithProductStreamClick, { slotDetails, slotIndex, slotName, product }]));
  }, [onComponentClick, slotDetails, slotIndex, slotName]);

  return (
    <div
      data-slot-id={slotName}
      data-slotindex={slotIndex}
      data-monetate-id={monetateId}
      className={cn(css.container, { [css.flipped]: flip?.toString() === 'true' })}>
      <LandingPageLink
        className={css.creativeContainer}
        url={link}
        onClick={onHeroClick}
        data-eventlabel={eventLabel}
        data-slotindex={slotIndex}
        fallbackNode="div"
        data-eventvalue={gae || title || alt}>
        <LandingPageImage
          src={image}
          retina={retina}
          mobilesrc={mobilesrc}
          mobileretina={mobileretina}
          tabletsrc={tabletsrc}
          tabletretina={tabletretina}
          alt={alt}
          shouldLazyLoad={shouldLazyLoad}
        />
        {!!title && <h2>{title}</h2>}
        {!!copy && <p className={css.copy}>{copy}</p>}
        {!!ctacopy && <p className={css.cta}>{ctacopy}</p>}
      </LandingPageLink>
      {products.slice(0, 7).map((product, i) =>
        <MelodyCardProduct
          additionalClasses={additionalCardClasses}
          key={product.msaImageId + product.styleId}
          cardData={product}
          componentStyle="searchProduct"
          eventLabel={eventLabel}
          onComponentClick={onProductClick}
          heartsData={slotHeartsData}
          index={i}
          isCrossSiteSearch={isCrossSiteSearch}
          siteName={siteName}/>
      )}
    </div>
  );
};

ProductImageInline.propTypes = {
  slotName: PropTypes.string,
  slotIndex: PropTypes.number,
  slotDetails: PropTypes.shape({
    products: PropTypes.array,
    title: PropTypes.string,
    link: PropTypes.string,
    ctacopy: PropTypes.string,
    copy: PropTypes.string,
    gae: PropTypes.string,
    flip: PropTypes.string,
    image: PropTypes.string,
    retina: PropTypes.string,
    mobilesrc: PropTypes.string,
    mobileretina: PropTypes.string,
    tabletsrc: PropTypes.string,
    tabletretina: PropTypes.string,
    alt: PropTypes.string,
    isCrossSiteSearch: PropTypes.bool,
    siteName: PropTypes.string
  }),
  onComponentClick: PropTypes.func,
  slotHeartsData: PropTypes.object,
  shouldLazyLoad: PropTypes.bool,
  eventLabel: PropTypes.string
};

export default withErrorBoundary('ProductImageInline', ProductImageInline);
