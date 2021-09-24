'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { summary } from 'SequencesUI/lib/links';
import UILink from 'UIComponents/link/UILink';
import * as SequenceStepTypes from 'SequencesUI/constants/SequenceStepTypes';

var SequenceSource = function SequenceSource(_ref, _ref2) {
  var scheduledEmail = _ref.scheduledEmail;
  var router = _ref2.router;
  var sequenceMeta = scheduledEmail.getIn(['emailSourceMeta', 'sequenceMeta']);
  var sequenceName = sequenceMeta.get('sequenceName');
  var currentStepOrder = sequenceMeta.get('stepOrder');
  var emailSteps = sequenceMeta.getIn(['sequenceEnrollment', 'sequence', 'steps']).filter(function (step) {
    return step.get('action') === SequenceStepTypes.SEND_TEMPLATE;
  });
  var currentEmailStepIndex = emailSteps.findIndex(function (emailStep) {
    return emailStep.get('stepOrder') === currentStepOrder;
  });
  return /*#__PURE__*/_jsx(UILink, {
    onClick: function onClick() {
      return router.push(summary(sequenceMeta.get('sequenceId')));
    },
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "outbox.sources.sequences",
      options: {
        sequenceName: sequenceName,
        emailStepNumber: currentEmailStepIndex + 1
      }
    })
  });
};

SequenceSource.propTypes = {
  scheduledEmail: PropTypes.instanceOf(ImmutableMap).isRequired
};
SequenceSource.contextTypes = {
  router: PropTypes.object.isRequired
};
var sourceFormatMap = {
  SEQUENCES: SequenceSource
};
export default createReactClass({
  displayName: "OutboxEmailSource",
  propTypes: {
    scheduledEmail: PropTypes.instanceOf(ImmutableMap).isRequired
  },
  render: function render() {
    var scheduledEmail = this.props.scheduledEmail;
    var Component = sourceFormatMap[scheduledEmail.get('emailSource')];
    return /*#__PURE__*/_jsx(Component, Object.assign({}, this.props));
  }
});