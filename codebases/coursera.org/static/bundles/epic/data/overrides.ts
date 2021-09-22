/* global coursera */
let overrides;
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'coursera'.
if (typeof coursera === 'object') {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'coursera'.
  overrides = coursera.epicOverrides;
} else {
  overrides = {};
}
export default overrides;
