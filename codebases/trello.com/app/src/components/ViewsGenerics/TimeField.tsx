import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { forTemplate } from '@trello/i18n';
import { Textfield, TextfieldProps } from '@trello/nachos/textfield';
import { isSubmitEvent } from '@trello/keybindings';

const format = forTemplate('views');

// Format used by moment to localize time display, e.g. '8:00 PM' in US English.
const TIME_FORMAT: moment.LongDateFormatKey = 'LT';

export interface TimeFieldProps
  extends Omit<TextfieldProps, 'onChange' | 'value'> {
  /**
   * Input timestamp from a parent state. This is maintained in parallel with an
   * internal state, which tracks the user input. If undefined, it will default
   * to the current time.
   * @default undefined
   */
  timestamp: number | undefined;
  /**
   * Callback called with a formatted time. This is called either onBlur or if
   * the user hits the Enter key while the input has focus.
   */
  onChange: (value: number) => void;
}

/**
 * Input that makes a timestamp editable as a locale-aware formatted string.
 * For example, given a timestamp for midnight in US English, this component
 * would render a Textfield that reads "12:00 AM". It validates user input
 * out-of-the-box, resetting invalid time inputs and constraining inputs to the
 * string format for the given locale.
 */
export const TimeField = React.forwardRef<HTMLInputElement, TimeFieldProps>(
  ({ timestamp, onChange, placeholder, isDisabled, ...rest }, ref) => {
    // Local state management for the time input. Initialized in LT format.
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
      const currentLocaleData = moment.localeData();
      const timeMoment = timestamp
        ? moment(timestamp)
        : moment(!isDisabled ? undefined : '');

      const isTimeValid = timeMoment.isValid();

      const formattedTime = isTimeValid
        ? timeMoment.format(TIME_FORMAT)
        : currentLocaleData.longDateFormat(TIME_FORMAT);

      // Keep local time state in sync with input time.
      if (formattedTime !== currentTime) {
        setCurrentTime(formattedTime);
      }
      // If time was undefined, initialize it.
      if (!timestamp) {
        onChange(isTimeValid ? timeMoment.valueOf() : Date.now());
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timestamp]);

    const onBlur = useCallback(() => {
      // Parse the localized time (LT) as well as an AM/PM (A) suffixed so that
      // that 24hr timezones can still input 7pm and have it result in 19:00
      let timeMoment = moment(currentTime, `${TIME_FORMAT} A`);
      // If the changed time is not valid, then set it to the value before the
      // user changed the field.
      if (!timeMoment.isValid()) {
        timeMoment = moment(timestamp);
      }

      const formattedTime = timeMoment.format(TIME_FORMAT);
      setCurrentTime(formattedTime);

      const newTimestamp = timeMoment.valueOf();
      if (newTimestamp !== timestamp) {
        onChange(newTimestamp);
      }

      // Unfocus the input element to make validation more obvious.
      if (document.activeElement instanceof HTMLInputElement) {
        document.activeElement.blur();
      }
    }, [currentTime, onChange, setCurrentTime, timestamp]);

    return (
      <Textfield
        ref={ref}
        value={currentTime}
        placeholder={placeholder ?? format('add-time')}
        isDisabled={isDisabled}
        onBlur={onBlur}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={({ target: { value } }) => {
          setCurrentTime(value);
        }}
        // eslint-disable-next-line react/jsx-no-bind
        onKeyDown={(e) => {
          if (
            isSubmitEvent(e) &&
            document.activeElement instanceof HTMLInputElement
          ) {
            document.activeElement.blur();
          }
        }}
        {...rest}
      />
    );
  },
);
