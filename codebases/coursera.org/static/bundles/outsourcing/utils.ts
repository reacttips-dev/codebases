/**
 * NOTE: All outsourcing agents currently have a set subdomained email address but this might
 * not be guaranteed to be true in the future, so this should be revisited when this becomes a
 * problem.
 *
 * NOTE: INSECURE!!! Anyone can create a support.coursera.org or 24-7intouch.com account on our platform since we don't
 * require email verification. These utils should only be used as a first level of authentication (for example, if a
 * user should have access to try loading a page or should see a 404) - please make sure
 * that you gate all backend API's with proper outsource agent authorization.
 *
 * TODO: (@apandiyan) replicate functionality of membership-admin page (the main user of this util) inside our otherwise
 * internal tools. at that point we should be able to remove reliance on this hacky/insecure logic.
 *
 * @param {user} js/lib/user
 * @return {boolean} Is the user outsourcing
 */
export const isOutsourcing = (user: $TSFixMe) =>
  !!user
    .get()
    .email_address.match(/[a-zA-Z0-9._%+-@]+@(support.coursera.org|24-7intouch.com|guatemala.24-7intouch.com)/);

export const isEmailOutsourcing = (emailAddress: $TSFixMe) =>
  !!emailAddress.match(/[a-zA-Z0-9._%+-@]+@(support.coursera.org|24-7intouch.com|guatemala.24-7intouch.com)/);
