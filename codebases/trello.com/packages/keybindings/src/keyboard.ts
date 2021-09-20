import { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Key } from './types';

interface JQueryKeyboardEvent extends KeyboardEvent {
  originalEvent: KeyboardEvent;
}
type KeyEvent =
  | KeyboardEvent
  | ReactKeyboardEvent<HTMLElement>
  | JQueryKeyboardEvent;

/**
 * Create a Map of the Key enums along with normalized special
 * key identifiers we use in the app
 */
// eslint-disable-next-line @trello/no-module-logic
const KeyMap = new Map<string, Key>(Object.entries(Key))
  .set('0', Key.Zero) // Can't set numeric keys in TS enum
  .set('1', Key.One)
  .set('2', Key.Two)
  .set('3', Key.Three)
  .set('4', Key.Four)
  .set('5', Key.Five)
  .set('6', Key.Six)
  .set('7', Key.Seven)
  .set('8', Key.Eight)
  .set('9', Key.Nine)
  .set(' ', Key.Space)
  .set(',', Key.Comma)
  .set('.', Key.Period)
  .set('/', Key.ForwardSlash)
  .set(';', Key.SemiColon)
  .set('<', Key.AngleLeft)
  .set('>', Key.AngleRight)
  .set('?', Key.QuestionMark)
  .set('-', Key.Dash)
  .set('[', Key.OpenBracket)
  .set(']', Key.ClosedBracket);

/**
 * Russian:
 * Russian keyboards are (sometimes) created with the English QWERTY keys
 * labeled on them. Map the Russian chars on those keys to the English ones
 * so keyboard shortcuts work in their case. Hopefully not too confusing if
 * their keyboard does NOT have English keys printed on them. Trello has
 * supported this since 2014
 *
 * Chinese Wubi Xing:
 * These keyboards have English QWERTY capitals available when holding shift,
 * but the punctuation keys do not correctly map to the Latin versions. ie:
 * the key property returns `；` instead of `;` for semicolon. This maps
 * those to the English variants
 *
 * AZERTY Keyboards:
 * These should work just fine as long as they print Latin characters, so no
 * need for any special mappings.
 *
 * Other Non-Latin keyboard languages (Thai, Arabic, etc):
 * As of now, keyboard shortcuts for these are unsupported.
 */
const NonLatinAlphabetKeypressCodes = new Map<number, Key>([
  // Russian QWERTY keyboard key codes
  [1072, Key.f],
  [1073, Key.Comma],
  [1074, Key.d],
  [1075, Key.u],
  [1076, Key.l],
  [1077, Key.t],
  [1078, Key.SemiColon],
  [1079, Key.p],
  [1080, Key.b],
  [1081, Key.q],
  [1082, Key.r],
  [1083, Key.k],
  [1084, Key.v],
  [1085, Key.y],
  [1086, Key.j],
  [1087, Key.g],
  [1088, Key.h],
  [1089, Key.c],
  [1090, Key.n],
  [1091, Key.e],
  [1092, Key.a],
  [1094, Key.w],
  [1095, Key.x],
  [1096, Key.i],
  [1097, Key.o],
  [1099, Key.s],
  [1100, Key.m],
  [1102, Key.Period],
  [1103, Key.z],

  // Chinese Wubi Xing punctuation key codes
  [12290, Key.Period],
  [12298, Key.AngleLeft],
  [12299, Key.AngleRight],
  [65292, Key.Comma],
  [65307, Key.SemiColon],
  [65311, Key.QuestionMark],
]);

/**
 * Extract the Key enum from the provided keyboard event.
 * For IME's (Input Method Editor) keydown events are triggered with keyCode 229.
 * For the purposes of this function, we should not treat the `key` property of
 * that event as the character it reports as the user is still composing.
 * http://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
 */
export const getKey = (e: KeyEvent): string => {
  const event: KeyboardEvent =
    (e as ReactKeyboardEvent<HTMLElement>).nativeEvent ||
    (e as JQueryKeyboardEvent).originalEvent ||
    e;
  const keyCode: number = event.which || event.keyCode || 0;
  // @ts-ignore
  const isComposing: boolean = event.isComposing || keyCode === 229;
  let key: Key | undefined;

  switch (event.type) {
    case 'keydown':
      key = isComposing ? Key.Process : KeyMap.get(event.key);
      break;

    case 'keyup':
      key = KeyMap.get(event.key);
      break;

    case 'keypress':
      key = KeyMap.get(event.key) || NonLatinAlphabetKeypressCodes.get(keyCode);
      break;

    default:
      key = Key.Unknown;
  }

  return key || Key.Unknown;
};

/**
 * Is the keyboard event a submit event (did the user hit enter)
 */
export const isSubmitEvent = (e: KeyEvent): boolean => {
  const key = getKey(e);

  return key === Key.Enter || key === Key.LineFeed;
};

/**
 * Is the keyboard event a force-submit event (did the user hit enter while holding Cmd/Ctrl/Alt)
 */
export const isForceSubmitEvent = (e: KeyEvent): boolean =>
  isSubmitEvent(e) && (e.ctrlKey || e.metaKey) && !e.shiftKey;

/**
 * Is the provided key one of the arrow keys
 */
export const isArrow = (key: string) =>
  key === Key.ArrowDown ||
  key === Key.ArrowUp ||
  key === Key.ArrowLeft ||
  key === Key.ArrowRight;
