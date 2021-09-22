/* globals coursera */
import type { UserData } from 'js/lib/user';

let userObject: UserData | {} | undefined;

// TODO: type global coursera
// @ts-ignore
if (typeof coursera === 'object') {
  // TODO: type global coursera
  // @ts-ignore
  const userData = coursera.user as UserData;
  // We override is_superuser based on is_poweruser as a way to avoid
  // changing SU-based logic but sometimes we need to know the original
  // value, use is_superuser_strict for that
  userData.is_superuser_strict = userData.is_superuser;
  userData.is_superuser = userData.is_superuser || userData.is_poweruser;

  userObject = userData;
} else {
  // In the nodejs context coursera doesn't exist since it's injected
  // into the DOM on the client.
  userObject = {};
}

const userExport = userObject;

export default userExport;
