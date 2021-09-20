import {
  parseCommand as _parseCommand,
  localizeCommandToButlerEnglish as _localizeCommandToButlerEnglish,
  getLocalizationKeysForCommand as _getLocalizationKeysForCommand,
  Command,
  CommandLocalizationKeys,
} from '@atlassian/butler-command-parser';
import { Analytics } from '@trello/atlassian-analytics';

export const parseButlerCommand = (cmd: string): Command | null =>
  _parseCommand(cmd)?.parse ?? null;

export const localizeCommandToButlerEnglish = (cmd: Command): string | null => {
  try {
    // Convert empty string values to null.
    return _localizeCommandToButlerEnglish(cmd) || null;
  } catch (e) {
    return null;
  }
};

export const getLocalizationKeys = (
  cmd: Command,
): CommandLocalizationKeys | null => {
  try {
    return _getLocalizationKeysForCommand(cmd) || null;
  } catch (e) {
    if (e.name === 'LocalizationKeysError') {
      Analytics.sendOperationalEvent({
        actionSubject: 'butlerLocalization',
        actionSubjectId: 'getButlerLocalizationKeys',
        action: 'failed',
        source: '@atlassian/butler-command-parser',
        attributes: {
          elementType: e.elementType,
          unsupportedCase: e.unsupportedCase,
        },
      });
    }
    return null;
  }
};

export type MaybeArray<T> = T | T[];

export const normalizeArray = <T>(value: MaybeArray<T>): T[] =>
  Array.isArray(value) ? value : [value];
