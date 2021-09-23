'use es6';

import { fromJS, Map as ImmutableMap, List } from 'immutable';
import * as http from '../request/http';
import { summarize } from '../dataset/summarize';

var getTeamGroupings = function getTeamGroupings() {
  return http.get('app-users/v1/teams');
};

var findById = function findById(bucket, id) {
  var andDelete = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!bucket.dimension) {
    return false;
  }

  if (bucket.key === String(id)) {
    return bucket;
  }

  var child = bucket.dimension.buckets.reduce(function (found, node) {
    return found || findById(node, id, andDelete);
  }, null);

  if (child && andDelete) {
    var cloneChild = Object.assign({}, child);
    bucket.dimension.buckets = bucket.dimension.buckets.filter(function (node) {
      return node.key !== String(id);
    });
    return cloneChild;
  }

  return child;
};

var createIfNotFound = function createIfNotFound(node, id, bucket) {
  var andAttach = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (!node) {
    node = {
      dimension: {
        buckets: []
      },
      key: String(id)
    };

    if (andAttach) {
      bucket.dimension.buckets.unshift(node);
    }
  }

  return node;
};

var connectParentToChild = function connectParentToChild(parent, child) {
  parent.dimension.buckets.unshift(child);
};

var groupTeamsByLevel = function groupTeamsByLevel(data, teams) {
  var dataObject = data.toJS();
  teams.forEach(function (team) {
    var parentId = team.get('parentTeamId');

    if (parentId) {
      var parent = createIfNotFound(findById(dataObject, parentId), parentId, dataObject, true);
      delete parent.metrics;
      var child = createIfNotFound(findById(dataObject, team.get('id'), true), team.get('id'), dataObject);
      child.keyLabel = team.get('name');
      connectParentToChild(parent, child);
    }
  });
  return fromJS(dataObject);
};

var sort = function sort(config, bucket) {
  if (!bucket.has('dimension')) {
    return bucket;
  }

  return bucket.updateIn(['dimension', 'buckets'], function (buckets) {
    return buckets.map(function (subbucket) {
      return sort(config, subbucket);
    }).sort(function (b1, b2) {
      var _config$getIn$toJS = config.getIn(['sort', 0]).toJS(),
          property = _config$getIn$toJS.property,
          order = _config$getIn$toJS.order;

      var getVal = function getVal(b) {
        return b.getIn(['metrics', property], ImmutableMap()).first();
      };

      var diff = getVal(b1) - getVal(b2);
      return order === 'DESC' ? diff * -1 : diff;
    });
  });
};

var filter = function filter(bucket) {
  return bucket.updateIn(['dimension', 'buckets'], List(), function (buckets) {
    return buckets.filterNot(function (subbucket) {
      return subbucket.get('metrics').isEmpty();
    }).map(filter);
  });
};

export default (function (_ref) {
  var dataset = _ref.dataset,
      dataConfig = _ref.dataConfig;
  return getTeamGroupings().then(function (teams) {
    return filter(sort(dataConfig, summarize(groupTeamsByLevel(dataset, teams))));
  });
});