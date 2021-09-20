import React from 'react';
import { ExternalLinkIcon } from '@trello/nachos/icons/external-link';
import { ColorVisionOptions, ToggleColorVision } from './ToggleColorVision';
import { ToggleTota11y, Tota11yOptions } from './ToggleTota11y';

import styles from './AccessibilityMenu.less';

export const AccessibilityMenu: React.FunctionComponent = () => {
  return (
    <div className={styles.accessibilityMenuWrapper}>
      <ToggleTota11y />
      <ToggleColorVision />
      <a
        className={styles.link}
        href="https://hello.atlassian.net/wiki/spaces/TRELLOFE/pages/941672748/20.+Accessibility"
        target="_blank"
      >
        Web accessibility guide <ExternalLinkIcon />
      </a>
    </div>
  );
};

export const AccessibilityMenuOptions: React.FunctionComponent = () => {
  return (
    <>
      <Tota11yOptions />
      <ColorVisionOptions />
    </>
  );
};
