import { useCallback, useEffect } from 'react';
import { Link } from 'react-router';
import cn from 'classnames';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { setInlineBackgroundColor, setInlineTextColor } from 'helpers/LandingPageUtils';
import MelodyCardProduct from 'components/common/melodyCard/MelodyCardProduct';
import { stripSpecialChars } from 'helpers';
import { evHeroWithProductStreamClick, evHeroWithProductStreamImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import css from 'styles/components/landing/melodyCurated.scss';

export const MelodyCurated = ({ slotName, slotIndex, slotDetails, onComponentClick, slotHeartsData, eventLabel }) => {
  const { products, title, link, ctacopy, copy, bgcolor, gae, textcolor, flip, monetateId, isCrossSiteSearch, siteName } = slotDetails;

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

  const makeTitle = () => title && <h2 style={setInlineTextColor(textcolor)}>{title}</h2>;

  const makeCopy = () => copy && <p style={setInlineTextColor(textcolor)}>{copy}</p>;

  const makeCallToAction = () => ctacopy && <p className={css.cta}>{ctacopy}</p>;

  const makeMainContent = () => {
    const styling = (textcolor === 'white') ? css.mainContentCtaWhite : css.mainContentCtaDefault;
    return (
      <div className={cn(css.mainContentContainer, styling)} style={setInlineBackgroundColor(bgcolor)}>
        <Link
          to={link}
          onClick={onHeroClick}
          data-eventlabel={eventLabel}
          data-slotindex={slotIndex}
          data-eventvalue={ gae || title }>
          {makeTitle()}
          {makeCopy()}
          {makeCallToAction()}
        </Link>
      </div>
    );
  };

  return (
    <div className={cn(css.mCurated, { [css.flipped]: flip === 'true' })} data-slot-id={slotName} data-monetate-id={monetateId}>
      {makeMainContent()}
      {products.map((product, i) => {
        const { msaImageUrl, thumbnailImageUrl, src } = product;
        return <MelodyCardProduct
          key={`${stripSpecialChars(msaImageUrl || thumbnailImageUrl || src)}_${i}`}
          cardData={product}
          componentStyle="melodyCurated"
          eventLabel={eventLabel}
          onComponentClick={onProductClick}
          heartsData={slotHeartsData}
          index={i}
          isCrossSiteSearch={isCrossSiteSearch}
          siteName={siteName}/>;
      })}
    </div>
  );
};

export default withErrorBoundary('MelodyCurated', MelodyCurated);
