'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { parse } from 'hub-http/helpers/params';
import { closest } from 'UIComponents/utils/Dom';
import isValidPasteContent from '../utils/isValidPasteContent';
import parseHTML from '../utils/parseHTML';
import { forEachNode } from '../utils/dom';
export var styles = {
  BOLD: '700',
  ITALIC: 'italic',
  STRIKETHROUGH: 'line-through',
  SUPERSCRIPT: 'super',
  SUBSCRIPT: 'sub'
};
export var elements = {
  ANCHOR: 'a',
  BOLD: 'strong',
  ITALIC: 'em',
  STRIKETHROUGH: 'del',
  SUPERSCRIPT: 'sup',
  SUBSCRIPT: 'sub',
  H2: 'h2',
  H3: 'h3'
};
var HEADERS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
var LISTS = ['OL', 'UL', 'LI'];
var TABLES = ['TR', 'TD', 'TABLE'];
var SPANBI = ['SPAN', 'B', 'I'];
var CHILD_NODES_OVERRIDES = ['P', 'A', 'SPAN'].concat(HEADERS, LISTS, TABLES);
var DOC_WRAPPER = /docs-internal-guid/;
var COMMENT_HREF = /#cmnt_ref\d+|#cmnt\d+/;
var GOOGLE_REDIRECT = /^https?:\/\/www.google.com\/url\?/;
var LIST_CLASS_PATTERN = /lst-kix_(\w*)-(\d*)/;
var listMap = {};
var contextualStyleNames = ['font-size', 'color'];
var contextualStyles;

var isCommentHref = function isCommentHref(href) {
  return COMMENT_HREF.test(href);
};

var defaultLinkColor = 'rgb(17, 85, 204)';

var resetContextualStyles = function resetContextualStyles() {
  contextualStyles = contextualStyleNames.reduce(function (acc, styleName) {
    acc[styleName] = {};
    return acc;
  }, {});
};

var incrementContextualStyle = function incrementContextualStyle(styleName, styleValue, addedLength) {
  contextualStyles[styleName][styleValue] = (contextualStyles[styleName][styleValue] || 0) + addedLength;
};

var applyContextualStyles = function applyContextualStyles(body) {
  contextualStyleNames.forEach(function (styleName) {
    var majorityStyleValue = '';
    var contextualStyleValues = contextualStyles[styleName]; // This finds the most used style value by length of text content

    Object.keys(contextualStyleValues).forEach(function (styleValue) {
      if (contextualStyleValues[styleValue] > contextualStyleValues[majorityStyleValue] || !majorityStyleValue) {
        majorityStyleValue = styleValue;
      }
    });

    if (contextualStyleValues[majorityStyleValue] / body.textContent.length < 0.75) {
      return;
    }

    forEachNode(function (element) {
      var closestP = closest(element, 'P');
      var closestPStyleValue = closestP && closestP.style[styleName]; // Remove the style from the element if it uses the majorityStyleValue and
      // the element's closest parent `p` also uses the majorityStyleValue
      // The `p` also needs the style otherwise the element will fall back to a
      // a different style that was not intendeed for the element.

      if (element.style[styleName] === majorityStyleValue && !(closestPStyleValue && closestPStyleValue !== majorityStyleValue)) {
        element.style.removeProperty(styleName);
      } // Bring the child out of the span if no more styles are present


      if (element.nodeName === 'SPAN' && element.style.length === 0) {
        element.parentNode.replaceChild(element.firstChild, element);
      }
    }, body.querySelectorAll("[style*=\"" + styleName + "\"]"));
  });
};

var sanitizeAnchorStyles = function sanitizeAnchorStyles(node) {
  node.style.removeProperty('text-decoration');

  if (node.style.color === defaultLinkColor) {
    node.style.removeProperty('color');
  }
};

var removeGoogleRedirect = function removeGoogleRedirect(href) {
  if (GOOGLE_REDIRECT.test(href)) {
    var query = href.slice(href.indexOf('?') + 1);
    var params = parse(query);
    return params.q || href;
  }

  return href;
};
/**
 * this is the internal version of https://www.github.com/aem/docs-soap
 */


var isCommentsStyle = function isCommentsStyle(_ref) {
  var border = _ref.border,
      margin = _ref.margin;
  return border.indexOf('1px') !== -1 && border.indexOf('solid') !== -1 && border.indexOf('black') !== -1 && margin === '5px';
};

var isCommentStyle = function isCommentStyle(style) {
  if (!style) {
    return false;
  }

  var color = style.color,
      fontFamily = style.fontFamily,
      fontSize = style.fontSize,
      lineHeight = style.lineHeight,
      margin = style.margin,
      padding = style.padding,
      textAlign = style.textAlign;
  return color === 'rgb(0, 0, 0)' && fontFamily === 'Arial' && fontSize === '11pt' && lineHeight === '1' && margin === '0px' && padding === '0px' && textAlign === 'left';
};

var isTableContainer = function isTableContainer(node) {
  return node.nodeName === 'DIV' && node.childNodes.length === 1 && TABLES.includes(node.childNodes[0].nodeName);
};

var childrenHaveCommentStyle = function childrenHaveCommentStyle(_ref2) {
  var childNodes = _ref2.childNodes;

  for (var i = 0; i < childNodes.length; i++) {
    if (!isCommentStyle(childNodes[i].style)) {
      return false;
    }
  }

  return true;
};

export var wrapNodeAnchor = function wrapNodeAnchor(cleanChildren, href) {
  if (href === '') {
    var _document$createEleme;

    return (_document$createEleme = document.createElement('a')).append.apply(_document$createEleme, _toConsumableArray(cleanChildren));
  }

  var anchor = document.createElement('a');
  anchor.href = removeGoogleRedirect(href);
  var spanChild = cleanChildren[0];

  while (spanChild && spanChild.nodeName !== 'SPAN') {
    var tempChildren = spanChild.childNodes;

    if (tempChildren.length) {
      spanChild = tempChildren[0];
    } else {
      spanChild = null;
    }
  }

  if (spanChild && spanChild.nodeName === 'SPAN') {
    sanitizeAnchorStyles(spanChild);
    anchor.style.cssText = spanChild.style.cssText;
    spanChild.removeAttribute('style');
  }

  anchor.append.apply(anchor, _toConsumableArray(cleanChildren));
  return anchor;
};
export var wrapNodeInline = function wrapNodeInline(node, style) {
  var el = document.createElement(style);
  el.appendChild(node.cloneNode(true));
  return el;
};
export var wrapNode = function wrapNode(inner, result) {
  var newNode = result.cloneNode(true);
  var stylePropertyPairs = [['fontWeight', 'BOLD'], ['fontStyle', 'ITALIC'], ['textDecoration', 'UNDERLINE'], ['textDecoration', 'STRIKETHROUGH'], ['verticalAlign', 'SUPERSCRIPT'], ['verticalAlign', 'SUBSCRIPT']];

  if (inner && inner.style) {
    stylePropertyPairs.forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          prop = _ref4[0],
          style = _ref4[1];

      if (inner.style[prop] === styles[style]) {
        newNode = wrapNodeInline(newNode, elements[style]);
      }
    });
  }

  return newNode;
};
export var getFlatChildNodes = function getFlatChildNodes(node) {
  var childNodes = [];

  function getChildNodes(parent) {
    var children = _toConsumableArray(parent.childNodes);

    children.forEach(function (child) {
      childNodes.push(child);

      if (child.childNodes.length) {
        getChildNodes(child);
      }
    });
  }

  if (node.childNodes.length) {
    getChildNodes(node);
  }

  return childNodes;
};
/**
 * Takes a block-level element (paragraphs and bullets) and applies inline styles as necessary
 */

export var applyBlockStyles = function applyBlockStyles(dirty) {
  var node = dirty.cloneNode(true);
  var newNode = document.createTextNode(node.textContent);
  var styledNode;

  if (node.childNodes.length) {
    if (node.className === 'title') {
      newNode = wrapNodeInline(newNode, elements.H2);
    } else if (node.className === 'subtitle') {
      newNode = wrapNodeInline(newNode, elements.H3);
    } else if (node.childNodes[0].style) {
      styledNode = node.childNodes[0];
    }
  }

  newNode = wrapNode(styledNode, newNode);
  return newNode;
};
/**
 * parse out the inline style properties and wrap the text in HTML elements instead
 */

var inlineStylePairs = {
  'font-style': {
    italic: 'em'
  },
  'font-weight': {
    bold: 'strong',
    '700': 'strong'
  },
  'vertical-align': {
    sub: 'sub',
    super: 'sup'
  }
};
export var applyInlineStyles = function applyInlineStyles(node) {
  var didStyle = false;
  var styledNode = node;
  var nodeStyles = node.style;

  for (var index = 0; index < nodeStyles.length; index++) {
    var styleName = nodeStyles[index];

    if (Object.prototype.hasOwnProperty.call(inlineStylePairs, styleName)) {
      var newTagName = inlineStylePairs[styleName][nodeStyles[styleName]];

      if (newTagName) {
        var _styledNode;

        if (styleName === 'vertical-align') {
          node.style.removeProperty('font-size');
        }

        node.style.removeProperty(styleName);
        styledNode = document.createElement(newTagName);

        (_styledNode = styledNode).append.apply(_styledNode, _toConsumableArray(getCleanNode(node))); // eslint-disable-line @typescript-eslint/no-use-before-define


        didStyle = styledNode.childNodes.length > 0;
        break;
      }
    }
  }

  return {
    didStyle: didStyle,
    styledNode: styledNode
  };
}; // Only used in parseList - mutates newWrapper

var handleExportedLists = function handleExportedLists(className, newNode, newWrapper) {
  var listClasses = LIST_CLASS_PATTERN.exec(className);

  if (listClasses) {
    var _listClasses = _slicedToArray(listClasses, 3),
        key = _listClasses[1],
        depth = _listClasses[2];

    if (className.indexOf('start') !== -1) {
      newWrapper.appendChild(newNode);

      if (listMap[key]) {
        listMap[key][depth] = newWrapper;
        listMap[key]["" + (depth - 1)].appendChild(newWrapper);
        return true;
      } // depth 0 -> make new entry AND allow node to be added to main nodes (entry point of this list)


      listMap[key] = _defineProperty({}, depth, newWrapper);
      return false;
    }

    listMap[key][depth].appendChild(newNode);
    return true;
  }

  return false;
};

export var parseList = function parseList(node) {
  var className = node.className,
      childNodes = node.childNodes;
  var newWrapper = node.cloneNode(false);
  newWrapper.removeAttribute('id');
  newWrapper.removeAttribute('class');
  var newNode = document.createDocumentFragment();
  var items = [];

  for (var i = 0; i < childNodes.length; i++) {
    var childNode = childNodes[i];

    if (childNode.nodeName === 'A' && isCommentHref(childNode.href)) {
      return [];
    }

    items.push.apply(items, _toConsumableArray(getCleanNode(childNode))); // eslint-disable-line @typescript-eslint/no-use-before-define
  }

  items.map(function (i) {
    return newNode.appendChild(i);
  });

  if (handleExportedLists(className, newNode, newWrapper)) {
    return [];
  }

  newWrapper.appendChild(newNode);
  return [newWrapper];
};

var isEmptyNode = function isEmptyNode(node) {
  if (node.nodeName === '#text') {
    return node.textContent === '';
  }

  if (node.nodeName === 'IMG') {
    return !node.src;
  }

  return node.innerHTML === '';
}; // replacing margin-left with padding-left since tinymce uses padding-left for indentation
// Google Docs uses pts but this replaces it with px since tinymce uses px


export var sanitizeIndentStyle = function sanitizeIndentStyle(node) {
  node.style.removeProperty('padding');
  var marginLeft = node.style.marginLeft;

  if (marginLeft) {
    // only paragraphs can be indented from the tinymce editor
    if (node.nodeName === 'P') {
      var marginLeftPx = Number(node.style.marginLeft.replace(/[A-Za-z]./, '')) * 1.333;
      var paddingLeft = marginLeftPx - marginLeftPx % 40;

      if (paddingLeft) {
        node.style.paddingLeft = paddingLeft + "px";
      }
    }
  }

  node.style.removeProperty('margin');
};
var inlineStyleSanitation = {
  border: ['TABLE', 'TD'],
  textDecoration: ['underline', 'line-through'],
  textAlign: ['center', 'right', 'justify'],
  backgroundColor: ['transparent', 'rgb(255, 255, 255)']
};
export var sanitizeInlineStyles = function sanitizeInlineStyles(node) {
  sanitizeIndentStyle(node);
  Object.keys(inlineStylePairs).forEach(function (styleName) {
    node.style.removeProperty(styleName);
  });

  if (!inlineStyleSanitation.border.includes(node.nodeName)) {
    node.style.removeProperty('border');
  }

  if (!inlineStyleSanitation.textDecoration.includes(node.style.textDecoration)) {
    node.style.removeProperty('text-decoration');
  }

  if (node.nodeName !== 'P' || !inlineStyleSanitation.textAlign.includes(node.style.textAlign)) {
    node.style.removeProperty('text-align');
  }

  if (inlineStyleSanitation.backgroundColor.includes(node.style.backgroundColor)) {
    node.style.removeProperty('background-color');
  }

  if (node.nodeName === 'LI') {
    node.style.removeProperty('font-size');
  }

  if (node.nodeName === 'SPAN' && node.style.length === 0 && node.firstChild) {
    if (node.childNodes.length === 1) {
      return node.firstChild;
    } else {
      return node;
    }
  }

  contextualStyleNames.forEach(function (styleName) {
    var styleValue = node.style[styleName];

    if (styleValue) {
      var addedLength = node.textContent.length;
      incrementContextualStyle(styleName, styleValue, addedLength);
    }
  });
  return node;
};

var getCleanNode = function getCleanNode(node) {
  if (node.nodeName === 'SPAN') {
    var _applyInlineStyles = applyInlineStyles(node),
        didStyle = _applyInlineStyles.didStyle,
        styledNode = _applyInlineStyles.styledNode;

    if (didStyle) {
      return [styledNode];
    }
  }

  if (node.nodeName !== '#text') {
    node = sanitizeInlineStyles(node);
  } // recursive base case: 0 or 1 child nodes, we always know how to handle this case


  if (node.childNodes && !isTableContainer(node) && (node.childNodes.length <= 1 || CHILD_NODES_OVERRIDES.includes(node.nodeName) || node.nodeName === 'DIV' && isCommentsStyle(node.style)) && !DOC_WRAPPER.test(node.id)) {
    var newWrapper = null; // create a new target node

    var newNode = document.createTextNode(node.textContent);

    if (LISTS.includes(node.nodeName) || TABLES.includes(node.nodeName) || HEADERS.includes(node.nodeName)) {
      return parseList(node);
    } else if (node.nodeName === 'P') {
      // Google is pretty consistent about new paragraphs in <p></p> tags tho...
      if (node.childNodes.length > 1) {
        return parseList(node);
      }

      newWrapper = node.cloneNode(false);
      newWrapper.removeAttribute('id');
      newWrapper.removeAttribute('class');
      var childNodes = getFlatChildNodes(node);

      if (childNodes.length === 0) {
        return [];
      } else if (childNodes.length > 1) {
        newNode = getCleanNode(node.childNodes[0]);
      } else {
        newNode = applyBlockStyles(node);
      }
    } else if (node.nodeName === '#text') {
      return [newNode];
    } else if (node.nodeName === 'BR' || node.nodeName === 'HR') {
      newNode = document.createElement(node.tagName);
      return [newNode];
    } else if (node.nodeName === 'IMG') {
      return [node.cloneNode(true)];
    } else if (node.nodeName === 'A') {
      if (isCommentHref(node.href)) {
        return [];
      } // wrap the child node(s) in an anchor


      var cleanChildren = [];

      for (var i = 0; i < node.childNodes.length; i++) {
        var cleanNode = getCleanNode(node.childNodes[i]);
        cleanChildren.push.apply(cleanChildren, _toConsumableArray(cleanNode));
      }

      if (cleanChildren.length === 0) {
        return [];
      }

      newNode = wrapNodeAnchor(cleanChildren, node.href);
      return [newNode];
    } else if (node.nodeName === 'DIV' && isCommentsStyle(node.style) && childrenHaveCommentStyle(node)) {
      return [];
    } else if (SPANBI.includes(node.nodeName)) {
      var _newNode;

      var _cleanChildren = [];

      for (var _i = 0; _i < node.childNodes.length; _i++) {
        var _cleanNode = getCleanNode(node.childNodes[_i]);

        _cleanChildren.push.apply(_cleanChildren, _toConsumableArray(_cleanNode));
      }

      if (_cleanChildren.length === 0) {
        return [];
      }

      switch (node.nodeName) {
        case 'I':
          newNode = document.createElement('em');
          break;

        case 'B':
          newNode = document.createElement('strong');
          break;

        case 'SPAN':
          if (_cleanChildren.length === 1 && _cleanChildren[0].nodeName === 'A') {
            newNode = _cleanChildren[0];
            sanitizeAnchorStyles(node);
            newNode.style.cssText = node.style.cssText;
            return [newNode];
          }

          newNode = node.cloneNode(false);
          break;

        default:
          newNode = node.cloneNode(false);
          break;
      }

      (_newNode = newNode).append.apply(_newNode, _cleanChildren);

      return [newNode];
    } else {
      newWrapper = node.cloneNode(false);
      newNode = node.childNodes.length ? getCleanNode(node.childNodes[0]) : [];
    }

    if (newWrapper) {
      if (Array.isArray(newNode)) {
        newNode.forEach(function (n) {
          if (!isEmptyNode(n)) {
            newWrapper.appendChild(n);
          }
        });
      } else {
        if (!isEmptyNode(newNode)) {
          newWrapper.appendChild(newNode);
        }
      }

      if (newWrapper.innerHTML === '') return [];
      return [newWrapper];
    } // if it's nothing that we want to specifically handle in the composer just return the node,
    // draft-js will clean it up for us


    return [node.cloneNode(true)];
  }

  if (node.childNodes) {
    var nodes = [];

    for (var _i2 = 0; _i2 < node.childNodes.length; _i2++) {
      var nextNode = getCleanNode(node.childNodes[_i2]);
      nodes.push.apply(nodes, _toConsumableArray(nextNode));
    }

    return nodes;
  }

  return [node];
};

var shouldKeepNode = function shouldKeepNode(node) {
  // Windows clipboards append the <!--StartFragment--> and <!--EndFragment--> which we don't want
  if (node.nodeName === '#comment') {
    return false;
  } // Ignore meta and style tags


  if (node.nodeName === 'META' || node.nodeName === 'STYLE') {
    return false;
  } // Windows clipboards seem to insert a stray space character at the start and end of body tag


  if (node.nodeName === '#text' && node.parentNode.nodeName === 'BODY' && (node.previousSibling === null && node.nextSibling || node.previousSibling && node.nextSibling === null)) {
    return false;
  }

  return true;
};

var getCleanDocument = function getCleanDocument(dirty) {
  resetContextualStyles();
  var body = document.createElement('body');
  var nodes = dirty.childNodes;
  var cleanNodes = [];

  for (var i = 0; i < nodes.length; i++) {
    if (shouldKeepNode(nodes[i])) {
      var cleanNode = getCleanNode(nodes[i]);
      cleanNodes.push.apply(cleanNodes, _toConsumableArray(cleanNode));
    }
  }

  cleanNodes.map(function (node) {
    return body.appendChild(node.cloneNode(true));
  });
  applyContextualStyles(body);
  listMap = {};
  return body;
};

export default function convertGoogleToHTML(clipboardContent) {
  var htmlParser = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : parseHTML;
  isValidPasteContent(clipboardContent);
  return getCleanDocument(htmlParser(clipboardContent.replace(/(\r\n|\n|\r)/, ''))).outerHTML;
}
export var convertGoogleDocToHTML = function convertGoogleDocToHTML(doc) {
  return convertGoogleToHTML(doc);
};