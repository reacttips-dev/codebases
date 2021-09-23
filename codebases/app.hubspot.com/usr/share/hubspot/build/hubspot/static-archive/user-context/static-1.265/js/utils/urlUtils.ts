export var getUrl = function getUrl(path, options) {
  var _ref = options || {},
      hubletOriginOverride = _ref.hubletOriginOverride;

  if (!hubletOriginOverride) {
    return path;
  }

  var originOverride = hubletOriginOverride.replace(/\/$/, '');
  return originOverride + "/" + path.replace(/^\//, '');
};