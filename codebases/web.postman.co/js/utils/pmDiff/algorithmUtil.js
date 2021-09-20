import * as diff from 'diff';

/**
 * Array returned by diff module can be multilevel based on type of input
 * separating it in to single level array
 *
 * @param {Array} diffArray - array returned by diff module by comparing two inputs
 * @returns {Array} - flattened array
 */
export function flattenDiff (diffArray) {
  if (!Array.isArray(diffArray)) {
    return [];
  }

  let flattenedDiff = [];

  diffArray.forEach((diff) => {
    let diffValues = [];

    if (typeof diff.value === 'string') {
      // This is the handler to remove inconsistency in last line added by npm diff module
      // since last line of any diff block is an empty line except the last diff block
      // so removing last line of any diff block
      diffValues = diff.value.split('\n');

      if (diffValues.length > 1 && diffValues[diffValues.length - 1] === '') {
        diffValues = diffValues.slice(0, -1);
      }
    }
    else if (Array.isArray(diff.value)) {
      diffValues = diff.value;
    }

    diffValues.forEach((value) => {
      flattenedDiff.push({
        added: diff.added,
        removed: diff.removed,
        value: value
      });
    });
  });

  return flattenedDiff;
}

/**
 * loop through array of lines and returns max index till the values of lines are not same
 *
 *
 * @param {Number} currIndex - index from which collection of changes needs to be started
 * @param {Array} baseLines - lines in base text
 * @param {Array} sourceLines - lines in source text
 * @param {Array} destLines - lines in destination text
 * @returns {Number} - max index till the all the values are different
 */
export function collectConflict (currIndex, baseLines, sourceLines, destLines) {
  while (currIndex < baseLines.length || currIndex < sourceLines.length || currIndex < destLines.length) {
    const sourceLine = sourceLines[currIndex],
      destLine = destLines[currIndex];

    if (sourceLine !== destLine) {
      currIndex++;
    }
    else {
      break;
    }
  }

  // if we reach end of any block then there is no point of finding diff for rest of two blocks
  // since that will always be conflict
  if (currIndex === baseLines.length || currIndex === sourceLines.length || currIndex === destLines.length) {
    currIndex = Math.max(baseLines.length, sourceLines.length, destLines.length);
  }

  return currIndex;
}

/**
 * loop through array of lines and returns max index till the values of base and source lines are not same
 * but values of source and dest or base and source are same
 *
 *
 * @param {Number} currIndex - index from which collection of changes needs to be started
 * @param {Array} baseLines - lines in base text
 * @param {Array} sourceLines - lines in source text
 * @param {Array} destLines - lines in destination text
 * @returns {Number} - max index till the all the values are different
 */
export function collectDiff (currIndex, baseLines, sourceLines, destLines) {
  while (currIndex < baseLines.length || currIndex < sourceLines.length || currIndex < destLines.length) {
    const baseLine = baseLines[currIndex],
      sourceLine = sourceLines[currIndex],
      destLine = destLines[currIndex];

    if (baseLine !== sourceLine && (sourceLine === destLine || destLine === baseLine)) {
      currIndex++;
    }
    else {
      break;
    }
  }

  return currIndex;
}

/**
 * This method uses two diff strategy of base with source and base with destination
 * generate three way diff for lines
 *
 * @param {String} base - base value of text
 * @param {String} source - source value of text
 * @param {String} dest- destination value of text
 * @returns {Object} object with array of objects containing three way diff between base, source and destination
 *                   along with number of active conflicts
 */
export function threeWaylineDiff (base = '', source = '', dest = '') {
  let index = 0,
    conflictedBlockIndex = 0,
    threeWayDiffArray = [],
    baseLines = base.split('\n'),
    sourceLines = source.split('\n'),
    destLines = dest.split('\n'),
    maxLength = Math.max(baseLines.length, sourceLines.length, destLines.length);

  while (index < maxLength) {
    const baseLine = baseLines[index],
      sourceLine = sourceLines[index],
      destLine = destLines[index];

    if (sourceLine !== destLine) {
      const indexTillCollectChanges = collectConflict(index, baseLines, sourceLines, destLines),
        baseChanges = baseLines.slice(index, indexTillCollectChanges).join('\n'),
        sourceChanges = sourceLines.slice(index, indexTillCollectChanges).join('\n'),
        destChanges = destLines.slice(index, indexTillCollectChanges).join('\n');

      threeWayDiffArray.push({
        conflict: true,
        type: 'source',
        index: conflictedBlockIndex,
        value: flattenDiff(diff.diffLines('', sourceChanges))
      });
      threeWayDiffArray.push({
        conflict: true,
        type: 'dest',
        index: conflictedBlockIndex,
        value: flattenDiff(diff.diffLines(baseChanges, ''))
      });

      index = index === indexTillCollectChanges ? index + 1 : indexTillCollectChanges;
      conflictedBlockIndex++;
    }
    else if (baseLine !== sourceLine) {
      const indexTillCollectChanges = collectDiff(index, baseLines, sourceLines, destLines),
        baseChanges = baseLines.slice(index, indexTillCollectChanges).join('\n'),
        sourceChanges = sourceLines.slice(index, indexTillCollectChanges).join('\n');

      threeWayDiffArray.push({
        value: flattenDiff(diff.diffLines(baseChanges, sourceChanges))
      });

      index = index === indexTillCollectChanges ? index + 1 : indexTillCollectChanges;
    }
    else {
      threeWayDiffArray.push({
        value: diff.diffLines(baseLine, baseLine)
      });

      index++;
    }
  }

  return { diff: threeWayDiffArray, numberOfConflicts: conflictedBlockIndex };
}

/**
 * Since parsed diff object does not assign line numbers to the lines of diff,
 * we are assigning lines at the front end
 * This method will mutate the lines in diff object
 *
 * @param {Object} diff - code diff parsed using pmDiff
 */
export function attachLines (diff) {
  if (!Array.isArray(diff)) {
    return;
  }

  var indexOfBaseRelativeSource = 0,
    indexOfBaseRelativeDest = 0,
    indexOfSource = 0,
    indexOfDest = 0;

  diff.forEach((codeblock) => {
    if (!codeblock) {
      return;
    }

    if (codeblock.conflict) {
      let lines = codeblock.value,
        conflictType = codeblock.type;

      lines.forEach((line) => {
        if (conflictType === 'source') {
          line.baseIndex = line.added ? ' ' : line.removed ? ++indexOfBaseRelativeSource : ++indexOfBaseRelativeSource;
          line.sourceIndex = line.added ? ++indexOfSource : line.removed ? ' ' : ++indexOfSource;
          line.destIndex = '';
        }
        else if (conflictType === 'dest') {
          line.baseIndex = line.added ? ' ' : line.removed ? ++indexOfBaseRelativeDest : ++indexOfBaseRelativeDest;
          line.destIndex = line.added ? ++indexOfDest : line.removed ? ' ' : ++indexOfDest;
          line.sourceIndex = '';
        }
      });
    }
    else if (Array.isArray(codeblock.value)) {
      let lines = codeblock.value;

      lines.forEach((line) => {
        line.baseIndex = line.added ? ' ' : line.removed ? ++indexOfBaseRelativeSource : ++indexOfBaseRelativeSource;
        line.sourceIndex = line.added ? ++indexOfSource : line.removed ? ' ' : ++indexOfSource;
        line.destIndex = '';

        // since we will be ignoring destination lines if there is no conflict between source and dest
        // so incrementing those along with source lines
        ++indexOfDest;
        ++indexOfBaseRelativeDest;
      });
    }
  });
}
