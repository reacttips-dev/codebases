'use es6';

import CrmObjectTypeStore from 'crm_data/crmObjectTypes/CrmObjectTypeStore';
import translateObjectTypeName from 'customer-data-objects/record/translateObjectTypeName';
export default {
  stores: [CrmObjectTypeStore],
  deref: function deref(props) {
    var objectType = props.objectType,
        _props$isCapitalized = props.isCapitalized,
        isCapitalized = _props$isCapitalized === void 0 ? false : _props$isCapitalized,
        _props$isPlural = props.isPlural,
        isPlural = _props$isPlural === void 0 ? false : _props$isPlural;
    var objectTypeDefinition = CrmObjectTypeStore.get(objectType);
    return translateObjectTypeName({
      isCapitalized: isCapitalized,
      isPlural: isPlural,
      objectTypeDefinition: objectTypeDefinition,
      objectType: objectType
    });
  }
};