import React, { useCallback } from 'react';
import moment from 'moment';
import type { Time } from '@atlassian/butler-command-parser';
import {
  TimeField,
  TimeFieldProps,
} from 'app/src/components/ViewsGenerics/TimeField';
// eslint-disable-next-line @trello/less-matches-component
import styles from './CommandText.less';

const getTimestampFromTime = (time: Time | undefined): number | undefined => {
  if (!time) {
    return undefined;
  }
  const timeMoment = moment(
    `${time.HOUR}:${time.MINUTES ?? '00'} ${time.AM || time.PM || ''}`,
    'LT A',
  );
  return timeMoment.isValid() ? timeMoment.valueOf() : undefined;
};

/**
 * Extend TimeFieldProps to allow dual-read/write. For the default TimeField
 * experience, use `timestamp` & `onChange`. In most (if not all) Butler usage,
 * time is passed around as the Command Parser's `Time` interface;
 * `time` & `onChangeTime` are utility props that are mutually exclusive with
 * `timestamp` & `onChange`, and wrap the default behavior behind conversions
 * to and from the `Time` interface.
 */
interface Props extends Omit<TimeFieldProps, 'onChange' | 'timestamp'> {
  timestamp?: TimeFieldProps['timestamp'];
  onChange?: TimeFieldProps['onChange'];

  time?: Time;
  onChangeTime?: (time: Time) => void;
}

export const CommandTime = React.forwardRef<HTMLInputElement, Props>(
  ({ timestamp, time, onChange, onChangeTime, ...rest }, ref) => {
    const _timestamp = time ? getTimestampFromTime(time) : timestamp;
    const _onChange = useCallback(
      (value: number) => {
        if (onChangeTime) {
          const timeMoment = moment(value);
          return onChangeTime({
            // Moment doesn't store AM/PM; 8 PM = 20 hours.
            // The Command Parser should know how to handle that, but we can
            // manually pull AM/PM with `.format('A')` if necessary.
            HOUR: timeMoment.hours(),
            MINUTES: timeMoment.minutes(),
          });
        }
        return onChange?.(value);
      },
      [onChange, onChangeTime],
    );
    return (
      <TimeField
        appearance="borderless"
        className={styles.commandTime}
        onChange={_onChange}
        placeholder=""
        ref={ref}
        spacing="compact"
        timestamp={_timestamp}
        {...rest}
      />
    );
  },
);
