/**
 * Utility methods to operate on CML objects.
 */
import _, { map } from 'lodash';

import CMLParser from 'bundles/cml/models/CMLParser';
import type { CmlContent } from '../types/Content';

const CML_WITH_HEADING_1 = '<co-content><heading level="1">';

const { BLOCK_TYPES, SUPPORTED_BLOCKS } = CMLParser;

const CMLUtils = {
  /**
   * Create a new CML object.
   * @param {string} cmlValue CML text
   * @param {string} dtdId DTD identifier for the CML
   */
  create: (cmlValue?: string, dtdId?: string): CmlContent => {
    return {
      typeName: 'cml',
      definition: {
        dtdId: dtdId || '',
        value: cmlValue || CMLParser.EMPTY_CML,
      },
    };
  },

  /**
   * Get DTD id associated with the CML object.
   * @param {object} cmlObject
   */
  getDtdId: (cmlObject: CmlContent | undefined | null): string => ((cmlObject || {}).definition || {}).dtdId || '',

  /**
   * Get cml value associated with the CML object.
   * @param {object} cmlObject
   */
  getValue: (cmlObject: CmlContent | undefined | null): string => ((cmlObject || {}).definition || {}).value || '',

  getRenderableHtml: (cmlObject: CmlContent | undefined | null): string | null =>
    (((cmlObject || {}).definition || {}).renderableHtmlWithMetadata || {}).renderableHtml || null,

  getInnerText: (cmlObject: CmlContent | undefined | null) => {
    const cmlValue = CMLUtils.getValue(cmlObject);
    const parser = new CMLParser(cmlValue);

    return CMLParser.getInnerText(parser.getRoot()) || '';
  },

  /**
   * Return true if the CML does not have any non-empty blocks.
   * @param {object} cmlObject CML object.
   */
  isEmpty: (cmlObject: CmlContent | undefined | null): boolean => {
    const cmlText = CMLUtils.getValue(cmlObject);
    const parser = new CMLParser(cmlText);
    const blocks = parser.getBlocks();

    const { Image, Audio, Asset, Code } = BLOCK_TYPES;
    const nonTextBlockTypes = [Image, Audio, Asset, Code];

    if (!blocks || blocks.length === 0) {
      return true;
    }

    const nonEmptyBlock = _.find(blocks, (block) => {
      const blockType = CMLParser.getBlockType(block);
      const text = CMLParser.getInnerText(block);

      return text !== '' || nonTextBlockTypes.indexOf(blockType) !== -1;
    });

    return nonEmptyBlock === undefined;
  },

  /**
   * Get the length of the textual context of the given cml
   * @type {object} cmlObject
   */
  getLength: (cmlObject?: CmlContent | null | undefined): number => {
    return cmlObject ? CMLUtils.getInnerText(cmlObject).length : 0;
  },

  /**
   * Calculate the number of words of the textual content of the given cml.
   */
  getWordCount: (cmlObject?: CmlContent): number => {
    const wordsSeparatorsRegex = /\s+/;
    return CMLUtils.getInnerText(cmlObject).split(wordsSeparatorsRegex).filter(Boolean).length;
  },

  /**
   * Return true if given object is a valid CML object.
   */
  isCML: (maybeCmlObject: CmlContent | string | undefined): boolean => {
    if (!maybeCmlObject) {
      return false;
    }

    // HTML is returned as a string and not an object.
    return typeof maybeCmlObject !== 'string' && maybeCmlObject.typeName === 'cml';
  },

  replaceVariable: (cmlObject: CmlContent, variable: string, name: string): CmlContent => {
    const cmlObjectCopy = Object.assign({}, cmlObject);
    cmlObjectCopy.definition.value = cmlObjectCopy.definition.value.replace(`%${variable}%`, name);
    return cmlObjectCopy;
  },

  /**
   * Get list of blocks that are not supported for the given CML.
   * @param {string} cmlText
   */
  getUnsupportedBlocks: (cml: CmlContent | undefined | null) => {
    const cmlText = CMLUtils.getValue(cml);
    const parser = new CMLParser(cmlText);
    const blocks = parser.getBlocks();

    return _.filter(blocks, (block) => {
      const blockType = CMLParser.getBlockType(block);
      return !_.includes(SUPPORTED_BLOCKS, blockType);
    });
  },

  /**
   * Whether the CML starts with a H1 tag - used in readings to skip Title rendering. See `ReadingItem.tsx`
   * @param {object} cmlObject CML object.
   */
  beginsWithHeadingLevel1: (cml: CmlContent | undefined | null): boolean => {
    const cmlText = CMLUtils.getValue(cml) || '';

    return cmlText.startsWith(CML_WITH_HEADING_1);
  },

  /**
   * Comparing two CML objects for equality.
   * @param {object} cmlObjectA CML object.
   * @param {object} cmlObjectB CML object.
   */
  areCmlValuesEqual: (cmlA?: CmlContent, cmlB?: CmlContent) => {
    if (cmlA === cmlB) {
      return true;
    } else if (!cmlA || !cmlB) {
      return false;
    } else {
      return CMLUtils.getValue(cmlA) === CMLUtils.getValue(cmlB);
    }
  },

  /**
   * Comparing two lists of CML objects for equality.
   * @param {object} cmlA list of CML objects.
   * @param {object} cmlB list of CML objects.
   */
  areCmlListsEqual: (cmlA?: CmlContent[], cmlB?: CmlContent[]) => {
    if (cmlA === cmlB) {
      return true;
    } else if (!cmlA || !cmlB) {
      return false;
    } else if (cmlA.length !== cmlB.length) {
      return false;
    } else {
      return cmlA.reduce((allItemsAreEqual, currentCML, currentIndex) => {
        return allItemsAreEqual && CMLUtils.areCmlValuesEqual(currentCML, cmlB[currentIndex]);
      }, true);
    }
  },
};

export function createCmlContentDefinitionValueString(text = '') {
  return `<co-content><text>${text}</text></co-content>`;
}

export function getCmlBlockTypes(cml: CmlContent | undefined | null) {
  const cmlText = CMLUtils.getValue(cml);
  const parser = new CMLParser(cmlText);
  const cmlBlocks = parser.getBlocks();
  return map(cmlBlocks, (block) => CMLParser.getBlockType(block));
}

export default CMLUtils;

export const {
  create,
  getDtdId,
  getValue,
  getRenderableHtml,
  getInnerText,
  isEmpty,
  getLength,
  getWordCount,
  isCML,
  replaceVariable,
  getUnsupportedBlocks,
  beginsWithHeadingLevel1,
  areCmlValuesEqual,
  areCmlListsEqual,
} = CMLUtils;
