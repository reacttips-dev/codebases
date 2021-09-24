'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Iterable, Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H3 from 'UIComponents/elements/headings/H3';
import UIButton from 'UIComponents/button/UIButton';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UISection from 'UIComponents/section/UISection';
import IneligibleContactsTable from './IneligibleContactsTable';
var IneligibleContactsPage = createReactClass({
  displayName: "IneligibleContactsPage",
  propTypes: {
    contacts: PropTypes.instanceOf(ImmutableMap).isRequired,
    ineligibleContacts: PropTypes.instanceOf(Iterable).isRequired,
    removeContacts: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired
  },
  handleClickContinue: function handleClickContinue() {
    this.props.removeContacts(this.props.ineligibleContacts);
  },
  getEligibleContactsCount: function getEligibleContactsCount() {
    return this.props.contacts.size - this.props.ineligibleContacts.size;
  },
  renderIneligibleContacts: function renderIneligibleContacts() {
    return /*#__PURE__*/_jsx(IneligibleContactsTable, {
      ineligibleContacts: this.props.ineligibleContacts,
      contacts: this.props.contacts
    });
  },
  renderContinueButton: function renderContinueButton() {
    if (this.getEligibleContactsCount()) {
      return /*#__PURE__*/_jsx(UIButton, {
        use: "primary",
        onClick: this.handleClickContinue,
        className: "flex-order-1",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "ineligibleContactsPage.buttons.continue",
          options: {
            count: this.getEligibleContactsCount()
          }
        })
      });
    }

    return null;
  },
  renderFooter: function renderFooter() {
    return /*#__PURE__*/_jsxs("div", {
      className: "sequence-enroll-modal-footer justify-between",
      children: [this.renderContinueButton(), /*#__PURE__*/_jsx(UIButton, {
        use: "transparent",
        className: "m-right-5 m-left-0",
        onClick: this.props.onReject,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.cancel"
        })
      })]
    });
  },
  render: function render() {
    var _this$props = this.props,
        contacts = _this$props.contacts,
        ineligibleContacts = _this$props.ineligibleContacts;
    return /*#__PURE__*/_jsxs(UIFlex, {
      className: "sequence-enroll-full-page ineligible-contacts-page",
      direction: "column",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "modal-body width-100",
        align: "center",
        children: [/*#__PURE__*/_jsx(UISection, {
          use: "island",
          children: /*#__PURE__*/_jsx(UIIllustration, {
            name: "cone",
            height: 170
          })
        }), /*#__PURE__*/_jsx(UISection, {
          children: /*#__PURE__*/_jsx(H3, {
            "aria-level": 2,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "ineligibleContactsPage.title",
              options: {
                ineligibleContacts: ineligibleContacts.size,
                contactsSelected: contacts.size
              }
            })
          })
        }), /*#__PURE__*/_jsx(UISection, {
          use: "island",
          children: this.renderIneligibleContacts()
        })]
      }), this.renderFooter()]
    });
  }
});
export default IneligibleContactsPage;