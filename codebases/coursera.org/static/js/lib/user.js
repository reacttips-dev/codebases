import clientSideUserJson from 'bundles/user-account/common/user';

/**
 * Get user information during client-side rendering.
 * In CSR, Edge injects a user JSON blob into Jade template,
 * which comes from a deprecated Django API.
 *
 * IMPORTANT: When making business logic changes, also mirror the changes to user.server.js, otherwise SSR will behave differently from CSR.
 */

export const get = () =>
  clientSideUserJson
    ? {
        ...clientSideUserJson,
        authenticated: !!clientSideUserJson.id,
        fullName: clientSideUserJson.full_name,
      }
    : {};

export const isAuthenticatedUser = () => get().authenticated;

export const isSuperuser = () => get().is_superuser || get().is_poweruser;

// We override is_superuser based on is_poweruser as a way to avoid
// changing SU-based logic but sometimes we need to know the original
// value, use is_superuser_strict for that
export const isSuperuserStrict = () => get().is_superuser_strict;

export const isPoweruser = () => get().is_poweruser;

export const getUserTimezone = () => get().timezone;

export const isCourserian = () => {
  const email = get().email_address;
  if (!email) {
    return false;
  }
  const emailDomain = email.split('@')[1];
  return emailDomain === 'coursera.org';
};

export default {
  get,
  isAuthenticatedUser,
  isSuperuser,
  isSuperuserStrict,
  isPoweruser,
  getUserTimezone,
  isCourserian,
};
