'use es6';

import getRemoteProperties from '../../retrieve/inboundDb/common/properties';
import { LINE_ITEMS } from '../../constants/dataTypes';
import prefix from '../../lib/prefix';
import { mergeProperties } from '../mergeProperties';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import countProperty from '../partial/count-property';
import lineItemsModule from '../../dataTypeDefinitions/inboundDb/line-items';
import overridePropertyTypes from '../../retrieve/inboundDb/common/overridePropertyTypes';
import { PRODUCT } from 'reference-resolvers/constants/ReferenceObjectTypes';
var translate = prefix('reporting-data.properties.line-items');
export var getPropertyGroups = function getPropertyGroups() {
  return getRemoteProperties(LINE_ITEMS).then(function (remoteProps) {
    return mergeProperties(remoteProps, 'lineiteminformation', {
      hs_product_id: {
        label: translate('lineItem'),
        externalOptions: true,
        referencedObjectType: PRODUCT,
        type: 'enumeration',
        reportingOverwrittenNumericType: true
      }
    });
  });
};
export var getProperties = function getProperties() {
  return createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
    return properties.merge(countProperty(LINE_ITEMS));
  })().then(overridePropertyTypes(lineItemsModule.getInboundSpec()));
};