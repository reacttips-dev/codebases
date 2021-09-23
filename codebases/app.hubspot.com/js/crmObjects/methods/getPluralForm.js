'use es6';

import I18n from 'I18n';
export var getPluralForm = function getPluralForm(_ref) {
  var objectTypeId = _ref.objectTypeId,
      metaTypeId = _ref.metaTypeId,
      pluralForm = _ref.pluralForm;
  var pluralKey = "index.objectTypeNames." + objectTypeId + ".plural";
  var isDefault = metaTypeId === 0;
  var shouldTranslate = isDefault && I18n.lookup(pluralKey);
  return shouldTranslate ? I18n.text(pluralKey) : pluralForm;
};