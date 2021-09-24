'use es6';

import CompaniesStore from 'crm_data/companies/CompaniesStore';
import ContactsStore from 'crm_data/contacts/ContactsStore';
import DealsStore from 'crm_data/deals/DealsStore';
import EngagementsStore from 'crm_data/engagements/EngagementsStore';
import TeamOwnerStore from 'crm_data/teams/TeamOwnerStore';
import ScopesContainer from '../../../containers/ScopesContainer';
import GridUIStore from '../../flux/grid/GridUIStore';
import ViewsStore from '../../flux/views/ViewsStore';
import { canBulkEdit } from '../../utils/SubjectPermissions';
import { betIsBulkEditAllRestricted } from '../../BET/permissions/BETBulkActionPermissions';
import { COMPANY, CONTACT, DEAL, TASK } from 'customer-data-objects/constants/ObjectTypes';
import { EDIT_ALL } from 'customer-data-objects/constants/PermissionTypes';
import { objectTypeToPermissionsScope } from 'crm_data/permissions/canEdit';
export var addCanBulkEditAll = function addCanBulkEditAll(record) {
  var selectionCount = record.get('selectionCount');
  var objectType = record.get('objectType');
  var checked = record.get('checked');
  var allSelected = record.get('allSelected');
  var totalSelected = checked.size;
  var editAllScope = objectTypeToPermissionsScope(objectType, EDIT_ALL);

  if (betIsBulkEditAllRestricted(allSelected, objectType)) {
    return record.set('canBulkEditAll', false);
  }

  if (!ScopesContainer.get()['crm-access']) {
    return record.set('canBulkEditAll', true);
  }

  if (ScopesContainer.get()[editAllScope]) {
    return record.set('canBulkEditAll', true);
  }

  if (allSelected) {
    var numEditable = record.numEditable === undefined ? GridUIStore.get('numberEditable') : record.numEditable;
    return record.set('canBulkEditAll', numEditable === selectionCount);
  } else if (checked) {
    if ([CONTACT, COMPANY, DEAL, TASK].indexOf(objectType) > -1 && totalSelected) {
      var store = function () {
        switch (objectType) {
          case COMPANY:
            return CompaniesStore;

          case CONTACT:
            return ContactsStore;

          case DEAL:
            return DealsStore;

          case TASK:
            return EngagementsStore;

          default:
            return undefined;
        }
      }();

      if (store) {
        var teams = TeamOwnerStore.get();

        if (!teams) {
          return record.set('canBulkEditAll', false);
        }

        return record.set('canBulkEditAll', canBulkEdit(totalSelected, store, teams, checked, objectType));
      }
    }
  }

  return record.set('canBulkEditAll', true);
};
var canBulkEditAllDependency = {
  stores: [GridUIStore, CompaniesStore, ContactsStore, DealsStore, TeamOwnerStore, ViewsStore],
  deref: function deref(__) {
    return addCanBulkEditAll;
  }
};
export var getCanBulkEditAllDependency = {
  stores: [GridUIStore, CompaniesStore, ContactsStore, DealsStore, TeamOwnerStore, ViewsStore],
  deref: function deref(_ref) {
    var bulkActionProps = _ref.bulkActionProps;
    return addCanBulkEditAll(bulkActionProps);
  }
};
export default canBulkEditAllDependency;