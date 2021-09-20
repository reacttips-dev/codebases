import {
  makeFormat,
  AllSubstitutions,
  AllSubstitutionValues,
  ReactSubstitutions,
  StringSubstitutions,
} from '@trello/i18n';
import { getStrings } from './customActions';

export function formatCustomAction(
  keyPath: string | string[],
  substitutions?: StringSubstitutions,
): string;
export function formatCustomAction(
  keyPath: string | string[],
  substitutions: ReactSubstitutions,
): AllSubstitutionValues[];
export function formatCustomAction(
  keyPath: string | string[],
  substitutions: AllSubstitutions = {},
): string | AllSubstitutionValues[] {
  const format = makeFormat([], getStrings(), '/1/customActionTypes');
  return format(keyPath, substitutions);
}
