'use es6';

import AssociationDefinitionStore from '../stores/AssociationDefinitionStore';
export var associationDefinitionsDep = {
  stores: [AssociationDefinitionStore],
  deref: function deref(objectTypeId) {
    return AssociationDefinitionStore.get(objectTypeId) || {};
  }
};