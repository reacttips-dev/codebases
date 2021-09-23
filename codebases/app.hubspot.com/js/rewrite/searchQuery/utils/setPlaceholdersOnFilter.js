'use es6';

export var setPlaceholdersOnFilter = function setPlaceholdersOnFilter(filter, placeholders) {
  if (filter.has('value')) {
    return filter.update('value', function (value) {
      return placeholders[value] || value;
    });
  } else if (filter.has('values')) {
    return filter.update('values', function (values) {
      return values.map(function (value) {
        return placeholders[value] || value;
      });
    });
  }

  return filter;
};