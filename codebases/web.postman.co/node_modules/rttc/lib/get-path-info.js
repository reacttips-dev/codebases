/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var TYPES = require('./helpers/types');
var dehydrate = require('./dehydrate');


/**
 * Given an exemplar schema and a keypath, return information
 * about the specified segment.
 *
 * If the path is inside of a generic, then the exemplar is '*',
 * and this path is optional. If the path is inside of a `ref`,
 * then the exemplar is '===', and this path is optional.
 *
 *
 * @param  {*} schema      - an exemplar
 * @param  {String} path   - a valid dot-deliminited path, where empty string ('') is the root (e.g. "" or "foo" or "foo.bar" or "foo.0.bar.0.baz")
 *
 * @returns {Dictionary}
 *         @property {*} exemplar
 *         @property {Boolean} optional
 *
 * @throws E_MALFORMED_PATH
 *         If keypath is invalid for the provided schema
 *
 * @throws E_UNREACHABLE
 *         if keypath is unreachable (meaning it is not allowed in the schema)
 */
module.exports = function getPathInfo (schema, path) {

  // Dehydrate the schema to avoid circular recursion
  var dehydratedSchema = dehydrate(schema);

  // Derive an array of "hops" from the provided keypath.
  var hops = (path === '') ? [] : path.split('.');

  // These variables are used by the logic below.
  var currentExemplar = dehydratedSchema;
  // By default the path is not optional.
  var optional = false;


  _.each(hops, function dereferenceEach(hop){

    if (_.isArray(currentExemplar)) {
      if (!_.isFinite(+hop)) {
        // If the hop cannot be cast to a positive integer,
        // something funny is going on.
        throw (function (){
          var err = new Error('Malformed keypath: "'+path+'" (non-numeric hop `'+hop+'` is not a valid array index)');
          err.code = 'E_MALFORMED_PATH';
          return err;
        })();
      }

      // generic array
      // (same thing as `['*']`)
      if (_.isEqual(currentExemplar, [])) {
        optional = true;
        currentExemplar = TYPES.json.getExemplar();
      }
      // patterned array
      else {
        optional = false;
        if (_.isUndefined(currentExemplar[0])) {
          throw (function (){
            var err = new Error('Keypath: "'+path+'" is unreachable in schema');
            err.code = 'E_UNREACHABLE';
            return err;
          })();
        }
        else {
          currentExemplar = currentExemplar[0];
        }
      }
    }
    else if (_.isObject(currentExemplar)) {
      // generic dictionary
      if (_.isEqual(currentExemplar, {})) {
        optional = true;
        currentExemplar = TYPES.json.getExemplar();
      }
      // facted dictionary
      else {
        optional = false;
        if (_.isUndefined(currentExemplar[hop])) {
          throw (function (){
            var err = new Error('Keypath: "'+path+'" is unreachable in schema');
            err.code = 'E_UNREACHABLE';
            return err;
          })();
        }
        else {
          currentExemplar = currentExemplar[hop];
        }
      }
    }
    // generic json
    else if (TYPES.json.isExemplar(currentExemplar)) {
      optional = true;
      currentExemplar = TYPES.json.getExemplar();
    }

    // mutable reference
    else if (TYPES.ref.isExemplar(currentExemplar)) {
      optional = true;
      currentExemplar = TYPES.ref.getExemplar();
    }

    // lamda
    else if (TYPES.lamda.isExemplar(currentExemplar)) {
      throw (function (){
        var err = new Error('Keypath: "'+path+'" is unreachable in schema');
        err.code = 'E_UNREACHABLE';
        return err;
      })();
    }

    // primitive
    else {
      throw (function (){
        var err = new Error('Keypath: "'+path+'" is unreachable in schema');
        err.code = 'E_UNREACHABLE';
        return err;
      })();
    }
  });


  return {
    exemplar: currentExemplar,
    optional: optional
  };

};


