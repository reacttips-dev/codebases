export var isJitaUser = function isJitaUser(ownerId, auth) {
  return Boolean(ownerId === -1 && auth.user && auth.user.email && auth.user.email.indexOf('@hubspot') > -1);
};