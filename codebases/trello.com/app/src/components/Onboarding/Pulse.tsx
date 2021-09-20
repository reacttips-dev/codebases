import classNames from 'classnames';
import {
  ELEVATION_ATTR,
  getHighestVisibleElevation,
} from '@trello/layer-manager';
import React from 'react';
import styles from './Pulse.less';

interface PulseProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  spotlightOpen?: boolean;
}

/*
  Here we've implemented our own version of the @atlaskit/onboarding
  SpotlightPulse component. The @atlaskit version did not work well
  with our lazy-loading approach, and had a dependency on styled-components
*/
export const Pulse: React.FC<PulseProps> = ({
  className,
  spotlightOpen,
  ...props
}) => {
  // We need to lift the pulse to the highest possible elevation when
  // the spotlight is open. Otherwise when the user clicks to close the
  // pulse the click may also close any other "popovers" that may be
  // open (like the card the user was tring to comment on)
  const elevationProps = spotlightOpen
    ? {
        [ELEVATION_ATTR]: getHighestVisibleElevation() + 1,
      }
    : {};
  return (
    <a
      className={classNames(styles.pulse, className)}
      {...elevationProps}
      {...props}
    >
      <div className={styles.disableClicks}>{props.children}</div>
    </a>
  );
};
