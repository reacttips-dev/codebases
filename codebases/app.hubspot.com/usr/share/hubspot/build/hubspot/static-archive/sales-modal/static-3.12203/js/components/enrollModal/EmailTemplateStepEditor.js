'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Map as ImmutableMap } from 'immutable';
import { connect } from 'react-redux';
import { enrollmentSetStepMetadata } from 'sales-modal/redux/actions/EnrollmentEditorActions';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import TemplateStepEditor from './TemplateStepEditor';
import { SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';
import { EMAIL_TEMPLATE_META_PATH } from 'sales-modal/utils/enrollModal/stepsWithEmailTemplates';
var EmailTemplateStepEditor = createReactClass({
  displayName: "EmailTemplateStepEditor",
  mixins: [PureRenderMixin],
  propTypes: {
    step: PropTypes.instanceOf(ImmutableMap).isRequired,
    isSubjectThreaded: PropTypes.bool,
    decks: PropTypes.instanceOf(ImmutableMap),
    contact: PropTypes.instanceOf(ContactRecord),
    user: PropTypes.object,
    email: PropTypes.string,
    enrollmentSetStepMetadata: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired
  },
  getEmailTemplateMetadata: function getEmailTemplateMetadata() {
    var step = this.props.step;
    return step.getIn(EMAIL_TEMPLATE_META_PATH[step.get('action')]);
  },
  setMetadataForStep: function setMetadataForStep(updatedStateField, updatedStateValue) {
    var step = this.props.step;
    var isAutomatedEmail = step.get('action') === SEND_TEMPLATE;

    if (isAutomatedEmail) {
      var templateMeta = this.props.step.getIn(['actionMeta', 'templateMeta']);
      this.props.enrollmentSetStepMetadata({
        step: step,
        metadata: templateMeta.set(updatedStateField, updatedStateValue),
        isSubjectChange: updatedStateField === 'subject'
      });
    } else {
      var taskMeta = this.props.step.getIn(['actionMeta', 'taskMeta']);
      this.props.enrollmentSetStepMetadata({
        step: step,
        metadata: taskMeta.setIn(['manualEmailMeta', updatedStateField], updatedStateValue),
        isSubjectChange: updatedStateField === 'subject'
      });
    }
  },
  onSubjectChange: function onSubjectChange(subjectState) {
    this.setMetadataForStep('subject', subjectState);
  },
  onBodyChange: function onBodyChange(bodyState) {
    this.setMetadataForStep('body', bodyState);
  },
  render: function render() {
    var _this$props = this.props,
        step = _this$props.step,
        isSubjectThreaded = _this$props.isSubjectThreaded,
        decks = _this$props.decks,
        contact = _this$props.contact,
        user = _this$props.user,
        email = _this$props.email,
        readOnly = _this$props.readOnly;
    var subject = this.getEmailTemplateMetadata().get('subject');
    var body = this.getEmailTemplateMetadata().get('body');
    return /*#__PURE__*/_jsx(TemplateStepEditor, {
      step: step,
      isSubjectThreaded: isSubjectThreaded,
      decks: decks,
      contact: contact,
      user: user,
      email: email,
      subject: subject,
      body: body,
      onSubjectChange: this.onSubjectChange,
      onBodyChange: this.onBodyChange,
      readOnly: readOnly
    });
  }
});
export default connect(null, {
  enrollmentSetStepMetadata: enrollmentSetStepMetadata
})(EmailTemplateStepEditor);