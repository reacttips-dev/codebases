'use es6';

import always from 'transmute/always';
import curry from 'transmute/curry';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import { fromJS, List } from 'immutable';
export var formatToReferencesList = curry(function (_ref, items) {
  var getId = _ref.getId,
      getLabel = _ref.getLabel,
      _ref$getIcon = _ref.getIcon,
      getIcon = _ref$getIcon === void 0 ? always(undefined) : _ref$getIcon,
      _ref$getDescription = _ref.getDescription,
      getDescription = _ref$getDescription === void 0 ? always(undefined) : _ref$getDescription,
      _ref$getDisabled = _ref.getDisabled,
      getDisabled = _ref$getDisabled === void 0 ? always(undefined) : _ref$getDisabled,
      _ref$getArchived = _ref.getArchived,
      getArchived = _ref$getArchived === void 0 ? always(undefined) : _ref$getArchived;
  return List(items.map(function (value) {
    return new ReferenceRecord({
      id: String(getId(value)),
      label: getLabel(value),
      icon: getIcon(value),
      description: getDescription(value),
      referencedObject: fromJS(value),
      disabled: getDisabled(value),
      archived: getArchived(value)
    });
  }));
});