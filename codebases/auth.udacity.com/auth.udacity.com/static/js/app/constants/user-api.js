// Requirement returned by User API authentication calls if the user has 2FA
// enabled.
export const ONE_TIME_PASSWORD_REQ = 'OTP';

// Requirement returned by User API if the user's birthdate needs to be
// gathered before they can be signed in.
export const BIRTHDATE_REQ = 'BIRTHDATE';

// Requirement returned by User API if the user must agree to new terms of use
export const TERMS_OF_USE_REQ = 'TERMSOFUSE';

// Requirement returned by User API if the user must rotate their weak password.
export const WEAK_PASSWORD_REQ = 'WEAKPASSWORD';