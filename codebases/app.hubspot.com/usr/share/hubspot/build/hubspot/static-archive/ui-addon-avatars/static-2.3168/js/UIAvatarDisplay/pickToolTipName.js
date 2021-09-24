'use es6';

export default function (lookupObj) {
  var avatarType = lookupObj.avatarType,
      displayName = lookupObj.displayName,
      domain = lookupObj.domain,
      email = lookupObj.email,
      lookup = lookupObj.lookup,
      primaryIdentifier = lookupObj.primaryIdentifier,
      secondaryIdentifier = lookupObj.secondaryIdentifier,
      src = lookupObj.src;
  var proxyLookup = lookup || {};
  var display = displayName || proxyLookup.displayName || email || proxyLookup.email || domain || proxyLookup.domain || typeof primaryIdentifier !== 'number' && primaryIdentifier || typeof proxyLookup.primaryIdentifier !== 'number' && proxyLookup.primaryIdentifier || secondaryIdentifier || proxyLookup.secondaryIdentifier || src || proxyLookup.src || avatarType && avatarType.toUpperCase() || undefined;
  return display;
}