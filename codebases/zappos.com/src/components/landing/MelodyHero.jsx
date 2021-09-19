import { useCallback, useEffect } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import {
  setInlineBackgroundColor,
  setInlineTextColor
} from 'helpers/LandingPageUtils';
import LandingPageLink from 'components/landing/LandingPageLink';
import LandingPageImage from 'components/landing/LandingPageImage';
import MelodyVideoPlayer from 'components/common/melodyVideo/MelodyVideoPlayer';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { evHeroClick, evHeroImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import css from 'styles/components/landing/melodyHero.scss';

export const MelodyHero = ({ slotName, slotIndex, slotDetails, onComponentClick, shouldLazyLoad }, { testId }) => {
  const {
    heading,
    src,
    mobilesrc,
    retina,
    link,
    alt,
    gae,
    copy,
    subtext,
    cta,
    flip,
    bgcolor,
    textcolor,
    brandsrc,
    brandretina,
    brandalt,
    videoSrc,
    poster,
    isEmbedded,
    autoplay,
    monetateId,
    loop,
    mobileVideoSrc,
    tabletVideoSrc
  } = slotDetails;

  useEffect(() => {
    track(() => ([evHeroImpression, { slotDetails, slotIndex, slotName, heroCount: 1 }]));
  }, [slotDetails, slotIndex, slotName]);

  const onClick = useCallback(evt => {
    onComponentClick && onComponentClick(evt);
    track(() => ([evHeroClick, { slotDetails, slotIndex, slotName, heroCount: 1 }]));
  }, [onComponentClick, slotDetails, slotIndex, slotName]);

  const makeVideo = () => {
    const slotDetails = { src: videoSrc, alt, poster, isEmbedded, autoplay, loop, mobileVideoSrc, tabletVideoSrc };
    return videoSrc && <MelodyVideoPlayer slotDetails={slotDetails} slotIndex={slotIndex} slotName={slotName} />;
  };

  const makeBrandImg = () => brandsrc &&
    <LandingPageImage
      src={brandsrc}
      retina={brandretina}
      alt={brandalt}
      shouldLazyLoad={shouldLazyLoad}
      className={css.lazyBrnd}
    />;

  const makeCtaBtn = () => (cta ? <p className={css.cta}>{cta}</p> : null);

  const styling = (textcolor === 'white') ? css.contentWrapCtaWhite : css.contentWrapCtaDefault;
  const contentStyle = setInlineBackgroundColor(bgcolor);

  const flipped = flip?.toLowerCase() === 'true';

  const linkProps = {
    'className': cn(css.wrap, 'heroComponent', styling, { [css.isFlipped]: flipped }),
    'style': contentStyle,
    'onClick': onClick,
    'data-eventlabel': 'melodyHero',
    'data-slotindex': slotIndex,
    'data-eventvalue': gae,
    'data-monetate-id': monetateId
  };

  const videoProps = {
    ...linkProps,
    'className': cn(css.contents, styling),
    'data-test-id': testId('melodyHero')
  };

  const getContent = () => {
    const content = (
      <>
        {heading && <h2 style={setInlineTextColor(textcolor)}>{heading}</h2>}
        {makeBrandImg()}
        {copy && <p style={setInlineTextColor(textcolor)} className={css.copy}>{copy}</p>}
        {subtext && <p className={css.subtext}>{subtext}</p>}
        {makeCtaBtn()}
      </>
    );

    return videoSrc && link
      ?
      <LandingPageLink url={link} {...videoProps}>
        {content}
      </LandingPageLink>
      : <div
        className={css.contents}
        style={contentStyle}
        data-test-id={testId('melodyHero')}
        data-slot-id={slotName}
      >
        {content}
      </div>;
  };
  const media = (
    <div className={css.imageContainer}>
      {makeVideo() ||
        <LandingPageImage
          src={src}
          mobilesrc={mobilesrc}
          retina={retina}
          alt={alt}
          shouldLazyLoad={shouldLazyLoad}
          className={css.lazyImg}
        />
      }
    </div>
  );

  const component = (
    <>
      {getContent()}
      {media}
    </>
  );

  return !videoSrc && link
    ?
    <LandingPageLink url={link} {...linkProps}>
      {component}
    </LandingPageLink>
    : <div
      className={cn(
        css.wrap, styling,
        { [css.videoWrap]: videoSrc },
        { [css.isFlipped]: flipped },
        'heroComponent'
      )}
      data-slot-id={slotName}
      data-monetate-id={monetateId}>
      {component}
    </div>;
};

MelodyHero.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('MelodyHero', MelodyHero);
