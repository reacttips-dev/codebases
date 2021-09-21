import _JSON$stringify from 'babel-runtime/core-js/json/stringify';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import { ContentState, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToMarkdown } from 'draft-js-export-markdown';
import { stateFromMarkdown } from 'draft-js-import-markdown';

var EditorValue = function () {
  function EditorValue(editorState) {
    var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, EditorValue);

    this._cache = cache;
    this._editorState = editorState;
  }

  _createClass(EditorValue, [{
    key: 'getEditorState',
    value: function getEditorState() {
      return this._editorState;
    }
  }, {
    key: 'setEditorState',
    value: function setEditorState(editorState) {
      return this._editorState === editorState ? this : new EditorValue(editorState);
    }
  }, {
    key: 'toString',
    value: function toString(format, options) {
      var fromCache = this._cache[format];
      if (fromCache != null) {
        return fromCache;
      }
      return this._cache[format] = _toString(this.getEditorState(), format, options);
    }
  }, {
    key: 'setContentFromString',
    value: function setContentFromString(markup, format, options) {
      var editorState = EditorState.push(this._editorState, fromString(markup, format, options), 'secondary-paste');
      return new EditorValue(editorState, _defineProperty({}, format, markup));
    }
  }], [{
    key: 'createEmpty',
    value: function createEmpty(decorator) {
      var editorState = EditorState.createEmpty(decorator);
      return new EditorValue(editorState);
    }
  }, {
    key: 'createFromState',
    value: function createFromState(editorState) {
      return new EditorValue(editorState);
    }
  }, {
    key: 'createFromString',
    value: function createFromString(markup, format, decorator, options) {
      var contentState = fromString(markup, format, options);
      var editorState = EditorState.createWithContent(contentState, decorator);
      return new EditorValue(editorState, _defineProperty({}, format, markup));
    }
  }]);

  return EditorValue;
}();

export default EditorValue;


function _toString(editorState, format, options) {
  var contentState = editorState.getCurrentContent();
  switch (format) {
    case 'html':
      {
        return stateToHTML(contentState, options);
      }
    case 'markdown':
      {
        return stateToMarkdown(contentState);
      }
    case 'raw':
      {
        return _JSON$stringify(convertToRaw(contentState));
      }
    default:
      {
        throw new Error('Format not supported: ' + format);
      }
  }
}

function fromString(markup, format, options) {
  switch (format) {
    case 'html':
      {
        return stateFromHTML(markup, options);
      }
    case 'markdown':
      {
        return stateFromMarkdown(markup, options);
      }
    case 'raw':
      {
        return convertFromRaw(JSON.parse(markup));
      }
    default:
      {
        throw new Error('Format not supported: ' + format);
      }
  }
}