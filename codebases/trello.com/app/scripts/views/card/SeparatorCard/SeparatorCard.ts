import cx from 'classnames';
import styles from './SeparatorCard.less';
import { Analytics } from '@trello/atlassian-analytics';

type SeparatorCharacter =
  | '-'
  | '_'
  | '='
  | '*'
  | '#'
  | '/'
  | '\\'
  | '<'
  | '>'
  | '.';

const separatorCharacters: SeparatorCharacter[] = [
  '-',
  '_',
  '=',
  '*',
  '#',
  '/',
  '\\',
  '<',
  '>',
  '.',
];

const separatorCharactersSet = new Set<string>(separatorCharacters);

function isSeparatorCharacter(
  character: string,
): character is SeparatorCharacter {
  return separatorCharactersSet.has(character);
}

export enum SeparatorType {
  // example `----`
  SeparatorOnly = 'separator only',

  // example `=== title ===`
  SeparatorTitle = 'separator with title',

  // example `##### title`
  SeparatorStartTitle = 'starting separator with title',

  // example `title ******`
  SeparatorEndTitle = 'ending separator with title',
}

export enum SeparatorNumCharacters {
  // example `--- title ---`
  ThreeOrMore = 'three or more',

  // example `## title ##`
  TwoOrFewer = 'two or fewer',
}

interface Separator {
  character: SeparatorCharacter;
  type: SeparatorType;
  numCharacters: SeparatorNumCharacters;
}

function getSeparatorType(
  cardName: string,
  character: SeparatorCharacter,
): Separator | null {
  const startsWith = cardName.startsWith(character);
  const endsWith = cardName.endsWith(character);
  const startsWithThree = cardName.startsWith(character.repeat(3));
  const endsWithThree = cardName.endsWith(character.repeat(3));
  const allSameCharacter = /^(.)\1*$/.test(cardName);

  switch (true) {
    case startsWith && allSameCharacter:
      return {
        character,
        type: SeparatorType.SeparatorOnly,
        numCharacters: startsWithThree
          ? SeparatorNumCharacters.ThreeOrMore
          : SeparatorNumCharacters.TwoOrFewer,
      };
    case startsWith && endsWith:
      return {
        character,
        type: SeparatorType.SeparatorTitle,
        numCharacters:
          startsWithThree && endsWithThree
            ? SeparatorNumCharacters.ThreeOrMore
            : SeparatorNumCharacters.TwoOrFewer,
      };
    case startsWith:
      return {
        character,
        type: SeparatorType.SeparatorStartTitle,
        numCharacters: startsWithThree
          ? SeparatorNumCharacters.ThreeOrMore
          : SeparatorNumCharacters.TwoOrFewer,
      };
    case endsWith:
      return {
        character,
        type: SeparatorType.SeparatorEndTitle,
        numCharacters: endsWithThree
          ? SeparatorNumCharacters.ThreeOrMore
          : SeparatorNumCharacters.TwoOrFewer,
      };
    default:
      return null;
  }
}

/**
 * Checks if `cardName` is a title that should be rendered as a separator card,
 * instead of rendering its title as text. For example, `cardName = '---'` will
 * return
 * {
 *   character: '-'
 *   type: SeparatorType.SeparatorOnly
 *   numCharacters: SeparatorNumCharacters.ThreeOrMore
 * }
 * We're currently only rendering ---, but tracking analytics on more options.
 * Remove this code once we've collected enough analytics data.
 */
export function getSeparator(
  cardName: string,
): {
  character: SeparatorCharacter;
  type: SeparatorType;
  numCharacters: SeparatorNumCharacters;
} | null {
  if (!cardName) {
    return null;
  }

  // If the name contains all dashes and emdashes, replace emdashs (—) with --
  // (this undoes something a user's OS might automatically do, converting a --
  // to an emdash)
  const normalized = /^[-—]+$/.test(cardName)
    ? cardName.replace(/—/g, '--')
    : cardName;
  const firstCharacter = normalized.charAt(0);
  const lastCharacter = normalized.charAt(normalized.length - 1);
  let firstSeparator = null;
  let lastSeparator = null;

  if (isSeparatorCharacter(firstCharacter)) {
    firstSeparator = getSeparatorType(normalized, firstCharacter);
  }

  if (isSeparatorCharacter(lastCharacter)) {
    lastSeparator = getSeparatorType(normalized, lastCharacter);
  }

  return firstSeparator || lastSeparator;
}

/**
 * Send analytics events for titles that look like separators. We may
 * support rendering some of these in the future, but need data first
 * to verify if users use the titles.
 */
export function trackSeparator(cardName: string): void {
  const separator = getSeparator(cardName);

  if (!separator || !isSeparatorCharacter(separator.character)) {
    return;
  }

  const {
    type,
    character,
    numCharacters,
  }: {
    type: SeparatorType;
    character: SeparatorCharacter;
    numCharacters: SeparatorNumCharacters;
  } = separator;

  Analytics.sendTrackEvent({
    action: 'updated',
    actionSubject: 'name',
    source: 'inlineCardComposerInlineDialog',
    attributes: {
      updatedOn: 'card',
      isSeparator: true,
      numCharacters,
      character,
      type,
    },
  });
}

/**
 * For cards titled `----`, return a css classname that should be
 * rendered instead of the card's actual title.
 */
export function getSeparatorClassName(cardName: string): string | null {
  const separator = getSeparator(cardName);

  if (!separator) {
    return null;
  }

  const { type, character, numCharacters } = separator;

  if (
    type === SeparatorType.SeparatorOnly &&
    numCharacters === SeparatorNumCharacters.ThreeOrMore
  ) {
    if (character === '-' || character === '_') {
      // We only support `----` and `___` card titles at the moment.
      return cx(styles.separatorCard, styles.singleHorizontalLine);
    }
  }

  // Other types not yet supported, waiting on analytics data to decide
  // if we want to implement them.
  return null;
}
