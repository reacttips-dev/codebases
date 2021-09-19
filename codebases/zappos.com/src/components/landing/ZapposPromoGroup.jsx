import cn from 'classnames';
import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { track } from 'apis/amethyst';
import { evHeroClick, evHeroImpression } from 'events/symphony';
import useMartyContext from 'hooks/useMartyContext';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import ContentBox from 'components/common/ContentBox.jsx';
import LandingPageLink from 'components/landing/LandingPageLink';
import LandingPageMedia from 'components/landing/LandingPageMedia';

import css from 'styles/components/landing/zapposPromoGroup.scss';

const positionOutsideClassMap = {
  bottom: css.bottom,
  top: css.top,
  right: css.right,
  left: css.left
};

const ZapposPromo = props => {
  const { heading, copy, subCopy, links = [], onComponentClick, slotIndex, slotName, heroCount, componentName, itemsPerRow, eventLabel, media = {}, content: { useImageAsHeading, linkStyle, backgroundColor, color, textAlign, width, position = 'outside-bottom' } = {}, shouldLazyLoad } = props;
  const { testId } = useMartyContext();
  const singleLink = links.length === 1 ? links[0] : null;
  const label = eventLabel || componentName;
  const { primary, content } = media;
  const [ positionType, positionLocation ] = (position || '').split('-');

  const positionClass = positionType === 'outside' ? positionOutsideClassMap[positionLocation] : css.bottom;

  const onClick = useCallback(evt => {
    onComponentClick?.(evt);
    const { target: { dataset: { eventvalue: identifier } } } = evt;
    track(() => ([evHeroClick, { slotDetails: props, slotIndex, slotName, heroCount, identifier }]));
  }, [heroCount, onComponentClick, props, slotIndex, slotName]);

  useEffect(() => {
    track(() => ([evHeroImpression, { slotDetails: props, slotIndex, slotName, heroCount, name: componentName }]));
  }, [componentName, heroCount, props, slotIndex, slotName]);

  const style = { width: width || `calc(100% / ${itemsPerRow})` };
  if (backgroundColor) {
    style.backgroundColor = backgroundColor;
  }

  return (
    <article
      className={cn(css.zapposPromoContainer, positionClass)}
      data-test-id={testId('zapposPromoSection')}
      style={style}
    >
      <LandingPageMedia
        {...primary}
        shouldLazyLoad={shouldLazyLoad}
        slotName={slotName}
        slotIndex={slotIndex}/>
      <ContentBox
        className={cn(css.contentBox)}
        heading={heading}
        copy={copy}
        subCopy={subCopy}
        links={links}
        imageData={content}
        HeadingTag="h3"
        linkStyle={linkStyle}
        eventLabel={label}
        onClick={onClick}
        useImageAsHeading={useImageAsHeading}
        color={color}
        backgroundColor={backgroundColor}
        textAlign={textAlign}
        shouldLazyLoad={shouldLazyLoad}
      />
      {singleLink &&
      <LandingPageLink
        className={css.coverLink}
        onClick={onClick}
        aria-hidden={true}
        tabIndex="-1"
        newWindow={singleLink.newWindow}
        url={singleLink.href}
        data-eventlabel={label}
        data-eventvalue={singleLink.gae || singleLink.text}>
        {singleLink.text}
      </LandingPageLink>
      }
    </article>
  );
};

export const ZapposPromoGroup = ({ slotDetails = {}, onComponentClick, slotIndex, slotName, shouldLazyLoad }) => {
  const { heading, sections, monetateId, componentName, itemsPerRow = 3 } = slotDetails;

  return (
    <section
      className={cn(css.zapposPromoGroupContainer)}
      data-monetate-id={monetateId}
      data-slot-id={slotName}
      data-slotindex={slotIndex}>
      {heading && <h2>{heading}</h2>}
      <div className={cn(css.promos)}>
        {sections.map(section =>
          <ZapposPromo
            {...section}
            heaing={heading}
            key={section.heading + section.copy}
            shouldLazyLoad={shouldLazyLoad}
            componentName={componentName}
            itemsPerRow={itemsPerRow}
            slotIndex={slotIndex}
            slotName={slotName}
            heroCount={sections.length}
            onComponentClick={onComponentClick}
          />
        )}
      </div>
    </section>
  );
};

ZapposPromoGroup.propTypes = {
  slotIndex: PropTypes.number,
  slotName: PropTypes.string,
  onComponentClick: PropTypes.func,
  shouldLazyLoad: PropTypes.bool,
  slotDetails: PropTypes.shape({
    componentName: PropTypes.string,
    heading: PropTypes.string,
    itemsPerRow: PropTypes.number,
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        heading: PropTypes.string,
        copy: PropTypes.string,
        links: PropTypes.arrayOf(PropTypes.shape({
          href: PropTypes.string,
          text: PropTypes.string,
          gae: PropTypes.string
        })),
        tracks: PropTypes.array
      }))
  })
};

ZapposPromo.propTypes = {
  heading: PropTypes.string,
  copy: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string,
    text: PropTypes.string,
    gae: PropTypes.string
  })),
  onComponentClick: PropTypes.func,
  shouldLazyLoad: PropTypes.bool,
  slotIndex: PropTypes.number,
  slotName: PropTypes.string,
  itemsPerRow: PropTypes.number,
  heroCount: PropTypes.number,
  eventLabel: PropTypes.string,
  componentName: PropTypes.string,
  content: PropTypes.shape({
    linkStyle: PropTypes.string,
    position: PropTypes.string,
    useImageAsHeading:PropTypes.bool,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    textAlign: PropTypes.string,
    width: PropTypes.string
  }),
  media: PropTypes.objectOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      src: PropTypes.string,
      alt: PropTypes.string
    })
  )
};

export default withErrorBoundary ('ZapposPromoGroup', ZapposPromoGroup);
