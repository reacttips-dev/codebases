var PropTypes = require('prop-types');

var UppyCore = require('@uppy/core').Uppy; // The `uppy` prop receives the Uppy core instance.


var uppy = PropTypes.instanceOf(UppyCore).isRequired; // A list of plugins to mount inside this component.

var plugins = PropTypes.arrayOf(PropTypes.string); // Language strings for this component.

var locale = PropTypes.shape({
  strings: PropTypes.object,
  pluralize: PropTypes.func
}); // List of meta fields for the editor in the Dashboard.

var metaField = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string
});
var metaFields = PropTypes.arrayOf(metaField); // A size in pixels (number) or with some other unit (string).

var cssSize = PropTypes.oneOfType([PropTypes.string, PropTypes.number]); // Common props for dashboardy components (Dashboard and DashboardModal).

var dashboard = {
  uppy: uppy,
  inline: PropTypes.bool,
  plugins: plugins,
  width: cssSize,
  height: cssSize,
  showProgressDetails: PropTypes.bool,
  hideUploadButton: PropTypes.bool,
  hideProgressAfterFinish: PropTypes.bool,
  note: PropTypes.string,
  metaFields: metaFields,
  proudlyDisplayPoweredByUppy: PropTypes.bool,
  disableStatusBar: PropTypes.bool,
  disableInformer: PropTypes.bool,
  disableThumbnailGenerator: PropTypes.bool,
  // pass-through to ThumbnailGenerator
  thumbnailWidth: PropTypes.number,
  locale: locale
};
module.exports = {
  uppy: uppy,
  locale: locale,
  dashboard: dashboard
};