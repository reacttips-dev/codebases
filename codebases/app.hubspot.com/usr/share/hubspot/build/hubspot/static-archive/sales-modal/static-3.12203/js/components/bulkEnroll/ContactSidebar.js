'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import formatName from 'I18n/utils/formatName';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import { Map as ImmutableMap } from 'immutable';
import { connect } from 'react-redux';
import FormattedMessage from 'I18n/components/FormattedMessage';
import partial from 'transmute/partial';
import { getFilteredContacts as getFilteredContactsSelector, getUnenrolledContacts as getUnenrolledContactsSelector, getSequenceEnrollmentTokenErrors as getSequenceEnrollmentTokenErrorsSelector, getSearchText as getSearchTextSelector, getSequenceEnrollmentIsUploadingImage } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import * as EnrollmentStateActions from 'sales-modal/redux/actions/EnrollmentStateActions';
import { PRIMARY_SEQUENCE_ID } from 'sales-modal/constants/BulkEnrollConstants';
import PersonalizeBulkEnrollTourStep from 'sales-modal/components/bulkEnroll/shepherdTour/PersonalizeBulkEnrollTourStep';
import UIList from 'UIComponents/list/UIList';
import UIStatusDot from 'UIComponents/tag/UIStatusDot';
import Small from 'UIComponents/elements/Small';
import UISearchInput from 'UIComponents/input/UISearchInput';
import UIScrollingColumn from 'UIComponents/layout/UIScrollingColumn';
import UISelectableButton from 'UIComponents/button/UISelectableButton';
import UIFlex from 'UIComponents/layout/UIFlex';
import UITruncateString from 'UIComponents/text/UITruncateString';
var ContactSidebar = createReactClass({
  displayName: "ContactSidebar",
  propTypes: {
    filteredContacts: PropTypes.instanceOf(ImmutableMap).isRequired,
    unenrolledContacts: PropTypes.instanceOf(ImmutableMap).isRequired,
    selectContact: PropTypes.func.isRequired,
    selectedContact: PropTypes.string,
    sequenceEnrollmentTokenErrors: PropTypes.instanceOf(ImmutableMap).isRequired,
    updateSearchText: PropTypes.func.isRequired,
    searchText: PropTypes.string,
    isUploadingImage: PropTypes.bool.isRequired
  },
  contextTypes: {
    bulkEnrollTour: PropTypes.object
  },
  handleUpdateSearchText: function handleUpdateSearchText(_ref) {
    var value = _ref.target.value;
    this.props.updateSearchText(value);
  },
  handleContactButtonClick: function handleContactButtonClick(vid) {
    this.props.selectContact(vid);
  },
  renderPrimarySequenceButton: function renderPrimarySequenceButton() {
    var isUploadingImage = this.props.isUploadingImage;
    return /*#__PURE__*/_jsx(UISelectableButton, {
      size: "auto",
      block: true,
      disabled: isUploadingImage,
      onClick: partial(this.handleContactButtonClick, PRIMARY_SEQUENCE_ID),
      selected: this.props.selectedContact === PRIMARY_SEQUENCE_ID,
      "data-selenium-test": "sequence-bulk-enroll-primary-sequence-button",
      children: /*#__PURE__*/_jsx(UIFlex, {
        direction: "row",
        align: "center",
        className: "contact-sidebar-primary-sequence-button",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "bulkEnroll.primarySequence.buttonTitle",
          "data-selenium-test": "sequence-bulk-enroll-contact-count",
          options: {
            contactsSelected: this.props.unenrolledContacts.size
          }
        })
      })
    });
  },
  renderEnrollStatus: function renderEnrollStatus(vid) {
    if (!this.props.sequenceEnrollmentTokenErrors.get(vid)) {
      return null;
    }

    return /*#__PURE__*/_jsxs("div", {
      className: "p-top-1",
      children: [/*#__PURE__*/_jsx(UIStatusDot, {
        use: "danger"
      }), /*#__PURE__*/_jsx(Small, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "bulkEnroll.sidebar.contacts.errorStatus.mergeTags"
        })
      })]
    });
  },
  renderContact: function renderContact(contact, index) {
    var isUploadingImage = this.props.isUploadingImage;
    var contactProperties = contact.get('properties');
    var email = contactProperties.getIn(['email', 'value']);
    var name = formatName({
      firstName: contactProperties.getIn(['firstname', 'value']),
      lastName: contactProperties.getIn(['lastname', 'value']),
      email: email
    });
    var vid = "" + contact.get('vid');

    var contactButton = /*#__PURE__*/_jsx(UISelectableButton, {
      className: "m-bottom-2",
      disabled: isUploadingImage,
      size: "auto",
      block: true,
      onClick: partial(this.handleContactButtonClick, vid),
      selected: this.props.selectedContact === vid,
      "data-selenium-test": "sequence-bulk-enroll-contact-button",
      children: /*#__PURE__*/_jsx(UIFlex, {
        direction: "row",
        className: "contact-sidebar-button",
        children: /*#__PURE__*/_jsxs(UIFlex, {
          direction: "column",
          children: [/*#__PURE__*/_jsx(UITruncateString, {
            children: name
          }), /*#__PURE__*/_jsx(Small, {
            children: /*#__PURE__*/_jsx(UITruncateString, {
              children: email
            })
          }), this.renderEnrollStatus(vid)]
        })
      })
    }, email);

    return index === 0 ? /*#__PURE__*/_jsx(PersonalizeBulkEnrollTourStep, {
      onFinish: this.context.bulkEnrollTour.setTourAsCompleted,
      onCloseButtonClick: this.context.bulkEnrollTour.finishTour,
      children: contactButton
    }, email) : contactButton;
  },
  renderContacts: function renderContacts() {
    var filteredContacts = this.props.filteredContacts;

    if (!filteredContacts.size) {
      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: "bulkEnroll.sidebar.searchNoResults"
      });
    }

    return filteredContacts.toList().map(this.renderContact);
  },
  renderStickyHeader: function renderStickyHeader() {
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [this.renderPrimarySequenceButton(), /*#__PURE__*/_jsx("div", {
        className: "p-y-4",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          className: "contact-sidebar-personalize-title",
          message: "bulkEnroll.sidebar.personalizeContacts"
        })
      }), /*#__PURE__*/_jsx(UISearchInput, {
        inputClassName: "m-bottom-4",
        placeholder: I18n.text('bulkEnroll.sidebar.searchPlaceholder'),
        onChange: this.handleUpdateSearchText,
        value: this.props.searchText
      })]
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsx(UIScrollingColumn, {
      className: "bulk-enroll-contact-sidebar",
      headerContent: this.renderStickyHeader(),
      children: /*#__PURE__*/_jsx(UIList, {
        className: "m-all-1",
        children: this.renderContacts()
      })
    });
  }
});
export default connect(function (state) {
  return {
    filteredContacts: getFilteredContactsSelector(state),
    unenrolledContacts: getUnenrolledContactsSelector(state),
    sequenceEnrollmentTokenErrors: getSequenceEnrollmentTokenErrorsSelector(state),
    searchText: getSearchTextSelector(state),
    isUploadingImage: getSequenceEnrollmentIsUploadingImage(state)
  };
}, {
  selectContact: EnrollmentStateActions.selectContact,
  updateSearchText: EnrollmentStateActions.updateSearchText
})(ContactSidebar);