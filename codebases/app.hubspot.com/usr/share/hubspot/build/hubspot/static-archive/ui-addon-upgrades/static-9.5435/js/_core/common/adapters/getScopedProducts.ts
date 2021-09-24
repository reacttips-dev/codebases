var _getHasScope = function _getHasScope(user, scope) {
  return user.scopes.indexOf(scope) !== -1;
};

var getUserScopes = function getUserScopes(portal, user) {
  var portalScopes = [];

  if (_getHasScope(user, 'salesaccelerator-access')) {
    portalScopes.push('Sales-Pro');
  } else if (_getHasScope(user, 'crm-access')) {
    portalScopes.push('Sales-Free');
  }

  if (portal.product_type === 'basic') {
    portalScopes.push('Marketing-Basic');
  } else if (portal.product_type === 'pro') {
    portalScopes.push('Marketing-Pro');
  } else if (portal.product_type === 'enterprise') {
    portalScopes.push('Marketing-Enterprise');
  }

  return portalScopes;
};

export default getUserScopes;