'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Iterable, Map as ImmutableMap } from 'immutable';
import { connect } from 'react-redux';
import { getEligibility } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import FormattedName from 'I18n/components/FormattedName';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import UIBreakString from 'UIComponents/text/UIBreakString';
import UILink from 'UIComponents/link/UILink';
import UITag from 'UIComponents/tag/UITag';
import UITable from 'UIComponents/table/UITable';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { getProperty, getAssociatedCompanyId } from 'customer-data-objects/model/ImmutableModel';
import { companyProfile, contactProfile } from 'sales-modal/lib/links';
import getIneligibleContactReason from 'sales-modal/utils/enrollModal/getIneligibleContactReason';
import { cannotEnrollSequenceLearnMore } from 'sales-modal/lib/links';
var IneligibleContactsTable = createReactClass({
  displayName: "IneligibleContactsTable",
  propTypes: {
    ineligibleContacts: PropTypes.instanceOf(Iterable).isRequired,
    contacts: PropTypes.instanceOf(ImmutableMap).isRequired,
    eligibility: PropTypes.instanceOf(ImmutableMap).isRequired
  },
  getTooltip: function getTooltip(reason) {
    var message = reason ? "enrollModal.cannotEnrollSequence.reason." + reason.toLowerCase() : 'enrollModal.cannotEnrollSequence.unknownReason';

    var learnMoreLink = /*#__PURE__*/_jsx(UILink, {
      href: cannotEnrollSequenceLearnMore(),
      external: true,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.cannotEnrollSequence.learnMoreText"
      })
    });

    return /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: message,
      options: {
        learnMoreLink: learnMoreLink
      }
    });
  },
  renderName: function renderName(contactRecord) {
    var fullName = /*#__PURE__*/_jsx(FormattedName, {
      givenName: getProperty(contactRecord, 'firstname'),
      familyName: getProperty(contactRecord, 'lastname'),
      email: getProperty(contactRecord, 'email')
    });

    return /*#__PURE__*/_jsx(UILink, {
      href: contactProfile(contactRecord.get('vid')),
      external: true,
      children: fullName
    });
  },
  renderCompany: function renderCompany(contactRecord) {
    var companyId = getAssociatedCompanyId(contactRecord);

    if (!companyId) {
      return '--';
    }

    var pathToCompanyName = ['associated-company', 'properties', 'name', 'value'];
    var companyName = contactRecord.getIn(pathToCompanyName) || '--';
    return /*#__PURE__*/_jsx(UILink, {
      href: companyProfile(companyId),
      external: true,
      children: companyName
    });
  },
  renderTag: function renderTag(contact, contactId) {
    var reason = getIneligibleContactReason({
      contact: contact,
      eligibility: this.props.eligibility.get(contactId)
    });
    var message = reason ? "enrollModal.cannotEnrollSequence.reasonTag." + reason.toLowerCase() : 'enrollModal.cannotEnrollSequence.reasonTag.unknown';
    return /*#__PURE__*/_jsx(UITooltip, {
      title: this.getTooltip(reason),
      children: /*#__PURE__*/_jsx(UITag, {
        use: "danger",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: message
        })
      })
    });
  },
  renderRow: function renderRow(contactId) {
    var contactRecord = this.props.contacts.get(contactId);
    return /*#__PURE__*/_jsxs("tr", {
      children: [/*#__PURE__*/_jsx("td", {
        "data-ineligible-contact": "name",
        children: this.renderName(contactRecord)
      }), /*#__PURE__*/_jsx("td", {
        "data-ineligible-contact": "email",
        children: /*#__PURE__*/_jsx(UIBreakString, {
          children: getProperty(contactRecord, 'email') || '--'
        })
      }), /*#__PURE__*/_jsx("td", {
        "data-ineligible-contact": "company",
        children: this.renderCompany(contactRecord)
      }), /*#__PURE__*/_jsx("td", {
        "data-ineligible-contact": "status",
        children: this.renderTag(contactRecord, contactId)
      })]
    }, "bulk-enroll-ineligible-" + contactId);
  },
  renderHeadings: function renderHeadings() {
    return /*#__PURE__*/_jsxs("tr", {
      children: [/*#__PURE__*/_jsx("th", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "ineligibleContactsPage.tableHeaders.contactName"
        })
      }), /*#__PURE__*/_jsx("th", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "ineligibleContactsPage.tableHeaders.email"
        })
      }), /*#__PURE__*/_jsx("th", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "ineligibleContactsPage.tableHeaders.company"
        })
      }), /*#__PURE__*/_jsx("th", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "ineligibleContactsPage.tableHeaders.status"
        })
      })]
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsxs(UITable, {
      className: "contact-table",
      children: [/*#__PURE__*/_jsx("thead", {
        children: this.renderHeadings()
      }), /*#__PURE__*/_jsx("tbody", {
        children: this.props.ineligibleContacts.map(this.renderRow)
      })]
    });
  }
});
export default connect(function (state) {
  return {
    eligibility: getEligibility(state)
  };
})(IneligibleContactsTable);