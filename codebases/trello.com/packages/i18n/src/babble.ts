/* eslint-disable @typescript-eslint/no-use-before-define */
import { ReactNode } from 'react';
import { featureFlagClient } from '@trello/feature-flag-client';

export type JSONPrimitive = string | number | boolean;

export class StringNotFoundAtPathError extends Error {}

export interface Strings {
  [key: string]: string;
}

export interface StringSubstitutions {
  [key: string]: string;
}

export interface ReactSubstitutions {
  [key: string]: StringSubstitutions[keyof StringSubstitutions] | ReactNode;
}

export type AllSubstitutions = StringSubstitutions | ReactSubstitutions;
export type AllSubstitutionValues = AllSubstitutions[keyof AllSubstitutions];

class Hole {
  key: string;
  constructor(key: string) {
    this.key = key;
  }
}
class Literal {
  value: string;
  constructor(value: string) {
    this.value = value;
  }
}

export const lookupRebrandedString = (strings: Strings, keyPath: string[]) => {
  const isBCRebrandActive = featureFlagClient.get(
    'nusku.rename-bc-premium',
    false,
  );

  if (isBCRebrandActive) {
    const tryKeys = [];
    const prevKeyPath = keyPath.slice(0, -1);
    const lastKeyPath = keyPath[keyPath.length - 1];

    if (isBCRebrandActive) {
      // Given ['team onboarding', 'team members'], look up:
      // ['team onboarding', 'team members bc-rebrand']
      tryKeys.push(prevKeyPath.concat(`${lastKeyPath} bc-rebrand`));
    }

    for (const path of tryKeys) {
      const rebrandedValue = lookupKey(strings, path.join('.'));

      if (rebrandedValue && typeof rebrandedValue === 'string') {
        return rebrandedValue;
      }
    }
  }
};

const lookupString = (strings: Strings, keyPath: string[]) => {
  const rebrandedValue = lookupRebrandedString(strings, keyPath);
  return rebrandedValue || lookupKey(strings, keyPath.join('.'));
};

const lookupKey = (strings: Strings, key: string) => {
  const val = strings[key];
  if (val) {
    if (typeof val !== 'string') {
      throw new StringNotFoundAtPathError(`String not found by key ${key}`);
    }

    return val;
  }
};

const parseFormatString = (formatString: string) => {
  return formatString
    .split(/(\{[^{}]+\})/)
    .map(function (group) {
      if (group.length === 0) {
        return null;
      }
      if (group[0] === '{') {
        return new Hole(group.substr(1, group.length - 2));
      } else {
        return new Literal(group);
      }
    })
    .filter((a) => a);
};

export function normalizeKeyPath(path: string | string[]) {
  if (Array.isArray(path)) {
    return path.filter((a) => a);
  }

  return path.split('.');
}

export function lookup(strings: Strings, path: string | string[]) {
  const keyPath = normalizeKeyPath(path);
  const formatString = lookupString(strings, keyPath);

  if (formatString) {
    return parseFormatString(formatString);
  }
}

export function makeVisitor(
  onLiteral: (literal: Literal, substitutions?: AllSubstitutions) => string,
  onHole: (
    hole: Hole,
    substitutions?: AllSubstitutions,
    shouldEscapeStrings?: boolean,
    canOmitSubstitutions?: boolean,
  ) => AllSubstitutionValues,
) {
  return (
    holesAndLiterals: (Hole | Literal)[],
    substitutions?: AllSubstitutions,
    shouldEscapeStrings: boolean = true,
    canOmitSubstitutions: boolean = false,
  ) => {
    return holesAndLiterals.map((holeOrLiteral) => {
      if (holeOrLiteral instanceof Hole) {
        return onHole(
          holeOrLiteral,
          substitutions,
          shouldEscapeStrings,
          canOmitSubstitutions,
        );
      } else {
        return onLiteral(holeOrLiteral, substitutions);
      }
    });
  };
}

export function visit(
  strings: Strings,
  keyPath: string[],
  visitor: ReturnType<typeof makeVisitor>,
  substitutions?: AllSubstitutions,
  shouldEscapeStrings: boolean = true,
  canOmitSubstitutions: boolean = false,
) {
  const holesAndLiterals = lookup(strings, keyPath) as (Hole | Literal)[];
  if (holesAndLiterals) {
    return visitor(
      holesAndLiterals,
      substitutions,
      shouldEscapeStrings,
      canOmitSubstitutions,
    );
  }
}
