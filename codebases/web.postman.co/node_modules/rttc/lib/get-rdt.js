/**
 * Module dependencies
 */

// N/A


/**
 * getRdt()
 *
 * Get the formal RDT ("RTTC display type") of the provided type schema.
 *
 * @param  {Ref} typeSchema
 *         The type schema to parse.
 *         (Note that this should already be verified as a valid type schema.)
 *
 * @returns {String}
 *          The formal RDT ("RTTC display type" or "RDT-formatted type") of
 *          the specified type schema.
 */

module.exports = function getRdt(typeSchema) {

  // If the type schema is a simple recognized string, then it's
  // already a valid RDT-- so just return it.  Otherwise, it should
  // always be dictionary or array, so parse that and return accordingly.
  if (
    typeSchema === 'string' ||
    typeSchema === 'number' ||
    typeSchema === 'boolean' ||
    typeSchema === 'lamda' || //(sic)
    typeSchema === 'json' ||
    typeSchema === 'ref'
  ) {
    return typeSchema;
  } else if (!!typeSchema && typeof typeSchema === 'object') {
    return Array.isArray(typeSchema)? 'array' : 'dictionary';
  } else {
    throw new Error('Could not parse unrecognized type schema: `'+typeSchema+'`');
  }

};
