'use es6';

import { List, Map as ImmutableMap, OrderedSet } from 'immutable';
import CreatorPropertiesStore from 'crm_data/properties/CreatorPropertiesStore';
import PropertiesStore from 'crm_data/properties/PropertiesStore';
import SettingsStore from 'crm_data/settings/SettingsStore';
import { GDPR_COMPLIANCE_ENABLED } from 'crm_data/constants/PortalSettingsKeys';
import { CONTACT, DEAL } from 'customer-data-objects/constants/ObjectTypes';
import { getPropertiesToFilter } from 'BizOpsCrmUIComponents/utils/BETDealUtils';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import memoize from 'transmute/memoize';
import ScopesContainer from '../../setup-object-embed/containers/ScopesContainer';

var isTrue = function isTrue(val) {
  return val === true || val === 'true';
};

var _getRequiredProperties = memoize(function () {
  var creatorProperties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
  var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableMap();
  var blacklist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : OrderedSet();
  var whitelist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : OrderedSet();

  var getIsRequired = function getIsRequired(propertyObject) {
    return propertyObject.get('required');
  };

  var getPropertyName = function getPropertyName(propertyObject) {
    return propertyObject.get('property');
  };

  var getIsKnown = function getIsKnown(propertyObject) {
    return properties.has(getPropertyName(propertyObject));
  };

  var getIsNotReadOnlyValue = function getIsNotReadOnlyValue(propertyName) {
    return properties.getIn([propertyName, 'readOnlyValue']) === false;
  };

  return creatorProperties.filter(getIsKnown).filter(getIsRequired).map(getPropertyName).toOrderedSet().filter(getIsNotReadOnlyValue).subtract(blacklist).union(whitelist).toList();
});

var RequiredPropsDependency = {
  stores: [CreatorPropertiesStore, PropertiesStore, SettingsStore],
  propTypes: {
    additionalRequiredProperties: ImmutablePropTypes.listOf(PropTypes.string.isRequired),
    objectType: PropTypes.string.isRequired,
    propertyDefaults: ImmutablePropTypes.map,
    dealProperties: ImmutablePropTypes.map,
    state: PropTypes.shape({
      dealProperties: ImmutablePropTypes.map
    })
  },
  deref: function deref(_ref) {
    var _ref$additionalRequir = _ref.additionalRequiredProperties,
        additionalRequiredProperties = _ref$additionalRequir === void 0 ? List() : _ref$additionalRequir,
        dealProperties = _ref.dealProperties,
        objectType = _ref.objectType,
        propertyDefaults = _ref.propertyDefaults;
    var creatorProperties = CreatorPropertiesStore.get(objectType);
    var properties = PropertiesStore.get(objectType);
    var isGdprComplianceEnabled = SettingsStore.get() && isTrue(SettingsStore.get().get(GDPR_COMPLIANCE_ENABLED));
    var gdprEnabledRequiredProperties = isGdprComplianceEnabled && objectType === CONTACT ? OrderedSet(['hs_legal_basis']) : OrderedSet();
    var betDealPropertyNameBlacklist = objectType === DEAL && dealProperties && getPropertiesToFilter(ScopesContainer.get(), dealProperties, propertyDefaults) || [];

    if (!properties || !creatorProperties) {
      return null;
    }

    return _getRequiredProperties(creatorProperties, properties, OrderedSet(betDealPropertyNameBlacklist), OrderedSet(additionalRequiredProperties).union(gdprEnabledRequiredProperties));
  }
};
RequiredPropsDependency._getRequiredProperties = _getRequiredProperties;
export default RequiredPropsDependency;