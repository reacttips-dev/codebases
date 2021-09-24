'use es6';

export var FormatterProvider = function FormatterProvider(_ref) {
  var formatReference = _ref.formatReference,
      formatSearchQuery = _ref.formatSearchQuery,
      formatSearchResponse = _ref.formatSearchResponse;
  return function (_ref2) {
    var all = _ref2.all,
        byId = _ref2.byId,
        search = _ref2.search;
    var api = {};

    if (all) {
      api.all = function () {
        return all().then(function (references) {
          return references.map(formatReference);
        });
      };
    }

    if (byId) {
      api.byId = function (id) {
        return byId(id).then(formatReference);
      };
    }

    if (search) {
      api.search = function (query) {
        return search(formatSearchQuery(query)).then(formatSearchResponse).then(function (results) {
          return Object.assign({}, results, {
            references: results.references.map(formatReference)
          });
        });
      };
    }

    return api;
  };
};