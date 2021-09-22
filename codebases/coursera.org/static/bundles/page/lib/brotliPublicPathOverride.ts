// If the window.publicPathOverride has been set by a brotli html template, then update the public path that webpack uses to load new chunks
// @ts-expect-error ts-migrate(2339) FIXME: Property 'publicPathOverride' does not exist on ty... Remove this comment to see the full error message
if (window.publicPathOverride) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'publicPathOverride' does not exist on ty... Remove this comment to see the full error message
  // eslint-disable-next-line
  __webpack_public_path__ = window.publicPathOverride;
}
