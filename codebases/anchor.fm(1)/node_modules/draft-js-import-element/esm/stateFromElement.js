function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import replaceTextWithMeta from './lib/replaceTextWithMeta';
import { CharacterMetadata, ContentBlock, ContentState, genKey } from 'draft-js';
import { List, Map, OrderedSet, Repeat, Seq } from 'immutable';
import { BLOCK_TYPE, ENTITY_TYPE, INLINE_STYLE } from 'draft-js-utils';
import { NODE_TYPE_ELEMENT, NODE_TYPE_TEXT } from 'synthetic-dom';
import { INLINE_ELEMENTS, SPECIAL_ELEMENTS, SELF_CLOSING_ELEMENTS } from './lib/Constants';
var DATA_URL = /^data:/i;
var NO_STYLE = OrderedSet();
var NO_ENTITY = null;
var EMPTY_BLOCK = new ContentBlock({
  key: genKey(),
  text: '',
  type: BLOCK_TYPE.UNSTYLED,
  characterList: List(),
  depth: 0
});
var LINE_BREAKS = /(\r\n|\r|\n)/g; // We use `\r` because that character is always stripped from source (normalized
// to `\n`), so it's safe to assume it will only appear in the text content when
// we put it there as a placeholder.

var SOFT_BREAK_PLACEHOLDER = '\r';
var ZERO_WIDTH_SPACE = "\u200B";
var DATA_ATTRIBUTE = /^data-([a-z0-9-]+)$/; // Map element attributes to entity data.

var ELEM_ATTR_MAP = {
  a: {
    href: 'url',
    rel: 'rel',
    target: 'target',
    title: 'title'
  },
  img: {
    src: 'src',
    alt: 'alt',
    width: 'width',
    height: 'height'
  }
};

var getEntityData = function getEntityData(tagName, element) {
  var data = {};

  if (ELEM_ATTR_MAP.hasOwnProperty(tagName)) {
    var attrMap = ELEM_ATTR_MAP[tagName];

    for (var i = 0; i < element.attributes.length; i++) {
      var _element$attributes$i = element.attributes[i],
          name = _element$attributes$i.name,
          value = _element$attributes$i.value;

      if (typeof value === 'string') {
        var strVal = value;

        if (attrMap.hasOwnProperty(name)) {
          var newName = attrMap[name];
          data[newName] = strVal;
        } else if (DATA_ATTRIBUTE.test(name)) {
          data[name] = strVal;
        }
      }
    }
  }

  return data;
}; // Functions to create entities from elements.


var ElementToEntity = {
  a: function a(generator, tagName, element) {
    var data = getEntityData(tagName, element); // Don't add `<a>` elements with invalid href.

    if (isAllowedHref(data.url)) {
      return generator.createEntity(ENTITY_TYPE.LINK, data);
    }
  },
  img: function img(generator, tagName, element) {
    var data = getEntityData(tagName, element); // Don't add `<img>` elements with no src.

    if (data.src != null) {
      return generator.createEntity(ENTITY_TYPE.IMAGE, data);
    }
  }
};

var ContentGenerator =
/*#__PURE__*/
function () {
  // This will be passed to the customInlineFn to allow it
  // to return a Style() or Entity().
  function ContentGenerator() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ContentGenerator);

    _defineProperty(this, "contentStateForEntities", void 0);

    _defineProperty(this, "blockStack", void 0);

    _defineProperty(this, "blockList", void 0);

    _defineProperty(this, "depth", void 0);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "inlineCreators", {
      Style: function (_Style) {
        function Style(_x) {
          return _Style.apply(this, arguments);
        }

        Style.toString = function () {
          return _Style.toString();
        };

        return Style;
      }(function (style) {
        return {
          type: 'STYLE',
          style: style
        };
      }),
      Entity: function Entity(type, data) {
        var mutability = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'MUTABLE';
        return {
          type: 'ENTITY',
          entityKey: _this.createEntity(type, toStringMap(data), mutability)
        };
      }
    });

    this.options = options;
    this.contentStateForEntities = ContentState.createFromBlockArray([]); // This represents the hierarchy as we traverse nested elements; for
    // example [body, ul, li] where we must know li's parent type (ul or ol).

    this.blockStack = []; // This is a linear list of blocks that will form the output; for example
    // [p, li, li, blockquote].

    this.blockList = [];
    this.depth = 0;
  }

  _createClass(ContentGenerator, [{
    key: "process",
    value: function process(element) {
      this.processBlockElement(element);
      var contentBlocks = [];
      this.blockList.forEach(function (block) {
        var _concatFragments = concatFragments(block.textFragments),
            text = _concatFragments.text,
            characterMeta = _concatFragments.characterMeta;

        var includeEmptyBlock = false; // If the block contains only a soft break then don't discard the block,
        // but discard the soft break.

        if (text === SOFT_BREAK_PLACEHOLDER) {
          includeEmptyBlock = true;
          text = '';
        }

        if (block.tagName === 'pre') {
          var _trimLeadingNewline = trimLeadingNewline(text, characterMeta);

          text = _trimLeadingNewline.text;
          characterMeta = _trimLeadingNewline.characterMeta;
        } else {
          var _collapseWhiteSpace = collapseWhiteSpace(text, characterMeta);

          text = _collapseWhiteSpace.text;
          characterMeta = _collapseWhiteSpace.characterMeta;
        } // Previously we were using a placeholder for soft breaks. Now that we
        // have collapsed whitespace we can change it back to normal line breaks.


        text = text.split(SOFT_BREAK_PLACEHOLDER).join('\n'); // Discard empty blocks (unless otherwise specified).

        if (text.length || includeEmptyBlock) {
          contentBlocks.push(new ContentBlock({
            key: genKey(),
            text: text,
            type: block.type,
            characterList: characterMeta.toList(),
            depth: block.depth,
            data: block.data ? Map(block.data) : Map()
          }));
        }
      });

      if (!contentBlocks.length) {
        contentBlocks = [EMPTY_BLOCK];
      }

      return ContentState.createFromBlockArray(contentBlocks, this.contentStateForEntities.getEntityMap());
    }
  }, {
    key: "getBlockTypeFromTagName",
    value: function getBlockTypeFromTagName(tagName) {
      var blockTypes = this.options.blockTypes;

      if (blockTypes && blockTypes[tagName]) {
        return blockTypes[tagName];
      }

      switch (tagName) {
        case 'li':
          {
            var parent = this.blockStack.slice(-1)[0];
            return parent.tagName === 'ol' ? BLOCK_TYPE.ORDERED_LIST_ITEM : BLOCK_TYPE.UNORDERED_LIST_ITEM;
          }

        case 'blockquote':
          {
            return BLOCK_TYPE.BLOCKQUOTE;
          }

        case 'h1':
          {
            return BLOCK_TYPE.HEADER_ONE;
          }

        case 'h2':
          {
            return BLOCK_TYPE.HEADER_TWO;
          }

        case 'h3':
          {
            return BLOCK_TYPE.HEADER_THREE;
          }

        case 'h4':
          {
            return BLOCK_TYPE.HEADER_FOUR;
          }

        case 'h5':
          {
            return BLOCK_TYPE.HEADER_FIVE;
          }

        case 'h6':
          {
            return BLOCK_TYPE.HEADER_SIX;
          }

        case 'pre':
          {
            return BLOCK_TYPE.CODE;
          }

        case 'figure':
          {
            return BLOCK_TYPE.ATOMIC;
          }

        default:
          {
            return BLOCK_TYPE.UNSTYLED;
          }
      }
    }
  }, {
    key: "processBlockElement",
    value: function processBlockElement(element) {
      if (!element) {
        return;
      }

      var customBlockFn = this.options.customBlockFn;
      var tagName = element.nodeName.toLowerCase();
      var type;
      var data;

      if (customBlockFn) {
        var customBlock = customBlockFn(element);

        if (customBlock != null) {
          type = customBlock.type;
          data = customBlock.data;
        }
      }

      var isCustomType = true;

      if (type == null) {
        isCustomType = false;
        type = this.getBlockTypeFromTagName(tagName);
      }

      if (type === BLOCK_TYPE.CODE) {
        var language = element.getAttribute('data-language');

        if (language) {
          data = _objectSpread({}, data, {
            language: language
          });
        }
      }

      var hasDepth = canHaveDepth(type);
      var allowRender = !SPECIAL_ELEMENTS.hasOwnProperty(tagName);

      if (!isCustomType && !hasSemanticMeaning(type)) {
        var parent = this.blockStack.slice(-1)[0];

        if (parent) {
          type = parent.type;
        }
      }

      var block = {
        tagName: tagName,
        textFragments: [],
        type: type,
        styleStack: [NO_STYLE],
        entityStack: [NO_ENTITY],
        depth: hasDepth ? this.depth : 0,
        data: data
      };

      if (allowRender) {
        this.blockList.push(block);

        if (hasDepth) {
          this.depth += 1;
        }
      }

      this.blockStack.push(block);

      if (element.childNodes != null) {
        Array.from(element.childNodes).forEach(this.processNode, this);
      }

      this.blockStack.pop();

      if (allowRender && hasDepth) {
        this.depth -= 1;
      }
    }
  }, {
    key: "processInlineElement",
    value: function processInlineElement(element) {
      var tagName = element.nodeName.toLowerCase();

      if (tagName === 'br') {
        this.processText(SOFT_BREAK_PLACEHOLDER);
        return;
      }

      var block = this.blockStack.slice(-1)[0];
      var style = block.styleStack.slice(-1)[0];
      var entityKey = block.entityStack.slice(-1)[0];
      var customInlineFn = this.options.customInlineFn;
      var customInline = customInlineFn ? customInlineFn(element, this.inlineCreators) : null;

      if (customInline != null) {
        switch (customInline.type) {
          case 'STYLE':
            {
              style = style.add(customInline.style);
              break;
            }

          case 'ENTITY':
            {
              entityKey = customInline.entityKey;
              break;
            }
        }
      } else {
        style = addStyleFromTagName(style, tagName, this.options.elementStyles);

        if (ElementToEntity.hasOwnProperty(tagName)) {
          // If the to-entity function returns nothing, use the existing entity.
          entityKey = ElementToEntity[tagName](this, tagName, element) || entityKey;
        }
      }

      block.styleStack.push(style);
      block.entityStack.push(entityKey);

      if (element.childNodes != null) {
        Array.from(element.childNodes).forEach(this.processNode, this);
      }

      if (SELF_CLOSING_ELEMENTS.hasOwnProperty(tagName)) {
        this.processText("\xA0");
      }

      block.entityStack.pop();
      block.styleStack.pop();
    }
  }, {
    key: "processTextNode",
    value: function processTextNode(node) {
      var text = node.nodeValue; // This is important because we will use \r as a placeholder for a soft break.

      text = text.replace(LINE_BREAKS, '\n'); // Replace zero-width space (we use it as a placeholder in markdown) with a
      // soft break.
      // TODO: The import-markdown package should correctly turn breaks into <br>
      // elements so we don't need to include this hack.

      text = text.split(ZERO_WIDTH_SPACE).join(SOFT_BREAK_PLACEHOLDER);
      this.processText(text);
    }
  }, {
    key: "processText",
    value: function processText(text) {
      var block = this.blockStack.slice(-1)[0];
      var style = block.styleStack.slice(-1)[0];
      var entity = block.entityStack.slice(-1)[0];
      var charMetadata = CharacterMetadata.create({
        style: style,
        entity: entity
      });
      var seq = Repeat(charMetadata, text.length);
      block.textFragments.push({
        text: text,
        characterMeta: seq
      });
    }
  }, {
    key: "processNode",
    value: function processNode(node) {
      if (node.nodeType === NODE_TYPE_ELEMENT) {
        // $FlowIssue
        var _element = node;

        var _tagName = _element.nodeName.toLowerCase();

        if (INLINE_ELEMENTS.hasOwnProperty(_tagName)) {
          this.processInlineElement(_element);
        } else {
          this.processBlockElement(_element);
        }
      } else if (node.nodeType === NODE_TYPE_TEXT) {
        this.processTextNode(node);
      }
    }
  }, {
    key: "createEntity",
    value: function createEntity(type, data) {
      var mutability = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'MUTABLE';
      this.contentStateForEntities = this.contentStateForEntities.createEntity(type, mutability, data);
      return this.contentStateForEntities.getLastCreatedEntityKey();
    }
  }]);

  return ContentGenerator;
}();

function trimLeadingNewline(text, characterMeta) {
  if (text.charAt(0) === '\n') {
    text = text.slice(1);
    characterMeta = characterMeta.slice(1);
  }

  return {
    text: text,
    characterMeta: characterMeta
  };
}

function trimLeadingSpace(text, characterMeta) {
  while (text.charAt(0) === ' ') {
    text = text.slice(1);
    characterMeta = characterMeta.slice(1);
  }

  return {
    text: text,
    characterMeta: characterMeta
  };
}

function trimTrailingSpace(text, characterMeta) {
  while (text.slice(-1) === ' ') {
    text = text.slice(0, -1);
    characterMeta = characterMeta.slice(0, -1);
  }

  return {
    text: text,
    characterMeta: characterMeta
  };
}

function collapseWhiteSpace(text, characterMeta) {
  text = text.replace(/[ \t\n]/g, ' ');

  var _trimLeadingSpace = trimLeadingSpace(text, characterMeta);

  text = _trimLeadingSpace.text;
  characterMeta = _trimLeadingSpace.characterMeta;

  var _trimTrailingSpace = trimTrailingSpace(text, characterMeta);

  text = _trimTrailingSpace.text;
  characterMeta = _trimTrailingSpace.characterMeta;
  var i = text.length;

  while (i--) {
    if (text.charAt(i) === ' ' && text.charAt(i - 1) === ' ') {
      text = text.slice(0, i) + text.slice(i + 1);
      characterMeta = characterMeta.slice(0, i).concat(characterMeta.slice(i + 1));
    }
  } // There could still be one space on either side of a softbreak.


  var _replaceTextWithMeta = replaceTextWithMeta({
    text: text,
    characterMeta: characterMeta
  }, SOFT_BREAK_PLACEHOLDER + ' ', SOFT_BREAK_PLACEHOLDER);

  text = _replaceTextWithMeta.text;
  characterMeta = _replaceTextWithMeta.characterMeta;

  var _replaceTextWithMeta2 = replaceTextWithMeta({
    text: text,
    characterMeta: characterMeta
  }, ' ' + SOFT_BREAK_PLACEHOLDER, SOFT_BREAK_PLACEHOLDER);

  text = _replaceTextWithMeta2.text;
  characterMeta = _replaceTextWithMeta2.characterMeta;
  return {
    text: text,
    characterMeta: characterMeta
  };
}

function canHaveDepth(blockType) {
  switch (blockType) {
    case BLOCK_TYPE.UNORDERED_LIST_ITEM:
    case BLOCK_TYPE.ORDERED_LIST_ITEM:
      {
        return true;
      }

    default:
      {
        return false;
      }
  }
}

function concatFragments(fragments) {
  var text = '';
  var characterMeta = Seq();
  fragments.forEach(function (textFragment) {
    text = text + textFragment.text;
    characterMeta = characterMeta.concat(textFragment.characterMeta);
  });
  return {
    text: text,
    characterMeta: characterMeta
  };
}

function addStyleFromTagName(styleSet, tagName, elementStyles) {
  switch (tagName) {
    case 'b':
    case 'strong':
      {
        return styleSet.add(INLINE_STYLE.BOLD);
      }

    case 'i':
    case 'em':
      {
        return styleSet.add(INLINE_STYLE.ITALIC);
      }

    case 'u':
    case 'ins':
      {
        return styleSet.add(INLINE_STYLE.UNDERLINE);
      }

    case 'code':
      {
        return styleSet.add(INLINE_STYLE.CODE);
      }

    case 's':
    case 'del':
      {
        return styleSet.add(INLINE_STYLE.STRIKETHROUGH);
      }

    default:
      {
        // Allow custom styles to be provided.
        if (elementStyles && elementStyles[tagName]) {
          return styleSet.add(elementStyles[tagName]);
        }

        return styleSet;
      }
  }
}

function hasSemanticMeaning(blockType) {
  return blockType !== BLOCK_TYPE.UNSTYLED;
}

function toStringMap(input) {
  var result = {};

  if (input !== null && _typeof(input) === 'object' && !Array.isArray(input)) {
    var obj = input;

    for (var _i = 0, _Object$keys = Object.keys(obj); _i < _Object$keys.length; _i++) {
      var _key = _Object$keys[_i];
      var value = obj[_key];

      if (typeof value === 'string') {
        result[_key] = value;
      }
    }
  }

  return result;
}

function isAllowedHref(input) {
  if (input == null || input.match(DATA_URL)) {
    return false;
  } else {
    return true;
  }
}

export function stateFromElement(element, options) {
  return new ContentGenerator(options).process(element);
}
export default stateFromElement;