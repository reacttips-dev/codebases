'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import identity from 'transmute/identity';
import { convertFromHTML } from 'draft-convert';
import { compose } from 'draft-extend';
import { EDITABLE, PLAIN_TEXT, RENDERED } from '../lib/ContentOutputTypes';
import { contentCorePlugins, contentMergeTagPlugins } from './contentPlugins';
import AdvancedColorPlugin from 'draft-plugins/plugins/AdvancedColorPlugin';
import mergeStyleIntoContentState from 'draft-plugins/utils/mergeStyleIntoContentState';
import replaceSelectionWithContentState from 'draft-plugins/utils/replaceSelectionWithContentState';
var AdvancedTextColorPlugin = AdvancedColorPlugin();
var AdvancedBackgroundColorPlugin = AdvancedColorPlugin({
  cssProperty: 'background-color',
  defaultColor: '#FFF'
});
var contentCorePluginsWithAdvancedColors = compose(contentCorePlugins, AdvancedBackgroundColorPlugin, AdvancedTextColorPlugin);
var editablePluginComposition = compose(contentCorePluginsWithAdvancedColors, contentMergeTagPlugins({
  includeDealTokens: true,
  includeSenderTokens: true,
  includeCustomTokens: true
}));

var getPluginComposition = function getPluginComposition(output) {
  switch (output) {
    case EDITABLE:
      return editablePluginComposition;

    case RENDERED:
      return contentCorePluginsWithAdvancedColors;

    case PLAIN_TEXT:
      return identity;

    default:
      return identity;
  }
};

export default (function (ContentComponent, _ref) {
  var outputType = _ref.outputType,
      apiFunctions = _ref.apiFunctions;
  var pluginComposition = getPluginComposition(outputType);
  var fromHTML = pluginComposition(convertFromHTML);
  return createReactClass({
    propTypes: {
      defaultStyle: PropTypes.object,
      editorState: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      contactEmail: PropTypes.string,
      contactVid: PropTypes.number,
      objectType: PropTypes.string,
      subjectId: PropTypes.string
    },
    insertContent: function insertContent(_ref2) {
      var id = _ref2.id,
          htmlBody = _ref2.htmlBody,
          offset = _ref2.offset,
          length = _ref2.length;
      return outputType !== EDITABLE ? this.getRenderedContent({
        id: id,
        offset: offset,
        length: length
      }) : this.getUnrenderedContent({
        id: id,
        htmlBody: htmlBody,
        offset: offset,
        length: length
      });
    },
    getUnrenderedContent: function getUnrenderedContent(_ref3) {
      var _this = this;

      var id = _ref3.id,
          htmlBody = _ref3.htmlBody,
          offset = _ref3.offset,
          length = _ref3.length;

      if (htmlBody) {
        this.updateEditorState({
          htmlBody: htmlBody,
          offset: offset,
          length: length
        });
      }

      return apiFunctions.fetchUnrenderedContent({
        id: id
      }).then(function (_ref4) {
        var fetchedHtmlBody = _ref4.htmlBody;

        _this.updateEditorState({
          offset: offset,
          length: length,
          htmlBody: fetchedHtmlBody
        });
      });
    },
    getRenderedContent: function getRenderedContent(_ref5) {
      var _this2 = this;

      var id = _ref5.id,
          offset = _ref5.offset,
          length = _ref5.length;
      return apiFunctions.fetchRenderedContent(Object.assign({
        id: id
      }, this.props)).then(function (_ref6) {
        var body = _ref6.body,
            htmlBody = _ref6.htmlBody;
        var selectedBody = outputType === RENDERED ? htmlBody : body;

        _this2.updateEditorState({
          offset: offset,
          length: length,
          htmlBody: selectedBody
        });
      });
    },
    updateEditorState: function updateEditorState(_ref7) {
      var htmlBody = _ref7.htmlBody,
          offset = _ref7.offset,
          length = _ref7.length;
      var _this$props = this.props,
          defaultStyle = _this$props.defaultStyle,
          editorState = _this$props.editorState,
          onChange = _this$props.onChange;
      var contentContentState = fromHTML(htmlBody);
      contentContentState = mergeStyleIntoContentState(contentContentState, defaultStyle, {
        ignoreLinkColorStyle: true
      });
      var updatedEditorState = replaceSelectionWithContentState({
        editorState: editorState,
        offset: offset,
        length: length,
        contentState: contentContentState
      });
      onChange(updatedEditorState);
    },
    render: function render() {
      return /*#__PURE__*/_jsx(ContentComponent, Object.assign({}, this.props, {
        insertContent: this.insertContent
      }));
    }
  });
});