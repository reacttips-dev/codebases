import { safe } from '@trello/strings';
import React, { ReactNode } from 'react';
import {
  AllSubstitutions,
  AllSubstitutionValues,
  makeVisitor,
  Strings,
  ReactSubstitutions,
  StringNotFoundAtPathError,
  StringSubstitutions,
  visit,
} from './babble';

function isReactSubstitutions(
  substitutions?: AllSubstitutions,
): substitutions is ReactSubstitutions {
  return (
    !!substitutions &&
    Object.keys(substitutions).some((key) =>
      React.isValidElement(substitutions[key]),
    )
  );
}

class SubstitutionNotFound extends Error {}

// eslint-disable-next-line @trello/no-module-logic
const visitor = makeVisitor(
  (literal) => literal.value,
  (hole, substitutions, shouldEscapeStrings, canOmitSubstitutions) => {
    const key = hole.key;
    if (
      !canOmitSubstitutions &&
      (!substitutions ||
        !Object.prototype.hasOwnProperty.call(substitutions, key))
    ) {
      throw new SubstitutionNotFound(
        `Tried to substitute ${key} but it wasn't provided`,
      );
    }
    const value = (substitutions?.[key] ?? '') as string | ReactNode;

    if (typeof value === 'string' && shouldEscapeStrings) {
      return safe(value);
    } else {
      return value;
    }
  },
);

export function makeFormat(
  namespace: string[] = [],
  strings: Strings,
  fileName: string,
  shouldEscapeStrings: boolean = true,
  returnBlankForMissingStrings: boolean = false,
  canOmitSubstitutions: boolean = false,
) {
  function format(
    keyPath: string | string[],
    substitutions?: StringSubstitutions,
  ): string;
  function format(
    keyPath: string | string[],
    substitutions: ReactSubstitutions,
  ): AllSubstitutionValues[];
  function format(
    keyPath: string | string[],
    substitutions?: AllSubstitutions,
  ): string | AllSubstitutionValues[] {
    const path = Array.isArray(keyPath)
      ? [...namespace, ...keyPath]
      : [...namespace, keyPath];

    try {
      const visited = visit(
        strings,
        path,
        visitor,
        substitutions,
        shouldEscapeStrings,
        canOmitSubstitutions,
      );
      if (isReactSubstitutions(substitutions)) {
        return Array.isArray(visited) ? visited : [];
      } else {
        return Array.isArray(visited) ? visited.join('') : '';
      }
    } catch (e) {
      const printablePath = safe(path.join('.'));
      if (e instanceof StringNotFoundAtPathError) {
        if (returnBlankForMissingStrings) {
          return '';
        }
        console.error(
          `Unable to find localized string at path: ${printablePath}, check ${fileName}`,
        );
      } else if (e instanceof SubstitutionNotFound) {
        console.error(
          `Substitution missing when building localized string at path ${printablePath}, ${e.message}`,
        );
      } else {
        console.error(
          `Unknown error thrown while attempting to localize string: ${e}`,
        );
      }

      return [printablePath];
    }
  }

  return format;
}
