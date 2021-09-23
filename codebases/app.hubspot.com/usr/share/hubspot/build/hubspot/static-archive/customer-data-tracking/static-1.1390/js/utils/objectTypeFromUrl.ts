export var objectTypeFromUrl = function objectTypeFromUrl() {
  var w = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  var screen = 'unknown';
  var location = w && w.location;

  if (location) {
    var _ref = location || {},
        search = _ref.search,
        pathname = _ref.pathname;

    var objectTypeFromPath = /\d+\/([a-z]+)/g;
    var objectTypeFromQuery = /objectType=([A-Z]+)/g;

    if (search && search.includes('objectType=')) {
      var result = objectTypeFromQuery.exec(search);
      screen = result && result[1] || '';
    } else if (pathname) {
      var _result = objectTypeFromPath.exec(pathname);

      screen = _result && _result[1] || '';
    }

    screen = ("" + (screen || pathname)).toLowerCase();
  }

  return screen;
};