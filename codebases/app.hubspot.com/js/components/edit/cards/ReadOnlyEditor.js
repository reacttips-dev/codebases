'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import identity from 'transmute/identity';
import { connect } from 'react-redux';
import { EditorState } from 'draft-js';
import { convertFromHTML } from 'draft-convert';
import { Editor } from 'draft-extend';
import getEditorPlugins from 'SalesTemplateEditor/plugins/compositePlugins/getEditorPlugins';
import GateContainer from 'SequencesUI/data/GateContainer';
import ScopeContainer from 'SequencesUI/data/ScopeContainer';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import * as PropertyActions from 'SequencesUI/actions/PropertyActions';
import * as DeckActions from 'SequencesUI/actions/DeckActions';
import { getEditorState } from 'SequencesUI/library/libraryUtils';
var ReadOnlyEditor = createReactClass({
  displayName: "ReadOnlyEditor",
  mixins: [PureRenderMixin],
  propTypes: {
    text: PropTypes.string.isRequired,
    pluginType: PropTypes.string.isRequired,
    flattenedProperties: PropTypes.instanceOf(ImmutableMap),
    decks: PropTypes.instanceOf(ImmutableMap),
    editorState: PropTypes.instanceOf(EditorState),
    onMount: PropTypes.func,
    fetchProperties: PropTypes.func.isRequired,
    fetchDecks: PropTypes.func.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      onMount: identity
    };
  },
  getInitialState: function getInitialState() {
    return {
      editorState: null,
      BodyEditor: null,
      SubjectEditor: null,
      bodyFromHTML: null,
      subjectFromHTML: null
    };
  },
  componentDidMount: function componentDidMount() {
    var _this$props = this.props,
        editorState = _this$props.editorState,
        onMount = _this$props.onMount,
        decks = _this$props.decks,
        flattenedProperties = _this$props.flattenedProperties,
        fetchDecks = _this$props.fetchDecks,
        fetchProperties = _this$props.fetchProperties;
    onMount();
    var gates = GateContainer.get();
    var scopes = ScopeContainer.get();
    var bodyPlugins = getEditorPlugins('bodyPlugins', true, gates, true, scopes);
    var subjectPlugins = getEditorPlugins('subjectPlugins', true, gates, false, scopes);

    if (decks.isEmpty()) {
      fetchDecks();
    }

    if (!flattenedProperties) {
      fetchProperties();
    }

    this.bodyFromHTML = bodyPlugins(convertFromHTML);
    this.subjectFromHTML = subjectPlugins(convertFromHTML);
    this.setState({
      editorState: editorState || getEditorState({
        text: this.props.text,
        pluginType: this.props.pluginType,
        bodyFromHTML: this.bodyFromHTML,
        subjectFromHTML: this.subjectFromHTML
      }),
      BodyEditor: bodyPlugins(Editor),
      SubjectEditor: subjectPlugins(Editor)
    });
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (prevProps.text !== this.props.text) {
      this.setState({
        editorState: getEditorState({
          text: this.props.text,
          pluginType: this.props.pluginType,
          bodyFromHTML: this.bodyFromHTML,
          subjectFromHTML: this.subjectFromHTML
        })
      });
    }
  },
  render: function render() {
    var _this$state = this.state,
        editorState = _this$state.editorState,
        BodyEditor = _this$state.BodyEditor,
        SubjectEditor = _this$state.SubjectEditor;
    var _this$props2 = this.props,
        pluginType = _this$props2.pluginType,
        flattenedProperties = _this$props2.flattenedProperties,
        decks = _this$props2.decks;
    var isBody = pluginType === 'body';
    var SelectedReadOnlyEditor = isBody ? BodyEditor : SubjectEditor;

    if (editorState === null || BodyEditor === null || SubjectEditor === null || decks === null) {
      return isBody ? /*#__PURE__*/_jsx(UILoadingSpinner, {
        grow: true
      }) : null;
    }

    return /*#__PURE__*/_jsx(SelectedReadOnlyEditor, {
      spellCheck: true,
      editorState: editorState,
      readOnly: true,
      flattenedProperties: flattenedProperties,
      decks: decks,
      onChange: identity
    });
  }
});
export default connect(function (state) {
  return {
    flattenedProperties: state.flattenedProperties,
    decks: state.decks
  };
}, {
  fetchProperties: PropertyActions.fetchProperties,
  fetchDecks: DeckActions.fetchDecks
})(ReadOnlyEditor);