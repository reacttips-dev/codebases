import { useCallback, useEffect } from 'react';
import cn from 'classnames';

import MelodyCardProduct from 'components/common/melodyCard/MelodyCardProduct';
import LandingPageImage from 'components/landing/LandingPageImage';
import LandingPageLink from 'components/landing/LandingPageLink';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import {
  setInlineBackgroundColor,
  setInlineTextColor
} from 'helpers/LandingPageUtils';
import { evHeroWithProductStreamClick, evHeroWithProductStreamImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import css from 'styles/components/landing/melodyGrid.scss';

export const MelodyGrid = ({ slotName, slotIndex, slotDetails, onComponentClick, shouldLazyLoad, slotHeartsData, isHalf, eventLabel }) => {
  const { products, title, link, ctacopy, copy, subtext, bgcolor, gae, textcolor, image, alt, flip, monetateId, isCrossSiteSearch, siteName } = slotDetails;
  const heroCount = image ? 1 : 0;

  useEffect(() => {
    track(() => ([evHeroWithProductStreamImpression, { slotDetails, slotIndex, slotName, heroCount }]));
  }, [heroCount, slotDetails, slotIndex, slotName]);

  const onHeroClick = useCallback(evt => {
    onComponentClick && onComponentClick(evt);
    track(() => ([evHeroWithProductStreamClick, { slotDetails, slotIndex, slotName, heroCount }]));
  }, [heroCount, onComponentClick, slotDetails, slotIndex, slotName]);

  const onProductClick = useCallback((evt, product) => {
    onComponentClick && onComponentClick(evt);
    track(() => ([evHeroWithProductStreamClick, { slotDetails, slotIndex, slotName, product, heroCount }]));
  }, [heroCount, onComponentClick, slotDetails, slotIndex, slotName]);

  const makeTitle = () => title && <h2 className={css.heading} style={setInlineTextColor(textcolor)}>{title}</h2>;

  const makeCopy = () => copy && <p style={setInlineTextColor(textcolor)}>{copy}</p>;

  const makeSubText = () => subtext && <p className={css.subtext}>{subtext}</p>;

  const makeCallToAction = () => ctacopy && <p className={css.cta}>{ctacopy}</p>;

  const makeMainImage = () => image &&
    <LandingPageImage
      src={image}
      alt={alt}
      shouldLazyLoad={shouldLazyLoad}
      className={css.lazyImg}
    />;

  const makeMainContent = () => {
    const styling = (textcolor === 'white') ? css.mainContentCtaWhite : css.mainContentCtaDefault;
    const contents = (
      <div className={cn(css.mainContent, styling)} style={setInlineBackgroundColor(bgcolor)}>
        {makeTitle()}
        {makeCopy()}
        {makeSubText()}
        {makeCallToAction()}
        {makeMainImage()}
      </div>
    );
    const linkProps = {
      'onClick': onHeroClick,
      'data-eventlabel': eventLabel,
      'data-eventvalue': gae || title,
      'data-slotindex': slotIndex
    };
    return link
      ?
      <LandingPageLink url={link} {...linkProps}>
        {contents}
      </LandingPageLink>
      :
      contents;
  };

  return (
    <div className={cn(css.mProductGrid, { [css.flipped]: flip === 'true' }, { [css.isHalf]: isHalf })} data-slot-id={slotName} data-monetate-id={monetateId}>
      <div className={css.mainContentContainer}>
        {makeMainContent()}
      </div>
      <div className={css.items}>
        {products.map((product, i) => {
          const { styleId, msaImageUrl, thumbnailImageUrl, src } = product;
          return <MelodyCardProduct
            key={`${styleId || msaImageUrl || thumbnailImageUrl || src}`}
            cardData={product}
            componentStyle="melodyGrid"
            eventLabel={eventLabel}
            melodyCardTestId="trendingProduct"
            onComponentClick={onProductClick}
            heartsData={slotHeartsData}
            index={i}
            isCrossSiteSearch={isCrossSiteSearch}
            siteName={siteName}/>;
        })}
      </div>
    </div>
  );
};

export default withErrorBoundary('MelodyGrid', MelodyGrid);
