/**
 * Detects if the query criteria is dangerous. A dangerous criteria is an empty criteria
 * that matches every record in the table.
 *
 * This is a last resort validation to prevent actions touching unintentional records in a table.
 *
 * @param {Object} criteria
 */
export function isCriteriaDangerous (criteria) {
  let isDangerous = true;

  if (!criteria) {
    return isDangerous;
  }

  // if there is at least one non nil value in the criteria it is intentional
  _.forEach(criteria, (value) => {
    // should allow falsy boolean
    if (!(value === '') && !_.isNil(value)) {
      isDangerous = false;
      return false;
    }
  });

  return isDangerous;
}
