import Cue from 'bundles/interactive-transcript/models/Cue';
import { Highlight, TranscriptSelection } from 'bundles/video-highlighting/types';

export const findParentCueElement = (el: HTMLElement): HTMLElement | null => {
  // TODO: Test data-cue-index property to detect cue element or use ref forwarding (https://reactjs.org/docs/forwarding-refs.html)
  return el.matches('.rc-Phrase') ? el : el.closest('.rc-Phrase');
};

export const findCueElementWithIndex = (cueIndex: number): HTMLElement | null => {
  return document.querySelector(`[data-cue-index="${cueIndex}"]`);
};

export const findCueMarkWithIndex = (cueIndex: number): HTMLElement | null => {
  return document.querySelector(`[data-cue-index="${cueIndex}"] mark`);
};

export const getCueIndex = (cueElement: HTMLElement): number | null => {
  const cueIndex = cueElement.getAttribute('data-cue-index');

  if (cueIndex === undefined || cueIndex === null) {
    return null;
  }

  return parseInt(cueIndex, 10);
};

export const getCueIndexFromText = (textNode: Text | null) => {
  if (!textNode || !textNode.parentElement) {
    return null;
  }

  const cueElement = findParentCueElement(textNode.parentElement);
  if (!cueElement) {
    return null;
  }

  return getCueIndex(cueElement);
};

// recursively gathers up all the text nodes in order for a phrase. This function is O(n^2) for nodes in the tree which works while the tree remains small (currently on the order of 5 nodes), but will need to be refactored if the structure of Phrases becomes substantially more complex
// @ts-ignore ts-migrate(7024) FIXME: Function implicitly has return type 'any' because ... Remove this comment to see the full error message
export const getTextNodesFromPhrase = (el: Node) => {
  if (el.nodeName === '#text') {
    return [el];
  } else {
    return Array.from(el.childNodes).reduce(
      (acc: Array<Node>, node: Node) => [...acc, ...getTextNodesFromPhrase(node)],
      []
    );
  }
};

export const getHighlightsForCue = (cue: Cue, highlights: Array<Highlight>): Array<Highlight> => {
  return highlights.filter(
    (highlight) =>
      highlight.transcriptTextStartIndex &&
      highlight.transcriptTextEndIndex &&
      (highlight.transcriptTextStartIndex.cueIndex === cue.index ||
        highlight.transcriptTextEndIndex.cueIndex === cue.index ||
        (cue.index > highlight.transcriptTextStartIndex.cueIndex &&
          cue.index < highlight.transcriptTextEndIndex.cueIndex))
  );
};

export const getHighlightedTextIndicesForCue = (cue: Cue, highlight: Highlight): { start: number; end: number } => {
  if (!highlight.transcriptTextStartIndex || !highlight.transcriptTextEndIndex) {
    return { start: 0, end: 0 };
  }

  if (cue.index === highlight.transcriptTextStartIndex.cueIndex) {
    if (cue.index === highlight.transcriptTextEndIndex.cueIndex) {
      return {
        start: highlight.transcriptTextStartIndex.textIndex,
        end: highlight.transcriptTextEndIndex.textIndex + 1,
      };
    } else {
      return {
        start: highlight.transcriptTextStartIndex.textIndex,
        end: cue.text.length + 1,
      };
    }
  } else if (cue.index > highlight.transcriptTextStartIndex.cueIndex) {
    if (cue.index < highlight.transcriptTextEndIndex.cueIndex) {
      return {
        start: 0,
        end: cue.text.length + 1,
      };
    } else if (cue.index === highlight.transcriptTextEndIndex.cueIndex) {
      return {
        start: 0,
        end: highlight.transcriptTextEndIndex.textIndex + 1,
      };
    } else {
      return { start: 0, end: 0 };
    }
  }

  return { start: 0, end: 0 };
};

export const getHighlightForCueElement = (
  highlights: Array<Highlight>,
  cueElement: HTMLElement
): Highlight | null | undefined => {
  const cueIndex = getCueIndex(cueElement);
  if (cueIndex === null) {
    return null;
  }

  return highlights.find((highlight) => {
    const { transcriptTextStartIndex, transcriptTextEndIndex } = highlight;

    if (transcriptTextStartIndex && transcriptTextEndIndex) {
      return cueIndex >= transcriptTextStartIndex.cueIndex && cueIndex <= transcriptTextEndIndex.cueIndex;
    }

    return false;
  });
};

export const getIsCueIncludedInHighlight = (cue: Cue, highlight: Highlight) => {
  const { transcriptTextStartIndex, transcriptTextEndIndex } = highlight;

  if (!transcriptTextStartIndex || !transcriptTextEndIndex) {
    return false;
  }

  return cue.index >= transcriptTextStartIndex.cueIndex && cue.index <= transcriptTextEndIndex.cueIndex;
};

export const getTranscriptSelection = (): TranscriptSelection | undefined => {
  const selection = window.getSelection();
  if (!selection) {
    return undefined;
  }

  const selectedText = selection.toString();
  if (!selectedText) {
    return undefined;
  }

  const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;

  const focusCueIndex = getCueIndexFromText(focusNode as Text);
  const anchorCueIndex = getCueIndexFromText(anchorNode as Text);

  if (anchorCueIndex === null || focusCueIndex === null) {
    return undefined;
  }

  let transcriptTextStartIndex;
  let transcriptTextEndIndex;

  if (anchorCueIndex < focusCueIndex) {
    transcriptTextStartIndex = {
      cueIndex: anchorCueIndex,
      textIndex: anchorOffset,
    };

    transcriptTextEndIndex = {
      cueIndex: focusCueIndex,
      textIndex: focusOffset - 1,
    };
  } else if (anchorCueIndex === focusCueIndex) {
    transcriptTextStartIndex = {
      cueIndex: anchorCueIndex,
      textIndex: Math.min(anchorOffset, focusOffset),
    };

    transcriptTextEndIndex = {
      cueIndex: anchorCueIndex,
      textIndex: Math.max(anchorOffset, focusOffset) - 1,
    };
  } else {
    transcriptTextStartIndex = {
      cueIndex: focusCueIndex,
      textIndex: focusOffset,
    };

    transcriptTextEndIndex = {
      cueIndex: anchorCueIndex,
      textIndex: anchorOffset - 1,
    };
  }

  return { transcriptTextStartIndex, transcriptTextEndIndex };
};

export const mouseMovedInNeighborhoodOfHighlight = (
  event: MouseEvent,
  highlight: Highlight,
  highlighter: HTMLElement
) => {
  const { transcriptTextStartIndex, transcriptTextEndIndex } = highlight;
  if (!transcriptTextStartIndex || !transcriptTextEndIndex) {
    return false;
  }

  const startCueMark = findCueMarkWithIndex(transcriptTextStartIndex.cueIndex);
  const endCueMark = findCueMarkWithIndex(transcriptTextEndIndex.cueIndex);

  if (!startCueMark || !endCueMark) {
    return false;
  }

  const startCueBoundingRect = startCueMark.getBoundingClientRect();
  const endCueBoundingRect = endCueMark.getBoundingClientRect();
  const highlighterBoundingRect = highlighter.getBoundingClientRect();

  const left = highlighterBoundingRect.left + 50;
  const right = highlighterBoundingRect.right - 250;
  const top = Math.min(startCueBoundingRect.top, endCueBoundingRect.top) - 50;
  const bottom = Math.max(startCueBoundingRect.bottom, endCueBoundingRect.bottom);

  return event.clientX >= left && event.clientX <= right && event.clientY >= top && event.clientY <= bottom;
};

// traverse this level the DOM tree for a text node, recursing through each nodes children
const getClosestTextNodeInTree = (node: $TSFixMe, direction: $TSFixMe, originalNode = node) => {
  let testNode = node;
  // nodeType === 3 for text nodes
  while (testNode != null && (testNode.nodeType !== 3 || testNode === originalNode)) {
    const testNodeChildNodes = testNode.childNodes;
    const childNodeToTest =
      direction === 'left' ? testNodeChildNodes[testNodeChildNodes.length - 1] : testNodeChildNodes[0];
    const childTextNode =
      (testNode || {}).childNodes.length > 0 && getClosestTextNodeInTree(childNodeToTest, direction, originalNode);
    testNode = childTextNode || (direction === 'left' ? testNode.previousSibling : testNode.nextSibling);
  }
  return testNode;
};

// check this section of the tree and the descendants of the nearest meaningful sibling in a given direction for a text node
//
// example traversal:
//
// 1     2
// 5    3 4
// 6
// 6 is a text node, input node is 3, direction is left. 3 ->(parent) 2 ->(sibling) 1 -> 5(child) -> 6(child)
export const getAdjacentTextNode = (node: $TSFixMe, direction: $TSFixMe) => {
  const lastSiblingTextNode = getClosestTextNodeInTree(node, direction);
  if (lastSiblingTextNode) {
    return lastSiblingTextNode;
  } else {
    let nearestParentWithSibling = node.parentElement;
    while (direction === 'left' ? !nearestParentWithSibling.previousSibling : !nearestParentWithSibling.nextSibling) {
      nearestParentWithSibling = nearestParentWithSibling.parentElement;
    }
    const testSibling =
      direction === 'left' ? nearestParentWithSibling.previousSibling : nearestParentWithSibling.nextSibling;
    // if the new test sibling is already a textNode, return it, if not check down it's tree
    return testSibling?.nodeType === 3 ? testSibling : getClosestTextNodeInTree(testSibling, direction);
  }
};

// figure out the word boundaries in a text node (note: also includes an offset for when the next word would start)
export const getTextNodeWordStartingOffsets = (node: Node & { data: string }) => {
  const nodeContents = node.data;
  const nodeWords = nodeContents.split(' ');
  if (nodeWords.length === 1) {
    return [0];
  }

  return nodeWords.reduce(
    (startingOffsets, word, idx) => {
      return [...startingOffsets, startingOffsets[idx] + word.length + (idx !== nodeWords.length - 1 ? 1 : 0)];
    },
    [0]
  );
};

type ModifySelectionPayload = { magnitude: 'word' | 'phrase'; direction: 'left' | 'right' };

export const expandSelection = ({ direction, magnitude }: ModifySelectionPayload) => {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const range = selection.getRangeAt(0); // gets the first range, should be the only range since only firefox allows setting multiple ranges and we would have to use that explicitly

  const { startContainer, startOffset, endContainer, endOffset } = range;
  const targetContainer = direction === 'left' ? startContainer : endContainer;
  const targetOffset = direction === 'left' ? startOffset : endOffset;

  const offsetAtBoundary =
    direction === 'left'
      ? targetOffset === 0
      : targetOffset >= (targetContainer as Node & { length: number }).length - 1;
  // determine which text node will be added to our range
  const newContainer = offsetAtBoundary ? getAdjacentTextNode(targetContainer, direction) : targetContainer;

  if (!newContainer) {
    return;
  }

  if (magnitude === 'word') {
    const wordStartingOffsets = getTextNodeWordStartingOffsets(newContainer);
    if (direction === 'left') {
      // put the start offset at the start of the previous word
      const initialStartOffset = offsetAtBoundary ? newContainer.length - 1 : targetOffset;
      const newStartOffset =
        wordStartingOffsets.find((offset, idx) => {
          return initialStartOffset > offset && initialStartOffset <= wordStartingOffsets[idx + 1];
        }) || 0;
      range.setStart(newContainer, newStartOffset);
    } else {
      // put the end offset at the end of the next word
      const initialEndOffset = offsetAtBoundary ? 0 : targetOffset;
      const newEndOffset =
        wordStartingOffsets.find((offset, idx) => {
          return initialEndOffset >= wordStartingOffsets[idx - 1] && initialEndOffset < offset;
        }) || wordStartingOffsets[wordStartingOffsets.length - 1];
      range.setEnd(newContainer, newEndOffset);
    }
  } else if (magnitude === 'phrase') {
    if (direction === 'left') {
      // the offset is the beginning of the text node
      const newStartOffset = 0;
      range.setStart(newContainer, newStartOffset);
    } else {
      // the offset is at the end of the text node
      const newEndOffset = newContainer.length - 1;
      range.setEnd(newContainer, newEndOffset);
    }
  }
};

export const contractSelection = ({ direction, magnitude }: ModifySelectionPayload) => {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const range = selection.getRangeAt(0); // gets the first range, should be the only range since only firefox allows setting multiple ranges and we would have to use that explicitly

  const { startContainer, startOffset, endContainer, endOffset } = range;
  const targetContainer = direction === 'left' ? endContainer : startContainer;
  const targetOffset = direction === 'left' ? endOffset : startOffset;

  const offsetAtBoundary =
    direction === 'left'
      ? targetOffset === 0
      : targetOffset >= (targetContainer as Node & { length: number }).length - 1;
  // determine which text node will be added to our range
  const newContainer = offsetAtBoundary ? getAdjacentTextNode(targetContainer, direction) : targetContainer;

  if (!newContainer) {
    return;
  }

  if (magnitude === 'word') {
    const wordStartingOffsets = getTextNodeWordStartingOffsets(newContainer);
    if (direction === 'left') {
      // put the end offset at the end of the previous word
      const initialEndOffset = offsetAtBoundary ? newContainer.length - 1 : targetOffset;
      const newEndOffset =
        wordStartingOffsets.find((offset, idx) => {
          return initialEndOffset > offset && initialEndOffset <= wordStartingOffsets[idx + 1];
        }) || 0;
      range.setEnd(newContainer, newEndOffset);
    } else {
      // put the start offset at the end of the next word
      const initialStartOffset = offsetAtBoundary ? 0 : targetOffset;
      const newStartOffset =
        wordStartingOffsets.find((offset, idx) => {
          return initialStartOffset < offset && initialStartOffset >= wordStartingOffsets[idx - 1];
        }) || wordStartingOffsets[wordStartingOffsets.length - 1];
      range.setStart(newContainer, newStartOffset);
    }
  } else if (magnitude === 'phrase') {
    if (direction === 'left') {
      // the offset is at the end of the text node
      const newEndOffset = 0;
      range.setEnd(newContainer, newEndOffset);
    } else {
      // the offset is the beginning of the text node
      const newStartOffset = newContainer.length - 1;
      range.setStart(newContainer, newStartOffset);
    }
  }
};

export default {
  findParentCueElement,
  findCueElementWithIndex,
  findCueMarkWithIndex,
  getCueIndex,
  getCueIndexFromText,
  getHighlightsForCue,
  getHighlightedTextIndicesForCue,
  getHighlightForCueElement,
  getIsCueIncludedInHighlight,
  getTranscriptSelection,
  mouseMovedInNeighborhoodOfHighlight,
};
