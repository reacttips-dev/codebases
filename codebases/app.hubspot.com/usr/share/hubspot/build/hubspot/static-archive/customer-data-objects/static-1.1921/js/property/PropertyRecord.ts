import { List, Record, Seq } from 'immutable';
import { FORMATTED } from './NumberDisplayHint';
import { TEXT } from './PropertyFieldTypes';
import { STRING } from './PropertyTypes';
import PropertyOptionRecord from './PropertyOptionRecord';
var PropertyRecord = Record({
  calculated: false,
  createdAt: null,
  createdUserId: null,
  currencyPropertyName: null,
  defaultValue: undefined,
  deleted: false,
  description: '',
  displayMode: 'current_value',
  displayOrder: 0,
  expression: null,
  externalOptions: false,
  favorited: false,
  favoritedOrder: 0,
  fieldType: TEXT,
  filterName: '',
  formField: true,
  groupName: null,
  hasUniqueValue: false,
  hidden: false,
  hubspotDefined: false,
  isBidenProperty: false,
  isCustomizedDefault: false,
  label: '',
  mutableDefinitionNotDeletable: true,
  name: '',
  numberDisplayHint: FORMATTED,
  objectType: undefined,
  objectTypeId: undefined,
  options: List(),
  optionsAreMutable: false,
  optionSortStrategy: null,
  placeholder: '',
  prospectType: null,
  readOnlyDefinition: false,
  readOnlyValue: false,
  referencedObjectType: null,
  searchable: true,
  searchableInGlobalSearch: false,
  showCurrencySymbol: false,
  sortable: true,
  textDisplayHint: undefined,
  type: STRING,
  updatedAt: null,
  updatedUserId: null
}, 'PropertyRecord');

PropertyRecord.fromJS = function (json) {
  if (!json || typeof json !== 'object') {
    return json;
  }

  var property = PropertyRecord(json);
  var options = Seq(property.options || List()).map(PropertyOptionRecord.fromJS).toList();
  var normalizedProperty = property.set('options', options);
  return normalizedProperty;
};

PropertyRecord.savableFields = ['description', 'externalOptions', 'fieldType', 'formField', 'groupName', 'hasUniqueValue', 'label', 'name', 'numberDisplayHint', 'options', 'optionSortStrategy', 'referencedObjectType', 'searchableInGlobalSearch', 'showCurrencySymbol', 'type'];
export default PropertyRecord;