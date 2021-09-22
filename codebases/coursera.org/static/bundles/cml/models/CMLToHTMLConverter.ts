/* eslint-disable no-use-before-define */
/**
 * CML to HTML converter.
 * Emits 'assetsAvailable' event when assets are available.
 */
import _ from 'lodash';
import React from 'react';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { isURL } from 'validator';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import AssetManager from 'js/lib/AssetManager';
import EventEmitter from 'js/vendor/EventEmitter';
import config from 'js/app/config';
import CMLParser from 'bundles/cml/models/CMLParser';
import katex from 'js/lib/katex';
import { sanitizeURL, punycodeDomain } from 'bundles/authoring/common/utils/cmlUtils';
import AssetNode from 'bundles/cml/components/AssetNode';
import AssetNodeCDS from 'bundles/cml/components/cds/AssetNode';
import ReactDOMServer from 'react-dom/server';
import type { VariableData } from 'bundles/cml/types/Content';

import type { AssetMap } from 'bundles/asset-admin/types/assets';

const { BLOCK_TYPES } = CMLParser;
const {
  Text,
  Heading,
  Image,
  List,
  ListItem,
  Table,
  TableRow,
  TableCell,
  TableCellHeader,
  Audio,
  Code,
  Asset,
} = BLOCK_TYPES;

const MAX_DESCRIPTION_LENGTH = 125; // max characters, see https://coursera.atlassian.net/browse/PARTNER-563

type TextElement = Element & { data: string };

type SetupOptions = {
  disableMath?: boolean;
  isCdsEnabled?: boolean;
};

export type CMLToHTMLConverterType = EventEmitter & {
  assetIds: Array<string>;
  options: SetupOptions;
  variables: VariableData;
  assetManager: AssetManager;
  convert: (block: Element) => string | Error;
  setupOptions: (options: SetupOptions) => void;
  setupVariables: (data: VariableData) => void;
  toHTML: (value: string) => string;
  fetchAssets: () => void;
};

/**
 *
 * Substitute variables in the given string with the values
 */
function substituteVariables(this: CMLToHTMLConverterType, str: string) {
  let completeStr = str;

  _.forEach(this.variables, (value, key) => {
    completeStr = completeStr.replace(new RegExp(`%${key}%`, 'g'), value as string);
  });

  return completeStr;
}

/**
 * Generate HTML for the given tag, content and attributes.
 * @param {String} tagName HTML tag name
 * @param {String} content Inner HTML for the tag
 * @param {Object} attributes Attributes for the tag
 */
function getHTML(tagName: string, content: string, attributes = {}): string {
  let openingTag = tagName;
  const closingTag = tagName;

  if (attributes && !_.isEmpty(attributes)) {
    openingTag += ' ' + CMLParser.attributesToString(attributes);
  }

  let templateString = '<<%= openingTag %>><%= content %></<%= closingTag %>>';

  if (!content) {
    if (tagName === 'br') {
      // use self-closing tags for BR otherwise we have double breaks
      templateString = '<<%= openingTag %> />';
    } else {
      // all other tags need to be properly closed, see PARTNER-12847
      templateString = '<<%= openingTag %>></<%= closingTag %>>';
    }
  }

  const template = _.template(templateString);
  return template({
    openingTag,
    closingTag,
    content,
  });
}

/**
 * Get HTML for image block.
 * @param {Node} block Image block
 */
function getImageHTML(this: CMLToHTMLConverterType, block: Element) {
  const src = sanitizeURL.call(this, block.getAttribute('src') || '');
  const assetId = block.getAttribute('assetId') || block.getAttribute('id'); // assetId for <img> tag, id for <asset> tag
  const alt = block.getAttribute('alt') || '';
  let figcaptionHtml = ''; // append an optional caption when a long a11y description is available
  let longDescription = '';

  const imgAttributes: {
    src: string;
    alt: string;
    'data-asset-id'?: string;
    'aria-describedby'?: string;
  } = {
    src,
    alt,
  };
  const figureAttributes: { 'aria-label'?: string; role: string } = {
    role: 'figure', // `role` attr is needed for IE11 or other browsers that don't natively support this tag
  };

  if (assetId) {
    const url = getAssetURL.call(this, assetId);
    const description = this.assetManager.getAssetDescription(assetId);
    longDescription = this.assetManager.getAssetLongDescription(assetId);

    if (description) {
      // attach a11y meaning to the img when we have an asset description
      imgAttributes.alt = description;
    }

    if (longDescription) {
      // append a screenreader-only caption for a11y description when we have a longer description.
      // this will be called out after the image alt when focused via screenreader.
      const captionId = `caption-${assetId}`;
      imgAttributes['aria-describedby'] = captionId;
      figcaptionHtml = `<figcaption id="${captionId}" class="sr-only" aria-hidden="true">${longDescription}</figcaption>`;
    }

    if (url) {
      imgAttributes.src = url;
    }

    imgAttributes['data-asset-id'] = assetId;
  }

  const content = `<img ${CMLParser.attributesToString(imgAttributes)} />`;

  // for better a11y, wrap in <figure> with figcaption when the asset has a longDescription, use regular <img> tag otherwise
  return longDescription ? getHTML('figure', `${content}${figcaptionHtml}`, figureAttributes) : content;
}

/**
 * Get HTML for asset block.
 * @param  {Node} block asset block
 */
function getAssetHTML(this: CMLToHTMLConverterType, block: Element) {
  const id = block.getAttribute('id');
  const name = block.getAttribute('name') || '';
  const type = block.getAttribute('assetType') || '';
  const extension = block.getAttribute('extension');
  const fileName = extension ? `${name}.${extension}` : name;

  if (type === 'image') {
    return getImageHTML.call(this, block);
  }

  if (id) {
    const url = getAssetURL.call(this, id);
    const AssetNodeSelected = this.options.isCdsEnabled ? AssetNodeCDS : AssetNode;
    return ReactDOMServer.renderToStaticMarkup(
      React.createElement(AssetNodeSelected, { id, url, filename: fileName, typeName: type })
    );
  }

  return '';
}

/**
 * Get HTML for Audio Block.
 * @param {Node} block Audio block
 */
function getAudioHTML(this: CMLToHTMLConverterType, block: Element) {
  let content;

  const src = block.getAttribute('src') || '';
  const extMatch = /\.([^.]*)$/.exec(src);

  if (extMatch && extMatch[1]) {
    content = '<source src="' + src + '" type="audio/' + extMatch[1] + '">';
  } else {
    content = '<source src="' + src + '">';
  }

  return getHTML('audio', content, {
    controls: true,
  });
}

/**
 * Get HTML for List Block.
 * @param {Node} block List block
 */
function getListHTML(this: CMLToHTMLConverterType, block: Element) {
  const innerContent = _.map(block.childNodes, this.convert.bind(this)).join('');
  const type = block.getAttribute('bulletType');
  const attributes = {} as { type?: string };

  let tagName = '';

  switch (type) {
    case 'numbers':
      tagName = 'ol';
      break;

    case 'alphabet':
      tagName = 'ol';
      attributes.type = 'A';
      break;

    case 'bullets':
      tagName = 'ul';
      break;
  }

  return getHTML(tagName, innerContent, attributes);
}

/**
 * Get HTML for a List Item.
 * @param {Node} block List Item
 */
function getListItemHTML(this: CMLToHTMLConverterType, block: Element) {
  return getHTML('li', getItemHTML.call(this, block));
}

/**
 * Get HTML for a Heading Block.
 * @param {Node} block Heading block
 */
function getHeadingHTML(this: CMLToHTMLConverterType, block: Element) {
  const headingLevel = block.getAttribute('level') || 1;
  const headingTag = 'h' + headingLevel;
  const headingText = getInnerHTML.call(this, block);

  return getHTML(headingTag, headingText);
}

/**
 * Get HTML for a Table Block.
 * @param {Node} block Table block
 */
function getTableHTML(this: CMLToHTMLConverterType, block: Element) {
  let head = '';
  let caption = '';
  const hasCaption = block.childNodes[0].nodeName === 'caption';
  const headIndex = hasCaption ? 1 : 0; // caption is always the first tag
  const hasHeader = block.childNodes[headIndex].nodeName === 'thead';
  const bodyIndex = hasHeader ? headIndex + 1 : 0; // body always follows head

  if (hasCaption) {
    caption = getHTML('caption', block.childNodes[0].textContent || '');
  }

  if (hasHeader) {
    const headContent = _.map(block.childNodes[headIndex].childNodes, this.convert.bind(this)).join('');
    head = getHTML('thead', headContent);
  }

  const bodyNodes = _.filter(block.childNodes, (node, idx) => idx >= bodyIndex);
  const content = _.map(bodyNodes, this.convert.bind(this)).join('');
  const body = getHTML('tbody', content);

  return getHTML('table', caption + head + body);
}

/**
 * Get HTML for a Table Row.
 * @param {Node} block Table row.
 */
function getTableRowHTML(this: CMLToHTMLConverterType, block: Element) {
  const content = _.map(block.childNodes, this.convert.bind(this)).join('');
  return getHTML('tr', content);
}

/**
 * Get HTML for a Table Cell.
 * @param {Node} block Table cell
 */
function getTableCellHTML(this: CMLToHTMLConverterType, block: Element) {
  return getHTML('td', getItemHTML.call(this, block));
}

/**
 * Get HTML for a Table Cell Header.
 * @param {Node} block Table cell header.
 */
function getTableCellHeaderHTML(this: CMLToHTMLConverterType, block: Element) {
  let scope = 'col';

  // for a11y, https://webaim.org/techniques/tables/data#headers
  if (block?.parentNode?.parentNode?.nodeName === 'table') {
    // body rows have 'table' as the parent, headers rows have 'thead' as parent
    scope = 'row';
  }

  return getHTML('th', getItemHTML.call(this, block), {
    scope,
  });
}

/**
 * Generate inner HTML from the block.
 * TODO: Investigate using DOM API instead of serialization. Will make
 * code cleaner and faster?
 * @param {Node} block Text/Heading/Code/ListItem block
 */
function getInnerHTML(this: CMLToHTMLConverterType, block: Element) {
  let content = '';

  _.forEach(block.childNodes, (inlineBlock) => {
    content += getInlineBlockHTML.call(this, inlineBlock as Element);
  });

  if (block.getAttribute('hasMath') === 'true' && !this.options.disableMath) {
    return katex(content);
  }
  return content;
}

/**
 * Get HTML for inline block.
 * @param {Node} block Inline block
 */
function getInlineBlockHTML(this: CMLToHTMLConverterType, block: Element) {
  let content = '';

  const { nodeName } = block;
  const isText = block.nodeType === 3;

  if (isText) {
    content = _.escape((block as TextElement).data);
  } else if (nodeName === 'a') {
    content = getLinkHTML.call(this, block);
  } else if (_.indexOf(CMLParser.SUPPORTED_INLINE_BLOCKS, nodeName) !== -1) {
    _.forEach(block.childNodes, (inlineBlock) => {
      content += getInlineBlockHTML.call(this, inlineBlock as Element);
    });

    content = getHTML(nodeName, content);
  }

  return content;
}

const courseraHost = config.url.base.replace(/^https?:\/\/\w+\.([^/]*).*/, '$1'); // "coursera.org"
const courseraAssetURLRegExp = new RegExp('^https?://([-\\w]+\\.)?' + courseraHost + '/|^' + config.url.assets);

/**
 * Check if the given URL is an internal Coursera URL
 * @param  {String}  url
 * @return {Boolean} True if the given URL is an internal Coursera URL
 */
function isCourseraAssetsURL(url: string) {
  return courseraAssetURLRegExp.test(url);
}

/**
 * Get HTML for code block
 * @param  {Node} block Code block
 */
function getCodeHTML(this: CMLToHTMLConverterType, block: Element) {
  const language = block.getAttribute('language');
  const evaluatorId = block.getAttribute('evaluatorId');

  const attributes: { contenteditable: string; dir: 'ltr'; 'data-language'?: string; 'data-evaluator-id'?: string } = {
    contenteditable: 'false',
    dir: 'ltr', // always use LTR for code blocks even if the content direction itself is determined to be RTL
  };

  if (language) {
    attributes['data-language'] = language;
  }

  if (evaluatorId) {
    attributes['data-evaluator-id'] = evaluatorId;
  }

  return getHTML('pre', getInnerHTML.call(this, block), attributes);
}

/**
 * Get HTML for a link block.
 * @param {Node} block Anchor inline block
 */
function getLinkHTML(this: CMLToHTMLConverterType, block: Element) {
  const url = block.getAttribute('href') || '';
  const title = block.getAttribute('title'); // TODO: use aria-label in DTD instead of title

  let content = '';

  _.forEach(block.childNodes, (inlineBlock) => {
    content += getInlineBlockHTML.call(this, inlineBlock as Element);
  });

  const attributes: { href: string; target: string; rel: string; title?: string; 'aria-label'?: string } = {
    href: sanitizeURL.call(this, substituteVariables.call(this, url)),
    target: '_blank',
    rel: 'noopener',
  };

  if (title) {
    const label = title.substr(0, MAX_DESCRIPTION_LENGTH);
    attributes.title = label; // TODO: only use aria-label once supported in DTD
    attributes['aria-label'] = label;
  }

  if (!isCourseraAssetsURL(url)) {
    attributes.rel += ' nofollow';
  }

  // if it is URL text, convert any punycode to ASCII
  if (isURL(content)) {
    content = punycodeDomain(content);
  }

  return getHTML('a', content, attributes);
}

/**
 * Get HTML contained in a list item or table cell.
 * @param {Node} block ListItem / TableCell block
 */
function getItemHTML(this: CMLToHTMLConverterType, block: Element) {
  let content = '';

  const textBlock = _.find(block.childNodes, (childBlock) => {
    const blockType = CMLParser.getBlockType(childBlock);
    return blockType === Text;
  });

  if (textBlock) {
    content = getInnerHTML.call(this, textBlock as Element);
  }

  return content;
}

// TODO: Investigate if there is a better way to remove whitespaces between
// blocks before forming the DOM tree.
function isWhitespace(block: Element) {
  return block.nodeName === '#text' && (block as TextElement).data && (block as TextElement).data.trim() === '';
}

/**
 * Get asset URL from asset manager's cache
 */
function getAssetURL(this: CMLToHTMLConverterType, assetId: string) {
  const asset = AssetManager.getAsset(assetId);

  if (!asset) {
    if (this.assetIds.indexOf(assetId) === -1) {
      this.assetIds.push(assetId);
    }

    return '';
  }

  return asset.url.url;
}

/**
 * @constructor
 * TODO(ankit): Refactor to re-use block models for HTMLToCMLConverter
 */
const CMLToHTMLConverter = function (this: CMLToHTMLConverterType) {
  this.options = {
    disableMath: false,
  };
  this.assetIds = [];
  this.variables = {};
  this.assetManager = new AssetManager();
};

CMLToHTMLConverter.prototype = _.extend({}, EventEmitter.prototype, {}) as CMLToHTMLConverterType;

/**
 * Set up data to replace substitute variable in CML
 * @param {Object} data Data (key, value) for substitute
 *
 * @see {@link CMLVariableNames} for supported keys.
 */
CMLToHTMLConverter.prototype.setupVariables = function (data: $TSFixMe) {
  this.variables = data;
};

/**
 * Set up options. Passed options are merged with existing options.
 * @param {Object} options
 * @param {boolean} options.disableMath - disable LaTeX to HTML transformation
 */
CMLToHTMLConverter.prototype.setupOptions = function (options: SetupOptions) {
  this.options = Object.assign({}, this.options, options);
};

/**
 * Convert given CML text to HTML.
 * @param {String} cmlText CML text.
 *
 * @throws Error when DOMParser cannot parse the string into an xmlDOM object.
 * This error occurs because the xml is not well formed.
 */
CMLToHTMLConverter.prototype.toHTML = function (cmlText: string) {
  if (!cmlText) {
    return '';
  }

  const parser = new CMLParser(cmlText);
  const blocks = parser.getBlocks();
  const html = _.map(blocks, this.convert.bind(this)).join('');

  this.fetchAssets.call(this);

  return substituteVariables.call(this, html);
};

/**
 * Fetch assets via the assetIds.
 */
CMLToHTMLConverter.prototype.fetchAssets = function () {
  if (this.assetIds && this.assetIds.length !== 0) {
    this.assetManager.getAssetMap(this.assetIds).then((assetMap: AssetMap) => {
      this.assetIds = [];
      this.emit('assetsAvailable', assetMap);
    });
  }
};

/**
 * Convert given block into HTML
 * @param {XMLDOMElement} block CML Block
 */
CMLToHTMLConverter.prototype.convert = function (block: Element): string | Error {
  const blockType = CMLParser.getBlockType(block);
  const attributes = {};

  if (isWhitespace(block)) {
    return '';
  }

  switch (blockType) {
    case Heading:
      return getHeadingHTML.call(this, block);

    case Text:
      return getHTML('p', getInnerHTML.call(this, block), attributes);

    case Image:
      return getImageHTML.call(this, block);

    case List:
      return getListHTML.call(this, block);

    case ListItem:
      return getListItemHTML.call(this, block);

    case Table:
      return getTableHTML.call(this, block);

    case TableRow:
      return getTableRowHTML.call(this, block);

    case TableCell:
      return getTableCellHTML.call(this, block);

    case TableCellHeader:
      return getTableCellHeaderHTML.call(this, block);

    case Audio:
      return getAudioHTML.call(this, block);

    case Code:
      return getCodeHTML.call(this, block);

    case Asset:
      return getAssetHTML.call(this, block);

    default:
      throw new Error('Unknown CML tag "' + blockType + '" encountered');
  }
};

export default CMLToHTMLConverter;
