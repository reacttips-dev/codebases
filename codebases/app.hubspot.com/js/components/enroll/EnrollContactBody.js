'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';
import I18n from 'I18n';
import { OrderedSet, Map as ImmutableMap } from 'immutable';
import { KOALA } from 'HubStyleTokens/colors';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UISearchInput from 'UIComponents/input/UISearchInput';
import EnrollContactTable from './EnrollContactTable';

var EnrollContactBody = function EnrollContactBody(_ref) {
  var contacts = _ref.contacts,
      eligibilityResults = _ref.eligibilityResults,
      selectedContacts = _ref.selectedContacts,
      isLoading = _ref.isLoading,
      nextOffset = _ref.nextOffset,
      total = _ref.total,
      searchCount = _ref.searchCount,
      setSelectedContact = _ref.setSelectedContact,
      handleSearchChange = _ref.handleSearchChange,
      contactSearch = _ref.contactSearch;
  var inputRef = useRef(null);
  useEffect(function () {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return /*#__PURE__*/_jsxs(UIDialogBody, {
    className: "enroll-contact-body p-all-0",
    children: [/*#__PURE__*/_jsx("div", {
      className: "p-all-4",
      style: {
        background: KOALA
      },
      children: /*#__PURE__*/_jsx(UISearchInput, {
        inputRef: inputRef,
        use: "on-dark",
        placeholder: I18n.text('summary.enroll.searchPlaceholder'),
        onChange: handleSearchChange
      })
    }), /*#__PURE__*/_jsx(EnrollContactTable, {
      contacts: contacts,
      eligibilityResults: eligibilityResults,
      isLoading: isLoading,
      selectedContacts: selectedContacts,
      nextOffset: nextOffset,
      total: total,
      searchCount: searchCount,
      setSelectedContact: setSelectedContact,
      contactSearch: contactSearch
    })]
  });
};

EnrollContactBody.propTypes = {
  contacts: PropTypes.instanceOf(OrderedSet).isRequired,
  eligibilityResults: PropTypes.instanceOf(ImmutableMap).isRequired,
  selectedContacts: PropTypes.instanceOf(ImmutableMap),
  isLoading: PropTypes.bool.isRequired,
  nextOffset: PropTypes.number.isRequired,
  total: PropTypes.number,
  searchCount: PropTypes.number.isRequired,
  setSelectedContact: PropTypes.func.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
  contactSearch: PropTypes.func.isRequired
};
export default EnrollContactBody;