'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import UILink from 'UIComponents/link/UILink';
import UIButton from 'UIComponents/button/UIButton';
import CannotEnrollReasonTypes from 'sales-modal/constants/CannotEnrollReasonTypes';
import { cannotEnrollSequenceLearnMore } from 'sales-modal/lib/links';
export default createReactClass({
  displayName: "CannotEnrollSequence",
  propTypes: {
    contact: PropTypes.instanceOf(ContactRecord),
    reason: PropTypes.oneOf(Object.values(CannotEnrollReasonTypes || {})).isRequired,
    onReject: PropTypes.func.isRequired
  },
  renderHeadline: function renderHeadline() {
    var contact = this.props.contact;
    var firstName = contact ? getProperty(contact, 'firstname') : null;

    if (firstName) {
      return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "enrollModal.cannotEnrollSequence.headlineForKnownName",
        options: {
          firstName: firstName
        }
      });
    }

    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "enrollModal.cannotEnrollSequence.headlineForContact"
    });
  },
  renderLearnMoreLink: function renderLearnMoreLink() {
    return /*#__PURE__*/_jsx(UILink, {
      href: cannotEnrollSequenceLearnMore(),
      external: true,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.cannotEnrollSequence.learnMoreText"
      })
    });
  },
  renderDescription: function renderDescription() {
    var reason = this.props.reason;

    if (CannotEnrollReasonTypes[reason]) {
      return /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: "enrollModal.cannotEnrollSequence.reason." + reason.toLowerCase(),
        options: {
          learnMoreLink: this.renderLearnMoreLink()
        }
      });
    }

    return /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "enrollModal.cannotEnrollSequence.unknownReason",
      options: {
        learnMoreLink: this.renderLearnMoreLink()
      }
    });
  },
  renderGotIt: function renderGotIt() {
    return /*#__PURE__*/_jsx(UIButton, {
      className: "m-auto-y-0",
      active: true,
      onClick: this.props.onReject,
      use: "primary",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.cannotEnrollSequence.gotIt"
      })
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsxs("div", {
      className: "enrollment-cannot-proceed text-center p-all-5",
      children: [/*#__PURE__*/_jsx("h4", {
        children: this.renderHeadline()
      }), /*#__PURE__*/_jsx("p", {
        children: this.renderDescription()
      }), /*#__PURE__*/_jsx("p", {
        children: this.renderGotIt()
      })]
    });
  }
});