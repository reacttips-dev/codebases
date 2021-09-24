'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";

var _storeByObjectType;

import PropTypes from 'prop-types';
import { useState } from 'react';
import I18n from 'I18n';
import memoize from 'transmute/memoize';
import { CONTACT, COMPANY, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import ContactsStore from 'crm_data/contacts/ContactsStore';
import CompaniesStore from 'crm_data/companies/CompaniesStore';
import DealsStore from 'crm_data/deals/DealsStore';
import TicketsStore from 'crm_data/tickets/TicketsStore';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import makeAsyncSelect from './makeAsyncSelect';
import makeElasticSearchSelectDependency from 'crm_data/elasticSearch/dependencies/makeElasticSearchSelectDependency';
import emptyFunction from 'react-utils/emptyFunction';

var _getSelectComponent = memoize(function (elasticSearchSelectDependency) {
  return makeAsyncSelect(elasticSearchSelectDependency);
});

var storeByObjectType = (_storeByObjectType = {}, _defineProperty(_storeByObjectType, COMPANY, CompaniesStore), _defineProperty(_storeByObjectType, CONTACT, ContactsStore), _defineProperty(_storeByObjectType, DEAL, DealsStore), _defineProperty(_storeByObjectType, TICKET, TicketsStore), _storeByObjectType);

var _getObjectTypeDependency = memoize(function (objectType) {
  return makeElasticSearchSelectDependency(storeByObjectType[objectType]);
});

var getSelectComponent = memoize(function (storeDependency, objectType) {
  if (!storeDependency) {
    return _getSelectComponent(_getObjectTypeDependency(objectType));
  }

  return _getSelectComponent(storeDependency);
});
var propTypes = {
  menuWidth: PropTypes.string,
  objectType: ObjectTypesType.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onCancelSearch: PropTypes.func,
  placeholder: PropTypes.string,
  storeDependency: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

function AssociationSelectSearch(_ref) {
  var objectType = _ref.objectType,
      _ref$onBlur = _ref.onBlur,
      onBlur = _ref$onBlur === void 0 ? emptyFunction : _ref$onBlur,
      placeholder = _ref.placeholder,
      storeDependency = _ref.storeDependency,
      rest = _objectWithoutProperties(_ref, ["objectType", "onBlur", "placeholder", "storeDependency"]);

  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      searchText = _useState2[0],
      setSearchText = _useState2[1];

  if (!placeholder) {
    var type = I18n.text("genericTypes." + objectType);
    placeholder = I18n.text('genericSelectPlaceholder.searchBy', {
      type: type
    });
  }

  var SelectComponent = getSelectComponent(storeDependency, objectType);
  return /*#__PURE__*/_jsx(SelectComponent, Object.assign({
    objectType: objectType,
    onBlur: onBlur,
    placeholder: placeholder,
    searchText: searchText,
    setSearchText: setSearchText
  }, rest));
}

AssociationSelectSearch.propTypes = propTypes;
export default AssociationSelectSearch;