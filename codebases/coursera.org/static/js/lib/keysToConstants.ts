/**
 * Iterate passed array of strings and return object with keys-value pairs equal to that strings.
 * For example: `keysToConstants(['ONE', 'TWO'])` will return object:
 * ```
 * {
 *   ONE: 'ONE',
 *   TWO: 'TWO',
 * }
 * ```
 */
const keysToConstants = <T extends string>(keyNames: T[]): { [key in T]: key } =>
  keyNames.reduce((obj, str) => {
    obj[str] = str; // eslint-disable-line no-param-reassign
    return obj;
  }, {} as { [key in T]: key });

export default keysToConstants;
