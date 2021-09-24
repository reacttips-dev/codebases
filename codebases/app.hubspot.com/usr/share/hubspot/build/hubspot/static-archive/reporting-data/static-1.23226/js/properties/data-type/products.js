'use es6';

import getInboundDbPropertyGroups from '../../retrieve/inboundDb/common/properties';
import { PRODUCTS } from '../../constants/dataTypes';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import countProperty from '../partial/count-property';
import productsModule from '../../dataTypeDefinitions/inboundDb/products';
import overridePropertyTypes from '../../retrieve/inboundDb/common/overridePropertyTypes';
export var getPropertyGroups = function getPropertyGroups() {
  return getInboundDbPropertyGroups(PRODUCTS);
};
export var getProperties = function getProperties() {
  return createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
    return properties.merge(countProperty(PRODUCTS));
  })().then(overridePropertyTypes(productsModule.getInboundSpec()));
};