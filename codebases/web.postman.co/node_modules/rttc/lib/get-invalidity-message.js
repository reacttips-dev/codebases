/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var getRdt = require('./get-rdt');
var getDisplayTypeLabel = require('./get-display-type-label');
var getNounPhrase = require('./get-noun-phrase');
var GRAMMAR = require('./GRAMMAR');
var inferDisplayType = require('./infer-display-type');
var coerceExemplar = require('./coerce-exemplar');


/**
 * getInvalidityMessage()
 *
 * Get a formatted message explaining exactly how some data was invalid vs. some type schema,
 * using the specified invalidity error from `rttc.validate()`/`rttc.validateStrict()` for
 * guidance.
 *
 * @param  {Ref} expectedTypeSchema
 * @param  {Ref} invalidData
 * @param  {Error} eInvalid             [« an E_INVALID Error from rttc.validate() etc.]
 * @param  {String?} optionalDataLabel
 *
 * @returns {String}
 */
module.exports = function getInvalidityMessage(expectedTypeSchema, invalidData, eInvalid, optionalDataLabel){

  var originNounPhrase = (function _gettingOriginNounPhrase(){
    if (!optionalDataLabel) {
      return 'data';//« formerly `getDisplayType(invalidData)`
    } else {
      var wasExpectingArray = _.isArray(expectedTypeSchema);
      var gotArray = _.isArray(invalidData);
      var wasExpectingDictionary = _.isObject(expectedTypeSchema) && !wasExpectingDictionary;
      var gotDictionary = _.isObject(invalidData) && !gotArray;

      if ((wasExpectingArray&&gotArray) || (wasExpectingArray&&gotDictionary)) {
        return optionalDataLabel+' '+getDisplayTypeLabel(expectedTypeSchema, GRAMMAR.FRAGMENT);
      } else {
        return String(optionalDataLabel);
      }
    }
  })();//:= (†)

  return 'Invalid '+originNounPhrase+':\n  · ' + (
    _.without(_.map(eInvalid.errors, function(subErr) {
      if (subErr.hops.length === 0) {
        var actualTopLvlType = inferDisplayType(coerceExemplar(subErr.actual));
        return (
          subErr.actual===undefined?
          'Expecting'
          :
          'Expecting'
        )+' '+getNounPhrase(subErr.expected, GRAMMAR.INDEFINITE)
        +(
          subErr.actual===undefined?
          '.'
          :
          ', but got '+(
            subErr.actual===Infinity||subErr.actual===-Infinity||_.isNaN(subErr.actual)?
            subErr.actual
            :
            actualTopLvlType==='json' || actualTopLvlType==='ref'?
            'some other '+getNounPhrase(actualTopLvlType, GRAMMAR.UNPRECEDED_FRAGMENT)
            :
            getNounPhrase(actualTopLvlType, GRAMMAR.INDEFINITE_FRAGMENT)
          )+'.'
        );
      }
      else {
        var parentHops = subErr.hops.slice(0, -1);
        var parentHopsHash = parentHops.join('.');
        var parentSubErr = _.find(eInvalid.errors, function(otherSubErr){
          return otherSubErr.hops.join('.') === parentHopsHash;
        });
        if (parentSubErr) { return ''; }

        var isArrayItem = !_.isNaN(+(subErr.hops.slice(-1)[0]));
        var expectedRdt = getRdt(subErr.expected);
        var actualType = inferDisplayType(coerceExemplar(subErr.actual));
        return (
          isArrayItem?
          '@ `'+_.reduce(parentHops, function(prettiedParentHops, hop){
            if (+hop===hop){
              prettiedParentHops += '['+hop+']';
            } else {
              prettiedParentHops += '.'+hop;
            }
            return prettiedParentHops;
          }, '')+'['+(subErr.hops.slice(-1))+']`:  '
          :
          '@ `' + subErr.hops.join('.') + '`:  '
        )+''+
        (
          subErr.actual===undefined?
          'Missing property (expecting '+getNounPhrase(expectedRdt, GRAMMAR.INDEFINITE)+')'
          :
          'Expecting '+(
            isArrayItem?
            'array to contain only '+getNounPhrase(expectedRdt, GRAMMAR.UNPRECEDED_PLURAL)
            :
            ''+getNounPhrase(expectedRdt, GRAMMAR.INDEFINITE)
          )
        )+''+
        (
          subErr.actual===undefined?
          '.'
          :
          ', but '+
          (isArrayItem?'this item is':'got')+' '+
          (
            subErr.actual===Infinity||subErr.actual===-Infinity||_.isNaN(subErr.actual)?
            subErr.actual
            :
            actualType==='json' || actualType==='ref'?
            'some other '+getNounPhrase(actualType,GRAMMAR.UNPRECEDED_FRAGMENT)
            :
            getNounPhrase(actualType,GRAMMAR.INDEFINITE_FRAGMENT)
          )+'.'
        );
      }
    }), '').join('\n  · ')
  );

};
