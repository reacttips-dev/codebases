export default function onLogOut(user) {
  if (typeof mParticle === 'undefined') {
    return;
  }

  const isLoggedIn = mParticle.Identity.getCurrentUser
    ? mParticle.Identity.getCurrentUser().isLoggedIn()
    : false;
  if (!isLoggedIn) {
    return;
  }

  const emptyIdentityRequest = {
    userIdentities: {},
  };
  mParticle.Identity.logout(emptyIdentityRequest);
}
