import _ from 'lodash';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { DOMParser, XMLSerializer } from 'js/lib/dom';

export const BLOCK_TYPES = {
  Heading: 'heading',
  Text: 'text',
  Image: 'img',
  Audio: 'audio',
  Code: 'code',
  Table: 'table',
  TableRow: 'tr',
  TableCell: 'td',
  TableCellHeader: 'th',
  List: 'list',
  ListItem: 'li',
  Asset: 'asset',
};

export const SUPPORTED_INLINE_BLOCKS = ['strong', 'em', 'u', 'a', 'sup', 'sub', 'strike', 'ul', 'li', 'br', 'q', 'var'];

export const SUPPORTED_BLOCKS = [
  BLOCK_TYPES.Heading,
  BLOCK_TYPES.Text,
  BLOCK_TYPES.Image,
  BLOCK_TYPES.Table,
  BLOCK_TYPES.List,
  BLOCK_TYPES.Code,
  BLOCK_TYPES.Asset,
];

export const EMPTY_CML = '<co-content></co-content>';
export const MATH_REGEX = /\\\((.*?[^\\])\\\)|\\\[(.*?[^\\])\\\]|\$\$(.*?[^\\])\$\$/g;

/**
 * Removes child (not descendant) text nodes that only contain whitespace.
 * Adapted from http://www.sitepoint.com/removing-useless-nodes-from-the-dom/
 * @param {Node} node The node to simplify
 */
const removeWhitespaceTextNodes = function (node: Node) {
  if (!node || !node.childNodes) {
    return;
  }

  for (let n = 0; n < node.childNodes.length; n += 1) {
    const child = node.childNodes[n];
    if (child.nodeType === 3 && child.nodeValue && !/\S/.test(child.nodeValue)) {
      // Whitespace text node.
      node.removeChild(child);
      n -= 1;
    }
  }
};

const escapeString = (str: string) =>
  str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

/**
 * CML Parser to allow read and write operations on CML.
 * @param {String} cmlText CML string
 */
// @ts-ignore TODO: refactor it to class
const CMLParser = function (this: typeof CMLParser, cmlText: string) {
  const parser = new DOMParser();

  this.doc = parser.parseFromString(cmlText || EMPTY_CML, 'application/xml');

  // CML allows meaningless whitespace between blocks. Remove it so that implementations of functions like `getBlocks`
  // can assume that all of the root's child nodes are block nodes.
  removeWhitespaceTextNodes(this.getRoot());
};

// public

/**
 * Get the root node of the CML document.
 */
CMLParser.prototype.getRoot = function () {
  return this.doc.childNodes[0];
};

CMLParser.prototype.getBlocks = function () {
  return this.getRoot().childNodes;
};

CMLParser.prototype.getBlockAtIndex = function (blockIndex: number) {
  const blocks = this.getBlocks();
  return blocks[blockIndex];
};

CMLParser.prototype.getCMLText = function () {
  const s = new XMLSerializer();
  return s.serializeToString(this.doc);
};

// static

Object.assign(CMLParser, {
  EMPTY_CML,
  BLOCK_TYPES,
  SUPPORTED_BLOCKS,
  SUPPORTED_INLINE_BLOCKS,
});

CMLParser.getBlockType = (block: Node) => block.nodeName;

/**
 * Return true if the block has a math expression.
 */
CMLParser.hasMath = function (block: Node) {
  const content = CMLParser.getInnerContent(block);
  return !!content.match(MATH_REGEX);
};

/**
 * Return stringified form of the attributes.
 */
CMLParser.attributesToString = function (listAttributes: string[]) {
  if (!listAttributes || _.isEmpty(listAttributes)) {
    return '';
  }

  return _.map(listAttributes, function (val, key) {
    const keyEscaped = _.escape(key.toString());
    if (val) {
      if (typeof val === 'string') {
        return `${keyEscaped}="${escapeString(val)}"`;
      } else {
        // In the audio CML case, the replace function does not exist: val is a number.
        return `${keyEscaped}="${val}"`;
      }
    } else {
      return keyEscaped;
    }
  }).join(' ');
};

/**
 * Get content for the given block.
 * @param {XMLDOMNode} block CML block
 * @return {string}
 */
CMLParser.getInnerContent = function (block: Node) {
  const s = new XMLSerializer();
  let content = '';

  _.forEach(block.childNodes, function (node) {
    content += s.serializeToString(node);
  });

  return content;
};

/**
 * Get inner text for for the given block.
 */
CMLParser.getInnerText = function (block: Node) {
  let content = '';
  let node: Node;

  for (let i = 0; i < block.childNodes.length; i += 1) {
    node = block.childNodes[i];

    // Get the text from text nodes
    if (node.nodeType === 3) {
      content += node.nodeValue + '\n';
    } else {
      // Traverse everything else
      content += CMLParser.getInnerText(node);

      if (i !== block.childNodes.length - 1) {
        content += '\n';
      }
    }
  }

  return content;
};

export default CMLParser;

export const { getBlockType, hasMath, attributesToString, getInnerContent, getInnerText } = CMLParser;
