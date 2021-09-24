'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { BATTLESHIP, CANDY_APPLE } from 'HubStyleTokens/colors';
import { Map as ImmutableMap } from 'immutable';
import * as SubscriptionStatusTypes from 'sales-modal/constants/SubscriptionStatusTypes';
import { hasSalesProSeat, canUseBulkEnroll } from 'SequencesUI/lib/permissions';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import formatContactName from 'SequencesUI/util/formatContactName';
import UIFlex from 'UIComponents/layout/UIFlex';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIIcon from 'UIComponents/icon/UIIcon';
import UITooltip from 'UIComponents/tooltip/UITooltip';
export default createReactClass({
  displayName: "EnrollContactRow",
  propTypes: {
    contact: PropTypes.instanceOf(ContactRecord).isRequired,
    isOverLimit: PropTypes.bool.isRequired,
    showTooltip: PropTypes.bool.isRequired,
    numSelectedContacts: PropTypes.number.isRequired,
    salesSubscriptionStatus: PropTypes.oneOfType([PropTypes.oneOf(Object.keys(SubscriptionStatusTypes)), PropTypes.string]),
    sequenceEnrollment: PropTypes.instanceOf(ImmutableMap),
    isSelected: PropTypes.bool,
    setSelectedContact: PropTypes.func.isRequired
  },
  hasSubscriptionStatusError: function hasSubscriptionStatusError() {
    return this.props.salesSubscriptionStatus !== SubscriptionStatusTypes.OK && this.props.salesSubscriptionStatus !== null;
  },
  isDisabled: function isDisabled() {
    return this.props.isOverLimit && !this.props.isSelected || this.hasSubscriptionStatusError() || this.props.sequenceEnrollment !== null;
  },
  handleSetSelectedContact: function handleSetSelectedContact(e) {
    e.stopPropagation();
    e.preventDefault();

    if (!this.isDisabled()) {
      this.props.setSelectedContact({
        contact: this.props.contact,
        checked: !this.props.isSelected
      });
    }
  },
  formattedContactName: function formattedContactName() {
    return formatContactName(this.props.contact);
  },
  getTooltipTitle: function getTooltipTitle() {
    var numSelectedContacts = this.props.numSelectedContacts;
    var isSalesProWithoutBulkEnrollPermission = hasSalesProSeat() && !canUseBulkEnroll();

    if (isSalesProWithoutBulkEnrollPermission) {
      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.enroll.table.noBulkEnrollPermission"
      });
    }

    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "summary.enroll.table.contactSelectionMax",
      options: {
        num: numSelectedContacts
      }
    });
  },
  renderContact: function renderContact() {
    var _this$props = this.props,
        salesSubscriptionStatus = _this$props.salesSubscriptionStatus,
        sequenceEnrollment = _this$props.sequenceEnrollment;
    var contactName = this.formattedContactName();

    if (sequenceEnrollment !== null) {
      return /*#__PURE__*/_jsx(UITooltip, {
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.enroll.table.contactAlreadyEnrolled"
        }),
        children: /*#__PURE__*/_jsx("td", {
          style: {
            color: BATTLESHIP
          },
          children: contactName
        })
      });
    }

    if (this.hasSubscriptionStatusError()) {
      return /*#__PURE__*/_jsx(UITooltip, {
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.enroll.table.enrollmentErrors." + salesSubscriptionStatus
        }),
        use: "danger",
        headingText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "summary.enroll.table.enrollmentErrors." + salesSubscriptionStatus + "_TITLE"
        }),
        children: /*#__PURE__*/_jsx("td", {
          style: {
            color: BATTLESHIP
          },
          children: /*#__PURE__*/_jsxs(UIFlex, {
            align: "center",
            children: [contactName, /*#__PURE__*/_jsx(UIIcon, {
              name: "warning",
              size: "xxs",
              color: CANDY_APPLE,
              className: "m-left-2"
            })]
          })
        })
      });
    }

    return /*#__PURE__*/_jsx("td", {
      children: contactName
    });
  },
  render: function render() {
    var _this$props2 = this.props,
        isSelected = _this$props2.isSelected,
        showTooltip = _this$props2.showTooltip;
    var disabled = this.isDisabled();
    return /*#__PURE__*/_jsxs("tr", {
      onClick: this.handleSetSelectedContact,
      className: "pointer",
      "data-enroll-contact-id": this.props.contact.vid,
      children: [/*#__PURE__*/_jsx("td", {
        className: "p-all-0",
        children: /*#__PURE__*/_jsx(UIFlex, {
          align: "center",
          justify: "center",
          children: /*#__PURE__*/_jsx(UITooltip, {
            title: this.getTooltipTitle(),
            disabled: !showTooltip,
            placement: "right",
            children: /*#__PURE__*/_jsx(UICheckbox, {
              innerPadding: "none",
              name: "selected-contact",
              checked: isSelected,
              disabled: disabled,
              "aria-label": this.formattedContactName()
            })
          })
        })
      }), this.renderContact()]
    });
  }
});