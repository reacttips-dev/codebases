'use es6';

import PropTypes from 'prop-types';
import identity from 'transmute/identity';
import { OrderedMap, List } from 'immutable';
import omit from 'transmute/omit';
import { LOADING } from 'crm_data/constants/LoadingStatus';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import PortalFavoritesStore from 'crm_data/properties/PortalFavoritesStore';
import PropertiesStore from 'crm_data/properties/PropertiesStore';
import ObjectCreatorFavoritesStore from '../properties/ObjectCreatorFavoritesStore';
import DefaultObjectProperties from 'customer-data-objects/constants/DefaultObjectProperties';
import CreatorPropertiesStore from 'crm_data/properties/CreatorPropertiesStore';
import isTrue from '../../utils/isTrue';
import SettingsStore from 'crm_data/settings/SettingsStore';
import { GDPR_COMPLIANCE_ENABLED } from 'crm_data/constants/PortalSettingsKeys';
import { CONTACT, DEAL } from 'customer-data-objects/constants/ObjectTypes';
import { getPropertiesToFilter } from 'BizOpsCrmUIComponents/utils/BETDealUtils';
import ScopesContainer from '../../../setup-object-embed/containers/ScopesContainer';
export default {
  propTypes: {
    objectType: ObjectTypesType,
    additionalProperties: PropTypes.instanceOf(List)
  },
  stores: [PortalFavoritesStore, PropertiesStore, ObjectCreatorFavoritesStore, CreatorPropertiesStore, SettingsStore],
  deref: function deref(_ref) {
    var objectType = _ref.objectType,
        propertyDefaults = _ref.propertyDefaults,
        _dealProperties = _ref.dealProperties,
        _ref$state = _ref.state,
        state = _ref$state === void 0 ? {} : _ref$state,
        _ref$additionalProper = _ref.additionalProperties,
        additionalProperties = _ref$additionalProper === void 0 ? List() : _ref$additionalProper,
        _ref$ignoreDefaultCre = _ref.ignoreDefaultCreatorProperties,
        ignoreDefaultCreatorProperties = _ref$ignoreDefaultCre === void 0 ? false : _ref$ignoreDefaultCre;
    var portalFavs = PortalFavoritesStore.get(objectType);
    var properties = PropertiesStore.get(objectType);
    var userFavs = ObjectCreatorFavoritesStore.get(objectType);
    var customProperties = CreatorPropertiesStore.get(objectType);
    var gdprEnabledDefaultProperties = List();
    var isGDPREnabled = SettingsStore.get() && isTrue(SettingsStore.get().get(GDPR_COMPLIANCE_ENABLED));
    var dealProperties = state.dealProperties || _dealProperties || undefined;

    if (!(portalFavs && properties && userFavs && customProperties)) {
      return LOADING;
    }

    if (isGDPREnabled && objectType === CONTACT) {
      gdprEnabledDefaultProperties = gdprEnabledDefaultProperties.push(properties.get('hs_legal_basis'));
    }

    if (ignoreDefaultCreatorProperties) {
      var requiredCreatorProperties = customProperties.filter(function (property) {
        return property.get('required');
      }).map(function (property) {
        return property.get('property');
      });
      return additionalProperties.concat(requiredCreatorProperties).map(function (additionalProperty) {
        return properties.get(additionalProperty);
      }).concat(gdprEnabledDefaultProperties).filter(identity).reduce(function (map, property) {
        return map.set(property.name, property);
      }, OrderedMap());
    }

    if (customProperties.size > 0) {
      var filteredProperties = customProperties.map(function (propertyObject) {
        return properties.get(propertyObject.get('property'));
      }).concat(additionalProperties.map(function (additionalProperty) {
        return properties.get(additionalProperty);
      })).concat(gdprEnabledDefaultProperties).filter(identity).reduce(function (map, property) {
        return map.set(property.name, property);
      }, OrderedMap());

      if (objectType === DEAL && dealProperties) {
        filteredProperties = omit(getPropertiesToFilter(ScopesContainer.get(), dealProperties, propertyDefaults), filteredProperties);
      }

      return filteredProperties;
    }

    var favoriteProperties = userFavs.valueSeq().concat(portalFavs).map(function (fav) {
      return fav.get('property');
    });
    return DefaultObjectProperties.get(objectType).keySeq().concat(favoriteProperties).concat(additionalProperties).toOrderedSet().map(function (property) {
      return properties.get(property);
    }).concat(gdprEnabledDefaultProperties).filter(identity).reduce(function (map, property) {
      return map.set(property.name, property);
    }, OrderedMap());
  }
};