/**
 * This module contains all helpers for creating a filtered dexie collections
 * from a waterline query.
 */

var _ = require('lodash'),

/**
 * JS filter functions for modifiers.
 *
 * @note: Not every modifier in waterline query language are supported.
 * Some of the unsupported modifiers are ['contains', 'startsWith', 'endsWith']
 *
 * @type {Object}
 * @constant
 *
 * @private
 */
andFilterModifiers = {
  '<': function (modifierValue, key) {
    return function (row) {
      return row[key] < modifierValue;
    };
  },

  '<=': function (modifierValue, key) {
    return function (row) {
      return row[key] <= modifierValue;
    };
  },

  '>': function (modifierValue, key) {
    return function (row) {
      return row[key] > modifierValue;
    };
  },

  '>=': function (modifierValue, key) {
    return function (row) {
      return row[key] >= modifierValue;
    };
  },

  '!=': function (modifierValue, key) {
    return function (row) {
      return row[key] !== modifierValue;
    };
  },

  'in': function (modifierValue, key) {
    return function (row) {
      return modifierValue.includes(row[key]);
    };
  },

  'nin': function (modifierValue, key) {
    return function (row) {
      return !modifierValue.includes(row[key]);
    };
  }
},

/**
 * Applies modifiers on where clauses. If an equivalent modifier does not exist, falls back to a JS filter.
 *
 * @note: Not every modifier in waterline query language are supported.
 * Some of the unsupported modifiers are ['contains', 'startsWith', 'endsWith']
 *
 * @type {Object}
 * @constant
 *
 * @private
 */
whereClauseModifiers = {
  '<': function (collection, whereClause, modifierValue) {
    return whereClause.below(modifierValue);
  },

  '<=': function (collection, whereClause, modifierValue) {
    return whereClause.belowOrEqual(modifierValue);
  },

  '>': function (collection, whereClause, modifierValue) {
    return whereClause.above(modifierValue);
  },

  '>=': function (collection, whereClause, modifierValue) {
    return whereClause.aboveOrEqual(modifierValue);
  },

  '!=': function (collection, whereClause, modifierValue, key) {
    return collection.filter(function (row) {
      return row[key] !== modifierValue;
    });
  },

  'in': function (collection, whereClause, modifierValue) {
    return whereClause.anyOf(modifierValue);
  },

  'nin': function (collection, whereClause, modifierValue) {
    return whereClause.noneOf(modifierValue);
  }
};

/**
* Applies a query as dexie filter on dexie where clause.
* http://dexie.org/docs/WhereClause/WhereClause
*
* @private
*
* @param {String} field the field to filter
* @param {*} fieldQuery the filter value, this might be an object if it contains a modifier
* @param {Object} dexieCollection dexie collection to apply on
* @param {Object} dexieWhereClause dexie where clause to use
*
* @returns {Object} a filtered dexie collection
*/
function applyFilterAsWhereClause (field, fieldQuery, dexieCollection, dexieWhereClause) {
var filteredCollection = dexieCollection;

// this means the fieldQuery is not a primitive value and has a modifier
// like `{ in: ['x', 'y'] }`
if (_.isPlainObject(fieldQuery)) {

  // for each modifiers
  _.forEach(fieldQuery, function (modifierValue, modifier) {

    // if a handler exists, apply the modifier
    if (whereClauseModifiers[modifier]) {
      filteredCollection = whereClauseModifiers[modifier](dexieCollection, dexieWhereClause, modifierValue, field);
    }
    else {
      throw new Error('waterline-indexeddb: Could not create query.'
        + ` Unsupported modifier "${modifier}" for "${field}"`);
    }
  });
}

// otherwise the fieldQuery needs to be checked for equality
else {
  filteredCollection = dexieWhereClause.equals(fieldQuery);
}

return filteredCollection;
}

/**
* Applies the modifier as a JS filter function.
* http://dexie.org/docs/Collection/Collection.and()
*
* @private
*
* @param {String} field the field name
* @param {*} fieldQuery the value to filter by, may contain modifier
* @param {Object} dexieCollection the dexie collection to filter by
*
* @returns {Object} a filtered dexie collection
*/
function applyFilterAsJSFilter (field, fieldQuery, dexieCollection) {
var filteredCollection = dexieCollection;

// this means the fieldQuery is not a primitive value and has a modifier
// like `{ key: { in: ['x', 'y'] } }`
if (_.isPlainObject(fieldQuery)) {

  // for each modifier
  _.forEach(fieldQuery, function (modifierValue, modifier) {
    var modifierFunction;

    // add a JS filter function, if exists
    if (andFilterModifiers[modifier]) {
      modifierFunction = andFilterModifiers[modifier](modifierValue, field);
      filteredCollection = dexieCollection.and(modifierFunction);
    }
    else {
      throw new Error('waterline-indexeddb: Could not create query.'
        + ` Unsupported modifier "${modifier}" for "${field}"`);
    }
  });
}

// otherwise add an equality filter
else {
  filteredCollection = dexieCollection.and(function (row) {
    return row[field] === fieldQuery;
  });
}

return filteredCollection;
}

/**
* Apply a filter on a dexie collection.
*
* @private
*
* @param {Object} table dexie table
* @param {?Object} collection dexie collection
* @param {String} accumulateType type of filter accumulation, `and` or `or`
* @param {Object} query a single query object
*
* @returns {Object} a filtered dexie collection
*/
function applyFilter (table, collection, accumulateType, query) {
var dexieCollection = collection;

// a query object looks like `{ [key]: { in: ['foo', 'bar'] } }`
_.forEach(query, function (value, key) {

  // if there is no filter applied on the table yet, we apply a filter on the table directly
  // http://dexie.org/docs/Table/Table.where()
  if (!dexieCollection) {
      dexieCollection = applyFilterAsWhereClause(key, value, table, table.where(key));
  }

  // if a filter has been applied already, we accumulate filters for `or` condition
  // http://dexie.org/docs/Collection/Collection.or()
  else if (accumulateType === 'or') {
    dexieCollection = applyFilterAsWhereClause(key, value, dexieCollection, dexieCollection.or(key));
  }

  // if we need to extend additional filters on a collection
  // we need to add JS based filter functions
  // http://dexie.org/docs/Collection/Collection.and()
  else if (accumulateType === 'and') {
    dexieCollection = applyFilterAsJSFilter(key, value, dexieCollection);
  }
});

return dexieCollection;
}

/**
* Returns a collection filtered by the waterline query.
*
* @param {Object} query a waterline query
* @param {Object} db dexie instance
*
* @returns {Object} a dexie collection
*/
function dexieCollectionForQuery (query, db) {
if (!db) {
  return;
}

var dexieTable = db[query.using],
    dexieCollection,
    andQuery = query.criteria.where.and,
    orQuery = query.criteria.where.or;

// if both `and` & `or` sections are absent then it means `where` is single query field
// we convert that into an `and` query with just one item, it works the same way for us
if (!(andQuery || orQuery)) {
  andQuery = [query.criteria.where];
}

// for each field in the query, apply the query
// accumulate all the filters on the same dexie collection
dexieCollection = _.reduce(andQuery, function (acc, queryField) {
  return applyFilter(dexieTable, acc, 'and', queryField);
}, dexieCollection);

dexieCollection = _.reduce(orQuery, function (acc, queryField) {
  return applyFilter(dexieTable, acc, 'or', queryField);
}, dexieCollection);

// fallback to unfiltered table if no matches
return dexieCollection || dexieTable;
}

module.exports = {
dexieCollectionForQuery: dexieCollectionForQuery
};
