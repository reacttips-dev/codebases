'use es6';

import { Iterable } from 'immutable';
import PropTypes from 'prop-types';
import TypedRecord from './TypedRecord';
import isInstanceOf from 'transmute/isInstanceOf';
import get from 'transmute/get';
import map from 'transmute/map';
import pipe from 'transmute/pipe';
import toJS from 'transmute/toJS';
import every from 'transmute/every';
import both from 'transmute/both';
import ImmutablePropTypes from 'react-immutable-proptypes';
import invariant from 'react-utils/invariant';
var ReferenceRecord = TypedRecord({
  id: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]).isRequired,
  label: {
    type: PropTypes.string.isRequired,
    default: ''
  },
  description: PropTypes.string,
  icon: ImmutablePropTypes.contains({
    type: PropTypes.oneOf(['image']).isRequired,
    src: PropTypes.string.isRequired
  }),
  disabled: PropTypes.bool,
  referencedObject: PropTypes.any,
  archived: PropTypes.bool
}, 'ReferenceRecord');
/**
 * Returns `true` if `reference` is a ReferenceRecord.
 *
 * @param {any} reference
 * @return {boolean}
 */

ReferenceRecord.isReferenceRecord = isInstanceOf(ReferenceRecord);
/**
 * Returns `true` if `iterable` is a Immutable.Iterable of ReferenceRecords
 *
 * @param  {any} iterable
 * @return {boolean}
 */

ReferenceRecord.isReferenceIterable = both(isInstanceOf(Iterable), every(ReferenceRecord.isReferenceRecord));
/**
 * Throws if `reference` is not a ReferenceRecord.
 *
 * @param  {any} reference
 * @param  {?string} key       optional context key for the error
 * @return {ReferenceRecord}
 */

ReferenceRecord.enforceReferenceRecord = function (reference, key) {
  invariant(ReferenceRecord.isReferenceRecord(reference), 'expected `%s` to be a ReferenceRecord but got `%s`', key === undefined ? 'reference' : "references[" + key + "]", reference);
  return reference;
};
/**
 * Throws if `references` contains anything that isn't a ReferenceRecord.
 *
 * @param  {any} references
 * @return {Iterable<ReferenceRecord>}
 */


ReferenceRecord.enforceReferenceIterable = function (references) {
  invariant(ReferenceRecord.isReferenceIterable(references), 'expected `references` to be an Immutable.Iterable of ReferenceRecords but got `%s`', references);
  return references;
};
/**
 * Converts a ReferenceRecord to a UISelect compatible option.
 *
 * @param  {ReferenceRecord} reference
 * @return {{label: string, help?: string, value: string}}
 */


ReferenceRecord.toOption = function (reference) {
  if (!reference) {
    return reference;
  }

  var id = reference.id,
      label = reference.label,
      description = reference.description,
      icon = reference.icon,
      disabled = reference.disabled,
      archived = reference.archived;
  var option = {
    text: label || id,
    value: id
  };

  if (description) {
    option.help = description;
  }

  if (icon) {
    option.imageUrl = get('src', icon);
  }

  if (disabled) {
    option.disabled = !!disabled;
  }

  if (archived !== undefined) {
    option.archived = !!archived;
  }

  return option;
};
/**
 * Converts an Iterable, or Array of ReferenceRecords to an Array of UISelect
 * compatible options.
 *
 * @param {Array<ReferenceRecord>|Iterable<ReferenceRecord>} references
 * @return {Array<Object>}
 */


ReferenceRecord.toOptionsArray = pipe(map(ReferenceRecord.toOption), toJS);
export default ReferenceRecord;