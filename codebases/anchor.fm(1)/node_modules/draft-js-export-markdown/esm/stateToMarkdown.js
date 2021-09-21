function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { getEntityRanges, BLOCK_TYPE, ENTITY_TYPE, INLINE_STYLE } from 'draft-js-utils';
var BOLD = INLINE_STYLE.BOLD,
    CODE = INLINE_STYLE.CODE,
    ITALIC = INLINE_STYLE.ITALIC,
    STRIKETHROUGH = INLINE_STYLE.STRIKETHROUGH,
    UNDERLINE = INLINE_STYLE.UNDERLINE;
var CODE_INDENT = '    ';
var defaultOptions = {
  gfm: false
};

var MarkupGenerator =
/*#__PURE__*/
function () {
  function MarkupGenerator(contentState, options) {
    _classCallCheck(this, MarkupGenerator);

    _defineProperty(this, "blocks", void 0);

    _defineProperty(this, "contentState", void 0);

    _defineProperty(this, "currentBlock", void 0);

    _defineProperty(this, "output", void 0);

    _defineProperty(this, "totalBlocks", void 0);

    _defineProperty(this, "listItemCounts", void 0);

    _defineProperty(this, "options", void 0);

    this.contentState = contentState;
    this.options = options || defaultOptions;
  }

  _createClass(MarkupGenerator, [{
    key: "generate",
    value: function generate() {
      this.output = [];
      this.blocks = this.contentState.getBlockMap().toArray();
      this.totalBlocks = this.blocks.length;
      this.currentBlock = 0;
      this.listItemCounts = {};

      while (this.currentBlock < this.totalBlocks) {
        this.processBlock();
      }

      return this.output.join('');
    }
  }, {
    key: "processBlock",
    value: function processBlock() {
      var block = this.blocks[this.currentBlock];
      var blockType = block.getType();

      switch (blockType) {
        case BLOCK_TYPE.HEADER_ONE:
          {
            this.insertLineBreaks(1);
            this.output.push('# ' + this.renderBlockContent(block) + '\n');
            break;
          }

        case BLOCK_TYPE.HEADER_TWO:
          {
            this.insertLineBreaks(1);
            this.output.push('## ' + this.renderBlockContent(block) + '\n');
            break;
          }

        case BLOCK_TYPE.HEADER_THREE:
          {
            this.insertLineBreaks(1);
            this.output.push('### ' + this.renderBlockContent(block) + '\n');
            break;
          }

        case BLOCK_TYPE.HEADER_FOUR:
          {
            this.insertLineBreaks(1);
            this.output.push('#### ' + this.renderBlockContent(block) + '\n');
            break;
          }

        case BLOCK_TYPE.HEADER_FIVE:
          {
            this.insertLineBreaks(1);
            this.output.push('##### ' + this.renderBlockContent(block) + '\n');
            break;
          }

        case BLOCK_TYPE.HEADER_SIX:
          {
            this.insertLineBreaks(1);
            this.output.push('###### ' + this.renderBlockContent(block) + '\n');
            break;
          }

        case BLOCK_TYPE.UNORDERED_LIST_ITEM:
          {
            var blockDepth = block.getDepth();
            var lastBlock = this.getLastBlock();
            var lastBlockType = lastBlock ? lastBlock.getType() : null;
            var lastBlockDepth = lastBlock && canHaveDepth(lastBlockType) ? lastBlock.getDepth() : null;

            if (lastBlockType !== blockType && lastBlockDepth !== blockDepth - 1) {
              this.insertLineBreaks(1); // Insert an additional line break if following opposite list type.

              if (lastBlockType === BLOCK_TYPE.ORDERED_LIST_ITEM) {
                this.insertLineBreaks(1);
              }
            }

            var indent = ' '.repeat(block.depth * 4);
            this.output.push(indent + '- ' + this.renderBlockContent(block) + '\n');
            break;
          }

        case BLOCK_TYPE.ORDERED_LIST_ITEM:
          {
            var _blockDepth = block.getDepth();

            var _lastBlock = this.getLastBlock();

            var _lastBlockType = _lastBlock ? _lastBlock.getType() : null;

            var _lastBlockDepth = _lastBlock && canHaveDepth(_lastBlockType) ? _lastBlock.getDepth() : null;

            if (_lastBlockType !== blockType && _lastBlockDepth !== _blockDepth - 1) {
              this.insertLineBreaks(1); // Insert an additional line break if following opposite list type.

              if (_lastBlockType === BLOCK_TYPE.UNORDERED_LIST_ITEM) {
                this.insertLineBreaks(1);
              }
            }

            var _indent = ' '.repeat(_blockDepth * 4); // TODO: figure out what to do with two-digit numbers


            var count = this.getListItemCount(block) % 10;
            this.output.push(_indent + "".concat(count, ". ") + this.renderBlockContent(block) + '\n');
            break;
          }

        case BLOCK_TYPE.BLOCKQUOTE:
          {
            this.insertLineBreaks(1);
            this.output.push(' > ' + this.renderBlockContent(block) + '\n');
            break;
          }

        case BLOCK_TYPE.CODE:
          {
            this.insertLineBreaks(1);

            if (this.options.gfm) {
              var language = block.getData() && block.getData().get('language') ? block.getData().get('language') : '';
              this.output.push("```".concat(language, "\n"));
              this.output.push(this.renderBlockContent(block) + '\n');
              this.output.push('```\n');
            } else {
              this.output.push(CODE_INDENT + this.renderBlockContent(block) + '\n');
            }

            break;
          }

        default:
          {
            this.insertLineBreaks(1);
            this.output.push(this.renderBlockContent(block) + '\n');
            break;
          }
      }

      this.currentBlock += 1;
    }
  }, {
    key: "getLastBlock",
    value: function getLastBlock() {
      return this.blocks[this.currentBlock - 1];
    }
  }, {
    key: "getNextBlock",
    value: function getNextBlock() {
      return this.blocks[this.currentBlock + 1];
    }
  }, {
    key: "getListItemCount",
    value: function getListItemCount(block) {
      var blockType = block.getType();
      var blockDepth = block.getDepth(); // To decide if we need to start over we need to backtrack (skipping list
      // items that are of greater depth)

      var index = this.currentBlock - 1;
      var prevBlock = this.blocks[index];

      while (prevBlock && canHaveDepth(prevBlock.getType()) && prevBlock.getDepth() > blockDepth) {
        index -= 1;
        prevBlock = this.blocks[index];
      }

      if (!prevBlock || prevBlock.getType() !== blockType || prevBlock.getDepth() !== blockDepth) {
        this.listItemCounts[blockDepth] = 0;
      }

      return this.listItemCounts[blockDepth] = this.listItemCounts[blockDepth] + 1;
    }
  }, {
    key: "insertLineBreaks",
    value: function insertLineBreaks(n) {
      if (this.currentBlock > 0) {
        for (var i = 0; i < n; i++) {
          this.output.push('\n');
        }
      }
    }
  }, {
    key: "renderBlockContent",
    value: function renderBlockContent(block) {
      var contentState = this.contentState;
      var blockType = block.getType();
      var text = block.getText();

      if (text === '') {
        // Prevent element collapse if completely empty.
        // TODO: Replace with constant.
        return "\u200B";
      }

      var charMetaList = block.getCharacterList();
      var entityPieces = getEntityRanges(text, charMetaList);
      return entityPieces.map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            entityKey = _ref2[0],
            stylePieces = _ref2[1];

        var content = stylePieces.map(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              text = _ref4[0],
              style = _ref4[1];

          // Don't allow empty inline elements.
          if (!text) {
            return '';
          }

          var content = text; // Don't encode any text inside a code block.

          if (blockType === BLOCK_TYPE.CODE) {
            return content;
          } // NOTE: We attempt some basic character escaping here, although
          // I don't know if escape sequences are really valid in markdown,
          // there's not a canonical spec to lean on.


          if (style.has(CODE)) {
            return '`' + encodeCode(content) + '`';
          }

          content = encodeContent(text);

          if (style.has(BOLD)) {
            content = "**".concat(content, "**");
          }

          if (style.has(UNDERLINE)) {
            // TODO: encode `+`?
            content = "++".concat(content, "++");
          }

          if (style.has(ITALIC)) {
            content = "_".concat(content, "_");
          }

          if (style.has(STRIKETHROUGH)) {
            // TODO: encode `~`?
            content = "~~".concat(content, "~~");
          }

          return content;
        }).join('');
        var entity = entityKey ? contentState.getEntity(entityKey) : null;

        if (entity != null && entity.getType() === ENTITY_TYPE.LINK) {
          var data = entity.getData();
          var url = data.href || data.url || '';
          var title = data.title ? " \"".concat(escapeTitle(data.title), "\"") : '';
          return "[".concat(content, "](").concat(encodeURL(url)).concat(title, ")");
        } else if (entity != null && entity.getType() === ENTITY_TYPE.IMAGE) {
          var _data = entity.getData();

          var src = _data.src || '';
          var alt = _data.alt ? "".concat(escapeTitle(_data.alt)) : '';
          return "![".concat(alt, "](").concat(encodeURL(src), ")");
        } else if (entity != null && entity.getType() === ENTITY_TYPE.EMBED) {
          return entity.getData().url || content;
        } else {
          return content;
        }
      }).join('');
    }
  }]);

  return MarkupGenerator;
}();

function canHaveDepth(blockType) {
  switch (blockType) {
    case BLOCK_TYPE.UNORDERED_LIST_ITEM:
    case BLOCK_TYPE.ORDERED_LIST_ITEM:
      return true;

    default:
      return false;
  }
}

function encodeContent(text) {
  return text.replace(/[*_`]/g, '\\$&');
}

function encodeCode(text) {
  return text.replace(/`/g, '\\`');
} // Encode chars that would normally be allowed in a URL but would conflict with
// our markdown syntax: `[foo](http://foo/)`


var LINK_CHARACTER_REPLACEMENTS = {
  '(': '%28',
  ')': '%29'
};

function encodeURL(url) {
  return url.replace(/[()]/g, function (_char) {
    return LINK_CHARACTER_REPLACEMENTS[_char];
  });
} // Escape quotes using backslash.


function escapeTitle(text) {
  return text.replace(/"/g, '\\"');
}

export default function stateToMarkdown(content, options) {
  return new MarkupGenerator(content, options).generate();
}