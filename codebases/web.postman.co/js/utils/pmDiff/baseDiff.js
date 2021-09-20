import _ from 'lodash';
import * as diff from 'diff';

import { flattenDiff, threeWaylineDiff, attachLines } from './algorithmUtil';

/**
 * Common function to whitelist all the properties from object for which table diff is required
 *
 * @param {Object} obj
 */
function parseTableObj (obj) {
  return {
    enabled: typeof _.get(obj, 'enabled') === 'boolean' ? obj.enabled : true,
    key: typeof _.get(obj, 'key') === 'string' ? obj.key : '',
    value: typeof _.get(obj, 'value') === 'string' ? obj.value : '',
    description: typeof _.get(obj, 'description') === 'string' ? obj.description : ''
  };
}

/**
 * class exposing methods to get diff or conflict between types of table, code, string or sentences
 *
 * @property {String} type - type of diff, for ex - table, code, string, sentence
 * @property {Boolean} conflict - boolean indicating if there is a conflict or not
 * @property {String|Array} base - base value of item
 * @property {String|Array} source - source value of item
 * @property {String|Array} dest - destination value of item
 */
export default class BaseDiff {
  constructor (diff, type) {
    const defautValue = type === 'table' ? [] : '';

    this.type = type;

    if (diff.conflict) {
      this.conflict = true;
      this.numberOfConflicts = 0;

      // no need to handle the case for adding of an item
      // since adding an item cannot cause conflict
      this.base = _.get(diff, ['conflict', 'base', 'value']) || defautValue;
      this.source = _.get(diff, ['conflict', 'source', 'value']) || defautValue;
      this.dest = _.get(diff, ['conflict', 'dest', 'value']) || defautValue;
    }
    else if (diff.diff) {
      this.conflict = false;

      if (_.get(diff, 'diff.from') || _.get(diff, 'diff.to')) {
        // if diff is created due to update action then both source and base value will be available
        this.base = _.get(diff, ['diff', 'from']) || defautValue;
        this.source = _.get(diff, ['diff', 'to']) || defautValue;
      }
      else {
        // if diff is created due to add action then only source value will be avaialble
        this.base = defautValue;
        this.source = _.get(diff, 'diff', defautValue);
      }
    }
  }

  /**
   * Uses npm diff module to generate an array of diff between given source and destination
   */
  getStringDiff () {
    if (this.base && typeof this.base !== 'string' || this.source && typeof this.source !== 'string') {
      return { diff: [] };
    }

    return [
      { conflict: true, diff: diff.diffWordsWithSpace(this.source || '', ''), type: 'source' },
      { conflict: true, diff: diff.diffWordsWithSpace('', this.base || ''), type: 'dest' }
    ];
  }

  /**
   * Compares index by index to all key value pair in array and generates diff between base and source
   * as well as base and destination values returns as array of conflict
   */
  getStringConflict () {
    if (this.base && typeof this.base !== 'string' || this.source && typeof this.source !== 'string' ||
      this.dest && typeof this.dest !== 'string') {
      return { diff: [] };
    }

    if (this.dest === this.source) {
      return this.getStringDiff(this.base, this.source);
    }

    this.numberOfConflicts = 1;

    const base = this.base || ' ',
      source = this.source || ' ',
      dest = this.dest || ' ',
      baseToSourceDiff = diff.diffWordsWithSpace(base, source),
      baseToDestDiff = diff.diffWordsWithSpace(base, dest);

    return [
      { conflict: true, diff: baseToSourceDiff, type: 'source' },
      { conflict: true, diff: baseToDestDiff, type: 'dest' }
    ];
  }

  /**
   * Compares index by index to all key value pair in array and generates diff of words
   * using npm diff module
   */
  getTableDiff () {
    const base = this.base || [],
      source = this.source || [];

    if (!Array.isArray(base) || !Array.isArray(source)) {
      return [];
    }

    let index = 0,
      diffArray = [],
      sourceObj,
      baseObj;

    while (index < base.length || index < source.length) {
      baseObj = parseTableObj(base[index]);
      sourceObj = parseTableObj(source[index]);

      diffArray.push({
        index: index,
        conflict: true,
        type: 'source',
        value: {
          enabled: sourceObj.enabled,
          key: diff.diffWords(sourceObj.key, ''),
          value: diff.diffWords(sourceObj.value, ''),
          description: diff.diffWords(sourceObj.description, '')
        }
      });

      diffArray.push({
        index: index,
        conflict: true,
        type: 'dest',
        value: {
          enabled: baseObj.enabled,
          key: diff.diffWords('', baseObj.key),
          value: diff.diffWords('', baseObj.value),
          description: diff.diffWords('', baseObj.description)
        }
      });

      index++;
    }

    return diffArray;
  }

  /**
   * Compares index by index to all key value pair in array and generates diff of words
   * using npm diff module
   */
  getTableConflict () {
    const base = this.base || [],
      source = this.source || [],
      dest = this.dest || [];

    if (!Array.isArray(base) || !Array.isArray(source) || !Array.isArray(dest)) {
      return [];
    }

    let index = 0,
      diffArray = [],
      conflictedRows = 0,
      sourceObj,
      baseObj,
      destObj;

    while (index < base.length || index < source.length || index < dest.length) {
      baseObj = parseTableObj(base[index]);
      sourceObj = parseTableObj(source[index]);
      destObj = parseTableObj(dest[index]);

      if (
        _.isEqual(_.get(base, [index]), _.get(source, [index])) &&
        _.isEqual(_.get(base, [index]), _.get(dest, [index]))
      ) {
        // all source, destination and base values are equal then
        // then there is no conflict or diff
        diffArray.push({
          index: index,
          value: {
            enabled: baseObj.enabled,
            key: [baseObj.key],
            value: [baseObj.value],
            description: [baseObj.description]
          }
        });
      }
      else if (_.isEqual(_.get(source, [index]), _.get(dest, [index])) ||
        _.isEqual(_.get(base, [index]), _.get(dest, [index]))
      ) {
        // if source and destination or base and destination are same
        // then it's a only diff
        diffArray.push({
          index: index,
          value: {
            enabled: sourceObj.enabled,
            key: diff.diffWords(baseObj.key, sourceObj.key),
            value: diff.diffWords(baseObj.value, sourceObj.value),
            description: diff.diffWords(baseObj.description, sourceObj.description)
          }
        });
      }
      else if (_.isEqual(_.get(base, [index]), _.get(source, [index])) && _.get(dest, [index])) {
        // all base and source values are same but destination is different
        // then showing only the destination value
        diffArray.push({
          index: index,
          value: {
            enabled: destObj.enabled,
            key: [destObj.key],
            value: [destObj.value],
            description: [destObj.description]
          }
        });

        // update the source and base in this case since we are just keeping value of destinations
        // regardless of source value
        _.set(this.source, [index], _.get(this.dest, [index]));
        _.set(this.base, [index], _.get(this.dest, [index]));
      }
      else {
        // in all the other cases it's a conflict
        diffArray.push({
          index: index,
          conflict: true,
          type: 'source',
          value: {
            enabled: sourceObj.enabled,
            key: diff.diffWords(baseObj.key, sourceObj.key),
            value: diff.diffWords(baseObj.value, sourceObj.value),
            description: diff.diffWords(baseObj.description, sourceObj.description)
          }
        });

        diffArray.push({
          index: index,
          conflict: true,
          type: 'dest',
          value: {
            enabled: destObj.enabled,
            key: diff.diffWords(baseObj.key, destObj.key),
            value: diff.diffWords(baseObj.value, destObj.value),
            description: diff.diffWords(baseObj.description, destObj.description)
          }
        });

        conflictedRows++;
      }

      index++;
    }

    this.numberOfConflicts = conflictedRows;

    return diffArray;
  }

  /**
   * Uses npm diff module to generate an array of diff between given source and destination
   */
  getSentencesDiff () {
    if (this.base && typeof this.base !== 'string' || this.source && typeof this.source !== 'string') {
      return { diff: [] };
    }

    return [
      { conflict: true, diff: diff.diffSentences(this.source, ''), type: 'source' },
      { conflict: true, diff: diff.diffSentences('', this.base), type: 'dest' }
    ];
  }

  /**
   * Uses npm diff module to generate an array of diff between given source and destination
   */
  getSentencesConfict () {
    if (this.base && typeof this.base !== 'string' || this.source && typeof this.source !== 'string' ||
      this.dest && typeof this.dest !== 'string') {
      return { diff: [] };
    }

    // both destination and source value are same than this is a diff
    if (this.source === this.dest) {
      return this.getSentencesDiff(this.base, this.source);
    }

    this.numberOfConflicts = 1;

    const baseToSourceDiff = diff.diffSentences(this.base, this.source),
      baseToDestDiff = diff.diffSentences(this.base, this.dest);

    return [
      { conflict: true, diff: baseToSourceDiff, type: 'source' },
      { conflict: true, diff: baseToDestDiff, type: 'dest' }
    ];
  }

  /**
   * Compares index by index to all key value pair in array and generates diff of code scripts
   * using npm diff module
   */
  getCodeDiff () {
    const baseCode = typeof this.base === 'string' ? this.base : '',
      sourceCode = typeof this.source === 'string' ? this.source : '',
      optimizedDiff = diff.diffLines(baseCode, sourceCode),
      flattenedDiff = flattenDiff(optimizedDiff);

    let baseIndex = 0,
      sourceIndex = 0;

    return flattenedDiff.map((line) => {
      return {
        ...line,
        value: line.value,
        sourceIndex: line.added ? ++sourceIndex : line.removed ? ' ' : ++sourceIndex,
        baseIndex: line.removed ? ++baseIndex : line.added ? ' ' : ++baseIndex
      };
    });
  }

  /**
   * Uses npm diff module to generate an array of diff between given source and destination
   */
  getCodeConflict () {
    if (this.base && typeof this.base !== 'string' || this.source && typeof this.source !== 'string') {
      return { diff: [] };
    }

    const sourceCode = (this.source || ''), // add new line to each code snippet to prevent "no new line" diff
      destCode = (this.dest || ''),
      baseCode = (this.base || ''),
      codeConflict = threeWaylineDiff(baseCode, sourceCode, destCode);

    // using utility function to modify the lines in code conflict
    attachLines(codeConflict.diff);

    this.numberOfConflicts = codeConflict.numberOfConflicts;

    return codeConflict.diff;
  }
}
