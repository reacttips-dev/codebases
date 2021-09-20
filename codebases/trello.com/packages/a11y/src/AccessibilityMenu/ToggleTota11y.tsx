import React, { useCallback } from 'react';
import { Checkbox } from '@trello/nachos/checkbox';
import uuid from 'uuid/v4';

import styles from './AccessibilityMenu.less';
import { useSharedState } from '@trello/shared-state';
import { a11yMenuState } from './a11yMenuState';

export const ToggleTota11y: React.FunctionComponent = () => {
  const [
    { isTota11yEnabled, colorVisionMode, isColorVisionEnabled },
    setA11yMenuState,
  ] = useSharedState(a11yMenuState);

  const onChange = useCallback(async () => {
    if (!isTota11yEnabled) {
      await import(/* webpackChunkName: "tota11y" */ '@khanacademy/tota11y');

      // still need a little bit more time for parsing
      setTimeout(() => {
        document
          .querySelector('.tota11y-toolbar')
          ?.classList.add('tota11y-expanded');
      }, 300);
    }

    setA11yMenuState({
      colorVisionMode,
      isColorVisionEnabled,
      isTota11yInstalled: true,
      isTota11yEnabled: !isTota11yEnabled,
    });
  }, [
    setA11yMenuState,
    colorVisionMode,
    isColorVisionEnabled,
    isTota11yEnabled,
  ]);

  const id = uuid();

  return (
    <>
      <label htmlFor={id} className={styles.tota11yOptions}>
        <Checkbox
          id={id}
          onChange={onChange}
          isChecked={isTota11yEnabled}
          className={styles.checkbox}
        />
        <span className={styles.label}>Enable Tota11y sidebar</span>
      </label>
    </>
  );
};

export const Tota11yOptions: React.FunctionComponent = () => {
  const [{ isTota11yInstalled, isTota11yEnabled }] = useSharedState(
    a11yMenuState,
  );

  return isTota11yInstalled && !isTota11yEnabled ? (
    <style>{`.tota11y { display: none !important }`}</style>
  ) : null;
};
