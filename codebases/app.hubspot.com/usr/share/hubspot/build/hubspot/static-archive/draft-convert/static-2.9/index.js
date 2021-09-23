'use es6';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { convertToRaw, ContentState, BlockMapBuilder, SelectionState, CharacterMetadata, ContentBlock, genKey, Entity } from 'draft-js';
import { List, OrderedSet, Map } from 'immutable';
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = process.env.NODE_ENV;

var invariant = function invariant(condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;

    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame

    throw error;
  }
};

var invariant_1 = invariant;

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function updateMutation(mutation, originalOffset, originalLength, newLength, prefixLength, suffixLength) {
  // three cases we can reasonably adjust - disjoint mutations that
  // happen later on where the offset will need to be changed,
  // mutations that completely contain the new one where we can adjust
  // the length, and mutations that occur partially within the new one.
  var lengthDiff = newLength - originalLength;
  var mutationAfterChange = originalOffset + originalLength <= mutation.offset;

  if (mutationAfterChange) {
    return Object.assign({}, mutation, {
      offset: mutation.offset + lengthDiff
    });
  }

  var mutationContainsChange = originalOffset >= mutation.offset && originalOffset + originalLength <= mutation.offset + mutation.length;

  if (mutationContainsChange) {
    return Object.assign({}, mutation, {
      length: mutation.length + lengthDiff
    });
  }

  var mutationWithinPrefixChange = mutation.offset >= originalOffset && mutation.offset + mutation.length <= originalOffset + originalLength && prefixLength > 0;

  if (mutationWithinPrefixChange) {
    return Object.assign({}, mutation, {
      offset: mutation.offset + prefixLength
    });
  }

  var mutationContainsPrefix = mutation.offset < originalOffset && mutation.offset + mutation.length <= originalOffset + originalLength && mutation.offset + mutation.length > originalOffset && prefixLength > 0;

  if (mutationContainsPrefix) {
    return [Object.assign({}, mutation, {
      length: originalOffset - mutation.offset
    }), Object.assign({}, mutation, {
      offset: originalOffset + prefixLength,
      length: mutation.offset - originalOffset + mutation.length
    })];
  }

  var mutationContainsSuffix = mutation.offset >= originalOffset && mutation.offset + mutation.length > originalOffset + originalLength && originalOffset + originalLength > mutation.offset && suffixLength > 0;

  if (mutationContainsSuffix) {
    return [Object.assign({}, mutation, {
      offset: mutation.offset + prefixLength,
      length: originalOffset + originalLength - mutation.offset
    }), Object.assign({}, mutation, {
      offset: originalOffset + originalLength + prefixLength + suffixLength,
      length: mutation.offset + mutation.length - (originalOffset + originalLength)
    })];
  }

  return mutation;
}

var rangeSort = function rangeSort(r1, r2) {
  if (r1.offset === r2.offset) {
    return r2.length - r1.length;
  }

  return r1.offset - r2.offset;
};

var ENTITY_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '\n': '<br/>'
};

var encodeBlock = function encodeBlock(block) {
  var blockText = _toConsumableArray(block.text);

  var entities = block.entityRanges.sort(rangeSort);
  var styles = block.inlineStyleRanges.sort(rangeSort);
  var resultText = '';

  var _loop = function _loop(index) {
    var _char = blockText[index];

    if (ENTITY_MAP[_char] !== undefined) {
      var encoded = ENTITY_MAP[_char];

      var resultIndex = _toConsumableArray(resultText).length;

      resultText += encoded;

      var updateForChar = function updateForChar(mutation) {
        return updateMutation(mutation, resultIndex, _char.length, encoded.length, 0, 0);
      };

      entities = entities.map(updateForChar);
      styles = styles.map(updateForChar);
    } else {
      resultText += _char;
    }
  };

  for (var index = 0; index < blockText.length; index++) {
    _loop(index);
  }

  return Object.assign({}, block, {
    text: resultText,
    inlineStyleRanges: styles,
    entityRanges: entities
  });
};

function _typeof2(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof2 = function _typeof2(obj) {
      return typeof obj;
    };
  } else {
    _typeof2 = function _typeof2(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof2(obj);
}

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

var VOID_TAGS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

function splitReactElement(element) {
  if (VOID_TAGS.indexOf(element.type) !== -1) {
    return ReactDOMServer.renderToStaticMarkup(element);
  }

  var tags = ReactDOMServer.renderToStaticMarkup( /*#__PURE__*/React.cloneElement(element, {}, '\r')).split('\r');
  invariant_1(tags.length > 1, "convertToHTML: Element of type ".concat(element.type, " must render children"));
  invariant_1(tags.length < 3, "convertToHTML: Element of type ".concat(element.type, " cannot use carriage return character"));
  return {
    start: tags[0],
    end: tags[1]
  };
}

function hasChildren(element) {
  return /*#__PURE__*/React.isValidElement(element) && React.Children.count(element.props.children) > 0;
}

function getElementHTML(element) {
  var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (element === undefined || element === null) {
    return element;
  }

  if (typeof element === 'string') {
    return element;
  }

  if ( /*#__PURE__*/React.isValidElement(element)) {
    if (hasChildren(element)) {
      return ReactDOMServer.renderToStaticMarkup(element);
    }

    var tags = splitReactElement(element);

    if (text !== null && _typeof(tags) === 'object') {
      var start = tags.start,
          end = tags.end;
      return start + text + end;
    }

    return tags;
  }

  invariant_1(Object.prototype.hasOwnProperty.call(element, 'start') && Object.prototype.hasOwnProperty.call(element, 'end'), 'convertToHTML: received conversion data without either an HTML string, ReactElement or an object with start/end tags');

  if (text !== null) {
    var _start = element.start,
        _end = element.end;
    return _start + text + _end;
  }

  return element;
}

var getElementTagLength = function getElementTagLength(element) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'start';

  if ( /*#__PURE__*/React.isValidElement(element)) {
    var splitElement = splitReactElement(element);

    if (typeof splitElement === 'string') {
      return 0;
    }

    var length = splitElement[type].length;
    var child = React.Children.toArray(element.props.children)[0];
    return length + (child && /*#__PURE__*/React.isValidElement(child) ? getElementTagLength(child, type) : 0);
  }

  if (_typeof(element) === 'object') {
    return element[type] ? element[type].length : 0;
  }

  return 0;
};

var converter = function converter() {
  var originalText = arguments.length > 1 ? arguments[1] : undefined;
  return originalText;
};

var blockEntities = function blockEntities(block, entityMap) {
  var entityConverter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : converter;

  var resultText = _toConsumableArray(block.text);

  var getEntityHTML = entityConverter;

  if (entityConverter.__isMiddleware) {
    getEntityHTML = entityConverter(converter);
  }

  if (Object.prototype.hasOwnProperty.call(block, 'entityRanges') && block.entityRanges.length > 0) {
    var entities = block.entityRanges.sort(rangeSort);
    var styles = block.inlineStyleRanges;

    var _loop = function _loop(index) {
      var entityRange = entities[index];
      var entity = entityMap[entityRange.key];
      var originalText = resultText.slice(entityRange.offset, entityRange.offset + entityRange.length).join('');
      var entityHTML = getEntityHTML(entity, originalText);
      var elementHTML = getElementHTML(entityHTML, originalText);
      var converted = void 0;

      if (!!elementHTML || elementHTML === '') {
        converted = _toConsumableArray(elementHTML);
      } else {
        converted = originalText;
      }

      var prefixLength = getElementTagLength(entityHTML, 'start');
      var suffixLength = getElementTagLength(entityHTML, 'end');

      var updateLaterMutation = function updateLaterMutation(mutation, mutationIndex) {
        if (mutationIndex > index || Object.prototype.hasOwnProperty.call(mutation, 'style')) {
          return updateMutation(mutation, entityRange.offset, entityRange.length, converted.length, prefixLength, suffixLength);
        }

        return mutation;
      };

      var updateLaterMutations = function updateLaterMutations(mutationList) {
        return mutationList.reduce(function (acc, mutation, mutationIndex) {
          var updatedMutation = updateLaterMutation(mutation, mutationIndex);

          if (Array.isArray(updatedMutation)) {
            return acc.concat(updatedMutation);
          }

          return acc.concat([updatedMutation]);
        }, []);
      };

      entities = updateLaterMutations(entities);
      styles = updateLaterMutations(styles);
      resultText = [].concat(_toConsumableArray(resultText.slice(0, entityRange.offset)), _toConsumableArray(converted), _toConsumableArray(resultText.slice(entityRange.offset + entityRange.length)));
    };

    for (var index = 0; index < entities.length; index++) {
      _loop(index);
    }

    return Object.assign({}, block, {
      text: resultText.join(''),
      inlineStyleRanges: styles,
      entityRanges: entities
    });
  }

  return block;
};

var styleObjectFunction = function styleObjectFunction(object) {
  return function (style) {
    if (typeof object === 'function') {
      return object(style);
    }

    return object[style];
  };
};

var accumulateFunction = function accumulateFunction(newFn, rest) {
  return function () {
    var newResult = newFn.apply(void 0, arguments);

    if (newResult !== undefined && newResult !== null) {
      return newResult;
    }

    return rest.apply(void 0, arguments);
  };
};

function defaultInlineHTML(style) {
  switch (style) {
    case 'BOLD':
      return /*#__PURE__*/React.createElement("strong", null);

    case 'ITALIC':
      return /*#__PURE__*/React.createElement("em", null);

    case 'UNDERLINE':
      return /*#__PURE__*/React.createElement("u", null);

    case 'CODE':
      return /*#__PURE__*/React.createElement("code", null);

    default:
      return {
        start: '',
        end: ''
      };
  }
}

var subtractStyles = function subtractStyles(original, toRemove) {
  return original.filter(function (el) {
    return !toRemove.some(function (elToRemove) {
      return elToRemove.style === el.style;
    });
  });
};

var popEndingStyles = function popEndingStyles(styleStack, endingStyles) {
  return endingStyles.reduceRight(function (stack, style) {
    var styleToRemove = stack[stack.length - 1];
    invariant_1(styleToRemove.style === style.style, "Style ".concat(styleToRemove.style, " to be removed doesn't match expected ").concat(style.style));
    return stack.slice(0, -1);
  }, styleStack);
};

var characterStyles = function characterStyles(offset, ranges) {
  return ranges.filter(function (range) {
    return offset >= range.offset && offset < range.offset + range.length;
  });
};

var rangeIsSubset = function rangeIsSubset(firstRange, secondRange) {
  // returns true if the second range is a subset of the first
  var secondStartWithinFirst = firstRange.offset <= secondRange.offset;
  var secondEndWithinFirst = firstRange.offset + firstRange.length >= secondRange.offset + secondRange.length;
  return secondStartWithinFirst && secondEndWithinFirst;
};

var latestStyleLast = function latestStyleLast(s1, s2) {
  // make sure longer-lasting styles are added first
  var s2endIndex = s2.offset + s2.length;
  var s1endIndex = s1.offset + s1.length;
  return s2endIndex - s1endIndex;
};

var getStylesToReset = function getStylesToReset(remainingStyles, newStyles) {
  var i = 0;

  while (i < remainingStyles.length) {
    if (newStyles.every(rangeIsSubset.bind(null, remainingStyles[i]))) {
      i++;
    } else {
      return remainingStyles.slice(i);
    }
  }

  return [];
};

var appendStartMarkup = function appendStartMarkup(inlineHTML, string, styleRange) {
  return string + getElementHTML(inlineHTML(styleRange.style)).start;
};

var prependEndMarkup = function prependEndMarkup(inlineHTML, string, styleRange) {
  return getElementHTML(inlineHTML(styleRange.style)).end + string;
};

var defaultCustomInlineHTML = function defaultCustomInlineHTML(next) {
  return function (style) {
    return next(style);
  };
};

defaultCustomInlineHTML.__isMiddleware = true;

var blockInlineStyles = function blockInlineStyles(rawBlock) {
  var customInlineHTML = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultCustomInlineHTML;
  invariant_1(rawBlock !== null && rawBlock !== undefined, 'Expected raw block to be non-null');
  var inlineHTML;

  if (customInlineHTML.__isMiddleware === true) {
    inlineHTML = customInlineHTML(defaultInlineHTML);
  } else {
    inlineHTML = accumulateFunction(styleObjectFunction(customInlineHTML), styleObjectFunction(defaultInlineHTML));
  }

  var result = '';
  var styleStack = [];
  var sortedRanges = rawBlock.inlineStyleRanges.sort(rangeSort);

  var originalTextArray = _toConsumableArray(rawBlock.text);

  for (var i = 0; i < originalTextArray.length; i++) {
    var styles = characterStyles(i, sortedRanges);
    var endingStyles = subtractStyles(styleStack, styles);
    var newStyles = subtractStyles(styles, styleStack);
    var remainingStyles = subtractStyles(styleStack, endingStyles); // reset styles: look for any already existing styles that will need to
    // end before styles that are being added on this character. to solve this
    // close out those current tags and all nested children,
    // then open new ones nested within the new styles.

    var resetStyles = getStylesToReset(remainingStyles, newStyles);
    var openingStyles = resetStyles.concat(newStyles).sort(latestStyleLast);
    var openingStyleTags = openingStyles.reduce(appendStartMarkup.bind(null, inlineHTML), '');
    var endingStyleTags = endingStyles.concat(resetStyles).reduce(prependEndMarkup.bind(null, inlineHTML), '');
    result += endingStyleTags + openingStyleTags + originalTextArray[i];
    styleStack = popEndingStyles(styleStack, resetStyles.concat(endingStyles));
    styleStack = styleStack.concat(openingStyles);
    invariant_1(styleStack.length === styles.length, "Character ".concat(i, ": ").concat(styleStack.length - styles.length, " styles left on stack that should no longer be there"));
  }

  result = styleStack.reduceRight(function (res, openStyle) {
    return res + getElementHTML(inlineHTML(openStyle.style)).end;
  }, result);
  return result;
};

var blockTypeObjectFunction = function blockTypeObjectFunction(typeObject) {
  return function (block) {
    if (typeof typeObject === 'function') {
      // handle case where typeObject is already a function
      return typeObject(block);
    }

    return typeObject[block.type];
  };
};

function hasChildren$1(element) {
  return /*#__PURE__*/React.isValidElement(element) && React.Children.count(element.props.children) > 0;
}

function getBlockTags(blockHTML) {
  invariant_1(blockHTML !== null && blockHTML !== undefined, 'Expected block HTML value to be non-null');

  if (typeof blockHTML === 'string') {
    return blockHTML;
  }

  if ( /*#__PURE__*/React.isValidElement(blockHTML)) {
    if (hasChildren$1(blockHTML)) {
      return ReactDOMServer.renderToStaticMarkup(blockHTML);
    }

    return splitReactElement(blockHTML);
  }

  if (Object.prototype.hasOwnProperty.call(blockHTML, 'element') && /*#__PURE__*/React.isValidElement(blockHTML.element)) {
    return Object.assign({}, blockHTML, splitReactElement(blockHTML.element));
  }

  invariant_1(Object.prototype.hasOwnProperty.call(blockHTML, 'start') && Object.prototype.hasOwnProperty.call(blockHTML, 'end'), 'convertToHTML: received block information without either a ReactElement or an object with start/end tags');
  return blockHTML;
}

function getNestedBlockTags(blockHTML, depth) {
  invariant_1(blockHTML !== null && blockHTML !== undefined, 'Expected block HTML value to be non-null');

  if (typeof blockHTML.nest === 'function') {
    var _splitReactElement = splitReactElement(blockHTML.nest(depth)),
        start = _splitReactElement.start,
        end = _splitReactElement.end;

    return Object.assign({}, blockHTML, {
      nestStart: start,
      nestEnd: end
    });
  }

  if ( /*#__PURE__*/React.isValidElement(blockHTML.nest)) {
    var _splitReactElement2 = splitReactElement(blockHTML.nest),
        _start = _splitReactElement2.start,
        _end = _splitReactElement2.end;

    return Object.assign({}, blockHTML, {
      nestStart: _start,
      nestEnd: _end
    });
  }

  invariant_1(Object.prototype.hasOwnProperty.call(blockHTML, 'nestStart') && Object.prototype.hasOwnProperty.call(blockHTML, 'nestEnd'), 'convertToHTML: received block information without either a ReactElement or an object with start/end tags');
  return blockHTML;
}

var ORDERED_LIST_TYPES = ['1', 'a', 'i'];
var defaultBlockHTML = {
  unstyled: /*#__PURE__*/React.createElement("p", null),
  paragraph: /*#__PURE__*/React.createElement("p", null),
  'header-one': /*#__PURE__*/React.createElement("h1", null),
  'header-two': /*#__PURE__*/React.createElement("h2", null),
  'header-three': /*#__PURE__*/React.createElement("h3", null),
  'header-four': /*#__PURE__*/React.createElement("h4", null),
  'header-five': /*#__PURE__*/React.createElement("h5", null),
  'header-six': /*#__PURE__*/React.createElement("h6", null),
  blockquote: /*#__PURE__*/React.createElement("blockquote", null),
  'unordered-list-item': {
    element: /*#__PURE__*/React.createElement("li", null),
    nest: /*#__PURE__*/React.createElement("ul", null)
  },
  'ordered-list-item': {
    element: /*#__PURE__*/React.createElement("li", null),
    nest: function nest(depth) {
      var type = ORDERED_LIST_TYPES[depth % 3];
      return /*#__PURE__*/React.createElement("ol", {
        type: type
      });
    }
  },
  media: /*#__PURE__*/React.createElement("figure", null),
  atomic: /*#__PURE__*/React.createElement("figure", null)
}; // import Immutable from 'immutable'; // eslint-disable-line no-unused-vars

var defaultEntityToHTML = function defaultEntityToHTML(entity, originalText) {
  return originalText;
};

var convertToHTML = function convertToHTML(_ref) {
  var _ref$styleToHTML = _ref.styleToHTML,
      styleToHTML = _ref$styleToHTML === void 0 ? {} : _ref$styleToHTML,
      _ref$blockToHTML = _ref.blockToHTML,
      blockToHTML = _ref$blockToHTML === void 0 ? {} : _ref$blockToHTML,
      _ref$entityToHTML = _ref.entityToHTML,
      entityToHTML = _ref$entityToHTML === void 0 ? defaultEntityToHTML : _ref$entityToHTML;
  return function (contentState) {
    invariant_1(contentState !== null && contentState !== undefined, 'Expected contentState to be non-null');
    var getBlockHTML;

    if (blockToHTML.__isMiddleware === true) {
      getBlockHTML = blockToHTML(blockTypeObjectFunction(defaultBlockHTML));
    } else {
      getBlockHTML = accumulateFunction(blockTypeObjectFunction(blockToHTML), blockTypeObjectFunction(defaultBlockHTML));
    }

    var rawState = convertToRaw(contentState);
    var listStack = [];
    var result = rawState.blocks.map(function (block) {
      var type = block.type,
          depth = block.depth;
      var closeNestTags = '';
      var openNestTags = '';
      var blockHTMLResult = getBlockHTML(block);

      if (!blockHTMLResult) {
        throw new Error("convertToHTML: missing HTML definition for block with type ".concat(block.type));
      }

      if (!blockHTMLResult.nest) {
        // this block can't be nested, so reset all nesting if necessary
        closeNestTags = listStack.reduceRight(function (string, nestedBlock) {
          return string + getNestedBlockTags(getBlockHTML(nestedBlock), depth).nestEnd;
        }, '');
        listStack = [];
      } else {
        while (depth + 1 !== listStack.length || type !== listStack[depth].type) {
          if (depth + 1 === listStack.length) {
            // depth is right but doesn't match type
            var blockToClose = listStack[depth];
            closeNestTags += getNestedBlockTags(getBlockHTML(blockToClose), depth).nestEnd;
            openNestTags += getNestedBlockTags(getBlockHTML(block), depth).nestStart;
            listStack[depth] = block;
          } else if (depth + 1 < listStack.length) {
            var _blockToClose = listStack[listStack.length - 1];
            closeNestTags += getNestedBlockTags(getBlockHTML(_blockToClose), depth).nestEnd;
            listStack = listStack.slice(0, -1);
          } else {
            openNestTags += getNestedBlockTags(getBlockHTML(block), depth).nestStart;
            listStack.push(block);
          }
        }
      }

      var innerHTML = blockInlineStyles(blockEntities(encodeBlock(block), rawState.entityMap, entityToHTML), styleToHTML);
      var blockHTML = getBlockTags(getBlockHTML(block));
      var html;

      if (typeof blockHTML === 'string') {
        html = blockHTML;
      } else {
        html = blockHTML.start + innerHTML + blockHTML.end;
      }

      if (innerHTML.length === 0 && Object.prototype.hasOwnProperty.call(blockHTML, 'empty')) {
        if ( /*#__PURE__*/React.isValidElement(blockHTML.empty)) {
          html = ReactDOMServer.renderToStaticMarkup(blockHTML.empty);
        } else {
          html = blockHTML.empty;
        }
      }

      return closeNestTags + openNestTags + html;
    }).join('');
    result = listStack.reduce(function (res, nestBlock) {
      return res + getNestedBlockTags(getBlockHTML(nestBlock), nestBlock.depth).nestEnd;
    }, result);
    return result;
  };
};

var convertToHTML$1 = function convertToHTML$1() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 1 && Object.prototype.hasOwnProperty.call(args[0], '_map') && args[0].getBlockMap != null) {
    // skip higher-order function and use defaults
    return convertToHTML({}).apply(void 0, args);
  }

  return convertToHTML.apply(void 0, args);
};

var fallback = function fallback(html) {
  var doc = document.implementation.createHTMLDocument('');
  doc.documentElement.innerHTML = html;
  return doc;
};

function parseHTML(html) {
  var doc;

  if (typeof DOMParser !== 'undefined') {
    var parser = new DOMParser();
    doc = parser.parseFromString(html, 'text/html');

    if (doc === null || doc.body === null) {
      doc = fallback(html);
    }
  } else {
    doc = fallback(html);
  }

  return doc.body;
}
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the /src directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */


var NBSP = '&nbsp;';
var SPACE = ' '; // Arbitrary max indent

var MAX_DEPTH = 4; // used for replacing characters in HTML

/* eslint-disable no-control-regex */

var REGEX_CR = new RegExp('\r', 'g');
var REGEX_LF = new RegExp('\n', 'g');
var REGEX_NBSP = new RegExp(NBSP, 'g');
var REGEX_BLOCK_DELIMITER = new RegExp('\r', 'g');
/* eslint-enable no-control-regex */
// Block tag flow is different because LIs do not have
// a deterministic style ;_;

var blockTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'pre'];
var inlineTags = {
  b: 'BOLD',
  code: 'CODE',
  del: 'STRIKETHROUGH',
  em: 'ITALIC',
  i: 'ITALIC',
  s: 'STRIKETHROUGH',
  strike: 'STRIKETHROUGH',
  strong: 'BOLD',
  u: 'UNDERLINE'
};

var handleMiddleware = function handleMiddleware(maybeMiddleware, base) {
  if (maybeMiddleware && maybeMiddleware.__isMiddleware === true) {
    return maybeMiddleware(base);
  }

  return maybeMiddleware;
};

var defaultHTMLToBlock = function defaultHTMLToBlock(nodeName, node, lastList) {
  return undefined;
};

var defaultHTMLToStyle = function defaultHTMLToStyle(nodeName, node, currentStyle) {
  return currentStyle;
};

var defaultHTMLToEntity = function defaultHTMLToEntity(nodeName, node) {
  return undefined;
};

var defaultTextToEntity = function defaultTextToEntity(text) {
  return [];
};

var nullthrows = function nullthrows(x) {
  if (x != null) {
    return x;
  }

  throw new Error('Got unexpected null or undefined');
};

var sanitizeDraftText = function sanitizeDraftText(input) {
  return input.replace(REGEX_BLOCK_DELIMITER, '');
};

function getEmptyChunk() {
  return {
    text: '',
    inlines: [],
    entities: [],
    blocks: []
  };
}

function getWhitespaceChunk(inEntity) {
  var entities = new Array(1);

  if (inEntity) {
    entities[0] = inEntity;
  }

  return {
    text: SPACE,
    inlines: [OrderedSet()],
    entities: entities,
    blocks: []
  };
}

function getSoftNewlineChunk(block, depth) {
  var flat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Map();

  if (flat === true) {
    return {
      text: '\r',
      inlines: [OrderedSet()],
      entities: new Array(1),
      blocks: [{
        type: block,
        data: data,
        depth: Math.max(0, Math.min(MAX_DEPTH, depth))
      }],
      isNewline: true
    };
  }

  return {
    text: '\n',
    inlines: [OrderedSet()],
    entities: new Array(1),
    blocks: []
  };
}

function getBlockDividerChunk(block, depth) {
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Map();
  return {
    text: '\r',
    inlines: [OrderedSet()],
    entities: new Array(1),
    blocks: [{
      type: block,
      data: data,
      depth: Math.max(0, Math.min(MAX_DEPTH, depth))
    }]
  };
}

function getBlockTypeForTag(tag, lastList) {
  switch (tag) {
    case 'h1':
      return 'header-one';

    case 'h2':
      return 'header-two';

    case 'h3':
      return 'header-three';

    case 'h4':
      return 'header-four';

    case 'h5':
      return 'header-five';

    case 'h6':
      return 'header-six';

    case 'li':
      if (lastList === 'ol') {
        return 'ordered-list-item';
      }

      return 'unordered-list-item';

    case 'blockquote':
      return 'blockquote';

    case 'pre':
      return 'code-block';

    case 'div':
    case 'p':
      return 'unstyled';

    default:
      return null;
  }
}

function baseCheckBlockType(nodeName, node, lastList) {
  return getBlockTypeForTag(nodeName, lastList);
}

function processInlineTag(tag, node, currentStyle) {
  var styleToCheck = inlineTags[tag];

  if (styleToCheck) {
    currentStyle = currentStyle.add(styleToCheck).toOrderedSet();
  } else if (node instanceof HTMLElement) {
    var htmlElement = node;
    currentStyle = currentStyle.withMutations(function (style) {
      if (htmlElement.style.fontWeight === 'bold') {
        style.add('BOLD');
      }

      if (htmlElement.style.fontStyle === 'italic') {
        style.add('ITALIC');
      }

      if (htmlElement.style.textDecoration === 'underline') {
        style.add('UNDERLINE');
      }

      if (htmlElement.style.textDecoration === 'line-through') {
        style.add('STRIKETHROUGH');
      }
    }).toOrderedSet();
  }

  return currentStyle;
}

function baseProcessInlineTag(tag, node) {
  var inlineStyles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : OrderedSet();
  return processInlineTag(tag, node, inlineStyles);
}

function joinChunks(A, B) {
  var flat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false; // Sometimes two blocks will touch in the DOM and we need to strip the
  // extra delimiter to preserve niceness.

  var firstInB = B.text.slice(0, 1);
  var lastInA = A.text.slice(-1);
  var adjacentDividers = lastInA === '\r' && firstInB === '\r';
  var isJoiningBlocks = A.text !== '\r' && B.text !== '\r'; // when joining two full blocks like this we want to pop one divider

  var addingNewlineToEmptyBlock = A.text === '\r' && !A.isNewline && B.isNewline; // when joining a newline to an empty block we want to remove the newline

  if (adjacentDividers && (isJoiningBlocks || addingNewlineToEmptyBlock)) {
    A.text = A.text.slice(0, -1);
    A.inlines.pop();
    A.entities.pop();
    A.blocks.pop();
  } // Kill whitespace after blocks if flat mode is on


  if (A.text.slice(-1) === '\r' && flat === true) {
    if (B.text === SPACE || B.text === '\n') {
      return A;
    } else if (firstInB === SPACE || firstInB === '\n') {
      B.text = B.text.slice(1);
      B.inlines.shift();
      B.entities.shift();
    }
  }

  var isNewline = A.text.length === 0 && B.isNewline;
  return {
    text: A.text + B.text,
    inlines: A.inlines.concat(B.inlines),
    entities: A.entities.concat(B.entities),
    blocks: A.blocks.concat(B.blocks),
    isNewline: isNewline
  };
}
/*
 * Check to see if we have anything like <p> <blockquote> <h1>... to create
 * block tags from. If we do, we can use those and ignore <div> tags. If we
 * don't, we can treat <div> tags as meaningful (unstyled) blocks.
 */


function containsSemanticBlockMarkup(html) {
  return blockTags.some(function (tag) {
    return html.indexOf("<".concat(tag)) !== -1;
  });
}

function genFragment(node, inlineStyle, lastList, inBlock, fragmentBlockTags, depth, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options, inEntity) {
  var nodeName = node.nodeName.toLowerCase();
  var newBlock = false;
  var nextBlockType = 'unstyled'; // Base Case

  if (nodeName === '#text') {
    var text = node.textContent;

    if (text.trim() === '' && inBlock === null) {
      return getEmptyChunk();
    }

    if (text.trim() === '' && inBlock !== 'code-block') {
      return getWhitespaceChunk(inEntity);
    }

    if (inBlock !== 'code-block') {
      // Can't use empty string because MSWord
      text = text.replace(REGEX_LF, SPACE);
    }

    var entities = Array(text.length).fill(inEntity);
    var offsetChange = 0;
    var textEntities = checkEntityText(text, createEntity, getEntity, mergeEntityData, replaceEntityData).sort(rangeSort);
    textEntities.forEach(function (_ref) {
      var entity = _ref.entity,
          offset = _ref.offset,
          length = _ref.length,
          result = _ref.result;
      var adjustedOffset = offset + offsetChange;

      if (result === null || result === undefined) {
        result = text.substr(adjustedOffset, length);
      }

      var textArray = text.split('');
      textArray.splice.bind(textArray, adjustedOffset, length).apply(textArray, result.split(''));
      text = textArray.join('');
      entities.splice.bind(entities, adjustedOffset, length).apply(entities, Array(result.length).fill(entity));
      offsetChange += result.length - length;
    });
    return {
      text: text,
      inlines: Array(text.length).fill(inlineStyle),
      entities: entities,
      blocks: []
    };
  } // BR tags


  if (nodeName === 'br') {
    var _blockType = inBlock;

    if (_blockType === null) {
      //  BR tag is at top level, treat it as an unstyled block
      return getSoftNewlineChunk('unstyled', depth, true);
    }

    return getSoftNewlineChunk(_blockType || 'unstyled', depth, options.flat);
  }

  var chunk = getEmptyChunk();
  var newChunk = null; // Inline tags

  inlineStyle = processInlineTag(nodeName, node, inlineStyle);
  inlineStyle = processCustomInlineStyles(nodeName, node, inlineStyle); // Handle lists

  if (nodeName === 'ul' || nodeName === 'ol') {
    if (lastList) {
      depth += 1;
    }

    lastList = nodeName;
    inBlock = null;
  } // Block Tags


  var blockInfo = checkBlockType(nodeName, node, lastList, inBlock);
  var blockType;
  var blockDataMap;

  if (blockInfo === false) {
    return getEmptyChunk();
  }

  blockInfo = blockInfo || {};

  if (typeof blockInfo === 'string') {
    blockType = blockInfo;
    blockDataMap = Map();
  } else {
    blockType = typeof blockInfo === 'string' ? blockInfo : blockInfo.type;
    blockDataMap = blockInfo.data ? Map(blockInfo.data) : Map();
  }

  if (!inBlock && (fragmentBlockTags.indexOf(nodeName) !== -1 || blockType)) {
    chunk = getBlockDividerChunk(blockType || getBlockTypeForTag(nodeName, lastList), depth, blockDataMap);
    inBlock = blockType || getBlockTypeForTag(nodeName, lastList);
    newBlock = true;
  } else if (lastList && (inBlock === 'ordered-list-item' || inBlock === 'unordered-list-item') && nodeName === 'li') {
    var listItemBlockType = getBlockTypeForTag(nodeName, lastList);
    chunk = getBlockDividerChunk(listItemBlockType, depth);
    inBlock = listItemBlockType;
    newBlock = true;
    nextBlockType = lastList === 'ul' ? 'unordered-list-item' : 'ordered-list-item';
  } else if (inBlock && inBlock !== 'atomic' && blockType === 'atomic') {
    inBlock = blockType;
    newBlock = true;
    chunk = getSoftNewlineChunk(blockType, depth, true, // atomic blocks within non-atomic blocks must always be split out
    blockDataMap);
  } // Recurse through children


  var child = node.firstChild; // hack to allow conversion of atomic blocks from HTML (e.g. <figure><img
  // src="..." /></figure>). since metadata must be stored on an entity text
  // must exist for the entity to apply to. the way chunks are joined strips
  // whitespace at the end so it cannot be a space character.

  if (child == null && inEntity && (blockType === 'atomic' || inBlock === 'atomic')) {
    child = document.createTextNode('a');
  }

  if (child != null) {
    nodeName = child.nodeName.toLowerCase();
  }

  var entityId = null;

  while (child) {
    entityId = checkEntityNode(nodeName, child, createEntity, getEntity, mergeEntityData, replaceEntityData);
    newChunk = genFragment(child, inlineStyle, lastList, inBlock, fragmentBlockTags, depth, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options, entityId || inEntity);
    chunk = joinChunks(chunk, newChunk, options.flat);
    var sibling = child.nextSibling; // Put in a newline to break up blocks inside blocks

    if (sibling && fragmentBlockTags.indexOf(nodeName) >= 0 && inBlock) {
      var newBlockInfo = checkBlockType(nodeName, child, lastList, inBlock);
      var newBlockType = void 0;
      var newBlockData = void 0;

      if (newBlockInfo !== false) {
        newBlockInfo = newBlockInfo || {};

        if (typeof newBlockInfo === 'string') {
          newBlockType = newBlockInfo;
          newBlockData = Map();
        } else {
          newBlockType = newBlockInfo.type || getBlockTypeForTag(nodeName, lastList);
          newBlockData = newBlockInfo.data ? Map(newBlockInfo.data) : Map();
        }

        chunk = joinChunks(chunk, getSoftNewlineChunk(newBlockType, depth, options.flat, newBlockData), options.flat);
      }
    }

    if (sibling) {
      nodeName = sibling.nodeName.toLowerCase();
    }

    child = sibling;
  }

  if (newBlock) {
    chunk = joinChunks(chunk, getBlockDividerChunk(nextBlockType, depth, Map()), options.flat);
  }

  return chunk;
}

function getChunkForHTML(html, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options, DOMBuilder) {
  html = html.trim().replace(REGEX_CR, '').replace(REGEX_NBSP, SPACE);
  var safeBody = DOMBuilder(html);

  if (!safeBody) {
    return null;
  } // Sometimes we aren't dealing with content that contains nice semantic
  // tags. In this case, use divs to separate everything out into paragraphs
  // and hope for the best.


  var workingBlocks = containsSemanticBlockMarkup(html) ? blockTags.concat(['div']) : ['div']; // Start with -1 block depth to offset the fact that we are passing in a fake
  // UL block to sta rt with.

  var chunk = genFragment(safeBody, OrderedSet(), 'ul', null, workingBlocks, -1, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options); // join with previous block to prevent weirdness on paste

  if (chunk.text.indexOf('\r') === 0) {
    chunk = {
      text: chunk.text.slice(1),
      inlines: chunk.inlines.slice(1),
      entities: chunk.entities.slice(1),
      blocks: chunk.blocks
    };
  } // Kill block delimiter at the end


  if (chunk.text.slice(-1) === '\r') {
    chunk.text = chunk.text.slice(0, -1);
    chunk.inlines = chunk.inlines.slice(0, -1);
    chunk.entities = chunk.entities.slice(0, -1);
    chunk.blocks.pop();
  } // If we saw no block tags, put an unstyled one in


  if (chunk.blocks.length === 0) {
    chunk.blocks.push({
      type: 'unstyled',
      data: Map(),
      depth: 0
    });
  } // Sometimes we start with text that isn't in a block, which is then
  // followed by blocks. Need to fix up the blocks to add in
  // an unstyled block for this content


  if (chunk.text.split('\r').length === chunk.blocks.length + 1) {
    chunk.blocks.unshift({
      type: 'unstyled',
      data: Map(),
      depth: 0
    });
  }

  return chunk;
}

function convertFromHTMLtoContentBlocks(html, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options, DOMBuilder, generateKey) {
  // Be ABSOLUTELY SURE that the dom builder you pass hare won't execute
  // arbitrary code in whatever environment you're running this in. For an
  // example of how we try to do this in-browser, see getSafeBodyFromHTML.
  var chunk = getChunkForHTML(html, processCustomInlineStyles, checkEntityNode, checkEntityText, checkBlockType, createEntity, getEntity, mergeEntityData, replaceEntityData, options, DOMBuilder);

  if (chunk == null) {
    return [];
  }

  var start = 0;
  return chunk.text.split('\r').map(function (textBlock, blockIndex) {
    // Make absolutely certain that our text is acceptable.
    textBlock = sanitizeDraftText(textBlock);
    var end = start + textBlock.length;
    var inlines = nullthrows(chunk).inlines.slice(start, end);
    var entities = nullthrows(chunk).entities.slice(start, end);
    var characterList = List(inlines.map(function (style, entityIndex) {
      var data = {
        style: style,
        entity: null
      };

      if (entities[entityIndex]) {
        data.entity = entities[entityIndex];
      }

      return CharacterMetadata.create(data);
    }));
    start = end + 1;
    return new ContentBlock({
      key: generateKey(),
      type: nullthrows(chunk).blocks[blockIndex].type,
      data: nullthrows(chunk).blocks[blockIndex].data,
      depth: nullthrows(chunk).blocks[blockIndex].depth,
      text: textBlock,
      characterList: characterList
    });
  });
}

var convertFromHTML = function convertFromHTML(_ref2) {
  var _ref2$htmlToStyle = _ref2.htmlToStyle,
      htmlToStyle = _ref2$htmlToStyle === void 0 ? defaultHTMLToStyle : _ref2$htmlToStyle,
      _ref2$htmlToEntity = _ref2.htmlToEntity,
      htmlToEntity = _ref2$htmlToEntity === void 0 ? defaultHTMLToEntity : _ref2$htmlToEntity,
      _ref2$textToEntity = _ref2.textToEntity,
      textToEntity = _ref2$textToEntity === void 0 ? defaultTextToEntity : _ref2$textToEntity,
      _ref2$htmlToBlock = _ref2.htmlToBlock,
      htmlToBlock = _ref2$htmlToBlock === void 0 ? defaultHTMLToBlock : _ref2$htmlToBlock;
  return function (html) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      flat: false
    };
    var DOMBuilder = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : parseHTML;
    var generateKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : genKey;
    var contentState = ContentState.createFromText('');

    var createEntityWithContentState = function createEntityWithContentState() {
      if (contentState.createEntity) {
        var _contentState;

        contentState = (_contentState = contentState).createEntity.apply(_contentState, arguments);
        return contentState.getLastCreatedEntityKey();
      }

      return Entity.create.apply(Entity, arguments);
    };

    var getEntityWithContentState = function getEntityWithContentState() {
      if (contentState.getEntity) {
        var _contentState2;

        return (_contentState2 = contentState).getEntity.apply(_contentState2, arguments);
      }

      return Entity.get.apply(Entity, arguments);
    };

    var mergeEntityDataWithContentState = function mergeEntityDataWithContentState() {
      if (contentState.mergeEntityData) {
        var _contentState3;

        contentState = (_contentState3 = contentState).mergeEntityData.apply(_contentState3, arguments);
        return;
      }

      Entity.mergeData.apply(Entity, arguments);
    };

    var replaceEntityDataWithContentState = function replaceEntityDataWithContentState() {
      if (contentState.replaceEntityData) {
        var _contentState4;

        contentState = (_contentState4 = contentState).replaceEntityData.apply(_contentState4, arguments);
        return;
      }

      Entity.replaceData.apply(Entity, arguments);
    };

    var contentBlocks = convertFromHTMLtoContentBlocks(html, handleMiddleware(htmlToStyle, baseProcessInlineTag), handleMiddleware(htmlToEntity, defaultHTMLToEntity), handleMiddleware(textToEntity, defaultTextToEntity), handleMiddleware(htmlToBlock, baseCheckBlockType), createEntityWithContentState, getEntityWithContentState, mergeEntityDataWithContentState, replaceEntityDataWithContentState, options, DOMBuilder, generateKey);
    var blockMap = BlockMapBuilder.createFromArray(contentBlocks);
    var firstBlockKey = contentBlocks[0].getKey();
    return contentState.merge({
      blockMap: blockMap,
      selectionBefore: SelectionState.createEmpty(firstBlockKey),
      selectionAfter: SelectionState.createEmpty(firstBlockKey)
    });
  };
};

var convertFromHTML$1 = function convertFromHTML$1() {
  if (arguments.length >= 1 && typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'string') {
    return convertFromHTML({}).apply(void 0, arguments);
  }

  return convertFromHTML.apply(void 0, arguments);
};

export { convertFromHTML$1 as convertFromHTML, convertToHTML$1 as convertToHTML, parseHTML };