/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Command,
  CommandLocalizationKeys,
  LocalizationKey,
  LocalizationKeyValue,
} from '@atlassian/butler-command-parser';
import { Analytics } from '@trello/atlassian-analytics';
import { StringSubstitutions } from '@trello/i18n';
import { getAnalyticsAttributesForCommand } from '../CommandMetadata';
import { formatButlerCommand as format } from '../formatButlerCommand';
import {
  getLocalizationKeys,
  normalizeArray,
  parseButlerCommand,
} from '../parseButlerCommand';
import { formatSpecialCase, SpecialCaseValue } from './formatSpecialCase';
import { LocalizeButlerCommandError } from './LocalizeButlerCommandError';

function firstLetterToLowercase(str: string): string {
  return str[0].toLocaleLowerCase() + str.slice(1);
}

export const enumerate = (clauses: string | string[]): string => {
  const normalizedClauses = normalizeArray(clauses);
  if (normalizedClauses.length === 1) {
    return normalizedClauses[0];
  }
  // If there are exactly two clauses, join without enumeration; e.g.:
  // "{Join the card} and {mark the due date complete}"
  if (normalizedClauses.length === 2) {
    return format('a and b', {
      a: normalizedClauses[0],
      b: normalizedClauses[1],
    });
  }
  // If there are three or more clauses, join them with enumeration,
  // which in English means adding commas and the word "and" at the end; e.g.:
  // "{Join the card}, {mark the due date complete}, and {add the blue label}"
  return normalizedClauses.reduce((acc, action, index) =>
    index < normalizedClauses.length - 1
      ? format('a enumeration comma b', { a: acc, b: action })
      : format('a serial comma b', { a: acc, b: action }),
  );
};

function substitute(prop: string, value: LocalizationKeyValue): string {
  if (Array.isArray(value)) {
    return enumerate(value.map((v) => substitute(prop, v)));
  }

  if (prop.startsWith('*')) {
    return typeof value !== 'undefined'
      ? formatSpecialCase(
          prop.toLowerCase().slice(1),
          value as SpecialCaseValue,
        )
      : '';
  }

  switch (typeof value) {
    case 'number': {
      return String(value);
    }

    case 'string': {
      // Input strings are prepended with a `$`, like `$LIST` name.
      if (prop.startsWith('$')) {
        return value.replace(/\\"/g, '"');
        // Member usernames are prepended with a `@`.
        // Note: string substitutions can be ReactNodes, which might be
        // worth considering here for rich text, e.g. avatars.
      } else if (prop.startsWith('@')) {
        return `@${value}`;
      } else {
        const formattedValue = format(value);
        if (!formattedValue) {
          throw new LocalizeButlerCommandError(value);
        }
        return formattedValue;
      }
    }

    case 'object': {
      // `value` is a nested LocalizationKey; recurse.
      return localize(value);
    }

    case 'undefined':
    default:
      return '';
  }
}

/**
 * Formats a LocalizationKey object returned from the Butler command parser.
 *
 * @example
 * // Given the following action:
 * // sort the "Backlog" list by custom field "Priority" ascending
 *
 * localize({
 *   key: 'sort_list_action',
 *   '$LIST': 'Backlog',
 *   field: { key: 'custom field name', '$NAME': 'Priority' },
 *   direction: 'ascending'
 * });
 *
 * // Results in:
 * format('sort_list_action', {
 *   list: 'Backlog', // `$` prefix in key means use raw value
 *   field: format('custom field name', { name: 'Priority' }),
 *   direction: format('ascending'),
 * });
 */
function localize({ key, ...props }: LocalizationKey) {
  const substitutions = Object.entries(props).reduce<StringSubstitutions>(
    (acc, [prop, value]) => {
      acc[prop.toLowerCase().replace(/^[*$@]/, '')] = substitute(prop, value);
      return acc;
    },
    {},
  );
  const result = format(key, substitutions);
  if (!result || typeof result !== 'string') {
    throw new LocalizeButlerCommandError(key, substitutions);
  }
  return result.trim();
}

const localizeCommandLocalizationKeys = (
  keys: CommandLocalizationKeys,
): string => {
  const actions = enumerate(
    keys.actions.map((action, i) => {
      const localized = localize(action).trim();
      // Lowercase each action that doesn't begin the sentence.
      return i > 0 ? firstLetterToLowercase(localized) : localized;
    }),
  );
  if (keys.trigger) {
    const trigger = localize(keys.trigger);
    return format('a comma b', {
      a: trigger,
      b: firstLetterToLowercase(actions),
    });
  }
  return actions;
};

export const localizeButlerCommand = (cmd: Command | string): string | null => {
  const command = typeof cmd === 'string' ? parseButlerCommand(cmd) : cmd;
  if (!command) {
    return null;
  }
  const localizationKeys = getLocalizationKeys(command);
  if (!localizationKeys) {
    return null;
  }
  try {
    const result = localizeCommandLocalizationKeys(localizationKeys);
    Analytics.sendOperationalEvent({
      actionSubject: 'butlerLocalization',
      actionSubjectId: 'localizeButlerCommand',
      action: 'succeeded',
      source: '@atlassian/butler-command-parser',
      attributes: getAnalyticsAttributesForCommand(command),
    });
    return result;
  } catch (e) {
    if (e instanceof LocalizeButlerCommandError) {
      Analytics.sendOperationalEvent({
        actionSubject: 'butlerLocalization',
        actionSubjectId: 'localizeButlerCommand',
        action: 'failed',
        source: '@atlassian/butler-command-parser',
        attributes: {
          ...getAnalyticsAttributesForCommand(command),
          keyPath: e.keyPath,
          substitutions: e.substitutions,
        },
      });
    }
    return null;
  }
};
