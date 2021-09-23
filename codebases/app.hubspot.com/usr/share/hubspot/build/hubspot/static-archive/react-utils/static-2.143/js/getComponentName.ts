export default function (Component) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Component';

  if (!Component) {
    return fallback;
  }

  return Component.displayName || Component.name || Component.type && (Component.type.displayName || Component.type.name) || fallback;
}