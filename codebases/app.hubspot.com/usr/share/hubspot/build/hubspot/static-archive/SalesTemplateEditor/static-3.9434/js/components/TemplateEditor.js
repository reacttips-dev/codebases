'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';
import { Map as ImmutableMap } from 'immutable';
import memoize from 'transmute/memoize';
import emptyFunction from 'react-utils/emptyFunction';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { EditorState, Modifier, DefaultDraftBlockRenderMap } from 'draft-js';
import { Editor } from 'draft-extend';
import { convertFromHTML } from 'draft-convert';
import { FOCUS_TARGETS } from 'draft-plugins/lib/constants';
import { canWrite } from 'SalesTemplateEditor/lib/permissions';
import { connect } from 'react-redux';
import * as TemplateActions from 'SalesTemplateEditor/actions/TemplateActions';
import UITextInput from 'UIComponents/input/UITextInput';
import TemplateOwner from './editor/TemplateOwner';
import ContentPermissionsDropdown from './editor/ContentPermissionsDropdown';
import FolderDropdown from './editor/FolderDropdown';
import getEditorPlugins from 'SalesTemplateEditor/plugins/compositePlugins/getEditorPlugins';

var plainDivElement = function plainDivElement(props) {
  var children = props.children,
      otherProps = _objectWithoutProperties(props, ["children"]);

  return /*#__PURE__*/_jsx("div", Object.assign({}, otherProps, {
    children: children
  }));
};

plainDivElement.propTypes = {
  children: PropTypes.any
};
var plainDiv = {
  element: plainDivElement
};
var BLOCK_RENDER_MAP = ImmutableMap({
  'unstyled-align-left': plainDiv,
  'unstyled-align-center': plainDiv,
  'unstyled-align-right': plainDiv
}).merge(DefaultDraftBlockRenderMap);
export var WEBPACK_3_FORCE_MODULE_IMPORT = 1;

function _getEditorStates(template, bodyState, subjectState, gates, modalPlugins, readOnly) {
  var result = {
    bodyState: bodyState,
    subjectState: subjectState
  };

  if (!bodyState) {
    var bodyPlugins = getEditorPlugins('bodyPlugins', readOnly, gates, modalPlugins);
    var bodyFromHTML = bodyPlugins(convertFromHTML);
    result.bodyState = EditorState.createWithContent(bodyFromHTML(template.get('body').replace(/(\r\n|\n|\r)/gm, '<br />')));
  }

  if (!subjectState) {
    var subjectPlugins = getEditorPlugins('subjectPlugins', readOnly, gates);
    var subjectFromHTML = subjectPlugins(convertFromHTML);
    result.subjectState = EditorState.createWithContent(subjectFromHTML(template.get('subject')));
  }

  return result;
}

var _memoizedGetEditorStates = memoize(_getEditorStates);

var TemplateEditor = createReactClass({
  displayName: "TemplateEditor",
  propTypes: {
    template: PropTypes.instanceOf(ImmutableMap).isRequired,
    properties: PropTypes.instanceOf(ImmutableMap),
    flattenedProperties: PropTypes.instanceOf(ImmutableMap),
    decks: PropTypes.instanceOf(ImmutableMap),
    bodyState: PropTypes.object,
    subjectState: PropTypes.object,
    onBodyChange: PropTypes.func,
    onSubjectChange: PropTypes.func,
    modalPlugins: PropTypes.bool.isRequired,
    gates: PropTypes.object.isRequired,
    userProfile: PropTypes.object,
    readOnly: PropTypes.bool.isRequired,
    SuccessMarker: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
    editName: PropTypes.func.isRequired,
    selectFolder: PropTypes.func.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      SuccessMarker: function SuccessMarker() {
        return null;
      },
      onBodyChange: emptyFunction,
      onSubjectChange: emptyFunction
    };
  },
  getInitialState: function getInitialState() {
    var _this$props = this.props,
        gates = _this$props.gates,
        modalPlugins = _this$props.modalPlugins,
        subjectState = _this$props.subjectState;
    var readOnly = this.getEditorReadOnly();
    var bodyPlugins = getEditorPlugins('bodyPlugins', readOnly, gates, modalPlugins);
    var subjectPlugins = getEditorPlugins('subjectPlugins', readOnly, gates, modalPlugins);
    var bodyEditor = bodyPlugins(Editor);
    var currentFocus = FOCUS_TARGETS.BODY;

    if (subjectState && subjectState.getSelection().getHasFocus()) {
      currentFocus = FOCUS_TARGETS.SUBJECT;
    }

    return {
      bodyEditor: bodyEditor,
      currentFocus: currentFocus,
      subjectEditor: subjectPlugins(Editor)
    };
  },
  componentDidMount: function componentDidMount() {
    if (typeof window.TEXT_INPUT_LONG_TASKS === 'undefined') {
      return;
    }

    this._body = ReactDOM.findDOMNode(this._bodyEditor);

    if (this._body) {
      var contents = this._body.querySelector('.public-DraftEditor-content');

      contents.addEventListener('textInput', this.inputTimestampListener, {
        capture: true
      });
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this._body) {
      this._body.removeEventListener('textInput', this.inputTimestampListener);
    }
  },
  inputTimestampListener: function inputTimestampListener(e) {
    window.LAST_TEXT_INPUT_TIMESTAMP = e.timeStamp;
  },
  getEditorReadOnly: function getEditorReadOnly() {
    return this.props.readOnly || !canWrite();
  },
  getEditorStates: function getEditorStates() {
    var _this$props2 = this.props,
        template = _this$props2.template,
        bodyState = _this$props2.bodyState,
        subjectState = _this$props2.subjectState,
        modalPlugins = _this$props2.modalPlugins,
        gates = _this$props2.gates;
    return _memoizedGetEditorStates(template, bodyState, subjectState, gates, modalPlugins, this.getEditorReadOnly());
  },
  createFocusHandler: function createFocusHandler(target) {
    var _this = this;

    return function () {
      _this.setState({
        currentFocus: target
      });
    };
  },
  handleEditName: function handleEditName(e) {
    this.props.editName(e.target.value);
  },
  handleSubjectTab: function handleSubjectTab() {
    this._bodyEditor.focus();
  },
  handleSubjectPastedText: function handleSubjectPastedText(text) {
    if (!text) {
      return true;
    }

    var _this$props3 = this.props,
        subjectState = _this$props3.subjectState,
        onSubjectChange = _this$props3.onSubjectChange;
    var currentContentState = subjectState.getCurrentContent();
    var selection = subjectState.getSelection();
    var stripLineBreaks = text.replace(/(\r\n|\n|\r)/gm, '');
    var modifyingFunction = selection.isCollapsed() ? Modifier.insertText : Modifier.replaceText;
    var pastedContentState = modifyingFunction(currentContentState, selection, stripLineBreaks);
    onSubjectChange(EditorState.push(subjectState, pastedContentState, 'insert-fragment'));
    return true;
  },
  render: function render() {
    var _this2 = this;

    var _this$state = this.state,
        currentFocus = _this$state.currentFocus,
        subjectEditor = _this$state.subjectEditor,
        bodyEditor = _this$state.bodyEditor;
    var _this$props4 = this.props,
        template = _this$props4.template,
        properties = _this$props4.properties,
        flattenedProperties = _this$props4.flattenedProperties,
        decks = _this$props4.decks,
        onSubjectChange = _this$props4.onSubjectChange,
        onBodyChange = _this$props4.onBodyChange,
        SuccessMarker = _this$props4.SuccessMarker,
        readOnly = _this$props4.readOnly,
        userProfile = _this$props4.userProfile,
        selectFolder = _this$props4.selectFolder;

    var _this$getEditorStates = this.getEditorStates(),
        bodyState = _this$getEditorStates.bodyState,
        subjectState = _this$getEditorStates.subjectState;

    var SubjectEditor = subjectEditor;
    var BodyEditor = bodyEditor;
    var name = template.get('name');
    var isNewTemplate = !template.has('id');
    return /*#__PURE__*/_jsxs("div", {
      className: "template-editor",
      children: [/*#__PURE__*/_jsx(SuccessMarker, {}), /*#__PURE__*/_jsxs("div", {
        className: "template-editor-name p-left-3",
        children: [/*#__PURE__*/_jsx("label", {
          className: "m-bottom-0",
          children: /*#__PURE__*/_jsx("span", {
            className: "is--text--bold",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "templateEditor.templateName"
            })
          })
        }), /*#__PURE__*/_jsx(UITextInput, {
          className: "p-left-1",
          value: name,
          readOnly: this.getEditorReadOnly(),
          onChange: this.handleEditName,
          styled: false,
          autoFocus: true
        }), /*#__PURE__*/_jsx(TemplateOwner, {
          template: template,
          readOnly: readOnly,
          userProfile: userProfile
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "template-editor-subject p-left-3",
        children: [/*#__PURE__*/_jsx("label", {
          className: "m-bottom-0",
          children: /*#__PURE__*/_jsx("span", {
            className: "is--text--bold",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "templateEditor.subject"
            })
          })
        }), /*#__PURE__*/_jsx(SubjectEditor, {
          currentFocus: currentFocus,
          editorState: subjectState,
          properties: properties,
          flattenedProperties: flattenedProperties,
          spellCheck: true,
          onChange: onSubjectChange,
          onFocus: this.createFocusHandler(FOCUS_TARGETS.SUBJECT),
          readOnly: this.getEditorReadOnly(),
          handleTab: this.handleSubjectTab,
          handlePastedText: this.handleSubjectPastedText
        }), /*#__PURE__*/_jsx(ContentPermissionsDropdown, {
          template: template,
          readOnly: readOnly,
          userProfile: userProfile
        }), /*#__PURE__*/_jsx(FolderDropdown, {
          folderId: template.get('folderId'),
          readOnly: readOnly,
          selectFolder: selectFolder,
          useSelectFolderPrompt: isNewTemplate,
          buttonUse: "link"
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "template-editor-body",
        children: /*#__PURE__*/_jsx(BodyEditor, {
          currentFocus: currentFocus,
          ref: function ref(c) {
            return _this2._bodyEditor = c;
          },
          spellCheck: true,
          editorState: bodyState,
          properties: properties,
          flattenedProperties: flattenedProperties,
          decks: decks,
          onChange: onBodyChange,
          onFocus: this.createFocusHandler(FOCUS_TARGETS.BODY),
          subjectState: subjectState,
          subjectChange: onSubjectChange,
          blockRenderMap: BLOCK_RENDER_MAP,
          readOnly: this.getEditorReadOnly()
        })
      })]
    });
  }
});
export default connect(function (state) {
  return {
    decks: state.decks.get('decks'),
    properties: state.properties.get('properties'),
    flattenedProperties: state.properties.get('flattenedProperties')
  };
}, {
  editName: TemplateActions.editName,
  selectFolder: TemplateActions.selectFolder
})(TemplateEditor);