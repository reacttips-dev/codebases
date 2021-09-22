export function generatePrototypeUrl (hash, id, name) {
  // careful adding more complicated filtering as prototype URLs can
  // can have names in Russian and other languages with special characters
  // see https://tools.ietf.org/html/rfc1738#section-3.3
  //  <quote> "/", ";", "?" are reserved </quote>
  // Also
  // % - browser & gateway will interpret as percent encoded char
  const uriName = name.replace(/(%[0-9A-Fa-f]{2}|[()/#;?% ])/g, '-')
  return `/overview/${uriName}-${hash || id}/screens`
}
