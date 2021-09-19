import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { setInlineTextColor } from 'helpers/LandingPageUtils';
import LandingPageLink from 'components/landing/LandingPageLink';
import LandingPageImage from 'components/landing/LandingPageImage';
import MelodyVideoPlayer from 'components/common/melodyVideo/MelodyVideoPlayer';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { evHeroClick, evHeroImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import css from 'styles/components/landing/melodyHeroFull.scss';

export const MelodyHeroFull = ({ slotName, slotIndex, slotDetails, onComponentClick, shouldLazyLoad }, { testId, marketplace: { landing: { dontWrapSingleCTAHero } } }) => {
  const {
    heading,
    src,
    mobilesrc,
    tabletsrc,
    retina,
    mobileretina,
    tabletretina,
    link,
    link2,
    alt,
    gae,
    copy,
    subtext,
    cta,
    cta2,
    bgcolor,
    textcolor,
    brandsrc,
    brandretina,
    brandalt,
    xaxis,
    yaxis,
    contentwidth,
    transparent,
    alwaysoverlay,
    newwindow,
    monetateId,
    videoSrc,
    poster,
    isEmbedded,
    autoplay,
    loop,
    mobileVideoSrc,
    tabletVideoSrc
  } = slotDetails;

  useEffect(() => {
    track(() => ([evHeroImpression, { slotDetails, slotIndex, slotName, heroCount: 1 }]));
  }, [slotDetails, slotIndex, slotName]);

  const onClick = useCallback(evt => {
    onComponentClick && onComponentClick(evt);
    track(() => ([evHeroClick, { slotDetails, slotIndex, slotName, heroCount: 1, linkText: evt.target.innerText }]));
  }, [onComponentClick, slotDetails, slotIndex, slotName]);

  const makeHeading = () => heading && <h2 className={css.heroHeading} style={setInlineTextColor(textcolor)}>{heading}</h2>;

  const makeBrandImg = () => brandsrc &&
    <LandingPageImage
      src={brandsrc}
      retina={brandretina}
      alt={brandalt}
      shouldLazyLoad={shouldLazyLoad}
    />
  ;

  const makeCopy = () => copy && <p style={setInlineTextColor(textcolor)}>{copy}</p>;

  const makeSubText = () => subtext && <p className={css.subtext}>{subtext}</p>;

  const makeVideo = () => {
    const slotDetails = { src: videoSrc, poster, isEmbedded, autoplay, loop, mobileVideoSrc, tabletVideoSrc };
    return videoSrc && <MelodyVideoPlayer slotDetails={slotDetails} />;
  };

  const linkProps = {
    'className': cn(css.containerLink, 'heroComponent'),
    'onClick': onClick,
    'data-eventlabel': 'melodyHeroFull',
    'data-eventvalue': gae,
    'data-slotindex': slotIndex
  };

  const wrapperProps = {
    'data-slot-id': slotName,
    'data-monetate-id': monetateId
  };

  const makeCtaBtn = () => {
    const buttonProps = { 'data-eventvalue': `${gae}-${cta}` };
    return (cta && ((cta2 && link2) ? (
      <div style={setInlineTextColor(textcolor)} {...linkProps}>
        <LandingPageLink url={link} {...buttonProps}>
          {cta}
        </LandingPageLink>
      </div>
    ) : videoSrc && dontWrapSingleCTAHero ? ( // Single CTA with video on VRSNL should still render a link button since it wont be wrapped
      <div style={setInlineTextColor(textcolor)} {...linkProps}>
        <LandingPageLink url={link} {...buttonProps}>
          {cta}
        </LandingPageLink>
      </div>
    ) : (
      <div style={setInlineTextColor(textcolor)} className={css.appearAsButton} data-test-id={testId('melodyHeroFullCtaBtn')}>
        {cta}
      </div>
    )));
  };

  const makeCta2Btn = () => {
    const buttonProps = { 'data-eventvalue': `${gae}-${cta2}` };
    return (cta2 && link2 && (
      <div style={setInlineTextColor(textcolor)} {...linkProps}>
        <LandingPageLink url={link2} {...buttonProps}>
          {cta2}
        </LandingPageLink>
      </div>
    ));
  };

  const makeContents = () => {
    const inlinecss = {
      background: bgcolor,
      width: contentwidth
    };
    const xPositionMap = {
      left: css.left,
      center: css.centerX,
      right: css.right
    };
    const yPositionMap = {
      top: css.top,
      center: css.centerY,
      bottom: css.bottom
    };

    return (heading || brandsrc || copy || cta) && (
      <div
        style={inlinecss}
        className={
          cn(css.heroContent,
            { [css.alwaysoverlay]: alwaysoverlay === 'true' },
            { [css.transparent]: transparent === 'true' },
            { [xPositionMap[xaxis] || '']: xaxis },
            { [yPositionMap[yaxis] || '']: yaxis }
          )}
      >
        {makeHeading()}
        {makeBrandImg()}
        {makeCopy()}
        {makeSubText()}
        <span className={css.buttonWrapper}>
          {makeCtaBtn()}
          {makeCta2Btn()}
        </span>
      </div>
    );
  };

  if (newwindow) {
    linkProps.target = '_blank';
    linkProps.rel = 'noopener noreferrer';
  }
  // If there are 2 CTAs, we want the outermost contents wrapper below to recieve the wrapper props.
  // If not, we instead pass them to LandingPageLink to wrap the content in an <a> with correct attributes
  const twoCTAProps = (link2 || !link) ? wrapperProps : null;
  const styling = (textcolor === 'white') ? css.contentWrapCtaWhite : css.contentWrapCtaDefault;
  const imageProps = { src, mobilesrc, tabletsrc, retina, mobileretina, tabletretina, alt, shouldLazyLoad };
  const contents = (
    <div className={cn(styling, css.container, { 'heroComponent': twoCTAProps })} {...twoCTAProps} data-test-id={testId('melodyHeroFullContentImg')}>
      {makeVideo() || <LandingPageImage {...imageProps} />}
      {makeContents()}
    </div>
  );

  // If there is only one CTA and the hero is an embedded video on VRSNL, we don't want to wrap the hero in a link to preserve video playback controls
  if (link && !link2 && videoSrc && dontWrapSingleCTAHero) {
    return contents;
  }
  return link && !link2 && <LandingPageLink url={link} {...wrapperProps} {...linkProps}>{contents}</LandingPageLink> || contents;
};

MelodyHeroFull.contextTypes = {
  testId: PropTypes.func,
  marketplace: PropTypes.object
};
export default withErrorBoundary('MelodyHeroFull', MelodyHeroFull);
