/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var typeInfo = require('./type-info');
var dehydrate = require('./dehydrate');
var union = require('./union');


/**
 * coerceExemplar()
 *
 * Convert a normal JavaScript value into the _most specific_ RTTC exemplar
 * which would accept it.... more or less.
 *
 * > --------------------------------------------------------------------------------
 * > WARNING: While this logic is OK at understanding functions, it's not really
 * > smart enough to figure out cases where it would need refs.  It dehydrates
 * > everything first, meaning it ensures everything is JSON compatible by ripping
 * > out circular references and replacing replacing streams, buffers, and
 * > RttcRefPlaceholder instances with `null`. It also rips out `undefined` array
 * > items, and dictionary keys with `undefined` values (meaning that there are
 * > never any _nested_ `undefined`s by the time it gets around to building the
 * > exemplar.)  And finally, it converts all Dates, RegExps, and Error instances
 * > to strings.
 * > --------------------------------------------------------------------------------
 *
 * @param  {Anything} value
 *         A normal JavaScript value.
 *
 * @param  {Boolean} allowSpecialSyntax
 *         If set, string literals which look like special RTTC exemplar syntax (->, *, and ===)
 *         take on their traditional symbolism; meaning they will NOT be "exemplified"-- that is,
 *         replaced with other strings: ('an arrow symbol', 'a star symbol', and '3 equal signs').
 *         > WARNING: Use with care!  Remember other things need to be exemplified too!
 *         > (e.g. consider the `null` literal)
 *         @default false
 *
 * @param  {Boolean} treatTopLvlUndefinedAsRef
 *         If set, if the provided value is `undefined`, it will be treated as a ref.
 *         Note that this purely for backwards compatibility, since as of rttc@9.3.0,
 *         the `===` exemplar no longer accepts `undefined`; and its base value is now `null`.
 *         > The default value for this flag will be changed to `false` in a future release.
 *         @default true
 *
 * @param  {boolean} useStrict
 *         If set, the pattern exemplar for any multi-item arrays within the provided value will be
 *         determined by coercing and unioning the array items using strict validation rules (e.g.
 *         `32 ∪ 'foo' <=> '*'`).  Also do not squish Infinity/-Infinity/NaN.
 *         Otherwise, loose validation rules will be used instead (e.g. `32 ∪ 'foo' <=> 'foo`),
 *         and Infinity/-Infinity/NaN will be squished to 0.
 *         > The default value for this flag will be changed to `false` in a future release.
 *         @default true
 *
 * @returns {JSON}
 *          An RTTC exemplar.
 */
module.exports = function coerceExemplar (value, allowSpecialSyntax, treatTopLvlUndefinedAsRef, useStrict) {

  // Default `treatTopLvlUndefinedAsRef` to `true`.
  // (will be changed to false in a future release)
  if (_.isUndefined(treatTopLvlUndefinedAsRef)) { treatTopLvlUndefinedAsRef = true; }

  // Default `useStrict` to `true`.
  // (will be changed to false in a future release)
  if (_.isUndefined(useStrict)) { useStrict = true; }

  // If the provided value is `undefined` at the top level...
  if (_.isUndefined(value)) {
    // If `treatTopLvlUndefinedAsRef` is enabled,
    if (treatTopLvlUndefinedAsRef) {
      // then use `===` (note that this approach isn't quite 1-to-1 with reality,
      //  since `===` doesn't accept `undefined` values as of rttc@9.3.0.)
      return typeInfo('ref').getExemplar();
    }
    // Otherwise: treat it as if it were `null`, and use `*`.
    else { return typeInfo('json').getExemplar(); }
  }

  // Dehydrate the wanna-be exemplar to avoid circular recursion
  // (but allow null, and don't stringify functions, and --
  // if `useStrict` is enabled-- allow NaN/Infinity/-Infinity)
  value = dehydrate(value, true, true, !!useStrict);


  // Next, iterate over the value and coerce it into a valid rttc exemplar.
  return (function _recursivelyCoerceExemplar(valuePart){

    // `null` becomes '*'
    if (_.isNull(valuePart)) {
      return typeInfo('json').getExemplar();
    }
    // `Infinity`, `-Infinity`, and `NaN` SHOULD become '==='
    // (because they are not JSON-compatible, and not "number"s, by rttc's definition)
    // ...unless `useStrict` is disabled, in which case they should become `0`.
    if (valuePart === Infinity || valuePart === -Infinity || _.isNaN(valuePart)) {
      if (useStrict) {
        return typeInfo('ref').getExemplar();
      } else {
        return 0;
      }
    }
    // functions become '->'
    else if (_.isFunction(valuePart)) {
      return typeInfo('lamda').getExemplar();
    }
    // and strings which resemble potentially-ambiguous exemplars
    // become their own exemplar description instead (because all of
    // the exemplar descriptions are strings, which is what we want)
    else if (typeInfo('json').isExemplar(valuePart)) {
      return allowSpecialSyntax ? valuePart : typeInfo('json').getExemplarDescription();
    }
    else if (typeInfo('ref').isExemplar(valuePart)) {
      return allowSpecialSyntax ? valuePart : typeInfo('ref').getExemplarDescription();
    }
    else if (typeInfo('lamda').isExemplar(valuePart)) {
      return allowSpecialSyntax ? valuePart : typeInfo('lamda').getExemplarDescription();
    }
    // arrays need a recursive step
    else if (_.isArray(valuePart)) {
      // empty arrays (`[]`) just become generic JSON array exemplars (`[]` aka `['*']`):
      if (valuePart.length === 0) {
        // Note:
        // In a future version of RTTC, this will be modified to
        // return `['*']` instead of `[]`.
        return valuePart;
      }
      // NON-empty arrays (e.g. `[1,2,3]`) become pattern array exemplars (e.g. `[1]`):
      else {
        // To do this, we recursively call `rttc.coerceExemplar()` on each of the normal
        // items in the array, then `rttc.union()` them all together and use the resulting
        // exemplar as our deduced pattern.
        var pattern = _.reduce(valuePart.slice(1), function (patternSoFar, item) {
          patternSoFar = union(patternSoFar, _recursivelyCoerceExemplar(item), true, useStrict);
          // meaning of `rttc.union()` flags, in order:
          //  • `true` (yes these are exemplars)
          //  • `true` (yes, use strict validation rules to prevent confusion)
          return patternSoFar;
        }, _recursivelyCoerceExemplar(valuePart[0]));

        //--------------------------------------------------------------------------------
        // Note:
        // If the narrowest common schema for the pattern is "===" (ref), that means
        // that, as a whole, the exemplar is `['===']`.  That makes it effectively
        // heterogeneous, as well as indicating that its items are not necessarily
        // JSON-compatible, and that they may even be mutable references.
        //--------------------------------------------------------------------------------
        return [
          pattern
        ];
      }
    }
    // dictionaries need a recursive step too
    else if (_.isObject(valuePart)) {
      // Empty dictionaries (`{}`) just become generic dictionaries (`{}`),
      // and NON-EMPTY dictionaries (e.g. `{foo: ['bar','baz'] }`) become
      // faceted dictionary exemplars (`{foo:'bar'}`)
      return _.reduce(_.keys(valuePart), function (dictSoFar, key) {
        var subValue = valuePart[key];
        dictSoFar[key] = _recursivelyCoerceExemplar(subValue); // <= recursive step
        return dictSoFar;
      }, {});
    }
    // Finally, if none of the special cases above apply, this valuePart is already
    // good to go, so just return it.
    return valuePart;

  })(value);

};
