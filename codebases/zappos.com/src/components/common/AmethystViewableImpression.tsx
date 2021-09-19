import React, { useRef } from 'react';
import propTypes from 'prop-types';

import Sentinel from 'components/common/Sentinel';
import { track } from 'apis/amethyst';

const options = { rootMargin: '0px 0px', threshold: 0.5 };

interface Props {
  children?: React.ReactNode;
  event: (...args: any[]) => any;
  [key: string]: any;
}

/**
 * AmethystViewableImpression
 *
 * Wrap your component in this and this component will automatically fire
 * the passed in `event` with all other provided props as arguments of the
 * event once the component is at least 50% within the viewport.
 *
 * The `viewableImpression` prop will automatically be passed to your event
 * with a value of `true` when using this component.
 *
 * Note: If this is used within a MelodyCarousel, it will send an impression event for all items in the carousel, even if they are not on the viewable "page'
 */
const AmethystViewableImpression = ({ children, event, ...args }: Props) => {
  // Keep track of if the event has been sent already so we don't send dupes
  // In theory this should have been handled by IntersectionObserver's triggerOnce
  // but in practice that doesn't seem to be the case.
  const sent = useRef(false);

  // add in viewableImpression event param
  args = { ...args, viewableImpression: true };

  const callback = () => {
    if (!sent.current) {
      track(() => [event, args]);
      sent.current = true;
    }
  };

  return <Sentinel callback={callback} options={options}>{children}</Sentinel>;
};

AmethystViewableImpression.propTypes = {
  event: propTypes.func.isRequired
};

export default AmethystViewableImpression;
