//  ███████╗██╗  ██╗██████╗  █████╗ ███╗   ██╗██████╗
//  ██╔════╝╚██╗██╔╝██╔══██╗██╔══██╗████╗  ██║██╔══██╗
//  █████╗   ╚███╔╝ ██████╔╝███████║██╔██╗ ██║██║  ██║
//  ██╔══╝   ██╔██╗ ██╔═══╝ ██╔══██║██║╚██╗██║██║  ██║
//  ███████╗██╔╝ ██╗██║     ██║  ██║██║ ╚████║██████╔╝
//  ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝
//
//   ██████╗██████╗ ██╗████████╗███████╗██████╗ ██╗ █████╗
//  ██╔════╝██╔══██╗██║╚══██╔══╝██╔════╝██╔══██╗██║██╔══██╗
//  ██║     ██████╔╝██║   ██║   █████╗  ██████╔╝██║███████║
//  ██║     ██╔══██╗██║   ██║   ██╔══╝  ██╔══██╗██║██╔══██║
//  ╚██████╗██║  ██║██║   ██║   ███████╗██║  ██║██║██║  ██║
//   ╚═════╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
//
// When using native joins, the criteria values in the WHERE clause of a
// statement MUST be prepended with the name of the table that contains the
// attribute. Otherwise the query will return an error along the lines of:
//
// column reference "id" is ambiguous
//
// To prevent that, the WHERE criteria is recursively parsed and any column names
// are pre-pendend with the given table name. So for example the following query
// will be converted to something that would be rendered like so:
//
// Model.find({ name: 'foo' })
// .populate('children')
// .exec()
//
// Model.find({ 'model.name': 'foo' })
// .populate('children')
// .exec()
//

var _ = require('@sailshq/lodash');

module.exports = function expandCriteria(originalCriteria, tableName) {
  // The following are the reserved keys in the criteria language:
  var RESERVED = [
    '>',
    '>=',
    '<',
    '<=',
    'in',
    'or',
    'and',
    'not',
    'like',
    '!=',
    'nin'
  ];


  //  ╔═╗╔═╗╦═╗╔═╗╔═╗  ┌─┐┬ ┬┌┐┌┌─┐┌┬┐┬┌─┐┌┐┌
  //  ╠═╝╠═╣╠╦╝╚═╗║╣   ├┤ │ │││││   │ ││ ││││
  //  ╩  ╩ ╩╩╚═╚═╝╚═╝  └  └─┘┘└┘└─┘ ┴ ┴└─┘┘└┘
  // Can be called recursively
  var parseCriteria = function parseCriteria(criteria) {
    // If the values are an array, go through each one and parse
    if (_.isArray(criteria)) {
      _.each(criteria, function parseArray(item) {
        parseCriteria(item);
      });

      return;
    }

    // If the values are a dictionary, loop through the keys and parse them
    if (_.isPlainObject(criteria)) {
      _.each(criteria, function parseKeys(val, key) {
        // Check if the key is a reserved word. If not, expand the value and add
        // the tableName.
        if (_.indexOf(RESERVED, key) < 0) {
          criteria[tableName + '.' + key] = val;
          delete criteria[key];
        }

        // Check if there is any recursion that needs to take place
        if (_.isArray(val) || _.isPlainObject(val)) {
          parseCriteria(val);
        }
      });

      return;
    }
  };


  // Kick off the recursive parsing
  parseCriteria(originalCriteria);

  // Return the modified criteria
  return originalCriteria;
};
