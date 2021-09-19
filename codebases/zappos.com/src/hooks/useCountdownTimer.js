import { useEffect, useState } from 'react';

import { dateToTimeObj } from 'helpers/TimeUtils';

// You're going to want to pass a date string in here because of how this does shallow comparisons
// new Date() !== new Date()
export function useCountdownTimer(time) {
  // Setting as null initally so we don't get mismatched elements between server/client.
  // Otherwise because of how time works we might have 5sec serverside but 3sec clientside.
  const [ releaseTime, setReleaseTime ] = useState(null);

  useEffect(() => {
    const parsedTime = new Date(time);
    // Don't bother setting the interval if there isn't a time passed
    if (parsedTime instanceof Date && !isNaN(parsedTime)) {
      const interval = setInterval(() => {
        setReleaseTime(() => {
          const timeUntilRelease = dateToTimeObj(parsedTime);
          // Stop the interval once we've passed the specified date/time
          if (timeUntilRelease.timePassed) {
            clearInterval(interval);
          }
          return timeUntilRelease;
        });
      }, 1000);
      // Clear interval every interval/render & once we're unmounting
      return () => clearInterval(interval);
    }
  }, [time]);

  return releaseTime;
}
