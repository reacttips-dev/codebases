'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UISearchInput from 'UIComponents/input/UISearchInput';
import { MAX_SEARCH_QUERY_LENGTH, SEARCH_QUERY_WARN_LENGTH } from 'FileManagerCore/Constants';
import { DrawerTypes } from '../../Constants';
import { enterSearchPanel } from '../../actions/Actions';
import AdvancedSearchPopover from 'FileManagerCore/components/AdvancedSearchPopover';
import { getHasSeenAdvancedSearchPickerPopup } from 'FileManagerCore/selectors/UserSettings';
import { dismissAdvancedSearchPickerPopup } from 'FileManagerCore/actions/PortalMeta';
import { trackInteraction } from 'FileManagerCore/actions/tracking';
import { getIsShutterstockEnabled } from '../../selectors/Configuration';

var SearchWithSuggestions = /*#__PURE__*/function (_Component) {
  _inherits(SearchWithSuggestions, _Component);

  function SearchWithSuggestions() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, SearchWithSuggestions);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(SearchWithSuggestions)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      searchQuery: ''
    };

    _this.getValidationMessage = function (value) {
      if (value && value.length > SEARCH_QUERY_WARN_LENGTH) {
        return /*#__PURE__*/_jsx(FormattedMessage, {
          message: "FileManagerCore.search.overMaxLength",
          options: {
            maxLength: MAX_SEARCH_QUERY_LENGTH
          }
        });
      }

      return null;
    };

    _this.handleSearchChange = function (event) {
      _this.setState({
        searchQuery: event.target.value
      });
    };

    _this.handleSearchKeyUp = function (event) {
      var searchQuery = _this.state.searchQuery;

      if (event.key === 'Enter' && searchQuery) {
        _this.props.enterSearchPanel(searchQuery);
      }
    };

    return _this;
  }

  _createClass(SearchWithSuggestions, [{
    key: "getPlaceholder",
    value: function getPlaceholder() {
      var _this$props = this.props,
          type = _this$props.type,
          isShutterstockEnabled = _this$props.isShutterstockEnabled;

      switch (type) {
        case DrawerTypes.IMAGE:
          return isShutterstockEnabled ? I18n.text('FileManagerLib.searchImagesPlaceholder') : I18n.text('FileManagerLib.searchImagesPlaceholderNoShutterstock');

        case DrawerTypes.VIDEO:
        case DrawerTypes.HUBL_VIDEO:
          return I18n.text('FileManagerLib.searchVideosPlaceholder');

        default:
          return I18n.text('FileManagerLib.searchFilesPlaceholder');
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          hasSeenAdvancedSearchPickerPopup = _this$props2.hasSeenAdvancedSearchPickerPopup,
          dismissAdvancedSearchPopup = _this$props2.dismissAdvancedSearchPickerPopup,
          handleTrackInteraction = _this$props2.trackInteraction;
      var searchQuery = this.state.searchQuery;
      return /*#__PURE__*/_jsx(AdvancedSearchPopover, {
        hasSeen: hasSeenAdvancedSearchPickerPopup,
        dismiss: dismissAdvancedSearchPopup,
        trackInteraction: handleTrackInteraction,
        children: /*#__PURE__*/_jsx(UISearchInput, {
          className: "m-top-3",
          value: searchQuery,
          placeholder: this.getPlaceholder(),
          onChange: this.handleSearchChange,
          onKeyUp: this.handleSearchKeyUp,
          getValidationMessage: this.getValidationMessage,
          maxLength: MAX_SEARCH_QUERY_LENGTH,
          "data-test-id": "drawer-search-input"
        })
      });
    }
  }]);

  return SearchWithSuggestions;
}(Component);

SearchWithSuggestions.propTypes = {
  type: PropTypes.oneOf(Object.keys(DrawerTypes)).isRequired,
  enterSearchPanel: PropTypes.func.isRequired,
  hasSeenAdvancedSearchPickerPopup: PropTypes.bool,
  dismissAdvancedSearchPickerPopup: PropTypes.func.isRequired,
  trackInteraction: PropTypes.func.isRequired,
  isShutterstockEnabled: PropTypes.bool.isRequired
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    hasSeenAdvancedSearchPickerPopup: getHasSeenAdvancedSearchPickerPopup(state),
    isShutterstockEnabled: getIsShutterstockEnabled(state)
  };
};

var mapDispatchToProps = {
  enterSearchPanel: enterSearchPanel,
  dismissAdvancedSearchPickerPopup: dismissAdvancedSearchPickerPopup,
  trackInteraction: trackInteraction
};
export default connect(mapStateToProps, mapDispatchToProps)(SearchWithSuggestions);