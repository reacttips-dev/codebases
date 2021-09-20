import React, { useCallback, useEffect, useState } from 'react';
import { Popover, usePopover } from '@trello/nachos/popover';
import { Analytics } from '@trello/atlassian-analytics';

import { useTacoShowInterval } from './useTacoShowInterval';
import { useImageLoadedState } from './useImageLoadedState';
import { useUnreadAnnouncementsQuery } from './useUnreadAnnouncementsQuery';
import { TacoPosition, TacoStyle } from './helpers';

import styles from './TacoAnnouncements.less';
import { Announcements } from './Announcements';
import cx from 'classnames';
import { forNamespace } from '@trello/i18n';

const format = forNamespace('announcements');
const viewTitle = forNamespace('view title');

export const TacoAnnouncements: React.FC = () => {
  const { popoverProps, triggerRef, toggle } = usePopover<HTMLButtonElement>();
  const [
    mountedForLessThan10Seconds,
    setMountedForLessThan10Seconds,
  ] = useState(true);

  /*
   * Ensure the taco image has been loaded. We don't want the talk
   * bubble to show up before the image.
   */
  const tacoImageHasLoaded = useImageLoadedState(
    require('resources/images/TinyTacoTalking.png'),
  );

  /*
   * We only want to check for announcements after 10 seconds.
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMountedForLessThan10Seconds(false);
    }, 10000);

    return () => {
      window.clearTimeout(timer);
    };
  });

  /*
   * Poll the announcements API every 10 minutes to check for
   * new announcements
   */
  const {
    unreadAnnouncements,
    resetUnreadAnnouncements,
    tacoStyle,
  } = useUnreadAnnouncementsQuery({ skip: mountedForLessThan10Seconds });

  /*
   * Checks if Taco should be showing on screen in the crouched
   * position once the unread messages have been dismissed
   */
  const [shouldTacoShow, setShouldTacoShow] = useTacoShowInterval();

  /*
   * Show the Announcements popover to reveal announcement details,
   * along with any other announcements the API may return. Set tacoShow
   * localStorage flag so he stays on screen for the next hour
   */
  const showAnnouncementsPopover = useCallback(() => {
    setShouldTacoShow();
    toggle();
    Analytics.sendViewedComponentEvent({
      componentType: 'inlineDialog',
      componentName: 'tacoAnnouncementsInlineDialog',
      source: 'appHeader',
      attributes: {
        type: 'Roo',
        interestingAnnouncementCount: unreadAnnouncements.length,
      },
    });
  }, [unreadAnnouncements, toggle, setShouldTacoShow]);

  /*
   * If there are any unread announcements, show Taco in
   * the Up position. If there are no unreads, but the
   * showTaco timestamp has not yet elapsed, show Taco in
   * the crouched position. Otherwise hide Taco
   */
  let position = TacoPosition.Hidden;
  if (tacoImageHasLoaded && unreadAnnouncements.length > 0) {
    position = TacoPosition.Up;
  } else if (tacoImageHasLoaded && shouldTacoShow) {
    position = TacoPosition.Crouched;
  }

  const rooText =
    tacoStyle === TacoStyle.Maintenance
      ? format('maintenance')
      : format('new stuff');
  const tacoClasses = cx({
    [styles.button]: true,
    [styles.rooHidden]: position === TacoPosition.Hidden,
    [styles.rooUp]: position === TacoPosition.Up,
    [styles.rooCrouch]: position === TacoPosition.Crouched,
  });
  const rooTextClasses = cx({
    [styles.rooText]: true,
    [styles.rooAlert]: tacoStyle === TacoStyle.Maintenance,
  });
  const leftArrowClasses = cx({
    [styles.leftArrow]: true,
    [styles.rooAlert]: tacoStyle === TacoStyle.Maintenance,
  });

  return (
    <div className={styles.container}>
      <button
        className={tacoClasses}
        ref={triggerRef}
        onClick={showAnnouncementsPopover}
        hidden={position === TacoPosition.Hidden}
      >
        <span className={styles.rooIcon} />
        <span className={styles.rooMessageContainer}>
          <span className={leftArrowClasses} />
          <span className={rooTextClasses}>
            <span>{rooText}</span>
          </span>
        </span>
      </button>
      <Popover {...popoverProps} title={viewTitle('announcements')}>
        <div className={styles.popoverContent}>
          <Announcements
            announcements={unreadAnnouncements}
            onDismissAnnouncements={resetUnreadAnnouncements}
          />
        </div>
      </Popover>
    </div>
  );
};
