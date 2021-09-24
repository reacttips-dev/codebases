'use es6';

import I18n from 'I18n';
export var getSingularForm = function getSingularForm(_ref) {
  var objectTypeId = _ref.objectTypeId,
      metaTypeId = _ref.metaTypeId,
      singularForm = _ref.singularForm,
      name = _ref.name;
  var singularKey = "index.objectTypeNames." + objectTypeId + ".singular";
  var isDefault = metaTypeId === 0;
  var shouldTranslate = isDefault && I18n.lookup(singularKey);
  return shouldTranslate ? I18n.text(singularKey) : singularForm || name;
};