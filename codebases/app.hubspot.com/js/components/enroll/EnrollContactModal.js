'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { NavMarker } from 'react-rhumb';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { Map as ImmutableMap, OrderedSet } from 'immutable';
import debounce from 'transmute/debounce';
import * as ContactApi from 'SequencesUI/api/ContactApi';
import { defaultQuery } from 'SequencesUI/lib/ContactsSearchAPIQuery';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import UIModalPanel from 'UIComponents/dialog/UIModalPanel';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import H2 from 'UIComponents/elements/headings/H2';
import EnrollContactBody from './EnrollContactBody';
import EnrollContactFooter from './EnrollContactFooter';
var SEARCH_COUNT = 20;

var EnrollContactModal = /*#__PURE__*/function (_Component) {
  _inherits(EnrollContactModal, _Component);

  function EnrollContactModal(props) {
    var _this;

    _classCallCheck(this, EnrollContactModal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EnrollContactModal).call(this, props));
    _this.state = {
      query: '',
      selectedContacts: ImmutableMap(),
      contacts: OrderedSet(),
      eligibilityResults: ImmutableMap(),
      nextOffset: 0,
      total: null,
      isLoading: true
    };
    _this.contactSearch = _this.contactSearch.bind(_assertThisInitialized(_this));
    _this.handleSearchChange = _this.handleSearchChange.bind(_assertThisInitialized(_this));
    _this.setSelectedContact = _this.setSelectedContact.bind(_assertThisInitialized(_this));
    _this.debouncedContactSearch = debounce(300, _this.contactSearch);
    return _this;
  }

  _createClass(EnrollContactModal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.contactSearch();
    }
  }, {
    key: "contactSearch",
    value: function contactSearch(nextOffset) {
      var _this2 = this;

      ContactApi.searchCommunicateContacts(defaultQuery({
        offset: nextOffset !== undefined ? nextOffset : this.state.nextOffset,
        query: this.state.query,
        count: SEARCH_COUNT
      })).then(function (searchResults) {
        var _searchResults$toObje = searchResults.toObject(),
            offset = _searchResults$toObje.offset,
            total = _searchResults$toObje.total,
            eligibilityResults = _searchResults$toObje.eligibilityResults,
            _results = _searchResults$toObje._results;

        var contactResults = _results.map(function (contact) {
          return new ContactRecord(contact);
        }).toOrderedSet();

        _this2.setState(function (state) {
          return {
            total: total,
            eligibilityResults: state.eligibilityResults.merge(eligibilityResults),
            nextOffset: offset,
            contacts: state.contacts.concat(contactResults),
            isLoading: false
          };
        });
      });
    }
  }, {
    key: "handleSearchChange",
    value: function handleSearchChange(e) {
      this.setState({
        contacts: OrderedSet(),
        nextOffset: 0,
        total: null,
        query: e.target.value,
        isLoading: true
      }, this.debouncedContactSearch);
    }
  }, {
    key: "setSelectedContact",
    value: function setSelectedContact(_ref) {
      var contact = _ref.contact,
          checked = _ref.checked;
      this.setState(function (_ref2) {
        var selectedContacts = _ref2.selectedContacts;
        var vid = contact.get('vid');
        return {
          selectedContacts: checked ? selectedContacts.set(vid, contact) : selectedContacts.remove(vid)
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var useMultipleContactSelection = this.props.useMultipleContactSelection;
      var _this$state = this.state,
          contacts = _this$state.contacts,
          eligibilityResults = _this$state.eligibilityResults,
          selectedContacts = _this$state.selectedContacts,
          isLoading = _this$state.isLoading,
          nextOffset = _this$state.nextOffset,
          total = _this$state.total;
      var header = useMultipleContactSelection ? /*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.enroll.header.contacts"
      }) : /*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.enroll.header.contact"
      });
      return /*#__PURE__*/_jsxs(UIModalPanel, {
        onEsc: function onEsc(e) {
          e.preventDefault();
          e.stopPropagation();
        },
        width: 600,
        children: [/*#__PURE__*/_jsx(NavMarker, {
          name: "ENROLL_PANEL_LOAD"
        }), /*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: function onClick() {
              return _this3.props.onReject();
            }
          }), /*#__PURE__*/_jsx(H2, {
            children: header
          })]
        }), /*#__PURE__*/_jsx(EnrollContactBody, {
          contacts: contacts,
          eligibilityResults: eligibilityResults,
          selectedContacts: selectedContacts,
          isLoading: isLoading,
          nextOffset: nextOffset,
          total: total,
          searchCount: SEARCH_COUNT,
          setSelectedContact: this.setSelectedContact,
          handleSearchChange: this.handleSearchChange,
          contactSearch: this.contactSearch
        }), /*#__PURE__*/_jsx(EnrollContactFooter, {
          useMultipleContactSelection: useMultipleContactSelection,
          selectedContacts: selectedContacts,
          onConfirm: this.props.onConfirm,
          onReject: this.props.onReject
        })]
      });
    }
  }]);

  return EnrollContactModal;
}(Component);

EnrollContactModal.propTypes = {
  useMultipleContactSelection: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};
export default EnrollContactModal;