import { Record } from 'immutable';
var PropertyOptionRecord = Record({
  description: null,
  disabled: false,
  displayOrder: -1,
  doubleData: null,
  hidden: false,
  hubspotDefined: false,
  icon: null,
  label: '',
  readOnly: false,
  value: '',
  originalValue: ''
}, 'PropertyOptionRecord');

PropertyOptionRecord.fromJS = function (json) {
  if (!json || typeof json !== 'object') {
    return json;
  }

  return PropertyOptionRecord(Object.assign({}, json, {
    originalValue: json.value
  }));
};

export default PropertyOptionRecord;