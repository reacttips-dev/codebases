'use es6';

export var SearchResults = function SearchResults(_ref) {
  var references = _ref.references,
      hasMore = _ref.hasMore,
      offset = _ref.offset;
  return {
    references: references,
    hasMore: hasMore,
    offset: offset
  };
};