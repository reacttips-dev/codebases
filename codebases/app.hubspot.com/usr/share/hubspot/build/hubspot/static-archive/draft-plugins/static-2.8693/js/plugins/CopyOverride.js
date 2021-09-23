'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { ContentState, EditorState } from 'draft-js';
import { compose } from 'draft-extend';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { findDOMNode } from 'react-dom';
import { getBaseConverterForHTML } from 'rich-text-lib/lib/pastePreProcess';
import selectionToContentState from '../utils/selectionToContentState';
import applyStylesToContentState from '../utils/applyStylesToContentState';

var fallback = function fallback(html) {
  var doc = document.implementation.createHTMLDocument('');
  doc.documentElement.innerHTML = html;
  return doc;
};

var parseHtmlBody = function parseHtmlBody(html) {
  var doc;

  if (typeof DOMParser === 'undefined') {
    doc = fallback(html);
  } else {
    var parser = new DOMParser();
    doc = parser.parseFromString("<html>" + html + "</html>", 'text/html');
  }

  return doc.body;
};

var createCopyOverrideComposer = function createCopyOverrideComposer() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      parseKnownFileTypesOnly = _ref.parseKnownFileTypesOnly;

  return function () {
    for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
      plugins[_key] = arguments[_key];
    }

    return function (WrappingComponent) {
      if (plugins.length === 0) {
        return WrappingComponent;
      }

      var pluginComposition = compose.apply(void 0, plugins);
      var WrappedComponentWithPlugins = pluginComposition(WrappingComponent);
      var toHTML = pluginComposition(convertToHTML);
      var fromHTML = pluginComposition(convertFromHTML);

      if (WrappingComponent.prototype && WrappingComponent.prototype.isReactComponent) {
        return createReactClass({
          propTypes: {
            editorState: PropTypes.instanceOf(EditorState).isRequired,
            onChange: PropTypes.func.isRequired,
            handlePastedText: PropTypes.func
          },
          childContextTypes: {
            focus: PropTypes.func,
            blur: PropTypes.func
          },
          getChildContext: function getChildContext() {
            return {
              focus: this.focus,
              blur: this.blur
            };
          },
          componentDidMount: function componentDidMount() {
            var childNode = findDOMNode(this.refs.child);

            if (childNode) {
              childNode.addEventListener('copy', this.handleCopy);
              childNode.addEventListener('cut', this.handleCopy);
            }
          },
          componentWillUnmount: function componentWillUnmount() {
            var childNode = findDOMNode(this.refs.child);

            if (childNode) {
              childNode.removeEventListener('copy', this.handleCopy);
              childNode.removeEventListener('cut', this.handleCopy);
            }
          },
          focus: function focus() {
            if (this.refs.child.focus) {
              this.refs.child.focus();
            }
          },
          blur: function blur() {
            if (this.refs.child.blur) {
              this.refs.child.blur();
            }
          },
          handlePastedText: function handlePastedText(text, html) {
            var _this$props = this.props,
                handlePastedText = _this$props.handlePastedText,
                editorState = _this$props.editorState,
                onChange = _this$props.onChange;
            var updatedEditorState;

            if (!html && !text) {
              if (handlePastedText) {
                return handlePastedText(text, html);
              }

              return true;
            }

            if (!html) {
              text = text.replace(/\r/g, '\n');
              text = text.replace(/\n/g, '\n');
              var contentStateFromText = ContentState.createFromText(text);
              updatedEditorState = applyStylesToContentState(editorState, contentStateFromText);
            } else {
              var _getBaseConverterForH = getBaseConverterForHTML(html),
                  converter = _getBaseConverterForH.converter,
                  converterName = _getBaseConverterForH.converterName;

              if (parseKnownFileTypesOnly && converterName === 'unknown') {
                return false;
              }

              var processedHtml = converter(html, parseHtmlBody);
              var contentStateFromHTML = fromHTML(processedHtml);
              updatedEditorState = applyStylesToContentState(editorState, contentStateFromHTML, {
                ignoreLinkColorStyle: true
              });
            }

            onChange(updatedEditorState);

            if (handlePastedText) {
              return handlePastedText(text, html);
            }

            return true;
          },
          handleCopy: function handleCopy(e) {
            var editorState = this.props.editorState;
            var selectedContentState = selectionToContentState(editorState);
            var html = toHTML(selectedContentState);

            if (e.clipboardData) {
              e.clipboardData.setData('text/html', html);
              e.clipboardData.setData('text/plain', selectedContentState.getPlainText());
            } else if (window.clipboardData) {
              window.clipboardData.setData('Text', selectedContentState.getPlainText());
            }

            e.preventDefault();
          },
          render: function render() {
            return /*#__PURE__*/_jsx(WrappedComponentWithPlugins, Object.assign({}, this.props, {
              ref: "child",
              handlePastedText: this.handlePastedText
            }));
          }
        });
      }

      return WrappedComponentWithPlugins;
    };
  };
};

export default createCopyOverrideComposer({
  parseKnownFileTypesOnly: false
});
export var knownFilesCopyOverride = createCopyOverrideComposer({
  parseKnownFileTypesOnly: true
});