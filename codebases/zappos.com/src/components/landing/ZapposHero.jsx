import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import ContentBox from 'components/common/ContentBox';
import useMartyContext from 'hooks/useMartyContext';
import LandingPageLink from 'components/landing/LandingPageLink';
import LandingPageMedia from 'components/landing/LandingPageMedia';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { evHeroClick, evHeroImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import css from 'styles/components/landing/zapposHero.scss';

/*
  Potential positions
  'inside-left-top|inside-left-center|inside-left-bottom|
  inside-center-top|inside-center-center|inside-center-bottom|
  inside-right-top|inside-right-center|inside-right-bottom|
  outside-left|outside-top|outside-right|outside-bottom
  between
*/
const xPositionInsideClassMap = {
  left: css.left,
  center: css.centerX,
  right: css.right
};

const yPositionInsideClassMap = {
  top: css.top,
  center: css.centerY,
  bottom: css.bottom
};

const positionOutsideClassMap = {
  top: css.outsideTop,
  left: css.outsideLeft,
  bottom: css.outsideBottom
  // right is the default and does not require a class
};

export const ZapposHero = ({ slotName, slotIndex, slotDetails = {}, onComponentClick, shouldLazyLoad }) => {
  const { testId } = useMartyContext();
  const { monetateId, componentName, heading, copy, subCopy, links = [], eventLabel, media = {}, content = {} } = slotDetails;
  const label = eventLabel || componentName;
  const singleLink = links.length === 1 ? links[0] : null;
  const { primary, secondary, content: contentMedia } = media;
  const heroCount = primary && secondary ? 2 : 1;
  const { position = 'outside-left', useImageAsHeading, backgroundColor, color, textAlign, contentWidth, widthFitContent, linkStyle } = content;

  useEffect(() => {
    track(() => ([evHeroImpression, { slotDetails, slotIndex, slotName, heroCount }]));
  }, [heroCount, slotDetails, slotIndex, slotName]);

  const onClick = useCallback(evt => {
    onComponentClick?.(evt);
    const { target: { dataset: { eventvalue: identifier } } } = evt;
    track(() => ([evHeroClick, { slotDetails, slotIndex, slotName, heroCount, identifier }]));
  }, [heroCount, onComponentClick, slotDetails, slotIndex, slotName]);

  let containerClass;
  let contentBoxClassPositioning;

  const [ positionType, ...positions ] = position?.split('-') || [];
  if (positionType === 'inside') {
    const [ xPosition, yPosition ] = positions;
    containerClass = css.insideContainer;
    contentBoxClassPositioning = cn(xPositionInsideClassMap[xPosition], yPositionInsideClassMap[yPosition]);
  } else if (positionType === 'outside') {
    const [ outsidePosition ] = positions;
    containerClass = positionOutsideClassMap[outsidePosition];
  } else if (positionType === 'between' && heroCount === 2) {
    containerClass = css.between;
  }

  // ensure videos maintain aspect ratio
  const primaryWithEmbeddedVideo = primary && !secondary && primary.type === 'video' && primary.isEmbedded && heading;
  const heroStyles = {};

  if (primaryWithEmbeddedVideo) {
    if (primary.embeddedRatio) {
      // TODO: curently `primaryembeddedRatio` is a percentage (e.g. 56.25%); moving forward should be a decimal (e.g. .5625), so we can (hopefully) eventually remove the ternary
      heroStyles['--iframe-video-ratio'] = primary.embeddedRatio.endsWith('%') ? parseFloat(primary.embeddedRatio) / 100 : primary.embeddedRatio;
    }

    if (contentWidth) {
      heroStyles['--hero-content-width'] = contentWidth;
    }
  }

  return (
    <article
      className={cn(
        css.container,
        'heroComponent',
        containerClass,
        { [css.twoHeroes]: heroCount === 2 },
        { [css.widthFitContent]: widthFitContent },
        { [css.embeddedVideoContainer]: primaryWithEmbeddedVideo }
      )}
      data-monetate-id={monetateId}
      data-slot-id={slotName}
      data-slotindex={slotIndex}
      data-test-id={testId(`${componentName}${position ? `:${position}` : ''}`)}
      style={heroStyles}>
      <LandingPageMedia
        {...primary}
        className={css.lazyLoader}
        shouldLazyLoad={shouldLazyLoad}
        slotName={slotName}
        slotIndex={slotIndex}/>
      <LandingPageMedia
        {...secondary}
        shouldLazyLoad={shouldLazyLoad}
        slotName={slotName}
        slotIndex={slotIndex}/>
      <ContentBox
        className={cn(css.contentBox, contentBoxClassPositioning)}
        heading={heading}
        copy={copy}
        subCopy={subCopy}
        imageData={contentMedia}
        links={links}
        linkStyle={linkStyle}
        eventLabel={label}
        onClick={onClick}
        useImageAsHeading={useImageAsHeading}
        backgroundColor={backgroundColor}
        color={color}
        textAlign={textAlign}
        contentWidth={contentWidth}
        shouldLazyLoad={shouldLazyLoad}
      />
      {/* If only a single link, cover the entire component with that click area using this hidden link */}
      {singleLink && (
        <LandingPageLink
          className={css.coverLink}
          onClick={onClick}
          aria-hidden={true}
          tabIndex="-1"
          newWindow={singleLink.newWindow}
          url={singleLink.href}
          data-eventvalue={singleLink.gae}
          data-eventlabel={label}>
          {singleLink.text}
        </LandingPageLink>
      )}
    </article>
  );
};

ZapposHero.propTypes = {
  slotName: PropTypes.string,
  slotIndex: PropTypes.number,
  onComponentClick: PropTypes.func,
  shouldLazyLoad: PropTypes.bool,
  slotDetails: PropTypes.shape({
    monetateId: PropTypes.string,
    componentName: PropTypes.string,
    heading: PropTypes.string,
    copy: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.shape({
      href: PropTypes.string,
      text: PropTypes.string,
      newWindow: PropTypes.bool,
      gae: PropTypes.string
    })),
    eventLabel: PropTypes.string,
    media: PropTypes.objectOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        sources: PropTypes.arrayOf(PropTypes.shape({
          media: PropTypes.string,
          srcset: PropTypes.string
        })),
        src: PropTypes.string,
        srcset: PropTypes.string,
        alt: PropTypes.string,
        // video specific props
        embeddedRatio: PropTypes.string,
        isEmbedded: PropTypes.bool,
        autoplay: PropTypes.bool,
        poster: PropTypes.string,
        loop: PropTypes.bool,
        tracks: PropTypes.array
      })
    ),
    content: PropTypes.shape({
      position: PropTypes.string,
      useImageAsHeading:PropTypes.bool,
      backgroundColor: PropTypes.string,
      color: PropTypes.string,
      textAlign: PropTypes.string,
      contentWidth: PropTypes.string,
      widthFitContent: PropTypes.bool
    })
  })
};

export default withErrorBoundary('ZapposHero', ZapposHero);
