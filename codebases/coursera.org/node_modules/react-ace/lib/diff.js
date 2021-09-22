'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _split = require('./split.js');

var _split2 = _interopRequireDefault(_split);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _diffMatchPatch = require('diff-match-patch');

var _diffMatchPatch2 = _interopRequireDefault(_diffMatchPatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DiffComponent = function (_Component) {
  _inherits(DiffComponent, _Component);

  function DiffComponent(props) {
    _classCallCheck(this, DiffComponent);

    var _this = _possibleConstructorReturn(this, (DiffComponent.__proto__ || Object.getPrototypeOf(DiffComponent)).call(this, props));

    _this.state = {
      value: _this.props.value
    };
    _this.onChange = _this.onChange.bind(_this);
    _this.diff = _this.diff.bind(_this);
    return _this;
  }

  _createClass(DiffComponent, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      var value = props.value;


      if (value !== this.state.value) {
        this.setState({ value: value });
      }
    }
  }, {
    key: 'onChange',
    value: function onChange(value) {
      this.setState({
        value: value
      });
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }, {
    key: 'diff',
    value: function diff() {
      var dmp = new _diffMatchPatch2.default();
      var lhString = this.state.value[0];
      var rhString = this.state.value[1];

      if (lhString.length === 0 && rhString.length === 0) {
        return [];
      }

      var diff = dmp.diff_main(lhString, rhString);
      dmp.diff_cleanupSemantic(diff);

      var diffedLines = this.generateDiffedLines(diff);
      var codeEditorSettings = this.setCodeMarkers(diffedLines);
      return codeEditorSettings;
    }
  }, {
    key: 'generateDiffedLines',
    value: function generateDiffedLines(diff) {
      var C = {
        DIFF_EQUAL: 0,
        DIFF_DELETE: -1,
        DIFF_INSERT: 1
      };

      var diffedLines = {
        left: [],
        right: []
      };

      var cursor = {
        left: 1,
        right: 1
      };

      diff.forEach(function (chunk) {
        var chunkType = chunk[0];
        var text = chunk[1];
        var lines = text.split('\n').length - 1;

        // diff-match-patch sometimes returns empty strings at random
        if (text.length === 0) {
          return;
        }

        var firstChar = text[0];
        var lastChar = text[text.length - 1];
        var linesToHighlight = 0;

        switch (chunkType) {
          case C.DIFF_EQUAL:
            cursor.left += lines;
            cursor.right += lines;

            break;
          case C.DIFF_DELETE:

            // If the deletion starts with a newline, push the cursor down to that line
            if (firstChar === '\n') {
              cursor.left++;
              lines--;
            }

            linesToHighlight = lines;

            // If the deletion does not include a newline, highlight the same line on the right
            if (linesToHighlight === 0) {
              diffedLines.right.push({
                startLine: cursor.right,
                endLine: cursor.right
              });
            }

            // If the last character is a newline, we don't want to highlight that line
            if (lastChar === '\n') {
              linesToHighlight -= 1;
            }

            diffedLines.left.push({
              startLine: cursor.left,
              endLine: cursor.left + linesToHighlight
            });

            cursor.left += lines;
            break;
          case C.DIFF_INSERT:

            // If the insertion starts with a newline, push the cursor down to that line
            if (firstChar === '\n') {
              cursor.right++;
              lines--;
            }

            linesToHighlight = lines;

            // If the insertion does not include a newline, highlight the same line on the left
            if (linesToHighlight === 0) {
              diffedLines.left.push({
                startLine: cursor.left,
                endLine: cursor.left
              });
            }

            // If the last character is a newline, we don't want to highlight that line
            if (lastChar === '\n') {
              linesToHighlight -= 1;
            }

            diffedLines.right.push({
              startLine: cursor.right,
              endLine: cursor.right + linesToHighlight
            });

            cursor.right += lines;
            break;
          default:
            throw new Error('Diff type was not defined.');
        }
      });
      return diffedLines;
    }

    // Receives a collection of line numbers and iterates through them to highlight appropriately
    // Returns an object that tells the render() method how to display the code editors

  }, {
    key: 'setCodeMarkers',
    value: function setCodeMarkers() {
      var diffedLines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { left: [], right: [] };

      var codeEditorSettings = [];

      var newMarkerSet = {
        left: [],
        right: []
      };

      for (var i = 0; i < diffedLines.left.length; i++) {
        var markerObj = {
          startRow: diffedLines.left[i].startLine - 1,
          endRow: diffedLines.left[i].endLine,
          type: 'text',
          className: 'codeMarker'
        };
        newMarkerSet.left.push(markerObj);
      }

      for (var _i = 0; _i < diffedLines.right.length; _i++) {
        var _markerObj = {
          startRow: diffedLines.right[_i].startLine - 1,
          endRow: diffedLines.right[_i].endLine,
          type: 'text',
          className: 'codeMarker'
        };
        newMarkerSet.right.push(_markerObj);
      }

      codeEditorSettings[0] = newMarkerSet.left;
      codeEditorSettings[1] = newMarkerSet.right;

      return codeEditorSettings;
    }
  }, {
    key: 'render',
    value: function render() {
      var markers = this.diff();
      return _react2.default.createElement(_split2.default, {
        name: this.props.name,
        className: this.props.className,
        focus: this.props.focus,
        orientation: this.props.orientation,
        splits: this.props.splits,
        mode: this.props.mode,
        theme: this.props.theme,
        height: this.props.height,
        width: this.props.width,
        fontSize: this.props.fontSize,
        showGutter: this.props.showGutter,
        onChange: this.onChange,
        onPaste: this.props.onPaste,
        onLoad: this.props.onLoad,
        onScroll: this.props.onScroll,
        minLines: this.props.minLines,
        maxLines: this.props.maxLines,
        readOnly: this.props.readOnly,
        highlightActiveLine: this.props.highlightActiveLine,
        showPrintMargin: this.props.showPrintMargin,
        tabSize: this.props.tabSize,
        cursorStart: this.props.cursorStart,
        editorProps: this.props.editorProps,
        style: this.props.style,
        scrollMargin: this.props.scrollMargin,
        setOptions: this.props.setOptions,
        wrapEnabled: this.props.wrapEnabled,
        enableBasicAutocompletion: this.props.enableBasicAutocompletion,
        enableLiveAutocompletion: this.props.enableLiveAutocompletion,
        value: this.state.value,
        markers: markers
      });
    }
  }]);

  return DiffComponent;
}(_react.Component);

exports.default = DiffComponent;


DiffComponent.propTypes = {
  cursorStart: _propTypes2.default.number,
  editorProps: _propTypes2.default.object,
  enableBasicAutocompletion: _propTypes2.default.bool,
  enableLiveAutocompletion: _propTypes2.default.bool,
  focus: _propTypes2.default.bool,
  fontSize: _propTypes2.default.number,
  height: _propTypes2.default.string,
  highlightActiveLine: _propTypes2.default.bool,
  maxLines: _propTypes2.default.func,
  minLines: _propTypes2.default.func,
  mode: _propTypes2.default.string,
  name: _propTypes2.default.string,
  className: _propTypes2.default.string,
  onLoad: _propTypes2.default.func,
  onPaste: _propTypes2.default.func,
  onScroll: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  orientation: _propTypes2.default.string,
  readOnly: _propTypes2.default.bool,
  scrollMargin: _propTypes2.default.array,
  setOptions: _propTypes2.default.object,
  showGutter: _propTypes2.default.bool,
  showPrintMargin: _propTypes2.default.bool,
  splits: _propTypes2.default.number,
  style: _propTypes2.default.object,
  tabSize: _propTypes2.default.number,
  theme: _propTypes2.default.string,
  value: _propTypes2.default.array,
  width: _propTypes2.default.string,
  wrapEnabled: _propTypes2.default.bool
};

DiffComponent.defaultProps = {
  cursorStart: 1,
  editorProps: {},
  enableBasicAutocompletion: false,
  enableLiveAutocompletion: false,
  focus: false,
  fontSize: 12,
  height: '500px',
  highlightActiveLine: true,
  maxLines: null,
  minLines: null,
  mode: '',
  name: 'brace-editor',
  onLoad: null,
  onScroll: null,
  onPaste: null,
  onChange: null,
  orientation: 'beside',
  readOnly: false,
  scrollMargin: [0, 0, 0, 0],
  setOptions: {},
  showGutter: true,
  showPrintMargin: true,
  splits: 2,
  style: {},
  tabSize: 4,
  theme: 'github',
  value: ['', ''],
  width: '500px',
  wrapEnabled: true
};