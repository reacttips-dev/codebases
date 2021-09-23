'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { OrderedSet, Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { hasSalesProSeat, canUseBulkEnroll } from 'SequencesUI/lib/permissions';
import UITable from 'UIComponents/table/UITable';
import UIFlex from 'UIComponents/layout/UIFlex';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import EnrollContactLoadingRow from './EnrollContactLoadingRow';
import EnrollContactEmptyRow from './EnrollContactEmptyRow';
import EnrollContactRow from './EnrollContactRow';
var BULK_ENROLL_LIMIT = 50;
export default createReactClass({
  displayName: "EnrollContactTable",
  propTypes: {
    contacts: PropTypes.instanceOf(OrderedSet).isRequired,
    eligibilityResults: PropTypes.instanceOf(ImmutableMap).isRequired,
    isLoading: PropTypes.bool.isRequired,
    selectedContacts: PropTypes.instanceOf(ImmutableMap),
    nextOffset: PropTypes.number.isRequired,
    total: PropTypes.number,
    contactSearch: PropTypes.func.isRequired,
    setSelectedContact: PropTypes.func.isRequired
  },
  componentDidMount: function componentDidMount() {
    this._searchResultsTable.addEventListener('scroll', this.fetchMoreContacts);

    this._searchResultsTable.addEventListener('resize', this.fetchMoreContacts);
  },
  componentWillUnmount: function componentWillUnmount() {
    this._searchResultsTable.removeEventListener('scroll', this.fetchMoreContacts);

    this._searchResultsTable.removeEventListener('resize', this.fetchMoreContacts);
  },
  fetchMoreContacts: function fetchMoreContacts() {
    var _this$props = this.props,
        isLoading = _this$props.isLoading,
        nextOffset = _this$props.nextOffset,
        contactSearch = _this$props.contactSearch;
    var _this$_searchResultsT = this._searchResultsTable,
        scrollTop = _this$_searchResultsT.scrollTop,
        scrollHeight = _this$_searchResultsT.scrollHeight,
        clientHeight = _this$_searchResultsT.clientHeight;
    var isCloseToBottom = scrollTop + clientHeight + 50 >= scrollHeight;

    if (this.hasMore() && isCloseToBottom && !isLoading) {
      contactSearch(nextOffset);
    }
  },
  hasMore: function hasMore() {
    var _this$props2 = this.props,
        total = _this$props2.total,
        nextOffset = _this$props2.nextOffset;
    return total !== null && nextOffset < total;
  },
  renderTableBody: function renderTableBody() {
    var _this$props3 = this.props,
        contacts = _this$props3.contacts,
        eligibilityResults = _this$props3.eligibilityResults,
        isLoading = _this$props3.isLoading,
        selectedContacts = _this$props3.selectedContacts,
        total = _this$props3.total,
        setSelectedContact = _this$props3.setSelectedContact;

    if (isLoading && total === null) {
      return /*#__PURE__*/_jsx(EnrollContactLoadingRow, {});
    }

    if (contacts.isEmpty()) {
      return /*#__PURE__*/_jsx(EnrollContactEmptyRow, {});
    }

    var tooManyContactsSelected;

    if (canUseBulkEnroll()) {
      tooManyContactsSelected = selectedContacts.size >= BULK_ENROLL_LIMIT;
    } else {
      tooManyContactsSelected = selectedContacts.size >= 1;
    } // Don't show tooltip as there is already messaging in the footer PQL


    var canSeePQL = !hasSalesProSeat();
    var showTooltip = tooManyContactsSelected && !canSeePQL;
    return contacts.map(function (contact) {
      var vid = contact.get('vid');

      var _eligibilityResults$g = eligibilityResults.getIn(["" + vid, 'metadata']).toObject(),
          salesSubscriptionStatus = _eligibilityResults$g.salesSubscriptionStatus,
          activeEnrollment = _eligibilityResults$g.activeEnrollment;

      return /*#__PURE__*/_jsx(EnrollContactRow, {
        contact: contact,
        salesSubscriptionStatus: salesSubscriptionStatus,
        sequenceEnrollment: activeEnrollment,
        isSelected: selectedContacts.has(vid),
        setSelectedContact: setSelectedContact,
        isOverLimit: tooManyContactsSelected,
        showTooltip: showTooltip,
        numSelectedContacts: selectedContacts.size
      }, "contact-row-" + vid);
    });
  },
  renderLoadingMore: function renderLoadingMore() {
    if (!this.hasMore()) {
      return null;
    }

    return /*#__PURE__*/_jsx(UIFlex, {
      className: "m-bottom-5",
      children: /*#__PURE__*/_jsx(UILoadingSpinner, {
        grow: true,
        minHeight: 50
      })
    });
  },
  render: function render() {
    var _this = this;

    return /*#__PURE__*/_jsxs("div", {
      style: {
        overflowY: 'auto'
      },
      className: "enroll-contact-search-results",
      ref: function ref(c) {
        return _this._searchResultsTable = c;
      },
      children: [/*#__PURE__*/_jsxs(UITable, {
        children: [/*#__PURE__*/_jsxs("colgroup", {
          children: [/*#__PURE__*/_jsx("col", {
            style: {
              width: 80
            }
          }), /*#__PURE__*/_jsx("col", {})]
        }), /*#__PURE__*/_jsx("thead", {
          children: /*#__PURE__*/_jsxs("tr", {
            children: [/*#__PURE__*/_jsx("th", {}), /*#__PURE__*/_jsx("th", {
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "summary.enroll.table.contact"
              })
            })]
          })
        }), /*#__PURE__*/_jsx("tbody", {
          children: this.renderTableBody()
        })]
      }), this.renderLoadingMore()]
    });
  }
});