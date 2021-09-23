'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Map as ImmutableMap } from 'immutable';
import { connect } from 'react-redux';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { UsageTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import { enrollmentSetMergeTags, enrollmentSetUnsubscribeLinks } from 'sales-modal/redux/actions/EnrollmentEditorActions';
import { getSelectedContact as getSelectedContactSelector } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import { getTemplateBodyEditor, getTemplateSubjectEditor } from 'sales-modal/redux/selectors/TemplateEditorSelectors';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import { PRIMARY_SEQUENCE_ID } from 'sales-modal/constants/BulkEnrollConstants';
import blockRenderMap from './utils/blockRenderMap';
import UIExpandableText from 'UIComponents/text/UIExpandableText';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { EditorState } from 'draft-js';
import UIMediaObject from 'UIComponents/layout/UIMediaObject';
import HiddenHorizontalScroll from '../HiddenHorizontalScroll';
import HR from 'UIComponents/elements/HR';
import UIFormLabel from 'UIComponents/form/UIFormLabel';
var TemplateStepEditor = createReactClass({
  displayName: "TemplateStepEditor",
  mixins: [PureRenderMixin],
  propTypes: {
    step: PropTypes.instanceOf(ImmutableMap).isRequired,
    isSubjectThreaded: PropTypes.bool,
    properties: PropTypes.instanceOf(ImmutableMap),
    flattenedProperties: PropTypes.instanceOf(ImmutableMap),
    decks: PropTypes.instanceOf(ImmutableMap),
    contact: PropTypes.instanceOf(ContactRecord),
    user: PropTypes.object,
    email: PropTypes.string,
    enrollmentSetMergeTags: PropTypes.func.isRequired,
    enrollmentSetUnsubscribeLinks: PropTypes.func.isRequired,
    selectedContact: PropTypes.string,
    BodyEditor: PropTypes.func.isRequired,
    SubjectEditor: PropTypes.func.isRequired,
    onSubjectChange: PropTypes.func.isRequired,
    onBodyChange: PropTypes.func.isRequired,
    subject: PropTypes.instanceOf(EditorState).isRequired,
    body: PropTypes.instanceOf(EditorState).isRequired,
    readOnly: PropTypes.bool.isRequired
  },
  childContextTypes: {
    contact: PropTypes.instanceOf(ContactRecord),
    handleMissingMergeTags: PropTypes.func,
    user: PropTypes.object,
    properties: PropTypes.instanceOf(ImmutableMap),
    flattenedProperties: PropTypes.instanceOf(ImmutableMap),
    onUnsubscribeChange: PropTypes.func
  },
  getDefaultProps: function getDefaultProps() {
    return {
      isSubjectThreaded: false
    };
  },
  getChildContext: function getChildContext() {
    return {
      contact: this.props.contact,
      user: this.props.user,
      properties: this.props.properties,
      flattenedProperties: this.props.flattenedProperties,
      handleMissingMergeTags: this.handleMissingMergeTags,
      onUnsubscribeChange: this.handleUnsubscribeChange
    };
  },
  hasSelectedPrimarySequence: function hasSelectedPrimarySequence() {
    return this.props.selectedContact === PRIMARY_SEQUENCE_ID;
  },
  handleMissingMergeTags: function handleMissingMergeTags(mergeTagInputFields) {
    UsageTracker.track('sequencesUsage', {
      action: 'Resolved token',
      subscreen: 'enroll'
    });
    this.props.enrollmentSetMergeTags(mergeTagInputFields);
  },
  handleUnsubscribeChange: function handleUnsubscribeChange(blockData) {
    this.props.enrollmentSetUnsubscribeLinks(blockData);
  },
  handleSubjectTab: function handleSubjectTab() {
    this._bodyEditor.focus();
  },
  renderSubjectEditor: function renderSubjectEditor() {
    var _this$props = this.props,
        properties = _this$props.properties,
        flattenedProperties = _this$props.flattenedProperties,
        isSubjectThreaded = _this$props.isSubjectThreaded,
        SubjectEditor = _this$props.SubjectEditor,
        onSubjectChange = _this$props.onSubjectChange,
        subject = _this$props.subject,
        readOnly = _this$props.readOnly;

    if (isSubjectThreaded) {
      var firstEmailSubject = subject.getCurrentContent().getPlainText();
      return /*#__PURE__*/_jsx(UITooltip, {
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollmentEditor.body.templateEditor.tooltip"
        }),
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollmentEditor.body.templateEditor.threadedSubject",
          options: {
            firstEmailSubject: firstEmailSubject
          }
        })
      });
    }

    return /*#__PURE__*/_jsx(SubjectEditor, {
      editorState: subject,
      onChange: onSubjectChange,
      handleTab: this.handleSubjectTab,
      properties: properties,
      flattenedProperties: flattenedProperties,
      readOnly: readOnly || this.hasSelectedPrimarySequence(),
      spellCheck: true
    });
  },
  renderSubject: function renderSubject() {
    return /*#__PURE__*/_jsx("div", {
      "data-test-id": "threaded-subject",
      children: /*#__PURE__*/_jsx(UIMediaObject, {
        align: "baseline",
        itemLeft: /*#__PURE__*/_jsx(UIFormLabel, {
          className: "p-right-0",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "enrollmentEditor.body.templateEditor.subject"
          })
        }),
        children: /*#__PURE__*/_jsx(HiddenHorizontalScroll, {
          visibleHeight: 24,
          children: this.renderSubjectEditor()
        })
      })
    });
  },
  renderBody: function renderBody(renderedBodyEditor) {
    if (this.hasSelectedPrimarySequence()) {
      return /*#__PURE__*/_jsx(UIExpandableText, {
        children: renderedBodyEditor
      });
    }

    return renderedBodyEditor;
  },
  render: function render() {
    var _this = this;

    var _this$props2 = this.props,
        step = _this$props2.step,
        flattenedProperties = _this$props2.flattenedProperties,
        properties = _this$props2.properties,
        decks = _this$props2.decks,
        email = _this$props2.email,
        BodyEditor = _this$props2.BodyEditor,
        onSubjectChange = _this$props2.onSubjectChange,
        onBodyChange = _this$props2.onBodyChange,
        subject = _this$props2.subject,
        body = _this$props2.body,
        readOnly = _this$props2.readOnly;

    var renderedBodyEditor = /*#__PURE__*/_jsx(BodyEditor, {
      ref: function ref(c) {
        return _this._bodyEditor = c;
      },
      editorState: body,
      onChange: onBodyChange,
      subjectState: subject,
      subjectChange: onSubjectChange,
      blockRenderMap: blockRenderMap,
      properties: properties,
      flattenedProperties: flattenedProperties,
      decks: decks,
      contactEmail: email,
      spellCheck: true,
      readOnly: readOnly || this.hasSelectedPrimarySequence(),
      hideVideoShepherd: step.get('stepOrder') !== 0
    });

    return /*#__PURE__*/_jsxs("div", {
      className: "template-editor",
      children: [this.renderSubject(), /*#__PURE__*/_jsx(HR, {
        distance: "small"
      }), /*#__PURE__*/_jsx("div", {
        className: "draft-template-editor-body",
        children: this.renderBody(renderedBodyEditor)
      })]
    });
  }
});
export default connect(function (state, ownProps) {
  return {
    selectedContact: getSelectedContactSelector(state),
    properties: state.properties,
    flattenedProperties: state.flattenedProperties,
    BodyEditor: getTemplateBodyEditor(state, ownProps),
    SubjectEditor: getTemplateSubjectEditor(state, ownProps)
  };
}, {
  enrollmentSetMergeTags: enrollmentSetMergeTags,
  enrollmentSetUnsubscribeLinks: enrollmentSetUnsubscribeLinks
})(TemplateStepEditor);