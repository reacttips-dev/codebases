/* eslint-disable @typescript-eslint/no-use-before-define */
import { featureFlagClient } from '@trello/feature-flag-client';

interface TextState {
  text: string;
  selection: string;
  selectionStart: number;
  selectionEnd: number;
}

const insertText = (text: string, element: HTMLInputElement): void => {
  if (text === '') {
    if (!document.execCommand('delete', false)) {
      element.setRangeText(text);
    }
  } else {
    if (!document.execCommand('insertText', false, text)) {
      element.setRangeText(text);
    }
  }
};

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

/**
 * Issues commands to wrap or unwrap the selection with specified markdown. By
 * doing `execCommand` we preserve the undo stack (expect in Firefox).
 */
const transformSelection = (
  element: HTMLInputElement,
  prefix: { test: RegExp; insert: string },
  suffix?: { test: RegExp; insert: string },
  link?: boolean,
) => {
  if (!suffix) suffix = prefix;

  const initialState = textStateFromElement(element);

  if (initialState.selection === '') {
    const prefixAtEnd = new RegExp('(' + prefix.test.source + ')$');
    const suffixAtStart = new RegExp('^(' + suffix.test.source + ')');

    const initialPrefixMatch = initialState.text
      .substring(0, initialState.selectionStart)
      .match(prefixAtEnd);
    const initialSuffixMatch = initialState.text
      .substring(initialState.selectionEnd)
      .match(suffixAtStart);

    if (!initialPrefixMatch && initialSuffixMatch) {
      // Jump-out behavior
      const newCursorPos =
        initialState.selectionEnd + initialSuffixMatch[0].length;
      element.setSelectionRange(newCursorPos, newCursorPos);
      return;
    }
  }

  const prefixAtStart = new RegExp('^(' + prefix.test.source + ')');
  const suffixAtEnd = new RegExp('(' + suffix.test.source + ')$');

  // Adjust selection to wrap the current word, if necessary.
  selectWholeWord(element, initialState, link);

  const state = textStateFromElement(element);

  const prefixMatch = state.selection.match(prefixAtStart);
  const suffixMatch = state.selection.match(suffixAtEnd);

  const prefixLength = state.selection.match(prefixAtStart)?.[0].length || 0;
  const suffixLength = state.selection.match(suffixAtEnd)?.[0].length || 0;

  if (
    prefixMatch &&
    suffixMatch &&
    state.selectionEnd - suffixLength !== state.selectionStart &&
    state.selectionStart + prefixLength !== state.selectionEnd
  ) {
    // Un-wrap the selected text.
    element.setSelectionRange(state.selectionStart, state.selectionEnd);
    insertText(
      state.selection.substring(
        prefixLength,
        state.selection.length - suffixLength,
      ),
      element,
    );

    const unwrappedWordLength =
      state.selection.length - suffixLength - prefixLength;

    // The min and max bounds for the resulting unwrapped word, which we should
    // clamp the selection to.
    const minSelection = state.selectionStart;
    const maxSelection = state.selectionStart + unwrappedWordLength;

    // Essentially make the selection look like how it did before unwrapping.
    if (initialState.selection === '') {
      element.setSelectionRange(
        clamp(
          initialState.selectionStart - prefixLength,
          minSelection,
          maxSelection,
        ),
        clamp(
          initialState.selectionEnd - prefixLength,
          minSelection,
          maxSelection,
        ),
      );
    } else {
      element.setSelectionRange(
        state.selectionStart,
        state.selectionEnd - prefixLength - suffixLength,
      );
    }
  } else {
    // Wrap the selected text.
    element.setSelectionRange(state.selectionStart, state.selectionEnd);
    insertText(`${prefix.insert}${state.selection}${suffix.insert}`, element);
    if (state.selection === '') {
      // If the selection is empty, stick the cursor in the middle of the new
      // delimiters instead of including them in the new selection.
      element.setSelectionRange(
        state.selectionStart + prefix.insert.length,
        state.selectionStart + prefix.insert.length,
      );
    } else if (initialState.selection === '') {
      element.setSelectionRange(
        initialState.selectionStart + prefix.insert.length,
        initialState.selectionStart + prefix.insert.length,
      );
    } else {
      // If the selection isn't empty, make the new selection include the new
      // delimiters.
      element.setSelectionRange(
        state.selectionStart,
        state.selectionEnd + prefix.insert.length + suffix.insert.length,
      );
    }
  }
};

/**
 * Adds or removes a prefix on every line of the selection, excluding empty lines.
 */
const transformByLine = (
  prefix: { test: RegExp; insert: (index: number) => string },
  element: HTMLInputElement,
) => {
  const initialState = textStateFromElement(element);
  if (initialState.selection.endsWith('\n')) {
    element.setSelectionRange(
      initialState.selectionStart,
      initialState.selectionEnd - 1,
    );
  }

  const {
    selection,
    selectionStart,
    selectionEnd,
    text,
  } = textStateFromElement(element);

  const extractPrefix = (s: string) => s.match(prefix.test)?.[0];

  // Find the start and end of all lines that are within the selection.
  const newlineBefore = text.lastIndexOf('\n', selectionStart - 1);
  const newlineAfter = text.indexOf('\n', selectionEnd);

  const start = newlineBefore !== -1 ? newlineBefore + 1 : 0;
  const end = newlineAfter !== -1 ? newlineAfter : text.length;

  const linesText = text.substring(start, end);
  const selectedLines = linesText.split('\n');

  if (
    selection === '' &&
    (selectionStart === 0 || text.charAt(selectionStart - 1) === '\n')
  ) {
    const text = prefix.insert(0);
    insertText(text, element);
    element.setSelectionRange(
      selectionStart + text.length,
      selectionStart + text.length,
    );
  } else if (
    selectedLines.every(
      (line) => line.trim() === '' || extractPrefix(line) !== undefined,
    )
  ) {
    const newLinesText = selectedLines
      .map((line) => {
        const matchingPrefix = extractPrefix(line);

        if (matchingPrefix) {
          return line.substring(matchingPrefix.length);
        } else {
          return line;
        }
      })
      .join('\n');

    const charDiff = newLinesText.length - linesText.length;

    element.setSelectionRange(start, end);
    insertText(newLinesText, element);
    element.setSelectionRange(start, end + charDiff);
  } else {
    let lineIndex = 0;
    const newLinesText = selectedLines
      .map((line) => {
        if (line.trim() === '') {
          return line;
        }

        const lineMatch = line.match(prefix.test)?.[0];
        if (lineMatch) {
          line = line.substring(lineMatch.length);
        }
        const numPrefix = prefix.insert(lineIndex);
        lineIndex++;
        return `${numPrefix}${line}`;
      })
      .join('\n');

    const charDiff = newLinesText.length - linesText.length;

    element.setSelectionRange(start, end);
    insertText(newLinesText, element);
    element.setSelectionRange(start, end + charDiff);
  }
};

const urlRegex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const shortcuts: {
  [combo: string]: (element: HTMLInputElement, disable?: boolean) => void;
} = {
  'ctrl b': (element) => {
    transformSelection(element, { test: /\*\*/, insert: '**' });
  },
  'ctrl i': (element) => {
    transformSelection(element, { test: /_/, insert: '_' });
  },
  'ctrl k': (element) => {
    let state = textStateFromElement(element);
    selectWholeWord(element, state, true);
    state = textStateFromElement(element);
    if (urlRegex.test(state.selection)) {
      transformSelection(
        element,
        { test: /\[\]\(/, insert: '[](' },
        { test: /\)/, insert: ')' },
        true,
      );
    } else {
      transformSelection(
        element,
        { test: /\[/, insert: '[' },
        { test: /\]\(\S*\)/, insert: ']()' },
        true,
      );
    }
  },
  'ctrl l': (element) => {
    let state = textStateFromElement(element);
    selectWholeWord(element, state, true);
    state = textStateFromElement(element);
    if (urlRegex.test(state.selection)) {
      transformSelection(
        element,
        { test: /!\[\]\(/, insert: '![](' },
        { test: /\)/, insert: ')' },
        true,
      );
    } else {
      transformSelection(
        element,
        { test: /!\[/, insert: '![' },
        { test: /\]\(\S*\)/, insert: ']()' },
        true,
      );
    }
  },
  'ctrl shift s': (element) => {
    transformSelection(element, { test: /~~/, insert: '~~' });
  },
  'ctrl shift m': (element, disable = false) => {
    const state = textStateFromElement(element);

    // If the trimmed selection includes a newline... and then also making sure
    // the selection isn't already a single-line-formatted code entry.
    const useBlock =
      !disable &&
      state.selection.trim().includes('\n') &&
      (((state.selection.charAt(0) !== '`' ||
        state.selection.startsWith('```')) &&
        state.selection.charAt(state.selection.length - 1) !== '`') ||
        state.selection.endsWith('```') ||
        state.selection === '``');

    if (useBlock) {
      transformSelection(
        element,
        { test: /```\n/, insert: '```\n' },
        { test: /\n```/, insert: '\n```' },
      );
    } else {
      transformSelection(element, { test: /`/, insert: '`' });
    }
  },
  'ctrl alt 1': (element, disable = false) => {
    !disable && transformByLine({ test: /^#/, insert: () => '#' }, element);
  },
  'ctrl alt 2': (element, disable = false) => {
    !disable && transformByLine({ test: /^##/, insert: () => '##' }, element);
  },
  'ctrl alt 3': (element, disable = false) => {
    !disable && transformByLine({ test: /^###/, insert: () => '###' }, element);
  },
  'ctrl shift 8': (element, disable = false) => {
    !disable &&
      transformByLine({ test: /^[-*+] /, insert: () => '- ' }, element);
  },
  'ctrl shift 7': (element, disable = false) => {
    !disable &&
      transformByLine(
        { test: /^[0-9]+. /, insert: (index) => `${index + 1}. ` },
        element,
      );
  },
};

/**
 * If the selection is part of a single word, set the selection on the element
 * to contain the whole word. Otherwise do nothing.
 */
const selectWholeWord = (
  element: HTMLInputElement,
  initialState: TextState,
  link?: boolean,
) => {
  // For link-related MD, the "whole word" might include URL characters.
  const breakRegex = link ? /[^\s]+/ : /[^\s\\/!?.,;|<>{}\-+=&'"]+/;

  if (breakRegex.test(initialState.selection)) return;

  let start = initialState.selectionStart;
  let end = initialState.selectionEnd;

  while (start > 0 && breakRegex.test(initialState.text.charAt(start - 1))) {
    start--;
  }
  while (
    end < initialState.text.length &&
    breakRegex.test(initialState.text.charAt(end))
  ) {
    end++;
  }

  element.setSelectionRange(start, end);
};

/**
 * Gets info about the selection in the input element.
 */
const textStateFromElement = (element: HTMLInputElement): TextState => {
  const selectionStart = element.selectionStart || 0;
  const selectionEnd = element.selectionEnd || 0;

  const textRaw = element.value;
  const text = typeof textRaw === 'string' ? textRaw : '';

  return {
    text,
    selection: text.substring(selectionStart, selectionEnd),
    selectionStart,
    selectionEnd,
  };
};

/**
 * Takes in a `KeyboardEvent` on an input element and manipulates that element
 * to apply markdown formatting when the event is triggered.
 * @param event The target of this must be castable to `HTMLInputElement`.
 */
const applyMarkdownShortcuts = (
  event: KeyboardEvent & {
    target: HTMLInputElement | null;
    originalEvent: { key: string };
  },
  disableMultiline = false,
) => {
  if (!featureFlagClient.get('remarkable.markdown-hotkeys', false)) {
    return;
  }

  const modifierKey = navigator.userAgent.match(/Macintosh/)
    ? 'Meta'
    : 'Control';

  // Meta on Mac, control otherwise.
  const modKey =
    (event.metaKey && modifierKey === 'Meta') ||
    (event.ctrlKey && modifierKey === 'Control');
  const ctrl = modKey ? 'ctrl ' : '';
  const shift = event.shiftKey ? 'shift ' : '';
  const alt = event.altKey ? 'alt ' : '';

  let pressedKey = event.originalEvent.key;
  // Alt+1/2/3 on Mac outputs symbols for `key`.
  if (modifierKey) {
    if (pressedKey === '¡') pressedKey = '1';
    if (pressedKey === '™') pressedKey = '2';
    if (pressedKey === '£') pressedKey = '3';
  }
  const pressedCombo = `${ctrl}${alt}${shift}${pressedKey}`;

  const matchingCombo = Object.entries(shortcuts).find(
    ([combo]) => combo === pressedCombo,
  );
  if (matchingCombo) {
    const [, transform] = matchingCombo;
    event.preventDefault();
    if (event.target === null) return;
    transform(event.target, disableMultiline);
  }
};

export { applyMarkdownShortcuts };
