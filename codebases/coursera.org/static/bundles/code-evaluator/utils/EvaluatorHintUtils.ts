const EvaluatorHintUtils = {
  initHints(evaluation: $TSFixMe) {
    const evaluationHints = (evaluation && evaluation.response && evaluation.response.hints) || [];
    const hints = evaluationHints
      .filter((hint: $TSFixMe) => hint.text !== undefined && hint.text.length > 0)
      .map((hint: $TSFixMe) => ({
        show: false,
        ...hint,
      }));
    return hints;
  },

  updateHints(hints: $TSFixMe, aceEditor: $TSFixMe, changeDelta: $TSFixMe) {
    const inserting = changeDelta.action === 'insert';
    const removing = changeDelta.action === 'remove';

    // Short-circuit if both conditions false
    if (!inserting && !removing) {
      return hints;
    }
    // Update hint locations, remove modified ones based on changeDelta
    const changeStartPosition = aceEditor.posToDocIndex(changeDelta.start);
    const changeEndPosition = aceEditor.posToDocIndex(changeDelta.end);
    const deltaLength = (inserting ? 1 : -1) * (changeEndPosition - changeStartPosition);

    const newHints = hints
      .filter(
        (
          hint: $TSFixMe // Hint starts after the change [insert condition]
        ) =>
          (inserting && hint.startPosition > changeStartPosition) ||
          // Hint starts after the change [remove condition]
          (removing && hint.startPosition >= changeEndPosition) ||
          // Hint ends before the change [both conditions]
          hint.endPosition < changeStartPosition
      )
      .map((hint: $TSFixMe) => {
        // Shift hints that come after the change so that the highlighting
        // remains correct
        if (hint.endPosition < changeStartPosition) {
          return hint;
        } else {
          return {
            ...hint,
            startPosition: hint.startPosition + deltaLength,
            endPosition: hint.endPosition + deltaLength,
          };
        }
      });
    return newHints;
  },
  /**
   * returns updated ECB hints to be rendered in monaco editor
   * (use the soon to be deprecated updateHints method for rendering hints in Ace editor )
   *
   * @param {[hint]} hints
   * @param {monaco.editor.IStandaloneCodeEditor} monacoEditor
   * @param {monaco.editor.IModelContentChangedEvent} event
   * @returns {[hint]} array of hints
   */
  getUpdatedHints(hints: $TSFixMe, changeStartPosition: $TSFixMe, changeDelta: $TSFixMe) {
    const { currentChange, isFlush } = changeDelta;
    // remove all hints if the code editor has been reset to a new value.
    if (isFlush) {
      return [];
    }

    const changeLength = currentChange.text.length;
    const { rangeLength } = currentChange;
    const inserting = changeLength > 0;
    const removing = changeLength === 0;

    // // Short-circuit if both conditions false
    if (!inserting && !removing) {
      return hints;
    }
    const changeEndPosition = removing ? changeStartPosition + rangeLength : changeStartPosition + changeLength;
    // Update hint locations, remove modified ones based on changeDelta
    const deltaLength = (inserting ? 1 : -1) * (changeEndPosition - changeStartPosition);
    const newHints = hints
      .filter(
        (
          hint: $TSFixMe // Hint starts after the change [insert condition]
        ) =>
          (inserting && hint.startPosition > changeStartPosition) ||
          // Hint starts after the change [remove condition]
          (removing && hint.startPosition >= changeEndPosition) ||
          // Hint ends before the change [both conditions]
          hint.endPosition < changeStartPosition
      )
      .map((hint: $TSFixMe) => {
        // Shift hints that come after the change so that the highlighting remains correct
        if (hint.endPosition < changeStartPosition) {
          return hint;
        } else {
          return {
            ...hint,
            startPosition: hint.startPosition + deltaLength,
            endPosition: hint.endPosition + deltaLength,
          };
        }
      });
    return newHints;
  },
};

export default EvaluatorHintUtils;

export const { initHints, updateHints } = EvaluatorHintUtils;
