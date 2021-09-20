/**
 * Validates the entered username and returns an error message for invalid usernames
 */
export function isUsernameInvalid (publicHandle) {
  if (!publicHandle || !publicHandle.length) {
    return 'Empty username is not allowed.';
  }

  if (publicHandle.length < 3 || publicHandle.length > 64) {
    return 'The username must be 3 to 64 characters long.';
  }

  // Alphanumerics and hyphens allowed. No hyphens allowed in the beginning
  if (publicHandle && !publicHandle.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*$/)) {
    return 'The username can only contain alphanumeric characters and hyphens. However, it can’t start with a hyphen.';
  }

  return null;
}

/**
 * Validates the entered domain name for a team
 */
export function isDomainNameValid (publicHandle) {
  // length of alphanumeric characters should be 6 to 64 and starts with a letter
  return !!(publicHandle && publicHandle.match(/^[a-zA-Z]([a-zA-Z0-9-]){6,64}$/));
}
