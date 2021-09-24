'use es6';

import { Reference } from '../Reference';
import { SearchResults } from '../SearchResults';
import always from '../lib/always';
export var formatToReference = function formatToReference(_ref) {
  var getId = _ref.getId,
      getLabel = _ref.getLabel,
      getAdditionalProperties = _ref.getAdditionalProperties,
      _ref$getIcon = _ref.getIcon,
      getIcon = _ref$getIcon === void 0 ? always(undefined) : _ref$getIcon,
      _ref$getDescription = _ref.getDescription,
      getDescription = _ref$getDescription === void 0 ? always(undefined) : _ref$getDescription,
      _ref$getDisabled = _ref.getDisabled,
      getDisabled = _ref$getDisabled === void 0 ? always(undefined) : _ref$getDisabled,
      _ref$getArchived = _ref.getArchived,
      getArchived = _ref$getArchived === void 0 ? always(undefined) : _ref$getArchived;
  return function (item) {
    return Reference({
      id: String(getId(item)),
      label: getLabel(item),
      icon: getIcon(item),
      description: getDescription(item),
      disabled: getDisabled(item),
      archived: getArchived(item),
      additionalProperties: getAdditionalProperties(item)
    });
  };
};
export var formatToSearchQuery = function formatToSearchQuery(_ref2) {
  var query = _ref2.query,
      count = _ref2.count,
      offset = _ref2.offset;
  return {
    q: query,
    limit: count,
    offset: offset
  };
};
export var formatToSearchResults = function formatToSearchResults(_ref3) {
  var getReferences = _ref3.getReferences,
      getHasMore = _ref3.getHasMore,
      getOffset = _ref3.getOffset;
  return function (response) {
    return SearchResults({
      references: getReferences(response),
      hasMore: getHasMore(response),
      offset: getOffset(response)
    });
  };
};