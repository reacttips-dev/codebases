import { useCallback, useEffect } from 'react';

import LandingPageImage from 'components/landing/LandingPageImage';
import LandingPageLink from 'components/landing/LandingPageLink';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import {
  setInlineBackgroundColor,
  setInlineTextColor
} from 'helpers/LandingPageUtils';
import { evHeroClick, evHeroImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import css from 'styles/components/landing/melodyEditorialPromo.scss';

export const MelodyEditorialPromo = ({ slotName, slotIndex, slotDetails, onComponentClick, shouldLazyLoad }) => {
  const { heading, link, brandsrc, brandretina, brandalt, gae, copy, subtext, calltoaction, bgcolor, promos, textcolor, monetateId } = slotDetails;
  const promosLength = promos?.length;

  useEffect(() => {
    track(() => ([evHeroImpression, { slotDetails, slotIndex, slotName, heroCount: promosLength }]));
  }, [promosLength, slotDetails, slotIndex, slotName]);

  const onClick = useCallback(evt => {
    onComponentClick && onComponentClick(evt);
    track(() => ([evHeroClick, { slotDetails, slotIndex, slotName, heroCount: promosLength }]));
  }, [onComponentClick, promosLength, slotDetails, slotIndex, slotName]);

  const makePromoImg = promo => {
    if (promo) {
      const { src, retina, alt } = promo;
      const imageProps = { src, retina, alt, shouldLazyLoad, className: css.lazyPromo };
      return <LandingPageImage {...imageProps} />;
    }
  };

  const makeHeadingText = () => heading && <h2 style={setInlineTextColor(textcolor)} className={css.headingText}>{heading}</h2>;

  const makeBrandImg = () => (brandsrc &&
    <LandingPageImage
      src={brandsrc}
      retina={brandretina}
      alt={brandalt}
      shouldLazyLoad={shouldLazyLoad}
    />
  );

  const makeCopy = () => copy && <p style={setInlineTextColor(textcolor)} className={css.copy}>{copy}</p>;

  const makeSubText = () => subtext && <p className={css.subtext}>{subtext}</p>;

  const makeCtaButton = () => calltoaction && <button type="button">{calltoaction}</button>;

  const linkProps = {
    'className': css.wrap,
    'onClick': onClick,
    'data-eventlabel': 'melodyEditorialPromo',
    'data-slot-id': slotName,
    'data-eventvalue': gae,
    'data-monetate-id': monetateId,
    'data-slotindex': slotIndex
  };

  const styling = (textcolor === 'white') ? css.contentWrapCtaWhite : css.contentWrapCtaDefault;
  const contents = (
    <div className={styling} data-monetate-id={!link && monetateId ? monetateId : null}>
      <div className={css.promos}>
        {promos && promos.length && makePromoImg(promos[0])}
        {promos && promos.length && makePromoImg(promos[1])}
      </div>
      <div style={setInlineBackgroundColor(bgcolor)} className={css.mainContent}>
        {makeHeadingText()}
        {makeBrandImg()}
        {makeCopy()}
        {makeSubText()}
        {makeCtaButton()}
      </div>
    </div>
  );

  return (
    <LandingPageLink url={link} fallbackNode="div" {...linkProps}>
      {contents}
    </LandingPageLink>
  );
};

export default withErrorBoundary('MelodyEditorialPromo', MelodyEditorialPromo);
