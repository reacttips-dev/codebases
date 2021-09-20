import { useState, useEffect } from 'react';
import { TrelloStorage } from '@trello/storage';
import { currentLocale } from '@trello/locale';
import { THIRTY_SECONDS, ONE_HOUR } from './helpers';

const TACO_SHOW_STORAGE_KEY = `tacoShow-${currentLocale}`;

export const setStorageFlag = (date: number) =>
  TrelloStorage.set(TACO_SHOW_STORAGE_KEY, date.toString());

export const hasStorageFlagExpired = () => {
  const timestamp = parseInt(TrelloStorage.get(TACO_SHOW_STORAGE_KEY), 10);
  if (!timestamp || isNaN(timestamp)) {
    return true;
  }
  return Date.now() > timestamp;
};

export const clearStorageFlag = () =>
  TrelloStorage.unset(TACO_SHOW_STORAGE_KEY);

/*
 * Manages the state of whether Taco should be visible on the screen.
 * Once we set this to true (when the announcements popover is shown),
 * we set a localStorage flag with a timestamp of 1 hour in the future.
 * We set an interval to check if the time has elapsed past that point,
 * and check it every 30 seconds. Once that time has elapsed,
 * we reset the state and Taco hides again.
 */
export const useTacoShowInterval = (): [boolean, () => void] => {
  /*
   * Set the initial state based on whether that localStorage flag is
   * set, and is a timestamp in the future
   */
  const [shouldTacoShow, setShouldTacoShow] = useState(
    !hasStorageFlagExpired(),
  );

  /*
   * Sets an interval every 30 seconds to check if the timestamp is
   * still in the future. Once the time has elapsed, set the state
   * to false and delete the localStorage flag
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (hasStorageFlagExpired()) {
        setShouldTacoShow(false);
        clearStorageFlag();
      } else {
        setShouldTacoShow(true);
      }
    }, THIRTY_SECONDS);
    return () => clearInterval(intervalId);
  }, []);

  /*
   * Sets the state and localStorage flag to show Taco
   */
  const showTaco = () => {
    setStorageFlag(Date.now() + ONE_HOUR);
    setShouldTacoShow(true);
  };

  return [shouldTacoShow, showTaco];
};
