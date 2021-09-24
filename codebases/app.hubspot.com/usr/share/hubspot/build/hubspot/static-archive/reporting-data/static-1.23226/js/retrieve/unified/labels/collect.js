'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import formatName from 'I18n/utils/formatName';
import { Promise } from '../../../lib/promise';
import * as depth from '../depth';
import { get as getMetadata } from './metadata';

var formatNamesFromResponse = function formatNamesFromResponse(_ref) {
  var _ref$people = _ref.people,
      people = _ref$people === void 0 ? [] : _ref$people;
  return people.reduce(function (references, _ref2) {
    var vid = _ref2.vid,
        firstName = _ref2.firstname,
        lastName = _ref2.lastname,
        email = _ref2.email;
    return Object.assign({}, references, _defineProperty({}, vid, formatName({
      firstName: firstName,
      lastName: lastName,
      email: email
    })));
  }, {});
};

var formatDealsFromResponse = function formatDealsFromResponse(_ref3) {
  var _ref3$hydratedDeals = _ref3.hydratedDeals,
      hydratedDeals = _ref3$hydratedDeals === void 0 ? [] : _ref3$hydratedDeals;
  return hydratedDeals.reduce(function (refs, _ref4) {
    var dealId = _ref4.dealId,
        dealName = _ref4.dealName;
    return Object.assign({}, refs, _defineProperty({}, dealId, dealName));
  }, {});
};

export var fetchMetadataValues = function fetchMetadataValues(spec, config) {
  return function (property) {
    return getMetadata(spec, config).then(function (response) {
      return Object.keys(response).reduce(function (references, breakdown) {
        return Object.assign({}, references, _defineProperty({}, breakdown, response[breakdown][property]));
      }, {});
    });
  };
};

var getReferencesFromMetadata = function getReferencesFromMetadata(_ref5) {
  var spec = _ref5.spec,
      config = _ref5.config,
      data = _ref5.data,
      primary = _ref5.primary,
      metadataProperty = _ref5.metadataProperty;
  var _data$response = data.response;
  _data$response = _data$response === void 0 ? {} : _data$response;
  var _data$response$breakd = _data$response.breakdowns,
      breakdowns = _data$response$breakd === void 0 ? [] : _data$response$breakd;

  if (primary === 'sessionDate') {
    return fetchMetadataValues(spec, config)(metadataProperty);
  } // totals reports already have metadata in response


  return breakdowns.filter(function (breakdown) {
    return breakdown.metadata && breakdown.metadata[metadataProperty] !== undefined;
  }).reduce(function (refs, _ref6) {
    var breakdown = _ref6.breakdown,
        _ref6$metadata = _ref6.metadata,
        meta = _ref6$metadata === void 0 ? {} : _ref6$metadata;
    return Object.assign({}, refs, _defineProperty({}, breakdown, meta[metadataProperty]));
  }, {});
};

var getReferencesFromModule = function getReferencesFromModule(_ref7) {
  var breakdowns = _ref7.breakdowns,
      spec = _ref7.spec,
      config = _ref7.config,
      ids = _ref7.ids,
      module = _ref7.module;
  var reference = module.getIn(['references', breakdowns]);

  if (reference && typeof reference === 'function') {
    var getter = reference(spec, config);
    return getter(ids || []);
  }

  return {};
};

var getReferences = function getReferences(_ref8) {
  var spec = _ref8.spec,
      config = _ref8.config,
      module = _ref8.module,
      data = _ref8.data;

  var _config$dimensions = _slicedToArray(config.dimensions, 1),
      primary = _config$dimensions[0];

  var response = data.response,
      _data$matrix = data.matrix;
  _data$matrix = _data$matrix === void 0 ? {} : _data$matrix;
  var _data$matrix$keys = _data$matrix.keys,
      keys = _data$matrix$keys === void 0 ? [] : _data$matrix$keys;

  var _depth$get = depth.get(spec, config),
      dimensionality = _depth$get.dimensionality,
      _depth$get$drilldown = _depth$get.drilldown;

  _depth$get$drilldown = _depth$get$drilldown === void 0 ? {} : _depth$get$drilldown;
  var metadataProperty = _depth$get$drilldown.metadata,
      breakdowns = _depth$get$drilldown.breakdowns;
  var index = dimensionality - 1;
  var ids = keys[index] || [];
  var isMetadataReport = spec.metadata && spec.metadata[primary];
  var isSummaryReport = dimensionality === 1 && primary === 'sessionDate';

  if (isMetadataReport || isSummaryReport || dimensionality === 0) {
    return {};
  }

  if (primary === 'people') {
    return formatNamesFromResponse(response);
  }

  if (primary === 'deals-influenced') {
    return formatDealsFromResponse(response);
  }

  if (metadataProperty) {
    return Promise.resolve(getReferencesFromMetadata({
      spec: spec,
      config: config,
      data: data,
      metadataProperty: metadataProperty,
      primary: primary,
      dimensionality: dimensionality
    })).then(function (references) {
      var missingIds = ids.filter(function (id) {
        return !references.hasOwnProperty(id);
      });

      if (missingIds.length > 0) {
        return Promise.resolve(getReferencesFromModule({
          breakdowns: breakdowns,
          spec: spec,
          config: config,
          data: data,
          ids: missingIds,
          module: module
        })).then(function (missingReferences) {
          return Object.assign({}, references, {}, missingReferences);
        });
      }

      return references;
    });
  }

  return getReferencesFromModule({
    breakdowns: breakdowns,
    spec: spec,
    config: config,
    data: data,
    ids: ids,
    module: module
  });
};

export var get = function get(spec, config, module) {
  return function (data) {
    return Promise.resolve(getReferences({
      spec: spec,
      config: config,
      module: module,
      data: data
    })).then(function (references) {
      return Object.assign({}, data, {
        references: references
      });
    });
  };
};