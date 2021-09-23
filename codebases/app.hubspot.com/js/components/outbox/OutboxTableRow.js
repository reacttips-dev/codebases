'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import FormattedName from 'I18n/components/FormattedName';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { crmContactProfile } from 'SequencesUI/lib/links';
import * as SequenceApi from 'SequencesUI/api/SequenceApi';
import { canUseEnrollments } from 'SequencesUI/lib/permissions';
import { tracker } from 'SequencesUI/util/UsageTracker';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
import UILink from 'UIComponents/link/UILink';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
import UIButton from 'UIComponents/button/UIButton';
import UITableHoverCell from 'UIComponents/table/UITableHoverCell';
import OutboxEmailSource from './OutboxEmailSource';
import EnrollmentEditModal from './EnrollmentEditModal';

var trackUsageEvent = function trackUsageEvent(action) {
  tracker.track('sequencesUsage', {
    action: action,
    subscreen: 'outbox'
  });
};

export default createReactClass({
  displayName: "OutboxTableRow",
  propTypes: {
    scheduledEmail: PropTypes.instanceOf(ImmutableMap).isRequired,
    onUnenroll: PropTypes.func.isRequired,
    onEnrollmentEdit: PropTypes.func.isRequired
  },
  getInitialState: function getInitialState() {
    return {
      unenrollModalOpen: false
    };
  },
  handleEditClick: function handleEditClick() {
    trackUsageEvent('Clicked edit on enrollment');
    this.setState({
      editOpen: true
    });
  },
  handleUnenrollClick: function handleUnenrollClick() {
    trackUsageEvent('Clicked unenroll');
    this.setState({
      unenrollModalOpen: true
    });
  },
  handleEditConfirm: function handleEditConfirm() {
    this.props.onEnrollmentEdit();
    this.setState({
      editOpen: false
    });
  },
  handleEditReject: function handleEditReject() {
    this.setState({
      editOpen: false
    });
  },
  handleUnenrollReject: function handleUnenrollReject() {
    this.setState({
      unenrollModalOpen: false
    });
  },
  handleUnenrollConfirm: function handleUnenrollConfirm() {
    var _this = this;

    var _this$props = this.props,
        scheduledEmail = _this$props.scheduledEmail,
        onUnenroll = _this$props.onUnenroll;
    var enrollmentId = scheduledEmail.getIn(['emailSourceMeta', 'sequenceMeta', 'enrollmentId']);
    SequenceApi.unenroll(enrollmentId).then(function () {
      _this.setState({
        unenrollModalOpen: false
      });

      onUnenroll(enrollmentId);
    });
  },
  renderName: function renderName() {
    var scheduledEmail = this.props.scheduledEmail;
    return /*#__PURE__*/_jsx(FormattedName, {
      givenName: scheduledEmail.get('firstName'),
      familyName: scheduledEmail.get('lastName')
    });
  },
  renderDateTime: function renderDateTime() {
    var scheduledEmail = this.props.scheduledEmail;
    var timezoneName = scheduledEmail.getIn(['emailSourceMeta', 'sequenceMeta', 'sequenceEnrollment', 'sequence', 'timezone']);
    return I18n.moment(scheduledEmail.get('scheduledTime')).tz(timezoneName).format('llll z');
  },
  renderEditModal: function renderEditModal() {
    var scheduledEmail = this.props.scheduledEmail;
    var editOpen = this.state.editOpen;

    if (!editOpen) {
      return null;
    }

    var sequenceEnrollment = scheduledEmail.getIn(['emailSourceMeta', 'sequenceMeta', 'sequenceEnrollment']);
    var enrollmentWithoutSteps = sequenceEnrollment.delete('steps');
    return /*#__PURE__*/_jsx(EnrollmentEditModal, {
      enrollment: enrollmentWithoutSteps,
      onConfirm: this.handleEditConfirm,
      onReject: this.handleEditReject
    });
  },
  renderUnenrollConfirm: function renderUnenrollConfirm() {
    if (this.state.unenrollModalOpen === false) {
      return null;
    }

    return /*#__PURE__*/_jsx(UIConfirmModal, {
      message: /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: "outbox.table.unenroll.message",
        options: {
          recipient: this.renderName()
        }
      }),
      description: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "outbox.table.unenroll.description"
      }),
      confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "outbox.table.unenroll.confirm"
      }),
      use: "danger",
      confirmUse: "danger",
      onConfirm: this.handleUnenrollConfirm,
      onReject: this.handleUnenrollReject
    });
  },
  renderEditButton: function renderEditButton() {
    return /*#__PURE__*/_jsx(UIButton, {
      size: "small",
      use: "tertiary-light",
      onClick: this.handleEditClick,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "outbox.table.actions.edit"
      })
    });
  },
  renderEmailSubjectCell: function renderEmailSubjectCell() {
    var scheduledEmail = this.props.scheduledEmail;

    if (!canUseEnrollments()) {
      return /*#__PURE__*/_jsx("td", {
        children: scheduledEmail.get('subject')
      });
    }

    return /*#__PURE__*/_jsx(UITableHoverCell, {
      hoverContent: /*#__PURE__*/_jsxs("span", {
        children: [this.renderEditButton(), /*#__PURE__*/_jsx(UIButton, {
          size: "small",
          use: "tertiary-light",
          onClick: this.handleUnenrollClick,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "outbox.table.actions.unenroll"
          })
        })]
      }),
      children: scheduledEmail.get('subject')
    });
  },
  render: function render() {
    var scheduledEmail = this.props.scheduledEmail;
    return /*#__PURE__*/_jsxs("tr", {
      className: "outbox-table-row",
      "data-reagan": "outbox-table-row",
      children: [/*#__PURE__*/_jsx("td", {
        children: /*#__PURE__*/_jsxs(UIFlex, {
          align: "center",
          children: [/*#__PURE__*/_jsx(UIAvatar, {
            className: "m-right-2",
            lookup: {
              type: 'vid',
              primaryIdentifier: scheduledEmail.get('vid')
            }
          }), /*#__PURE__*/_jsxs(UILink, {
            href: crmContactProfile(scheduledEmail.get('vid')),
            children: [this.renderName(), " (" + scheduledEmail.get('toAddress') + ")"]
          })]
        })
      }), this.renderEmailSubjectCell(), /*#__PURE__*/_jsx("td", {
        children: /*#__PURE__*/_jsx(OutboxEmailSource, {
          scheduledEmail: scheduledEmail
        })
      }), /*#__PURE__*/_jsx("td", {
        className: "text-right",
        children: this.renderDateTime()
      }), this.renderEditModal(), this.renderUnenrollConfirm()]
    });
  }
});