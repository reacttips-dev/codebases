'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { convertRgbStringToHex, RGB_PATTERN } from '../utils/color';
import { forEachNode } from '../utils/dom';
import isValidPasteContent from '../utils/isValidPasteContent';
import parseHTML from '../utils/parseHTML';
var MS_LIST_FIRST = 'MsoListParagraphCxSpFirst';
var MS_LIST_MIDDLE = 'MsoListParagraphCxSpMiddle';
var MS_LIST_LAST = 'MsoListParagraphCxSpLast';
var MSFT_LIST_CLASSNAMES = [MS_LIST_FIRST, MS_LIST_MIDDLE, MS_LIST_LAST];
var MSFT_IGNORE = /mso-list:Ignore/;
export var LINK_COLOR = '#1155cc';
export var CONVERT_MSWORD_TO_HTML = 'msword'; // trailing 'o' is intentional: MS Word literally
// uses an 'o' character sometimes

var MS_BULLET_REGEX = /[\u2022\u00b7\u00a7\u25CFoo]/g;
var MS_LIST_PSEUDO_STYLE = 'mso-list:Ignore';

var getListType = function getListType(node) {
  var fakeStyleNode = node.querySelector("[style='" + MS_LIST_PSEUDO_STYLE + "']");
  var isBullet = fakeStyleNode && fakeStyleNode.textContent.trim().match(MS_BULLET_REGEX);

  if (isBullet) {
    return 'ul';
  }

  return 'ol';
};

var MS_LEVEL_REGEX = /mso-list:\w+\slevel(\d)\s/;

var getListDepth = function getListDepth(node) {
  var style = node.getAttribute('style');
  var match = style.match(MS_LEVEL_REGEX);
  var level = match && match[1];

  if (!level) {
    return 1;
  }

  return parseInt(level, 10);
};

var createListItem = function createListItem(node) {
  var listItem = document.createElement('li');
  forEachNode(function (child) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getCleanNode(child).forEach(function (cleanChild) {
      listItem.appendChild(cleanChild);
    });
  }, node.childNodes);
  return listItem;
};

var diveToListDepth = function diveToListDepth(node, depth) {
  var currentDepth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  if (depth === currentDepth) {
    return node;
  }

  var nextPossibleParent = node.querySelector('ol, ul');

  if (!nextPossibleParent) {
    return node;
  }

  return diveToListDepth(nextPossibleParent, depth, currentDepth + 1);
};

var parseList = function parseList(node) {
  var currentDepth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var currentParent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var listType = getListType(node);
  var newDepth = getListDepth(node);
  var listItem = createListItem(node);
  var listParent = currentParent && currentParent.cloneNode(true) || document.createElement(listType);
  var sibling = node.nextElementSibling;

  if (!sibling || !MSFT_LIST_CLASSNAMES.includes(sibling.className)) {
    // base case: no further list nodes
    listParent.appendChild(listItem);
    return listParent;
  } else if (newDepth === currentDepth) {
    // current node and sibling are also list siblings
    var targetParent = diveToListDepth(listParent, currentDepth);
    targetParent.appendChild(listItem);
    return parseList(sibling, newDepth, listParent);
  } else if (newDepth < currentDepth) {
    // going UP a nesting level
    var _targetParent = diveToListDepth(listParent, newDepth);

    _targetParent.appendChild(listItem);

    return parseList(sibling, newDepth, listParent);
  } else {
    // newDepth > currentDepth -> going DOWN a nesting level
    var newList = document.createElement(listType);
    newList.appendChild(listItem);

    var _targetParent2 = diveToListDepth(listParent, currentDepth);

    _targetParent2.appendChild(newList);

    return parseList(sibling, newDepth, listParent);
  }
}; // turn margin into padding -- TinyMCE uses padding in its indentation plugin --
// unless we're an li in which case we remove it entirely since MS Word
// includes print spacing in its lists which is unnecessary in the browser


var processIndentationStyles = function processIndentationStyles(node) {
  var deep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (node.childNodes && deep) {
    // need to process child indentation styles too
    // first process this node
    var newParent = processIndentationStyles(node, false); // recurse over children (some of whom might have their own children)

    forEachNode(function (child) {
      newParent.appendChild(processIndentationStyles(child, true));
    }, node.childNodes);
    return newParent;
  } else {
    // just processes this node
    // we still respect the deep param here because other
    // recursive fns might want to just clone a parent
    // like we do in our if case above
    var newNode = node.cloneNode(deep);

    if (!newNode.style) {
      return newNode;
    }

    var currentLeft = newNode.style.marginLeft;

    if (newNode.nodeName === 'LI' && currentLeft) {
      newNode.style.marginLeft = null;
    } else if (currentLeft) {
      newNode.style.paddingLeft = currentLeft;
      newNode.style.marginLeft = null;
    }

    return newNode;
  }
};

var getCleanNode = function getCleanNode(node) {
  // base case
  if (node.childNodes && node.childNodes.length <= 1) {
    if (node.nodeName === '#comment') {
      return []; // don't want comments
    }

    if (node.outerHTML && node.outerHTML.match(MSFT_IGNORE)) {
      return []; // MS says ignore, we ignore
    }

    var newNode = processIndentationStyles(node, true);

    if (newNode.nodeName === 'A') {
      var firstChild = newNode.firstChild;

      if (!firstChild) {
        return []; // don't return empty links
      }

      if (firstChild.nodeName === 'SPAN' && firstChild.style) {
        // possibly dealing with link-specific inline styles
        var color = firstChild.style.color;
        var match = color && color.match(RGB_PATTERN);

        if (!match) {
          if (color === 'blue') {
            firstChild.style.color = null;
          }
        } else if (color && convertRgbStringToHex(color) === LINK_COLOR) {
          // we handle coloring links without using inline styles in the editors
          firstChild.style.color = null;
        }
      }
    }

    return [newNode];
  } // list case


  if (node.className === MS_LIST_FIRST) {
    return [parseList(node)];
  }

  if (node.className === MS_LIST_MIDDLE || node.className === MS_LIST_LAST) {
    return []; // parseList handles all list nodes so we skip the rest
  } // recursive (non-list) case


  if (node.childNodes) {
    var _newNode = processIndentationStyles(node, false);

    var cleanChildren = [];
    forEachNode(function (child) {
      cleanChildren.push.apply(cleanChildren, _toConsumableArray(getCleanNode(child)));
    }, node.childNodes);
    cleanChildren.forEach(function (childNode) {
      _newNode.appendChild(childNode);
    });
    return [_newNode];
  } // fallback case, namely node.childNodes == null


  return [processIndentationStyles(node)];
};

var getCleanDocument = function getCleanDocument(dirty) {
  var body = document.createElement('body');
  var nodes = dirty.childNodes;
  forEachNode(function (node) {
    getCleanNode(node).forEach(function (cleanNode) {
      body.appendChild(cleanNode);
    });
  }, nodes);
  return body;
};

export default function convertMSWordToHtml(clipboardContent) {
  var htmlParser = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : parseHTML;
  isValidPasteContent(clipboardContent);
  return getCleanDocument(htmlParser(clipboardContent.replace(/(\r\n|\n|\r)/, ''))).outerHTML;
}