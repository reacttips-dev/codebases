import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router';

import { useCountdownTimer } from 'hooks/useCountdownTimer';
import LandingPageImage from 'components/landing/LandingPageImage';
import CountdownTimer from 'components/common/CountdownTimer';
import { evHeroClick, evHeroImpression } from 'events/symphony';
import { track } from 'apis/amethyst';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/landing/eventCallout.scss';

export const EventCallout = props => {
  const {
    slotName,
    slotIndex,
    shouldLazyLoad,
    onComponentClick,
    ipStatus: { valid } = {},
    slotDetails
  } = props;
  const {
    topcaption, time, src, retina, mobilesrc, mobileretina, tabletsrc, tabletretina, alt = '',
    iprestricted, topheading, heading, copy, cta, link, gae, bgcolor, monetateId
  } = slotDetails;

  useEffect(() => {
    track(() => ([evHeroImpression, { slotDetails, slotIndex, slotName, heroCount: 1 }]));
  }, [slotDetails, slotIndex, slotName]);

  const onClick = useCallback(evt => {
    onComponentClick && onComponentClick(evt);
    track(() => ([evHeroClick, { slotDetails, slotIndex, slotName, heroCount: 1 }]));
  }, [onComponentClick, slotDetails, slotIndex, slotName]);

  const releaseTime = useCountdownTimer(time);

  // Hide if not ipRestricted & not in ip range
  // OR if time param passed and that time has passed from now
  if ((iprestricted === 'true' && !valid) || (time && releaseTime?.timePassed !== false)) {
    return null;
  }
  const imageProps = { src, retina, mobilesrc, mobileretina, tabletsrc, tabletretina, alt, shouldLazyLoad };
  return (
    <div className={cn(css.container, { [css.bgBlack]: bgcolor === 'black' })} data-slot-id={slotName} data-monetate-id={monetateId}>
      {topcaption && <p className={css.topCaption}>{topcaption}</p>}
      <LandingPageImage {...imageProps} />
      <div className={css.content}>
        {topheading && <p className={css.topHeading}>{topheading}</p>}
        {heading && <h2 className={css.heading}>{heading}</h2>}
        <CountdownTimer releaseTime={releaseTime} className={css.countdown}/>
        {copy && <p className={css.copy}>{copy}</p>}
        {cta && <Link
          data-eventlabel="EventCallout"
          data-eventvalue={gae || heading}
          data-slotindex={slotIndex}
          onClick={onClick}
          to={link}>{cta}</Link>}
      </div>
    </div>
  );
};

EventCallout.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('EventCallout', EventCallout);
