import {
  Action,
  Command,
  Destination,
  CustomField,
  Label,
  Trigger,
} from '@atlassian/butler-command-parser';
import { parseDueOrStartDate } from './parseDueOrStartDate';

const validateDestination = (input: Destination = {}): input is Destination => {
  const { POSITION_TOP, POSITION_BOTTOM, $LIST } = input;
  return !!((POSITION_TOP || POSITION_BOTTOM) && $LIST);
};

const validateCustomField = (input: CustomField = {}): input is CustomField =>
  !!input.$NAME;

export const validateLabel = (
  input: Label | Label[] = {},
): input is Label | Label[] =>
  (Array.isArray(input) ? input : [input]).every(
    (label) => !!label.COLOR || !!label.$TITLE,
  );
// Several Butler command actions offer options as key/val pairs, where only
// a single key should be set. This function returns a single valid key.
const getSingleKey = <T>(data: T, keys: Array<keyof T>): keyof T | null => {
  const setKeys = keys.filter((key) => !!data[key]);
  if (setKeys.length === 1) {
    return setKeys[0];
  }
  return null;
};

const validateTrigger = (trigger: Trigger | undefined): boolean => {
  if (trigger === undefined) {
    return true;
  }
  switch (trigger.type) {
    case 'EVERY':
      switch (trigger.EVERY?.type) {
        case 'CERTAIN_DAYS': {
          const days = trigger.EVERY.CERTAIN_DAYS.DAY;
          const normalizedDays = Array.isArray(days) ? days : [days];
          return (
            normalizedDays.length > 0 && normalizedDays.every(Number.isInteger)
          );
        }
        // TODO: Properly validate list rule triggers
        case 'EVERY_DAY':
          return true;
        default:
          return false;
      }
    case 'WHEN':
      switch (trigger.WHEN?.type) {
        // TODO: Properly validate list rule triggers
        case 'CARD_INTO_LIST':
          return true;
        default:
          return false;
      }
    default:
      return false;
  }
};

const validateAction = (action: Action): boolean => {
  switch (action.type) {
    case 'SEND_EMAIL_ACTION': {
      const { $ADDRESS = '', $SUBJECT = '' } = action.SEND_EMAIL_ACTION;
      const numAddresses = $ADDRESS?.split(';')?.length ?? 0;
      return (
        $ADDRESS?.length > 0 &&
        numAddresses > 0 &&
        numAddresses <= 10 &&
        ($SUBJECT.trim()?.length ?? 0) > 0
      );
    }
    case 'MOVE_CARD_ACTION':
      return validateDestination(action.MOVE_CARD_ACTION.DESTINATION);
    case 'COPY_CARD_ACTION':
      return validateDestination(action.COPY_CARD_ACTION.DESTINATION);
    case 'REMOVE_FROM_CARD_ACTION': {
      const data = action.REMOVE_FROM_CARD_ACTION;
      const key = getSingleKey(data, [
        'LABEL',
        'REMOVE_ALL_CHECKLISTS',
        'REMOVE_ALL_MEMBERS',
        'REMOVE_ALL_STICKERS',
        'REMOVE_ALL_LABELS',
        'REMOVE_COVER',
        'REMOVE_DUE_DATE',
        'REMOVE_START_DATE',
      ]);
      if (!key) {
        return false;
      }
      if (data.LABEL) {
        return validateLabel(data.LABEL);
      }
      return data[key] === true;
    }

    case 'ADD_START_DATE_ACTION':
    case 'ADD_DUE_DATE_ACTION': {
      const dateValue =
        action.type === 'ADD_DUE_DATE_ACTION'
          ? action.ADD_DUE_DATE_ACTION.DUE_DATE
          : action.ADD_START_DATE_ACTION.START_DATE;
      if (!dateValue) {
        return false;
      }
      const { time, timeframe } = parseDueOrStartDate(dateValue);
      return !!timeframe && typeof time === 'number' && !Number.isNaN(time);
    }
    case 'SORT_LIST_ACTION': {
      const data = action.SORT_LIST_ACTION;
      const key = getSingleKey(data, [
        'SORT_BY_AGE',
        'SORT_BY_CUSTOM_FIELD',
        'SORT_BY_DATE_IN_TITLE',
        'SORT_BY_DUE_DATE',
        'SORT_BY_LABEL',
        'SORT_BY_START_DATE',
        'SORT_BY_TIME_IN_LIST',
        'SORT_BY_TITLE',
        'SORT_BY_VOTES',
      ]);
      if (!key) {
        return false;
      }
      if (data.SORT_BY_LABEL) {
        return validateLabel(data.SORT_BY_LABEL.SORT_LABEL);
      }
      if (data.SORT_BY_CUSTOM_FIELD) {
        return validateCustomField(data.SORT_BY_CUSTOM_FIELD);
      }
      return data[key] === true;
    }
    case 'ADD_LABEL_ACTION':
      return validateLabel(action.ADD_LABEL_ACTION.LABEL);
    case 'CREATE_REPORT_ACTION':
    case 'MARK_DUE_COMPLETE_ACTION':
    case 'UNMARK_DUE_COMPLETE_ACTION':
    case 'JOIN_CARD_ACTION': {
      return true;
    }
    default:
      return false;
  }
};

export const validateCommand = (command: Command): boolean => {
  if (!command.ACTION.length) {
    return false;
  }
  if (!validateTrigger(command.TRIGGER)) {
    return false;
  }
  return command.ACTION.every(validateAction);
};
