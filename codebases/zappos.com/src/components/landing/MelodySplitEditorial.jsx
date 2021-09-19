import { useCallback, useEffect } from 'react';
import cn from 'classnames';

import { stripSpecialChars } from 'helpers';
import {
  setInlineBackgroundColor,
  setInlineTextAndBorderBottomColor,
  setInlineTextColor
} from 'helpers/LandingPageUtils';
import LandingPageImage from 'components/landing/LandingPageImage';
import LandingPageLink from 'components/landing/LandingPageLink';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { evHeroClick, evHeroImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import css from 'styles/components/landing/melodySplitEditorial.scss';

export const MelodySplitEditorial = ({ slotName, slotIndex, slotDetails, onComponentClick, shouldLazyLoad }) => {
  const { sections = [], monetateId, componentName } = slotDetails;
  const heroCount = sections.length;

  useEffect(() => {
    sections.forEach(section => track(() => ([
      evHeroImpression,
      { slotDetails: section, slotIndex, slotName, name: componentName, heroCount }
    ])));
  }, [sections, componentName, slotIndex, slotName, heroCount]);

  const onClick = useCallback((evt, section) => {
    onComponentClick && onComponentClick(evt);
    track(() => ([evHeroClick, {
      slotDetails: section,
      slotIndex,
      slotName,
      name: componentName,
      identifier: evt.target.dataset.eventvalue,
      heroCount,
      linkText: evt.target.innerText
    }]));
  }, [componentName, heroCount, onComponentClick, slotIndex, slotName]);

  // This checks to see if there are more than one content box. If so, this turns off
  // our overlay styling on mobile sized screens.
  let hasOneBox = false;
  const hasMultipleContentBoxes = sections.some(v => {
    if (v.heading || v.copy || v.cta || v.ctasecondary || v.brandsrc) {
      if (hasOneBox) {
        return true;
      } else {
        hasOneBox = true;
      }
    }
  });

  const makeContentContainer = (section, index) => {
    const { transparent, bgcolor, textcolor, heading, brandsrc, brandalt, brandretina, copy, subtext, ctalink, cta, ctasecondarylink, ctasecondary, ctagae, ctasecondarygae, full } = section;

    const hasContent = !!(heading || copy || cta || ctasecondary || brandsrc);

    const linkProps = {
      'onClick': evt => onClick(evt, section),
      'data-eventlabel': 'melodySplitEditorialLink1',
      'data-eventvalue': ctagae,
      'data-slotindex': slotIndex,
      'style': setInlineTextAndBorderBottomColor(textcolor)
    };

    const linkProps2 = {
      'onClick': evt => onClick(evt, section),
      'data-eventlabel': 'melodySplitEditorialLink2',
      'data-slotindex': slotIndex,
      'data-eventvalue': ctasecondarygae,
      'style': setInlineTextAndBorderBottomColor(textcolor)
    };

    const makeDivClasses = () => {
      let side;
      if (sections.length === 1 || full === 'true') {
        side = css.full;
      } else {
        side = (index === sections.length - 1) ? css.left : css.right;
      }
      return (
        cn(
          css.container,
          side,
          { [css.hasMultipleContentBoxes]: hasMultipleContentBoxes },
          { [css.transparent]: transparent === 'true' })
      );
    };

    return hasContent && (
      <div
        className={makeDivClasses()}
        style={setInlineBackgroundColor(bgcolor)}>
        {heading && <h2 style={setInlineTextColor(textcolor)}>{heading}</h2>}
        {brandsrc &&
          <LandingPageImage
            src={brandsrc}
            retina={brandretina}
            alt={brandalt}
            shouldLazyLoad={shouldLazyLoad}
          />}
        {copy && <p style={setInlineTextColor(textcolor)}>{copy}</p>}
        {subtext && <p className={css.subtext}>{subtext}</p>}
        {cta && <LandingPageLink url={ctalink} {...linkProps}>{cta}</LandingPageLink>}
        {ctasecondarylink && <LandingPageLink url={ctasecondarylink} {...linkProps2}>{ctasecondary}</LandingPageLink>}
      </div>
    );
  };

  return (
    <div className={css.splitEditorial} data-slot-id={slotName} data-monetate-id={monetateId}>
      {sections.map((section, i) => {
        const { src, mobilesrc, tabletsrc, retina, mobileretina, tabletretina, alt } = section;
        return (
          <div className={css.wrap} key={`${stripSpecialChars(src || mobilesrc || retina)}_${i}`}>
            <LandingPageImage
              src={src}
              mobilesrc={mobilesrc}
              tabletsrc={tabletsrc}
              retina={retina}
              mobileretina={mobileretina}
              tabletretina={tabletretina}
              alt={alt}
              shouldLazyLoad={shouldLazyLoad}
              className={i === 1 ? css.lazyImgRight : css.lazyImgLeft}
            />
            {makeContentContainer(section, i)}
          </div>
        );
      })}
    </div>
  );
};

export default withErrorBoundary('MelodySplitEditorial', MelodySplitEditorial);
