'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import memoizeLast from 'transmute/memoizeLast';
import getIn from 'transmute/getIn';
import { OrderedMap } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import emptyFunction from 'react-utils/emptyFunction';
import UILink from 'UIComponents/link/UILink';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import { UNINITIALIZED, LOADING, SUCCEEDED, FAILED } from 'calling-lifecycle-internal/async-flux-utils/constants/apiLoadingStates';
import CalleeOptions from './CalleeOptions';
import { getObjectId, getObjectTypeId, getFromObject, getCallableObjects, getHasMoreCallees, getAssociatedObjects, getResults } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import { AssociatedObjectType } from 'calling-lifecycle-internal/callees/records/CalleesRecords';
import { isCallableObjectTypeId } from 'calling-lifecycle-internal/callees/operators/isCallableObjectTypeId';
import { fetchCalleeSearchResults } from '../clients/CalleeSearchClient';
import CalleesSkeleton from './CalleesSkeleton';
import CalleeSearchInput from './CalleeSearchInput';
import CalleeSelectMessage from './CalleeSelectMessage';

var SearchableCalleeList = /*#__PURE__*/function (_PureComponent) {
  _inherits(SearchableCalleeList, _PureComponent);

  function SearchableCalleeList() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, SearchableCalleeList);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(SearchableCalleeList)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      searchText: '',
      searchStatus: UNINITIALIZED,
      searchResults: OrderedMap()
    };
    _this.getCallableObjects = memoizeLast(function (calleesData, searchResults, searchStatus) {
      if (searchStatus === SUCCEEDED) {
        return searchResults;
      }

      return getCallableObjects(calleesData);
    });
    _this.getHasMoreCallees = memoizeLast(function (calleesData) {
      return getHasMoreCallees(calleesData);
    });
    _this.getFromObjectInfo = memoizeLast(function (calleesData) {
      var fromObject = getFromObject(calleesData);
      var objectTypeId = getObjectTypeId(fromObject);
      var objectId = getObjectId(fromObject);
      return {
        objectTypeId: objectTypeId,
        objectId: objectId
      };
    });

    _this.createSearchResultsList = function (data) {
      var associatedObjectPage = getIn(['callableObjectAndAssociations', 'associatedObjectsPage'], data) || [];
      return associatedObjectPage.reduce(function (orderedMap, page) {
        var associatedObjectType = new AssociatedObjectType(page);
        var associatedObjects = getAssociatedObjects(associatedObjectType);
        var associatedObjectsResults = getResults(associatedObjects);
        return orderedMap.merge(associatedObjectsResults);
      }, OrderedMap());
    };

    _this.handleSetSearchText = function (searchText) {
      _this.setState({
        searchText: searchText
      });
    };

    _this.handleClearSearch = function () {
      var onUpdateSearchResults = _this.props.onUpdateSearchResults;
      var searchResults = OrderedMap();

      _this.setState({
        searchText: '',
        searchStatus: UNINITIALIZED,
        searchResults: searchResults
      }, function () {
        onUpdateSearchResults({
          searchResults: searchResults
        });
      });
    };

    _this.handleRetrySearch = function () {
      _this.handleSearch({
        query: _this.state.searchText,
        timestamp: Date.now()
      });
    };

    _this.handleSearch = function (_ref) {
      var searchText = _ref.query,
          timestamp = _ref.timestamp;
      var _this$props = _this.props,
          calleesData = _this$props.calleesData,
          onUpdateSearchResults = _this$props.onUpdateSearchResults;

      var _this$getFromObjectIn = _this.getFromObjectInfo(calleesData),
          objectId = _this$getFromObjectIn.objectId,
          objectTypeId = _this$getFromObjectIn.objectTypeId;

      _this.setState({
        searchText: searchText,
        searchStatus: LOADING
      });

      fetchCalleeSearchResults({
        timestamp: timestamp,
        searchText: searchText,
        objectId: objectId,
        objectTypeId: objectTypeId
      }).then(function (result) {
        if (result.timestamp === timestamp) {
          if (result.response) {
            var searchResults = _this.createSearchResultsList(result.response);

            _this.setState({
              searchStatus: SUCCEEDED,
              searchResults: _this.createSearchResultsList(result.response)
            }, function () {
              return onUpdateSearchResults({
                searchResults: searchResults
              });
            });
          } else {
            var _searchResults = OrderedMap();

            _this.setState({
              searchStatus: FAILED,
              searchResults: _searchResults
            }, function () {
              return onUpdateSearchResults({
                searchResults: _searchResults
              });
            });
          }
        }
      });
    };

    return _this;
  }

  _createClass(SearchableCalleeList, [{
    key: "renderSearchPrompt",
    value: function renderSearchPrompt() {
      var hasMoreCallees = this.getHasMoreCallees(this.props.calleesData);
      if (!hasMoreCallees || this.state.searchText.length > 0) return null;
      return /*#__PURE__*/_jsx(CalleeSelectMessage, {
        className: "m-bottom-3 is--text--help",
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "calling-ui-library.callee-select.searchForContacts"
        })
      });
    }
  }, {
    key: "renderCalleeOptions",
    value: function renderCalleeOptions() {
      var _this$props2 = this.props,
          calleesData = _this$props2.calleesData,
          onSelectToNumber = _this$props2.onSelectToNumber,
          disabled = _this$props2.disabled,
          onAddPropertyClick = _this$props2.onAddPropertyClick,
          CallSettingsIcon = _this$props2.CallSettingsIcon,
          TourStepOne = _this$props2.TourStepOne,
          onEditProperty = _this$props2.onEditProperty,
          editPermissionsResults = _this$props2.editPermissionsResults,
          showSingleContactNames = _this$props2.showSingleContactNames;
      var _this$state = this.state,
          searchStatus = _this$state.searchStatus,
          searchResults = _this$state.searchResults,
          searchText = _this$state.searchText;
      var callableObjectList = calleesData && this.getCallableObjects(calleesData, searchResults, searchStatus);

      var _this$getFromObjectIn2 = this.getFromObjectInfo(calleesData),
          objectTypeId = _this$getFromObjectIn2.objectTypeId;

      var isSingleContact = isCallableObjectTypeId(objectTypeId) && callableObjectList.size === 1;
      var showCalleeNames = showSingleContactNames || !isSingleContact && !showSingleContactNames;

      if (searchStatus === LOADING) {
        return /*#__PURE__*/_jsx(CalleesSkeleton, {
          showCalleeNames: showCalleeNames
        });
      } else if (searchStatus === FAILED) {
        return /*#__PURE__*/_jsx(CalleeSelectMessage, {
          className: "is--text--error",
          message: /*#__PURE__*/_jsx(FormattedJSXMessage, {
            message: "calling-ui-library.callee-select.searchFailed_jsx",
            elements: {
              UILink: UILink
            },
            options: {
              onClick: this.handleRetrySearch
            }
          })
        });
      } else if (searchText.length > 0 && searchText.length < 3) {
        return /*#__PURE__*/_jsx(CalleeSelectMessage, {
          message: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "calling-ui-library.callee-select.minimumSearchCharacters"
          })
        });
      } else if (callableObjectList && callableObjectList.size === 0) {
        if (searchStatus === SUCCEEDED) {
          return /*#__PURE__*/_jsx(CalleeSelectMessage, {
            message: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "calling-ui-library.callee-select.noSearchResults"
            })
          });
        }

        return null;
      }

      return /*#__PURE__*/_jsx(CalleeOptions, {
        showCalleeNames: showCalleeNames,
        callableObjectList: callableObjectList,
        onSelectToNumber: onSelectToNumber,
        onEditProperty: onEditProperty,
        disabled: disabled,
        onAddPropertyClick: onAddPropertyClick,
        OptionIcon: CallSettingsIcon,
        TourStepOne: TourStepOne,
        canEdit: true,
        showAddPropertyButton: true,
        editPermissionsResults: editPermissionsResults
      });
    }
  }, {
    key: "render",
    value: function render() {
      var calleesData = this.props.calleesData;
      var searchText = this.state.searchText;
      var hasMoreCallees = this.getHasMoreCallees(calleesData);
      return /*#__PURE__*/_jsxs(_Fragment, {
        children: [hasMoreCallees ? /*#__PURE__*/_jsx(CalleeSearchInput, {
          onClear: this.handleClearSearch,
          onSearch: this.handleSearch,
          setSearchText: this.handleSetSearchText,
          searchText: searchText
        }) : null, this.renderCalleeOptions(), this.renderSearchPrompt()]
      });
    }
  }]);

  return SearchableCalleeList;
}(PureComponent);

SearchableCalleeList.propTypes = {
  calleesData: RecordPropType('CalleesRecord'),
  editPermissionsResults: ImmutablePropTypes.map,
  onSelectToNumber: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  onAddPropertyClick: PropTypes.func.isRequired,
  onEditProperty: PropTypes.func,
  onUpdateSearchResults: PropTypes.func,
  CallSettingsIcon: PropTypes.object,
  TourStepOne: PropTypes.func,
  showSingleContactNames: PropTypes.bool
};
SearchableCalleeList.defaultProps = {
  onUpdateSearchResults: emptyFunction,
  CallSettingsIcon: null,
  TourStepOne: null,
  disabled: false,
  showSingleContactNames: true
};
export { SearchableCalleeList as default };