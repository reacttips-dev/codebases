import { StringSubstitutions } from '@trello/i18n';

export class LocalizeButlerCommandError extends Error {
  keyPath: string;
  substitutions?: StringSubstitutions;

  constructor(keyPath: string, substitutions?: StringSubstitutions) {
    super(`Unable to localize key: ${keyPath}`);
    this.name = 'LocalizeButlerCommandError';
    this.keyPath = keyPath;
    this.substitutions = substitutions;
  }
}
