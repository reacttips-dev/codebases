import React, { useRef, useEffect, useState } from 'react';
import { Input } from '../../../../components/Field/styles';

enum CHANGE_VARIANT {
  ADD = 'add',
  REMOVE = 'remove',
  REPLACE = 'replace',
}

export const DEFAULT_VALUE = '__:__:__.___';

export function TimestampInput({
  name,
  ariaDescribedBy,
  onChange,
  initialValue,
  error,
}: {
  name: string;
  ariaDescribedBy: string;
  onChange: (value: string) => void;
  initialValue: string | null;
  error?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(DEFAULT_VALUE);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.value = initialValue || DEFAULT_VALUE;
      setValue(initialValue || DEFAULT_VALUE);
    }
  }, [initialValue]);

  return (
    <Input
      hasValue={value !== '' && value !== DEFAULT_VALUE}
      name={name}
      id={name}
      aria-describedby={ariaDescribedBy}
      ref={inputRef}
      type="text"
      isError={error}
      onFocus={handlePlaceCursor}
      onClick={handleCursorPlacementOnClick}
      onChange={e => {
        const inputValue = e.currentTarget.value.trim().slice(0, 12);
        const hasInvalidCharacter = /(?!([0-9]|\.|_|:))./gm.test(inputValue);
        const currentCursorPosition = e.currentTarget.selectionStart || 0;
        if (hasInvalidCharacter) {
          e.currentTarget.value = getFormattedTimestamp(value);
          e.currentTarget.setSelectionRange(
            currentCursorPosition - 1,
            currentCursorPosition - 1
          );
        } else {
          const inputValueRaw = stripTimestamp(inputValue);
          if (inputValueRaw.length > 9) {
            e.currentTarget.value = getFormattedTimestamp(value);
          } else {
            const changeType = getChangeType(value, inputValueRaw);
            const newTimestamp = getFormattedTimestamp(inputValueRaw);
            e.currentTarget.value = newTimestamp;
            const cursorIndex = getCursorIndex(
              inputValueRaw,
              currentCursorPosition,
              changeType
            );
            e.currentTarget.setSelectionRange(cursorIndex, cursorIndex);
            setValue(inputValueRaw);
            onChange(newTimestamp);
          }
        }
      }}
    />
  );
}

/**
 *
 * returns the new cursor index based on the type of change that is happening
 * in the input
 */
function getCursorIndex(
  value: string,
  currentCursorPosition: number | null,
  changeVariant?: CHANGE_VARIANT
) {
  if (!currentCursorPosition) return 0;
  const timestampLength = stripTimestamp(value).length;
  switch (changeVariant) {
    case CHANGE_VARIANT.REMOVE: {
      // set offset to skip past placeholder characters when deleting numbers
      const offset = [3, 6, 9].includes(currentCursorPosition) ? 1 : 0;
      return currentCursorPosition - offset;
    }
    case CHANGE_VARIANT.REPLACE:
      // keep cursor in the same position replacing existing numbers
      return currentCursorPosition || 0;
    case CHANGE_VARIANT.ADD: {
      // if cursor position if withing the current value, increment the position by one
      // otherwise, place the cursor in the next position with an offset to accomodate
      // placeholder characters
      return currentCursorPosition < getValueLength(value)
        ? currentCursorPosition + 1
        : timestampLength + getIndexOffset(timestampLength);
    }
    default:
      // place the cursor in the next position with an offset to accomodate placeholder characters
      return timestampLength + getIndexOffset(timestampLength);
  }
}

function getIndexOffset(timestampLength: number) {
  if (timestampLength > 6) return 3;
  if (timestampLength > 4) return 2;
  if (timestampLength > 2) return 1;
  return 0;
}

/**
 *
 * Returns the length of the timestamp if it were formatted with `:` or `.`
 * by padding the length of `value`
 *
 * if `value = 11234`
 * we're essentially returning the length of `11:23:4`
 */
function getValueLength(value: string) {
  if (value.length <= 2) return value.length;
  if (value.length < 4) return value.length + 1;
  if (value.length < 6) return value.length + 2;
  return value.length + 3;
}

/**
 *
 * remove any non-number characters
 */
function stripTimestamp(newValue: string) {
  return newValue.replace(/[^0-9]/g, '');
}

/**
 *
 * adds back in the `:`, `.`, and `_`
 *
 * timestamp = '123'
 * returns '12:3_:__.___'
 */
function getFormattedTimestamp(timestamp: string) {
  const [hours, minutes, seconds, ms] = splitString(timestamp);
  return `${hours.padEnd(2, '_')}:${minutes.padEnd(2, '_')}:${seconds.padEnd(
    2,
    '_'
  )}.${ms.padEnd(3, '_')}`;
}

/**
 *
 * splits a unformatted timestamp and returns number values as an array
 *
 * timestamp = '112233444'
 * returns [11, 22, 33, 444]
 */
function splitString(timestamp: string) {
  return [
    timestamp.substring(0, 2),
    timestamp.substring(2, 4),
    timestamp.substring(4, 6),
    timestamp.substring(6),
  ];
}

/**
 *
 * figures out where to place the cursor when a user clicks on the input
 */
function handleCursorPlacementOnClick(e: React.MouseEvent<HTMLInputElement>) {
  const {
    currentTarget: { selectionStart, selectionEnd },
  } = e;
  const currentValue = e.currentTarget.value;
  const valueLength = getValueLength(stripTimestamp(currentValue));

  // set cursor to beginning if user hasn't input a value
  if (currentValue === DEFAULT_VALUE) {
    e.currentTarget.setSelectionRange(0, 0);
  }

  /**
   * if user clicks a single spot in the input `selectionEnd === selectionStart`
   * and the position is outside the current value, set the cursor position
   * at the very end of the given value (if any)
   *
   */
  if (
    selectionEnd === selectionStart &&
    (selectionEnd && selectionEnd > valueLength)
  ) {
    handlePlaceCursor(e);
  }

  // otherwise, allow default cursor selection behaviour
}

/**
 *
 * set the cursor at the very end of the input value (minus placeholder characters)
 * if user hasn't input a value, cursor is placed at the beginning of input.
 *
 * No input value:
 * `__:__:__.___`
 *  ^ cursor placement
 *
 * Input with value
 * `01:2_:__.___`
 *      ^ cursor placement
 */
function handlePlaceCursor(
  e: React.MouseEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>
) {
  const {
    currentTarget: { value, selectionStart },
  } = e;
  const cursorIndex = getCursorIndex(value, selectionStart);
  e.currentTarget.setSelectionRange(cursorIndex, cursorIndex);
}

function getChangeType(prev: string, next: string) {
  const nextLength = next.length;
  const prevLength = prev.length;
  if (nextLength > prevLength) return CHANGE_VARIANT.ADD;
  if (nextLength < prevLength) return CHANGE_VARIANT.REMOVE;
  return CHANGE_VARIANT.REPLACE;
}
